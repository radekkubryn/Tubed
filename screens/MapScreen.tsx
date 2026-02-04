
import React, { useEffect, useRef } from 'react';
import { UserProgress, MAX_LEVELS } from '../types';
import { t } from '../services/i18n';

interface Props {
  progress: UserProgress;
  onLevelSelect: (id: number) => void;
  onBack: () => void;
}

const MapScreen: React.FC<Props> = ({ progress, onLevelSelect, onBack }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const lang = progress.language;

  useEffect(() => {
    const timer = setTimeout(() => {
      if (scrollRef.current) {
        const unlockedNode = document.getElementById(`level-${progress.unlockedLevel}`);
        if (unlockedNode) {
          unlockedNode.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
             scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [progress.unlockedLevel]);

  const levels = Array.from({ length: MAX_LEVELS }, (_, i) => i + 1);

  return (
    <div className="flex flex-col h-full bg-slate-900">
      <div className="p-4 bg-slate-800 shadow-md flex items-center z-10 shrink-0">
        <button onClick={onBack} className="text-white mr-4">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </button>
        <h1 className="text-xl font-bold text-white">{t('mapTitle', lang)}</h1>
        <div className="ml-auto text-yellow-400 font-bold flex items-center gap-1">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
            {Object.values(progress.stars).reduce((a: number, b: number) => a + b, 0)}
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto relative p-8 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed">
        <div className="relative flex flex-col-reverse items-center min-h-full py-10 gap-12">
            <div className="absolute top-10 bottom-10 w-1 border-l-2 border-dashed border-slate-600 left-1/2 transform -translate-x-1/2 -z-10"></div>
            {levels.map((level) => {
                const isUnlocked = level <= progress.unlockedLevel;
                const isCurrent = level === progress.unlockedLevel;
                const stars = progress.stars[level] || 0;
                const isBossLevel = level % 10 === 0;
                const offset = Math.sin(level * 0.8) * 80; 

                let bgClass = '';
                let borderClass = '';
                let shadowClass = '';
                let textClass = '';

                if (isUnlocked) {
                    if (isBossLevel) {
                        bgClass = 'bg-gradient-to-br from-red-600 via-orange-600 to-red-800';
                        borderClass = 'border-red-200';
                        shadowClass = 'shadow-[0_0_20px_rgba(220,38,38,0.8)]';
                        textClass = 'text-white drop-shadow-md';
                    } else {
                        bgClass = 'bg-gradient-to-br from-blue-500 to-indigo-600';
                        borderClass = 'border-white';
                        shadowClass = 'shadow-lg';
                        textClass = 'text-white';
                    }
                } else {
                    if (isBossLevel) {
                        bgClass = 'bg-slate-800';
                        borderClass = 'border-red-900/50';
                        textClass = 'text-red-900';
                        shadowClass = 'shadow-none';
                    } else {
                        bgClass = 'bg-slate-700';
                        borderClass = 'border-slate-600';
                        textClass = 'text-slate-500';
                        shadowClass = 'shadow-none';
                    }
                }

                return (
                    <div 
                        key={level}
                        id={`level-${level}`}
                        className={`
                            relative w-16 h-16 rounded-full flex flex-col items-center justify-center
                            border-4 transition-transform hover:scale-110 cursor-pointer shrink-0
                            ${isCurrent ? 'animate-pulse ring-4 ring-yellow-500/50' : ''}
                            ${bgClass} ${borderClass} ${shadowClass} ${textClass}
                            ${!isUnlocked ? 'cursor-not-allowed' : ''}
                        `}
                        style={{ transform: `translateX(${offset}px)` }}
                        onClick={() => isUnlocked && onLevelSelect(level)}
                    >
                        {isUnlocked ? (
                            <>
                                <span className="text-xl font-bold leading-none">{level}</span>
                                {isBossLevel && <span className="text-[10px] opacity-80 mt-0.5">💀</span>}
                            </>
                        ) : (
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                        )}
                        {isUnlocked && stars > 0 && (
                            <div className="absolute -bottom-6 flex gap-1 justify-center w-full">
                                {Array.from({length: 3}).map((_, i) => (
                                    <svg key={i} className={`w-3 h-3 ${i < stars ? 'text-yellow-400 fill-current' : 'text-slate-600'}`} viewBox="0 0 24 24">
                                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                                    </svg>
                                ))}
                            </div>
                        )}
                        {isCurrent && (
                            <div className="absolute -top-8 bg-yellow-500 text-slate-900 text-[10px] font-bold px-2 py-1 rounded shadow animate-bounce whitespace-nowrap z-20 uppercase">
                                {t('play', lang)}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
      </div>
    </div>
  );
};

export default MapScreen;
