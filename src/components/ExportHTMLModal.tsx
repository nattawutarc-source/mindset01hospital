import React, { useState } from 'react';
import { X, Download, FileCode, CheckCircle2, Globe, Laptop, Smartphone, ExternalLink, Copy, Check } from 'lucide-react';

interface ExportHTMLModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportHTMLModal: React.FC<ExportHTMLModalProps> = ({ isOpen, onClose }) => {
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  if (!isOpen) return null;

  const handleDownload = () => {
    setDownloading(true);
    const link = document.createElement('a');
    link.href = '/physio-care-standalone.html';
    link.download = 'physio-care-app.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => {
      setDownloading(false);
      setDownloaded(true);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 text-center shadow-2xl relative max-h-[95vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-100">
          <FileCode className="w-7 h-7" />
        </div>

        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block">
            Standalone Single-File HTML
          </span>
          <h3 className="text-xl font-bold text-slate-900 mt-0.5">
            ส่งออกไฟล์ HTML พร้อมใช้งาน
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            ไฟล์ HTML รวมทุกอย่างในไฟล์เดียว (CSS, JavaScript, รูปภาพ, ฟังก์ชันกล้อง 3 มุม, QR Code และระบบ Login)
          </p>
        </div>

        {/* Feature summary */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left space-y-2.5 text-xs text-slate-700">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 block">เปิดใช้งานได้ทันที (Offline & Online)</strong>
              <span className="text-slate-500 text-[11px]">ดับเบิ้ลคลิกไฟล์ .html เปิดผ่าน Chrome, Safari, Edge ได้ทันที ไม่ต้องมีเซิร์ฟเวอร์หรือ Node.js</span>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <Laptop className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 block">นำไปขึ้นโฮสติ้งหรือเว็บไซต์ได้ง่าย</strong>
              <span className="text-slate-500 text-[11px]">อัปโหลดไฟล์ไปที่ Netlify, Vercel, GitHub Pages, cPanel หรือเว็บเซิร์ฟเวอร์ใดก็ได้ทันที</span>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <Smartphone className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 block">รองรับกล้องมือถือและ QR Code ครบถ้วน</strong>
              <span className="text-slate-500 text-[11px]">ฟังก์ชันกล้อง 3 มุม (หน้า-ข้าง-หลัง), สแกนเนอร์ QR Code และระบบแยกผู้ป่วย/แอดมินทำงานครบ 100%</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2 pt-1">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.99]"
          >
            <Download className="w-4 h-4" />
            <span>{downloading ? 'กำลังเริ่มดาวน์โหลด...' : 'ดาวน์โหลดไฟล์ physio-care-app.html'}</span>
          </button>

          <a
            href="/physio-care-standalone.html"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
            <span>เปิดทดสอบไฟล์ Standalone HTML ในแท็บใหม่</span>
          </a>
        </div>

        {downloaded && (
          <p className="text-[11px] text-emerald-600 font-medium">
            ✓ เริ่มดาวน์โหลดไฟล์แล้ว! คุณสามารถดับเบิ้ลคลิกไฟล์ที่ดาวน์โหลดเพื่อใช้งานได้ทันที
          </p>
        )}
      </div>
    </div>
  );
};
