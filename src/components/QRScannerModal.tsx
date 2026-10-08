import React, { useState, useRef, useEffect } from 'react';
import { X, Camera, QrCode, AlertCircle, Check, Upload, Smartphone, RefreshCw, Zap } from 'lucide-react';
import jsQR from 'jsqr';
import { PatientProfile } from '../types';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPatientDetected: (patientCode: string) => void;
  patients: PatientProfile[];
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({
  isOpen,
  onClose,
  onPatientDetected,
  patients,
}) => {
  const [scanning, setScanning] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [detectedCode, setDetectedCode] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Parse QR text to extract patient code e.g. P001
  const extractPatientCode = (text: string): string | null => {
    if (!text) return null;
    // Check if contains patient=P001 or /p/p001 or code=p001
    const matchParam = text.match(/[?&](?:patient|p|code)=([A-Za-z0-9]+)/i);
    if (matchParam && matchParam[1]) return matchParam[1].toUpperCase();

    const matchPath = text.match(/\/p\/([A-Za-z0-9]+)/i);
    if (matchPath && matchPath[1]) return matchPath[1].toUpperCase();

    // Check direct pattern like P001
    const matchCode = text.match(/(P\d{3})/i);
    if (matchCode && matchCode[1]) return matchCode[1].toUpperCase();

    // Raw matching with existing patient codes
    const cleanText = text.trim().toUpperCase();
    const matchAny = patients.find((p) => p.code.toUpperCase() === cleanText);
    if (matchAny) return matchAny.code;

    return null;
  };

  const stopScanner = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setScanning(false);
  };

  const decodeFrame = () => {
    if (!videoRef.current || videoRef.current.readyState < 2) {
      animationFrameRef.current = requestAnimationFrame(decodeFrame);
      return;
    }

    const video = videoRef.current;
    if (!canvasRef.current) {
      canvasRef.current = document.createElement('canvas');
    }
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    if (ctx && video.videoWidth > 0 && video.videoHeight > 0) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'attemptBoth',
      });

      if (code && code.data) {
        const patientCode = extractPatientCode(code.data);
        if (patientCode) {
          setDetectedCode(patientCode);
          stopScanner();
          // Brief success flash
          setTimeout(() => {
            onPatientDetected(patientCode);
          }, 350);
          return;
        }
      }
    }

    animationFrameRef.current = requestAnimationFrame(decodeFrame);
  };

  const startScanner = async (targetFacing: 'environment' | 'user' = facingMode) => {
    setErrorMsg(null);
    setDetectedCode(null);
    stopScanner();

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('อุปกรณ์ไม่รองรับการเปิดกล้องเว็บแคม');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: targetFacing },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        videoRef.current.setAttribute('webkit-playsinline', 'true');
        await videoRef.current.play();
        setScanning(true);
        setFacingMode(targetFacing);

        // Start jsQR animation frame scanning loop
        animationFrameRef.current = requestAnimationFrame(decodeFrame);
      }
    } catch (err: any) {
      console.warn('QR scanner camera error:', err);
      setErrorMsg('ไม่สามารถเปิดกล้องสแกนได้ คุณสามารถอัปโหลดรูปภาพ QR หรือเลือกรหัสคนไข้ด้านล่างได้ทันที');
      setScanning(false);
    }
  };

  // Switch rear/front camera
  const handleFlipCamera = () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    startScanner(nextMode);
  };

  // Decode QR Code from an uploaded image / screenshot
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = img.width;
        tempCanvas.height = img.height;
        const ctx = tempCanvas.getContext('2d');
        if (!ctx) return;
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'attemptBoth',
        });

        if (code && code.data) {
          const patientCode = extractPatientCode(code.data);
          if (patientCode) {
            setDetectedCode(patientCode);
            stopScanner();
            setTimeout(() => {
              onPatientDetected(patientCode);
            }, 300);
          } else {
            setErrorMsg(`พบ QR Code ("${code.data.substring(0, 30)}") แต่ไม่ตรงกับรหัสคนไข้ในระบบ`);
          }
        } else {
          setErrorMsg('ไม่พบ QR Code ในรูปภาพที่อัปโหลด กรุณาลองใช้ภาพที่ชัดเจนขึ้น');
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (isOpen) {
      startScanner('environment');
    } else {
      stopScanner();
    }
    return () => {
      stopScanner();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-sm w-full p-5 space-y-4 text-center shadow-2xl relative max-h-[95vh] overflow-y-auto">
        <button
          onClick={() => {
            stopScanner();
            onClose();
          }}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-sky-600 block">
            QR Scanner API
          </span>
          <h3 className="text-lg font-bold text-slate-900 mt-0.5">
            สแกน QR Code ประจำตัวคนไข้
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            ส่องกล้องไปที่ QR Code ของคนไข้เพื่อเปิดแฟ้มประวัติทันที
          </p>
        </div>

        {/* Camera Viewfinder Box */}
        <div className="relative rounded-2xl overflow-hidden bg-slate-900 aspect-square max-w-[280px] mx-auto border border-slate-200 flex items-center justify-center shadow-inner">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />

          {/* Scanner Targeting Frame */}
          <div className="absolute inset-8 border-2 border-dashed border-sky-400 rounded-2xl pointer-events-none flex items-center justify-center">
            <div className="w-full h-0.5 bg-sky-400/80 animate-pulse" />
          </div>

          {!scanning && (
            <div className="absolute inset-0 bg-slate-900/90 p-4 flex flex-col items-center justify-center gap-2 text-white">
              <QrCode className="w-10 h-10 text-sky-400 animate-pulse" />
              <span className="text-xs font-semibold">จัดกรอบ QR Code ให้อยู่กึ่งกลาง</span>
              <button
                onClick={() => startScanner('environment')}
                className="mt-2 px-3 py-1.5 bg-sky-600 hover:bg-sky-500 rounded-lg text-xs font-semibold cursor-pointer"
              >
                เปิดกล้องสแกน
              </button>
            </div>
          )}

          {detectedCode && (
            <div className="absolute inset-0 bg-emerald-950/90 flex flex-col items-center justify-center text-emerald-300 p-4 animate-in fade-in">
              <Check className="w-10 h-10 text-emerald-400" />
              <span className="text-sm font-bold mt-1">พบรหัสคนไข้: {detectedCode}</span>
              <span className="text-xs text-emerald-400/80 mt-0.5">กำลังเข้าสู่ระบบ...</span>
            </div>
          )}

          {/* Camera controls overlay */}
          {scanning && (
            <div className="absolute bottom-2 right-2 flex items-center gap-1 z-10">
              <button
                type="button"
                onClick={handleFlipCamera}
                className="p-1.5 bg-black/60 hover:bg-black/80 text-white rounded-lg backdrop-blur-sm cursor-pointer transition-colors"
                title="สลับกล้องหน้า/หลัง"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Upload QR image option */}
        <div className="flex items-center justify-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Upload className="w-3.5 h-3.5 text-sky-600" />
            <span>อัปโหลดรูปภาพ QR Code</span>
          </button>
        </div>

        {errorMsg && (
          <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-800 flex items-start gap-1.5 text-left">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Quick Patient Selection Shortcut */}
        <div className="pt-1 text-left space-y-2">
          <span className="text-xs font-bold text-slate-700 block">
            หรือ เลือกรหัสคนไข้เพื่อทดสอบเข้าสู่ระบบ:
          </span>
          <div className="grid grid-cols-2 gap-2">
            {patients.slice(0, 4).map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  stopScanner();
                  onPatientDetected(p.code);
                }}
                className="p-2 text-left bg-slate-50 hover:bg-sky-50 border border-slate-200 hover:border-sky-300 rounded-xl transition-all cursor-pointer"
              >
                <span className="font-mono font-bold text-sky-700 text-xs block">
                  {p.code}
                </span>
                <span className="text-[11px] text-slate-700 font-medium truncate block">
                  {p.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
