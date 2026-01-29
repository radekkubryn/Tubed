import React, { useState } from 'react';
import { UserProgress, POWERUP_COSTS, PowerUpType, POWERUP_UNLOCK_REQUIREMENTS, LAB_ITEMS_DATA } from '../types';
import { buyPowerUp, getProgress } from '../services/storage';
import { audio } from '../services/audio';

interface Props {
  onBack: () => void;
}

const ShopScreen: React.FC<Props> = ({ onBack }) => {
  const [progress, setProgress] = useState<UserProgress>(getProgress());
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleBuy = (type: PowerUpType) => {
    const cost = POWERUP_COSTS[type];
    if (buyPowerUp(type, cost)) {
        audio.playSelect();
        setProgress(getProgress());
        setFeedback(`Kupiono: ${type}!`);
        setTimeout(() => setFeedback(null), 1500);
    } else {
        audio.playInvalid();
        setFeedback("Za mało monet!");
        setTimeout(() => setFeedback(null), 1500);
    }
  };

  const getLabel = (type: string) => {
      switch(type) {
          case 'undo': return 'Cofnij';
          case 'wand': return 'Różdżka';
          case 'pickaxe': return 'Kilof';
          case 'flame': return 'Miotacz';
          case 'xray': return 'Rentgen';
          case 'hammer': return 'Młot';
          case 'paint': return 'Pędzel';
          case 'magnet': return 'Magnes';
          case 'swap': return 'Zamiana';
          case 'pocket': return 'Kieszeń';
          default: return type;
      }
  };

  const getIcon = (type: string) => {
      switch(type) {
          case 'undo': return '↩️';
          case 'wand': return '🪄';
          case 'pickaxe': return '⛏️';
          case 'flame': return '🔥';
          case 'xray': return '👁️';
          case 'hammer': return '🔨';
          case 'paint': return '🖌️';
          case 'magnet': return '🧲';
          case 'swap': return '⇄';
          case 'pocket': return '📥';
          default: return '❓';
      }
  };

  const getRequirementName = (reqId: string) => {
      const item = LAB_ITEMS_DATA.find(i => i.id === reqId);
      return item ? item.name : 'Nieznany przedmiot';
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-white">
      <div className="p-4 bg-slate-800 shadow-md flex items-center shrink-0 justify-between">
        <button onClick={onBack} className="text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </button>
        <h1 className="text-xl font-bold text-yellow-500">SKLEP</h1>
        <div className="flex items-center gap-1 font-mono text-yellow-300">
            <span>{progress.coins}</span> 🪙
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {feedback && (
            <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-4 py-2 rounded-full shadow-xl border border-yellow-500 z-50 animate-bounce">
                {feedback}
            </div>
        )}
        
        <div className="text-xs text-slate-400 mb-4 text-center">
            Rozbuduj Laboratorium, aby odblokować nowe przedmioty!
        </div>

        <div className="grid grid-cols-2 gap-4">
            {(Object.keys(POWERUP_COSTS) as PowerUpType[]).map((type) => {
                const reqId = POWERUP_UNLOCK_REQUIREMENTS[type];
                const isLocked = reqId ? !progress.labItems.includes(reqId) : false;
                
                return (
                    <div key={type} className={`
                        p-4 rounded-xl border flex flex-col items-center gap-2 relative overflow-hidden transition-all
                        ${isLocked ? 'bg-slate-800/80 border-slate-700 opacity-80' : 'bg-slate-800/50 border-slate-600'}
                    `}>
                        <div className="text-4xl mb-2 filter drop-shadow-lg">{getIcon(type)}</div>
                        <div className="font-bold text-indigo-300">{getLabel(type)}</div>
                        
                        {!isLocked ? (
                            <>
                                <div className="text-xs text-slate-400 mb-2">Posiadasz: {progress.inventory[type] || 0}</div>
                                <button 
                                    onClick={() => handleBuy(type)}
                                    className="w-full py-2 bg-yellow-600 hover:bg-yellow-500 text-white font-bold rounded-lg flex items-center justify-center gap-1 active:scale-95 transition-all"
                                >
                                    {POWERUP_COSTS[type]} 🪙
                                </button>
                            </>
                        ) : (
                            <>
                                <div className="absolute inset-0 bg-slate-900/60 flex flex-col items-center justify-center text-center p-2 backdrop-blur-[1px]">
                                    <span className="text-2xl mb-1">🔒</span>
                                    <div className="text-[10px] text-red-400 font-bold uppercase">Wymaga:</div>
                                    <div className="text-xs text-white font-semibold leading-tight">{getRequirementName(reqId!)}</div>
                                </div>
                            </>
                        )}
                    </div>
                );
            })}
        </div>
      </div>
    </div>
  );
};

export default ShopScreen;