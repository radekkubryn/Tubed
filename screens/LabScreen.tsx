import React, { useState, useEffect } from 'react';
import { UserProgress, LAB_ITEMS_DATA, PETS_DATA, PowerUpType } from '../types';
import { buyLabItem, buyPet, equipPet, getProgress, upgradePet, saveSpinTime, saveProgress } from '../services/storage';
import { audio } from '../services/audio';

interface Props {
  onBack: () => void;
}

const LabScreen: React.FC<Props> = ({ onBack }) => {
  const [progress, setProgress] = useState<UserProgress>(getProgress());
  const [activeTab, setActiveTab] = useState<'decor' | 'pets' | 'spin'>('decor');

  // Spin Wheel State
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState<string | null>(null);
  
  // Calculate spin availability
  const msPerDay = 24 * 60 * 60 * 1000;
  const timeSinceLastSpin = Date.now() - progress.lastDailySpin;
  const canSpin = timeSinceLastSpin > msPerDay;

  const totalStars = (Object.values(progress.stars) as number[]).reduce((a, b) => a + b, 0);
  const availableStars = totalStars - progress.spentStars;

  const handleBuy = (itemId: string, cost: number) => {
      if (buyLabItem(itemId, cost)) {
          audio.playMagic();
          setProgress(getProgress());
      } else {
          audio.playInvalid();
      }
  };

  const handleBuyPet = (petId: string, cost: number) => {
      if (buyPet(petId, cost)) {
          audio.playMagic();
          setProgress(getProgress());
      } else {
          audio.playInvalid();
      }
  };

  const handleEquipPet = (petId: string) => {
      if (equipPet(petId)) {
          audio.playSelect();
          setProgress(getProgress());
      }
  };

  const handleUpgradePet = (petId: string) => {
      // Cost calculation: Lv1->2 = 30 stars, Lv2->3 = 60 stars
      const currentLevel = progress.petLevels[petId] || 1;
      const cost = currentLevel * 30; 
      
      if (upgradePet(petId, cost)) {
          audio.playMagic();
          setProgress(getProgress());
      } else {
          audio.playInvalid();
      }
  };

  const handleSpin = () => {
      if (!canSpin || isSpinning) return;
      
      setIsSpinning(true);
      setSpinResult(null);
      audio.playSelect(); // Spin start sound

      // Simulate spin
      setTimeout(() => {
          // Rewards: 100 coins, 200 coins, 1 Undo, 1 Hammer, 5 Stars (rare)
          const rand = Math.random();
          let rewardType = '';
          let rewardAmount = 0;
          let label = '';

          if (rand < 0.4) { rewardType = 'coins'; rewardAmount = 100; label = '100 Monet'; }
          else if (rand < 0.7) { rewardType = 'coins'; rewardAmount = 200; label = '200 Monet'; }
          else if (rand < 0.85) { rewardType = 'item'; rewardAmount = 1; label = 'Młot'; } // Actually item ID
          else if (rand < 0.95) { rewardType = 'item_undo'; rewardAmount = 1; label = 'Cofnij'; }
          else { rewardType = 'stars'; rewardAmount = 5; label = '5 Gwiazdek'; }

          // Apply Reward
          const current = getProgress();
          if (rewardType === 'coins') current.coins += rewardAmount;
          if (rewardType === 'stars') current.spentStars -= rewardAmount; // Effectively adds available stars
          if (rewardType === 'item') current.inventory['hammer'] = (current.inventory['hammer'] || 0) + 1;
          if (rewardType === 'item_undo') current.inventory['undo'] = (current.inventory['undo'] || 0) + 1;
          
          saveSpinTime(); // Update time inside storage fn
          saveProgress(current); // Save reward
          
          setProgress(getProgress());
          setIsSpinning(false);
          setSpinResult(label);
          audio.playVictory();
      }, 3000);
  };

  // Calculate current bonus
  let coinBonus = 0;
  progress.labItems.forEach(id => {
      const item = LAB_ITEMS_DATA.find(i => i.id === id);
      if (item && item.bonus) coinBonus += item.bonus.value;
  });

  // Check what features Pan Kulka should have for the visualizer
  const hasGoggles = progress.labItems.includes('microscope');
  const hasTie = progress.labItems.includes('desk');
  const hasFlask = progress.labItems.includes('shelf');
  const hasAntenna = progress.labItems.includes('robot');
  const hasGlow = progress.labItems.includes('lamp');

  return (
    <div className="flex flex-col h-full bg-slate-900 text-white relative">
      <div className="p-4 bg-slate-800 shadow-md flex items-center shrink-0 justify-between z-10">
        <button onClick={onBack} className="text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </button>
        <h1 className="text-xl font-bold text-purple-400">LABORATORIUM</h1>
        <div className="flex items-center gap-1 font-bold text-yellow-400">
            <span>{availableStars}</span> ★
        </div>
      </div>

      {/* Visual Representation of Lab */}
      <div className="h-48 sm:h-64 relative overflow-hidden border-b-4 border-slate-700 bg-slate-800 shrink-0">
          {/* Detailed Background */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-slate-800"></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/blueprint.png')] opacity-10"></div>
          
          {/* Mainframe (Back Layer) */}
          {progress.labItems.includes('mainframe') && (
               <div className="absolute top-10 right-20 w-16 h-32 bg-slate-900 border border-slate-600 rounded flex flex-col items-center justify-around py-2 opacity-60">
                   <div className="w-12 h-1 bg-red-500 shadow-[0_0_5px_red] animate-pulse"></div>
                   <div className="w-12 h-1 bg-green-500 shadow-[0_0_5px_green] animate-pulse" style={{animationDelay: '0.2s'}}></div>
                   <div className="w-12 h-1 bg-blue-500 shadow-[0_0_5px_blue] animate-pulse" style={{animationDelay: '0.5s'}}></div>
                   <div className="w-12 h-1 bg-yellow-500 shadow-[0_0_5px_yellow] animate-pulse" style={{animationDelay: '0.7s'}}></div>
               </div>
          )}

          {/* Wall accents */}
          <div className="absolute top-10 left-0 w-full h-1 bg-slate-700/50"></div>
          <div className="absolute top-24 left-0 w-full h-1 bg-slate-700/30"></div>

          {/* Whiteboard */}
          {progress.labItems.includes('whiteboard') && (
              <div className="absolute top-12 left-10 w-24 h-16 bg-white/10 border-2 border-slate-500 rounded skew-x-3 backdrop-blur-sm">
                  <div className="text-[6px] text-white/50 font-mono p-1">
                      E=mc²<br/>
                      x = y + 2<br/>
                      KULKA!
                  </div>
              </div>
          )}

          {/* Pan Kulka (Mascot) */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 w-32 h-32 animate-float">
             <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-xl">
                  {/* ... (SVG content kept same as before, omitted for brevity but assuming full SVG code is here) ... */}
                  <defs>
                    <linearGradient id="bodyGradLab" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#818cf8" />
                      <stop offset="50%" stopColor="#c084fc" />
                      <stop offset="100%" stopColor="#f472b6" />
                    </linearGradient>
                    <filter id="glowLab">
                      <feGaussianBlur stdDeviation={hasGlow ? "5" : "2.5"} result="coloredBlur"/>
                      <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>
                  <circle cx="100" cy="100" r="90" fill="url(#bodyGradLab)" stroke="white" strokeWidth="3" filter="url(#glowLab)" />
                  {hasAntenna && (<g className="animate-pulse"><line x1="100" y1="10" x2="100" y2="40" stroke="silver" strokeWidth="4" /><circle cx="100" cy="10" r="6" fill="red" /></g>)}
                  <g><circle cx="65" cy="90" r="14" fill="white" /><circle cx="65" cy="90" r="6" fill="#0f172a" /><circle cx="135" cy="90" r="14" fill="white" /><circle cx="135" cy="90" r="6" fill="#0f172a" /></g>
                  {hasGoggles ? (<g opacity="0.9"><path d="M40 90 Q 65 60 90 90" stroke="cyan" strokeWidth="2" fill="cyan" fillOpacity="0.3" /><path d="M110 90 Q 135 60 160 90" stroke="cyan" strokeWidth="2" fill="cyan" fillOpacity="0.3" /><circle cx="65" cy="90" r="22" stroke="#334155" strokeWidth="6" fill="none" /><circle cx="135" cy="90" r="22" stroke="#334155" strokeWidth="6" fill="none" /><path d="M87 90 L113 90" stroke="#334155" strokeWidth="6" /><path d="M43 90 L20 80" stroke="#334155" strokeWidth="4" /><path d="M157 90 L180 80" stroke="#334155" strokeWidth="4" /></g>) : (<g opacity="0.5"><circle cx="65" cy="90" r="20" stroke="white" strokeWidth="3" fill="none" /><circle cx="135" cy="90" r="20" stroke="white" strokeWidth="3" fill="none" /><path d="M85 90 L115 90" stroke="white" strokeWidth="3" /></g>)}
                  <circle cx="55" cy="120" r="8" fill="#f9a8d4" fillOpacity="0.6" /><circle cx="145" cy="120" r="8" fill="#f9a8d4" fillOpacity="0.6" /><path d="M 90 130 Q 100 140 110 130" stroke="#0f172a" strokeWidth="3" fill="none" strokeLinecap="round" />
                  {hasTie && (<g transform="translate(100, 155)"><path d="M0 0 L-15 -10 L-15 10 Z" fill="#ef4444" /><path d="M0 0 L15 -10 L15 10 Z" fill="#ef4444" /><circle cx="0" cy="0" r="4" fill="#b91c1c" /></g>)}
                  {hasFlask && (<g transform="translate(160, 130) rotate(15)"><path d="M0 0 L10 30 L-10 30 Z" fill="#10b981" opacity="0.8" /><rect x="-3" y="-10" width="6" height="15" fill="#a7f3d0" /><circle cx="0" cy="-15" r="2" fill="white" className="animate-ping" /><circle cx="5" cy="-25" r="3" fill="white" className="animate-ping" style={{animationDelay: '0.5s'}}/></g>)}
             </svg>
          </div>

          {/* Active Pet Visual */}
          {progress.activePetId && (
              <div className="absolute bottom-4 right-1/4 z-30 w-16 h-16 animate-bounce">
                  <div className="text-5xl filter drop-shadow-md">
                      {PETS_DATA.find(p => p.id === progress.activePetId)?.icon}
                  </div>
              </div>
          )}

          {/* Furniture / Items Layer */}
          <div className="absolute inset-0 z-10 pointer-events-none">
              {progress.labItems.includes('rug') && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-9xl opacity-60 -z-10 translate-y-4">🧶</div>}
              {progress.labItems.includes('desk') && <div className="absolute bottom-0 left-4 text-7xl drop-shadow-lg grayscale-[20%]">🖥️</div>}
              
              {/* Coffee on Desk (only if desk present visually, but independent logic) */}
              {progress.labItems.includes('coffee') && <div className="absolute bottom-12 left-12 text-3xl drop-shadow-md z-40 animate-pulse">☕</div>}
              
              {progress.labItems.includes('microscope') && <div className="absolute bottom-16 left-20 text-5xl drop-shadow-lg z-30">🔬</div>}
              {progress.labItems.includes('poster') && <div className="absolute top-8 left-16 text-5xl opacity-80 rotate-[-5deg] drop-shadow-md">📜</div>}
              {progress.labItems.includes('lamp') && <div className="absolute top-0 left-8 text-6xl drop-shadow-[0_10px_10px_rgba(253,224,71,0.3)]">💡</div>}
              {progress.labItems.includes('shelf') && <div className="absolute bottom-20 right-8 text-7xl drop-shadow-lg">🧪</div>}
              {progress.labItems.includes('plant') && <div className="absolute bottom-0 right-4 text-7xl drop-shadow-lg">🪴</div>}
              {progress.labItems.includes('robot') && <div className="absolute bottom-0 right-32 text-6xl animate-bounce drop-shadow-lg">🤖</div>}
              {progress.labItems.includes('telescope') && <div className="absolute bottom-0 left-32 text-6xl -rotate-12 drop-shadow-lg">🔭</div>}
              
              {/* Hologram Overlay */}
              {progress.labItems.includes('hologram') && (
                  <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-8xl opacity-50 z-50 animate-[spin_10s_linear_infinite]">
                      🌀
                  </div>
              )}
          </div>
      </div>

      <div className="flex gap-2 p-4 bg-slate-900">
          <button 
            onClick={() => setActiveTab('decor')} 
            className={`flex-1 py-2 rounded-lg font-bold text-sm ${activeTab === 'decor' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'}`}
          >
              Meble
          </button>
          <button 
            onClick={() => setActiveTab('pets')} 
            className={`flex-1 py-2 rounded-lg font-bold text-sm ${activeTab === 'pets' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'}`}
          >
              Asystenci
          </button>
          <button 
            onClick={() => setActiveTab('spin')} 
            className={`flex-1 py-2 rounded-lg font-bold text-sm ${activeTab === 'spin' ? 'bg-yellow-600 text-white' : 'bg-slate-800 text-slate-400'}`}
          >
              Losowanie
          </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 pt-0">
        
        {activeTab === 'decor' && (
            <>
                <div className="bg-slate-800 p-3 rounded-lg mb-4 flex justify-between items-center border border-yellow-500/30">
                    <span className="text-yellow-300 font-bold">Aktualny Bonus Monet:</span>
                    <span className="text-2xl font-bold text-white">+{Math.round(coinBonus * 100)}%</span>
                </div>

                <div className="grid grid-cols-1 gap-3 pb-8">
                    {LAB_ITEMS_DATA.map((item) => {
                        const isUnlocked = progress.labItems.includes(item.id);
                        const canAfford = availableStars >= item.cost;

                        return (
                            <div key={item.id} className={`flex items-center p-3 rounded-lg border ${isUnlocked ? 'bg-indigo-900/30 border-indigo-500' : 'bg-slate-800 border-slate-700'}`}>
                                <div className="text-3xl mr-4 w-12 text-center">{item.icon}</div>
                                <div className="flex-1">
                                    <div className="font-bold text-slate-200">{item.name}</div>
                                    <div className="text-xs text-green-400 font-bold">
                                        +{Math.round((item.bonus?.value || 0) * 100)}% monet
                                    </div>
                                </div>
                                
                                {isUnlocked ? (
                                    <div className="px-3 py-1 bg-green-900 text-green-300 rounded text-xs font-bold border border-green-700">
                                        POSIADASZ
                                    </div>
                                ) : (
                                    <button 
                                        onClick={() => handleBuy(item.id, item.cost)}
                                        disabled={!canAfford}
                                        className={`px-4 py-2 rounded font-bold text-sm transition-colors ${canAfford ? 'bg-yellow-600 text-white hover:bg-yellow-500' : 'bg-slate-700 text-slate-500 cursor-not-allowed'}`}
                                    >
                                        {item.cost} ★
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            </>
        )}

        {activeTab === 'pets' && (
            <div className="space-y-3 pb-8">
                <div className="text-xs text-slate-400 mb-2 text-center">Asystenci pomagają w grze raz na poziom.</div>
                {PETS_DATA.map(pet => {
                    const isUnlocked = progress.unlockedPets.includes(pet.id);
                    const isActive = progress.activePetId === pet.id;
                    const canAfford = availableStars >= pet.cost;
                    const level = progress.petLevels[pet.id] || 1;
                    const upgradeCost = level * 30;
                    const canUpgrade = availableStars >= upgradeCost;

                    return (
                        <div key={pet.id} className={`flex flex-col p-3 rounded-lg border ${isActive ? 'bg-yellow-900/30 border-yellow-500 ring-1 ring-yellow-500' : isUnlocked ? 'bg-slate-800 border-slate-600' : 'bg-slate-800/50 border-slate-700'}`}>
                             <div className="flex items-center">
                                 <div className="text-4xl mr-4 w-12 text-center">{pet.icon}</div>
                                 <div className="flex-1">
                                    <div className="font-bold text-slate-200 flex justify-between">
                                        <span>{pet.name}</span>
                                        {isUnlocked && <span className="text-yellow-400">Lv {level}</span>}
                                    </div>
                                    <div className="text-xs text-slate-400">{pet.description}</div>
                                 </div>

                                 {isUnlocked ? (
                                     <button 
                                        onClick={() => handleEquipPet(pet.id)}
                                        className={`px-3 py-1 rounded text-xs font-bold border transition-colors ${isActive ? 'bg-yellow-500 text-black border-yellow-600' : 'bg-slate-700 text-white hover:bg-slate-600 border-slate-500'}`}
                                     >
                                         {isActive ? 'AKTYWNY' : 'WYBIERZ'}
                                     </button>
                                 ) : (
                                     <button 
                                        onClick={() => handleBuyPet(pet.id, pet.cost)}
                                        disabled={!canAfford}
                                        className={`px-4 py-2 rounded font-bold text-sm transition-colors ${canAfford ? 'bg-yellow-600 text-white hover:bg-yellow-500' : 'bg-slate-700 text-slate-500 cursor-not-allowed'}`}
                                     >
                                         {pet.cost} ★
                                     </button>
                                 )}
                             </div>
                             
                             {/* Upgrade UI */}
                             {isUnlocked && level < 3 && (
                                 <div className="mt-2 pt-2 border-t border-slate-700 flex justify-between items-center">
                                     <div className="text-xs text-slate-400">Następny poziom: +Efektywność</div>
                                     <button 
                                        onClick={() => handleUpgradePet(pet.id)}
                                        disabled={!canUpgrade}
                                        className={`text-[10px] px-2 py-1 rounded font-bold uppercase ${canUpgrade ? 'bg-indigo-600 hover:bg-indigo-500 text-white' : 'bg-slate-700 text-slate-500'}`}
                                     >
                                         Ulepsz ({upgradeCost} ★)
                                     </button>
                                 </div>
                             )}
                        </div>
                    );
                })}
            </div>
        )}

        {activeTab === 'spin' && (
            <div className="flex flex-col items-center justify-center h-full pb-10">
                <div className="mb-4 text-center">
                    <h2 className="text-lg font-bold text-yellow-400">Maszyna Losująca</h2>
                    <p className="text-xs text-slate-400">Jedno darmowe kręcenie dziennie!</p>
                </div>

                <div className="relative w-48 h-48 mb-8">
                    {/* Wheel Visual */}
                    <div className={`w-full h-full rounded-full border-4 border-slate-600 bg-slate-800 relative overflow-hidden shadow-2xl ${isSpinning ? 'animate-spin' : ''}`} style={{ transition: 'transform 3s cubic-bezier(0.1, 0.7, 1.0, 0.1)' }}>
                        <div className="absolute inset-0 bg-[conic-gradient(from_0deg,#eab308_0deg_72deg,#3b82f6_72deg_144deg,#ef4444_144deg_216deg,#a855f7_216deg_288deg,#22c55e_288deg_360deg)] opacity-20"></div>
                        <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-50">?</div>
                        
                        {/* Dividers */}
                        <div className="absolute w-full h-1 bg-slate-900/50 top-1/2 left-0"></div>
                        <div className="absolute h-full w-1 bg-slate-900/50 top-0 left-1/2"></div>
                        <div className="absolute w-full h-1 bg-slate-900/50 top-1/2 left-0 rotate-45"></div>
                        <div className="absolute h-full w-1 bg-slate-900/50 top-0 left-1/2 rotate-45"></div>
                    </div>
                    {/* Pointer */}
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 text-white drop-shadow-md text-3xl">⬇️</div>
                </div>

                {spinResult ? (
                    <div className="text-center animate-bounce">
                        <div className="text-sm text-slate-400">Wygrałeś:</div>
                        <div className="text-2xl font-bold text-green-400">{spinResult}</div>
                        <div className="text-xs text-slate-500 mt-2">Wróć jutro!</div>
                    </div>
                ) : (
                    <button
                        onClick={handleSpin}
                        disabled={!canSpin || isSpinning}
                        className={`px-8 py-3 rounded-xl font-bold text-lg shadow-lg ${canSpin ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white animate-pulse' : 'bg-slate-700 text-slate-500 cursor-not-allowed'}`}
                    >
                        {isSpinning ? 'LOSOWANIE...' : canSpin ? 'ZAKRĘĆ!' : 'JUŻ LOSOWAŁEŚ'}
                    </button>
                )}
                
                {!canSpin && !spinResult && (
                    <div className="text-xs text-slate-500 mt-4">
                        Odczekaj 24h na kolejne losowanie.
                    </div>
                )}
            </div>
        )}
      </div>
    </div>
  );
};

export default LabScreen;