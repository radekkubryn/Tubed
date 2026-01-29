import React from 'react';
import { Tube as TubeType } from '../types';
import Ball from './Ball';

interface Props {
  tube: TubeType;
  isSelected: boolean;
  isTargetCandidate: boolean;
  onClick: () => void;
  domId: string;
  ghostBallId?: string | null;
  isVictory?: boolean;
  index: number;
}

const Tube: React.FC<Props> = ({ tube, isSelected, isTargetCandidate, onClick, domId, ghostBallId, isVictory, index }) => {
  const isPocket = tube.capacity === 1;
  const capacity = tube.capacity || 4;
  
  // Base height per ball unit approx 12-14 tailwind units?
  // 4 balls = h-48 sm:h-56. 
  // 1 ball = ~h-12 sm:h-14
  
  let heightClass = 'h-48 sm:h-56';
  if (capacity === 1) heightClass = 'h-16 sm:h-20';
  if (capacity === 2) heightClass = 'h-28 sm:h-32';
  if (capacity === 5) heightClass = 'h-60 sm:h-72';
  if (capacity === 6) heightClass = 'h-72 sm:h-80';

  return (
    <div 
      id={domId}
      data-tube-index={index}
      onClick={onClick}
      className={`
        relative flex flex-col-reverse items-center justify-start
        w-14 sm:w-16 
        ${heightClass}
        ${isPocket ? 'border-yellow-600 bg-yellow-900/20' : 'border-slate-400 bg-slate-800/30'}
        border-x-4 border-b-4 rounded-b-3xl
        cursor-pointer transition-all duration-200
        ${isSelected ? 'border-yellow-400 bg-yellow-400/10 shadow-[0_0_15px_rgba(250,204,21,0.3)]' : ''}
        ${isTargetCandidate && !isSelected ? 'border-green-400 bg-green-400/10' : (isPocket ? 'hover:border-yellow-500' : 'hover:border-slate-300')}
        p-1 gap-1 select-none
      `}
    >
      {/* Pocket Label */}
      {isPocket && (
        <div className="absolute -bottom-6 w-full text-center text-[10px] text-yellow-500 font-bold uppercase tracking-wider">
            Kieszeń
        </div>
      )}
      
      {/* Capacity Indicator if not standard */}
      {capacity !== 4 && !isPocket && (
         <div className="absolute -right-2 top-0 text-[10px] text-slate-500 font-mono">
            {capacity}
         </div>
      )}

      {tube.balls.map((ball, index) => {
        const isTopBall = index === tube.balls.length - 1;
        const ballDomId = `${domId}-ball-${index}`;
        
        return (
          <Ball 
            key={ball.id}
            domId={ballDomId}
            ball={ball} 
            selected={isSelected && isTopBall}
            isGhost={ball.id === ghostBallId}
            isVictory={isVictory}
            indexInTube={index}
            triggerShake={false} 
          />
        );
      })}
    </div>
  );
};

export default Tube;