import React from 'react';
import { PostureAssessment, ViewAngle } from '../types';
import { Check, RotateCcw, Info, CheckCircle2 } from 'lucide-react';
import { SAMPLE_IMAGES } from '../data/mockData';

interface ResultBackViewProps {
  assessment: PostureAssessment;
  onRetake: () => void;
  onSaveAll: () => void;
  onSelectTab: (tab: ViewAngle) => void;
}

export const ResultBackView: React.FC<ResultBackViewProps> = ({
  assessment,
  onRetake,
  onSaveAll,
  onSelectTab,
}) => {
  const tilt = assessment.scapularTiltDeg || 1.1;
  const isBalanced = tilt <= 2.0;

  return (
    <div className="max-w-md mx-auto px-4 pt-3 pb-24 space-y-4">
      {/* 3-Way Top Segmented Tabs: ด้านข้าง / ด้านหน้า / ด้านหลัง */}
      <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
        <button
          onClick={() => onSelectTab('side')}
          className="flex-1 py-1.5 text-xs font-semibold rounded-lg text-slate-600 hover:text-slate-900 transition-colors text-center"
        >
          ด้านข้าง
        </button>
        <button
          onClick={() => onSelectTab('front')}
          className="flex-1 py-1.5 text-xs font-semibold rounded-lg text-slate-600 hover:text-slate-900 transition-colors text-center"
        >
          ด้านหน้า
        </button>
        <button
          onClick={() => onSelectTab('back')}
          className="flex-1 py-1.5 text-xs font-semibold rounded-lg bg-sky-600 text-white shadow-xs text-center"
        >
          ด้านหลัง
        </button>
      </div>

      {/* Back View Analyzed Photo */}
      <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 shadow-sm aspect-3/4 max-h-[380px] flex items-center justify-center">
        <img
          src={assessment.backImageUrl || SAMPLE_IMAGES.back}
          alt="Back Posture Analyzed"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />

        {/* SVG Horizontal Scapula Level & Vertical Spine Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {/* Scapula level line */}
          <line
            x1="26%"
            y1="32%"
            x2="74%"
            y2="33%"
            stroke="#f59e0b"
            strokeWidth="3"
          />

          {/* Reference horizontal level line */}
          <line
            x1="20%"
            y1="32%"
            x2="80%"
            y2="32%"
            stroke="#38bdf8"
            strokeWidth="1.5"
            strokeDasharray="4 3"
          />

          {/* Spine vertical plumb line */}
          <line
            x1="50%"
            y1="10%"
            x2="50%"
            y2="90%"
            stroke="#10b981"
            strokeWidth="2"
            strokeDasharray="4 2"
          />
        </svg>

        {/* Badge on image */}
        <div className="absolute top-[32%] right-2 bg-slate-900/85 backdrop-blur-xs text-white px-2.5 py-1 rounded-lg text-xs font-bold border border-white/20 shadow-lg font-mono">
          <span className="text-[10px] text-slate-300 block font-sans">ระดับสะบักต่างกัน</span>
          <span className="text-sm text-amber-400">{tilt}°</span>
        </div>

        <div className="absolute bottom-2 left-2 right-2 bg-black/60 backdrop-blur-xs text-white text-[10px] text-center py-1 rounded">
          เส้นระดับสะบัก (Scapular level) และแนวกระดูกสันหลัง (Spine alignment)
        </div>
      </div>

      {/* Values Box (ด้านหลัง) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
          ค่าที่วัดได้ (ด้านหลัง)
        </span>

        <div className="divide-y divide-slate-100 text-xs space-y-2">
          <div className="flex items-center justify-between pt-1">
            <div>
              <span className="font-semibold text-slate-800 block">
                ระดับกระดูกสะบักซ้าย-ขวา
              </span>
              <span className="text-[10px] text-slate-400">
                ประเมินภาวะ Scapular dyskinesis / tilt
              </span>
            </div>
            <div className="text-right">
              <span className="text-xl font-extrabold text-slate-900 font-mono">
                {tilt}°
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div>
              <span className="font-semibold text-slate-800 block">
                แนวกระดูกสันหลัง
              </span>
              <span className="text-[10px] text-slate-400">
                คัดกรองเบื้องต้นแนวกระดูกสันหลังคด
              </span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              {assessment.spineAlignment || 'ตรงแนวปกติ'}
            </span>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-slate-500">ความสมดุลกล้ามเนื้อหลัง</span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                isBalanced
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}
            >
              {isBalanced ? 'สมดุลดี (อยู่ในเกณฑ์ปกติ)' : 'เอียงเล็กน้อย'}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2 pt-1">
        <button
          onClick={onSaveAll}
          className="w-full h-12 rounded-xl bg-sky-600 hover:bg-sky-700 active:scale-[0.99] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-md shadow-sky-600/20 cursor-pointer"
        >
          <Check className="w-4 h-4" />
          <span>บันทึกผล 3 มุมมองทั้งหมด</span>
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
