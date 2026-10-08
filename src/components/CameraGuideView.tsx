import React, { useState } from 'react';
import { ArrowLeft, Check, Camera, Eye, Ruler, MoveHorizontal, Footprints, ShieldCheck } from 'lucide-react';
import { SAMPLE_IMAGES } from '../data/mockData';
import { ViewAngle } from '../types';

interface CameraGuideViewProps {
  onBack: () => void;
  onProceedToCapture: (selectedAngle?: ViewAngle) => void;
}

export const CameraGuideView: React.FC<CameraGuideViewProps> = ({
  onBack,
  onProceedToCapture,
}) => {
  const [selectedAngle, setSelectedAngle] = useState<ViewAngle>('side');

  const anglesInfo = {
    side: {
      title: 'ถ่ายด้านข้าง (Side View)',
      desc: 'ตรวจวัด Craniovertebral Angle (CVA), แนวกระดูกสันหลังส่วนคอ และคอยื่น',
      image: SAMPLE_IMAGES.side,
      guidelines: [
        'หันข้าง 90 องศา ขนานกับกล้อง ให้เห็นใบหูและบ่าชัดเจน',
        'กล้องระดับอก สูงประมาณ 100-120 ซม. ห่างตัว 2-3 เมตร',
        'ปล่อยแขนแนบลำตัวตามธรรมชาติ ไม่เกร็งหรือยกคาง',
      ],
    },
    front: {
      title: 'ถ่ายด้านหน้า (Front View)',
      desc: 'ตรวจวัดความสมดุลระดับหัวไหล่ซ้าย-ขวา และการเอียงของศีรษะ',
      image: SAMPLE_IMAGES.front,
      guidelines: [
        'ยืนหันหน้าตรง เท้าขนานกัน กว้างเท่าช่วงไหล่',
        'สายตามองตรงระดับสายตา ปล่อยไหล่สองข้างสบาย',
        'เห็นเต็มตัวตั้งแต่ศีรษะถึงข้อเท้า',
      ],
    },
    back: {
      title: 'ถ่ายด้านหลัง (Back View)',
      desc: 'ตรวจวัดระดับกระดูกสะบัก (Scapular symmetry) และแนวดิ่งกระดูกสันหลัง',
      image: SAMPLE_IMAGES.back,
      guidelines: [
        'ยืนหันหลังตรง ขนานกับเลนส์กล้อง',
        'สังเกตความสูง-ต่ำของแนวขอบล่างกระดูกสะบักซ้ายและขวา',
        'ประเมินแนวกระดูกสันหลังส่วนอกและบั้นเอว',
      ],
    },
  };

  const currentInfo = anglesInfo[selectedAngle];

  return (
    <div className="max-w-md mx-auto px-4 pt-3 pb-24 space-y-4">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-1">
        <button
          onClick={onBack}
          className="p-2 -ml-2 text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-base font-bold text-slate-900">แนะนำการถ่ายภาพ (3 มุมมอง)</h2>
        <div className="w-8" />
      </div>

      {/* 3 View Tabs Selector */}
      <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
        <button
          onClick={() => setSelectedAngle('front')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            selectedAngle === 'front' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          1. ด้านหน้า
        </button>
        <button
          onClick={() => setSelectedAngle('side')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            selectedAngle === 'side' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          2. ด้านข้าง
        </button>
        <button
          onClick={() => setSelectedAngle('back')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            selectedAngle === 'back' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          3. ด้านหลัง
        </button>
      </div>

      {/* Visual Guide Frame */}
      <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-md aspect-3/4 max-h-[320px] flex items-center justify-center">
        <img
          src={currentInfo.image}
          alt={currentInfo.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover opacity-85"
        />

        {/* Alignment Overlay lines */}
        <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4">
          <div className="absolute top-0 bottom-0 left-1/2 w-0.5 border-l-2 border-dashed border-sky-400/80 -translate-x-1/2" />
          <div className="absolute top-[48%] left-0 right-0 h-0.5 border-t border-dashed border-emerald-400/80" />

          <div className="relative z-10 flex justify-between text-[11px] font-medium text-white drop-shadow-md">
            <span className="bg-black/60 px-2 py-0.5 rounded backdrop-blur-xs">ยืนตัวตรง</span>
            <span className="bg-black/60 px-2 py-0.5 rounded backdrop-blur-xs">{currentInfo.title}</span>
          </div>

          <div className="relative z-10 flex justify-between text-[11px] font-medium text-white drop-shadow-md">
            <span className="bg-sky-950/80 border border-sky-400/40 text-sky-200 px-2.5 py-1 rounded backdrop-blur-xs">
              กล้องระดับอก 100-120 ซม.
            </span>
            <span className="bg-emerald-950/80 border border-emerald-400/40 text-emerald-200 px-2.5 py-1 rounded backdrop-blur-xs">
              ระยะห่าง 2-3 เมตร
            </span>
          </div>
        </div>
      </div>

      {/* Angle Description & Guidance Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            {currentInfo.title}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {currentInfo.desc}
          </p>
        </div>

        <div className="space-y-2 pt-1 border-t border-slate-100">
          {currentInfo.guidelines.map((text, idx) => (
            <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
              <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Primary Action Button */}
      <button
        onClick={() => onProceedToCapture(selectedAngle)}
        className="w-full h-12 rounded-xl bg-sky-600 hover:bg-sky-700 active:scale-[0.99] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-md shadow-sky-600/20 transition-all cursor-pointer"
      >
        <Camera className="w-4 h-4" />
        <span>พร้อมแล้ว ถ่ายภาพ ({currentInfo.title})</span>
      </button>
    </div>
  );
};
