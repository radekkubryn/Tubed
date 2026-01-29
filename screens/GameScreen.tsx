import React, { useEffect, useState, useRef } from 'react';
import { Tube as TubeType, TUBE_CAPACITY, Ball as BallType, PowerUpType, TEST_LEVEL_ID, PETS_DATA, ARTIFACTS_DATA, BOSSES_DATA, Boss } from '../types';
import { generateLevel, canMove, checkVictory, executePetAbility, executeBossSabotage } from '../services/gameLogic';
import { completeLevel, getProgress, saveProgress, updateAchievementProgress, unlockArtifact } from '../services/storage';
import { audio } from '../services/audio';
import { vibrate } from '../services/vibration';
import Tube from '../components/Tube';
import Ball from '../components/Ball';

interface Props {
  levelId: number;
  onExit: () => void;
}

const VictoryOverlay: React.FC<{ bossReward?: { coins: number, stars: number } | null }> = ({ bossReward }) => (
    <div className="absolute inset-0 pointer-events-none z-40 overflow-hidden">
        {/* Confetti */}
        {Array.from({ length: 50 }).map((_, i) => (
            <div 
                key={i} 
                className="confetti-piece"
                style={{
                    left: `${Math.random() * 100}%`,
                    backgroundColor: ['#f00', '#0f0', '#00f', '#ff0', '#f0f', '#0ff'][Math.floor(Math.random() * 6)],
                    animationDelay: `${Math.random() * 2}s`,
                    animationDuration: `${2 + Math.random() * 2}s`
                }}
            />
        ))}
        {/* Supernova Flash */}
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 bg-white rounded-full animate-supernova blur-lg"></div>
        </div>
        {/* Coin Rain (Simple CSS) */}
        {Array.from({ length: 15 }).map((_, i) => (
            <div
                key={`coin-${i}`}
                className="coin-rain text-yellow-400"
                style={{
                    left: `${10 + Math.random() * 80}%`,
                    animationDelay: `${0.5 + Math.random() * 1}s`
                }}
            >
                🪙
            </div>
        ))}
        {bossReward && (
             <div className="absolute top-1/4 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce">
                 <div className="text-4xl filter drop-shadow-[0_0_10px_rgba(255,0,0,0.8)]">☠️</div>
                 <div className="text-red-500 font-black text-2xl uppercase tracking-widest drop-shadow-md stroke-white">BOSS POKONANY</div>
             </div>
        )}
    </div>
);

const GameScreen: React.FC<Props> = ({ levelId, onExit }) => {
  // Core State
  const [tubes, setTubes] = useState<TubeType[]>([]);
  const [history, setHistory] = useState<TubeType[][]>([]); // For Undo
  const [moves, setMoves] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [hasUsedUndo, setHasUsedUndo] = useState(false);
  const [failCount, setFailCount] = useState(0);
  
  // Interaction State
  const [selectedTubeIndex, setSelectedTubeIndex] = useState<number | null>(null);
  
  // Power Ups & Inventory
  const [activePowerUp, setActivePowerUp] = useState<PowerUpType | null>(null);
  const [inventory, setInventory] = useState<Record<string, number>>({});
  const [swapSourceIndex, setSwapSourceIndex] = useState<number | null>(null);

  // Pets & Boss
  const [activePetId, setActivePetId] = useState<string | null>(null);
  const [petUsed, setPetUsed] = useState(false);
  const [currentBoss, setCurrentBoss] = useState<Boss | undefined>(undefined);
  const [bossMessage, setBossMessage] = useState<string | null>(null);
  
  // Artifacts
  const [foundArtifact, setFoundArtifact] = useState<string | null>(null);

  // Game Lifecycle State
  const [isLevelComplete, setIsLevelComplete] = useState(false);
  const [showVictoryModal, setShowVictoryModal] = useState(false);
  const [stars, setStars] = useState(0);
  const [earnedCoins, setEarnedCoins] = useState(0);
  const [bossReward, setBossReward] = useState<{coins: number, stars: number} | null>(null);
  
  // Animation State
  const [isAnimating, setIsAnimating] = useState(false);
  const [shakingBallId, setShakingBallId] = useState<string | null>(null); 
  const gameContainerRef = useRef<HTMLDivElement>(null);

  // --- Initialization ---

  useEffect(() => {
    // Generate Level
    const newTubes = generateLevel(levelId);
    setTubes(newTubes);
    setHistory([]);
    setMoves(0);
    setTimeElapsed(0);
    setHasUsedUndo(false);
    
    // Reset Game State
    setIsLevelComplete(false);
    setShowVictoryModal(false);
    setSelectedTubeIndex(null);
    setIsAnimating(false);
    setFoundArtifact(null);
    setBossReward(null);
    
    // Reset Powerups
    setActivePowerUp(null);
    setSwapSourceIndex(null);

    // Load Inventory & Pet
    const progress = getProgress();
    setInventory(progress.inventory);
    setActivePetId(progress.activePetId);
    setPetUsed(false);

    // Boss Init
    const boss = BOSSES_DATA.find(b => b.level === levelId);
    setCurrentBoss(boss);
    setBossMessage(null);

  }, [levelId]);

  const handleRestart = () => {
      setFailCount(c => c + 1);
      updateAchievementProgress('fail_5', 1); // Track restarts
      window.location.reload();
  };

  // --- Timer ---
  useEffect(() => {
      let interval: any;
      if (!isLevelComplete && !showVictoryModal) {
          interval = setInterval(() => {
              setTimeElapsed(t => t + 1);
          }, 1000);
      }
      return () => clearInterval(interval);
  }, [isLevelComplete, showVictoryModal]);

  // --- Boss Logic Hook ---
  useEffect(() => {
      if (currentBoss && moves > 0 && moves % 3 === 0 && !isLevelComplete) {
          // Trigger Sabotage
          const result = executeBossSabotage(tubes);
          if (result) {
              setBossMessage(result.action.message);
              // Slight delay to show message before applying effect
              setTimeout(() => {
                 setTubes(result.tubes);
                 setBossMessage(null);
                 audio.playInvalid(); // Error sound for sabotage
                 vibrate(200);
              }, 1500);
          }
      }
  }, [moves, currentBoss]);

  const formatTime = (totalSeconds: number) => {
      const m = Math.floor(totalSeconds / 60);
      const s = totalSeconds % 60;
      return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const saveToHistory = () => {
    setHistory(prev => [...prev, JSON.parse(JSON.stringify(tubes))]);
  };

  // --- PET ABILITY ---
  const handlePetAbility = () => {
      if (!activePetId || petUsed || isLevelComplete) return;
      
      const result = executePetAbility(tubes, activePetId);
      
      if (result.success) {
          saveToHistory();
          setTubes(result.tubes);
          setPetUsed(true);
          audio.playMagic();
          vibrate(50);
          if (result.message) {
              setBossMessage(result.message);
              setTimeout(() => setBossMessage(null), 2000);
          }
      } else {
          audio.playInvalid(); 
      }
  };

  const checkArtifactCollection = (currentTubes: TubeType[]) => {
      // Check if any completed tube contains an artifact
      // A tube is "collected" if it's full and pure (or pure with wildcard)
      currentTubes.forEach(t => {
          if (t.balls.length === t.capacity) {
             const hasArtifact = t.balls.some(b => b.effect === 'artifact');
             if (hasArtifact) {
                 // Check purity (excluding jokers/artifacts)
                 const firstColor = t.balls.find(b => b.effect !== 'joker' && b.effect !== 'artifact')?.color;
                 if (firstColor) {
                     const isPure = t.balls.every(b => b.effect === 'joker' || b.effect === 'artifact' || b.color === firstColor);
                     if (isPure) {
                         // Collect artifact!
                         // Randomly select an unlocked artifact ID for now, or just generic found
                         const uncollected = ARTIFACTS_DATA.filter(a => !getProgress().artifacts.includes(a.id));
                         if (uncollected.length > 0) {
                             const found = uncollected[0];
                             unlockArtifact(found.id);
                             setFoundArtifact(found.title);
                             audio.playMagic();
                             // Remove artifact logic? No, keep visual.
                         }
                     }
                 }
             }
          }
      });
  };

  const handleVictory = () => {
    if (isLevelComplete) return;
    
    // Check for artifacts one last time
    checkArtifactCollection(tubes);

    setIsLevelComplete(true);
    audio.playVictory();
    
    // Calculate stars and save (pass timeElapsed)
    const { newStars, coinsEarned, bossReward: reward } = completeLevel(levelId, moves, timeElapsed);
    setStars(newStars);
    setEarnedCoins(coinsEarned);
    if (reward) setBossReward(reward);

    // Achievements specific to victory
    if (!hasUsedUndo) {
        updateAchievementProgress('no_undo_5', 1);
        updateAchievementProgress('no_undo_20', 1);
    }
    
    setTimeout(() => {
        setShowVictoryModal(true);
    }, 1200); 
  };

  const handleIceClick = (tubeIndex: number, ballId: string) => {
    saveToHistory();
    setTubes(prev => {
      const newTubes = JSON.parse(JSON.stringify(prev)) as TubeType[];
      const tube = newTubes[tubeIndex];
      const ball = tube.balls.find(b => b.id === ballId);
      
      if (ball && ball.effect === 'ice') {
        ball.iceClicks = (ball.iceClicks || 0) + 1;
        
        if (ball.iceClicks >= 3) {
           ball.isCracked = true;
           audio.playBreak(); 
           updateAchievementProgress('ice_break', 1);
        } else {
           audio.playSelect(); 
           setShakingBallId(ballId);
           setTimeout(() => setShakingBallId(null), 300);
        }
      }
      return newTubes;
    });
    vibrate(20);
  };

  const animateMove = async (fromIndex: number, toIndex: number, count: number) => {
      setIsAnimating(true);
      
      setTubes(currentTubes => {
          const newTubes = JSON.parse(JSON.stringify(currentTubes)) as TubeType[];
          const sourceTube = newTubes[fromIndex];
          const targetTube = newTubes[toIndex];
          
          const movedBalls = sourceTube.balls.splice(sourceTube.balls.length - count, count);
          
          // KEY / LOCK Logic
          const topMoving = movedBalls[movedBalls.length - 1]; 
          const bottomMoving = movedBalls[0];

          if (targetTube.balls.length > 0) {
              const targetBall = targetTube.balls[targetTube.balls.length - 1];
              if (targetBall.effect === 'lock' && (bottomMoving.effect === 'key' && (bottomMoving.color === targetBall.color))) {
                  // Unlock!
                  targetTube.balls.pop(); // Remove lock
                  movedBalls.shift(); // Remove key
                  audio.playMagic();
                  updateAchievementProgress('lock_open', 1);
              }
              
              // VIRUS Logic
              if (bottomMoving.effect === 'virus') {
                  targetBall.color = bottomMoving.color; // Infect!
                  audio.playPaint(); 
              }
          }

          targetTube.balls.push(...movedBalls);

          // Reveal hidden
          if (sourceTube.balls.length > 0) {
            const newTopBall = sourceTube.balls[sourceTube.balls.length - 1];
            if (newTopBall.isHidden) {
              newTopBall.isHidden = false;
              updateAchievementProgress('hidden_reveal', 1);
            }
          }
          
          // Check Joker Usage
          if (movedBalls.some(b => b.effect === 'joker')) {
              updateAchievementProgress('joker_10', 1);
          }

          // Stone Breaking Logic
          const stoneIndices = targetTube.balls
              .map((b, i) => b.effect === 'stone' ? i : -1)
              .filter(i => i !== -1);
          
          for (let i = stoneIndices.length - 1; i >= 0; i--) {
              const sIdx = stoneIndices[i];
              const ballsAbove = targetTube.balls.slice(sIdx + 1, sIdx + 4);
              if (ballsAbove.length === 3) {
                  if (ballsAbove.some(b => b.isHidden)) continue;
                  const nonJoker = ballsAbove.find(b => b.effect !== 'joker' && b.effect !== 'artifact');
                  let isMatch = false;
                  if (!nonJoker) isMatch = true;
                  else {
                      const matchColor = nonJoker.color;
                      isMatch = ballsAbove.every(b => (b.effect === 'joker' || b.effect === 'artifact' || b.color === matchColor) && b.effect !== 'stone');
                  }
                  if (isMatch) {
                      targetTube.balls.splice(sIdx, 1);
                      audio.playBreak();
                      updateAchievementProgress('stone_break', 1);
                      break; 
                  }
              }
          }

          return newTubes;
      });

      setMoves(m => m + 1);
      setSelectedTubeIndex(null);
      setIsAnimating(false);
      
      setTimeout(() => {
          setTubes(t => {
              if (checkVictory(t)) {
                  handleVictory();
              }
              return t;
          });
      }, 200);
  };

  const handleTubeClick = async (index: number) => {
    if (isLevelComplete || isAnimating) return;

    if (activePowerUp) {
        handlePowerUpInteraction(index);
        return;
    }

    const tube = tubes[index];
    if (tube.balls.length > 0) {
        const topBall = tube.balls[tube.balls.length - 1];
        if (topBall.effect === 'ice' && !topBall.isCracked) {
            handleIceClick(index, topBall.id);
            return;
        }
    }

    if (selectedTubeIndex === null) {
      if (tube.balls.length > 0) {
        const topBall = tube.balls[tube.balls.length - 1];
        
        // Locked balls cannot be moved
        if (topBall.effect === 'stone' || topBall.effect === 'lock') {
          audio.playInvalid();
          vibrate(50);
          return;
        }

        if (!topBall.isHidden) {
          vibrate(20);
          audio.playSelect();
          setSelectedTubeIndex(index);
        } else {
          audio.playInvalid();
        }
      }
    } else {
      if (selectedTubeIndex === index) {
        audio.playSelect();
        setSelectedTubeIndex(null);
      } else {
        const sourceTube = selectedTubeIndex !== null ? tubes[selectedTubeIndex] : null;
        if (!sourceTube) return; // Should not happen

        const targetTube = tubes[index];
        const moveCheck = canMove(sourceTube, targetTube);

        if (moveCheck.can) {
          saveToHistory();
          vibrate(40);
          await animateMove(selectedTubeIndex, index, moveCheck.count);
        } else {
          audio.playInvalid();
          setSelectedTubeIndex(null);
        }
      }
    }
  };
  
  const handlePowerUpInteraction = (tubeIndex: number) => {
      // ... (Same powerup logic as before, omitted for brevity but strictly follows original file logic)
      // I'll re-include it to be safe for the XML replacement
      const newTubes = JSON.parse(JSON.stringify(tubes)) as TubeType[];
      const tube = newTubes[tubeIndex];
      const hasBalls = tube.balls.length > 0;
      const topBall = hasBalls ? tube.balls[tube.balls.length - 1] : null;

      let success = false;
      let shouldPlayInvalid = false;

      switch (activePowerUp) {
          case 'hammer':
              if (hasBalls && topBall && topBall.effect !== 'stone' && topBall.effect !== 'lock') {
                  saveToHistory();
                  tube.balls.pop(); 
                  if (tube.balls.length > 0) {
                      const newTop = tube.balls[tube.balls.length - 1];
                      if (newTop.isHidden) newTop.isHidden = false;
                  }
                  setTubes(newTubes);
                  audio.playBreak();
                  vibrate(100);
                  success = true;
              } else shouldPlayInvalid = true;
              break;
          case 'wand':
              if (topBall && !topBall.isHidden && topBall.effect !== 'stone' && topBall.effect !== 'lock') {
                  saveToHistory();
                  topBall.effect = 'joker';
                  setTubes(newTubes);
                  audio.playMagic();
                  vibrate(50);
                  success = true;
              } else shouldPlayInvalid = true;
              break;
          case 'pickaxe':
              if (hasBalls) {
                  const stoneIndex = tube.balls.findIndex(b => b.effect === 'stone');
                  const lockIndex = tube.balls.findIndex(b => b.effect === 'lock');
                  if (stoneIndex !== -1 || lockIndex !== -1) {
                      saveToHistory();
                      if (stoneIndex !== -1) {
                          tube.balls.splice(stoneIndex, 1);
                          updateAchievementProgress('stone_break', 1);
                      } else if (lockIndex !== -1) {
                          tube.balls.splice(lockIndex, 1);
                          updateAchievementProgress('lock_open', 1);
                      }
                      setTubes(newTubes);
                      audio.playBreak();
                      vibrate(100);
                      success = true;
                  } else shouldPlayInvalid = true;
              } else shouldPlayInvalid = true;
              break;
          case 'paint':
               if (tube.balls.length >= 2) {
                  const targetBall = tube.balls[tube.balls.length - 1];
                  const sourceBall = tube.balls[tube.balls.length - 2];
                  if (!targetBall.isHidden && !sourceBall.isHidden && sourceBall.effect !== 'joker' && targetBall.effect !== 'stone') {
                      saveToHistory();
                      targetBall.color = sourceBall.color;
                      setTubes(newTubes);
                      audio.playPaint();
                      success = true;
                  } else shouldPlayInvalid = true;
              } else shouldPlayInvalid = true;
              break;
          case 'swap':
               if (swapSourceIndex === null) {
                  if (hasBalls && topBall && !topBall.isHidden && topBall.effect !== 'stone' && topBall.effect !== 'lock') {
                      setSwapSourceIndex(tubeIndex);
                      audio.playSelect();
                      return; 
                  } else shouldPlayInvalid = true;
              } else {
                  if (swapSourceIndex === tubeIndex) {
                      setSwapSourceIndex(null);
                      audio.playSelect();
                  } else if (hasBalls && topBall && !topBall.isHidden && topBall.effect !== 'stone' && topBall.effect !== 'lock') {
                      saveToHistory();
                      const t1 = newTubes[swapSourceIndex];
                      const t2 = newTubes[tubeIndex];
                      const b1 = t1.balls.pop()!;
                      const b2 = t2.balls.pop()!;
                      t1.balls.push(b2);
                      t2.balls.push(b1);
                      setTubes(newTubes);
                      success = true;
                      audio.playMagic();
                      vibrate(50);
                  } else shouldPlayInvalid = true;
              }
              break;
          case 'magnet':
             if (hasBalls && topBall && topBall.effect !== 'lock' && topBall.effect !== 'stone') {
                 const targetColor = (topBall.effect === 'joker' || topBall.effect === 'artifact') ? null : topBall.color;
                 if (targetColor) {
                     saveToHistory();
                     const capacity = tube.capacity || 4;
                     let space = capacity - tube.balls.length;
                     let gathered = 0;
                     if (space > 0) {
                         for (let i = 0; i < newTubes.length; i++) {
                             if (i === tubeIndex) continue;
                             const otherTube = newTubes[i];
                             while (otherTube.balls.length > 0 && space > 0) {
                                 const candidate = otherTube.balls[otherTube.balls.length - 1];
                                 const isCandidateValid = !candidate.isHidden && 
                                                          candidate.effect === 'normal' && 
                                                          candidate.color === targetColor;
                                 if (isCandidateValid) {
                                     tube.balls.push(otherTube.balls.pop()!);
                                     if (otherTube.balls.length > 0) {
                                        const newTop = otherTube.balls[otherTube.balls.length - 1];
                                        if (newTop.isHidden) newTop.isHidden = false;
                                     }
                                     space--;
                                     gathered++;
                                 } else break;
                             }
                             if (space === 0) break;
                         }
                     }
                     if (gathered > 0) {
                        setTubes(newTubes);
                        success = true;
                        audio.playMagnet();
                        vibrate(50);
                     } else shouldPlayInvalid = true;
                 } else shouldPlayInvalid = true;
             } else shouldPlayInvalid = true;
             break;
      }
      if (shouldPlayInvalid) {
          audio.playInvalid();
          vibrate(50);
      }
      if (success) {
          setInventory(prev => ({ ...prev, [activePowerUp!]: Math.max(0, (prev[activePowerUp!] || 0) - 1) }));
          // Note: Full inventory update handled in wrapper or assume consistent
          setActivePowerUp(null);
          setSwapSourceIndex(null);
          setTimeout(() => {
              setTubes(currentTubes => {
                 if (checkVictory(currentTubes)) handleVictory();
                 return currentTubes;
              });
          }, 100);
      }
  };

  const activatePowerUp = (type: PowerUpType) => {
      const count = inventory[type] || 0;
      if (count <= 0) { audio.playInvalid(); return; }
      if (activePowerUp === type) { setActivePowerUp(null); setSwapSourceIndex(null); return; }

      const consume = () => {
          setInventory(prev => ({ ...prev, [type]: Math.max(0, (prev[type] || 0) - 1) }));
          // Persist
          const currentProgress = getProgress();
          if (currentProgress.inventory[type] > 0) {
              currentProgress.inventory[type]--;
              saveProgress(currentProgress);
              updateAchievementProgress(`use_${type}`, 1);
          }
      };

      if (type === 'undo') {
          if (history.length > 0) {
              const previousState = history[history.length - 1];
              setTubes(previousState);
              setHistory(prev => prev.slice(0, -1));
              setMoves(m => Math.max(0, m - 1));
              setHasUsedUndo(true); 
              vibrate(30);
              audio.playUndo();
              consume();
          } else { audio.playInvalid(); }
          return;
      }
      if (type === 'flame') {
          saveToHistory();
          let crackedCount = 0;
          setTubes(prev => prev.map(t => ({...t, balls: t.balls.map(b => {
             if(b.effect === 'ice' && !b.isCracked) { crackedCount++; return { ...b, isCracked: true, iceClicks: 3 }; }
             return b;
          }) })));
          if (crackedCount > 0) updateAchievementProgress('ice_break', crackedCount);
          audio.playFire();
          consume();
          return;
      }
      if (type === 'xray') {
          saveToHistory();
          let revealedCount = 0;
          setTubes(prev => prev.map(t => ({...t, balls: t.balls.map(b => {
              if (b.isHidden) { revealedCount++; return { ...b, isHidden: false }; }
              return b;
          }) })));
          if(revealedCount > 0) updateAchievementProgress('hidden_reveal', revealedCount);
          audio.playScan();
          consume();
          return;
      }
      if (type === 'pocket') {
          saveToHistory();
          setTubes(prev => [...prev, { id: Date.now(), balls: [], capacity: 1 }]);
          audio.playPop();
          consume();
          return;
      }

      setActivePowerUp(type);
      setSelectedTubeIndex(null);
      audio.playSelect();
  };

  const renderPowerUpButton = (type: PowerUpType) => {
      const count = inventory[type] || 0;
      if (count <= 0) return null;
      let icon = '';
      switch(type) {
          case 'undo': icon = '↩️'; break;
          case 'wand': icon = '🪄'; break;
          case 'pickaxe': icon = '⛏️'; break;
          case 'flame': icon = '🔥'; break;
          case 'xray': icon = '👁️'; break;
          case 'hammer': icon = '🔨'; break;
          case 'paint': icon = '🖌️'; break;
          case 'magnet': icon = '🧲'; break;
          case 'swap': icon = '⇄'; break;
          case 'pocket': icon = '📥'; break;
      }

      return (
          <button 
             key={type}
             onClick={() => activatePowerUp(type)}
             className={`
                relative flex flex-col items-center justify-center 
                w-14 h-14 sm:w-16 sm:h-16 shrink-0 rounded-xl transition-all duration-300
                ${activePowerUp === type ? 'bg-yellow-400 text-slate-900 -translate-y-2 scale-110 shadow-lg ring-2 ring-yellow-400/50 z-10' : 'bg-slate-800 border-b-4 border-indigo-900 text-indigo-400 hover:bg-slate-700 active:border-b-0 active:translate-y-1'}
             `}
          >
              <span className="text-2xl drop-shadow-md">{icon}</span>
              <div className={`absolute -top-2 -right-2 w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center border-2 bg-red-500 border-slate-900 text-white`}>
                  {count}
              </div>
          </button>
      );
  };

  const powerUpList = (Object.keys(inventory) as PowerUpType[]).filter(k => inventory[k] > 0);
  const activePet = activePetId ? PETS_DATA.find(p => p.id === activePetId) : null;

  return (
    <div 
        ref={gameContainerRef}
        className="flex flex-col h-full bg-slate-900 text-white relative touch-none"
    >
      {/* Victory FX */}
      {isLevelComplete && <VictoryOverlay bossReward={bossReward} />}

      <div className="flex justify-between items-center p-4 bg-slate-800 shadow-md z-20 shrink-0 select-none">
        <button onClick={onExit} className="text-slate-400 hover:text-white"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg></button>
        <div className="flex flex-col items-center">
          {currentBoss ? (
             <div className="flex flex-col items-center">
                 <div className="text-red-500 font-bold animate-pulse uppercase flex items-center gap-2">
                     <span className="text-xl">{currentBoss.icon}</span> {currentBoss.name}
                 </div>
                 <span className="text-[10px] text-red-300">POZIOM {levelId}</span>
             </div>
          ) : (
             <div className="flex flex-col items-center">
                 <h2 className="text-xl font-bold tracking-wider text-yellow-500">POZIOM {levelId}</h2>
             </div>
          )}
          
          <div className="flex gap-3 text-xs text-slate-400 font-mono mt-1">
              <span>RUCHY: {moves}</span>
              <span>CZAS: {formatTime(timeElapsed)}</span>
          </div>
        </div>
        <button onClick={handleRestart} className="text-slate-400 hover:text-white"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg></button>
      </div>

      {/* Boss UI Overlay */}
      {currentBoss && (
          <div className="bg-red-900/20 w-full p-1 border-b border-red-800 flex items-center justify-between px-4">
              <div className="flex items-center gap-2">
                  <div className="text-xs text-red-300 font-bold uppercase">{currentBoss.title}</div>
              </div>
              <div className="text-xs text-red-200">
                  Sabotaż za: <span className="font-bold text-white text-lg">{3 - (moves % 3)}</span> ruchy
              </div>
          </div>
      )}

      {/* Boss Message Overlay */}
      {bossMessage && (
          <div className="absolute top-28 left-1/2 -translate-x-1/2 z-50 bg-red-600 text-white px-6 py-3 rounded-full font-bold shadow-2xl border-2 border-white animate-bounce text-center whitespace-nowrap">
              {bossMessage}
          </div>
      )}

      {/* Artifact Found Toast */}
      {foundArtifact && (
          <div className="absolute top-36 left-1/2 -translate-x-1/2 z-50 bg-amber-500 text-slate-900 px-6 py-3 rounded-xl font-bold shadow-2xl border-2 border-white animate-bounce text-center">
              <div className="text-xs uppercase">Znaleziono Artefakt!</div>
              <div className="text-lg">{foundArtifact}</div>
          </div>
      )}

      <div className={`flex-1 overflow-y-auto p-4 flex flex-col items-center justify-center transition-all duration-700 ${showVictoryModal ? 'opacity-30 blur-sm' : 'opacity-100'}`}>
        
        {/* Active Pet Button */}
        {activePet && !isLevelComplete && (
             <div className="absolute top-16 right-4 z-10">
                 <button 
                    onClick={handlePetAbility}
                    disabled={petUsed}
                    className={`
                        w-12 h-12 rounded-full border-2 flex items-center justify-center shadow-lg transition-all
                        ${petUsed 
                            ? 'bg-slate-700 border-slate-600 opacity-50 grayscale cursor-not-allowed' 
                            : 'bg-indigo-600 border-indigo-400 hover:scale-110 cursor-pointer animate-pulse-slow'}
                    `}
                 >
                     <span className="text-2xl">{activePet.icon}</span>
                     {!petUsed && <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></div>}
                 </button>
             </div>
        )}

        {activePowerUp && (
            <div className="mb-8 px-6 py-2 bg-yellow-500 text-slate-900 font-bold rounded-full shadow-lg animate-bounce text-sm border-2 border-yellow-300 select-none">
                Użyj przedmiotu na probówce
            </div>
        )}

        <div className="flex flex-wrap justify-center items-end gap-4 sm:gap-6 max-w-4xl mb-8">
          {tubes.map((tube, idx) => {
             const topBall = tube.balls[tube.balls.length - 1];
             let isHighlighted = false;
             if (activePowerUp === 'swap' && swapSourceIndex === idx) isHighlighted = true;
             
             // Highlight targets when source selected
             let isTarget = false;
             if (!activePowerUp && selectedTubeIndex !== null && selectedTubeIndex !== idx) {
                 isTarget = canMove(tubes[selectedTubeIndex], tube).can;
             }

             return (
                <Tube
                  key={tube.id}
                  index={idx}
                  domId={`tube-${idx}`}
                  tube={tube}
                  isSelected={selectedTubeIndex === idx || isHighlighted}
                  ghostBallId={null}
                  isTargetCandidate={isTarget}
                  isVictory={isLevelComplete}
                  onClick={() => handleTubeClick(idx)}
                />
             );
          })}
        </div>
        
        <style dangerouslySetInnerHTML={{__html: `
            @keyframes shake {
                0% { transform: translate(1px, 1px) rotate(0deg); } 100% { transform: translate(1px, -2px) rotate(-1deg); }
            }
            .animate-shake { animation: shake 0.3s cubic-bezier(.36,.07,.19,.97) both; }
            .animate-spin-slow { animation: spin 8s linear infinite; }
            .animate-pulse-slow { animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        `}} />

        {!isLevelComplete && (
          <div className="w-full max-w-lg mt-auto pb-4 select-none">
             <div className="text-center text-xs text-slate-500 mb-2 uppercase tracking-widest">Ekwipunek</div>
             {powerUpList.length > 0 ? (
                 <div className="flex gap-3 overflow-x-auto py-4 px-4 justify-start sm:justify-center items-center no-scrollbar mask-fade-sides bg-slate-800/20 rounded-xl">
                    {powerUpList.map(type => renderPowerUpButton(type))}
                 </div>
             ) : (
                 <div className="text-center p-4 text-slate-500 bg-slate-800/20 rounded-xl text-sm italic">
                    Pusto. Odwiedź sklep (🛒) w menu głównym!
                 </div>
             )}
          </div>
        )}
      </div>

      {showVictoryModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-500 animate-[fadeIn_0.5s]">
          <div className="bg-slate-800 border border-yellow-500/50 p-8 rounded-2xl shadow-2xl text-center max-w-sm w-full relative overflow-hidden">
             {/* Modal confetti */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="confetti-piece bg-red-500 left-10 delay-100"></div>
                <div className="confetti-piece bg-blue-500 right-10 delay-300"></div>
            </div>

            <h2 className="text-3xl font-bold text-yellow-400 mb-2 relative z-10">ŚWIETNIE!</h2>
            <div className="flex justify-center gap-2 mb-4 relative z-10">
              {[1, 2, 3].map(s => (
                <svg key={s} className={`w-10 h-10 ${s <= stars ? 'text-yellow-400 fill-current drop-shadow-lg' : 'text-slate-600'}`} viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
              ))}
            </div>
            
            <div className="flex items-center justify-center gap-2 text-xl font-bold text-yellow-300 mb-2 bg-slate-900/50 py-2 rounded-lg relative z-10">
                <span>+{earnedCoins}</span>
                <span className="text-2xl">🪙</span>
            </div>
            
            {bossReward && (
                <div className="mb-4 bg-red-900/50 border border-red-500 p-2 rounded-lg animate-pulse relative z-10">
                    <div className="text-xs text-red-300 font-bold uppercase mb-1">Nagroda za Bossa</div>
                    <div className="flex justify-center gap-4 text-sm font-bold">
                        <span className="text-yellow-300">+{bossReward.coins} 🪙</span>
                        <span className="text-purple-300">+{bossReward.stars} ★</span>
                    </div>
                </div>
            )}

            <button onClick={onExit} className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:scale-105 transition-transform relative z-10">KONTYNUUJ</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameScreen;