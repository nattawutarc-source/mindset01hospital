import React from 'react';
import { PostureAssessment, ViewAngle } from '../types';
import { Check, RotateCcw, Info, ArrowRight } from 'lucide-react';
import { SAMPLE_IMAGES } from '../data/mockData';

interface ResultFrontViewProps {
  assessment: PostureAssessment;
  onRetake: () => void;
  onSaveAll: () => void;
  onProceedToBack?: () => void;
  onSelectTab: (tab: ViewAngle) => void;
}

export const ResultFrontView: React.FC<ResultFrontViewProps> = ({
  assessment,
  onRetake,
  onSaveAll,
  onProceedToBack,
  onSelectTab,
}) => {
  const tilt = assessment.shoulderTiltDeg || 2.8;
  const isBalanced = tilt < 3.0;

  return (
    <div className="max-w-md mx-auto px-4 pt-3 pb-24 space-y-4">
      {/* Top 3-Way Segmented Tabs: ด้านข้าง vs ด้านหน้า vs ด้านหลัง */}
      <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
        <button
          onClick={() => onSelectTab('side')}
          className="flex-1 py-1.5 text-xs font-semibold rounded-lg text-slate-600 hover:text-slate-900 transition-colors text-center"
        >
          ด้านข้าง
        </button>
        <button
          onClick={() => onSelectTab('front')}
          className="flex-1 py-1.5 text-xs font-semibold rounded-lg bg-sky-600 text-white shadow-xs text-center"
        >
          ด้านหน้า
        </button>
        <button
          onClick={() => onSelectTab('back')}
          className="flex-1 py-1.5 text-xs font-semibold rounded-lg text-slate-600 hover:text-slate-900 transition-colors text-center"
        >
          ด้านหลัง
        </button>
      </div>

      {/* Front View Analyzed Photo */}
      <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 shadow-sm aspect-3/4 max-h-[380px] flex items-center justify-center">
        <img
          src={assessment.frontImageUrl || SAMPLE_IMAGES.front}
          alt="Front Posture Analyzed"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />

        {/* SVG Horizontal Shoulder Level Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {/* Shoulder tilt line */}
          <line
            x1="22%"
            y1="28%"
            x2="78%"
            y2="29.5%"
            stroke="#ef4444"
            strokeWidth="3"
          />

          {/* True horizontal level reference line */}
          <line
            x1="15%"
            y1="28%"
            x2="85%"
            y2="28%"
            stroke="#38bdf8"
            strokeWidth="1.5"
            strokeDasharray="4 3"
          />
        </svg>

        {/* Right Floating Badge on image */}
        <div className="absolute top-[28%] right-2 bg-slate-900/85 backdrop-blur-xs text-white px-2.5 py-1 rounded-lg text-xs font-bold border border-white/20 shadow-lg font-mono">
          <span className="text-[10px] text-slate-300 block font-sans">ระดับไหล่ต่างกัน</span>
          <span className="text-sm text-sky-400">{tilt}°</span>
        </div>

        <div className="absolute bottom-2 left-2 right-2 bg-black/60 backdrop-blur-xs text-white text-[10px] text-center py-1 rounded">
          เส้นระดับความสมดุลของแนวกระดูกไหปลาร้าและหัวไหล่
        </div>
      </div>

      {/* Values Box (ด้านหน้า) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              ค่าที่วัดได้ (ด้านหน้า)
            </span>
            <span className="text-sm text-slate-800 font-semibold mt-1 block">
              ระดับไหล่ซ้าย-ขวา
            </span>
          </div>

          <div className="text-right">
            <span className="text-2xl font-extrabold text-slate-900 font-mono">
              {tilt}°
            </span>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-500">ผลการประเมินความสมดุล</span>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              isBalanced
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-amber-50 text-amber-700 border border-amber-200'
            }`}
          >
            {isBalanced ? 'สมดุล (อยู่ในเกณฑ์ปกติ)' : 'เอียงเล็กน้อย'}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2 pt-1">
        {onProceedToBack && (
          <button
            onClick={onProceedToBack}
            className="w-full h-12 rounded-xl bg-sky-600 hover:bg-sky-700 active:scale-[0.99] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-md shadow-sky-600/20 cursor-pointer"
          >
            <span>ดูผลวิเคราะห์ด้านหลัง (Back View)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}

        <button
          onClick={onSaveAll}
          className="w-full h-11 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
        >
          <Check className="w-4 h-4" />
          <span>บันทึกทั้งหมด 3 ด้าน</span>
        </button>

        <button
          onClick={onRetake}
          className="w-full h-10 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 font-medium text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>ถ่ายภาพใหม่</span>
        </button>
      </div>
    </div>
  );
};
