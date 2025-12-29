import { UserProgress } from '../types';

const STORAGE_KEY = 'kulki_game_progress';

const INITIAL_PROGRESS: UserProgress = {
  unlockedLevel: 1,
  stars: {},
  scores: {}
};

export const getProgress = (): UserProgress => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error("Failed to load progress", e);
  }
  return INITIAL_PROGRESS;
};

export const saveProgress = (progress: UserProgress) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (e) {
    console.error("Failed to save progress", e);
  }
};

export const completeLevel = (levelId: number, moves: number, stars: number) => {
  const current = getProgress();
  
  // Update unlocked level
  if (levelId === current.unlockedLevel && levelId < 40) {
    current.unlockedLevel = levelId + 1;
  }

  // Update stars if better
  const currentStars = current.stars[levelId] || 0;
  if (stars > currentStars) {
    current.stars[levelId] = stars;
  }

  // Update score (moves) if better (lower is better) or not exists
  const currentScore = current.scores[levelId];
  if (currentScore === undefined || moves < currentScore) {
    current.scores[levelId] = moves;
  }

  saveProgress(current);
  return current;
};