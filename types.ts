
export type BallEffect = 'normal' | 'stone' | 'ice' | 'joker' | 'lock' | 'key' | 'virus' | 'concrete' | 'artifact';

export interface Ball {
  id: string;
  color: string;
  isHidden: boolean; 
  effect?: BallEffect;
  isCracked?: boolean; // For ice - true when fully broken
  iceClicks?: number; // 0 to 3, tracks progress of breaking ice
}

export interface Tube {
  id: number;
  balls: Ball[];
  capacity: number; 
}

export interface LevelConfig {
  id: number;
  tubeCount: number;
  colorCount: number;
  emptyTubes: number;
  hiddenDepth: number;
}

export interface LabItem {
  id: string;
  name: Record<Language, string>;
  cost: number; // In stars
  icon: string;
  category: 'furniture' | 'equipment' | 'decor';
  unlocked: boolean;
  bonus?: { type: 'coin_multiplier', value: number }; 
}

export interface Pet {
  id: string;
  name: Record<Language, string>;
  description: Record<Language, string>;
  cost: number; // In stars
  icon: string;
  abilityId: 'destroy_stone' | 'reveal_hidden' | 'sort_one';
  cooldownLevel: boolean; // true = once per level
}

export interface Artifact {
    id: string;
    title: Record<Language, string>;
    description: Record<Language, string>; 
    icon: string;
}

export interface Boss {
    level: number;
    name: Record<Language, string>;
    title: Record<Language, string>;
    description: Record<Language, string>;
    icon: string;
    reward: { coins: number; stars: number };
}

export interface Achievement {
  id: string;
  title: Record<Language, string>;
  description: Record<Language, string>;
  target: number;
  reward: { type: 'coins' | 'stars', amount: number };
  icon: string;
  category: 'progress' | 'mechanic' | 'skill' | 'collection';
}

export type Language = 'en' | 'pl';

export interface UserProgress {
  language: Language;
  unlockedLevel: number;
  stars: Record<number, number>;
  scores: Record<number, number>; 
  times: Record<number, number>; 
  coins: number;
  inventory: Record<string, number>; 
  spentStars: number; 
  labItems: string[]; 
  unlockedPets: string[];
  activePetId: string | null;
  petLevels: Record<string, number>; 
  prestigeLevel: number; 
  artifacts: string[]; 
  lastDailySpin: number; 
  achievementsProgress: Record<string, number>;
  achievementsClaimed: Record<string, boolean>;
}

export type ViewState = 'MENU' | 'MAP' | 'GAME' | 'LEADERBOARD' | 'RULES' | 'SHOP' | 'LAB' | 'ACHIEVEMENTS' | 'ADVENTURE';

export type PowerUpType = 
  | 'undo' 
  | 'wand' 
  | 'pickaxe' 
  | 'flame' 
  | 'xray' 
  | 'hammer' 
  | 'paint' 
  | 'magnet' 
  | 'swap' 
  | 'pocket';

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
  '#9ca3af', // Concrete Gray
];

export const MAX_LEVELS = 100;
export const TEST_LEVEL_ID = 999;
// Added missing TUBE_CAPACITY constant required by gameLogic.ts and GameScreen.tsx
export const TUBE_CAPACITY = 4;

export const POWERUP_COSTS: Record<PowerUpType, number> = {
  undo: 50, wand: 150, pickaxe: 100, flame: 100, xray: 120, hammer: 80, paint: 120, magnet: 200, swap: 150, pocket: 250
};

export const POWERUP_UNLOCK_REQUIREMENTS: Record<PowerUpType, string | null> = {
    undo: null, hammer: 'desk', wand: 'poster', pickaxe: 'plant', flame: 'lamp', xray: 'microscope', paint: 'shelf', magnet: 'robot', swap: 'rug', pocket: 'coffee'
};

export const LAB_ITEMS_DATA: LabItem[] = [
  { id: 'poster', name: { en: 'Einstein Poster', pl: 'Plakat Einsteina' }, cost: 5, icon: '📜', category: 'decor', unlocked: false, bonus: { type: 'coin_multiplier', value: 0.02 } },
  { id: 'plant', name: { en: 'Potted Plant', pl: 'Roślina Doniczkowa' }, cost: 8, icon: '🪴', category: 'decor', unlocked: false, bonus: { type: 'coin_multiplier', value: 0.03 } },
  { id: 'rug', name: { en: 'Persian Rug', pl: 'Dywan Perski' }, cost: 12, icon: '🧶', category: 'decor', unlocked: false, bonus: { type: 'coin_multiplier', value: 0.04 } },
  { id: 'desk', name: { en: 'Research Desk', pl: 'Biurko Badawcze' }, cost: 15, icon: '🖥️', category: 'furniture', unlocked: false, bonus: { type: 'coin_multiplier', value: 0.05 } },
  { id: 'lamp', name: { en: 'Lava Lamp', pl: 'Lampa Lava' }, cost: 18, icon: '💡', category: 'furniture', unlocked: false, bonus: { type: 'coin_multiplier', value: 0.06 } },
  { id: 'coffee', name: { en: 'Coffee Machine', pl: 'Ekspres do Kawy' }, cost: 25, icon: '☕', category: 'furniture', unlocked: false, bonus: { type: 'coin_multiplier', value: 0.08 } },
  { id: 'whiteboard', name: { en: 'Whiteboard', pl: 'Tablica Kredowa' }, cost: 30, icon: '📋', category: 'furniture', unlocked: false, bonus: { type: 'coin_multiplier', value: 0.08 } },
  { id: 'shelf', name: { en: 'Reagent Shelf', pl: 'Regał z Odczynnikami' }, cost: 40, icon: '🧪', category: 'furniture', unlocked: false, bonus: { type: 'coin_multiplier', value: 0.10 } },
  { id: 'microscope', name: { en: 'Microscope', pl: 'Mikroskop' }, cost: 50, icon: '🔬', category: 'equipment', unlocked: false, bonus: { type: 'coin_multiplier', value: 0.12 } },
  { id: 'telescope', name: { en: 'Telescope', pl: 'Teleskop' }, cost: 65, icon: '🔭', category: 'equipment', unlocked: false, bonus: { type: 'coin_multiplier', value: 0.15 } },
  { id: 'robot', name: { en: 'Robot Assistant', pl: 'Asystent Robocik' }, cost: 80, icon: '🤖', category: 'equipment', unlocked: false, bonus: { type: 'coin_multiplier', value: 0.18 } },
  { id: 'mainframe', name: { en: 'Server Room', pl: 'Serwerownia' }, cost: 120, icon: '💾', category: 'equipment', unlocked: false, bonus: { type: 'coin_multiplier', value: 0.25 } },
  { id: 'hologram', name: { en: 'Ball Hologram', pl: 'Hologram Kuli' }, cost: 200, icon: '🌀', category: 'equipment', unlocked: false, bonus: { type: 'coin_multiplier', value: 0.35 } },
];

export const PETS_DATA: Pet[] = [
    { id: 'bot_alpha', name: { en: 'Bot Alpha', pl: 'Bot Alpha' }, description: { en: 'Destroys stones (Lv1: 1, Lv2: 2, Lv3: 3)', pl: 'Niszczy kamienie (Lv1: 1szt, Lv2: 2szt, Lv3: 3szt)' }, cost: 25, icon: '🤖', abilityId: 'destroy_stone', cooldownLevel: true },
    { id: 'bat_sonar', name: { en: 'Sonar Bat', pl: 'Nietoperz Sonar' }, description: { en: 'Reveals hidden balls (Lv2: +Coins, Lv3: Level Reset)', pl: 'Odsłania ukryte kulki (Lv2: +Monety, Lv3: Reset Poziomu)' }, cost: 20, icon: '🦇', abilityId: 'reveal_hidden', cooldownLevel: true },
    { id: 'slime_sort', name: { en: 'Slimey', pl: 'Glutek' }, description: { en: 'Sorts balls (Lv1: 1 layer, Lv2: 2 layers)', pl: 'Sortuje kulki (Lv1: 1 warstwa, Lv2: 2 warstwy)' }, cost: 45, icon: '🦠', abilityId: 'sort_one', cooldownLevel: true },
];

export const ARTIFACTS_DATA: Artifact[] = [
    { id: 'art_blueprint', title: { en: 'Reactor Blueprint', pl: 'Schemat Reaktora' }, description: { en: 'A torn drawing of a machine turning glass to gold.', pl: 'Podarty rysunek przedstawiający maszynę zamieniającą szkło w złoto.' }, icon: '📜' },
    { id: 'art_goggles', title: { en: 'Cracked Goggles', pl: 'Pęknięte Gogle' }, description: { en: 'Safety glasses covered in strange purple residue.', pl: 'Okulary ochronne pokryte dziwnym, fioletowym osadem.' }, icon: '🥽' },
    { id: 'art_vial', title: { en: 'Vial of Immortality', pl: 'Fiolka Nieśmiertelności' }, description: { en: 'Empty bottle labeled "Sample 001 - DO NOT OPEN".', pl: 'Pusta buteleczka z etykietą "Próbka 001 - NIE OTWIERAĆ".' }, icon: '🧪' },
    { id: 'art_keycard', title: { en: 'Access Card', pl: 'Karta Dostępu' }, description: { en: 'Magnetic card for "Level -1". What lies there?', pl: 'Plastikowa karta magnetyczna do "Poziomu -1". Kto wie, co tam jest?' }, icon: '💳' },
    { id: 'art_photo', title: { en: 'Old Photo', pl: 'Stare Zdjęcie' }, description: { en: 'A photo of Mr. Ball and the Mad Scientist shaking hands.', pl: 'Fotografia przedstawiająca Pana Kulkę i Szalonego Naukowca podających sobie ręce.' }, icon: '📸' },
];

export const BOSSES_DATA: Boss[] = [
    { level: 10, name: { en: 'Mad Intern', pl: 'Szalony Stażysta' }, title: { en: 'Beginner Chemist', pl: 'Początkujący Chemik' }, description: { en: 'Mixes tubes because he confuses reagents.', pl: 'Miesza probówki, bo myli odczynniki.' }, icon: '🤓', reward: { coins: 200, stars: 3 } },
    { level: 20, name: { en: 'Mutant Rat', pl: 'Zmutowany Szczur' }, title: { en: 'Lab Escapee', pl: 'Uciekinier z Labu' }, description: { en: 'Runs around the table knocking over tubes.', pl: 'Biega po stole i przewraca probówki.' }, icon: '🐀', reward: { coins: 300, stars: 5 } },
    { level: 30, name: { en: 'Guardian B-0T', pl: 'Strażnik B-0T' }, title: { en: 'Security System', pl: 'System Bezpieczeństwa' }, description: { en: 'Blocks balls with locks, claiming protocol breach.', pl: 'Blokuje kulki kłódkami, twierdząc że to naruszenie protokołu.' }, icon: '🤖', reward: { coins: 400, stars: 7 } },
    { level: 40, name: { en: 'Alchemist', pl: 'Alchemik' }, title: { en: 'Gold Seeker', pl: 'Poszukiwacz Złota' }, description: { en: 'Tries to turn everything into stone.', pl: 'Próbuje zamienić wszystko w kamień.' }, icon: '🧙‍♂️', reward: { coins: 500, stars: 10 } },
    { level: 50, name: { en: 'Professor Chaos', pl: 'Profesor Chaos' }, title: { en: 'Project Manager', pl: 'Kierownik Projektu' }, description: { en: 'His motto is "More concrete!". Literally.', pl: 'Jego motto to "Więcej betonu!".' }, icon: '👨‍🔬', reward: { coins: 750, stars: 15 } },
    { level: 60, name: { en: 'Frost Master', pl: 'Mistrz Mrozu' }, title: { en: 'A/C Failure', pl: 'Awaria Klimatyzacji' }, description: { en: 'Freezes balls because he likes cold drinks.', pl: 'Zamraża kulki, bo lubi zimne napoje.' }, icon: '🥶', reward: { coins: 1000, stars: 20 } },
    { level: 70, name: { en: 'Stone Golem', pl: 'Kamienny Golem' }, title: { en: 'Geo Experiment', pl: 'Eksperyment Geo' }, description: { en: 'Tough opponent. Drops boulders into tubes.', pl: 'Twardy przeciwnik. Wrzuca głazy do probówek.' }, icon: '🗿', reward: { coins: 1250, stars: 25 } },
    { level: 80, name: { en: 'Virus Queen', pl: 'Królowa Wirusów' }, title: { en: 'Biohazard', pl: 'Biologiczne Zagrożenie' }, description: { en: 'Spreads infection at a terrifying pace.', pl: 'Rozprzestrzenia infekcję w zastraszającym tempie.' }, icon: '🦠', reward: { coins: 1500, stars: 30 } },
    { level: 90, name: { en: 'Time Warden', pl: 'Strażnik Czasu' }, title: { en: 'Temporal Anomaly', pl: 'Anomalia Temporalna' }, description: { en: 'Mixes with history. May reset your sorting.', pl: 'Miesza w historii. Może cofnąć Twoje postępy.' }, icon: '⏳', reward: { coins: 2000, stars: 40 } },
    { level: 100, name: { en: 'Dr. Ball', pl: 'Dr. Kulka' }, title: { en: 'Arch-Nemesis', pl: 'Arcy-Nemesis' }, description: { en: 'Your evil twin. Has all previous powers.', pl: 'Twój zły bliźniak. Posiada wszystkie moce.' }, icon: '🦹', reward: { coins: 5000, stars: 100 } },
];

export const ACHIEVEMENTS_DATA: Achievement[] = [
  { id: 'lvl_5', title: { en: 'Beginner', pl: 'Początkujący' }, description: { en: 'Complete 5 levels', pl: 'Ukończ 5 poziomów' }, target: 5, reward: { type: 'coins', amount: 100 }, icon: '🥉', category: 'progress' },
  { id: 'lvl_10', title: { en: 'Amateur', pl: 'Amator' }, description: { en: 'Complete 10 levels', pl: 'Ukończ 10 poziomów' }, target: 10, reward: { type: 'coins', amount: 200 }, icon: '🥈', category: 'progress' },
  { id: 'lvl_20', title: { en: 'Advanced', pl: 'Zaawansowany' }, description: { en: 'Complete 20 levels', pl: 'Ukończ 20 poziomów' }, target: 20, reward: { type: 'stars', amount: 5 }, icon: '🥇', category: 'progress' },
  { id: 'lvl_30', title: { en: 'Expert', pl: 'Ekspert' }, description: { en: 'Complete 30 levels', pl: 'Ukończ 30 poziomów' }, target: 30, reward: { type: 'stars', amount: 10 }, icon: '🏆', category: 'progress' },
  { id: 'lvl_40', title: { en: 'Ball Master', pl: 'Mistrz Kulek' }, description: { en: 'Complete 40 levels', pl: 'Ukończ 40 poziomów' }, target: 40, reward: { type: 'stars', amount: 20 }, icon: '👑', category: 'progress' },
  { id: 'lvl_50', title: { en: 'Veteran', pl: 'Weteran' }, description: { en: 'Complete 50 levels', pl: 'Ukończ 50 poziomów' }, target: 50, reward: { type: 'coins', amount: 1000 }, icon: '🎖️', category: 'progress' },
  { id: 'lvl_100', title: { en: 'LEGEND', pl: 'LEGENDA' }, description: { en: 'Complete all 100 levels!', pl: 'Ukończ wszystkie 100 poziomów!' }, target: 100, reward: { type: 'stars', amount: 50 }, icon: '🔱', category: 'progress' },
];
