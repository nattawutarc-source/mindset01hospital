import React, { useState } from 'react';
import { PatientProfile, PostureAssessment, ViewAngle } from '../types';
import { ArrowLeft, QrCode, Camera, Check, FileText, Activity, Dumbbell, Sparkles, MessageCircle } from 'lucide-react';
import { SAMPLE_IMAGES } from '../data/mockData';

interface PTPatientDetailViewProps {
  patient: PatientProfile;
  onBack: () => void;
  onOpenShareModal: (patient: PatientProfile) => void;
  onStartClinicCapture: () => void;
  onUpdateNotes: (patientId: string, notes: string) => void;
}

export const PTPatientDetailView: React.FC<PTPatientDetailViewProps> = ({
  patient,
  onBack,
  onOpenShareModal,
  onStartClinicCapture,
  onUpdateNotes,
}) => {
  const [activeTab, setActiveTab] = useState<'posture' | 'pain' | 'hep'>('posture');
  const [activeAngle, setActiveAngle] = useState<ViewAngle>('side');
  const [ptNote, setPtNote] = useState(
    patient.assessments[0]?.ptNotes ||
      'คนไข้มีภาวะ Forward Head Posture ชัดเจน ตอบสนองดีมากต่อท่า Chin Tuck และการยืด Upper Trapezius'
  );
  const [savedNoteSuccess, setSavedNoteSuccess] = useState(false);

  const asm0 = patient.assessments[0] || {
    cvaAngle: 46.2,
    workPain: 7,
    restPain: 4,
    shoulderTiltDeg: 2.8,
    scapularTiltDeg: 2.5,
    date: '5 ต.ค. 2026',
    sideImageUrl: SAMPLE_IMAGES.side,
    frontImageUrl: SAMPLE_IMAGES.front,
    backImageUrl: SAMPLE_IMAGES.back,
  };

  const asm4 = patient.assessments[1] || {
    cvaAngle: 50.1,
    workPain: 3,
    restPain: 1,
    shoulderTiltDeg: 1.5,
    scapularTiltDeg: 1.1,
    date: '2 พ.ย. 2026',
    sideImageUrl: SAMPLE_IMAGES.side,
    frontImageUrl: SAMPLE_IMAGES.front,
    backImageUrl: SAMPLE_IMAGES.back,
  };

  const getImg = (asm: PostureAssessment, angle: ViewAngle) => {
    if (angle === 'front') return asm.frontImageUrl || SAMPLE_IMAGES.front;
    if (angle === 'back') return asm.backImageUrl || SAMPLE_IMAGES.back;
    return asm.sideImageUrl || SAMPLE_IMAGES.side;
  };

  const getBadge = (asm: PostureAssessment, angle: ViewAngle) => {
    if (angle === 'front') return `ไหล่ ${asm.shoulderTiltDeg}°`;
    if (angle === 'back') return `สะบัก ${asm.scapularTiltDeg || 1.1}°`;
    return `CVA ${asm.cvaAngle}°`;
  };

  const handleSaveNotes = () => {
    onUpdateNotes(patient.id, ptNote);
    setSavedNoteSuccess(true);
    setTimeout(() => setSavedNoteSuccess(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 pt-4 pb-24 space-y-4">
      {/* Top Patient Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 -ml-2 text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-base text-sky-700">
                {patient.code}
              </span>
              <span className="text-sm font-semibold text-slate-900">
                {patient.name}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{patient.condition}</p>
          </div>
        </div>

        {/* Share QR & Link Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenShareModal(patient)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 hover:border-sky-300 text-slate-700 hover:text-sky-600 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <QrCode className="w-4 h-4 text-sky-600" />
            <span>QR & ลิงก์คนไข้</span>
          </button>

          <button
            onClick={onStartClinicCapture}
            className="px-3.5 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
          >
            <Camera className="w-4 h-4" />
            <span>ตรวจวัดที่คลินิก</span>
          </button>
        </div>
      </div>

      {/* Segmented Detail Tabs */}
      <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
        <button
          onClick={() => setActiveTab('posture')}
          className={`flex-1 py-2 font-semibold rounded-lg transition-all text-center ${
            activeTab === 'posture' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
          }`}
        >
          ภาพและมุม (Posture)
        </button>
        <button
          onClick={() => setActiveTab('pain')}
          className={`flex-1 py-2 font-semibold rounded-lg transition-all text-center ${
            activeTab === 'pain' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
          }`}
        >
          อาการปวด (Pain Trends)
        </button>
        <button
          onClick={() => setActiveTab('hep')}
          className={`flex-1 py-2 font-semibold rounded-lg transition-all text-center ${
            activeTab === 'hep' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
          }`}
        >
          การทำ HEP (Compliance)
        </button>
      </div>

      {/* Tab 1: ภาพและมุม (Week 0 vs Week 4) */}
      {activeTab === 'posture' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                เปรียบเทียบภาพตรวจร่างกาย (สัปดาห์ที่ 0 vs สัปดาห์ที่ 4)
              </h3>

              {/* 3 Angle Mode Selector */}
              <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
                <button
                  onClick={() => setActiveAngle('side')}
                  className={`px-3 py-1 font-semibold rounded-md transition-all ${
                    activeAngle === 'side' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  ด้านข้าง (CVA)
                </button>
                <button
                  onClick={() => setActiveAngle('front')}
                  className={`px-3 py-1 font-semibold rounded-md transition-all ${
                    activeAngle === 'front' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  ด้านหน้า (ไหล่)
                </button>
                <button
                  onClick={() => setActiveAngle('back')}
                  className={`px-3 py-1 font-semibold rounded-md transition-all ${
                    activeAngle === 'back' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  ด้านหลัง (สะบัก)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Week 0 */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">สัปดาห์ที่ 0</span>
                  <span className="text-slate-400 font-mono text-[11px]">{asm0.date}</span>
                </div>
                <div className="relative rounded-2xl overflow-hidden bg-slate-900 aspect-3/4 border border-slate-200">
                  <img
                    src={getImg(asm0, activeAngle)}
                    alt="Week 0"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-0.5 rounded text-[10px] font-bold font-mono">
                    {getBadge(asm0, activeAngle)}
                  </div>
                </div>
              </div>

              {/* Week 4 */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-emerald-700">สัปดาห์ที่ 4</span>
                  <span className="text-slate-400 font-mono text-[11px]">{asm4.date}</span>
                </div>
                <div className="relative rounded-2xl overflow-hidden bg-slate-900 aspect-3/4 border-2 border-emerald-500">
                  <img
                    src={getImg(asm4, activeAngle)}
                    alt="Week 4"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-emerald-600 text-white px-2 py-0.5 rounded text-[10px] font-bold font-mono">
                    {getBadge(asm4, activeAngle)}
                  </div>
                </div>
              </div>
            </div>

            {/* Metrics Delta Strip */}
            <div className="grid grid-cols-3 gap-3 pt-2 border-t border-slate-100 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-[10px] text-slate-500 block">CVA (องศา)</span>
                <div className="mt-1 flex items-baseline gap-1.5">
                  <span className="font-mono font-bold text-slate-800">{asm0.cvaAngle}° → {asm4.cvaAngle}°</span>
                  <span className="text-emerald-600 font-bold font-mono text-[11px]">
                    (+{(asm4.cvaAngle - asm0.cvaAngle).toFixed(1)}°)
                  </span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-[10px] text-slate-500 block">ปวดขณะทำงาน</span>
                <div className="mt-1 flex items-baseline gap-1.5">
                  <span className="font-mono font-bold text-slate-800">{asm0.workPain} → {asm4.workPain}</span>
                  <span className="text-emerald-600 font-bold font-mono text-[11px]">
                    (-{asm0.workPain - asm4.workPain})
                  </span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-[10px] text-slate-500 block">การทำ HEP สม่ำเสมอ</span>
                <div className="mt-1">
                  <span className="font-mono font-bold text-emerald-600 text-sm">
                    {patient.hepCompliance}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: อาการปวด (Pain Trends) */}
      {activeTab === 'pain' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              แนวโน้มระดับความปวด 4 สัปดาห์ (NRS 0–10)
            </h3>
            <span className="text-[10px] text-slate-400">บันทึกสม่ำเสมอทุกสัปดาห์</span>
          </div>

          {/* Simple Visual Bar Trend */}
          <div className="h-44 flex items-end justify-between gap-3 pt-6 px-2 border-b border-slate-100">
            {[
              { week: 'W0', rest: 4, work: 7 },
              { week: 'W1', rest: 3, work: 6 },
              { week: 'W2', rest: 2, work: 5 },
              { week: 'W3', rest: 2, work: 4 },
              { week: 'W4', rest: 1, work: 3 },
            ].map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                <div className="w-full flex items-end justify-center gap-1 h-32">
                  {/* Rest pain bar */}
                  <div
                    style={{ height: `${(d.rest / 10) * 100}%` }}
                    className="w-3 bg-amber-400 rounded-t-sm"
                    title={`พัก: ${d.rest}/10`}
                  />
                  {/* Work pain bar */}
                  <div
                    style={{ height: `${(d.work / 10) * 100}%` }}
                    className="w-3 bg-rose-500 rounded-t-sm"
                    title={`ทำงาน: ${d.work}/10`}
                  />
                </div>
                <span className="text-[11px] font-mono font-semibold text-slate-600 mt-1">
                  {d.week}
                </span>
                <span className="text-[9px] text-slate-400 font-mono">
                  {d.work}pt
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-6 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-xs bg-amber-400" />
              <span>ปวดขณะพัก</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-xs bg-rose-500" />
              <span>ปวดขณะทำงาน</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: การทำ HEP */}
      {activeTab === 'hep' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              ความสม่ำเสมอในการทำกายภาพที่บ้าน (HEP)
            </h3>
            <span className="text-xs font-bold font-mono text-emerald-600">
              ความสำเร็จ {patient.hepCompliance}%
            </span>
          </div>

          <div className="space-y-3">
            {[
              { name: 'Chin Tuck (เก็บคาง)', target: '10 ครั้ง x 2 เซต', rate: 90 },
              { name: 'Upper Trapezius Stretch (ยืดบ่า)', target: '30 วินาที x 3 ครั้ง', rate: 85 },
              { name: 'Thoracic Extension (แอ่นอก)', target: '10 ครั้ง x 2 เซต', rate: 80 },
              { name: 'Scapular Retraction (บีบสะบัก)', target: '10 ครั้ง x 2 เซต', rate: 75 },
              { name: 'Pectoralis Stretch (ยืดอก)', target: '30 วินาที x 3 ครั้ง', rate: 70 },
            ].map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-800">{item.name}</span>
                  <span className="font-mono text-slate-500">{item.rate}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-sky-600 rounded-full"
                    style={{ width: `${item.rate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PT Clinical Notes Editor */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-sky-600" />
            <h3 className="text-xs font-bold text-slate-800">
              บันทึกการรักษาของนักกายภาพบำบัด (PT Progress Notes)
            </h3>
          </div>
          {savedNoteSuccess && (
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> บันทึกแล้ว
            </span>
          )}
        </div>

        <textarea
          rows={3}
          value={ptNote}
          onChange={(e) => setPtNote(e.target.value)}
          placeholder="บันทึกข้อสังเกตทางการตรวจรักษา หรือข้อแนะนำเพิ่มเติมสำหรับผู้ป่วย..."
          className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-sky-500 leading-relaxed"
        />

        <div className="flex justify-end">
          <button
            onClick={handleSaveNotes}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            บันทึกโน้ตการรักษา
          </button>
        </div>
      </div>
    </div>
  );
};
