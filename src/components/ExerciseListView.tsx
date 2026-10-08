import React, { useState } from 'react';
import { Exercise, ScreenId } from '../types';
import { ArrowLeft, Play, Dumbbell, Clock, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';
import { EXERCISES } from '../data/mockData';

interface ExerciseListViewProps {
  onBack: () => void;
  onSelectExercise: (exercise: Exercise) => void;
  onStartTodayWorkout: () => void;
}

export const ExerciseListView: React.FC<ExerciseListViewProps> = ({
  onBack,
  onSelectExercise,
  onStartTodayWorkout,
}) => {
  const [activeTab, setActiveTab] = useState<'1-2' | '3-4'>('1-2');

  const filteredExercises = EXERCISES.filter((ex) => {
    if (activeTab === '1-2') {
      return ex.phaseWeeks === '1-2' || ex.id === 'scapular-retraction';
    }
    return ex.phaseWeeks === '3-4' || ex.id === 'chin-tuck';
  });

  return (
    <div className="max-w-md mx-auto px-4 pt-3 pb-24 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="p-2 -ml-2 text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-base font-bold text-slate-900">
          โปรแกรมของคุณ (4 สัปดาห์)
        </h1>
        <div className="w-8" />
      </div>

      {/* Phase Tabs: สัปดาห์ 1-2 vs สัปดาห์ 3-4 */}
      <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
        <button
          onClick={() => setActiveTab('1-2')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all text-center ${
            activeTab === '1-2'
              ? 'bg-sky-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          สัปดาห์ 1-2 (ปรับสมดุล & ยืดกล้ามเนื้อ)
        </button>
        <button
          onClick={() => setActiveTab('3-4')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all text-center ${
            activeTab === '3-4'
              ? 'bg-sky-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          สัปดาห์ 3-4 (เสริมความแข็งแรง)
        </button>
      </div>

      {/* Program Summary Pill */}
      <div className="bg-sky-50/70 border border-sky-100 p-3 rounded-xl flex items-center justify-between text-xs text-sky-900">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-sky-600 shrink-0" />
          <span>ใช้เวลาประมาณ 8-10 นาทีต่อวัน</span>
        </div>
        <span className="font-semibold text-sky-700">5 ท่ากายภาพ</span>
      </div>

      {/* Exercise List */}
      <div className="space-y-2.5">
        {filteredExercises.map((exercise, index) => (
          <div
            key={exercise.id}
            onClick={() => onSelectExercise(exercise)}
            className="bg-white hover:bg-slate-50 border border-slate-200/90 rounded-2xl p-3 flex items-center justify-between gap-3 shadow-xs transition-all cursor-pointer group active:scale-[0.99]"
          >
            <div className="flex items-center gap-3">
              {/* Exercise Thumbnail */}
              <div className="w-14 h-14 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200 flex items-center justify-center">
                <img
                  src={exercise.imageUrl}
                  alt={exercise.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>

              {/* Title & Set/Rep */}
              <div>
                <h3 className="text-sm font-bold text-slate-800 group-hover:text-sky-700 transition-colors">
                  {exercise.title}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {exercise.setsRepsText}
                </p>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  {exercise.cue}
                </span>
              </div>
            </div>

            {/* Blue Play Button */}
            <div className="w-9 h-9 rounded-full bg-sky-600 text-white flex items-center justify-center shadow-sm shrink-0 group-hover:scale-110 group-hover:bg-sky-500 transition-all">
              <Play className="w-4 h-4 fill-white ml-0.5" />
            </div>
          </div>
        ))}
      </div>

      {/* Sticky Bottom Action */}
      <div className="pt-2">
        <button
          onClick={onStartTodayWorkout}
          className="w-full h-12 rounded-xl bg-sky-600 hover:bg-sky-700 active:scale-[0.99] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-md shadow-sky-600/20 cursor-pointer transition-all"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>เริ่มออกกำลังกายวันนี้</span>
        </button>
      </div>
    </div>
  );
};
