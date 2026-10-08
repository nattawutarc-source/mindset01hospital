import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, TrendingUp, Sliders, Split, Eye } from 'lucide-react';
import { PostureAssessment, ViewAngle } from '../types';
import { SAMPLE_IMAGES } from '../data/mockData';

interface ProgressComparisonViewProps {
  onBack: () => void;
  assessmentW0: PostureAssessment;
  assessmentW4: PostureAssessment;
}

export const ProgressComparisonView: React.FC<ProgressComparisonViewProps> = ({
  onBack,
  assessmentW0,
  assessmentW4,
}) => {
  const [displayMode, setDisplayMode] = useState<'side-by-side' | 'overlay'>('side-by-side');
  const [angleMode, setAngleMode] = useState<ViewAngle>('side');
  const [sliderPosition, setSliderPosition] = useState(50); // percentage for overlay comparison

  const getImageForAngle = (assessment: PostureAssessment, angle: ViewAngle) => {
    switch (angle) {
      case 'front':
        return assessment.frontImageUrl || SAMPLE_IMAGES.front;
      case 'side':
        return assessment.sideImageUrl || SAMPLE_IMAGES.side;
      case 'back':
        return assessment.backImageUrl || SAMPLE_IMAGES.back;
    }
  };

  const getMetricBadge = (assessment: PostureAssessment, angle: ViewAngle) => {
    switch (angle) {
      case 'side':
        return `CVA ${assessment.cvaAngle}°`;
      case 'front':
        return `ไหล่ ${assessment.shoulderTiltDeg}°`;
      case 'back':
        return `สะบัก ${assessment.scapularTiltDeg || 1.1}°`;
    }
  };

  const metrics = [
    {
      label: 'CVA (มุมคอยื่น ด้านข้าง)',
      w0: `${assessmentW0.cvaAngle}°`,
      w4: `${assessmentW4.cvaAngle}°`,
      diff: `+${(assessmentW4.cvaAngle - assessmentW0.cvaAngle).toFixed(0)}°`,
      isBetter: true,
      desc: 'มุมคอยื่นเพิ่มขึ้น เข้าใกล้เกณฑ์ปกติ (>50°)',
    },
    {
      label: 'ระดับไหล่ซ้าย-ขวา (ด้านหน้า)',
      w0: `${assessmentW0.shoulderTiltDeg}°`,
      w4: `${assessmentW4.shoulderTiltDeg}°`,
      diff: `-${(assessmentW0.shoulderTiltDeg - assessmentW4.shoulderTiltDeg).toFixed(1)}°`,
      isBetter: true,
      desc: 'ไหล่มีความสมดุลซ้าย-ขวามากขึ้น',
    },
    {
      label: 'ระดับกระดูกสะบัก (ด้านหลัง)',
      w0: `${assessmentW0.scapularTiltDeg || 2.5}°`,
      w4: `${assessmentW4.scapularTiltDeg || 1.1}°`,
      diff: `-${((assessmentW0.scapularTiltDeg || 2.5) - (assessmentW4.scapularTiltDeg || 1.1)).toFixed(1)}°`,
      isBetter: true,
      desc: 'สะบักคืนสู่ความสมดุล ลดอาการตึงรั้งหลัง',
    },
    {
      label: 'Shoulder-C7 angle',
      w0: `${assessmentW0.shoulderC7Angle}°`,
      w4: `${assessmentW4.shoulderC7Angle}°`,
      diff: `-${(assessmentW0.shoulderC7Angle - assessmentW4.shoulderC7Angle).toFixed(0)}°`,
      isBetter: true,
      desc: 'มุมลาดไหล่ลดลง ความตึงบ่าคลายตัว',
    },
    {
      label: 'อาการปวดขณะพัก',
      w0: `${assessmentW0.restPain}`,
      w4: `${assessmentW4.restPain}`,
      diff: `-${assessmentW0.restPain - assessmentW4.restPain}`,
      isBetter: true,
      desc: 'ลดลงอย่างมีนัยสำคัญ',
    },
    {
      label: 'อาการปวดขณะทำงาน',
      w0: `${assessmentW0.workPain}`,
      w4: `${assessmentW4.workPain}`,
      diff: `-${assessmentW0.workPain - assessmentW4.workPain}`,
      isBetter: true,
      desc: 'ทำงานต่อเนื่องได้นานขึ้นโดยไม่ปวดรบกวน',
    },
  ];

  const imgW0 = getImageForAngle(assessmentW0, angleMode);
  const imgW4 = getImageForAngle(assessmentW4, angleMode);

  return (
    <div className="max-w-md mx-auto px-4 pt-3 pb-24 space-y-4">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="p-2 -ml-2 text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-base font-bold text-slate-900">ความก้าวหน้าของคุณ</h1>
        <div className="w-8" />
      </div>

      {/* Angle Selector Tabs: ด้านข้าง / ด้านหน้า / ด้านหลัง */}
      <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
        <button
          onClick={() => setAngleMode('side')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            angleMode === 'side' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-600'
          }`}
        >
          ด้านข้าง (CVA)
        </button>
        <button
          onClick={() => setAngleMode('front')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            angleMode === 'front' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-600'
          }`}
        >
          ด้านหน้า (ไหล่)
        </button>
        <button
          onClick={() => setAngleMode('back')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            angleMode === 'back' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-600'
          }`}
        >
          ด้านหลัง (สะบัก)
        </button>
      </div>

      {/* Week Title & Segmented Display Mode */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Week 0 → Week 4 (4 สัปดาห์)
        </span>

        {/* Display Mode Toggle */}
        <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
          <button
            onClick={() => setDisplayMode('side-by-side')}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
              displayMode === 'side-by-side'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Split className="w-3.5 h-3.5" />
            <span>ข้างกัน</span>
          </button>
          <button
            onClick={() => setDisplayMode('overlay')}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
              displayMode === 'overlay'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>ซ้อนภาพ</span>
          </button>
        </div>
      </div>

      {/* Visual Image Comparison Container */}
      {displayMode === 'side-by-side' ? (
        <div className="grid grid-cols-2 gap-3">
          {/* Week 0 Container */}
          <div className="space-y-1.5">
            <div className="text-center">
              <span className="text-xs font-bold text-slate-700 block">Week 0</span>
              <span className="text-[10px] text-slate-400 block">{assessmentW0.date}</span>
            </div>

            <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 aspect-3/4 shadow-xs">
              <img
                src={imgW0}
                alt="Week 0 posture"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-0.5 rounded text-[10px] font-bold font-mono">
                {getMetricBadge(assessmentW0, angleMode)}
              </div>
            </div>
          </div>

          {/* Week 4 Container */}
          <div className="space-y-1.5">
            <div className="text-center">
              <span className="text-xs font-bold text-emerald-700 block">Week 4</span>
              <span className="text-[10px] text-slate-400 block">{assessmentW4.date}</span>
            </div>

            <div className="relative rounded-2xl overflow-hidden bg-slate-900 border-2 border-emerald-500 aspect-3/4 shadow-sm">
              <img
                src={imgW4}
                alt="Week 4 posture"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 bg-emerald-600 text-white px-2 py-0.5 rounded text-[10px] font-bold font-mono shadow">
                {getMetricBadge(assessmentW4, angleMode)}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Overlay Split Slider Mode */
        <div className="space-y-2">
          <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 aspect-3/4 shadow-md select-none touch-none">
            {/* Base Image (Week 4 After) */}
            <img
              src={imgW4}
              alt="Week 4 after"
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Clipped Top Image (Week 0 Before) */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${sliderPosition}%` }}
            >
              <img
                src={imgW0}
                alt="Week 0 before"
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover max-w-none"
                style={{ width: '100%', minWidth: '100%' }}
              />
              <div className="absolute top-3 left-3 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded font-bold">
                ก่อน (Week 0)
              </div>
            </div>

            <div className="absolute top-3 right-3 bg-emerald-950/80 text-emerald-300 text-[10px] px-2 py-0.5 rounded font-bold">
              หลัง (Week 4)
            </div>

            {/* Split Divider Line & Handle */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-white shadow-xl cursor-ew-resize z-20"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-white shadow-lg border border-slate-300 flex items-center justify-center text-slate-700 text-xs font-bold">
                ⇄
              </div>
            </div>
          </div>

          {/* Interactive Range Slider */}
          <div className="px-2">
            <input
              type="range"
              min="0"
              max="100"
              value={sliderPosition}
              onChange={(e) => setSliderPosition(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
              <span>← เลื่อนดู Week 0 (ก่อน)</span>
              <span>เลื่อนดู Week 4 (หลัง) →</span>
            </div>
          </div>
        </div>
      )}

      {/* Quantitative Comparison Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          ตารางเปรียบเทียบผลลัพธ์ (3 มุมมอง & อาการปวด)
        </h2>

        <div className="space-y-3 text-xs divide-y divide-slate-100">
          {metrics.map((item, idx) => (
            <div key={idx} className="pt-2 flex items-center justify-between">
              <div>
                <span className="font-semibold text-slate-800 block">{item.label}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">{item.desc}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-mono text-slate-500">{item.w0}</span>
                <span className="text-slate-300">→</span>
                <span className="font-mono font-bold text-slate-900">{item.w4}</span>
                <span className="px-2 py-0.5 rounded-md font-mono text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {item.diff}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Conclusion Card */}
      <div className="rounded-2xl p-4 bg-emerald-50 border border-emerald-200 flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
          <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-emerald-950">
            ท่าทางโดยรวมดีขึ้นชัดเจนทั้ง 3 ด้าน
          </h3>
          <p className="text-xs text-emerald-800 mt-1 leading-relaxed">
            มุมคอยื่น CVA เพิ่มขึ้นสู่ 51°, ไหล่และสะบักทั้งสองข้างสมดุลขึ้น อาการปวดลดลงและความสามารถในการทำงานดีขึ้นอย่างมีนัยสำคัญ
          </p>
        </div>
      </div>
    </div>
  );
};
