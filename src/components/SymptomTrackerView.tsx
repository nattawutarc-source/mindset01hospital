import React, { useState } from 'react';
import { ArrowLeft, Check, Calendar, Activity, AlertCircle, History, Trash2 } from 'lucide-react';
import { SymptomLog } from '../types';

interface SymptomTrackerViewProps {
  onBack: () => void;
  onSaveLog: (log: Omit<SymptomLog, 'id'>) => void;
  existingLogs: SymptomLog[];
  onDeleteLog?: (logId: string) => void;
}

export const SymptomTrackerView: React.FC<SymptomTrackerViewProps> = ({
  onBack,
  onSaveLog,
  existingLogs,
  onDeleteLog,
}) => {
  const [restPain, setRestPain] = useState(2);
  const [workPain, setWorkPain] = useState(4);
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>(['นั่งนาน', 'ใช้คอมพิวเตอร์']);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const triggersList = [
    'นั่งนาน',
    'ก้มหน้า',
    'ใช้คอมพิวเตอร์',
    'เครียด',
    'นอนน้อย',
    'ยกของหนัก',
    'ขับรถนาน',
    'อื่นๆ',
  ];

  const toggleTrigger = (trigger: string) => {
    if (selectedTriggers.includes(trigger)) {
      setSelectedTriggers(selectedTriggers.filter((t) => t !== trigger));
    } else {
      setSelectedTriggers([...selectedTriggers, trigger]);
    }
  };

  const handleSave = () => {
    onSaveLog({
      patientId: 'P001',
      date: new Date().toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' }),
      restPain,
      workPain,
      triggers: selectedTriggers,
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
    }, 2500);
  };

  const getPainColor = (val: number) => {
    if (val <= 2) return 'text-emerald-600';
    if (val <= 5) return 'text-amber-500';
    if (val <= 7) return 'text-orange-600';
    return 'text-rose-600';
  };

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
        <h1 className="text-base font-bold text-slate-900">บันทึกอาการประจำวัน</h1>
        <div className="w-8" />
      </div>

      {/* Date Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-3.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
          <Calendar className="w-4 h-4 text-sky-600" />
          <span>วันนี้ {new Date().toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
        </div>
        <span className="text-[11px] text-slate-500">ใช้เวลาไม่ถึง 1 นาที</span>
      </div>

      {/* Pain Slider 1: ขณะพัก (NRS 0-10) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <label className="text-xs font-bold text-slate-800 block">
              อาการปวด ขณะพัก
            </label>
            <span className="text-[10px] text-slate-500 block">
              ระดับคะแนนความปวด (NRS 0–10)
            </span>
          </div>
          <span className={`text-2xl font-black font-mono ${getPainColor(restPain)}`}>
            {restPain}
          </span>
        </div>

        {/* Interactive Slider */}
        <input
          type="range"
          min="0"
          max="10"
          value={restPain}
          onChange={(e) => setRestPain(Number(e.target.value))}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
        />

        <div className="flex justify-between text-[10px] text-slate-400 font-mono">
          <span>0 (ไม่ปวดเลย)</span>
          <span>5 (ปวดปานกลาง)</span>
          <span>10 (ปวดมากที่สุด)</span>
        </div>
      </div>

      {/* Pain Slider 2: ขณะทำงาน (NRS 0-10) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <label className="text-xs font-bold text-slate-800 block">
              อาการปวด ขณะทำงาน/กิจกรรม
            </label>
            <span className="text-[10px] text-slate-500 block">
              ระดับคะแนนความปวด (NRS 0–10)
            </span>
          </div>
          <span className={`text-2xl font-black font-mono ${getPainColor(workPain)}`}>
            {workPain}
          </span>
        </div>

        {/* Interactive Slider */}
        <input
          type="range"
          min="0"
          max="10"
          value={workPain}
          onChange={(e) => setWorkPain(Number(e.target.value))}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-500"
        />

        <div className="flex justify-between text-[10px] text-slate-400 font-mono">
          <span>0 (ไม่ปวดเลย)</span>
          <span>5 (ปวดปานกลาง)</span>
          <span>10 (ปวดรุนแรงที่สุด)</span>
        </div>
      </div>

      {/* Exacerbating factors */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
        <div>
          <h3 className="text-xs font-bold text-slate-800">
            ปัจจัยที่ทำให้อาการแย่ลง
          </h3>
          <p className="text-[10px] text-slate-500">เลือกได้หลายข้อตามพฤติกรรมวันนี้</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {triggersList.map((trig) => {
            const isSelected = selectedTriggers.includes(trig);
            return (
              <button
                key={trig}
                type="button"
                onClick={() => toggleTrigger(trig)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  isSelected
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {trig}
              </button>
            );
          })}
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="w-full h-12 rounded-xl bg-sky-600 hover:bg-sky-700 active:scale-[0.99] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-md shadow-sky-600/20 cursor-pointer transition-all"
      >
        <Check className="w-4 h-4" />
        <span>บันทึก</span>
      </button>

      {/* Success Banner */}
      {savedSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>บันทึกอาการปวดเรียบร้อยแล้ว ข้อมูลจะส่งไปยังนักกายภาพบำบัด</span>
        </div>
      )}

      {/* Recent History */}
      {existingLogs.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
            <History className="w-4 h-4 text-slate-400" />
            <span>ประวัติการบันทึกล่าสุด</span>
          </div>

          <div className="space-y-2 divide-y divide-slate-100">
            {existingLogs.slice(-5).reverse().map((log) => (
              <div key={log.id} className="pt-2 flex items-center justify-between text-xs gap-2">
                <div>
                  <span className="font-semibold text-slate-800">{log.date}</span>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    ปัจจัย: {log.triggers.join(', ') || 'ไม่มี'}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 block">พัก / ทำงาน</span>
                    <span className="font-mono font-bold text-slate-800">
                      {log.restPain} / {log.workPain}
                    </span>
                  </div>
                  {onDeleteLog && (
                    <button
                      type="button"
                      onClick={() => onDeleteLog(log.id)}
                      title="ลบบันทึกนี้"
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
