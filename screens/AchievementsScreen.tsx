import React, { useState } from 'react';
import { UserProgress, ACHIEVEMENTS_DATA, Achievement } from '../types';
import { getProgress, claimAchievement } from '../services/storage';
import { audio } from '../services/audio';

interface Props {
  onBack: () => void;
}

const AchievementsScreen: React.FC<Props> = ({ onBack }) => {
  const [progress, setProgress] = useState<UserProgress>(getProgress());
  const [activeTab, setActiveTab] = useState<'all' | 'progress' | 'mechanic' | 'skill' | 'collection'>('all');

  const handleClaim = (id: string) => {
      const result = claimAchievement(id);
      if (result.success) {
          audio.playVictory(); // Or dedicated sound
          setProgress(getProgress());
      }
  };

  const filtered = ACHIEVEMENTS_DATA.filter(a => activeTab === 'all' || a.category === activeTab);
  
  // Sorting: Claimable first, then In Progress, then Completed
  const sorted = [...filtered].sort((a, b) => {
      const pA = progress.achievementsProgress[a.id] || 0;
      const cA = progress.achievementsClaimed[a.id];
      const readyA = !cA && pA >= a.target;

      const pB = progress.achievementsProgress[b.id] || 0;
      const cB = progress.achievementsClaimed[b.id];
      const readyB = !cB && pB >= b.target;

      if (readyA && !readyB) return -1;
      if (!readyA && readyB) return 1;
      
      if (cA && !cB) return 1;
      if (!cA && cB) return -1;

      return 0;
  });

  const totalClaimed = Object.keys(progress.achievementsClaimed).length;
  const progressPercent = Math.round((totalClaimed / ACHIEVEMENTS_DATA.length) * 100);

  return (
    <div className="flex flex-col h-full bg-slate-900 text-white">
      <div className="p-4 bg-slate-800 shadow-md flex flex-col gap-2 z-10 shrink-0">
         <div className="flex items-center">
            <button onClick={onBack} className="text-slate-400 hover:text-white mr-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            </button>
            <h1 className="text-xl font-bold text-yellow-500">OSIĄGNIĘCIA</h1>
            <div className="ml-auto text-xs font-bold bg-slate-700 px-2 py-1 rounded">
                {totalClaimed} / {ACHIEVEMENTS_DATA.length}
            </div>
         </div>
         
         {/* Overall Progress Bar */}
         <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden mt-1">
             <div className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
         </div>

         {/* Tabs - Now flex-wrap to prevent scrolling */}
         <div className="flex flex-wrap gap-2 justify-center pt-2">
             {['all', 'progress', 'mechanic', 'skill', 'collection'].map(tab => (
                 <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase transition-colors ${activeTab === tab ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-700 text-slate-400 hover:bg-slate-600'}`}
                 >
                     {tab === 'all' ? 'Wszystkie' : tab === 'progress' ? 'Poziomy' : tab === 'mechanic' ? 'Mechanika' : tab === 'skill' ? 'Skill' : 'Kolekcja'}
                 </button>
             ))}
         </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {sorted.map(ach => {
              const current = progress.achievementsProgress[ach.id] || 0;
              const isClaimed = progress.achievementsClaimed[ach.id];
              const isCompleted = current >= ach.target;
              const percent = Math.min(100, Math.floor((current / ach.target) * 100));

              return (
                  <div key={ach.id} className={`relative p-3 rounded-xl border flex gap-3 ${isClaimed ? 'bg-slate-800/40 border-slate-700 opacity-60' : (isCompleted ? 'bg-indigo-900/40 border-yellow-500' : 'bg-slate-800 border-slate-700')}`}>
                      <div className="text-3xl flex items-center justify-center w-12 shrink-0">
                          {ach.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                              <h3 className={`font-bold text-sm truncate ${isCompleted && !isClaimed ? 'text-yellow-400' : 'text-slate-200'}`}>{ach.title}</h3>
                              {isClaimed && <span className="text-xs text-green-400 font-bold">ODEBRANO</span>}
                          </div>
                          <p className="text-xs text-slate-400 truncate">{ach.description}</p>
                          
                          <div className="mt-2">
                              <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                                  <span>Postęp</span>
                                  <span>{Math.min(current, ach.target)} / {ach.target}</span>
                              </div>
                              <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                                  <div className={`h-full rounded-full transition-all duration-500 ${isCompleted ? 'bg-green-500' : 'bg-indigo-500'}`} style={{ width: `${percent}%` }}></div>
                              </div>
                          </div>
                      </div>

                      {/* Action Button */}
                      <div className="flex flex-col items-center justify-center border-l border-slate-700 pl-3 min-w-[70px]">
                          {isClaimed ? (
                              <div className="text-xl opacity-50">✓</div>
                          ) : isCompleted ? (
                              <button 
                                onClick={() => handleClaim(ach.id)}
                                className="w-full py-1 px-2 bg-yellow-500 hover:bg-yellow-400 text-slate-900 text-xs font-bold rounded animate-pulse shadow-[0_0_10px_rgba(234,179,8,0.5)]"
                              >
                                  ODBIERZ
                                  <div className="flex items-center justify-center gap-1 mt-0.5">
                                      {ach.reward.amount} {ach.reward.type === 'coins' ? '🪙' : '★'}
                                  </div>
                              </button>
                          ) : (
                              <div className="flex flex-col items-center opacity-70">
                                   <span className="text-xs font-bold text-slate-400">Nagroda</span>
                                   <div className="flex items-center gap-1 text-xs text-yellow-200">
                                      {ach.reward.amount} {ach.reward.type === 'coins' ? '🪙' : '★'}
                                  </div>
                              </div>
                          )}
                      </div>
                  </div>
              );
          })}
      </div>
    </div>
  );
};

export default AchievementsScreen;