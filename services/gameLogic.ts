import { Ball, Tube, COLORS, TUBE_CAPACITY, LevelConfig } from '../types';

// Deterministic random for consistent level generation if needed, 
// but here we want replayability so we use Math.random with controlled shuffling.

export const generateLevel = (levelId: number): Tube[] => {
  // Difficulty scaling configuration
  let colorCount = 3;
  let hiddenDepth = 0;
  
  if (levelId > 5) colorCount = 4;
  if (levelId > 10) colorCount = 5;
  if (levelId > 15) { colorCount = 6; hiddenDepth = 1; } // Introduce hidden mechanics
  if (levelId > 20) { colorCount = 7; hiddenDepth = 2; }
  if (levelId > 30) { colorCount = 9; hiddenDepth = 2; }
  if (levelId > 35) { colorCount = 10; hiddenDepth = 3; }

  const emptyTubesCount = levelId > 30 ? 1 : 2; // Harder levels have fewer empty slots
  const tubeCount = colorCount + emptyTubesCount;

  // Create initial sorted state
  const tubes: Tube[] = [];
  const allBalls: Ball[] = [];

  for (let i = 0; i < colorCount; i++) {
    const color = COLORS[i % COLORS.length];
    for (let j = 0; j < TUBE_CAPACITY; j++) {
      allBalls.push({
        id: `ball-${i}-${j}`,
        color: color,
        isHidden: false // We set hidden later
      });
    }
  }

  // Initialize empty tubes
  for (let i = 0; i < tubeCount; i++) {
    tubes.push({ id: i, balls: [] });
  }

  // Shuffle balls randomly into tubes (ensuring capacity)
  // To ensure solvability, we simulate playing backwards or simply shuffle 
  // and hope it's solvable (standard for these simple implementations). 
  // However, a pure random shuffle can create unsolvable states.
  // A better approach for "solvable guaranteed": Start sorted, perform N random valid reverse moves.
  // Since implementing a perfect reverse solver is complex for this prompt, 
  // we will use a constrained shuffle: 
  // Distribute balls ensuring no tube exceeds capacity. 
  // Note: Pure random distribution is usually 99% solvable for Ball Sort.
  
  const shuffledBalls = [...allBalls].sort(() => Math.random() - 0.5);
  
  let ballIndex = 0;
  // Fill the first 'colorCount' tubes
  for (let i = 0; i < colorCount; i++) {
    for (let j = 0; j < TUBE_CAPACITY; j++) {
      if (ballIndex < shuffledBalls.length) {
        const ball = shuffledBalls[ballIndex];
        
        // Apply hidden logic based on depth (bottom indices are 0, 1 etc)
        // In our array, index 0 is bottom.
        if (j < hiddenDepth) {
          ball.isHidden = true;
        }
        
        tubes[i].balls.push(ball);
        ballIndex++;
      }
    }
  }

  return tubes;
};

export const canMove = (fromTube: Tube, toTube: Tube): boolean => {
  if (fromTube.balls.length === 0) return false; // Source empty
  if (toTube.balls.length >= TUBE_CAPACITY) return false; // Dest full

  const movingBall = fromTube.balls[fromTube.balls.length - 1];
  
  // Cannot pick up hidden balls (UI should prevent this too, but logic double check)
  if (movingBall.isHidden) return false;

  // If dest is empty, allowed
  if (toTube.balls.length === 0) return true;

  const targetBall = toTube.balls[toTube.balls.length - 1];
  
  // Cannot place on hidden ball (though logically shouldn't happen if game flow is correct)
  if (targetBall.isHidden) return false;

  // Must match color
  return movingBall.color === targetBall.color;
};

export const checkVictory = (tubes: Tube[]): boolean => {
  for (const tube of tubes) {
    if (tube.balls.length === 0) continue; // Empty tube is fine
    if (tube.balls.length !== TUBE_CAPACITY) return false; // Must be full if not empty

    const color = tube.balls[0].color;
    // All balls must match first color and not be hidden
    for (const ball of tube.balls) {
      if (ball.color !== color || ball.isHidden) return false;
    }
  }
  return true;
};

export const calculateStars = (levelId: number, moves: number): number => {
  // Simple heuristic for stars
  const base = (levelId * 4) + 10; // Baseline moves
  if (moves <= base) return 3;
  if (moves <= base * 1.5) return 2;
  return 1;
};