import React from 'react';
import { PostureAssessment, ScreenId } from '../types';
import { Calendar, Dumbbell, Activity, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { SAMPLE_IMAGES } from '../data/mockData';

interface BaselineSummaryViewProps {
  assessment: PostureAssessment;
  onStartExercise: () => void;
  onNavigate: (screen: ScreenId) => void;
}

export const BaselineSummaryView: React.FC<BaselineSummaryViewProps> = ({
  assessment,
  onStartExercise,
  onNavigate,
}) => {
  return (
    <div className="max-w-md mx-auto px-4 pt-4 pb-24 space-y-4">
      {/* Title & Date Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-sky-600 block">
              Baseline Assessment
            </span>
            <h1 className="text-lg font-bold text-slate-900 leading-tight mt-0.5">
              ผลการประเมินครั้งแรก (Week {assessment.week})
            </h1>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{assessment.date}</span>
          </div>
        </div>

        {/* Thumbnails of 3 View Angles (ด้านข้าง, ด้านหน้า, ด้านหลัง) */}
        <div className="grid grid-cols-3 gap-2 mt-4">
          <div className="relative rounded-xl overflow-hidden bg-slate-900 border border-slate-200 aspect-3/4 flex flex-col justify-end p-1.5 shadow-xs">
            <img
              src={assessment.sideImageUrl || SAMPLE_IMAGES.side}
              alt="Side view summary"
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="relative z-10 bg-black/75 backdrop-blur-xs text-white text-[9px] font-medium text-center py-0.5 rounded leading-tight">
              ด้านข้าง
              <span className="block font-mono text-[10px] text-sky-400">{assessment.cvaAngle}°</span>
            </div>
          </div>

          <div className="relative rounded-xl overflow-hidden bg-slate-900 border border-slate-200 aspect-3/4 flex flex-col justify-end p-1.5 shadow-xs">
            <img
              src={assessment.frontImageUrl || SAMPLE_IMAGES.front}
              alt="Front view summary"
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="relative z-10 bg-black/75 backdrop-blur-xs text-white text-[9px] font-medium text-center py-0.5 rounded leading-tight">
              ด้านหน้า
              <span className="block font-mono text-[10px] text-sky-400">ไหล่ {assessment.shoulderTiltDeg}°</span>
            </div>
          </div>

          <div className="relative rounded-xl overflow-hidden bg-slate-900 border border-slate-200 aspect-3/4 flex flex-col justify-end p-1.5 shadow-xs">
            <img
              src={assessment.backImageUrl || SAMPLE_IMAGES.back}
              alt="Back view summary"
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="relative z-10 bg-black/75 backdrop-blur-xs text-white text-[9px] font-medium text-center py-0.5 rounded leading-tight">
              ด้านหลัง
              <span className="block font-mono text-[10px] text-amber-400">สะบัก {assessment.scapularTiltDeg || 1.1}°</span>
            </div>
          </div>
        </div>
      </div>

      {/* Measured Values Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          ค่าที่วัดได้ (3 มุมมอง)
        </h2>

        <div className="space-y-2.5 text-xs divide-y divide-slate-100">
          <div className="flex items-center justify-between pt-1">
            <span className="text-slate-600 font-medium">CVA (มุมคอยื่น ด้านข้าง)</span>
            <span className="text-sm font-bold font-mono text-slate-900">
              {assessment.cvaAngle}°
            </span>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-slate-600 font-medium">ระดับไหล่ซ้าย-ขวา (ด้านหน้า)</span>
            <span className="text-sm font-bold font-mono text-slate-900">
              {assessment.shoulderTiltDeg}°
            </span>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-slate-600 font-medium">ระดับกระดูกสะบัก (ด้านหลัง)</span>
            <span className="text-sm font-bold font-mono text-slate-900">
              {assessment.scapularTiltDeg || 1.1}°
            </span>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-slate-600 font-medium">แนวกระดูกสันหลัง & ลำตัว</span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              {assessment.trunkAlignment}
            </span>
          </div>
        </div>
      </div>

      {/* Pain Scores Card (NRS 0-10) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            อาการปวด (NRS 0–10)
          </h2>
          <span className="text-[10px] text-slate-400">ระดับ 0 = ไม่ปวด, 10 = ปวดรุนแรง</span>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-xs text-slate-500 block">ขณะพัก</span>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-2xl font-bold font-mono text-amber-600">
                {assessment.restPain}
              </span>
              <span className="text-xs text-slate-400 font-mono">/10</span>
            </div>
            <span className="text-[10px] text-amber-700 block mt-0.5">ปวดระดับปานกลาง</span>
          </div>

          <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-200/80">
            <span className="text-xs text-rose-700 font-medium block">ขณะทำงาน</span>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-2xl font-bold font-mono text-rose-600">
                {assessment.workPain}
              </span>
              <span className="text-xs text-rose-400 font-mono">/10</span>
            </div>
            <span className="text-[10px] text-rose-700 block mt-0.5">รบกวนสมาธิทำงาน</span>
          </div>
        </div>
      </div>

      {/* Primary CTA: Start Exercise Program */}
      <button
        onClick={onStartExercise}
        className="w-full h-12 rounded-xl bg-sky-600 hover:bg-sky-700 active:scale-[0.99] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-md shadow-sky-600/20 cursor-pointer transition-all"
      >
        <Dumbbell className="w-4 h-4" />
        <span>เริ่มโปรแกรมออกกำลังกาย</span>
      </button>

      {/* Secondary comparison link */}
      <div className="text-center">
        <button
          onClick={() => onNavigate('progress-comparison')}
          className="text-xs text-sky-600 hover:text-sky-700 font-medium inline-flex items-center gap-1"
        >
          <span>ดูหน้าเปรียบเทียบความก้าวหน้า (Week 0 → Week 4)</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
