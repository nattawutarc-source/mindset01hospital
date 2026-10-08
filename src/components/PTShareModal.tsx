import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { X, Copy, Check, MessageCircle, Printer, Download, Sparkles, ExternalLink, QrCode } from 'lucide-react';
import { PatientProfile } from '../types';

interface PTShareModalProps {
  patient: PatientProfile;
  isOpen: boolean;
  onClose: () => void;
}

export const PTShareModal: React.FC<PTShareModalProps> = ({
  patient,
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [qrLoading, setQrLoading] = useState(true);

  // Dynamic real URL linking to this patient
  const appOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://ptcare.app';
  const patientLink = `${appOrigin}?patient=${encodeURIComponent(patient.code)}&v=1`;

  // Generate real scannable QR Code via QRCode API
  useEffect(() => {
    if (!isOpen) return;
    setQrLoading(true);

    QRCode.toDataURL(patientLink, {
      width: 480,
      margin: 2,
      errorCorrectionLevel: 'H',
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
    })
      .then((url) => {
        setQrDataUrl(url);
        setQrLoading(false);
      })
      .catch((err) => {
        console.error('QR Code API Error:', err);
        setQrLoading(false);
      });
  }, [patientLink, isOpen]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard?.writeText(patientLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQR = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.download = `QR_${patient.code}_${patient.name.replace(/\s+/g, '_')}.png`;
    link.href = qrDataUrl;
    link.click();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-sm w-full p-5 space-y-4 text-center shadow-2xl relative max-h-[95vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-sky-600 block">
            QR Code API · สแกนได้จริง 100%
          </span>
          <h3 className="text-lg font-bold text-slate-900 mt-0.5">
            QR Code ประจำตัวผู้ป่วย
          </h3>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            {patient.name} ({patient.code})
          </p>
        </div>

        {/* Real Dynamic Scannable QR Code Canvas Box */}
        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl inline-block mx-auto shadow-xs">
          <div className="w-48 h-48 bg-white p-2 rounded-xl border border-slate-100 flex items-center justify-center relative overflow-hidden">
            {qrLoading ? (
              <div className="flex flex-col items-center justify-center gap-2 text-slate-400 text-xs">
                <div className="w-6 h-6 border-2 border-sky-600 border-t-transparent rounded-full animate-spin" />
                <span>กำลังสร้าง QR Code...</span>
              </div>
            ) : qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt={`QR Code for ${patient.code}`}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="text-xs text-rose-500">สร้าง QR Code ไม่สำเร็จ</div>
            )}
          </div>
          <div className="mt-2 flex items-center justify-center gap-1.5">
            <span className="text-[11px] font-mono font-bold text-slate-800">
              รหัส: {patient.code}
            </span>
            <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5">
              <Check className="w-3 h-3 stroke-[3]" /> พร้อมสแกน
            </span>
          </div>
        </div>

        {/* Direct Link box */}
        <div className="flex items-center gap-2 p-2 bg-slate-100 rounded-xl border border-slate-200">
          <span className="text-[11px] font-mono text-slate-600 truncate flex-1 text-left px-1">
            {patientLink}
          </span>
          <button
            onClick={handleCopy}
            className="px-2.5 py-1.5 bg-white hover:bg-slate-50 text-slate-800 text-xs font-medium rounded-lg border border-slate-200 shadow-xs flex items-center gap-1 shrink-0 transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-semibold">คัดลอกแล้ว</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>คัดลอก</span>
              </>
            )}
          </button>
        </div>

        {/* Share & Download Actions */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          {/* LINE Share */}
          <button
            onClick={() => {
              const url = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(patientLink)}`;
              window.open(url, '_blank');
            }}
            className="p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 active:scale-95 text-emerald-700 text-xs font-semibold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 text-emerald-600" />
            <span>ส่งผ่าน LINE</span>
          </button>

          {/* Download QR Image */}
          <button
            onClick={handleDownloadQR}
            className="p-2.5 rounded-xl bg-sky-50 hover:bg-sky-100 active:scale-95 text-sky-700 text-xs font-semibold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4 text-sky-600" />
            <span>โหลดรูป QR</span>
          </button>

          {/* Print Card */}
          <button
            onClick={handlePrint}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 text-xs font-semibold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>พิมพ์ใบงาน</span>
          </button>
        </div>

        {/* Instructions */}
        <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl text-left text-[11px] text-slate-500 space-y-1">
          <div className="font-semibold text-slate-700 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-sky-600" />
            <span>วิธีใช้งานสำหรับคนไข้:</span>
          </div>
          <p>
            1. เปิดแอปกล้องในโทรศัพท์ หรือฟังก์ชันสแกน QR ใน LINE
          </p>
          <p>
            2. สแกน QR Code นี้ จะเข้าสู่โปรแกรมกายภาพบำบัดของ {patient.name} ทันทีโดยไม่ต้องล็อกอิน
          </p>
        </div>
      </div>
    </div>
  );
};
