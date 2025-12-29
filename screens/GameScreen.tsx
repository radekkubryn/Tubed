import React, { useEffect, useState, useRef } from 'react';
import { Tube as TubeType, TUBE_CAPACITY } from '../types';
import { generateLevel, canMove, checkVictory, calculateStars } from '../services/gameLogic';
import { completeLevel } from '../services/storage';
import { audio } from '../services/audio';
import Tube from '../components/Tube';

interface Props {
  levelId: number;
  onExit: () => void;
}

const GameScreen: React.FC<Props> = ({ levelId, onExit }) => {
  const [tubes, setTubes] = useState<TubeType[]>([]);
  const [selectedTubeIndex, setSelectedTubeIndex] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  
  // Game State
  const [isLevelComplete, setIsLevelComplete] = useState(false); // Triggers animation
  const [showVictoryModal, setShowVictoryModal] = useState(false); // Triggers modal overlay
  const [stars, setStars] = useState(0);
  
  // Animation State
  const [isAnimating, setIsAnimating] = useState(false);
  const [ghostBallId, setGhostBallId] = useState<string | null>(null);
  const flyingBallRef = useRef<HTMLDivElement>(null);

  // Initialize Level
  useEffect(() => {
    setTubes(generateLevel(levelId));
    setMoves(0);
    setIsLevelComplete(false);
    setShowVictoryModal(false);
    setSelectedTubeIndex(null);
    setGhostBallId(null);
    setIsAnimating(false);
  }, [levelId]);

  const handleTubeClick = async (index: number) => {
    if (isLevelComplete || isAnimating) return;

    if (selectedTubeIndex === null) {
      // Select logic
      const tube = tubes[index];
      if (tube.balls.length > 0) {
        const topBall = tube.balls[tube.balls.length - 1];
        if (!topBall.isHidden) {
          audio.playSelect();
          setSelectedTubeIndex(index);
        } else {
            audio.playInvalid();
        }
      }
    } else {
      // Move logic
      if (selectedTubeIndex === index) {
        // Deselect
        audio.playSelect();
        setSelectedTubeIndex(null);
      } else {
        const sourceTube = tubes[selectedTubeIndex];
        const targetTube = tubes[index];

        if (canMove(sourceTube, targetTube)) {
          // Perform animation first, then update state
          await animateMove(selectedTubeIndex, index);
        } else {
          // Invalid move logic
          audio.playInvalid();
          setSelectedTubeIndex(null);
          if (targetTube.balls.length > 0 && !targetTube.balls[targetTube.balls.length-1].isHidden) {
             audio.playSelect();
             setSelectedTubeIndex(index);
          }
        }
      }
    }
  };

  const animateMove = async (fromIdx: number, toIdx: number) => {
    setIsAnimating(true);
    
    const sourceTube = tubes[fromIdx];
    const ballToMove = sourceTube.balls[sourceTube.balls.length - 1];
    const sourceBallDomId = `tube-${fromIdx}-ball-${sourceTube.balls.length - 1}`;
    
    // 1. Get Coordinates
    const sourceEl = document.getElementById(sourceBallDomId);
    const targetTubeEl = document.getElementById(`tube-${toIdx}`);
    const flyingEl = flyingBallRef.current;

    if (sourceEl && targetTubeEl && flyingEl) {
        // Set ghost ball to hide the original
        setGhostBallId(ballToMove.id);

        const srcRect = sourceEl.getBoundingClientRect();
        
        // Calculate Target Position
        // We need to simulate where the ball will land.
        // If empty, bottom of tube. If not, on top of top ball.
        const targetTubeObj = tubes[toIdx];
        let targetTop = 0;
        let targetLeft = 0;

        // Base measurements (assuming gap-1 is 4px)
        const gap = 4; 
        
        if (targetTubeObj.balls.length === 0) {
            const tubeRect = targetTubeEl.getBoundingClientRect();
            // Tube is border-b-4 (4px) + p-1 (4px) at bottom.
            // Ball sits at bottom inside padding.
            const bottomOffset = 8; 
            targetTop = tubeRect.bottom - bottomOffset - srcRect.height;
            // Center horizontally in tube
            targetLeft = tubeRect.left + (tubeRect.width - srcRect.width) / 2;
        } else {
            // Find the current top ball in target
            const targetTopBallIndex = targetTubeObj.balls.length - 1;
            const targetTopBallEl = document.getElementById(`tube-${toIdx}-ball-${targetTopBallIndex}`);
            
            if (targetTopBallEl) {
                const targetBallRect = targetTopBallEl.getBoundingClientRect();
                // New ball goes ON TOP. Flex-col-reverse means visually higher (lower Y value)
                targetTop = targetBallRect.top - gap - srcRect.height;
                targetLeft = targetBallRect.left; // Align with existing ball
            } else {
                // Fallback (shouldn't happen if state is consistent)
                const tubeRect = targetTubeEl.getBoundingClientRect();
                targetTop = tubeRect.top; 
                targetLeft = tubeRect.left + (tubeRect.width - srcRect.width) / 2;
            }
        }

        // 2. Setup Flying Ball
        flyingEl.style.width = `${srcRect.width}px`;
        flyingEl.style.height = `${srcRect.height}px`;
        flyingEl.style.backgroundColor = ballToMove.color;
        flyingEl.style.display = 'flex'; // Visible
        
        // 3. Run Animation (WAAPI)
        const animation = flyingEl.animate([
            { 
                transform: `translate(${srcRect.left}px, ${srcRect.top}px)`,
                zIndex: 50 
            },
            { 
                transform: `translate(${srcRect.left}px, ${srcRect.top - 20}px)`, // Slight lift
                offset: 0.2,
                zIndex: 50
            },
            { 
                transform: `translate(${targetLeft}px, ${targetTop}px)`, 
                zIndex: 50 
            }
        ], {
            duration: 300,
            easing: 'cubic-bezier(0.2, 0, 0.2, 1)', // Authentic motion curve
            fill: 'forwards'
        });

        await animation.finished;

        // Cleanup visuals
        flyingEl.style.display = 'none';
    }

    // 4. Update Game State
    performMove(fromIdx, toIdx);
    audio.playMove(); // Play sound on impact
    
    // 5. Reset Animation State
    setIsAnimating(false);
    setGhostBallId(null);
  };

  const performMove = (fromIdx: number, toIdx: number) => {
    setTubes(prevTubes => {
      const newTubes = prevTubes.map(t => ({ ...t, balls: [...t.balls] }));
      const source = newTubes[fromIdx];
      const target = newTubes[toIdx];

      const ball = source.balls.pop();
      if (ball) {
        target.balls.push(ball);

        // CHECK HIDDEN BALL LOGIC
        if (source.balls.length > 0) {
          const newTopIndex = source.balls.length - 1;
          if (source.balls[newTopIndex].isHidden) {
            source.balls[newTopIndex].isHidden = false;
          }
        }
      }

      const isWin = checkVictory(newTubes);
      if (isWin) {
        handleVictory();
      }

      return newTubes;
    });

    setMoves(m => m + 1);
    setSelectedTubeIndex(null);
  };
  
  const handleVictory = () => {
      const earnedStars = calculateStars(levelId, moves + 1);
      setStars(earnedStars);
      setIsLevelComplete(true);
      completeLevel(levelId, moves + 1, earnedStars);
      audio.playVictory();
      
      // Delay showing the modal to let the balls bounce for a bit
      setTimeout(() => {
          setShowVictoryModal(true);
      }, 2500);
  };

  const handleRestart = () => {
    setTubes(generateLevel(levelId));
    setMoves(0);
    setIsLevelComplete(false);
    setShowVictoryModal(false);
    setSelectedTubeIndex(null);
    setGhostBallId(null);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-white relative">
      {/* Header */}
      <div className="flex justify-between items-center p-4 bg-slate-800 shadow-md z-20 shrink-0">
        <button onClick={onExit} className="text-slate-400 hover:text-white">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </button>
        <div className="flex flex-col items-center">
          <h2 className="text-xl font-bold text-yellow-500 tracking-wider">POZIOM {levelId}</h2>
          <span className="text-xs text-slate-400">RUCHY: {moves}</span>
        </div>
        <button onClick={handleRestart} className="text-slate-400 hover:text-white">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
        </button>
      </div>

      {/* Game Area */}
      <div className={`flex-1 overflow-y-auto p-4 flex items-center justify-center transition-all duration-700 ${showVictoryModal ? 'opacity-30 blur-sm' : 'opacity-100'}`}>
        <div className="flex flex-wrap justify-center gap-4 sm:gap-8 max-w-4xl">
          {tubes.map((tube, idx) => (
            <Tube
              key={tube.id}
              domId={`tube-${idx}`}
              tube={tube}
              isSelected={selectedTubeIndex === idx}
              ghostBallId={ghostBallId}
              isTargetCandidate={
                selectedTubeIndex !== null && 
                selectedTubeIndex !== idx && 
                canMove(tubes[selectedTubeIndex], tube)
              }
              isVictory={isLevelComplete}
              onClick={() => handleTubeClick(idx)}
            />
          ))}
        </div>
      </div>

      {/* Flying Ball Helper Element */}
      <div 
        ref={flyingBallRef}
        className="fixed top-0 left-0 rounded-full border border-black/10 ball-shadow pointer-events-none hidden z-50"
      />

      {/* Victory Modal */}
      {showVictoryModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-500 animate-[fadeIn_0.5s]">
          {/* Modal Content - Static (no bounce) */}
          <div className="bg-slate-800 border border-yellow-500/50 p-8 rounded-2xl shadow-2xl text-center max-w-sm w-full">
            <h2 className="text-3xl font-bold text-yellow-400 mb-2">ŚWIETNIE!</h2>
            <p className="text-slate-300 mb-6">Poziom {levelId} ukończony</p>
            
            <div className="flex justify-center gap-2 mb-6">
              {[1, 2, 3].map(s => (
                <svg key={s} className={`w-10 h-10 ${s <= stars ? 'text-yellow-400 fill-current' : 'text-slate-600'}`} viewBox="0 0 24 24">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                </svg>
              ))}
            </div>

            <p className="mb-6 text-sm text-slate-400">Wykonane ruchy: {moves}</p>

            <button 
              onClick={onExit}
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:scale-105 transition-transform"
            >
              KONTYNUUJ
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameScreen;