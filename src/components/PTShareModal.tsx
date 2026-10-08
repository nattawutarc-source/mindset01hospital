import React, { useState } from 'react';
import { X, Copy, Check, MessageCircle, Printer, QrCode } from 'lucide-react';
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
  const patientLink = `https://ptcare.app/p/${patient.code.toLowerCase()}/abcX9`;

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard?.writeText(patientLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 text-center shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-sky-600 block">
            Patient Portal Access
          </span>
          <h3 className="text-lg font-bold text-slate-900 mt-0.5">
            ลิงก์ & QR Code ประจำตัวผู้ป่วย
          </h3>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            {patient.name} ({patient.code})
          </p>
        </div>

        {/* Realistic SVG QR Code Box */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl inline-block mx-auto">
          <div className="w-44 h-44 bg-white p-2 rounded-xl border border-slate-100 flex flex-col items-center justify-center shadow-xs">
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full text-slate-900 fill-current"
            >
              {/* Corner position markers */}
              <rect x="5" y="5" width="25" height="25" rx="3" fill="#0f172a" />
              <rect x="9" y="9" width="17" height="17" rx="2" fill="white" />
              <rect x="13" y="13" width="9" height="9" fill="#0284c7" />

              <rect x="70" y="5" width="25" height="25" rx="3" fill="#0f172a" />
              <rect x="74" y="9" width="17" height="17" rx="2" fill="white" />
              <rect x="78" y="13" width="9" height="9" fill="#0284c7" />

              <rect x="5" y="70" width="25" height="25" rx="3" fill="#0f172a" />
              <rect x="9" y="74" width="17" height="17" rx="2" fill="white" />
              <rect x="13" y="78" width="9" height="9" fill="#0284c7" />

              {/* Data pattern matrices */}
              <rect x="35" y="10" width="6" height="6" />
              <rect x="45" y="15" width="8" height="6" />
              <rect x="58" y="10" width="6" height="6" />
              <rect x="35" y="25" width="12" height="6" />
              <rect x="52" y="25" width="8" height="8" />

              <rect x="10" y="38" width="8" height="8" />
              <rect x="25" y="42" width="6" height="6" />
              <rect x="38" y="38" width="16" height="8" />
              <rect x="60" y="38" width="8" height="6" />
              <rect x="75" y="42" width="12" height="6" />

              <rect x="12" y="52" width="14" height="6" />
              <rect x="32" y="52" width="8" height="12" />
              <rect x="48" y="52" width="16" height="6" />
              <rect x="70" y="52" width="14" height="10" />

              <rect x="38" y="72" width="8" height="8" />
              <rect x="52" y="75" width="12" height="6" />
              <rect x="72" y="70" width="16" height="6" />
              <rect x="42" y="85" width="18" height="8" />
              <rect x="70" y="82" width="14" height="10" />
            </svg>
          </div>
          <span className="text-[11px] font-mono font-bold text-slate-700 block mt-2">
            รหัสคนไข้: {patient.code}
          </span>
        </div>

        {/* Direct Link box */}
        <div className="flex items-center gap-2 p-2 bg-slate-100 rounded-xl border border-slate-200">
          <span className="text-xs font-mono text-slate-600 truncate flex-1 text-left px-1">
            {patientLink}
          </span>
          <button
            onClick={handleCopy}
            className="px-2.5 py-1.5 bg-white hover:bg-slate-50 text-slate-800 text-xs font-medium rounded-lg border border-slate-200 shadow-xs flex items-center gap-1 shrink-0 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">คัดลอกแล้ว</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>คัดลอก</span>
              </>
            )}
          </button>
        </div>

        {/* Share Channel Buttons */}
        <div className="grid grid-cols-3 gap-2 pt-2">
          {/* LINE */}
          <button
            onClick={() => {
              const url = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(patientLink)}`;
              window.open(url, '_blank');
            }}
            className="p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold flex flex-col items-center justify-center gap-1 transition-colors"
          >
            <MessageCircle className="w-4 h-4 text-emerald-600" />
            <span>LINE</span>
          </button>

          {/* Copy Link */}
          <button
            onClick={handleCopy}
            className="p-2.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-semibold flex flex-col items-center justify-center gap-1 transition-colors"
          >
            <Copy className="w-4 h-4 text-sky-600" />
            <span>คัดลอกลิงก์</span>
          </button>

          {/* Print */}
          <button
            onClick={handlePrint}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex flex-col items-center justify-center gap-1 transition-colors"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>พิมพ์</span>
          </button>
        </div>

        <p className="text-[11px] text-slate-400">
          ผู้ป่วยสามารถสแกนเปิดบนโทรศัพท์เพื่อทำแบบประเมินและดูท่า HEP ได้ทันทีโดยไม่ต้องจำรหัสผ่าน
        </p>
      </div>
    </div>
  );
};
