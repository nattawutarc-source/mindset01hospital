import React, { useState, useEffect } from 'react';
import { X, Save, Edit3, Activity, Trash2 } from 'lucide-react';
import { PostureAssessment } from '../types';

interface EditAssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  assessment: PostureAssessment | null;
  onSave: (updated: PostureAssessment) => void;
  onDelete?: (assessmentId: string) => void;
}

export const EditAssessmentModal: React.FC<EditAssessmentModalProps> = ({
  isOpen,
  onClose,
  assessment,
  onSave,
  onDelete,
}) => {
  const [date, setDate] = useState('');
  const [week, setWeek] = useState(0);
  const [cvaAngle, setCvaAngle] = useState(48.0);
  const [shoulderC7Angle, setShoulderC7Angle] = useState(20.0);
  const [shoulderTiltDeg, setShoulderTiltDeg] = useState(2.0);
  const [scapularTiltDeg, setScapularTiltDeg] = useState(1.5);
  const [restPain, setRestPain] = useState(3);
  const [workPain, setWorkPain] = useState(6);
  const [trunkAlignment, setTrunkAlignment] = useState<'อยู่ในแนว' | 'เอียงเล็กน้อย' | 'แอ่นหลัง'>('อยู่ในแนว');
  const [ptNotes, setPtNotes] = useState('');

  useEffect(() => {
    if (assessment) {
      setDate(assessment.date || '');
      setWeek(assessment.week || 0);
      setCvaAngle(assessment.cvaAngle || 48.0);
      setShoulderC7Angle(assessment.shoulderC7Angle || 20.0);
      setShoulderTiltDeg(assessment.shoulderTiltDeg || 2.0);
      setScapularTiltDeg(assessment.scapularTiltDeg || 1.5);
      setRestPain(assessment.restPain ?? 3);
      setWorkPain(assessment.workPain ?? 6);
      setTrunkAlignment(assessment.trunkAlignment || 'อยู่ในแนว');
      setPtNotes(assessment.ptNotes || '');
    }
  }, [assessment]);

  if (!isOpen || !assessment) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: PostureAssessment = {
      ...assessment,
      date,
      week: Number(week),
      cvaAngle: Number(cvaAngle),
      shoulderC7Angle: Number(shoulderC7Angle),
      shoulderTiltDeg: Number(shoulderTiltDeg),
      scapularTiltDeg: Number(scapularTiltDeg),
      restPain: Number(restPain),
      workPain: Number(workPain),
      trunkAlignment,
      ptNotes,
    };
    onSave(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl relative border border-slate-100 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 block">
              แก้ไขข้อมูลการประเมินท่าทาง (Admin)
            </span>
            <h3 className="text-base font-bold text-slate-900">
              ผลตรวจสัปดาห์ที่ {assessment.week} ({assessment.date})
            </h3>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-left text-xs">
          {/* Week & Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-600 font-semibold block mb-1">
                สัปดาห์ที่ตรวจ (Week)
              </label>
              <input
                type="number"
                min="0"
                max="12"
                value={week}
                onChange={(e) => setWeek(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-indigo-500 font-mono"
              />
            </div>
            <div>
              <label className="text-slate-600 font-semibold block mb-1">
                วันที่ตรวจ
              </label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="เช่น 5 ต.ค. 2025"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-indigo-500"
              />
            </div>
          </div>

          {/* Angles: CVA, ShoulderC7 */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-600 font-semibold block mb-1">
                มุมคอยื่น CVA (องศา °)
              </label>
              <input
                type="number"
                step="0.1"
                value={cvaAngle}
                onChange={(e) => setCvaAngle(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-indigo-500 font-mono"
              />
            </div>
            <div>
              <label className="text-slate-600 font-semibold block mb-1">
                Shoulder-C7 Angle (°)
              </label>
              <input
                type="number"
                step="0.1"
                value={shoulderC7Angle}
                onChange={(e) => setShoulderC7Angle(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-indigo-500 font-mono"
              />
            </div>
          </div>

          {/* Tilts: Shoulder Tilt & Scapular Tilt */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-600 font-semibold block mb-1">
                ระดับไหล่เอียง (°)
              </label>
              <input
                type="number"
                step="0.1"
                value={shoulderTiltDeg}
                onChange={(e) => setShoulderTiltDeg(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-indigo-500 font-mono"
              />
            </div>
            <div>
              <label className="text-slate-600 font-semibold block mb-1">
                ระดับสะบักเอียง (°)
              </label>
              <input
                type="number"
                step="0.1"
                value={scapularTiltDeg}
                onChange={(e) => setScapularTiltDeg(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-indigo-500 font-mono"
              />
            </div>
          </div>

          {/* Pain levels */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-600 font-semibold block mb-1">
                ปวดขณะพัก (0-10)
              </label>
              <input
                type="number"
                min="0"
                max="10"
                value={restPain}
                onChange={(e) => setRestPain(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-indigo-500 font-mono"
              />
            </div>
            <div>
              <label className="text-slate-600 font-semibold block mb-1">
                ปวดขณะทำงาน (0-10)
              </label>
              <input
                type="number"
                min="0"
                max="10"
                value={workPain}
                onChange={(e) => setWorkPain(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-indigo-500 font-mono"
              />
            </div>
          </div>

          {/* Trunk Alignment */}
          <div>
            <label className="text-slate-600 font-semibold block mb-1">
              การเรียงตัวของลำตัว (Trunk)
            </label>
            <select
              value={trunkAlignment}
              onChange={(e) => setTrunkAlignment(e.target.value as any)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-indigo-500"
            >
              <option value="อยู่ในแนว">อยู่ในแนวปกติ (Aligned)</option>
              <option value="เอียงเล็กน้อย">เอียงเล็กน้อย (Slight Tilt)</option>
              <option value="แอ่นหลัง">แอ่นหลัง / หลังค่อม</option>
            </select>
          </div>

          {/* PT Notes */}
          <div>
            <label className="text-slate-600 font-semibold block mb-1">
              บันทึกข้อคิดเห็นของนักกายภาพ
            </label>
            <textarea
              rows={3}
              value={ptNotes}
              onChange={(e) => setPtNotes(e.target.value)}
              placeholder="บันทึกผลการตรวจและคำแนะนำ..."
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-indigo-500 leading-relaxed"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 pt-2">
            {onDelete && (
              <button
                type="button"
                onClick={() => {
                  onDelete(assessment.id);
                  onClose();
                }}
                className="p-2.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 font-semibold text-xs transition-colors cursor-pointer shrink-0"
                title="ลบผลการประเมินนี้"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs transition-colors cursor-pointer"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>บันทึกการแก้ไข</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
