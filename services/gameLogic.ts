import { Ball, Tube, COLORS, TUBE_CAPACITY, BallEffect, TEST_LEVEL_ID, PowerUpType } from '../types';
import { getProgress } from './storage';

export const ALL_POWERUPS: PowerUpType[] = [
  'undo', 'wand', 'pickaxe', 'flame', 'xray', 
  'hammer', 'paint', 'magnet', 'swap', 'pocket'
];

export const getRandomPowerUps = (count: number): PowerUpType[] => {
  const shuffled = [...ALL_POWERUPS].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const generateTestLevel = (): Tube[] => {
  const R = COLORS[0];
  const B = COLORS[1];
  const G = COLORS[2];
  const Y = COLORS[3];

  const createBall = (color: string, effect: BallEffect = 'normal', isHidden = false): Ball => ({
    id: `test-${Math.random().toString(36).substr(2, 9)}`,
    color,
    isHidden,
    effect,
    iceClicks: effect === 'ice' ? 0 : undefined,
    isCracked: false
  });

  return [
    { id: 0, capacity: 4, balls: [createBall(R, 'lock')] },
    { id: 1, capacity: 4, balls: [createBall(R, 'key'), createBall(R), createBall(R)] },
    { id: 2, capacity: 2, balls: [createBall(B), createBall(B)] }, // Small tube
    { id: 3, capacity: 6, balls: [createBall(B), createBall(Y), createBall(Y, 'virus')] }, // Large tube, virus
    { id: 4, capacity: 4, balls: [createBall(G, 'normal', true), createBall(G, 'normal', true)] },
    { id: 5, capacity: 4, balls: [] },
    { id: 6, capacity: 4, balls: [] }
  ];
};

export const generateLevel = (levelId: number): Tube[] => {
  if (levelId === TEST_LEVEL_ID) {
    return generateTestLevel();
  }

  let colorCount = 3;
  let hiddenDepth = 0;
  let specialChance = 0;
  // New mechanics chances
  let virusChance = 0;
  let lockKeyChance = 0;
  let mixedCapacity = false;
  let artifactChance = 0.05; // 5% chance per level to contain an artifact

  // --- PROGRESSION CURVE (Levels 1-100) ---
  if (levelId > 5) { colorCount = 4; specialChance = 0.05; }
  if (levelId > 10) { colorCount = 5; mixedCapacity = true; }
  if (levelId > 15) { colorCount = 6; hiddenDepth = 1; specialChance = 0.1; lockKeyChance = 0.2; }
  if (levelId > 20) { colorCount = 7; hiddenDepth = 2; specialChance = 0.1; virusChance = 0.1; }
  if (levelId > 30) { colorCount = 9; hiddenDepth = 2; specialChance = 0.15; }
  if (levelId > 35) { colorCount = 10; hiddenDepth = 3; specialChance = 0.2; }
  
  // Extended Levels
  if (levelId > 45) { colorCount = 10; hiddenDepth = 3; specialChance = 0.22; lockKeyChance = 0.3; }
  if (levelId > 60) { colorCount = 11; hiddenDepth = 4; specialChance = 0.25; virusChance = 0.2; }
  if (levelId > 80) { colorCount = 12; hiddenDepth = 4; specialChance = 0.30; mixedCapacity = true; }

  // Ensure we don't exceed available colors (12 colors + 1 concrete)
  // Indices 0-11 are safe colors.
  if (colorCount > 12) colorCount = 12;

  const emptyTubesCount = levelId > 60 ? 2 : (levelId > 30 ? 1 : 2);
  const tubeCount = colorCount + emptyTubesCount;

  // 1. Generate Balls
  const allBalls: Ball[] = [];
  let artifactPlaced = false;

  for (let i = 0; i < colorCount; i++) {
    const color = COLORS[i % COLORS.length];
    for (let j = 0; j < TUBE_CAPACITY; j++) {
      let effect: BallEffect = 'normal';
      
      // Attempt Artifact placement (max 1 per level, rare)
      if (!artifactPlaced && Math.random() < artifactChance) {
          effect = 'artifact';
          artifactPlaced = true;
      } else if (Math.random() < specialChance) {
        const rand = Math.random();
        if (rand < 0.3) effect = 'stone';
        else if (rand < 0.6) effect = 'ice';
        else if (rand < 0.8 && virusChance > 0) effect = 'virus';
        else effect = 'joker';
      }

      allBalls.push({
        id: `ball-${i}-${j}-${Math.random().toString(36).substr(2, 9)}`,
        color: color,
        isHidden: false,
        effect,
        iceClicks: effect === 'ice' ? 0 : undefined,
        isCracked: false
      });
    }
  }

  // 2. Handle Lock/Key Logic (Pairs)
  if (Math.random() < lockKeyChance && allBalls.length > 8) {
      const normalIndices = allBalls.map((b, i) => b.effect === 'normal' ? i : -1).filter(i => i !== -1);
      if (normalIndices.length >= 2) {
          const idx1 = normalIndices[Math.floor(Math.random() * normalIndices.length)];
          const idx2 = normalIndices[Math.floor(Math.random() * normalIndices.length)]; 
          if (idx1 !== idx2) {
              allBalls[idx1].effect = 'lock';
              allBalls[idx2].effect = 'key';
              allBalls[idx2].color = allBalls[idx1].color; 
          }
      }
  }

  // 3. Prepare Tubes with Capacities
  const tubes: Tube[] = [];
  for (let i = 0; i < tubeCount; i++) {
      let cap = TUBE_CAPACITY;
      if (mixedCapacity) {
          const r = Math.random();
          if (r < 0.15) cap = 2; // Tight tube
          else if (r < 0.3) cap = 5; // Large tube
          else if (r < 0.35) cap = 6; // Extra large
      }
      tubes.push({ id: i, balls: [], capacity: cap });
  }

  const shuffledBalls = [...allBalls].sort(() => Math.random() - 0.5);
  
  // 4. Distribute Balls respecting capacity
  const fillingTubesCount = tubeCount - emptyTubesCount;
  let fillingCapacity = 0;
  
  for(let i = 0; i < fillingTubesCount; i++) {
      fillingCapacity += tubes[i].capacity;
  }
  
  if (fillingCapacity < shuffledBalls.length) {
      let needed = shuffledBalls.length - fillingCapacity;
      let tIdx = 0;
      while(needed > 0) {
          if (tubes[tIdx].capacity < 6) {
              tubes[tIdx].capacity++;
              needed--;
          }
          tIdx = (tIdx + 1) % fillingTubesCount;
          if (tubes.every((t, i) => i >= fillingTubesCount || t.capacity >= 6) && needed > 0) {
              break; 
          }
      }
  }

  let ballIndex = 0;
  let safetyCounter = 0;

  while (ballIndex < shuffledBalls.length) {
      safetyCounter++;
      if (safetyCounter > 2000) {
          console.warn("Level generation safety break triggered");
          break;
      }

      for (let i = 0; i < tubes.length; i++) {
          if (ballIndex >= shuffledBalls.length) break;
          if (i >= fillingTubesCount) continue; 

          if (tubes[i].balls.length < tubes[i].capacity) {
              const ball = shuffledBalls[ballIndex];
              // Apply hidden depth based on row index (approximate)
              if (tubes[i].balls.length < hiddenDepth) ball.isHidden = true;
              
              tubes[i].balls.push(ball);
              ballIndex++;
          }
      }
  }

  // 5. POST-PROCESSING: Validate Stone Positions
  for (let t = 0; t < tubes.length; t++) {
      const tube = tubes[t];
      for (let b = 0; b < tube.balls.length; b++) {
          const ball = tube.balls[b];
          if (ball.effect === 'stone') {
              const maxAllowedIndex = tube.capacity - 4;
              if (maxAllowedIndex < 0 || b > maxAllowedIndex) {
                  let swapped = false;
                  for (let otherT = 0; otherT < tubes.length; otherT++) {
                      if (swapped) break;
                      const candidateTube = tubes[otherT];
                      for (let otherB = 0; otherB <= Math.min(candidateTube.balls.length - 1, candidateTube.capacity - 4); otherB++) {
                          const candidateBall = candidateTube.balls[otherB];
                          if (candidateBall.effect === 'normal') {
                              tube.balls[b] = candidateBall;
                              candidateTube.balls[otherB] = ball;
                              swapped = true;
                              break;
                          }
                      }
                  }
                  if (!swapped) ball.effect = 'normal';
              }
          }
      }
  }
  return tubes;
};

export const getMovableStackSize = (tube: Tube): number => {
  if (tube.balls.length === 0) return 0;
  const balls = tube.balls;
  const topBall = balls[balls.length - 1];
  
  if (topBall.isHidden || topBall.effect === 'stone' || topBall.effect === 'lock' || (topBall.effect === 'ice' && !topBall.isCracked)) {
    return 0;
  }
  
  if (topBall.effect === 'ice' && topBall.isCracked) return 1;
  if (topBall.effect === 'key') return 1;

  let count = 1;
  const isJokerStack = topBall.effect === 'joker' || topBall.effect === 'artifact';

  for (let i = balls.length - 2; i >= 0; i--) {
    const b = balls[i];
    if (b.isHidden || b.effect === 'stone' || b.effect === 'ice' || b.effect === 'lock' || b.effect === 'key' || b.effect === 'virus') break;
    
    // Artifact behaves like Joker
    const matchesJoker = isJokerStack && (b.effect === 'joker' || b.effect === 'artifact');
    const matchesColor = !isJokerStack && b.color === topBall.color && b.effect === 'normal';

    if (matchesJoker || matchesColor) {
      count++;
    } else {
      break;
    }
  }
  return count;
};

export const canMove = (fromTube: Tube, toTube: Tube): { can: boolean; count: number } => {
  if (fromTube.balls.length === 0) return { can: false, count: 0 };
  
  const stackSize = getMovableStackSize(fromTube);
  if (stackSize === 0) return { can: false, count: 0 };

  const movingBall = fromTube.balls[fromTube.balls.length - 1];
  
  // Key Logic
  if (movingBall.effect === 'key') {
       if (toTube.balls.length > 0) {
           const targetBall = toTube.balls[toTube.balls.length - 1];
           if (targetBall.effect === 'lock') {
               if (movingBall.color === targetBall.color) {
                   return { can: true, count: 1 }; 
               }
           }
       }
  }

  // Capacity Check
  const maxCapacity = toTube.capacity;
  if (toTube.balls.length >= maxCapacity) return { can: false, count: 0 };

  const availableSpace = maxCapacity - toTube.balls.length;
  const actualMoveCount = Math.min(stackSize, availableSpace);

  if (toTube.balls.length === 0) return { can: true, count: actualMoveCount };

  const targetBall = toTube.balls[toTube.balls.length - 1];
  
  // Normal Match Logic
  if (targetBall.effect === 'stone' || targetBall.effect === 'lock' || (targetBall.effect === 'ice' && !targetBall.isCracked)) {
      return { can: false, count: 0 };
  }

  // Artifact & Joker Logic
  const isWildcard = (effect: BallEffect | undefined) => effect === 'joker' || effect === 'artifact';

  const isColorMatch = movingBall.color === targetBall.color || 
                       isWildcard(movingBall.effect) || 
                       isWildcard(targetBall.effect);

  return { can: isColorMatch, count: isColorMatch ? actualMoveCount : 0 };
};

export const checkVictory = (tubes: Tube[]): boolean => {
  // 1. Immediate Fail Checks (Blockers) & Purity Check
  for (const tube of tubes) {
    for (const ball of tube.balls) {
       if (ball.isHidden) return false;
       if (ball.effect === 'stone' || ball.effect === 'lock') return false;
       if (ball.effect === 'ice' && !ball.isCracked) return false;
    }
    
    // Check Color Purity
    if (tube.balls.length > 0) {
        const first = tube.balls.find(b => b.effect !== 'joker' && b.effect !== 'artifact');
        if (first) {
            const color = first.effect === 'concrete' ? 'concrete' : first.color;
            const isPure = tube.balls.every(b => {
                if (b.effect === 'joker' || b.effect === 'artifact') return true;
                const bCol = b.effect === 'concrete' ? 'concrete' : b.color;
                return bCol === color;
            });
            if (!isPure) return false;
        }
    }
  }

  const partialColorTubes: Record<string, number> = {}; 

  for (const tube of tubes) {
      if (tube.balls.length === 0) continue;
      if (tube.balls.length === tube.capacity) continue; // Full tubes are valid (archived)

      // Determine color of this partial tube
      const first = tube.balls.find(b => b.effect !== 'joker' && b.effect !== 'artifact');
      
      // If a tube is ALL jokers/artifacts
      let color = 'joker_stack';
      if (first) {
          color = first.effect === 'concrete' ? 'concrete' : first.color;
      }

      // If we already found a partial tube of this color, then the color is split -> Fail
      if (partialColorTubes[color]) return false;
      
      partialColorTubes[color] = 1;
  }
  
  const partials = Object.keys(partialColorTubes);
  if (partials.includes('joker_stack') && partials.length > 1) return false;

  return true;
};

export const calculateStars = (levelId: number, moves: number, timeInSeconds: number): number => {
  if (timeInSeconds < 60) return 3;
  if (timeInSeconds < 180) return 2;
  return 1;
};

export const shuffleTubes = (tubes: Tube[]): Tube[] => {
  const allBalls = tubes.flatMap(t => t.balls);
  const shuffled = [...allBalls].sort(() => Math.random() - 0.5);
  
  const newTubes = tubes.map(t => ({ ...t, balls: [] as Ball[] }));
  let ballIdx = 0;
  
  for(let i=0; i<newTubes.length; i++) {
      while(newTubes[i].balls.length < newTubes[i].capacity && ballIdx < shuffled.length) {
          newTubes[i].balls.push(shuffled[ballIdx]);
          ballIdx++;
      }
  }
  return newTubes;
};

// --- BOSS LOGIC ---

interface BossAction {
    type: 'SWAP_TUBES' | 'ADD_CONCRETE' | 'FREEZE_BALL';
    message: string;
}

export const executeBossSabotage = (currentTubes: Tube[]): { tubes: Tube[], action: BossAction } | null => {
    const tubes = JSON.parse(JSON.stringify(currentTubes)) as Tube[];
    const rand = Math.random();

    // 1. Swap Tubes (Chaos) - 40% chance
    if (rand < 0.4 && tubes.length >= 2) {
        const i1 = Math.floor(Math.random() * tubes.length);
        let i2 = Math.floor(Math.random() * tubes.length);
        while (i1 === i2) i2 = Math.floor(Math.random() * tubes.length);

        const temp = tubes[i1];
        tubes[i1] = tubes[i2];
        tubes[i2] = temp;
        
        return { 
            tubes, 
            action: { type: 'SWAP_TUBES', message: 'Mieszam probówki!' } 
        };
    }

    // 2. Add Concrete Ball (Trash) - 30% chance
    if (rand < 0.7) {
        // Find a tube with space
        const candidates = tubes.filter(t => t.balls.length < t.capacity);
        if (candidates.length > 0) {
            const target = candidates[Math.floor(Math.random() * candidates.length)];
            const concreteBall: Ball = {
                id: `concrete-${Date.now()}`,
                color: '#9ca3af', // Gray
                isHidden: false,
                effect: 'concrete'
            };
            // Need to find original tube ref in array
            const originalIndex = tubes.findIndex(t => t.id === target.id);
            tubes[originalIndex].balls.push(concreteBall);

            return {
                tubes,
                action: { type: 'ADD_CONCRETE', message: 'Masz tu trochę betonu!' }
            };
        }
    }

    // 3. Freeze Ball - 30% chance or fallback
    const freezeCandidates = [];
    tubes.forEach((t, tIdx) => {
        if (t.balls.length > 0) {
            const topBall = t.balls[t.balls.length - 1];
            if (topBall.effect !== 'ice' && topBall.effect !== 'stone' && topBall.effect !== 'lock') {
                freezeCandidates.push({ tIdx, ball: topBall });
            }
        }
    });

    if (freezeCandidates.length > 0) {
        const choice = freezeCandidates[Math.floor(Math.random() * freezeCandidates.length)];
        tubes[choice.tIdx].balls[tubes[choice.tIdx].balls.length - 1].effect = 'ice';
        tubes[choice.tIdx].balls[tubes[choice.tIdx].balls.length - 1].iceClicks = 0;
        tubes[choice.tIdx].balls[tubes[choice.tIdx].balls.length - 1].isCracked = false;

        return {
            tubes,
            action: { type: 'FREEZE_BALL', message: 'Zamarzaj!' }
        };
    }

    return null; // No sabotage possible
};

// --- SCALED PET LOGIC ---
export const executePetAbility = (tubes: Tube[], petId: string): { success: boolean, tubes: Tube[], message?: string } => {
    const progress = getProgress();
    const level = progress.petLevels[petId] || 1;
    let success = false;
    let newTubes = JSON.parse(JSON.stringify(tubes)) as Tube[];
    let message = "";

    if (petId === 'bot_alpha') {
        // Lv1: 1 stone, Lv2: 2 stones, Lv3: 3 stones
        let stonesToRemove = level;
        let removed = 0;
        
        // Find stones
        for (let t = 0; t < newTubes.length; t++) {
            if (stonesToRemove <= 0) break;
            const tube = newTubes[t];
            const stoneIndices = tube.balls.map((b, i) => b.effect === 'stone' ? i : -1).filter(i => i !== -1);
            
            // Remove from top down to avoid index shift issues (pop)
            for (let i = stoneIndices.length - 1; i >= 0; i--) {
                if (stonesToRemove <= 0) break;
                tube.balls.splice(stoneIndices[i], 1);
                stonesToRemove--;
                removed++;
            }
        }
        if (removed > 0) {
            success = true;
            message = `Zniszczono ${removed} kamieni!`;
        }
    } else if (petId === 'bat_sonar') {
        // Reveal hidden
        let revealed = 0;
        newTubes.forEach(t => t.balls.forEach(b => {
            if(b.isHidden) { b.isHidden = false; revealed++; }
        }));
        if (revealed > 0) {
            success = true;
            message = `Odkryto ${revealed} kulek!`;
        } else if (level >= 2) {
             // Fallback for Bat Level 2+: Grant coins if no hidden balls
             message = "Nic do odkrycia, ale nietoperz znalazł monetę!";
             // Coins added in UI logic or separate effect
             success = true; 
        }
    } else if (petId === 'slime_sort') {
        // Sort: Lv1 (1 layer), Lv2 (2 layers)
        let sorted = 0;
        // Simple logic: Change top ball to match 2nd ball
        for (const t of newTubes) {
            if (sorted >= level) break;
            if (t.balls.length >= 2) {
                const top = t.balls[t.balls.length - 1];
                const below = t.balls[t.balls.length - 2];
                if (!top.isHidden && !below.isHidden && top.color !== below.color && top.effect === 'normal' && below.effect === 'normal') {
                    top.color = below.color;
                    sorted++;
                }
            }
        }
        if (sorted > 0) {
            success = true;
            message = `Posortowano ${sorted} probówek!`;
        }
    }

    return { success, tubes: newTubes, message };
};
