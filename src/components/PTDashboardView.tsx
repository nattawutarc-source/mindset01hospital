import React, { useState } from 'react';
import { PatientProfile, ScreenId } from '../types';
import { Users, Plus, Search, CheckCircle2, Clock, AlertCircle, QrCode, ChevronRight, Stethoscope } from 'lucide-react';

interface PTDashboardViewProps {
  patients: PatientProfile[];
  onSelectPatient: (patient: PatientProfile) => void;
  onOpenRegisterModal: () => void;
  onOpenShareModal: (patient: PatientProfile) => void;
  onStartClinicAssessment: (patient: PatientProfile) => void;
}

export const PTDashboardView: React.FC<PTDashboardViewProps> = ({
  patients,
  onSelectPatient,
  onOpenRegisterModal,
  onOpenShareModal,
  onStartClinicAssessment,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'in-progress' | 'not-started'>('all');

  const totalPatients = 10;
  const completedCount = 6;
  const inProgressCount = 3;
  const notStartedCount = 1;

  const filteredPatients = patients.filter((p) => {
    const matchesSearch =
      p.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.condition.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 pt-4 pb-24 space-y-4">
      {/* Top Clinic Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sky-600 font-semibold text-xs">
            <Stethoscope className="w-4 h-4" />
            <span>ระบบจัดการผู้ป่วยคลินิกกายภาพบำบัด</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1">
            แดชบอร์ดนักกายภาพบำบัด
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            ติดตามท่าทาง ออกกำลังกาย และอาการปวด รายบุคคลอย่างปลอดภัย
          </p>
        </div>

        {/* Register New Patient Button */}
        <button
          onClick={onOpenRegisterModal}
          className="h-11 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md shadow-sky-600/20 transition-colors cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>เพิ่มผู้ป่วยใหม่ (สร้างรหัสอัตโนมัติ)</span>
        </button>
      </div>

      {/* Metric Counters Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Total */}
        <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs">
          <span className="text-[11px] font-medium text-slate-500 block">ผู้ป่วยทั้งหมด</span>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-1">
            {totalPatients} <span className="text-xs font-normal text-slate-500">คน</span>
          </div>
        </div>

        {/* Completed */}
        <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs">
          <span className="text-[11px] font-medium text-emerald-600 block">ทำครบ 4 สัปดาห์</span>
          <div className="text-2xl font-bold font-mono text-emerald-600 mt-1">
            {completedCount} <span className="text-xs font-normal text-slate-500">คน</span>
          </div>
        </div>

        {/* In Progress */}
        <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs">
          <span className="text-[11px] font-medium text-amber-600 block">กำลังดำเนินการ</span>
          <div className="text-2xl font-bold font-mono text-amber-600 mt-1">
            {inProgressCount} <span className="text-xs font-normal text-slate-500">คน</span>
          </div>
        </div>

        {/* Not started */}
        <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs">
          <span className="text-[11px] font-medium text-slate-400 block">ยังไม่เริ่ม</span>
          <div className="text-2xl font-bold font-mono text-rose-500 mt-1">
            {notStartedCount} <span className="text-xs font-normal text-slate-500">คน</span>
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="ค้นหารหัสผู้ป่วย, HN, อาการ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white rounded-xl border border-slate-200 text-xs focus:outline-sky-500"
          />
        </div>

        {/* Status Filter Buttons */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1 rounded-lg font-medium transition-colors ${
              statusFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            ทั้งหมด
          </button>
          <button
            onClick={() => setStatusFilter('completed')}
            className={`px-3 py-1 rounded-lg font-medium transition-colors ${
              statusFilter === 'completed' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600'
            }`}
          >
            ทำครบ
          </button>
          <button
            onClick={() => setStatusFilter('in-progress')}
            className={`px-3 py-1 rounded-lg font-medium transition-colors ${
              statusFilter === 'in-progress' ? 'bg-white text-amber-700 shadow-xs' : 'text-slate-600'
            }`}
          >
            กำลังทำ
          </button>
        </div>
      </div>

      {/* Patients Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
              <tr>
                <th className="py-3 px-4">รหัสผู้ป่วย</th>
                <th className="py-3 px-4">ชื่อ / อาการ</th>
                <th className="py-3 px-4 text-center">สัปดาห์ล่าสุด</th>
                <th className="py-3 px-4 text-center">CVA (องศา)</th>
                <th className="py-3 px-4 text-center">ปวด (งาน)</th>
                <th className="py-3 px-4 text-center">การทำ HEP</th>
                <th className="py-3 px-4 text-right">การจัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPatients.map((patient) => (
                <tr
                  key={patient.id}
                  className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                  onClick={() => onSelectPatient(patient)}
                >
                  {/* Code */}
                  <td className="py-3.5 px-4 font-mono font-bold text-sky-700">
                    {patient.code}
                  </td>

                  {/* Name & Condition */}
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-slate-900 block">
                      {patient.name}
                    </span>
                    <span className="text-[11px] text-slate-500 block truncate max-w-xs">
                      {patient.condition}
                    </span>
                  </td>

                  {/* Latest Week */}
                  <td className="py-3.5 px-4 text-center">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700">
                      {patient.latestWeek}
                    </span>
                  </td>

                  {/* CVA */}
                  <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-800">
                    {patient.cvaCurrent}°
                  </td>

                  {/* Pain (Work) */}
                  <td className="py-3.5 px-4 text-center font-mono">
                    <span className={`font-bold ${patient.workPainCurrent <= 3 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {patient.workPainCurrent}/10
                    </span>
                  </td>

                  {/* HEP Compliance */}
                  <td className="py-3.5 px-4 text-center font-mono font-medium">
                    <span className="text-slate-700">{patient.hepCompliance}%</span>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onOpenShareModal(patient)}
                        title="ดู QR / ลิงก์สำหรับผู้ป่วย"
                        className="p-1.5 rounded-lg text-slate-500 hover:text-sky-600 hover:bg-slate-100 transition-colors"
                      >
                        <QrCode className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onSelectPatient(patient)}
                        className="px-2.5 py-1 rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-100 font-medium text-[11px] flex items-center gap-1 transition-colors"
                      >
                        <span>ตรวจประเมิน</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
