import React from 'react';
import { PostureAssessment, ViewAngle } from '../types';
import { RotateCcw, Check, Info, ChevronRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { SAMPLE_IMAGES } from '../data/mockData';

interface ResultSideViewProps {
  assessment: PostureAssessment;
  onRetake: () => void;
  onProceedToFront: () => void;
  onProceedToSummary: () => void;
  onSelectTab: (tab: ViewAngle) => void;
}

export const ResultSideView: React.FC<ResultSideViewProps> = ({
  assessment,
  onRetake,
  onProceedToFront,
  onProceedToSummary,
  onSelectTab,
}) => {
  const cva = assessment.cvaAngle || 46.0;
  const isCvaLow = cva < 50;

  return (
    <div className="max-w-md mx-auto px-4 pt-3 pb-24 space-y-4">
      {/* Top 3-Way Segmented Tabs: ด้านข้าง vs ด้านหน้า vs ด้านหลัง */}
      <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
        <button
          onClick={() => onSelectTab('side')}
          className="flex-1 py-1.5 text-xs font-semibold rounded-lg bg-sky-600 text-white shadow-xs text-center"
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
          className="flex-1 py-1.5 text-xs font-semibold rounded-lg text-slate-600 hover:text-slate-900 transition-colors text-center"
        >
          ด้านหลัง
        </button>
      </div>

      {/* Side View Analyzed Picture & Measurement Overlay */}
      <div className="grid grid-cols-2 gap-3 items-stretch">
        {/* Photo Container with Anatomical Overlay */}
        <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 shadow-sm aspect-3/4 flex items-center justify-center">
          <img
            src={assessment.sideImageUrl || SAMPLE_IMAGES.side}
            alt="Side Posture Analyzed"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />

          {/* SVG Overlay Lines & Markers */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {/* Plumb Line */}
            <line
              x1="52%"
              y1="5%"
              x2="52%"
              y2="95%"
              stroke="#38bdf8"
              strokeWidth="2"
              strokeDasharray="4 2"
            />
            {/* C7 to Tragus vector */}
            <line
              x1="53%"
              y1="22%"
              x2="49%"
              y2="15%"
              stroke="#ef4444"
              strokeWidth="2.5"
            />
            {/* Horizontal Line from C7 */}
            <line
              x1="53%"
              y1="22%"
              x2="80%"
              y2="22%"
              stroke="#10b981"
              strokeWidth="2"
            />
          </svg>

          {/* CVA badge on image */}
          <div className="absolute top-[20%] right-2 bg-red-600 text-white px-2 py-0.5 rounded text-[11px] font-bold shadow-md border border-red-300 font-mono">
            CVA {cva}°
          </div>

          <div className="absolute bottom-2 left-2 right-2 bg-black/60 backdrop-blur-xs text-white text-[10px] text-center py-1 rounded">
            เส้นแนวดิ่ง Plumb line & มุม CVA
          </div>
        </div>

        {/* Right Values Panel */}
        <div className="flex flex-col justify-between space-y-2">
          {/* CVA Metric Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-xs">
            <span className="text-[11px] font-bold text-slate-500 block uppercase">
              ค่าที่วัดได้ (ด้านข้าง)
            </span>
            <div className="mt-1">
              <span className="text-xs text-slate-600 font-medium leading-tight block">
                Craniovertebral angle (CVA)
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-3xl font-extrabold text-slate-900 font-mono tracking-tight">
                  {cva}°
                </span>
                {isCvaLow && (
                  <span className="text-[10px] text-amber-600 font-medium">คอยื่น</span>
                )}
              </div>
              <p className="text-[10px] text-slate-400 mt-1 leading-snug">
                *ค่าอ้างอิงจากงานวิจัยโดยทั่วไป ~50–55° (อาจแตกต่างตามวิธีวัด)
              </p>
            </div>
          </div>

          {/* Shoulder-C7 Angle Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-2.5 shadow-xs">
            <span className="text-[10px] text-slate-500 font-medium block">
              Shoulder-C7 angle (มุมไหล่)
            </span>
            <div className="text-lg font-bold text-slate-800 font-mono mt-0.5">
              {assessment.shoulderC7Angle || 21}°
            </div>
          </div>

          {/* Trunk Alignment Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-2.5 shadow-xs">
            <span className="text-[10px] text-slate-500 font-medium block">
              แนวลำตัว (Trunk)
            </span>
            <div className="mt-1">
              <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                {assessment.trunkAlignment || 'อยู่ในแนว'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Clinical Advice Box */}
      <div className="rounded-xl p-3.5 bg-sky-50/70 border border-sky-100 text-xs text-sky-900 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold block text-sky-950">คำแนะนำ</span>
          <p className="text-[11px] text-sky-800 leading-relaxed mt-0.5">
            ผลนี้เป็นการวัดเชิงปริมาณจากภาพถ่าย ควรแปลผลร่วมกับการตรวจร่างกายและการประเมินของนักกายภาพบำบัด
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        <button
          onClick={onProceedToFront}
          className="h-12 rounded-xl bg-sky-600 hover:bg-sky-700 active:scale-[0.99] text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-sky-600/20 cursor-pointer"
        >
          <Check className="w-4 h-4" />
          <span>บันทึกผล & ตรวจด้านหน้า</span>
        </button>

        <button
          onClick={onRetake}
          className="h-12 rounded-xl bg-white hover:bg-slate-50 active:scale-[0.99] border border-slate-200 text-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>ถ่ายใหม่</span>
        </button>
      </div>

      {/* Quick link directly to Baseline Summary */}
      <button
        onClick={onProceedToSummary}
        className="w-full py-2 text-center text-xs text-slate-500 hover:text-sky-600 font-medium transition-colors"
      >
        ข้ามไปหน้าสรุปผลครั้งแรก (Week 0) →
      </button>
    </div>
  );
};
