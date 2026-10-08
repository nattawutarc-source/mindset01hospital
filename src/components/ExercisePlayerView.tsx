import React, { useState, useEffect } from 'react';
import { Exercise } from '../types';
import { ArrowLeft, Play, Pause, RotateCcw, SkipForward, Volume2, VolumeX, CheckCircle, ArrowRight } from 'lucide-react';
import { EXERCISES } from '../data/mockData';

interface ExercisePlayerViewProps {
  initialExercise?: Exercise;
  onBack: () => void;
  onFinishWorkout: () => void;
}

export const ExercisePlayerView: React.FC<ExercisePlayerViewProps> = ({
  initialExercise = EXERCISES[0],
  onBack,
  onFinishWorkout,
}) => {
  const [currentExIndex, setCurrentExIndex] = useState(0);
  const exercise = EXERCISES[currentExIndex] || initialExercise;

  const [repCount, setRepCount] = useState(1);
  const totalReps = exercise.repsTarget || 10;
  const [isPlaying, setIsPlaying] = useState(false);
  const [holdTimer, setHoldTimer] = useState(exercise.holdSeconds || 5);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [workoutComplete, setWorkoutComplete] = useState(false);

  // Play a soft pleasant synth beep via Web Audio API
  const playChime = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.4);
    } catch {
      // AudioContext muted or unsupported
    }
  };

  // Timer loop for rep hold countdown
  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setHoldTimer((prev) => {
          if (prev <= 1) {
            playChime();
            // Advance rep or complete exercise
            setRepCount((r) => {
              if (r >= totalReps) {
                setIsPlaying(false);
                return totalReps;
              }
              return r + 1;
            });
            return exercise.holdSeconds || 5;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlaying, totalReps, exercise.holdSeconds]);

  const handleNextExercise = () => {
    if (currentExIndex < EXERCISES.length - 1) {
      setCurrentExIndex(currentExIndex + 1);
      setRepCount(1);
      setHoldTimer(EXERCISES[currentExIndex + 1].holdSeconds || 5);
      setIsPlaying(false);
    } else {
      setWorkoutComplete(true);
    }
  };

  const handleResetRep = () => {
    setRepCount(1);
    setHoldTimer(exercise.holdSeconds || 5);
    setIsPlaying(false);
  };

  return (
    <div className="max-w-md mx-auto px-4 pt-3 pb-24 space-y-4">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="p-2 -ml-2 text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="text-center">
          <h1 className="text-base font-bold text-slate-900">{exercise.title}</h1>
          <span className="text-[11px] text-slate-500 font-medium">
            ท่าที่ {currentExIndex + 1} จาก {EXERCISES.length} ท่า
          </span>
        </div>
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="p-2 -mr-2 text-slate-600 hover:text-slate-900"
        >
          {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
        </button>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
          <span>ความคืบหน้า</span>
          <span className="font-bold text-sky-600">{repCount}/{totalReps}</span>
        </div>
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-sky-600 transition-all duration-300 rounded-full"
            style={{ width: `${(repCount / totalReps) * 100}%` }}
          />
        </div>
      </div>

      {/* Interactive Visual Demonstration Area */}
      <div className="relative rounded-2xl overflow-hidden bg-slate-900 aspect-4/3 flex items-center justify-center border border-slate-200 shadow-sm">
        <img
          src={exercise.imageUrl}
          alt={exercise.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover opacity-90"
        />

        {/* Dynamic Instructional Arrow & Anatomical Cue */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 flex flex-col justify-between p-4 pointer-events-none">
          {/* Top Cue */}
          <div className="flex items-center justify-between">
            <span className="bg-sky-600/90 text-white text-[11px] px-2.5 py-1 rounded-md font-medium backdrop-blur-xs">
              {exercise.category === 'strengthening' ? 'เสริมความแข็งแรง' : 'ยืดเหยียด'}
            </span>

            {/* Countdown Seconds Pill */}
            <div className="bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-mono font-bold border border-white/20">
              ค้าง {holdTimer} วินาที
            </div>
          </div>

          {/* Chin Tuck Directional Arrow Visual Overlay */}
          <div className="flex items-center justify-center">
            {exercise.id === 'chin-tuck' && (
              <div className="flex items-center gap-2 bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 px-3.5 py-1.5 rounded-full backdrop-blur-xs shadow-lg animate-pulse">
                <span className="text-emerald-400 font-bold text-lg">←</span>
                <span className="text-xs font-semibold">ดึงคางถอยไปข้างหลัง</span>
              </div>
            )}
          </div>

          {/* Bottom Cue Text */}
          <div className="bg-black/60 backdrop-blur-xs text-white text-xs font-medium text-center py-2 px-3 rounded-xl border border-white/10">
            {exercise.cue}
          </div>
        </div>
      </div>

      {/* Rep Counter & Controls */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-4">
        {/* Big Rep Display */}
        <div className="text-center">
          <div className="text-3xl font-extrabold text-slate-900 font-mono tracking-tight">
            {repCount} <span className="text-base text-slate-400 font-normal">/ {totalReps} ครั้ง</span>
          </div>
          <span className="text-xs text-slate-500 mt-0.5 block">
            {exercise.setsRepsText}
          </span>
        </div>

        {/* Media Controls Bar */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={handleResetRep}
            title="เริ่มนับใหม่"
            className="w-10 h-10 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center hover:bg-slate-200 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-14 h-14 rounded-full bg-sky-600 hover:bg-sky-700 text-white flex items-center justify-center shadow-md shadow-sky-600/25 transition-transform active:scale-95"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 fill-white" />
            ) : (
              <Play className="w-6 h-6 fill-white ml-0.5" />
            )}
          </button>

          <button
            onClick={() => {
              if (repCount < totalReps) {
                setRepCount(repCount + 1);
                playChime();
              }
            }}
            title="ข้ามรอบ (+1)"
            className="w-10 h-10 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center hover:bg-slate-200 transition-colors font-bold text-xs"
          >
            +1
          </button>
        </div>
      </div>

      {/* Next Step / Complete CTA */}
      <button
        onClick={handleNextExercise}
        className="w-full h-12 rounded-xl bg-sky-600 hover:bg-sky-700 active:scale-[0.99] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-md shadow-sky-600/20 cursor-pointer transition-all"
      >
        <span>เสร็จแล้ว ไปท่าถัดไป</span>
        <ArrowRight className="w-4 h-4" />
      </button>

      {/* Completion Modal */}
      {workoutComplete && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">ยอดเยี่ยมมากค่ะ!</h3>
              <p className="text-xs text-slate-600 mt-1">
                คุณทำโปรแกรมออกกำลังกาย HEP ครบทุกท่าสำหรับวันนี้แล้ว
              </p>
            </div>
            <button
              onClick={onFinishWorkout}
              className="w-full py-3 bg-sky-600 text-white font-semibold text-xs rounded-xl shadow-md"
            >
              กลับหน้าหลัก & ดูความก้าวหน้า
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
