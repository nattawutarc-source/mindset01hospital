import React from 'react';
import { ScreenId } from '../types';
import { Home, Dumbbell, ClipboardList, TrendingUp, BookOpen } from 'lucide-react';

interface BottomNavProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentScreen, onNavigate }) => {
  const tabs = [
    { id: 'home' as ScreenId, label: 'หน้าแรก', icon: Home },
    { id: 'exercise-list' as ScreenId, label: 'ออกกำลังกาย', icon: Dumbbell },
    { id: 'symptom-tracker' as ScreenId, label: 'บันทึกอาการ', icon: ClipboardList },
    { id: 'progress-comparison' as ScreenId, label: 'ความก้าวหน้า', icon: TrendingUp },
    { id: 'articles' as ScreenId, label: 'ความรู้', icon: BookOpen },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200">
      <div className="max-w-md mx-auto grid grid-cols-5 h-16 px-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentScreen === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className={`flex flex-col items-center justify-center py-1 transition-colors min-h-[48px] ${
                isActive ? 'text-sky-600 font-semibold' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-sky-600" />
                )}
              </div>
              <span className="text-[11px] mt-1 tracking-tight truncate max-w-[64px]">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
