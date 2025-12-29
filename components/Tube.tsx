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
}

const Tube: React.FC<Props> = ({ tube, isSelected, isTargetCandidate, onClick, domId, ghostBallId, isVictory }) => {
  return (
    <div 
      id={domId}
      onClick={onClick}
      className={`
        relative flex flex-col-reverse items-center justify-start
        w-14 h-48 sm:w-16 sm:h-56 
        border-x-4 border-b-4 border-slate-400 rounded-b-3xl bg-slate-800/30
        cursor-pointer transition-colors duration-200
        ${isSelected ? 'border-yellow-400 bg-yellow-400/10' : ''}
        ${isTargetCandidate && !isSelected ? 'border-green-400 bg-green-400/10' : 'hover:border-slate-300'}
        p-1 gap-1
      `}
    >
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
          />
        );
      })}
    </div>
  );
};

export default Tube;