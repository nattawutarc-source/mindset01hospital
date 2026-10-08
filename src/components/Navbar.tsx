import React from 'react';
import { UserRole, ScreenId, AuthUser } from '../types';
import {
  Stethoscope,
  User,
  QrCode,
  ScanLine,
  Lock,
  LogOut,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

interface NavbarProps {
  currentUser: AuthUser | null;
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  patientCode: string;
  onLogout: () => void;
  onOpenShareModal: () => void;
  onOpenScannerModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  currentRole,
  onRoleChange,
  currentScreen,
  onNavigate,
  patientCode,
  onLogout,
  onOpenShareModal,
  onOpenScannerModal,
}) => {
  const isAdmin = currentUser?.role === 'admin';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Brand Zone */}
        <div
          onClick={() => onNavigate(isAdmin ? 'pt-dashboard' : 'home')}
          className="flex items-center gap-2 cursor-pointer select-none"
        >
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-base shadow-sm text-white ${
              isAdmin ? 'bg-indigo-600' : 'bg-sky-600'
            }`}
          >
            {isAdmin ? 'PT' : 'P'}
          </div>
          <div className="leading-tight">
            <span className="text-base font-bold tracking-tight text-slate-900 block">
              PHYSIO CARE
            </span>
            <span className="text-[10px] text-slate-500 font-medium tracking-wide">
              {isAdmin
                ? 'Clinical Administration Portal'
                : 'PT Posture Progress · โปรแกรมของฉัน'}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* ============================================================ */}
          {/* ADMIN / THERAPIST CONTROLS (Full Access to Edit and View All)*/}
          {/* ============================================================ */}
          {isAdmin ? (
            <>
              {/* Scan Patient QR Button */}
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

              {/* Dashboard Shortcut */}
              <button
                onClick={() => onNavigate('pt-dashboard')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  currentScreen === 'pt-dashboard' || currentScreen === 'pt-patient-detail'
                    ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                แดชบอร์ดคลินิก
              </button>

              {/* Admin Mode Switcher: สามารถสลับดูมุมมองผู้ป่วยหรือกลับแดชบอร์ดได้ */}
              <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
                <button
                  type="button"
                  onClick={() => onNavigate('home')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all font-medium ${
                    currentScreen !== 'pt-dashboard' && currentScreen !== 'pt-patient-detail'
                      ? 'bg-white text-slate-900 shadow-sm font-semibold'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                  title="พรีวิวในมุมมองผู้ป่วย"
                >
                  <User className="w-3 h-3 text-sky-600" />
                  <span className="hidden sm:inline">มุมมองคนไข้</span>
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('pt-dashboard')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all font-medium ${
                    currentScreen === 'pt-dashboard' || currentScreen === 'pt-patient-detail'
                      ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                  title="โหมดผู้ดูแลระบบ"
                >
                  <ShieldCheck className="w-3 h-3" />
                  <span>Admin</span>
                </button>
              </div>

              {/* Admin Profile & Logout */}
              <button
                onClick={onLogout}
                title="ออกจากระบบ"
                className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer flex items-center gap-1 text-xs"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden md:inline text-[11px]">ออก</span>
              </button>
            </>
          ) : (
            /* ============================================================ */
            /* PATIENT CONTROLS (Strictly Patient Features Only)            */
            /* ============================================================ */
            <div className="flex items-center gap-2">
              {/* Patient Badge with Code */}
              <div className="flex items-center gap-1.5 px-3 py-1 bg-sky-50 text-sky-800 rounded-lg text-xs font-semibold border border-sky-200">
                <User className="w-3.5 h-3.5 text-sky-600" />
                <span className="font-mono">{patientCode}</span>
                <span className="hidden sm:inline font-sans font-normal text-slate-500">
                  · {currentUser?.name || 'ผู้ป่วย'}
                </span>
              </div>

              {/* Patient QR Button */}
              <button
                onClick={onOpenShareModal}
                title="QR ประจำตัวของฉัน"
                className="p-1.5 text-slate-600 hover:text-sky-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                <QrCode className="w-4 h-4 text-sky-600" />
              </button>

              {/* Logout Button */}
              <button
                onClick={onLogout}
                title="ออกจากระบบผู้ป่วย"
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer flex items-center gap-1 text-xs"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline text-[11px] text-slate-500">ออก</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
