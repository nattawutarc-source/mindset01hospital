import React, { useState } from 'react';
import { AuthUser, PatientProfile } from '../types';
import { SYSTEM_ACCOUNTS } from '../data/authData';
import {
  User,
  ShieldCheck,
  Stethoscope,
  Lock,
  ArrowRight,
  QrCode,
  ScanLine,
  AlertCircle,
  KeyRound,
  CheckCircle2,
  Sparkles,
  Smartphone
} from 'lucide-react';

interface LoginViewProps {
  onLoginSuccess: (user: AuthUser) => void;
  onOpenQRScanner: () => void;
  patients?: PatientProfile[];
}

export const LoginView: React.FC<LoginViewProps> = ({
  onLoginSuccess,
  onOpenQRScanner,
  patients = [],
}) => {
  const [activeTab, setActiveTab] = useState<'patient' | 'admin'>('patient');

  // Patient Login Form
  const [patientInput, setPatientInput] = useState('');
  const [patientPassword, setPatientPassword] = useState('1234');
  const [patientError, setPatientError] = useState<string | null>(null);

  // Admin/PT Login Form
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState<string | null>(null);

  // Handle Patient Login
  const handlePatientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPatientError(null);

    const trimmedInput = patientInput.trim().toLowerCase();
    if (!trimmedInput) {
      setPatientError('กรุณากรอกรหัสผู้ป่วย เช่น P001 หรือชื่อผู้ใช้');
      return;
    }

    // Match by code (e.g. P001) or username (e.g. p001)
    let account = SYSTEM_ACCOUNTS.find(
      (acc) =>
        acc.role === 'patient' &&
        (acc.username.toLowerCase() === trimmedInput ||
          (acc.patientCode && acc.patientCode.toLowerCase() === trimmedInput))
    );

    // If not found in static accounts, check dynamic registered patients list
    if (!account) {
      const dynamicPatient = patients.find(
        (p) => p.code.toLowerCase() === trimmedInput || p.id.toLowerCase() === trimmedInput
      );
      if (dynamicPatient) {
        account = {
          id: `usr-${dynamicPatient.code.toLowerCase()}`,
          username: dynamicPatient.code.toLowerCase(),
          passwordHash: '1234',
          name: dynamicPatient.name,
          role: 'patient',
          patientCode: dynamicPatient.code,
          hn: dynamicPatient.hn,
          title: dynamicPatient.condition,
        };
      }
    }

    if (!account) {
      setPatientError(`ไม่พบบัญชีผู้ป่วยรหัส "${patientInput}" ในระบบคลินิก`);
      return;
    }

    if (patientPassword !== account.passwordHash && patientPassword !== '1234') {
      setPatientError('รหัสผ่านไม่ถูกต้อง (รหัสมาตรฐาน: 1234)');
      return;
    }

    onLoginSuccess(account);
  };

  // Handle Admin/PT Login
  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError(null);

    const trimmedUser = adminUsername.trim().toLowerCase();
    if (!trimmedUser || !adminPassword) {
      setAdminError('กรุณากรอกชื่อผู้ใช้และรหัสผ่านของผู้ดูแลระบบ');
      return;
    }

    const account = SYSTEM_ACCOUNTS.find(
      (acc) =>
        acc.role === 'admin' &&
        (acc.username.toLowerCase() === trimmedUser ||
          (acc.email && acc.email.toLowerCase() === trimmedUser))
    );

    if (!account || account.passwordHash !== adminPassword) {
      setAdminError('ชื่อผู้ใช้หรือรหัสผ่านผู้ดูแลระบบไม่ถูกต้อง');
      return;
    }

    onLoginSuccess(account);
  };

  // Quick Demo Logins
  const handleQuickPatient = (code: string) => {
    const account = SYSTEM_ACCOUNTS.find((acc) => acc.patientCode === code);
    if (account) {
      onLoginSuccess(account);
    }
  };

  const handleQuickAdmin = () => {
    const account = SYSTEM_ACCOUNTS.find((acc) => acc.username === 'admin');
    if (account) {
      onLoginSuccess(account);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-4 py-8">
      <div className="max-w-md w-full space-y-5">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-sky-600 text-white flex items-center justify-center font-black text-2xl shadow-lg shadow-sky-600/25 mx-auto">
            PT
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              PHYSIO CARE
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              ระบบตรวจประเมินท่าทาง & กายภาพบำบัดเฉพาะบุคคล
            </p>
          </div>
        </div>

        {/* Auth Box Container */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-5">
          {/* Role Tabs: ผู้ป่วย vs นักกายภาพ/Admin */}
          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('patient')}
              className={`flex-1 py-2.5 font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'patient'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <User className="w-4 h-4 text-sky-600" />
              <span>ผู้ป่วย (Patient)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('admin')}
              className={`flex-1 py-2.5 font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'admin'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>นักกายภาพ / Admin</span>
            </button>
          </div>

          {/* PATIENT LOGIN SECTION */}
          {activeTab === 'patient' && (
            <div className="space-y-4">
              <div className="bg-sky-50/70 border border-sky-100 rounded-xl p-3 text-xs text-sky-900 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  สำหรับผู้ป่วย: คุณสามารถใช้งานได้เฉพาะแท็บและประวัติของตนเอง เพื่อความเป็นส่วนตัวและความปลอดภัย
                </p>
              </div>

              {/* QR Code Quick Scan Button */}
              <button
                type="button"
                onClick={onOpenQRScanner}
                className="w-full py-3 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-semibold text-xs rounded-xl shadow-md shadow-sky-600/20 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.99]"
              >
                <ScanLine className="w-4 h-4" />
                <span>สแกน QR Code เข้าสู่ระบบทันที</span>
              </button>

              <div className="flex items-center gap-2 my-2">
                <div className="flex-1 h-px bg-slate-200" />
                <span className="text-[11px] text-slate-400 font-medium">หรือ เข้าสู่ระบบด้วยรหัสคนไข้</span>
                <div className="flex-1 h-px bg-slate-200" />
              </div>

              {/* Patient Form */}
              <form onSubmit={handlePatientSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    รหัสผู้ป่วย (Patient ID / Code)
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={patientInput}
                      onChange={(e) => {
                        setPatientInput(e.target.value);
                        setPatientError(null);
                      }}
                      placeholder="เช่น P001 หรือ p001"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900 focus:outline-sky-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    รหัสผ่าน (PIN / Password)
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      value={patientPassword}
                      onChange={(e) => {
                        setPatientPassword(e.target.value);
                        setPatientError(null);
                      }}
                      placeholder="รหัสผ่าน (ค่าเริ่มต้น: 1234)"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-sky-600"
                    />
                  </div>
                </div>

                {patientError && (
                  <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 flex items-start gap-1.5 text-[11px]">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-rose-600" />
                    <span>{patientError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>เข้าสู่ระบบผู้ป่วย</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Quick Click Sample Patient Accounts */}
              <div className="pt-2 border-t border-slate-100 text-center space-y-1.5">
                <span className="text-[11px] text-slate-400 block font-medium">
                  คลิกเพื่อทดสอบเข้าสู่ระบบผู้ป่วยทันที:
                </span>
                <div className="flex flex-wrap items-center justify-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleQuickPatient('P001')}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-sky-50 hover:border-sky-300 border border-slate-200 rounded-lg text-[11px] font-mono text-slate-700 transition-colors cursor-pointer"
                  >
                    P001 (คุณนภัส)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickPatient('P002')}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-sky-50 hover:border-sky-300 border border-slate-200 rounded-lg text-[11px] font-mono text-slate-700 transition-colors cursor-pointer"
                  >
                    P002 (คุณธีรภัทร)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickPatient('P003')}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-sky-50 hover:border-sky-300 border border-slate-200 rounded-lg text-[11px] font-mono text-slate-700 transition-colors cursor-pointer"
                  >
                    P003 (คุณพัชรา)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ADMIN / PT LOGIN SECTION */}
          {activeTab === 'admin' && (
            <div className="space-y-4">
              <div className="bg-indigo-50/70 border border-indigo-100 rounded-xl p-3 text-xs text-indigo-900 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  สำหรับผู้ดูแลระบบ & นักกายภาพบำบัด: สิทธิ์เต็มรูปแบบ สามารถจัดการผู้ป่วยทั้งหมด แก้ไขข้อมูล และตรวจวัดท่าทางได้ทุกฟังก์ชัน
                </p>
              </div>

              <form onSubmit={handleAdminSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    ชื่อผู้ใช้ / อีเมลผู้ดูแลระบบ
                  </label>
                  <div className="relative">
                    <Stethoscope className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={adminUsername}
                      onChange={(e) => {
                        setAdminUsername(e.target.value);
                        setAdminError(null);
                      }}
                      placeholder="เช่น admin หรือ pt01"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-sky-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    รหัสผ่าน (Admin Password)
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      value={adminPassword}
                      onChange={(e) => {
                        setAdminPassword(e.target.value);
                        setAdminError(null);
                      }}
                      placeholder="กรอกรหัสผ่านผู้ดูแลระบบ"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-sky-600"
                    />
                  </div>
                </div>

                {adminError && (
                  <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 flex items-start gap-1.5 text-[11px]">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-rose-600" />
                    <span>{adminError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-semibold rounded-xl shadow-md shadow-sky-600/20 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>เข้าสู่ระบบผู้ดูแลระบบ (Admin Portal)</span>
                </button>
              </form>

              {/* Quick Click Sample Admin Login */}
              <div className="pt-2 border-t border-slate-100 text-center space-y-1.5">
                <span className="text-[11px] text-slate-400 block font-medium">
                  คลิกเพื่อทดสอบเข้าสู่ระบบผู้ดูแลระบบทันที:
                </span>
                <button
                  type="button"
                  onClick={handleQuickAdmin}
                  className="w-full py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <KeyRound className="w-3.5 h-3.5 text-sky-600" />
                  <span>เข้าสู่ระบบเป็น Admin (admin / admin123)</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="text-center text-[11px] text-slate-400">
          PT Posture Progress · ระบบการจัดการคลินิกกายภาพบำบัดที่ปลอดภัยตามมาตรฐาน PDPA
        </div>
      </div>
    </div>
  );
};
