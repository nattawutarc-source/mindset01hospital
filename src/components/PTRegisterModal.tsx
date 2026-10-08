import React, { useState } from 'react';
import { X, Sparkles, UserPlus } from 'lucide-react';
import { PatientProfile } from '../types';

interface PTRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  nextCode: string;
  onRegister: (newPatient: PatientProfile) => void;
}

export const PTRegisterModal: React.FC<PTRegisterModalProps> = ({
  isOpen,
  onClose,
  nextCode,
  onRegister,
}) => {
  const [name, setName] = useState('');
  const [hn, setHn] = useState('');
  const [condition, setCondition] = useState('ออฟฟิศซินโดรม / คอยื่น (Forward Head)');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPatient: PatientProfile = {
      id: nextCode,
      code: nextCode,
      name: name.trim() || `ผู้ป่วยใหม่ (${nextCode})`,
      hn: hn.trim() ? `HN: ${hn.trim()}` : `HN: ${Math.floor(100000 + Math.random() * 900000)}`,
      condition: condition.trim() || 'ออฟฟิศซินโดรม',
      startDate: new Date().toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' }),
      latestWeek: 'W0',
      status: 'not-started',
      cvaCurrent: 45.0,
      workPainCurrent: 6,
      hepCompliance: 0,
      assessments: [],
      symptomLogs: [],
    };

    onRegister(newPatient);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-sky-600 block">
            PT Clinical Setup
          </span>
          <h3 className="text-lg font-bold text-slate-900 mt-0.5">
            เพิ่มผู้ป่วยใหม่
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            สร้างรหัสเฉพาะเพื่อสร้างลิงก์และ QR ติดตามผล
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-left text-xs">
          {/* Auto Generated Code */}
          <div>
            <label className="text-slate-600 font-semibold block mb-1">
              รหัสผู้ป่วย (สร้างอัตโนมัติ)
            </label>
            <div className="w-full px-3 py-2.5 bg-slate-100 border border-slate-200 rounded-xl font-mono font-bold text-sky-700 flex items-center justify-between">
              <span>{nextCode}</span>
              <span className="text-[10px] font-sans font-medium text-slate-400">สร้างอัตโนมัติ</span>
            </div>
          </div>

          {/* Name or Nickname */}
          <div>
            <label className="text-slate-600 font-semibold block mb-1">
              ชื่อ หรือชื่อย่อผู้ป่วย
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="เช่น คุณศิริพร หรือ คุณนภัส น."
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-sky-500"
            />
          </div>

          {/* HN */}
          <div>
            <label className="text-slate-600 font-semibold block mb-1">
              HN (ตามต้องการ / ไม่จำเป็น)
            </label>
            <input
              type="text"
              value={hn}
              onChange={(e) => setHn(e.target.value)}
              placeholder="เช่น 138xxx"
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-sky-500"
            />
          </div>

          {/* Clinical condition / note */}
          <div>
            <label className="text-slate-600 font-semibold block mb-1">
              หมายเหตุ / อาการเริ่มต้น
            </label>
            <input
              type="text"
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              placeholder="เช่น ออฟฟิศซินโดรม, คอยื่น, ปวดสะบัก"
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-sky-500"
            />
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full h-11 rounded-xl bg-sky-600 hover:bg-sky-700 active:scale-[0.99] text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md shadow-sky-600/20 cursor-pointer transition-all"
            >
              <UserPlus className="w-4 h-4" />
              <span>สร้างลิงก์สำหรับผู้ป่วย</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
