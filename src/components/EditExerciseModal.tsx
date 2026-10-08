import React, { useState, useEffect } from 'react';
import { X, Save, Dumbbell, Trash2 } from 'lucide-react';
import { Exercise } from '../types';

interface EditExerciseModalProps {
  isOpen: boolean;
  onClose: () => void;
  exercise: Exercise | null;
  onSave: (updated: Exercise) => void;
  onDelete?: (exerciseId: string) => void;
}

export const EditExerciseModal: React.FC<EditExerciseModalProps> = ({
  isOpen,
  onClose,
  exercise,
  onSave,
  onDelete,
}) => {
  const [title, setTitle] = useState('');
  const [thaiName, setThaiName] = useState('');
  const [setsRepsText, setSetsRepsText] = useState('');
  const [repsTarget, setRepsTarget] = useState(10);
  const [setsTarget, setSetsTarget] = useState(2);
  const [holdSeconds, setHoldSeconds] = useState(5);
  const [phaseWeeks, setPhaseWeeks] = useState<'1-2' | '3-4'>('1-2');
  const [cue, setCue] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (exercise) {
      setTitle(exercise.title);
      setThaiName(exercise.thaiName);
      setSetsRepsText(exercise.setsRepsText);
      setRepsTarget(exercise.repsTarget);
      setSetsTarget(exercise.setsTarget);
      setHoldSeconds(exercise.holdSeconds || 5);
      setPhaseWeeks(exercise.phaseWeeks);
      setCue(exercise.cue);
      setDescription(exercise.description);
    }
  }, [exercise]);

  if (!isOpen || !exercise) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: Exercise = {
      ...exercise,
      title: title.trim() || exercise.title,
      thaiName: thaiName.trim() || exercise.thaiName,
      setsRepsText: setsRepsText.trim() || exercise.setsRepsText,
      repsTarget: Number(repsTarget),
      setsTarget: Number(setsTarget),
      holdSeconds: Number(holdSeconds),
      phaseWeeks,
      cue: cue.trim() || exercise.cue,
      description: description.trim() || exercise.description,
    };
    onSave(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl relative border border-slate-100 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shrink-0">
            <Dumbbell className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 block">
              แก้ไขท่ากายภาพ (Admin Only)
            </span>
            <h3 className="text-base font-bold text-slate-900">
              {exercise.title} ({exercise.thaiName})
            </h3>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-left text-xs">
          {/* Title & Thai Name */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-600 font-semibold block mb-1">
                ชื่อท่า (อังกฤษ)
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-sky-500 font-medium"
              />
            </div>
            <div>
              <label className="text-slate-600 font-semibold block mb-1">
                ชื่อท่า (ไทย)
              </label>
              <input
                type="text"
                required
                value={thaiName}
                onChange={(e) => setThaiName(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-sky-500"
              />
            </div>
          </div>

          {/* Sets & Reps Text & Phase */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-600 font-semibold block mb-1">
                ข้อความเซต/ครั้ง
              </label>
              <input
                type="text"
                value={setsRepsText}
                onChange={(e) => setSetsRepsText(e.target.value)}
                placeholder="เช่น 10 ครั้ง x 2 เซต"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-sky-500"
              />
            </div>
            <div>
              <label className="text-slate-600 font-semibold block mb-1">
                ช่วงสัปดาห์ (Phase)
              </label>
              <select
                value={phaseWeeks}
                onChange={(e) => setPhaseWeeks(e.target.value as any)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-sky-500 font-medium"
              >
                <option value="1-2">สัปดาห์ 1-2</option>
                <option value="3-4">สัปดาห์ 3-4</option>
              </select>
            </div>
          </div>

          {/* Reps, Sets, Hold */}
          <div className="grid grid-cols-3 gap-2.5">
            <div>
              <label className="text-slate-600 font-semibold block mb-1">
                จำนวนครั้ง (Reps)
              </label>
              <input
                type="number"
                min="1"
                value={repsTarget}
                onChange={(e) => setRepsTarget(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-sky-500 font-mono"
              />
            </div>
            <div>
              <label className="text-slate-600 font-semibold block mb-1">
                จำนวนเซต (Sets)
              </label>
              <input
                type="number"
                min="1"
                value={setsTarget}
                onChange={(e) => setSetsTarget(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-sky-500 font-mono"
              />
            </div>
            <div>
              <label className="text-slate-600 font-semibold block mb-1">
                ค้างไว้ (วินาที)
              </label>
              <input
                type="number"
                min="0"
                value={holdSeconds}
                onChange={(e) => setHoldSeconds(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-sky-500 font-mono"
              />
            </div>
          </div>

          {/* Cue */}
          <div>
            <label className="text-slate-600 font-semibold block mb-1">
              คำสั่งเตือนท่า (Cue)
            </label>
            <input
              type="text"
              value={cue}
              onChange={(e) => setCue(e.target.value)}
              placeholder="เช่น ให้คางถอยเข้า ไม่เงยศีรษะ"
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-sky-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-slate-600 font-semibold block mb-1">
              คำอธิบายประโยชน์ของท่า
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-sky-500 leading-relaxed"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-2">
            {onDelete && (
              <button
                type="button"
                onClick={() => {
                  onDelete(exercise.id);
                  onClose();
                }}
                className="p-2.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 font-semibold text-xs transition-colors cursor-pointer shrink-0"
                title="ลบท่ากายภาพนี้"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs transition-colors cursor-pointer"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 active:scale-[0.99] text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-amber-600/20 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>บันทึกท่ากายภาพ</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
