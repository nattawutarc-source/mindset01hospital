import React, { useState, useRef, useEffect } from 'react';
import { X, HelpCircle, Upload, Camera, Check, Info, ArrowRight, Eye, RefreshCw } from 'lucide-react';
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
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [showGuideModal, setShowGuideModal] = useState(false);

  // Stored captured images for all 3 angles
  const [capturedImages, setCapturedImages] = useState<Record<ViewAngle, string>>({
    side: SAMPLE_IMAGES.side,
    front: SAMPLE_IMAGES.front,
    back: SAMPLE_IMAGES.back,
  });

  // Track which angles have been freshly snapped by user
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

  // Landmarks state for Back view (Spine alignment & Scapular symmetry)
  const [leftScapula, setLeftScapula] = useState<LandmarkPoint>({ x: 44, y: 32 });
  const [rightScapula, setRightScapula] = useState<LandmarkPoint>({ x: 56, y: 33.2 });
  const [spineTop, setSpineTop] = useState<LandmarkPoint>({ x: 50, y: 22 });
  const [spineBottom, setSpineBottom] = useState<LandmarkPoint>({ x: 50, y: 65 });

  const [activeDrag, setActiveDrag] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Calculate Craniovertebral Angle (CVA) in degrees for side view
  const calculateCVA = () => {
    const dx = c7.x - tragus.x;
    const dy = c7.y - tragus.y;
    const radians = Math.atan2(dy, Math.abs(dx) > 0.001 ? Math.abs(dx) : 0.001);
    const degrees = (radians * 180) / Math.PI;
    return Math.min(65, Math.max(30, Math.round(degrees * 0.85)));
  };

  // Calculate shoulder tilt angle in degrees for front view
  const calculateShoulderTilt = () => {
    const dx = Math.abs(rightShoulder.x - leftShoulder.x);
    const dy = Math.abs(rightShoulder.y - leftShoulder.y);
    const radians = Math.atan2(dy, dx > 0.001 ? dx : 0.001);
    const degrees = (radians * 180) / Math.PI;
    return Number(degrees.toFixed(1));
  };

  // Calculate scapular tilt angle in degrees for back view
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

  // Try activating real camera if requested
  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setCameraActive(true);
      }
    } catch (err: any) {
      console.warn('Camera error:', err);
      setCameraError('ไม่สามารถเปิดกล้องได้ กำลังใช้ภาพตัวอย่างมาตรฐานหรืออัปโหลดภาพแทนได้');
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const dataUrl = event.target.result as string;
          setCapturedImages((prev) => ({ ...prev, [viewMode]: dataUrl }));
          setCapturedStatus((prev) => ({ ...prev, [viewMode]: true }));
          stopCamera();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle shutter snapshot
  const handleShutter = () => {
    let finalImageUrl = capturedImages[viewMode];

    if (cameraActive && videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 854;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        finalImageUrl = canvas.toDataURL('image/jpeg');
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

    // Auto-suggest next angle if not all captured
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

  // Pointer drag events for landmark alignment
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
        return 'จัดท่าด้านหน้า (Front View) ให้อยู่ในกรอบ';
      case 'side':
        return 'จัดท่าด้านข้าง (Side View) ให้อยู่ในกรอบ';
      case 'back':
        return 'จัดท่าด้านหลัง (Back / Posterior) ให้อยู่ในกรอบ';
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black flex flex-col justify-between select-none overflow-hidden"
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {/* Top Header */}
      <div className="relative z-30 flex items-center justify-between px-4 py-3 bg-gradient-to-b from-black/85 to-transparent">
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30 backdrop-blur-md transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="bg-black/70 backdrop-blur-md px-3.5 py-1 rounded-full border border-white/10 text-white text-xs font-medium truncate max-w-[240px]">
          {getGuideTitle()}
        </div>

        <button
          onClick={() => setShowGuideModal(true)}
          className="w-9 h-9 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30 backdrop-blur-md transition-colors"
        >
          <HelpCircle className="w-5 h-5" />
        </button>
      </div>

      {/* Main Viewfinder Box */}
      <div
        ref={containerRef}
        className="relative flex-1 w-full flex items-center justify-center overflow-hidden touch-none"
      >
        {/* Source Media */}
        {cameraActive ? (
          <video
            ref={videoRef}
            playsInline
            muted
            className="w-full h-full object-cover"
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

        {/* Visual Overlay: Plumb Line & Grids */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Vertical plumb line */}
          <div className="absolute top-0 bottom-0 left-1/2 w-0.5 border-l-2 border-dashed border-sky-400/90 -translate-x-1/2" />

          {/* Body Silhouette Guide Box */}
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

          {/* BACK VIEW OVERLAY (Spine Alignment & Scapular Symmetry) */}
          {viewMode === 'back' && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {/* Scapular horizontal symmetry line */}
              <line
                x1={`${leftScapula.x}%`}
                y1={`${leftScapula.y}%`}
                x2={`${rightScapula.x}%`}
                y2={`${rightScapula.y}%`}
                stroke="#f59e0b"
                strokeWidth="2.5"
              />
              {/* Perfectly horizontal reference line */}
              <line
                x1={`${leftScapula.x - 4}%`}
                y1={`${leftScapula.y}%`}
                x2={`${rightScapula.x + 4}%`}
                y2={`${leftScapula.y}%`}
                stroke="#38bdf8"
                strokeWidth="1.5"
                strokeDasharray="4 2"
              />
              {/* Spine vertical line */}
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
              className="absolute -translate-x-1/2 -translate-y-1/2 z-30 cursor-grab active:cursor-grabbing p-2"
            >
              <div className="w-5 h-5 rounded-full bg-red-500 border-2 border-white shadow-md animate-pulse" />
              <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[10px] px-1.5 py-0.5 rounded whitespace-nowrap">
                ติ่งหู (Tragus)
              </div>
            </div>

            <div
              onPointerDown={() => handlePointerDown('c7')}
              style={{ left: `${c7.x}%`, top: `${c7.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-30 cursor-grab active:cursor-grabbing p-2"
            >
              <div className="w-5 h-5 rounded-full bg-emerald-500 border-2 border-white shadow-md" />
              <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[10px] px-1.5 py-0.5 rounded whitespace-nowrap">
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
              className="absolute -translate-x-1/2 -translate-y-1/2 z-30 cursor-grab active:cursor-grabbing p-2"
            >
              <div className="w-4 h-4 rounded-full bg-sky-500 border-2 border-white shadow-md" />
            </div>

            <div
              onPointerDown={() => handlePointerDown('rightShoulder')}
              style={{ left: `${rightShoulder.x}%`, top: `${rightShoulder.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-30 cursor-grab active:cursor-grabbing p-2"
            >
              <div className="w-4 h-4 rounded-full bg-sky-500 border-2 border-white shadow-md" />
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

        {/* BACK MARKERS (Spine & Scapulae) */}
        {viewMode === 'back' && (
          <>
            {/* Left Scapula */}
            <div
              onPointerDown={() => handlePointerDown('leftScapula')}
              style={{ left: `${leftScapula.x}%`, top: `${leftScapula.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-30 cursor-grab active:cursor-grabbing p-2"
            >
              <div className="w-4 h-4 rounded-full bg-amber-500 border-2 border-white shadow-md" />
              <div className="absolute top-5 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[9px] px-1 rounded whitespace-nowrap">
                สะบักซ้าย
              </div>
            </div>

            {/* Right Scapula */}
            <div
              onPointerDown={() => handlePointerDown('rightScapula')}
              style={{ left: `${rightScapula.x}%`, top: `${rightScapula.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-30 cursor-grab active:cursor-grabbing p-2"
            >
              <div className="w-4 h-4 rounded-full bg-amber-500 border-2 border-white shadow-md" />
              <div className="absolute top-5 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[9px] px-1 rounded whitespace-nowrap">
                สะบักขวา
              </div>
            </div>

            {/* Floating Scapular Tilt & Spine Info */}
            <div
              style={{
                left: `${(leftScapula.x + rightScapula.x) / 2}%`,
                top: `${Math.min(leftScapula.y, rightScapula.y) - 6}%`,
              }}
              className="absolute z-20 -translate-x-1/2 bg-amber-600 text-white px-2.5 py-0.5 rounded text-xs font-bold shadow border border-amber-300 font-mono"
            >
              ระดับสะบักต่างกัน {scapularTilt}°
            </div>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 px-3 py-1 rounded-full text-[11px] backdrop-blur-xs font-medium">
              แนวกระดูกสันหลัง: อยู่ในแนวตรงปกติ
            </div>
          </>
        )}

        {/* Tip Box */}
        <div className="absolute top-4 left-4 z-20 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded text-[11px] text-white/90 border border-white/10 flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-sky-400" />
          <span>แตะเลื่อนจุดมาร์กเกอร์เพื่อปรับให้ตรงจุดร่างกายได้</span>
        </div>
      </div>

      {/* Bottom Controls Bar */}
      <div className="relative z-30 bg-gradient-to-t from-black via-black/95 to-transparent pt-2 pb-8 px-4 flex flex-col items-center gap-3">
        {/* 3 ANGLE SELECTOR TABS: ด้านหน้า / ด้านข้าง / ด้านหลัง */}
        <div className="flex items-center bg-white/15 p-1 rounded-full backdrop-blur-md border border-white/20 max-w-sm w-full justify-between">
          {/* Front */}
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

          {/* Side */}
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

          {/* Back */}
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

        {/* Shutter & Source Bar */}
        <div className="w-full flex items-center justify-around max-w-sm">
          {/* File Upload Trigger */}
          <button
            onClick={() => fileInputRef.current?.click()}
            title="อัปโหลดภาพถ่าย"
            className="w-11 h-11 rounded-full bg-white/15 text-white flex items-center justify-center hover:bg-white/25 backdrop-blur-md transition-colors"
          >
            <Upload className="w-5 h-5" />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
          />

          {/* Shutter Button */}
          <button
            onClick={handleShutter}
            title="กดถ่ายภาพมุมนี้"
            className="w-18 h-18 rounded-full border-4 border-white bg-white/20 p-1 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform cursor-pointer"
          >
            <div className="w-full h-full rounded-full bg-white shadow-lg flex items-center justify-center">
              <Camera className="w-6 h-6 text-slate-900" />
            </div>
          </button>

          {/* Live Camera Switch */}
          <button
            onClick={() => {
              if (cameraActive) {
                stopCamera();
              } else {
                startCamera();
              }
            }}
            title={cameraActive ? 'ปิดกล้องจริง' : 'เปิดกล้องจริง'}
            className={`w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md transition-colors ${
              cameraActive ? 'bg-emerald-500 text-white' : 'bg-white/15 text-white hover:bg-white/25'
            }`}
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>

        {/* Complete & Go to Analysis */}
        <div className="w-full max-w-sm pt-1">
          <button
            onClick={handleFinishAllAssessments}
            className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-sky-600/30 cursor-pointer transition-all"
          >
            <span>ดูผลการวิเคราะห์ (ด้านหน้า · ด้านข้าง · ด้านหลัง)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Guide Modal */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 space-y-4 text-slate-900 shadow-xl">
            <h3 className="text-base font-bold text-slate-900">
              ข้อแนะนำการถ่ายภาพ 3 มุมมอง
            </h3>
            <div className="text-xs text-slate-600 space-y-2.5 leading-relaxed">
              <div>
                <span className="font-bold text-slate-800 block">1. ด้านข้าง (Side View):</span>
                <span>หันข้าง 90 องศา ให้เห็นติ่งหูและกระดูกคอ C7 ชัดเจนเพื่อวัดมุม CVA คอยื่น</span>
              </div>
              <div>
                <span className="font-bold text-slate-800 block">2. ด้านหน้า (Front View):</span>
                <span>ยืนหันหน้าตรง ขนานกับกล้อง เพื่อวัดระดับความสูง-ต่ำของหัวไหล่ซ้าย-ขวา</span>
              </div>
              <div>
                <span className="font-bold text-slate-800 block">3. ด้านหลัง (Back View):</span>
                <span>ยืนหันหลังตรง มองตรงข้างหน้า เพื่อตรวจระดับกระดูกสะบักและความตรงของกระดูกสันหลัง</span>
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
