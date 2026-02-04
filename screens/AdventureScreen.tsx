
import React from 'react';
import { ARTIFACTS_DATA, BOSSES_DATA } from '../types';
import { getProgress } from '../services/storage';
import { t } from '../services/i18n';

interface Props {
  onBack: () => void;
}

const AdventureScreen: React.FC<Props> = ({ onBack }) => {
  const progress = getProgress();
  const lang = progress.language;

  return (
    <div className="flex flex-col h-full bg-slate-900 text-white">
      <div className="p-4 bg-slate-800 shadow-md flex items-center shrink-0 z-10">
        <button onClick={onBack} className="text-slate-400 hover:text-white mr-4">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </button>
        <h1 className="text-xl font-bold text-teal-400 tracking-wider flex items-center gap-2 uppercase">
            <span>🧭</span> {t('adventure', lang)}
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
          <div>
              <div className="text-center mb-6">
                  <div className="text-4xl mb-2">📜</div>
                  <h2 className="text-lg font-bold text-amber-400">{t('lostArtifacts', lang)}</h2>
                  <div className="mt-2 text-xs font-bold bg-slate-800 p-2 rounded inline-block">
                      {progress.artifacts.length} / {ARTIFACTS_DATA.length}
                  </div>
              </div>
              <div className="grid grid-cols-1 gap-4">
                  {ARTIFACTS_DATA.map(art => {
                      const isUnlocked = progress.artifacts.includes(art.id);
                      return (
                          <div key={art.id} className={`p-4 rounded-xl border ${isUnlocked ? 'bg-amber-900/20 border-amber-500/50' : 'bg-slate-800 border-slate-700 opacity-60'}`}>
                              <div className="flex items-start gap-4">
                                  <div className={`w-16 h-16 rounded-full flex items-center justify-center text-4xl bg-slate-900 border-2 ${isUnlocked ? 'border-amber-400 text-white' : 'border-slate-600 text-slate-700'}`}>
                                      {isUnlocked ? art.icon : '?'}
                                  </div>
                                  <div className="flex-1">
                                      <h3 className={`font-bold text-sm ${isUnlocked ? 'text-amber-200' : 'text-slate-500'}`}>
                                          {isUnlocked ? art.title[lang] : '???'}
                                      </h3>
                                      <p className="text-xs text-slate-400 mt-2 italic leading-relaxed">
                                          {isUnlocked ? `"${art.description[lang]}"` : '...'}
                                      </p>
                                  </div>
                              </div>
                          </div>
                      );
                  })}
              </div>
          </div>

          <div>
              <div className="text-center mb-6 pt-6 border-t border-slate-700">
                  <div className="text-4xl mb-2">☠️</div>
                  <h2 className="text-lg font-bold text-red-500">{t('villainGallery', lang)}</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {BOSSES_DATA.map(boss => {
                      const isDefeated = progress.unlockedLevel > boss.level;
                      const isNext = !isDefeated && progress.unlockedLevel <= boss.level && progress.unlockedLevel > boss.level - 10;
                      return (
                          <div key={boss.level} className={`
                              relative p-4 rounded-xl border flex flex-col gap-2 overflow-hidden
                              ${isDefeated ? 'bg-gradient-to-br from-red-900/40 to-slate-900 border-red-500/50 shadow-md' : 'bg-slate-800 border-slate-700 opacity-70 grayscale'}
                              ${isNext ? 'ring-2 ring-red-500/30 animate-pulse-slow grayscale-0 opacity-100' : ''}
                          `}>
                              <div className="flex justify-between items-start">
                                  <div className="flex flex-col">
                                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                                          {t('level', lang)} {boss.level}
                                      </span>
                                      <h3 className={`font-bold ${isDefeated ? 'text-red-300' : 'text-slate-400'}`}>
                                          {isDefeated || isNext ? boss.name[lang] : '???'}
                                      </h3>
                                      <span className="text-[10px] text-slate-400 italic">
                                          {isDefeated || isNext ? boss.title[lang] : '...'}
                                      </span>
                                  </div>
                                  <div className="text-4xl filter drop-shadow-lg">
                                      {isDefeated || isNext ? boss.icon : '🔒'}
                                  </div>
                              </div>
                              {isDefeated ? (
                                  <div className="mt-2 text-xs text-slate-300 bg-black/20 p-2 rounded italic">
                                      "{boss.description[lang]}"
                                  </div>
                              ) : null}
                              <div className="mt-auto pt-3 flex items-center gap-2 text-[10px] font-bold text-yellow-500 border-t border-white/5">
                                  <span>{boss.reward.coins} 🪙</span>
                                  <span>{boss.reward.stars} ★</span>
                              </div>
                              {isDefeated && (
                                  <div className="absolute top-2 right-2 text-green-500 text-xl font-bold border-2 border-green-500 rounded-full w-8 h-8 flex items-center justify-center opacity-30 rotate-12">✓</div>
                              )}
                          </div>
                      );
                  })}
              </div>
          </div>
      </div>
    </div>
  );
};

export default AdventureScreen;
