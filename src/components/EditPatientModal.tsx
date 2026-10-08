import React, { useState, useEffect } from 'react';
import { X, Save, Edit3, User, Activity } from 'lucide-react';
import { PatientProfile } from '../types';

interface EditPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: PatientProfile | null;
  onSave: (updatedPatient: PatientProfile) => void;
}

export const EditPatientModal: React.FC<EditPatientModalProps> = ({
  isOpen,
  onClose,
  patient,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [hn, setHn] = useState('');
  const [condition, setCondition] = useState('');
  const [status, setStatus] = useState<'completed' | 'in-progress' | 'not-started'>('in-progress');
  const [latestWeek, setLatestWeek] = useState('W0');
  const [cvaCurrent, setCvaCurrent] = useState(48);
  const [workPainCurrent, setWorkPainCurrent] = useState(5);
  const [hepCompliance, setHepCompliance] = useState(80);

  useEffect(() => {
    if (patient) {
      setName(patient.name);
      setHn(patient.hn);
      setCondition(patient.condition);
      setStatus(patient.status);
      setLatestWeek(patient.latestWeek);
      setCvaCurrent(patient.cvaCurrent);
      setWorkPainCurrent(patient.workPainCurrent);
      setHepCompliance(patient.hepCompliance);
    }
  }, [patient]);

  if (!isOpen || !patient) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: PatientProfile = {
      ...patient,
      name: name.trim() || patient.name,
      hn: hn.trim() || patient.hn,
      condition: condition.trim() || patient.condition,
      status,
      latestWeek,
      cvaCurrent: Number(cvaCurrent),
      workPainCurrent: Number(workPainCurrent),
      hepCompliance: Number(hepCompliance),
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
          <div className="w-10 h-10 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 shrink-0">
            <Edit3 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-sky-600 block">
              แก้ไขข้อมูลโดย Admin
            </span>
            <h3 className="text-base font-bold text-slate-900">
              แก้ไขข้อมูลผู้ป่วย ({patient.code})
            </h3>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-left text-xs">
          {/* Patient Code (Readonly) */}
          <div>
            <label className="text-slate-600 font-semibold block mb-1">
              รหัสผู้ป่วย (Patient ID)
            </label>
            <input
              type="text"
              disabled
              value={patient.code}
              className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl font-mono text-slate-500 cursor-not-allowed"
            />
          </div>

          {/* Name */}
          <div>
            <label className="text-slate-600 font-semibold block mb-1">
              ชื่อ - นามสกุล หรือชื่อย่อ
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-sky-500"
            />
          </div>

          {/* HN */}
          <div>
            <label className="text-slate-600 font-semibold block mb-1">
              เลขประจำตัวผู้ป่วย (HN)
            </label>
            <input
              type="text"
              value={hn}
              onChange={(e) => setHn(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-sky-500 font-mono"
            />
          </div>

          {/* Diagnosis / Condition */}
          <div>
            <label className="text-slate-600 font-semibold block mb-1">
              การวินิจฉัย / อาการนำ
            </label>
            <textarea
              rows={2}
              required
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-sky-500"
            />
          </div>

          {/* Status & Latest Week */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-600 font-semibold block mb-1">
                สถานะการรักษา
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-sky-500"
              >
                <option value="in-progress">กำลังดำเนินการ (In Progress)</option>
                <option value="completed">เสร็จสิ้น 4 สัปดาห์ (Completed)</option>
                <option value="not-started">ยังไม่เริ่ม (Not Started)</option>
              </select>
            </div>

            <div>
              <label className="text-slate-600 font-semibold block mb-1">
                สัปดาห์ล่าสุด
              </label>
              <select
                value={latestWeek}
                onChange={(e) => setLatestWeek(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-sky-500 font-mono"
              >
                <option value="W0">W0 (ตรวจครั้งแรก)</option>
                <option value="W1">W1 (สัปดาห์ที่ 1)</option>
                <option value="W2">W2 (สัปดาห์ที่ 2)</option>
                <option value="W3">W3 (สัปดาห์ที่ 3)</option>
                <option value="W4">W4 (สัปดาห์ที่ 4)</option>
              </select>
            </div>
          </div>

          {/* CVA, Work Pain, HEP Compliance */}
          <div className="grid grid-cols-3 gap-2.5">
            <div>
              <label className="text-slate-600 font-semibold block mb-1">
                CVA ปัจจุบัน (°)
              </label>
              <input
                type="number"
                step="0.1"
                value={cvaCurrent}
                onChange={(e) => setCvaCurrent(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-sky-500 font-mono"
              />
            </div>

            <div>
              <label className="text-slate-600 font-semibold block mb-1">
                ปวดทำงาน (0-10)
              </label>
              <input
                type="number"
                min="0"
                max="10"
                value={workPainCurrent}
                onChange={(e) => setWorkPainCurrent(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-sky-500 font-mono"
              />
            </div>

            <div>
              <label className="text-slate-600 font-semibold block mb-1">
                ทำ HEP (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={hepCompliance}
                onChange={(e) => setHepCompliance(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-sky-500 font-mono"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs transition-colors cursor-pointer"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 active:scale-[0.99] text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-sky-600/20 transition-all cursor-pointer"
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
