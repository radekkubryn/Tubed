import React from 'react';
import { UserProgress } from '../types';

interface Props {
  onPlay: () => void;
  onShowLeaderboard: () => void;
  progress: UserProgress;
}

const MainMenu: React.FC<Props> = ({ onPlay, onShowLeaderboard, progress }) => {
  return (
    <div className="flex flex-col h-full bg-slate-900 items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-yellow-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-[-20%] left-[20%] w-64 h-64 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="z-10 text-center space-y-12">
        <div className="space-y-2">
            <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 drop-shadow-lg">
            KULKI
            </h1>
            <p className="text-slate-400 uppercase tracking-widest text-sm">Sortuj • Układaj • Wygrywaj</p>
        </div>

        <div className="flex flex-col gap-4 w-64 mx-auto">
          <button 
            onClick={onPlay}
            className="group relative px-8 py-4 bg-indigo-600 hover:bg-indigo-500 rounded-2xl shadow-lg transition-all hover:scale-105 active:scale-95"
          >
            <span className="text-xl font-bold text-white tracking-wider">
                {progress.unlockedLevel > 1 ? 'KONTYNUUJ' : 'GRAJ'}
            </span>
            <div className="absolute inset-0 rounded-2xl ring-2 ring-white/20 group-hover:ring-white/40"></div>
          </button>

          <button 
            onClick={onShowLeaderboard}
            className="px-8 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl shadow-md transition-all text-slate-300 font-semibold border border-slate-700"
          >
            RANKING
          </button>
        </div>

        <div className="text-xs text-slate-500 mt-8">
            Odblokowany poziom: <span className="text-indigo-400 font-bold">{progress.unlockedLevel} / 40</span>
        </div>
      </div>
    </div>
  );
};

export default MainMenu;