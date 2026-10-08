export type UserRole = 'patient' | 'pt';

export type ViewAngle = 'front' | 'side' | 'back';

export type ScreenId =
  | 'home'
  | 'camera-guide'
  | 'capture'
  | 'result-side'
  | 'result-front'
  | 'result-back'
  | 'baseline-summary'
  | 'exercise-list'
  | 'exercise-player'
  | 'symptom-tracker'
  | 'progress-comparison'
  | 'articles'
  | 'pt-dashboard'
  | 'pt-patient-detail';

export interface LandmarkPoint {
  x: number; // percentage 0 - 100
  y: number; // percentage 0 - 100
}

export interface PostureAssessment {
  id: string;
  patientId: string;
  week: number; // 0, 4, etc.
  date: string;
  sideImageUrl: string;
  frontImageUrl: string;
  backImageUrl?: string;
  cvaAngle: number; // Craniovertebral angle (degrees)
  shoulderC7Angle: number; // degrees
  shoulderTiltDeg: number; // degrees
  scapularTiltDeg?: number; // degrees
  trunkAlignment: 'อยู่ในแนว' | 'เอียงเล็กน้อย' | 'แอ่นหลัง';
  scapularSymmetry?: string;
  spineAlignment?: string;
  restPain: number; // 0-10
  workPain: number; // 0-10
  ptNotes?: string;
  landmarksSide?: {
    tragus: LandmarkPoint;
    c7: LandmarkPoint;
    shoulder: LandmarkPoint;
    horizontalRef: LandmarkPoint;
  };
  landmarksFront?: {
    leftShoulder: LandmarkPoint;
    rightShoulder: LandmarkPoint;
  };
  landmarksBack?: {
    leftScapula: LandmarkPoint;
    rightScapula: LandmarkPoint;
    spineTop: LandmarkPoint;
    spineBottom: LandmarkPoint;
  };
}

export interface Exercise {
  id: string;
  title: string;
  thaiName: string;
  category: 'mobility' | 'strengthening' | 'stretching';
  setsRepsText: string;
  repsTarget: number;
  setsTarget: number;
  holdSeconds?: number;
  phaseWeeks: '1-2' | '3-4';
  cue: string;
  description: string;
  instructions: string[];
  imageUrl: string;
}

export interface SymptomLog {
  id: string;
  patientId: string;
  date: string;
  restPain: number;
  workPain: number;
  triggers: string[];
  notes?: string;
}

export interface PatientProfile {
  id: string;
  code: string; // e.g. "P001"
  name: string; // "คุณนภัส น."
  hn: string; // "HN: 126xxx"
  condition: string; // "ออฟฟิศซินโดรม / คอยื่น (Forward Head)"
  startDate: string;
  latestWeek: string; // "W4", "W2", "W0"
  status: 'completed' | 'in-progress' | 'not-started';
  cvaCurrent: number;
  workPainCurrent: number;
  hepCompliance: number; // percentage e.g. 80
  assessments: PostureAssessment[];
  symptomLogs: SymptomLog[];
}
