/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { UserRole, ScreenId, PatientProfile, PostureAssessment, Exercise, SymptomLog, ViewAngle, AuthUser } from './types';
import { INITIAL_PATIENTS, INITIAL_ASSESSMENT_P001_W0, ASSESSMENT_P001_W4, EXERCISES } from './data/mockData';
import { SYSTEM_ACCOUNTS } from './data/authData';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { LoginView } from './components/LoginView';
import { HomeView } from './components/HomeView';
import { CameraGuideView } from './components/CameraGuideView';
import { CaptureView } from './components/CaptureView';
import { ResultSideView } from './components/ResultSideView';
import { ResultFrontView } from './components/ResultFrontView';
import { ResultBackView } from './components/ResultBackView';
import { BaselineSummaryView } from './components/BaselineSummaryView';
import { ExerciseListView } from './components/ExerciseListView';
import { ExercisePlayerView } from './components/ExercisePlayerView';
import { SymptomTrackerView } from './components/SymptomTrackerView';
import { ProgressComparisonView } from './components/ProgressComparisonView';
import { ArticlesView } from './components/ArticlesView';
import { PTDashboardView } from './components/PTDashboardView';
import { PTPatientDetailView } from './components/PTPatientDetailView';
import { PTShareModal } from './components/PTShareModal';
import { PTRegisterModal } from './components/PTRegisterModal';
import { QRScannerModal } from './components/QRScannerModal';

const AUTH_STORAGE_KEY = 'physio_auth_user_v2';

export default function App() {
  const [patients, setPatients] = useState<PatientProfile[]>(INITIAL_PATIENTS);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [activePatient, setActivePatient] = useState<PatientProfile>(INITIAL_PATIENTS[0]);
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('home');
  const [captureAngle, setCaptureAngle] = useState<ViewAngle>('side');

  // Current active assessment data
  const [currentAssessment, setCurrentAssessment] = useState<PostureAssessment>(INITIAL_ASSESSMENT_P001_W0);
  const [selectedExercise, setSelectedExercise] = useState<Exercise>(EXERCISES[0]);

  // Modals state
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [qrScannerOpen, setQrScannerOpen] = useState(false);
  const [modalPatient, setModalPatient] = useState<PatientProfile>(INITIAL_PATIENTS[0]);

  // Sync active patient with logged in patient user
  useEffect(() => {
    if (currentUser?.role === 'patient' && currentUser.patientCode) {
      const match = patients.find(
        (p) => p.code.toLowerCase() === currentUser.patientCode?.toLowerCase()
      );
      if (match) {
        setActivePatient(match);
        // Default patient assessment to this patient's latest
        if (match.assessments && match.assessments.length > 0) {
          setCurrentAssessment(match.assessments[match.assessments.length - 1]);
        }
      }
    }
  }, [currentUser, patients]);

  // URL Query Parameter Detection (e.g. scanning QR code opens https://app?patient=P001)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const codeParam = params.get('patient') || params.get('p') || params.get('code');
    const roleParam = params.get('role');

    if (codeParam) {
      const target = patients.find(
        (p) =>
          p.code.toLowerCase() === codeParam.toLowerCase() ||
          p.id.toLowerCase() === codeParam.toLowerCase()
      );
      if (target) {
        // Auto-authenticate as patient from scanned QR code
        const patientAuth: AuthUser = {
          id: `usr-${target.code.toLowerCase()}`,
          username: target.code.toLowerCase(),
          name: target.name,
          role: 'patient',
          patientCode: target.code,
          hn: target.hn,
          title: target.condition,
        };
        setCurrentUser(patientAuth);
        try {
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(patientAuth));
        } catch {}
        setActivePatient(target);
        setCurrentScreen('home');
      }
    } else if (roleParam === 'admin' && !currentUser) {
      // Optional shortcut if specified
      const adminAcc = SYSTEM_ACCOUNTS.find((a) => a.role === 'admin');
      if (adminAcc) {
        setCurrentUser(adminAcc);
        setCurrentScreen('pt-dashboard');
      }
    }
  }, [patients]);

  // Security Guard: Prevent patients from accessing PT/Admin views
  useEffect(() => {
    if (currentUser?.role === 'patient') {
      if (currentScreen === 'pt-dashboard' || currentScreen === 'pt-patient-detail') {
        setCurrentScreen('home');
      }
    }
  }, [currentUser, currentScreen]);

  // Handle Login Success
  const handleLoginSuccess = (user: AuthUser) => {
    setCurrentUser(user);
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } catch {}

    if (user.role === 'patient') {
      const target = patients.find(
        (p) => p.code.toLowerCase() === (user.patientCode || '').toLowerCase()
      );
      if (target) {
        setActivePatient(target);
        if (target.assessments && target.assessments.length > 0) {
          setCurrentAssessment(target.assessments[target.assessments.length - 1]);
        }
      }
      setCurrentScreen('home');
    } else {
      // Admin defaults to PT Clinic Dashboard
      setCurrentScreen('pt-dashboard');
    }
  };

  // Handle Logout
  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch {}
    setCurrentScreen('home');
  };

  // Handle QR Detection (from modal scanner)
  const handlePatientDetectedFromQR = (code: string) => {
    const found = patients.find(
      (p) =>
        p.code.toLowerCase() === code.toLowerCase() ||
        p.id.toLowerCase() === code.toLowerCase()
    );

    if (found) {
      setActivePatient(found);
      setQrScannerOpen(false);

      if (!currentUser) {
        // Log in as this patient directly
        const patientAuth: AuthUser = {
          id: `usr-${found.code.toLowerCase()}`,
          username: found.code.toLowerCase(),
          name: found.name,
          role: 'patient',
          patientCode: found.code,
          hn: found.hn,
          title: found.condition,
        };
        handleLoginSuccess(patientAuth);
      } else if (currentUser.role === 'admin') {
        // Admin views this patient's detail record
        setCurrentScreen('pt-patient-detail');
      } else {
        // Patient user switched to their own record
        setCurrentScreen('home');
      }
    } else {
      alert(`ไม่พบข้อมูลคนไข้รหัส ${code} ในระบบ`);
    }
  };

  // Safe Navigation Handler
  const handleSafeNavigate = (screen: ScreenId) => {
    if (currentUser?.role === 'patient') {
      if (screen === 'pt-dashboard' || screen === 'pt-patient-detail') {
        setCurrentScreen('home');
        return;
      }
    }
    setCurrentScreen(screen);
  };

  // Handle Assessment Capture
  const handleSaveAssessmentData = (data: Partial<PostureAssessment>) => {
    const updated: PostureAssessment = {
      ...currentAssessment,
      ...data,
      id: `asm-${Date.now()}`,
      patientId: activePatient.id,
      week: 4,
    };
    setCurrentAssessment(updated);

    // Update patient record
    const updatedPatients = patients.map((p) => {
      if (p.id === activePatient.id) {
        return {
          ...p,
          cvaCurrent: updated.cvaAngle,
          assessments: [...p.assessments, updated],
        };
      }
      return p;
    });
    setPatients(updatedPatients);
    setActivePatient((prev) => ({
      ...prev,
      cvaCurrent: updated.cvaAngle,
      assessments: [...prev.assessments, updated],
    }));

    // Route to result side view
    setCurrentScreen('result-side');
  };

  // Handle Symptom Log
  const handleSaveSymptomLog = (newLogData: Omit<SymptomLog, 'id'>) => {
    const newLog: SymptomLog = {
      ...newLogData,
      id: `log-${Date.now()}`,
    };
    const updatedPatient = {
      ...activePatient,
      workPainCurrent: newLog.workPain,
      symptomLogs: [...activePatient.symptomLogs, newLog],
    };
    setActivePatient(updatedPatient);
    setPatients(patients.map((p) => (p.id === activePatient.id ? updatedPatient : p)));
  };

  // Register New Patient (Admin only)
  const handleRegisterPatient = (newPatient: PatientProfile) => {
    setPatients([newPatient, ...patients]);
    setActivePatient(newPatient);
    setModalPatient(newPatient);
    setShareModalOpen(true);
  };

  // Update PT Notes (Admin only)
  const handleUpdatePtNotes = (patientId: string, notes: string) => {
    setPatients(
      patients.map((p) => {
        if (p.id === patientId) {
          const updatedAsms = [...p.assessments];
          if (updatedAsms[0]) {
            updatedAsms[0] = { ...updatedAsms[0], ptNotes: notes };
          }
          return { ...p, assessments: updatedAsms };
        }
        return p;
      })
    );
  };

  const getNextPatientCode = () => {
    const nextNum = patients.length + 1;
    return `P00${nextNum}`.slice(-4);
  };

  // If user is not logged in, display the Login View
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
        <LoginView
          onLoginSuccess={handleLoginSuccess}
          onOpenQRScanner={() => setQrScannerOpen(true)}
          patients={patients}
        />

        {/* QR Scanner Modal for Instant Patient Login */}
        <QRScannerModal
          isOpen={qrScannerOpen}
          onClose={() => setQrScannerOpen(false)}
          onPatientDetected={handlePatientDetectedFromQR}
          patients={patients}
        />
      </div>
    );
  }

  const role: UserRole = currentUser.role;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Navbar with Role Enforcement */}
      <Navbar
        currentUser={currentUser}
        currentRole={role}
        onRoleChange={(newRole) => {
          if (currentUser.role === 'patient' && newRole === 'admin') {
            // Patients cannot switch to admin
            return;
          }
          if (newRole === 'admin') setCurrentScreen('pt-dashboard');
          else setCurrentScreen('home');
        }}
        currentScreen={currentScreen}
        onNavigate={handleSafeNavigate}
        patientCode={activePatient.code}
        onLogout={handleLogout}
        onOpenShareModal={() => {
          setModalPatient(activePatient);
          setShareModalOpen(true);
        }}
        onOpenScannerModal={() => setQrScannerOpen(true)}
      />

      {/* Main Screen Body */}
      <main className="flex-1 w-full pb-6">
        {/* Screen 1: Home View (Patient Home or Admin Preview) */}
        {currentScreen === 'home' && (
          <HomeView
            patient={activePatient}
            onNavigate={(screen) => handleSafeNavigate(screen)}
          />
        )}

        {/* Screen 2: Camera Guide */}
        {currentScreen === 'camera-guide' && (
          <CameraGuideView
            onBack={() => setCurrentScreen('home')}
            onProceedToCapture={(angle) => {
              if (angle) setCaptureAngle(angle);
              setCurrentScreen('capture');
            }}
          />
        )}

        {/* Screen 3: Mobile Camera Capture (Front · Side · Back) */}
        {currentScreen === 'capture' && (
          <CaptureView
            initialMode={captureAngle}
            onClose={() => {
              if (role === 'admin' && currentScreen === 'capture') {
                setCurrentScreen('pt-patient-detail');
              } else {
                setCurrentScreen('camera-guide');
              }
            }}
            onSaveAssessment={handleSaveAssessmentData}
          />
        )}

        {/* Screen 4: Side Result Analysis */}
        {currentScreen === 'result-side' && (
          <ResultSideView
            assessment={currentAssessment}
            onRetake={() => {
              setCaptureAngle('side');
              setCurrentScreen('capture');
            }}
            onProceedToFront={() => setCurrentScreen('result-front')}
            onProceedToSummary={() => setCurrentScreen('baseline-summary')}
            onSelectTab={(tab) => {
              if (tab === 'front') setCurrentScreen('result-front');
              else if (tab === 'back') setCurrentScreen('result-back');
            }}
          />
        )}

        {/* Screen 5: Front Result Analysis */}
        {currentScreen === 'result-front' && (
          <ResultFrontView
            assessment={currentAssessment}
            onRetake={() => {
              setCaptureAngle('front');
              setCurrentScreen('capture');
            }}
            onProceedToBack={() => setCurrentScreen('result-back')}
            onSaveAll={() => setCurrentScreen('baseline-summary')}
            onSelectTab={(tab) => {
              if (tab === 'side') setCurrentScreen('result-side');
              else if (tab === 'back') setCurrentScreen('result-back');
            }}
          />
        )}

        {/* Screen 5.5: Back Result Analysis */}
        {currentScreen === 'result-back' && (
          <ResultBackView
            assessment={currentAssessment}
            onRetake={() => {
              setCaptureAngle('back');
              setCurrentScreen('capture');
            }}
            onSaveAll={() => setCurrentScreen('baseline-summary')}
            onSelectTab={(tab) => {
              if (tab === 'side') setCurrentScreen('result-side');
              else if (tab === 'front') setCurrentScreen('result-front');
            }}
          />
        )}

        {/* Screen 6: Baseline Summary (Week 0) */}
        {currentScreen === 'baseline-summary' && (
          <BaselineSummaryView
            assessment={currentAssessment}
            onStartExercise={() => setCurrentScreen('exercise-list')}
            onNavigate={(screen) => handleSafeNavigate(screen)}
          />
        )}

        {/* Screen 7: Exercise Program (HEP 4 weeks) */}
        {currentScreen === 'exercise-list' && (
          <ExerciseListView
            onBack={() => setCurrentScreen('home')}
            onSelectExercise={(ex) => {
              setSelectedExercise(ex);
              setCurrentScreen('exercise-player');
            }}
            onStartTodayWorkout={() => {
              setSelectedExercise(EXERCISES[0]);
              setCurrentScreen('exercise-player');
            }}
          />
        )}

        {/* Screen 8: Daily Exercise Player */}
        {currentScreen === 'exercise-player' && (
          <ExercisePlayerView
            initialExercise={selectedExercise}
            onBack={() => setCurrentScreen('exercise-list')}
            onFinishWorkout={() => setCurrentScreen('progress-comparison')}
          />
        )}

        {/* Screen 9: Symptom Tracker */}
        {currentScreen === 'symptom-tracker' && (
          <SymptomTrackerView
            onBack={() => setCurrentScreen('home')}
            onSaveLog={handleSaveSymptomLog}
            existingLogs={activePatient.symptomLogs}
          />
        )}

        {/* Screen 10: Progress Comparison (Week 0 vs Week 4) */}
        {currentScreen === 'progress-comparison' && (
          <ProgressComparisonView
            onBack={() => setCurrentScreen('home')}
            assessmentW0={activePatient.assessments[0] || INITIAL_ASSESSMENT_P001_W0}
            assessmentW4={activePatient.assessments[1] || ASSESSMENT_P001_W4}
          />
        )}

        {/* Articles View */}
        {currentScreen === 'articles' && (
          <ArticlesView onBack={() => setCurrentScreen('home')} />
        )}

        {/* ADMIN ONLY: PT Flow - Clinic Dashboard */}
        {role === 'admin' && currentScreen === 'pt-dashboard' && (
          <PTDashboardView
            patients={patients}
            onSelectPatient={(p) => {
              setActivePatient(p);
              setCurrentScreen('pt-patient-detail');
            }}
            onOpenRegisterModal={() => setRegisterModalOpen(true)}
            onOpenShareModal={(p) => {
              setModalPatient(p);
              setShareModalOpen(true);
            }}
            onStartClinicAssessment={(p) => {
              setActivePatient(p);
              setCurrentScreen('capture');
            }}
          />
        )}

        {/* ADMIN ONLY: PT Flow - Patient Detailed Clinical View */}
        {role === 'admin' && currentScreen === 'pt-patient-detail' && (
          <PTPatientDetailView
            patient={activePatient}
            onBack={() => setCurrentScreen('pt-dashboard')}
            onOpenShareModal={(p) => {
              setModalPatient(p);
              setShareModalOpen(true);
            }}
            onStartClinicCapture={() => setCurrentScreen('capture')}
            onUpdateNotes={handleUpdatePtNotes}
          />
        )}
      </main>

      {/* Patient Bottom Navigation Bar (Shown for patient users or admin previewing patient view) */}
      {currentScreen !== 'capture' &&
        currentScreen !== 'pt-dashboard' &&
        currentScreen !== 'pt-patient-detail' && (
          <BottomNav
            currentScreen={currentScreen}
            onNavigate={(screen) => handleSafeNavigate(screen)}
          />
        )}

      {/* Share / QR Code Modal */}
      <PTShareModal
        patient={modalPatient}
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
      />

      {/* Register New Patient Modal (Admin only) */}
      {role === 'admin' && (
        <PTRegisterModal
          isOpen={registerModalOpen}
          onClose={() => setRegisterModalOpen(false)}
          nextCode={getNextPatientCode()}
          onRegister={handleRegisterPatient}
        />
      )}

      {/* QR Code Scanner Camera Modal */}
      <QRScannerModal
        isOpen={qrScannerOpen}
        onClose={() => setQrScannerOpen(false)}
        onPatientDetected={handlePatientDetectedFromQR}
        patients={patients}
      />
    </div>
  );
}
