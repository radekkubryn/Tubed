
import React from 'react';
import { UserProgress, ACHIEVEMENTS_DATA, MAX_LEVELS, Language } from '../types';
import { triggerPrestigeReset, setLanguage } from '../services/storage';
import { t } from '../services/i18n';

interface Props {
  onPlay: () => void;
  onShowLeaderboard: () => void;
  onShowRules: () => void;
  onShowShop: () => void;
  onShowLab: () => void;
  onShowAchievements: () => void;
  onShowAdventure: () => void;
  onTestMode: () => void;
  progress: UserProgress;
  onRefresh: () => void;
}

const MainMenu: React.FC<Props> = ({ 
  onPlay, 
  onShowLeaderboard, 
  onShowRules, 
  onShowShop, 
  onShowLab, 
  onShowAchievements, 
  onShowAdventure,
  onTestMode, 
  progress,
  onRefresh
}) => {
  const lang = progress.language;

  const claimableCount = ACHIEVEMENTS_DATA.filter(a => {
      const current = progress.achievementsProgress[a.id] || 0;
      const claimed = progress.achievementsClaimed[a.id];
      return current >= a.target && !claimed;
  }).length;

  const isDevEnvironment = 
      window.location.hostname.includes('localhost') || 
      window.location.hostname.includes('googleusercontent') ||
      window.location.search.includes('dev=true');

  const handlePrestige = () => {
      if (confirm(t('prestigeConfirm', lang))) {
          if (triggerPrestigeReset()) {
              onRefresh();
          }
      }
  };

  const handleToggleLanguage = () => {
      const nextLang: Language = lang === 'en' ? 'pl' : 'en';
      setLanguage(nextLang);
      onRefresh();
  };

  const totalStars = (Object.values(progress.stars) as number[]).reduce((a, b) => a + b, 0);

  return (
    <div className="flex flex-col h-full bg-slate-900 items-center p-6 relative overflow-hidden text-white">
      {/* Background Ambience */}
      <div className="absolute top-[-20%] left-[-20%] w-96 h-96 bg-indigo-600/30 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-80 h-80 bg-purple-600/30 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      {/* Top Bar */}
      <div className="w-full flex justify-between items-center z-10 mb-4">
          <div className="flex gap-3 bg-slate-800/50 backdrop-blur-md px-4 py-2 rounded-full border border-slate-700 shadow-md">
              <div className="flex items-center gap-1 font-bold text-yellow-300">
                  <span>{progress.coins}</span> <span className="text-lg">🪙</span>
              </div>
              <div className="w-px bg-slate-600 h-5"></div>
              <div className="flex items-center gap-1 font-bold text-purple-300">
                  <span>{totalStars - (progress.spentStars || 0)}</span> <span className="text-lg">★</span>
              </div>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={handleToggleLanguage}
              className="w-10 h-10 bg-slate-800/50 backdrop-blur-md rounded-full flex items-center justify-center border border-slate-700 shadow-md hover:bg-slate-700 transition-colors font-bold text-xs"
            >
                {lang.toUpperCase()}
            </button>
            <button 
              onClick={onShowRules}
              className="w-10 h-10 bg-slate-800/50 backdrop-blur-md rounded-full flex items-center justify-center border border-slate-700 shadow-md hover:bg-slate-700 transition-colors"
            >
                <span className="text-xl">❔</span>
            </button>
          </div>
      </div>

      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center z-10 w-full">
          {/* Mascot */}
          <div className="relative w-40 h-40 mb-4 animate-float cursor-pointer hover:scale-105 transition-transform duration-300">
             <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-xl transform translate-y-4"></div>
             <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xl relative z-10">
                <defs>
                  <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#818cf8" />
                    <stop offset="50%" stopColor="#c084fc" />
                    <stop offset="100%" stopColor="#f472b6" />
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                    <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
                  </filter>
                </defs>
                <circle cx="100" cy="100" r="90" fill="url(#bodyGrad)" stroke="white" strokeWidth="3" filter="url(#glow)" />
                <ellipse cx="60" cy="55" rx="25" ry="12" fill="white" fillOpacity="0.3" transform="rotate(-45 60 55)" />
                <g>
                  <circle cx="65" cy="90" r="14" fill="white" />
                  <circle cx="68" cy="90" r="6" fill="#0f172a" />
                  <circle cx="70" cy="88" r="2" fill="white" fillOpacity="0.8" />
                  <circle cx="135" cy="90" r="14" fill="white" />
                  <circle cx="132" cy="90" r="6" fill="#0f172a" />
                  <circle cx="130" cy="88" r="2" fill="white" fillOpacity="0.8" />
                </g>
                <circle cx="55" cy="110" r="8" fill="#f9a8d4" fillOpacity="0.6" />
                <circle cx="145" cy="110" r="8" fill="#f9a8d4" fillOpacity="0.6" />
                <path d="M 85 125 Q 100 138 115 125" stroke="#0f172a" strokeWidth="4" fill="none" strokeLinecap="round" />
             </svg>
          </div>

          <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 drop-shadow-sm mb-1 tracking-tight">
              {t('gameTitle', lang)}
          </h1>
          <div className="text-xs uppercase tracking-[0.3em] text-slate-400 font-bold mb-8">{t('logicPuzzle', lang)}</div>

          {/* Big Play Button */}
          <button 
            onClick={onPlay}
            className="w-full max-w-xs group relative py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-lg shadow-indigo-500/30 transition-all hover:scale-[1.02] active:scale-[0.98] overflow-hidden mb-12 sm:mb-8"
          >
            <div className="absolute inset-0 bg-white/10 group-hover:bg-white/20 transition-colors"></div>
            <div className="relative flex flex-col items-center">
                <span className="text-2xl font-bold tracking-wider text-white drop-shadow-md">
                    {progress.unlockedLevel > 1 ? t('continue', lang) : t('play', lang)}
                </span>
                <span className="text-xs font-bold text-indigo-200 mt-1 uppercase tracking-widest bg-black/20 px-2 py-0.5 rounded">
                    {t('level', lang)} {progress.unlockedLevel}
                </span>
            </div>
          </button>
      </div>

      {/* Bottom Grid Navigation */}
      <div className="w-full max-w-xs grid grid-cols-2 gap-3 z-10 mb-4">
          
          <button onClick={onShowAdventure} className="bg-slate-800/60 hover:bg-teal-900/50 border border-slate-700 hover:border-teal-500/50 backdrop-blur-sm p-3 rounded-2xl flex flex-col items-center gap-1 transition-all">
              <span className="text-2xl">🧭</span>
              <span className="text-xs font-bold text-slate-300">{t('adventure', lang)}</span>
          </button>

          <button onClick={onShowLab} className="bg-slate-800/60 hover:bg-purple-900/50 border border-slate-700 hover:border-purple-500/50 backdrop-blur-sm p-3 rounded-2xl flex flex-col items-center gap-1 transition-all">
              <span className="text-2xl">🧪</span>
              <span className="text-xs font-bold text-slate-300">{t('lab', lang)}</span>
          </button>

          <button onClick={onShowShop} className="bg-slate-800/60 hover:bg-yellow-900/50 border border-slate-700 hover:border-yellow-500/50 backdrop-blur-sm p-3 rounded-2xl flex flex-col items-center gap-1 transition-all">
              <span className="text-2xl">🛒</span>
              <span className="text-xs font-bold text-slate-300">{t('shop', lang)}</span>
          </button>

          <button onClick={onShowLeaderboard} className="bg-slate-800/60 hover:bg-blue-900/50 border border-slate-700 hover:border-blue-500/50 backdrop-blur-sm p-3 rounded-2xl flex flex-col items-center gap-1 transition-all">
              <span className="text-2xl">🏆</span>
              <span className="text-xs font-bold text-slate-300">{t('leaderboard', lang)}</span>
          </button>

          {/* Full Width Achievements */}
          <button onClick={onShowAchievements} className="col-span-2 bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700 backdrop-blur-sm p-3 rounded-2xl flex items-center justify-center gap-3 transition-all relative">
              <span className="text-2xl">🏅</span>
              <span className="text-sm font-bold text-slate-200">{t('trophies', lang)}</span>
              {claimableCount > 0 && (
                 <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full animate-bounce shadow-sm border border-slate-900 font-bold">
                     {claimableCount}
                 </div>
             )}
          </button>
      </div>

      {/* Prestige / Dev Footer */}
      <div className="w-full flex flex-col items-center gap-2 z-10 min-h-[30px]">
          {progress.unlockedLevel > MAX_LEVELS && (
              <button 
                  onClick={handlePrestige}
                  className="px-4 py-1.5 bg-gradient-to-r from-amber-600 to-yellow-600 rounded-full border border-yellow-400/50 shadow-lg animate-pulse text-white font-bold text-[10px] tracking-wider uppercase"
              >
                  ✨ {t('prestige', lang)} (x{progress.prestigeLevel + 1}) ✨
              </button>
          )}

          {isDevEnvironment && (
            <button 
              onClick={onTestMode}
              className="text-[9px] text-slate-600 font-mono uppercase hover:text-slate-400"
            >
              [ DEV MODE ]
            </button>
          )}
      </div>
    </div>
  );
};

export default MainMenu;
