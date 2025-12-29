import React from 'react';
import { Ball as BallType } from '../types';

interface Props {
  ball: BallType;
  selected?: boolean;
  domId?: string;
  isGhost?: boolean;
  isVictory?: boolean;
  indexInTube?: number; // Used to stagger animation
}

const Ball: React.FC<Props> = ({ ball, selected, domId, isGhost, isVictory, indexInTube = 0 }) => {
  return (
    <div
      id={domId}
      className={`
        w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-black/10
        flex items-center justify-center transition-all duration-300
        ${selected ? '-translate-y-4 sm:-translate-y-6 shadow-xl z-10' : ''}
        ${isGhost ? 'opacity-0' : 'opacity-100'}
        ${isVictory ? 'animate-victory' : ''}
        ball-shadow
      `}
      style={{
        backgroundColor: ball.isHidden ? '#9ca3af' : ball.color,
        transition: isGhost ? 'none' : 'transform 0.2s ease-out, background-color 0.5s',
        animationDelay: isVictory ? `${indexInTube * 0.1}s` : '0s'
      }}
    >
      {ball.isHidden && (
        <span className="text-slate-600 font-bold text-lg select-none">?</span>
      )}
    </div>
  );
};

export default Ball;