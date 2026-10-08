/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { UserRole, ScreenId, PatientProfile, PostureAssessment, Exercise, SymptomLog, ViewAngle } from './types';
import { INITIAL_PATIENTS, INITIAL_ASSESSMENT_P001_W0, ASSESSMENT_P001_W4, EXERCISES } from './data/mockData';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
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

export default function App() {
  const [role, setRole] = useState<UserRole>('patient');
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('home');
  const [patients, setPatients] = useState<PatientProfile[]>(INITIAL_PATIENTS);
  const [activePatient, setActivePatient] = useState<PatientProfile>(INITIAL_PATIENTS[0]);
  const [captureAngle, setCaptureAngle] = useState<ViewAngle>('side');

  // Current active assessment data (captured or baseline)
  const [currentAssessment, setCurrentAssessment] = useState<PostureAssessment>(INITIAL_ASSESSMENT_P001_W0);
  const [selectedExercise, setSelectedExercise] = useState<Exercise>(EXERCISES[0]);

  // Modals state
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [modalPatient, setModalPatient] = useState<PatientProfile>(INITIAL_PATIENTS[0]);

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

  // Register New Patient
  const handleRegisterPatient = (newPatient: PatientProfile) => {
    setPatients([newPatient, ...patients]);
    setActivePatient(newPatient);
    setModalPatient(newPatient);
    setShareModalOpen(true);
  };

  // Update PT Notes
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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Navbar with Role Switching & Clinic branding */}
      <Navbar
        currentRole={role}
        onRoleChange={(newRole) => {
          setRole(newRole);
          if (newRole === 'pt') setCurrentScreen('pt-dashboard');
          else setCurrentScreen('home');
        }}
        currentScreen={currentScreen}
        onNavigate={(screen) => setCurrentScreen(screen)}
        patientCode={activePatient.code}
        onOpenShareModal={() => {
          setModalPatient(activePatient);
          setShareModalOpen(true);
        }}
      />

      {/* Main Screen Body */}
      <main className="flex-1 w-full pb-6">
        {/* Screen 1: Home View */}
        {currentScreen === 'home' && (
          <HomeView
            patient={activePatient}
            onNavigate={(screen) => setCurrentScreen(screen)}
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

        {/* Screen 3: Camera Capture with Real-Time Plumb Line & Landmarks (ด้านหน้า · ด้านข้าง · ด้านหลัง) */}
        {currentScreen === 'capture' && (
          <CaptureView
            initialMode={captureAngle}
            onClose={() => setCurrentScreen('camera-guide')}
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
            onNavigate={(screen) => setCurrentScreen(screen)}
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

        {/* PT Flow - Clinic Dashboard */}
        {currentScreen === 'pt-dashboard' && (
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

        {/* PT Flow - Patient Detailed Clinical View */}
        {currentScreen === 'pt-patient-detail' && (
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

      {/* Patient Bottom Navigation Bar (Hidden during full-screen camera capture or PT dashboard) */}
      {role === 'patient' && currentScreen !== 'capture' && (
        <BottomNav
          currentScreen={currentScreen}
          onNavigate={(screen) => setCurrentScreen(screen)}
        />
      )}

      {/* Share / QR Code Modal */}
      <PTShareModal
        patient={modalPatient}
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
      />

      {/* Register New Patient Modal */}
      <PTRegisterModal
        isOpen={registerModalOpen}
        onClose={() => setRegisterModalOpen(false)}
        nextCode={getNextPatientCode()}
        onRegister={handleRegisterPatient}
      />
    </div>
  );
}
