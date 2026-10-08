import React from 'react';
import { UserRole, ScreenId } from '../types';
import { Stethoscope, User, Smartphone, RefreshCw, QrCode, ScanLine } from 'lucide-react';

interface NavbarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  patientCode: string;
  onOpenShareModal: () => void;
  onOpenScannerModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onRoleChange,
  currentScreen,
  onNavigate,
  patientCode,
  onOpenShareModal,
  onOpenScannerModal,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Brand Zone */}
        <div 
          onClick={() => onNavigate(currentRole === 'pt' ? 'pt-dashboard' : 'home')}
          className="flex items-center gap-2 cursor-pointer select-none"
        >
          <div className="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center font-bold text-base shadow-sm">
            {currentRole === 'pt' ? 'PT' : 'P'}
          </div>
          <div className="leading-tight">
            <span className="text-base font-bold tracking-tight text-slate-900 block">
              PHYSIO CARE
            </span>
            <span className="text-[10px] text-slate-500 font-medium tracking-wide">
              {currentRole === 'pt' ? 'Therapist Clinical Portal' : 'PT Posture Progress'}
            </span>
          </div>
        </div>

        {/* Action Controls & Role Switcher */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {onOpenScannerModal && (
            <button
              onClick={onOpenScannerModal}
              title="สแกน QR Code คนไข้"
              className="p-1.5 px-2 text-slate-700 hover:text-sky-600 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1 text-xs font-medium cursor-pointer border border-slate-200"
            >
              <ScanLine className="w-3.5 h-3.5 text-sky-600" />
              <span className="hidden sm:inline">สแกน QR</span>
            </button>
          )}

          {currentRole === 'pt' && (
            <button
              onClick={() => onNavigate('pt-dashboard')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                currentScreen === 'pt-dashboard' || currentScreen === 'pt-patient-detail'
                  ? 'bg-sky-50 text-sky-700 border border-sky-200'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              แดชบอร์ด
            </button>
          )}

          {currentRole === 'patient' && (
            <button
              onClick={onOpenShareModal}
              title="QR ลิงก์ผู้ป่วย"
              className="p-1.5 text-slate-600 hover:text-sky-600 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1 text-xs"
            >
              <QrCode className="w-4 h-4 text-sky-600" />
              <span className="hidden sm:inline font-mono">{patientCode}</span>
            </button>
          )}

          {/* Mode Switch Toggle: Patient <-> PT */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              type="button"
              onClick={() => {
                onRoleChange('patient');
                onNavigate('home');
              }}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                currentRole === 'patient'
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <User className="w-3.5 h-3.5 text-sky-600" />
              <span>ผู้ป่วย ({patientCode})</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onRoleChange('pt');
                onNavigate('pt-dashboard');
              }}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                currentRole === 'pt'
                  ? 'bg-sky-600 text-white shadow-sm font-semibold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Stethoscope className="w-3.5 h-3.5" />
              <span>นักกายภาพ</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
