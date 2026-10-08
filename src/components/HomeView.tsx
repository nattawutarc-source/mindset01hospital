import React from 'react';
import { ScreenId, PatientProfile } from '../types';
import { Camera, Dumbbell, ClipboardEdit, BookOpen, LineChart, ChevronRight, Sparkles, CheckCircle2 } from 'lucide-react';

interface HomeViewProps {
  patient: PatientProfile;
  onNavigate: (screen: ScreenId) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ patient, onNavigate }) => {
  return (
    <div className="max-w-md mx-auto px-4 pt-4 pb-24 space-y-4">
      {/* Greeting Banner */}
      <div className="bg-gradient-to-br from-sky-50 to-blue-50/70 border border-sky-100/80 rounded-2xl p-5 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
              <span>สวัสดีค่ะ</span>
              <span className="text-base text-sky-600 font-semibold">{patient.name}</span>
            </h1>
            <p className="text-sm text-slate-600 mt-1 leading-relaxed">
              เริ่มดูแลท่าทางและอาการของคุณไปด้วยกัน ❤️
            </p>
          </div>
          <div className="w-10 h-10 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-sm shrink-0 border border-sky-200">
            {patient.code}
          </div>
        </div>

        {/* Current Status Highlights */}
        <div className="mt-4 pt-3 border-t border-sky-100 flex items-center justify-between text-xs text-slate-600">
          <div>
            <span className="text-slate-400 block text-[10px]">โปรแกรมสัปดาห์</span>
            <span className="font-semibold text-slate-800">{patient.latestWeek} (4 สัปดาห์)</span>
          </div>
          <div className="h-6 w-px bg-sky-200/60" />
          <div>
            <span className="text-slate-400 block text-[10px]">CVA ล่าสุด</span>
            <span className="font-semibold text-sky-700 font-mono">{patient.cvaCurrent}°</span>
          </div>
          <div className="h-6 w-px bg-sky-200/60" />
          <div>
            <span className="text-slate-400 block text-[10px]">การทำ HEP</span>
            <span className="font-semibold text-emerald-600 font-mono">{patient.hepCompliance}%</span>
          </div>
        </div>
      </div>

      {/* Main Action 1: เริ่มประเมินท่าทาง (Hero Card) */}
      <button
        onClick={() => onNavigate('camera-guide')}
        className="w-full text-left bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white p-5 rounded-2xl shadow-md shadow-sky-600/15 flex items-center justify-between transition-all group active:scale-[0.99]"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white shrink-0 group-hover:scale-105 transition-transform">
            <Camera className="w-6 h-6" />
          </div>
          <div>
            <span className="text-lg font-bold block leading-tight">เริ่มประเมินท่าทาง</span>
            <span className="text-xs text-sky-100 mt-0.5 block">
              ถ่ายภาพด้านข้างและด้านหน้า วัดมุม CVA แบบเรียลไทม์
            </span>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-sky-200 group-hover:translate-x-0.5 transition-transform shrink-0" />
      </button>

      {/* Secondary Action Cards */}
      <div className="space-y-2.5">
        {/* HEP Exercise Program */}
        <button
          onClick={() => onNavigate('exercise-list')}
          className="w-full text-left bg-white hover:bg-slate-50 border border-slate-200/90 p-4 rounded-xl shadow-xs flex items-center justify-between transition-all group active:scale-[0.99]"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <Dumbbell className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <span>โปรแกรมออกกำลังกาย (HEP)</span>
                <span className="text-[10px] px-1.5 py-0.5 bg-indigo-50 text-indigo-700 font-medium rounded">
                  4 สัปดาห์
                </span>
              </div>
              <span className="text-xs text-slate-500 block mt-0.5">
                5 ท่ากายภาพบำบัดเฉพาะบุคคล พร้อมวิดีโอสาธิต
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
        </button>

        {/* บันทึกอาการปวด */}
        <button
          onClick={() => onNavigate('symptom-tracker')}
          className="w-full text-left bg-white hover:bg-slate-50 border border-slate-200/90 p-4 rounded-xl shadow-xs flex items-center justify-between transition-all group active:scale-[0.99]"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
              <ClipboardEdit className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <span>บันทึกอาการปวด</span>
                <span className="text-[10px] px-1.5 py-0.5 bg-rose-50 text-rose-700 font-medium rounded">
                  NRS 0-10
                </span>
              </div>
              <span className="text-xs text-slate-500 block mt-0.5">
                ประเมินอาการขณะพักและทำงาน ไม่ถึง 1 นาที
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
        </button>

        {/* ความรู้/บทความ */}
        <button
          onClick={() => onNavigate('articles')}
          className="w-full text-left bg-white hover:bg-slate-50 border border-slate-200/90 p-4 rounded-xl shadow-xs flex items-center justify-between transition-all group active:scale-[0.99]"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-bold text-slate-800 block">ความรู้/บทความ</span>
              <span className="text-xs text-slate-500 block mt-0.5">
                การยศาสตร์และวิธีดูแลต้นคอสำหรับชาวออฟฟิศ
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
        </button>

        {/* ติดตามความก้าวหน้า */}
        <button
          onClick={() => onNavigate('progress-comparison')}
          className="w-full text-left bg-white hover:bg-slate-50 border border-slate-200/90 p-4 rounded-xl shadow-xs flex items-center justify-between transition-all group active:scale-[0.99]"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <LineChart className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <span>ติดตามความก้าวหน้า</span>
                <span className="text-[10px] px-1.5 py-0.5 bg-emerald-50 text-emerald-700 font-medium rounded flex items-center gap-0.5">
                  <CheckCircle2 className="w-3 h-3" /> Week 0 → Week 4
                </span>
              </div>
              <span className="text-xs text-slate-500 block mt-0.5">
                เปรียบเทียบภาพก่อน-หลัง และองศา CVA ที่ดีขึ้น
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Helpful Clinical Note */}
      <div className="rounded-xl p-3.5 bg-slate-50 border border-slate-200 text-xs text-slate-500 flex items-start gap-2.5">
        <Sparkles className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          แอปพลิเคชันนี้ออกแบบตามมาตรฐานกายภาพบำบัด เพื่อให้คุณและนักกายภาพเห็นการเปลี่ยนแปลงของท่าทางและระดับความปวดอย่างเป็นรูปธรรม
        </p>
      </div>
    </div>
  );
};
