import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  X,
  HelpCircle,
  Upload,
  Camera,
  Check,
  Info,
  ArrowRight,
  RefreshCw,
  SwitchCamera,
  Zap,
  ZapOff,
  Smartphone,
  AlertCircle,
  Maximize2
} from 'lucide-react';
import { LandmarkPoint, PostureAssessment, ViewAngle } from '../types';
import { SAMPLE_IMAGES } from '../data/mockData';

interface CaptureViewProps {
  onClose: () => void;
  onSaveAssessment: (assessmentData: Partial<PostureAssessment>) => void;
  initialMode?: ViewAngle;
}

export const CaptureView: React.FC<CaptureViewProps> = ({
  onClose,
  onSaveAssessment,
  initialMode = 'side',
}) => {
  const [viewMode, setViewMode] = useState<ViewAngle>(initialMode);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraLoading, setCameraLoading] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [torchOn, setTorchOn] = useState(false);
  const [torchSupported, setTorchSupported] = useState(false);
  const [cameraResolution, setCameraResolution] = useState<string>('');

  // Stored captured images for all 3 angles
  const [capturedImages, setCapturedImages] = useState<Record<ViewAngle, string>>({
    side: SAMPLE_IMAGES.side,
    front: SAMPLE_IMAGES.front,
    back: SAMPLE_IMAGES.back,
  });

  // Track which angles have been freshly captured
  const [capturedStatus, setCapturedStatus] = useState<Record<ViewAngle, boolean>>({
    side: false,
    front: false,
    back: false,
  });

  // Landmarks state for Side view
  const [tragus, setTragus] = useState<LandmarkPoint>({ x: 49, y: 15.5 });
  const [c7, setC7] = useState<LandmarkPoint>({ x: 53.5, y: 22.8 });
  const [shoulder, setShoulder] = useState<LandmarkPoint>({ x: 55, y: 27.5 });

  // Landmarks state for Front view
  const [leftShoulder, setLeftShoulder] = useState<LandmarkPoint>({ x: 42, y: 28 });
  const [rightShoulder, setRightShoulder] = useState<LandmarkPoint>({ x: 58, y: 29.5 });

  // Landmarks state for Back view
  const [leftScapula, setLeftScapula] = useState<LandmarkPoint>({ x: 44, y: 32 });
  const [rightScapula, setRightScapula] = useState<LandmarkPoint>({ x: 56, y: 33.2 });
  const [spineTop, setSpineTop] = useState<LandmarkPoint>({ x: 50, y: 22 });
  const [spineBottom, setSpineBottom] = useState<LandmarkPoint>({ x: 50, y: 65 });

  const [activeDrag, setActiveDrag] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const nativeCameraInputRef = useRef<HTMLInputElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Shutter sound generator via Web Audio API
  const playShutterSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.08);
    } catch {
      // AudioContext unavailable
    }
  };

  // Angle Calculations
  const calculateCVA = () => {
    const dx = c7.x - tragus.x;
    const dy = c7.y - tragus.y;
    const radians = Math.atan2(dy, Math.abs(dx) > 0.001 ? Math.abs(dx) : 0.001);
    const degrees = (radians * 180) / Math.PI;
    return Math.min(65, Math.max(30, Math.round(degrees * 0.85)));
  };

  const calculateShoulderTilt = () => {
    const dx = Math.abs(rightShoulder.x - leftShoulder.x);
    const dy = Math.abs(rightShoulder.y - leftShoulder.y);
    const radians = Math.atan2(dy, dx > 0.001 ? dx : 0.001);
    const degrees = (radians * 180) / Math.PI;
    return Number(degrees.toFixed(1));
  };

  const calculateScapularTilt = () => {
    const dx = Math.abs(rightScapula.x - leftScapula.x);
    const dy = Math.abs(rightScapula.y - leftScapula.y);
    const radians = Math.atan2(dy, dx > 0.001 ? dx : 0.001);
    const degrees = (radians * 180) / Math.PI;
    return Number(degrees.toFixed(1));
  };

  const cva = calculateCVA();
  const shoulderTilt = calculateShoulderTilt();
  const scapularTilt = calculateScapularTilt();

  // Stop current active media stream
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch (e) {
          console.warn('Error stopping track:', e);
        }
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
    setTorchOn(false);
    setTorchSupported(false);
  }, []);

  // Mobile WebRTC Camera API - Start Stream
  const startCamera = useCallback(
    async (targetFacingMode: 'environment' | 'user' = facingMode) => {
      setCameraLoading(true);
      setCameraError(null);
      stopCamera();

      // Mobile constraints: optimized for portrait, high definition, back/front camera
      const constraints: MediaStreamConstraints = {
        audio: false,
        video: {
          facingMode: { ideal: targetFacingMode },
          width: { ideal: 1920, min: 640 },
          height: { ideal: 1080, min: 480 },
        },
      };

      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error('อุปกรณ์หรือเบราว์เซอร์นี้ไม่รองรับ WebRTC Camera API');
        }

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          // Required for iOS Safari to play inside inline frame
          videoRef.current.setAttribute('playsinline', 'true');
          videoRef.current.setAttribute('webkit-playsinline', 'true');
          await videoRef.current.play();

          const videoTrack = stream.getVideoTracks()[0];
          if (videoTrack) {
            // Check torch/flashlight capability on mobile
            const capabilities: any = videoTrack.getCapabilities ? videoTrack.getCapabilities() : {};
            if (capabilities && capabilities.torch) {
              setTorchSupported(true);
            }

            const settings = videoTrack.getSettings ? videoTrack.getSettings() : null;
            if (settings && settings.width && settings.height) {
              setCameraResolution(`${settings.width}x${settings.height}`);
            }
          }

          setCameraActive(true);
          setFacingMode(targetFacingMode);
        }
      } catch (err: any) {
        console.warn('Mobile camera start error:', err);
        setCameraError(
          err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError'
            ? 'เบราว์เซอร์ยังไม่ได้รับอนุญาตให้เข้าถึงกล้อง โปรดกด "อนุญาต (Allow)" หรือกดปุ่ม "ถ่ายด้วยกล้องมือถือ HD" ด้านล่าง'
            : 'ไม่สามารถเปิดกล้องวิดีโอสดได้ คุณสามารถกดปุ่ม "ถ่ายด้วยกล้องมือถือ HD" เพื่อเปิดกล้องโทรศัพท์โดยตรง หรือเลือกภาพจากอัลบั้มได้'
        );
        setCameraActive(false);
      } finally {
        setCameraLoading(false);
      }
    },
    [facingMode, stopCamera]
  );

  // Auto-start camera when screen opens
  useEffect(() => {
    startCamera('environment');
    return () => {
      stopCamera();
    };
  }, []);

  // Flip Mobile Camera (Rear ⟷ Front)
  const handleToggleFacingMode = () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    startCamera(nextMode);
  };

  // Toggle Torch/Flashlight on mobile
  const handleToggleTorch = async () => {
    if (!streamRef.current || !torchSupported) return;
    try {
      const track = streamRef.current.getVideoTracks()[0];
      const newTorchState = !torchOn;
      await (track as any).applyConstraints({
        advanced: [{ torch: newTorchState }],
      });
      setTorchOn(newTorchState);
    } catch (err) {
      console.warn('Torch toggle error:', err);
    }
  };

  // Handle Native Mobile Camera Capture (capture="environment")
  const handleNativeCameraCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const dataUrl = event.target.result as string;
          playShutterSound();
          setCapturedImages((prev) => ({ ...prev, [viewMode]: dataUrl }));
          setCapturedStatus((prev) => ({ ...prev, [viewMode]: true }));
          stopCamera();

          // Auto-prompt next angle
          if (viewMode === 'side' && !capturedStatus.front) {
            setViewMode('front');
          } else if (viewMode === 'front' && !capturedStatus.back) {
            setViewMode('back');
          }
        }
      };
      reader.readAsDataURL(file);
      // Reset input value to allow taking repeated shots
      e.target.value = '';
    }
  };

  // Handle Shutter (Snap live WebRTC frame)
  const handleShutter = () => {
    playShutterSound();
    let finalImageUrl = capturedImages[viewMode];

    if (cameraActive && videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const width = video.videoWidth || 1080;
      const height = video.videoHeight || 1920;
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // If front camera, un-mirror horizontally on save for natural assessment
        if (facingMode === 'user') {
          ctx.translate(width, 0);
          ctx.scale(-1, 1);
        }
        ctx.drawImage(video, 0, 0, width, height);
        finalImageUrl = canvas.toDataURL('image/jpeg', 0.92);
      }
    }

    setCapturedImages((prev) => ({
      ...prev,
      [viewMode]: finalImageUrl,
    }));
    setCapturedStatus((prev) => ({
      ...prev,
      [viewMode]: true,
    }));

    // Auto-advance to next view angle
    if (viewMode === 'side' && !capturedStatus.front) {
      setViewMode('front');
    } else if (viewMode === 'front' && !capturedStatus.back) {
      setViewMode('back');
    }
  };

  // Complete and submit all 3 angles
  const handleFinishAllAssessments = () => {
    stopCamera();
    onSaveAssessment({
      week: 4,
      date: 'วันนี้',
      sideImageUrl: capturedImages.side,
      frontImageUrl: capturedImages.front,
      backImageUrl: capturedImages.back,
      cvaAngle: cva,
      shoulderC7Angle: 21,
      shoulderTiltDeg: shoulderTilt,
      scapularTiltDeg: scapularTilt,
      trunkAlignment: 'อยู่ในแนว',
      scapularSymmetry: scapularTilt <= 2 ? 'สมดุล (ระดับสะบักเท่ากัน)' : `สะบักต่างกัน ${scapularTilt}°`,
      spineAlignment: 'ตรงแนวปกติ (Plumb line กึ่งกลาง)',
      restPain: 2,
      workPain: 3,
      landmarksSide: {
        tragus,
        c7,
        shoulder,
        horizontalRef: { x: 75, y: c7.y },
      },
      landmarksFront: {
        leftShoulder,
        rightShoulder,
      },
      landmarksBack: {
        leftScapula,
        rightScapula,
        spineTop,
        spineBottom,
      },
    });
  };

  // Drag handles for landmark calibration
  const handlePointerDown = (pointKey: string) => {
    setActiveDrag(pointKey);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!activeDrag || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(5, Math.min(95, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(5, Math.min(95, ((e.clientY - rect.top) / rect.height) * 100));

    if (activeDrag === 'tragus') setTragus({ x, y });
    else if (activeDrag === 'c7') setC7({ x, y });
    else if (activeDrag === 'shoulder') setShoulder({ x, y });
    else if (activeDrag === 'leftShoulder') setLeftShoulder({ x, y });
    else if (activeDrag === 'rightShoulder') setRightShoulder({ x, y });
    else if (activeDrag === 'leftScapula') setLeftScapula({ x, y });
    else if (activeDrag === 'rightScapula') setRightScapula({ x, y });
    else if (activeDrag === 'spineTop') setSpineTop({ x, y });
    else if (activeDrag === 'spineBottom') setSpineBottom({ x, y });
  };

  const handlePointerUp = () => {
    setActiveDrag(null);
  };

  const getGuideTitle = () => {
    switch (viewMode) {
      case 'front':
        return 'จัดท่าด้านหน้า (Front View)';
      case 'side':
        return 'จัดท่าด้านข้าง (Side View)';
      case 'back':
        return 'จัดท่าด้านหลัง (Back View)';
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black flex flex-col justify-between select-none overflow-hidden touch-none"
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {/* Hidden Native Mobile Camera Trigger (HTML5 capture API) */}
      <input
        type="file"
        ref={nativeCameraInputRef}
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleNativeCameraCapture}
      />

      {/* Hidden Photo Gallery Input */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        className="hidden"
        onChange={handleNativeCameraCapture}
      />

      {/* Top Header Bar */}
      <div className="relative z-30 flex items-center justify-between px-3 py-2.5 bg-gradient-to-b from-black/90 to-transparent">
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30 backdrop-blur-md transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Camera Status & Angle Badge */}
        <div className="flex flex-col items-center">
          <div className="bg-black/70 backdrop-blur-md px-3 py-0.5 rounded-full border border-white/15 text-white text-xs font-semibold flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${
                cameraActive ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'
              }`}
            />
            <span>{getGuideTitle()}</span>
          </div>
          <span className="text-[10px] text-white/70 mt-0.5 font-mono">
            {cameraActive
              ? `กล้องมือถือ (${facingMode === 'environment' ? 'กล้องหลัง' : 'กล้องหน้า'})`
              : 'โหมดภาพนิ่ง'}
          </span>
        </div>

        {/* Top Controls: Torch & Help */}
        <div className="flex items-center gap-1.5">
          {torchSupported && cameraActive && (
            <button
              onClick={handleToggleTorch}
              className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-colors ${
                torchOn ? 'bg-amber-400 text-slate-900 shadow-lg' : 'bg-white/20 text-white'
              }`}
            >
              {torchOn ? <Zap className="w-4 h-4 fill-current" /> : <ZapOff className="w-4 h-4" />}
            </button>
          )}

          <button
            onClick={() => setShowGuideModal(true)}
            className="w-9 h-9 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30 backdrop-blur-md transition-colors"
          >
            <HelpCircle className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Viewfinder Box */}
      <div
        ref={containerRef}
        className="relative flex-1 w-full flex items-center justify-center overflow-hidden touch-none"
      >
        {/* Source Media: Live Video Stream or Still Photo */}
        {cameraActive ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
            style={{
              transform: facingMode === 'user' ? 'scaleX(-1)' : 'none',
            }}
          />
        ) : (
          <img
            src={capturedImages[viewMode]}
            alt={`${viewMode} view`}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        )}

        <canvas ref={canvasRef} className="hidden" />

        {/* Camera Permission / Error Banner Overlay */}
        {cameraError && !cameraActive && (
          <div className="absolute inset-x-4 top-4 z-40 bg-slate-900/90 border border-amber-500/50 backdrop-blur-md rounded-2xl p-3.5 text-white text-xs shadow-xl space-y-2">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <p className="text-[11px] leading-relaxed text-slate-200">{cameraError}</p>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => startCamera(facingMode)}
                className="flex-1 py-1.5 bg-sky-600 hover:bg-sky-500 rounded-lg text-white font-semibold text-xs transition-colors"
              >
                ลองเปิดกล้องอีกครั้ง
              </button>
              <button
                onClick={() => nativeCameraInputRef.current?.click()}
                className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>เปิดกล้องมือถือ</span>
              </button>
            </div>
          </div>
        )}

        {/* Visual Overlay: Plumb Line & Alignment Grids */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Vertical plumb line */}
          <div className="absolute top-0 bottom-0 left-1/2 w-0.5 border-l-2 border-dashed border-sky-400/90 -translate-x-1/2" />

          {/* Body Frame */}
          <div className="absolute inset-x-8 inset-y-12 border border-white/20 rounded-3xl pointer-events-none" />

          {/* SIDE VIEW OVERLAY */}
          {viewMode === 'side' && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <line
                x1={`${c7.x}%`}
                y1={`${c7.y}%`}
                x2={`${tragus.x}%`}
                y2={`${tragus.y}%`}
                stroke="#ef4444"
                strokeWidth="2.5"
                strokeDasharray="4 2"
              />
              <line
                x1={`${c7.x}%`}
                y1={`${c7.y}%`}
                x2={`${Math.min(90, c7.x + 22)}%`}
                y2={`${c7.y}%`}
                stroke="#10b981"
                strokeWidth="2"
              />
              <circle
                cx={`${c7.x}%`}
                cy={`${c7.y}%`}
                r="18"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="2"
                strokeDasharray="2 2"
              />
            </svg>
          )}

          {/* FRONT VIEW OVERLAY */}
          {viewMode === 'front' && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <line
                x1={`${leftShoulder.x}%`}
                y1={`${leftShoulder.y}%`}
                x2={`${rightShoulder.x}%`}
                y2={`${rightShoulder.y}%`}
                stroke="#ef4444"
                strokeWidth="2.5"
              />
              <line
                x1={`${leftShoulder.x - 5}%`}
                y1={`${leftShoulder.y}%`}
                x2={`${rightShoulder.x + 5}%`}
                y2={`${leftShoulder.y}%`}
                stroke="#38bdf8"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />
            </svg>
          )}

          {/* BACK VIEW OVERLAY */}
          {viewMode === 'back' && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <line
                x1={`${leftScapula.x}%`}
                y1={`${leftScapula.y}%`}
                x2={`${rightScapula.x}%`}
                y2={`${rightScapula.y}%`}
                stroke="#f59e0b"
                strokeWidth="2.5"
              />
              <line
                x1={`${leftScapula.x - 4}%`}
                y1={`${leftScapula.y}%`}
                x2={`${rightScapula.x + 4}%`}
                y2={`${leftScapula.y}%`}
                stroke="#38bdf8"
                strokeWidth="1.5"
                strokeDasharray="4 2"
              />
              <line
                x1={`${spineTop.x}%`}
                y1={`${spineTop.y}%`}
                x2={`${spineBottom.x}%`}
                y2={`${spineBottom.y}%`}
                stroke="#10b981"
                strokeWidth="2"
                strokeDasharray="3 2"
              />
            </svg>
          )}
        </div>

        {/* SIDE MARKERS */}
        {viewMode === 'side' && (
          <>
            <div
              onPointerDown={() => handlePointerDown('tragus')}
              style={{ left: `${tragus.x}%`, top: `${tragus.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-30 cursor-grab active:cursor-grabbing p-3 touch-none"
            >
              <div className="w-5 h-5 rounded-full bg-red-500 border-2 border-white shadow-lg animate-pulse" />
              <div className="absolute top-7 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[10px] px-1.5 py-0.5 rounded whitespace-nowrap shadow">
                ติ่งหู (Tragus)
              </div>
            </div>

            <div
              onPointerDown={() => handlePointerDown('c7')}
              style={{ left: `${c7.x}%`, top: `${c7.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-30 cursor-grab active:cursor-grabbing p-3 touch-none"
            >
              <div className="w-5 h-5 rounded-full bg-emerald-500 border-2 border-white shadow-lg" />
              <div className="absolute top-7 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[10px] px-1.5 py-0.5 rounded whitespace-nowrap shadow">
                C7
              </div>
            </div>

            <div
              style={{ left: `${Math.min(80, c7.x + 12)}%`, top: `${c7.y - 4}%` }}
              className="absolute z-20 -translate-y-1/2 bg-red-600/90 text-white px-2.5 py-1 rounded-lg text-xs font-bold shadow-lg border border-red-400 backdrop-blur-xs flex items-center gap-1 font-mono"
            >
              <span>CVA</span>
              <span className="text-sm">{cva}°</span>
            </div>
          </>
        )}

        {/* FRONT MARKERS */}
        {viewMode === 'front' && (
          <>
            <div
              onPointerDown={() => handlePointerDown('leftShoulder')}
              style={{ left: `${leftShoulder.x}%`, top: `${leftShoulder.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-30 cursor-grab active:cursor-grabbing p-3 touch-none"
            >
              <div className="w-5 h-5 rounded-full bg-sky-500 border-2 border-white shadow-lg" />
            </div>

            <div
              onPointerDown={() => handlePointerDown('rightShoulder')}
              style={{ left: `${rightShoulder.x}%`, top: `${rightShoulder.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-30 cursor-grab active:cursor-grabbing p-3 touch-none"
            >
              <div className="w-5 h-5 rounded-full bg-sky-500 border-2 border-white shadow-lg" />
            </div>

            <div
              style={{
                left: `${(leftShoulder.x + rightShoulder.x) / 2}%`,
                top: `${Math.min(leftShoulder.y, rightShoulder.y) - 6}%`,
              }}
              className="absolute z-20 -translate-x-1/2 bg-sky-600 text-white px-2.5 py-0.5 rounded text-xs font-bold shadow border border-sky-300 font-mono"
            >
              ระดับไหล่ต่างกัน {shoulderTilt}°
            </div>
          </>
        )}

        {/* BACK MARKERS */}
        {viewMode === 'back' && (
          <>
            <div
              onPointerDown={() => handlePointerDown('leftScapula')}
              style={{ left: `${leftScapula.x}%`, top: `${leftScapula.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-30 cursor-grab active:cursor-grabbing p-3 touch-none"
            >
              <div className="w-5 h-5 rounded-full bg-amber-500 border-2 border-white shadow-lg" />
              <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[9px] px-1 rounded whitespace-nowrap">
                สะบักซ้าย
              </div>
            </div>

            <div
              onPointerDown={() => handlePointerDown('rightScapula')}
              style={{ left: `${rightScapula.x}%`, top: `${rightScapula.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-30 cursor-grab active:cursor-grabbing p-3 touch-none"
            >
              <div className="w-5 h-5 rounded-full bg-amber-500 border-2 border-white shadow-lg" />
              <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[9px] px-1 rounded whitespace-nowrap">
                สะบักขวา
              </div>
            </div>

            <div
              style={{
                left: `${(leftScapula.x + rightScapula.x) / 2}%`,
                top: `${Math.min(leftScapula.y, rightScapula.y) - 6}%`,
              }}
              className="absolute z-20 -translate-x-1/2 bg-amber-600 text-white px-2.5 py-0.5 rounded text-xs font-bold shadow border border-amber-300 font-mono"
            >
              ระดับสะบักต่างกัน {scapularTilt}°
            </div>
          </>
        )}

        {/* Draggable hint */}
        <div className="absolute bottom-4 left-4 z-20 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded text-[10px] text-white/90 border border-white/10 flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-sky-400" />
          <span>แตะจุดมาร์กเกอร์เพื่อขยับปรับตำแหน่ง</span>
        </div>
      </div>

      {/* Bottom Mobile Control Hub */}
      <div className="relative z-30 bg-gradient-to-t from-black via-black/95 to-transparent pt-2 pb-6 px-4 flex flex-col items-center gap-2.5">
        {/* 3 View Tabs: ด้านหน้า / ด้านข้าง / ด้านหลัง */}
        <div className="flex items-center bg-white/15 p-1 rounded-full backdrop-blur-md border border-white/20 max-w-sm w-full justify-between">
          <button
            onClick={() => setViewMode('front')}
            className={`flex-1 py-1.5 text-xs font-medium rounded-full transition-all flex items-center justify-center gap-1 ${
              viewMode === 'front'
                ? 'bg-sky-500 text-white shadow font-semibold'
                : 'text-white/80 hover:text-white'
            }`}
          >
            <span>ด้านหน้า</span>
            {capturedStatus.front && <Check className="w-3 h-3 text-emerald-300 stroke-[3]" />}
          </button>

          <button
            onClick={() => setViewMode('side')}
            className={`flex-1 py-1.5 text-xs font-medium rounded-full transition-all flex items-center justify-center gap-1 ${
              viewMode === 'side'
                ? 'bg-sky-500 text-white shadow font-semibold'
                : 'text-white/80 hover:text-white'
            }`}
          >
            <span>ด้านข้าง</span>
            {capturedStatus.side && <Check className="w-3 h-3 text-emerald-300 stroke-[3]" />}
          </button>

          <button
            onClick={() => setViewMode('back')}
            className={`flex-1 py-1.5 text-xs font-medium rounded-full transition-all flex items-center justify-center gap-1 ${
              viewMode === 'back'
                ? 'bg-sky-500 text-white shadow font-semibold'
                : 'text-white/80 hover:text-white'
            }`}
          >
            <span>ด้านหลัง</span>
            {capturedStatus.back && <Check className="w-3 h-3 text-emerald-300 stroke-[3]" />}
          </button>
        </div>

        {/* Shutter & Mobile Camera Tools Bar */}
        <div className="w-full flex items-center justify-between max-w-sm px-2">
          {/* Gallery / File Picker */}
          <button
            onClick={() => fileInputRef.current?.click()}
            title="เลือกรูปจากอัลบั้มมือถือ"
            className="w-11 h-11 rounded-full bg-white/15 text-white flex items-center justify-center hover:bg-white/25 active:scale-95 backdrop-blur-md transition-all cursor-pointer"
          >
            <Upload className="w-5 h-5" />
          </button>

          {/* Flip Camera (กล้องหน้า ⟷ กล้องหลัง) */}
          <button
            onClick={handleToggleFacingMode}
            title={facingMode === 'environment' ? 'สลับเป็นกล้องหน้า' : 'สลับเป็นกล้องหลัง'}
            className="w-11 h-11 rounded-full bg-white/15 text-white flex items-center justify-center hover:bg-white/25 active:scale-95 backdrop-blur-md transition-all cursor-pointer"
          >
            <SwitchCamera className="w-5 h-5" />
          </button>

          {/* Shutter Button (Primary Snap) */}
          <button
            onClick={cameraActive ? handleShutter : () => nativeCameraInputRef.current?.click()}
            title="ถ่ายภาพ"
            className="w-18 h-18 rounded-full border-4 border-white bg-white/20 p-1 flex items-center justify-center hover:scale-105 active:scale-90 transition-transform cursor-pointer shadow-xl shadow-sky-900/30"
          >
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
              <Camera className="w-6 h-6 text-slate-900" />
            </div>
          </button>

          {/* Native Mobile Camera Direct Launch Button */}
          <button
            onClick={() => nativeCameraInputRef.current?.click()}
            title="เปิดแอปกล้องมือถือ HD (Native Camera)"
            className="w-11 h-11 rounded-full bg-emerald-500/90 text-white flex items-center justify-center hover:bg-emerald-400 active:scale-95 backdrop-blur-md transition-all cursor-pointer shadow-md"
          >
            <Smartphone className="w-5 h-5" />
          </button>

          {/* WebRTC Camera Live Stream Reconnect/Toggle */}
          <button
            onClick={() => {
              if (cameraActive) stopCamera();
              else startCamera(facingMode);
            }}
            title={cameraActive ? 'ปิดวิดีโอสด' : 'เปิดวิดีโอสด'}
            className={`w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md transition-all cursor-pointer ${
              cameraActive ? 'bg-sky-500 text-white' : 'bg-white/15 text-white hover:bg-white/25'
            }`}
          >
            <RefreshCw className={`w-5 h-5 ${cameraLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Direct Action Guide Banner */}
        <div className="flex items-center gap-2 text-[10px] text-white/60">
          <span>ปุ่มเขียว: เปิดแอปกล้องมือถือ HD</span>
          <span>·</span>
          <span>ปุ่มขาว: ชัตเตอร์บันทึกภาพสด</span>
        </div>

        {/* Complete & Go to Analysis */}
        <div className="w-full max-w-sm pt-0.5">
          <button
            onClick={handleFinishAllAssessments}
            className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-sky-600/30 cursor-pointer transition-all"
          >
            <span>ดูผลการวิเคราะห์ (ด้านหน้า · ด้านข้าง · ด้านหลัง)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Camera Guide Modal */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 space-y-4 text-slate-900 shadow-xl">
            <h3 className="text-base font-bold text-slate-900">
              การเชื่อมต่อกล้องบนมือถือ
            </h3>
            <div className="text-xs text-slate-600 space-y-2.5 leading-relaxed">
              <div className="flex items-start gap-2">
                <Camera className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                <span>
                  <strong>กล้องวิดีโอสด (Live Viewfinder):</strong> รองรับกล้องหน้าและกล้องหลังของมือถือ พร้อมเส้นเล็ง Plumb line และมุมคำนวณเรียลไทม์
                </span>
              </div>
              <div className="flex items-start gap-2">
                <Smartphone className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>เปิดกล้องมือถือ HD (ปุ่มสีเขียว):</strong> เรียกแอปกล้องในโทรศัพท์โดยตรง เพื่อภาพถ่ายคมชัดสูงสุดระดับ HDR
                </span>
              </div>
              <div className="flex items-start gap-2">
                <SwitchCamera className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
                <span>
                  <strong>สลับเลนส์:</strong> สามารถกดปุ่มสลับกล้องเพื่อเปลี่ยนระหว่างกล้องหลังและกล้องหน้าได้ตลอดเวลา
                </span>
              </div>
            </div>
            <button
              onClick={() => setShowGuideModal(false)}
              className="w-full py-2.5 bg-sky-600 text-white font-semibold text-xs rounded-xl"
            >
              เข้าใจแล้ว
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
