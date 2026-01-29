
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
  capacity: number; // Now required, default 4
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
  name: string;
  cost: number; // In stars
  icon: string;
  category: 'furniture' | 'equipment' | 'decor';
  unlocked: boolean;
  bonus?: { type: 'coin_multiplier', value: number }; // Passive bonus
}

export interface Pet {
  id: string;
  name: string;
  description: string;
  cost: number; // In stars
  icon: string;
  abilityId: 'destroy_stone' | 'reveal_hidden' | 'sort_one';
  cooldownLevel: boolean; // true = once per level
}

export interface Artifact {
    id: string;
    title: string;
    description: string; // Lore text
    icon: string;
}

export interface Boss {
    level: number;
    name: string;
    title: string;
    description: string;
    icon: string;
    reward: { coins: number; stars: number };
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  target: number;
  reward: { type: 'coins' | 'stars', amount: number };
  icon: string;
  category: 'progress' | 'mechanic' | 'skill' | 'collection';
}

export interface UserProgress {
  unlockedLevel: number;
  stars: Record<number, number>;
  scores: Record<number, number>; // Moves
  times: Record<number, number>; // Best times in seconds
  coins: number;
  inventory: Record<string, number>; // powerUpId -> count
  spentStars: number; // Stars spent in Lab
  labItems: string[]; // IDs of unlocked lab items
  // Pets
  unlockedPets: string[];
  activePetId: string | null;
  petLevels: Record<string, number>; // NEW: Pet ID -> Level (1, 2, 3)
  // Prestige
  prestigeLevel: number; // NEW: 0 = normal, 1+ = New Game+
  // Artifacts
  artifacts: string[]; // NEW: IDs of collected artifacts
  // Wheel
  lastDailySpin: number; // NEW: Timestamp
  
  // Achievements progress: ID -> current value
  achievementsProgress: Record<string, number>;
  // Achievements claimed: ID -> boolean
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
  '#9ca3af', // Concrete Gray (Boss trash)
];

export const TUBE_CAPACITY = 4;
export const MAX_LEVELS = 100;
export const TEST_LEVEL_ID = 999;

export const POWERUP_COSTS: Record<PowerUpType, number> = {
  undo: 50,
  wand: 150,
  pickaxe: 100,
  flame: 100,
  xray: 120,
  hammer: 80,
  paint: 120,
  magnet: 200,
  swap: 150,
  pocket: 250
};

// Mapping: PowerUp ID -> Required Lab Item ID (null if no requirement)
export const POWERUP_UNLOCK_REQUIREMENTS: Record<PowerUpType, string | null> = {
    undo: null,              // Always available
    hammer: 'desk',          // Basic tool -> Desk
    wand: 'poster',          // Theory -> Magic
    pickaxe: 'plant',        // Nature -> Earth tool
    flame: 'lamp',           // Heat -> Fire
    xray: 'microscope',      // Optics -> Vision
    paint: 'shelf',          // Chemicals -> Paint
    magnet: 'robot',         // Tech -> Magnet
    swap: 'rug',             // Feng Shui -> Movement
    pocket: 'coffee'         // Caffeine -> Extra Energy/Space (Updated)
};

export const LAB_ITEMS_DATA: LabItem[] = [
  // Tier 1 (Basic)
  { id: 'poster', name: 'Plakat Einsteina', cost: 5, icon: '📜', category: 'decor', unlocked: false, bonus: { type: 'coin_multiplier', value: 0.02 } },
  { id: 'plant', name: 'Roślina Doniczkowa', cost: 8, icon: '🪴', category: 'decor', unlocked: false, bonus: { type: 'coin_multiplier', value: 0.03 } },
  { id: 'rug', name: 'Dywan Perski', cost: 12, icon: '🧶', category: 'decor', unlocked: false, bonus: { type: 'coin_multiplier', value: 0.04 } },
  
  // Tier 2 (Furniture)
  { id: 'desk', name: 'Biurko Badawcze', cost: 15, icon: '🖥️', category: 'furniture', unlocked: false, bonus: { type: 'coin_multiplier', value: 0.05 } },
  { id: 'lamp', name: 'Lampa Lava', cost: 18, icon: '💡', category: 'furniture', unlocked: false, bonus: { type: 'coin_multiplier', value: 0.06 } },
  { id: 'coffee', name: 'Ekspres do Kawy', cost: 25, icon: '☕', category: 'furniture', unlocked: false, bonus: { type: 'coin_multiplier', value: 0.08 } },
  { id: 'whiteboard', name: 'Tablica Kredowa', cost: 30, icon: '📋', category: 'furniture', unlocked: false, bonus: { type: 'coin_multiplier', value: 0.08 } },
  
  // Tier 3 (Equipment)
  { id: 'shelf', name: 'Regał z Odczynnikami', cost: 40, icon: '🧪', category: 'furniture', unlocked: false, bonus: { type: 'coin_multiplier', value: 0.10 } },
  { id: 'microscope', name: 'Mikroskop', cost: 50, icon: '🔬', category: 'equipment', unlocked: false, bonus: { type: 'coin_multiplier', value: 0.12 } },
  { id: 'telescope', name: 'Teleskop', cost: 65, icon: '🔭', category: 'equipment', unlocked: false, bonus: { type: 'coin_multiplier', value: 0.15 } },
  
  // Tier 4 (High Tech)
  { id: 'robot', name: 'Asystent Robocik', cost: 80, icon: '🤖', category: 'equipment', unlocked: false, bonus: { type: 'coin_multiplier', value: 0.18 } },
  { id: 'mainframe', name: 'Serwerownia', cost: 120, icon: '💾', category: 'equipment', unlocked: false, bonus: { type: 'coin_multiplier', value: 0.25 } },
  { id: 'hologram', name: 'Hologram Kuli', cost: 200, icon: '🌀', category: 'equipment', unlocked: false, bonus: { type: 'coin_multiplier', value: 0.35 } },
];

export const PETS_DATA: Pet[] = [
    { id: 'bot_alpha', name: 'Bot Alpha', description: 'Niszczy kamienie (Lv1: 1szt, Lv2: 2szt, Lv3: 3szt)', cost: 25, icon: '🤖', abilityId: 'destroy_stone', cooldownLevel: true },
    { id: 'bat_sonar', name: 'Nietoperz Sonar', description: 'Odsłania ukryte kulki (Lv2: +Monety, Lv3: Reset Poziomu)', cost: 20, icon: '🦇', abilityId: 'reveal_hidden', cooldownLevel: true },
    { id: 'slime_sort', name: 'Glutek', description: 'Sortuje kulki (Lv1: 1 warstwa, Lv2: 2 warstwy)', cost: 45, icon: '🦠', abilityId: 'sort_one', cooldownLevel: true },
];

export const ARTIFACTS_DATA: Artifact[] = [
    { id: 'art_blueprint', title: 'Schemat Reaktora', description: 'Podarty rysunek przedstawiający maszynę zamieniającą szkło w złoto. Podpisany inicjałami "Dr. K".', icon: '📜' },
    { id: 'art_goggles', title: 'Pęknięte Gogle', description: 'Okulary ochronne pokryte dziwnym, fioletowym osadem. Wciąż lekko promieniują.', icon: '🥽' },
    { id: 'art_vial', title: 'Fiolka Nieśmiertelności', description: 'Pusta buteleczka z etykietą "Próbka 001 - NIE OTWIERAĆ". Pachnie kawą.', icon: '🧪' },
    { id: 'art_keycard', title: 'Karta Dostępu', description: 'Plastikowa karta magnetyczna do "Poziomu -1". Kto wie, co tam jest?', icon: '💳' },
    { id: 'art_photo', title: 'Stare Zdjęcie', description: 'Fotografia przedstawiająca Pana Kulkę i Szalonego Naukowca podających sobie ręce. Data: 1999.', icon: '📸' },
];

export const BOSSES_DATA: Boss[] = [
    { level: 10, name: 'Szalony Stażysta', title: 'Początkujący Chemik', description: 'Miesza probówki, bo myli odczynniki. Niegroźny, ale irytujący.', icon: '🤓', reward: { coins: 200, stars: 3 } },
    { level: 20, name: 'Zmutowany Szczur', title: 'Uciekinier z Labu', description: 'Biega po stole i przewraca probówki. Czasem coś zje.', icon: '🐀', reward: { coins: 300, stars: 5 } },
    { level: 30, name: 'Strażnik B-0T', title: 'System Bezpieczeństwa', description: 'Blokuje kulki kłódkami, twierdząc że to naruszenie protokołu.', icon: '🤖', reward: { coins: 400, stars: 7 } },
    { level: 40, name: 'Alchemik', title: 'Poszukiwacz Złota', description: 'Próbuje zamienić wszystko w kamień. Uwaga na ciężkie kulki!', icon: '🧙‍♂️', reward: { coins: 500, stars: 10 } },
    { level: 50, name: 'Profesor Chaos', title: 'Kierownik Projektu', description: 'Jego motto to "Więcej betonu!". Dosłownie.', icon: '👨‍🔬', reward: { coins: 750, stars: 15 } },
    { level: 60, name: 'Mistrz Mrozu', title: 'Awaria Klimatyzacji', description: 'Zamraża kulki, bo lubi zimne napoje. Trzykrotne kliknięcie wymagane!', icon: '🥶', reward: { coins: 1000, stars: 20 } },
    { level: 70, name: 'Kamienny Golem', title: 'Eksperyment Geo', description: 'Twardy przeciwnik. Wrzuca głazy do probówek.', icon: '🗿', reward: { coins: 1250, stars: 25 } },
    { level: 80, name: 'Królowa Wirusów', title: 'Biologiczne Zagrożenie', description: 'Rozprzestrzenia infekcję w zastraszającym tempie.', icon: '🦠', reward: { coins: 1500, stars: 30 } },
    { level: 90, name: 'Strażnik Czasu', title: 'Anomalia Temporalna', description: 'Miesza w historii. Może cofnąć Twoje postępy w sortowaniu.', icon: '⏳', reward: { coins: 2000, stars: 40 } },
    { level: 100, name: 'Dr. Kulka', title: 'Arcy-Nemesis', description: 'Twój zły bliźniak. Posiada wszystkie moce poprzednich bossów.', icon: '🦹', reward: { coins: 5000, stars: 100 } },
];

export const ACHIEVEMENTS_DATA: Achievement[] = [
  // --- Progress ---
  { id: 'lvl_5', title: 'Początkujący', description: 'Ukończ 5 poziomów', target: 5, reward: { type: 'coins', amount: 100 }, icon: '🥉', category: 'progress' },
  { id: 'lvl_10', title: 'Amator', description: 'Ukończ 10 poziomów', target: 10, reward: { type: 'coins', amount: 200 }, icon: '🥈', category: 'progress' },
  { id: 'lvl_20', title: 'Zaawansowany', description: 'Ukończ 20 poziomów', target: 20, reward: { type: 'stars', amount: 5 }, icon: '🥇', category: 'progress' },
  { id: 'lvl_30', title: 'Ekspert', description: 'Ukończ 30 poziomów', target: 30, reward: { type: 'stars', amount: 10 }, icon: '🏆', category: 'progress' },
  { id: 'lvl_40', title: 'Mistrz Kulek', description: 'Ukończ 40 poziomów', target: 40, reward: { type: 'stars', amount: 20 }, icon: '👑', category: 'progress' },
  { id: 'lvl_50', title: 'Weteran', description: 'Ukończ 50 poziomów', target: 50, reward: { type: 'coins', amount: 1000 }, icon: '🎖️', category: 'progress' },
  { id: 'lvl_75', title: 'Mistrz Zen', description: 'Ukończ 75 poziomów', target: 75, reward: { type: 'stars', amount: 30 }, icon: '🧘', category: 'progress' },
  { id: 'lvl_100', title: 'LEGENDA', description: 'Ukończ wszystkie 100 poziomów!', target: 100, reward: { type: 'stars', amount: 50 }, icon: '🔱', category: 'progress' },
  
  // --- Mechanics (Ice, Stone, etc.) ---
  { id: 'ice_10', title: 'Lodołamacz I', description: 'Rozbij 10 lodowych kulek', target: 10, reward: { type: 'coins', amount: 50 }, icon: '❄️', category: 'mechanic' },
  { id: 'ice_50', title: 'Lodołamacz II', description: 'Rozbij 50 lodowych kulek', target: 50, reward: { type: 'coins', amount: 150 }, icon: '🌨️', category: 'mechanic' },
  { id: 'ice_100', title: 'Epoka Lodowcowa', description: 'Rozbij 100 lodowych kulek', target: 100, reward: { type: 'stars', amount: 3 }, icon: '⛄', category: 'mechanic' },
  
  { id: 'stone_10', title: 'Górnik I', description: 'Zniszcz 10 kamieni', target: 10, reward: { type: 'coins', amount: 50 }, icon: '⛏️', category: 'mechanic' },
  { id: 'stone_50', title: 'Górnik II', description: 'Zniszcz 50 kamieni', target: 50, reward: { type: 'coins', amount: 150 }, icon: '🏔️', category: 'mechanic' },
  { id: 'stone_100', title: 'Górnik III', description: 'Zniszcz 100 kamieni', target: 100, reward: { type: 'stars', amount: 5 }, icon: '🌋', category: 'mechanic' },
  
  { id: 'lock_5', title: 'Ślusarz I', description: 'Otwórz 5 kłódek', target: 5, reward: { type: 'coins', amount: 50 }, icon: '🔓', category: 'mechanic' },
  { id: 'lock_25', title: 'Ślusarz II', description: 'Otwórz 25 kłódek', target: 25, reward: { type: 'stars', amount: 2 }, icon: '🗝️', category: 'mechanic' },
  
  { id: 'virus_5', title: 'Epidemiolog I', description: 'Wylecz/zlikwiduj 5 wirusów', target: 5, reward: { type: 'coins', amount: 50 }, icon: '🦠', category: 'mechanic' },
  { id: 'virus_20', title: 'Epidemiolog II', description: 'Wylecz/zlikwiduj 20 wirusów', target: 20, reward: { type: 'stars', amount: 3 }, icon: '💉', category: 'mechanic' },

  { id: 'hidden_20', title: 'Odkrywca', description: 'Odsłoń 20 ukrytych kulek', target: 20, reward: { type: 'coins', amount: 75 }, icon: '🔦', category: 'mechanic' },
  { id: 'joker_10', title: 'Joker', description: 'Użyj Jokera 10 razy w sortowaniu', target: 10, reward: { type: 'coins', amount: 50 }, icon: '🃏', category: 'mechanic' },

  // --- Skill (No Undo, Speed, Stars) ---
  { id: 'no_undo_5', title: 'Purysta', description: 'Wygraj 5 poziomów bez użycia Cofnij', target: 5, reward: { type: 'stars', amount: 2 }, icon: '🧠', category: 'skill' },
  { id: 'no_undo_20', title: 'Arcymistrz', description: 'Wygraj 20 poziomów bez użycia Cofnij', target: 20, reward: { type: 'stars', amount: 5 }, icon: '🎓', category: 'skill' },
  
  { id: 'speed_10', title: 'Sprinter', description: 'Ukończ 10 poziomów w czasie poniżej 45s', target: 10, reward: { type: 'coins', amount: 200 }, icon: '⚡', category: 'skill' },
  { id: 'moves_100', title: 'Długa Droga', description: 'Wykonaj łącznie 1000 ruchów', target: 1000, reward: { type: 'coins', amount: 100 }, icon: '👣', category: 'skill' },
  { id: 'moves_5000', title: 'Maratończyk', description: 'Wykonaj łącznie 5000 ruchów', target: 5000, reward: { type: 'stars', amount: 10 }, icon: '🏃', category: 'skill' },

  { id: 'stars_10', title: 'Gwiazdor I', description: 'Zdobądź łącznie 10 gwiazdek', target: 10, reward: { type: 'coins', amount: 50 }, icon: '⭐', category: 'skill' },
  { id: 'stars_50', title: 'Gwiazdor II', description: 'Zdobądź łącznie 50 gwiazdek', target: 50, reward: { type: 'coins', amount: 250 }, icon: '🌟', category: 'skill' },
  { id: 'stars_100', title: 'Gwiazdor III', description: 'Zdobądź łącznie 100 gwiazdek', target: 100, reward: { type: 'coins', amount: 1000 }, icon: '✨', category: 'skill' },
  { id: 'stars_200', title: 'Supernowa', description: 'Zdobądź łącznie 200 gwiazdek', target: 200, reward: { type: 'stars', amount: 25 }, icon: '🌌', category: 'skill' },

  // --- Collection (Shop, Lab, Powerups) ---
  { id: 'spend_500', title: 'Klient', description: 'Wydaj 500 monet w sklepie', target: 500, reward: { type: 'stars', amount: 1 }, icon: '🛍️', category: 'collection' },
  { id: 'spend_2000', title: 'Inwestor', description: 'Wydaj 2000 monet w sklepie', target: 2000, reward: { type: 'stars', amount: 3 }, icon: '💰', category: 'collection' },
  
  { id: 'lab_1', title: 'Naukowiec', description: 'Kup 1 przedmiot do Laboratorium', target: 1, reward: { type: 'coins', amount: 50 }, icon: '🧪', category: 'collection' },
  { id: 'lab_4', title: 'Kierownik Labu', description: 'Kup 4 przedmioty do Laboratorium', target: 4, reward: { type: 'coins', amount: 200 }, icon: '🔬', category: 'collection' },
  { id: 'lab_8', title: 'Pełne Wyposażenie', description: 'Kup wszystkie przedmioty (Tiers 1-3)', target: 8, reward: { type: 'stars', amount: 10 }, icon: '🏢', category: 'collection' },
  { id: 'lab_13', title: 'Geniusz Zła', description: 'Kup absolutnie wszystko w Laboratorium', target: 13, reward: { type: 'stars', amount: 50 }, icon: '🏰', category: 'collection' },

  { id: 'use_undo_50', title: 'Ups!', description: 'Użyj Cofnij 50 razy', target: 50, reward: { type: 'coins', amount: 50 }, icon: '↩️', category: 'collection' },
  { id: 'use_hammer_10', title: 'Demolka', description: 'Użyj Młota 10 razy', target: 10, reward: { type: 'coins', amount: 100 }, icon: '🔨', category: 'collection' },
  { id: 'use_wand_10', title: 'Czarodziej', description: 'Użyj Różdżki 10 razy', target: 10, reward: { type: 'coins', amount: 150 }, icon: '🪄', category: 'collection' },
  { id: 'use_pickaxe_10', title: 'Górnik Odkrywkowy', description: 'Użyj Kilofa 10 razy', target: 10, reward: { type: 'coins', amount: 100 }, icon: '⛏️', category: 'collection' },
  
  // --- Fun/Misc ---
  { id: 'total_coins_1000', title: 'Skarbonka', description: 'Zgromadź 1000 monet (łącznie)', target: 1000, reward: { type: 'stars', amount: 1 }, icon: '🐖', category: 'collection' },
  { id: 'total_coins_5000', title: 'Milioner', description: 'Zgromadź 5000 monet (łącznie)', target: 5000, reward: { type: 'stars', amount: 10 }, icon: '🤑', category: 'collection' },
  { id: 'fail_5', title: 'Nie poddawaj się', description: 'Zresetuj poziom 5 razy', target: 5, reward: { type: 'coins', amount: 25 }, icon: '🔄', category: 'skill' },
  { id: 'pocket_use_5', title: 'Chomik', description: 'Użyj Kieszeni 5 razy', target: 5, reward: { type: 'coins', amount: 100 }, icon: '🐹', category: 'collection' },
  { id: 'xray_use_5', title: 'Podglądacz', description: 'Użyj Rentgena 5 razy', target: 5, reward: { type: 'coins', amount: 100 }, icon: '👁️', category: 'collection' },
  { id: 'paint_use_5', title: 'Artysta', description: 'Użyj Pędzla 5 razy', target: 5, reward: { type: 'coins', amount: 100 }, icon: '🎨', category: 'collection' },
  { id: 'swap_use_5', title: 'Kombinator', description: 'Użyj Zamiany 5 razy', target: 5, reward: { type: 'coins', amount: 100 }, icon: '🔀', category: 'collection' },
  { id: 'flame_use_5', title: 'Piroman', description: 'Użyj Miotacza 5 razy', target: 5, reward: { type: 'coins', amount: 100 }, icon: '🔥', category: 'collection' },
  { id: 'magnet_use_5', title: 'Przyciągający', description: 'Użyj Magnesu 5 razy', target: 5, reward: { type: 'coins', amount: 100 }, icon: '🧲', category: 'collection' },
];
