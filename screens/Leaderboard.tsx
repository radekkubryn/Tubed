import React from 'react';
import { UserProgress } from '../types';

interface Props {
  progress: UserProgress;
  onBack: () => void;
}

const Leaderboard: React.FC<Props> = ({ progress, onBack }) => {
  // Simulate some fake data mixed with user data
  const userTotalStars = Object.values(progress.stars).reduce((a: number, b: number) => a + b, 0);
  
  // Fake players
  const fakePlayers = [
    { name: 'Anna K.', stars: 118, rank: 1 },
    { name: 'Piotr W.', stars: 115, rank: 2 },
    { name: 'MistrzKulek', stars: 112, rank: 3 },
    { name: 'Zosia99', stars: 105, rank: 4 },
    { name: 'Tomek Gry', stars: 98, rank: 5 },
  ];

  // If user has score, maybe insert them? simplified for demo
  const displayList = [...fakePlayers];
  
  return (
    <div className="flex flex-col h-full bg-slate-900">
       <div className="p-4 bg-slate-800 shadow-md flex items-center">
        <button onClick={onBack} className="text-white mr-4">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </button>
        <h1 className="text-xl font-bold text-white">Ranking Światowy</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="bg-slate-800 rounded-xl p-6 mb-6 text-center border border-indigo-500/30">
            <p className="text-slate-400 text-sm uppercase">Twoje Osiągnięcia</p>
            <div className="text-4xl font-bold text-yellow-400 mt-2 flex justify-center items-center gap-2">
                {userTotalStars} <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
            </div>
            <p className="text-slate-500 text-xs mt-1">Suma Gwiazdek</p>
        </div>

        <div className="space-y-3">
            {displayList.map((player) => (
                <div key={player.rank} className="flex items-center bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                    <div className={`
                        w-8 h-8 rounded-full flex items-center justify-center font-bold mr-4
                        ${player.rank === 1 ? 'bg-yellow-500 text-black' : 
                          player.rank === 2 ? 'bg-slate-300 text-black' : 
                          player.rank === 3 ? 'bg-amber-700 text-white' : 'bg-slate-700 text-slate-300'}
                    `}>
                        {player.rank}
                    </div>
                    <div className="flex-1 font-semibold text-slate-200">
                        {player.name}
                    </div>
                    <div className="text-yellow-500 font-bold flex items-center gap-1">
                        {player.stars} <span className="text-xs">★</span>
                    </div>
                </div>
            ))}
            {/* Ellipsis to show list goes on */}
            <div className="text-center text-slate-600 py-2">...</div>
            
            {/* User Rank Entry */}
            <div className="flex items-center bg-indigo-900/40 p-4 rounded-lg border border-indigo-500">
                 <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold mr-4 bg-indigo-500 text-white">
                    ?
                 </div>
                 <div className="flex-1 font-semibold text-white">
                    Ty (Aktualny Gracz)
                 </div>
                 <div className="text-yellow-500 font-bold flex items-center gap-1">
                    {userTotalStars} <span className="text-xs">★</span>
                 </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;