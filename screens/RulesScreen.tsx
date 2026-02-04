
import React from 'react';
import { getProgress } from '../services/storage';
import { t } from '../services/i18n';
import { Language } from '../types';

interface Props {
  onBack: () => void;
}

const RulesScreen: React.FC<Props> = ({ onBack }) => {
  const progress = getProgress();
  const lang = progress.language;

  const content: Record<Language, any> = {
      en: {
          objective: 'Objective',
          objectiveDesc: 'Sort all colored balls into the tubes so that each tube contains only one color.',
          adventure: 'Adventure Mode (100 Levels)',
          adventureDesc: '100 levels of increasing difficulty await you. The further you go, the more colors and fewer empty tubes you will encounter.',
          bossWarning: 'Watch out for the Boss!',
          bossWarningDesc: 'Every 10 levels (10, 20, 30...) you will meet a Villain. They will try to hinder you by mixing tubes, freezing balls, or dropping concrete.',
          specialBalls: 'Special Balls',
          ice: 'Ice Ball',
          iceDesc: 'Frozen. Click it 3 times to break the ice.',
          stone: 'Stone',
          stoneDesc: 'Blocks the bottom. Destroy it by placing 3 identical balls above it (or use a Pickaxe).',
          hidden: 'Hidden Ball',
          hiddenDesc: 'Its color is unknown. You will discover it only after moving all balls above it.',
          lock: 'Lock',
          lockDesc: 'Blocks the ball. To remove it, place a Key of the same color on it.',
          key: 'Key',
          keyDesc: 'Used to open locks. It disappears with the lock after use.',
          virus: 'Virus',
          virusDesc: 'Dangerous! If you place it on another ball, it will infect it, changing its color to its own.',
          joker: 'Joker',
          jokerDesc: 'Matches any color.',
          powerups: 'Power-ups (Available in Shop)',
          pu_undo: 'Undo Move',
          pu_undo_d: 'Goes back to the state before the last move.',
          pu_wand: 'Magic Wand',
          pu_wand_d: 'Turns the selected ball into a Joker.',
          pu_pickaxe: 'Pickaxe',
          pu_pickaxe_d: 'Destroys a stone or lock at the bottom of a tube.',
          pu_flame: 'Flame Thrower',
          pu_flame_d: 'Immediately thaws all ice balls on the board.',
          pu_xray: 'X-Ray',
          pu_xray_d: 'Reveals all hidden balls on the board.',
          pu_hammer: 'Hammer',
          pu_hammer_d: 'Breaks (removes) one top ball from a selected tube.',
          pu_paint: 'Paint Brush',
          pu_paint_d: 'Paints the top ball the color of the one below it.',
          pu_magnet: 'Magnet',
          pu_magnet_d: 'Pulls all matching balls from other tubes to the selected one.',
          pu_swap: 'Swap',
          pu_swap_d: 'Swaps two top balls from any two tubes.',
          pu_pocket: 'Pocket',
          pu_pocket_d: 'Adds a temporary extra tube with capacity for 1 ball.'
      },
      pl: {
          objective: 'Cel Gry',
          objectiveDesc: 'Posegreguj wszystkie kulki w probówkach tak, aby każda probówka zawierała kulki tylko jednego koloru.',
          adventure: 'Tryb Przygody (100 Poziomów)',
          adventureDesc: 'Czeka na Ciebie 100 poziomów o rosnącym poziomie trudności. Im dalej, tym więcej kolorów i mniej pustych probówek.',
          bossWarning: 'Uwaga na Bossa!',
          bossWarningDesc: 'Co 10 poziomów (10, 20, 30...) spotkasz Złoczyńcę. Będzie on próbował Ci przeszkodzić, mieszając probówki, zamrażając kulki lub wrzucając beton.',
          specialBalls: 'Kule Specjalne',
          ice: 'Lodowa Kulka',
          iceDesc: 'Zamarznięta. Kliknij w nią 3 razy, aby skruszyć lód.',
          stone: 'Kamień',
          stoneDesc: 'Blokuje dno. Zniszcz go układając nad nim 3 identyczne kulki (lub użyj Kilofa).',
          hidden: 'Ukryta Kulka',
          hiddenDesc: 'Jej kolor jest nieznany. Odkryjesz go dopiero, gdy zabierzesz wszystkie kulki leżące nad nią.',
          lock: 'Kłódka',
          lockDesc: 'Blokuje kulkę. Aby ją usunąć, musisz położyć na niej Klucz tego samego koloru.',
          key: 'Klucz',
          keyDesc: 'Służy do otwierania kłódek. Po użyciu znika razem z kłódką.',
          virus: 'Wirus',
          virusDesc: 'Niebezpieczny! Jeśli położysz go na innej kulce, zainfekuje ją, zmieniając jej kolor na swój.',
          joker: 'Joker',
          jokerDesc: 'Pasuje do każdego koloru.',
          powerups: 'Powerupy (Dostępne w Sklepie)',
          pu_undo: 'Cofnij Ruch',
          pu_undo_d: 'Wraca do stanu przed ostatnim ruchem.',
          pu_wand: 'Magiczna Różdżka',
          pu_wand_d: 'Zamienia wybraną kulkę w Jokera.',
          pu_pickaxe: 'Kilof',
          pu_pickaxe_d: 'Niszczy kamień lub kłódkę na dnie probówki.',
          pu_flame: 'Miotacz Ognia',
          pu_flame_d: 'Natychmiast rozmraża wszystkie lodowe kulki na planszy.',
          pu_xray: 'Rentgen',
          pu_xray_d: 'Odkrywa wszystkie ukryte kulki na planszy.',
          pu_hammer: 'Młot',
          pu_hammer_d: 'Rozbija (usuwa) jedną wierzchnią kulkę z wybranej probówki.',
          pu_paint: 'Pędzel',
          pu_paint_d: 'Maluje wierzchnią kulkę na kolor tej, która znajduje się pod nią.',
          pu_magnet: 'Magnes',
          pu_magnet_d: 'Ściąga wszystkie pasujące kulki z innych probówek do wybranej.',
          pu_swap: 'Zamiana',
          pu_swap_d: 'Zamienia miejscami dwie wierzchnie kulki z dowolnych probówek.',
          pu_pocket: 'Kieszeń',
          pu_pocket_d: 'Dodaje dodatkową probówkę o pojemności 1 kulki.'
      }
  };

  const c = content[lang];

  return (
    <div className="flex flex-col h-full bg-slate-900 text-white">
      <div className="p-4 bg-slate-800 shadow-md flex items-center z-10 shrink-0">
        <button onClick={onBack} className="text-slate-400 hover:text-white mr-4">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </button>
        <h1 className="text-xl font-bold text-yellow-500 tracking-wider uppercase">{t('rulesTitle', lang)}</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        
        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
            <h2 className="text-lg font-bold text-indigo-400 mb-2 uppercase">{c.objective}</h2>
            <p className="text-slate-300 text-sm leading-relaxed">
                {c.objectiveDesc}
            </p>
        </div>

        <div className="bg-red-900/20 p-4 rounded-xl border border-red-800">
            <h2 className="text-lg font-bold text-red-400 mb-2 uppercase flex items-center gap-2">
                <span>🏰</span> {c.adventure}
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed mb-3">
                {c.adventureDesc}
            </p>
            <div className="bg-slate-900/50 p-3 rounded-lg">
                <strong className="text-red-300 text-xs uppercase block mb-1">{c.bossWarning}</strong>
                <p className="text-xs text-slate-400">
                    {c.bossWarningDesc}
                </p>
            </div>
        </div>

        <div className="space-y-4">
             <h2 className="text-lg font-bold text-slate-300 border-b border-slate-700 pb-2">{c.specialBalls}</h2>
             
            <div className="flex gap-4">
                <div className="w-12 h-12 shrink-0 rounded-full border-4 border-white bg-cyan-100 flex items-center justify-center relative shadow-lg">
                    <div className="absolute top-1 left-2 w-3 h-1 bg-white/90 rounded-full rotate-[-45deg] blur-[1px]"></div>
                </div>
                <div>
                    <h3 className="text-cyan-300 font-bold text-md">{c.ice}</h3>
                    <p className="text-slate-400 text-xs mt-1">{c.iceDesc}</p>
                </div>
            </div>

            <div className="flex gap-4">
                <div className="w-12 h-12 shrink-0 rounded-full bg-stone-700 flex items-center justify-center border-2 border-stone-600 shadow-inner overflow-hidden">
                    <div className="w-6 h-6 border-2 border-stone-500 rounded bg-stone-600 rotate-12"></div>
                </div>
                <div>
                    <h3 className="text-slate-300 font-bold text-md">{c.stone}</h3>
                    <p className="text-slate-400 text-xs mt-1">{c.stoneDesc}</p>
                </div>
            </div>

            <div className="flex gap-4">
                <div className="w-12 h-12 shrink-0 rounded-full bg-slate-600 flex items-center justify-center shadow-inner relative border border-slate-500">
                    <span className="text-slate-400 font-bold text-xl drop-shadow-md">?</span>
                </div>
                <div>
                    <h3 className="text-slate-300 font-bold text-md">{c.hidden}</h3>
                    <p className="text-slate-400 text-xs mt-1">{c.hiddenDesc}</p>
                </div>
            </div>

            <div className="flex gap-4">
                <div className="w-12 h-12 shrink-0 rounded-full bg-black/80 flex items-center justify-center border-2 border-slate-500 shadow-lg relative">
                     <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 17c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm6-9h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2 v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2z"/></svg>
                </div>
                <div>
                    <h3 className="text-slate-100 font-bold text-md">{c.lock}</h3>
                    <p className="text-slate-400 text-xs mt-1">{c.lockDesc}</p>
                </div>
            </div>

            <div className="flex gap-4">
                <div className="w-12 h-12 shrink-0 rounded-full bg-yellow-900/50 flex items-center justify-center border-2 border-yellow-600 shadow-lg relative">
                     <svg className="w-6 h-6 text-yellow-400 animate-pulse" fill="currentColor" viewBox="0 0 24 24"><path d="M12.65 10C11.83 7.67 9.61 6 7 6c-3.31 0-6 2.69-6 6s2.69 6 6 6c2.61 0 4.83-1.67 5.65-4H17v4h4v-4h2v-4H12.65z"/></svg>
                </div>
                <div>
                    <h3 className="text-yellow-400 font-bold text-md">{c.key}</h3>
                    <p className="text-slate-400 text-xs mt-1">{c.keyDesc}</p>
                </div>
            </div>

             <div className="flex gap-4">
                <div className="w-12 h-12 shrink-0 rounded-full bg-green-900 flex items-center justify-center border-2 border-lime-500 shadow-lg relative overflow-hidden">
                     <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/shattered-island.png')] opacity-50"></div>
                     <svg className="w-8 h-8 text-lime-400 opacity-80 animate-spin-slow" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/></svg>
                </div>
                <div>
                    <h3 className="text-lime-400 font-bold text-md">{c.virus}</h3>
                    <p className="text-slate-400 text-xs mt-1">{c.virusDesc}</p>
                </div>
            </div>

            <div className="flex gap-4">
                <div className="w-12 h-12 shrink-0 rounded-full overflow-hidden shadow-inner relative">
                    <div className="absolute inset-0 bg-[conic-gradient(from_0deg,red,orange,yellow,green,blue,indigo,violet,red)] opacity-80"></div>
                </div>
                <div>
                    <h3 className="text-yellow-400 font-bold text-md">{c.joker}</h3>
                    <p className="text-slate-400 text-xs mt-1">{c.jokerDesc}</p>
                </div>
            </div>
        </div>

        <div className="space-y-4">
             <h2 className="text-lg font-bold text-slate-300 border-b border-slate-700 pb-2">{c.powerups}</h2>
             
             <div className="grid grid-cols-1 gap-4">
                 <div className="flex items-center gap-3 bg-slate-800 p-3 rounded-lg border border-slate-700">
                     <span className="text-3xl">↩️</span>
                     <div>
                         <strong className="text-indigo-400 block">{c.pu_undo}</strong>
                         <p className="text-xs text-slate-400">{c.pu_undo_d}</p>
                     </div>
                 </div>
                 <div className="flex items-center gap-3 bg-slate-800 p-3 rounded-lg border border-slate-700">
                     <span className="text-3xl">🪄</span>
                     <div>
                         <strong className="text-purple-400 block">{c.pu_wand}</strong>
                         <p className="text-xs text-slate-400">{c.pu_wand_d}</p>
                     </div>
                 </div>
                 <div className="flex items-center gap-3 bg-slate-800 p-3 rounded-lg border border-slate-700">
                     <span className="text-3xl">⛏️</span>
                     <div>
                         <strong className="text-stone-400 block">{c.pu_pickaxe}</strong>
                         <p className="text-xs text-slate-400">{c.pu_pickaxe_d}</p>
                     </div>
                 </div>
                 <div className="flex items-center gap-3 bg-slate-800 p-3 rounded-lg border border-slate-700">
                     <span className="text-3xl">🔥</span>
                     <div>
                         <strong className="text-orange-400 block">{c.pu_flame}</strong>
                         <p className="text-xs text-slate-400">{c.pu_flame_d}</p>
                     </div>
                 </div>
                 <div className="flex items-center gap-3 bg-slate-800 p-3 rounded-lg border border-slate-700">
                     <span className="text-3xl">👁️</span>
                     <div>
                         <strong className="text-green-400 block">{c.pu_xray}</strong>
                         <p className="text-xs text-slate-400">{c.pu_xray_d}</p>
                     </div>
                 </div>
                 <div className="flex items-center gap-3 bg-slate-800 p-3 rounded-lg border border-slate-700">
                     <span className="text-3xl">🔨</span>
                     <div>
                         <strong className="text-red-400 block">{c.pu_hammer}</strong>
                         <p className="text-xs text-slate-400">{c.pu_hammer_d}</p>
                     </div>
                 </div>
                 <div className="flex items-center gap-3 bg-slate-800 p-3 rounded-lg border border-slate-700">
                     <span className="text-3xl">🖌️</span>
                     <div>
                         <strong className="text-pink-400 block">{c.pu_paint}</strong>
                         <p className="text-xs text-slate-400">{c.pu_paint_d}</p>
                     </div>
                 </div>
                 <div className="flex items-center gap-3 bg-slate-800 p-3 rounded-lg border border-slate-700">
                     <span className="text-3xl">🧲</span>
                     <div>
                         <strong className="text-blue-400 block">{c.pu_magnet}</strong>
                         <p className="text-xs text-slate-400">{c.pu_magnet_d}</p>
                     </div>
                 </div>
                 <div className="flex items-center gap-3 bg-slate-800 p-3 rounded-lg border border-slate-700">
                     <span className="text-3xl">⇄</span>
                     <div>
                         <strong className="text-teal-400 block">{c.pu_swap}</strong>
                         <p className="text-xs text-slate-400">{c.pu_swap_d}</p>
                     </div>
                 </div>
                 <div className="flex items-center gap-3 bg-slate-800 p-3 rounded-lg border border-slate-700">
                     <span className="text-3xl">📥</span>
                     <div>
                         <strong className="text-yellow-400 block">{c.pu_pocket}</strong>
                         <p className="text-xs text-slate-400">{c.pu_pocket_d}</p>
                     </div>
                 </div>
             </div>
        </div>
        <div className="h-8"></div>
      </div>
    </div>
  );
};

export default RulesScreen;
