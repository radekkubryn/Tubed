export interface Ball {
  id: string;
  color: string;
  isHidden: boolean; // For levels 16+
}

export interface Tube {
  id: number;
  balls: Ball[];
}

export interface LevelConfig {
  id: number;
  tubeCount: number;
  colorCount: number;
  emptyTubes: number;
  hiddenDepth: number; // How many balls from bottom are hidden
}

export interface UserProgress {
  unlockedLevel: number; // 1 to 40
  stars: Record<number, number>; // levelId -> stars (1-3)
  scores: Record<number, number>; // levelId -> moves count (lower is better)
}

export type ViewState = 'MENU' | 'MAP' | 'GAME' | 'LEADERBOARD';

export const COLORS = [
  '#ef4444', // Red
  '#3b82f6', // Blue
  '#22c55e', // Green
  '#eab308', // Yellow
  '#a855f7', // Purple
  '#ec4899', // Pink
  '#06b6d4', // Cyan
  '#f97316', // Orange
  '#6366f1', // Indigo
  '#14b8a6', // Teal
  '#84cc16', // Lime
  '#d946ef', // Fuchsia
];

export const TUBE_CAPACITY = 4;
export const MAX_LEVELS = 40;