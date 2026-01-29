import React from 'react';
import { Ball as BallType } from '../types';

interface Props {
  ball: BallType;
  selected?: boolean;
  domId?: string;
  isGhost?: boolean;
  isVictory?: boolean;
  indexInTube?: number;
  triggerShake?: boolean; 
}

const Ball: React.FC<Props> = ({ ball, selected, domId, isGhost, isVictory, indexInTube = 0, triggerShake }) => {
  
  const renderStone = () => (
    <div className="absolute inset-0 bg-stone-800 rounded-full flex items-center justify-center border-2 border-stone-600 shadow-inner overflow-hidden">
      <div className="absolute w-full h-full opacity-40 bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')] mix-blend-overlay"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-stone-600/30 to-black/60"></div>
      {/* Cracks visually indicating hardness */}
      <svg className="absolute w-full h-full opacity-30 text-black" viewBox="0 0 100 100">
         <path d="M20 20 L35 40 L30 60" stroke="currentColor" strokeWidth="2" fill="none" />
         <path d="M80 80 L60 60 L70 40" stroke="currentColor" strokeWidth="2" fill="none" />
      </svg>
      <div className="w-8 h-8 border-2 border-stone-500 rounded bg-stone-700 rotate-12 flex items-center justify-center relative z-10 shadow-lg">
        <div className="w-1 h-3 bg-stone-900 rotate-45 rounded-full"></div>
      </div>
    </div>
  );

  const renderJoker = () => (
    <div className="absolute inset-0 rounded-full overflow-hidden shadow-inner bg-slate-900">
       {/* Background Spin */}
       <div className="absolute inset-[-50%] bg-[conic-gradient(from_0deg,#ef4444,#eab308,#22c55e,#3b82f6,#a855f7,#ef4444)] animate-[spin_3s_linear_infinite] opacity-100 blur-sm"></div>
       
       {/* Counter-Spin Layer for complexity */}
       <div className="absolute inset-0 rounded-full border-4 border-white/20 animate-[spin_6s_linear_infinite_reverse]"></div>
       
       <div className="absolute inset-1 bg-white/20 backdrop-blur-[1px] rounded-full flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-white/40 to-transparent animate-pulse"></div>
          <svg className="w-6 h-6 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] relative z-10" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z"/></svg>
       </div>
    </div>
  );

  const renderArtifact = () => (
      <div className="absolute inset-0 rounded-full bg-amber-200/20 border-2 border-amber-400/50 flex items-center justify-center shadow-[0_0_15px_rgba(251,191,36,0.5)] overflow-hidden">
          {/* Glass look */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent opacity-50"></div>
          
          {/* Ancient Scroll inside */}
          <div className="w-6 h-8 bg-amber-100 rounded-sm rotate-12 flex items-center justify-center shadow-md border border-amber-300">
              <span className="text-xs">📜</span>
          </div>
          
          {/* Sparkles */}
          <div className="absolute top-2 right-2 w-1 h-1 bg-white rounded-full animate-ping"></div>
          <div className="absolute bottom-2 left-2 w-1 h-1 bg-amber-200 rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
      </div>
  );

  const renderLock = () => (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-full border border-slate-600 bg-slate-800">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-black"></div>
        
        {/* Shine Effect */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent w-[50%] animate-shine"></div>

        <svg className="w-7 h-7 text-slate-200 drop-shadow-lg z-10" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 17c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm6-9h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM8.9 6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2H8.9V6zM18 20H6V10h12v10z"/>
        </svg>
        
        {/* Chains */}
        <div className="absolute w-full h-1 bg-zinc-500 rotate-45 top-1/2 left-0 -translate-y-1/2 shadow-sm border-y border-black/50 z-20"></div>
        <div className="absolute w-full h-1 bg-zinc-500 -rotate-45 top-1/2 left-0 -translate-y-1/2 shadow-sm border-y border-black/50 z-20"></div>
    </div>
  );

  const renderKey = () => (
    <div className="absolute inset-0 flex items-center justify-center">
        {/* Levitation effect */}
        <div className="absolute inset-0 animate-float-small flex items-center justify-center">
             <div className="absolute inset-0 bg-yellow-400/20 rounded-full blur-md animate-pulse"></div>
             <svg className="w-8 h-8 text-yellow-300 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.65 10C11.83 7.67 9.61 6 7 6c-3.31 0-6 2.69-6 6s2.69 6 6 6c2.61 0 4.83-1.67 5.65-4H17v4h4v-4h2v-4H12.65zM7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
             </svg>
             {/* Sparkle */}
             <div className="absolute top-2 right-3 w-1 h-1 bg-white rounded-full animate-ping"></div>
        </div>
    </div>
  );

  const renderVirus = () => (
    <div className="absolute inset-0 rounded-full overflow-hidden">
        {/* Oozing background */}
        <div className="absolute inset-[-10%] bg-green-900 mix-blend-multiply animate-ooze"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/shattered-island.png')] opacity-40 mix-blend-overlay animate-spin-slow"></div>
        
        <div className="absolute inset-0 flex items-center justify-center animate-ooze" style={{ animationDelay: '1s' }}>
             <svg className="w-9 h-9 text-lime-400 opacity-90 drop-shadow-[0_0_5px_rgba(132,204,22,0.8)]" fill="currentColor" viewBox="0 0 24 24">
                 <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                 <circle cx="12" cy="12" r="2.5" className="animate-pulse" />
                 <circle cx="16" cy="15" r="1.5" className="animate-pulse" style={{animationDelay: '0.2s'}} />
                 <circle cx="8" cy="15" r="1.5" className="animate-pulse" style={{animationDelay: '0.5s'}} />
             </svg>
        </div>
    </div>
  );

  const renderIce = () => {
    const clicks = ball.iceClicks || 0;
    const isCracked = ball.isCracked;
    
    // Base Shiver animation only if not cracked fully
    const animClass = triggerShake ? 'animate-shake' : (isCracked ? '' : 'animate-shiver');

    if (isCracked) {
        return (
            <div className="absolute inset-0 rounded-full bg-cyan-400/10 border-2 border-cyan-200/30 shadow-[inset_0_0_10px_rgba(255,255,255,0.3)] backdrop-blur-[1px]">
                <div className="absolute top-2 right-3 w-2 h-2 bg-white/50 rounded-full blur-[1px]"></div>
            </div>
        );
    }

    return (
      <div className={`absolute inset-0 rounded-full bg-gradient-to-br from-cyan-50 to-cyan-200 border-2 border-white/80 shadow-[inset_0_0_15px_rgba(34,211,238,0.6)] flex items-center justify-center transition-all duration-200 ${animClass}`}>
        <div className="absolute inset-0 opacity-60 bg-[url('https://www.transparenttextures.com/patterns/snow.png')]"></div>
        
        {/* Frost texture */}
        <div className="absolute inset-0 rounded-full bg-white/10 mix-blend-overlay"></div>

        {/* Dynamic Cracks */}
        {clicks >= 1 && (
             <svg viewBox="0 0 100 100" className="absolute w-full h-full opacity-80 pointer-events-none drop-shadow-sm">
                 <path d="M50 0 L50 35 M20 20 L40 40" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" />
             </svg>
        )}
        {clicks >= 2 && (
             <svg viewBox="0 0 100 100" className="absolute w-full h-full opacity-90 pointer-events-none drop-shadow-md">
                 <path d="M50 0 L50 50 L20 70 M80 20 L50 50 L80 85" stroke="#0e7490" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                 <path d="M50 50 L30 30" stroke="#0e7490" strokeWidth="1" fill="none" />
             </svg>
        )}
        
        <div className="absolute top-2 left-3 w-4 h-2 bg-white/80 rounded-full rotate-[-45deg] blur-[1px]"></div>
      </div>
    );
  };

  const renderHidden = () => (
      <div className="w-full h-full rounded-full bg-slate-700 flex items-center justify-center shadow-inner border border-slate-600">
          <div className="absolute inset-0 bg-black/20 rounded-full"></div>
          <span className="text-slate-500 font-bold text-xl drop-shadow-md relative z-10">?</span>
      </div>
  );

  let content = null;

  if (ball.isHidden) {
      content = renderHidden();
  } else if (ball.effect === 'stone') {
      content = renderStone();
  } else if (ball.effect === 'joker') {
      content = renderJoker();
  } else if (ball.effect === 'lock') {
      content = renderLock();
  } else if (ball.effect === 'key') {
      content = renderKey();
  } else if (ball.effect === 'virus') {
      content = renderVirus();
  } else if (ball.effect === 'ice') {
      content = renderIce();
  } else if (ball.effect === 'artifact') {
      content = renderArtifact();
  }

  return (
    <div
      id={domId}
      className={`
        w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-black/10
        flex items-center justify-center relative
        ${selected ? '-translate-y-4 sm:-translate-y-6 shadow-xl z-10' : ''}
        ${isGhost ? 'opacity-0' : 'opacity-100'}
        ${isVictory ? 'animate-victory' : ''}
        ball-shadow
      `}
      style={{
        backgroundColor: (ball.isHidden || (ball.effect === 'ice' && !ball.isCracked) || ball.effect === 'artifact') ? 'transparent' : ball.color,
        transition: isGhost ? 'none' : 'transform 0.2s ease-out',
        animationDelay: isVictory ? `${indexInTube * 0.1}s` : '0s'
      }}
    >
      {content}
    </div>
  );
};

export default Ball;