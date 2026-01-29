import { UserProgress, ACHIEVEMENTS_DATA, LAB_ITEMS_DATA, MAX_LEVELS, BOSSES_DATA } from '../types';
import { calculateStars } from './gameLogic';

const STORAGE_KEY = 'kulki_game_progress';

const INITIAL_PROGRESS: UserProgress = {
  unlockedLevel: 1,
  stars: {},
  scores: {},
  times: {},
  coins: 0, 
  inventory: {},
  spentStars: 0,
  labItems: [],
  unlockedPets: [],
  activePetId: null,
  petLevels: {},
  prestigeLevel: 0,
  artifacts: [],
  lastDailySpin: 0,
  achievementsProgress: {},
  achievementsClaimed: {}
};

export const getProgress = (): UserProgress => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Ensure new properties exist for older saves
      if (!parsed.times) parsed.times = {};
      if (parsed.coins === undefined) parsed.coins = 0;
      if (!parsed.inventory) parsed.inventory = {};
      if (parsed.spentStars === undefined) parsed.spentStars = 0;
      if (!parsed.labItems) parsed.labItems = [];
      if (!parsed.unlockedPets) parsed.unlockedPets = [];
      if (!parsed.activePetId) parsed.activePetId = null;
      if (!parsed.achievementsProgress) parsed.achievementsProgress = {};
      if (!parsed.achievementsClaimed) parsed.achievementsClaimed = {};
      
      // New fields
      if (!parsed.petLevels) parsed.petLevels = {};
      if (parsed.prestigeLevel === undefined) parsed.prestigeLevel = 0;
      if (!parsed.artifacts) parsed.artifacts = [];
      if (parsed.lastDailySpin === undefined) parsed.lastDailySpin = 0;

      return parsed;
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

export const triggerPrestigeReset = (): boolean => {
    const current = getProgress();
    if (current.unlockedLevel > MAX_LEVELS) {
        current.prestigeLevel += 1;
        current.unlockedLevel = 1;
        // Keep stars? No, full reset of levels.
        current.stars = {};
        current.scores = {};
        current.times = {};
        // Keep inventory, coins, pets, artifacts, lab items
        saveProgress(current);
        return true;
    }
    return false;
};

export const upgradePet = (petId: string, cost: number): boolean => {
    const current = getProgress();
    const currentLvl = current.petLevels[petId] || 1;
    if (currentLvl >= 3) return false;

    const totalStars = Object.values(current.stars).reduce((a, b) => a + b, 0);
    const availableStars = totalStars - current.spentStars;

    if (availableStars >= cost) {
        current.spentStars += cost;
        current.petLevels[petId] = currentLvl + 1;
        saveProgress(current);
        return true;
    }
    return false;
};

export const unlockArtifact = (artifactId: string) => {
    const current = getProgress();
    if (!current.artifacts.includes(artifactId)) {
        current.artifacts.push(artifactId);
        saveProgress(current);
    }
};

export const saveSpinTime = () => {
    const current = getProgress();
    current.lastDailySpin = Date.now();
    saveProgress(current);
}

// ... (existing achievement functions)

export const updateAchievementProgress = (achievementIdOrCategory: string, amount: number = 1, absolute: boolean = false) => {
    const current = getProgress();
    let changed = false;
    
    ACHIEVEMENTS_DATA.forEach(ach => {
        let match = false;
        
        // Exact ID match
        if (ach.id === achievementIdOrCategory) match = true;
        
        // Category/Type match logic
        if (achievementIdOrCategory === 'ice_break' && ach.id.startsWith('ice_')) match = true;
        if (achievementIdOrCategory === 'stone_break' && ach.id.startsWith('stone_')) match = true;
        if (achievementIdOrCategory === 'lock_open' && ach.id.startsWith('lock_')) match = true;
        if (achievementIdOrCategory === 'virus_cure' && ach.id.startsWith('virus_')) match = true;
        if (achievementIdOrCategory === 'hidden_reveal' && ach.id.startsWith('hidden_')) match = true;
        if (achievementIdOrCategory === 'level_win' && ach.id.startsWith('lvl_')) {
             if (current.unlockedLevel - 1 >= ach.target) {
                 const val = current.unlockedLevel - 1;
                 current.achievementsProgress[ach.id] = val;
                 changed = true;
                 return; 
             }
        }
        
        if (achievementIdOrCategory === 'shop_spend' && ach.id.startsWith('spend_')) match = true;
        if (achievementIdOrCategory.startsWith('use_') && ach.id === achievementIdOrCategory) match = true;
        
        // Misc
        if (achievementIdOrCategory === 'moves_total' && ach.id.startsWith('moves_')) match = true;
        if (achievementIdOrCategory === 'total_coins' && ach.id.startsWith('total_coins_')) match = true;
        if (achievementIdOrCategory === 'stars_total' && ach.id.startsWith('stars_')) match = true;


        if (match) {
            const currentVal = current.achievementsProgress[ach.id] || 0;
            if (currentVal < ach.target) {
                if (absolute) {
                     if (amount > currentVal) {
                         current.achievementsProgress[ach.id] = amount;
                         changed = true;
                     }
                } else {
                    current.achievementsProgress[ach.id] = currentVal + amount;
                    changed = true;
                }
            }
        }
    });

    if (changed) saveProgress(current);
};

export const claimAchievement = (achievementId: string): { success: boolean, reward?: { type: string, amount: number } } => {
    const current = getProgress();
    const achievement = ACHIEVEMENTS_DATA.find(a => a.id === achievementId);
    
    if (!achievement) return { success: false };
    
    const progress = current.achievementsProgress[achievementId] || 0;
    const isClaimed = current.achievementsClaimed[achievementId];

    if (progress >= achievement.target && !isClaimed) {
        current.achievementsClaimed[achievementId] = true;
        if (achievement.reward.type === 'coins') {
            current.coins += achievement.reward.amount;
        } else if (achievement.reward.type === 'stars') {
            current.spentStars -= achievement.reward.amount;
        }
        saveProgress(current);
        return { success: true, reward: achievement.reward };
    }
    
    return { success: false };
};

export const completeLevel = (levelId: number, moves: number, timeInSeconds: number) => {
  const current = getProgress();
  
  // Calculate stars based on time
  const stars = calculateStars(levelId, moves, timeInSeconds);
  const previousStars = current.stars[levelId] || 0;

  // Calculate Coin Bonus from Lab Items
  let coinMultiplier = 0;
  current.labItems.forEach(itemId => {
      const item = LAB_ITEMS_DATA.find(i => i.id === itemId);
      if (item && item.bonus && item.bonus.type === 'coin_multiplier') {
          coinMultiplier += item.bonus.value;
      }
  });

  // PRESTIGE BONUS
  const prestigeBonus = current.prestigeLevel || 0; // +100% per prestige

  // Award Coins: 10 base + 10 per star, plus passive bonus
  let baseCoins = 10 + (stars * 10);
  let bonusCoins = Math.floor(baseCoins * coinMultiplier);
  let prestigeCoins = Math.floor(baseCoins * prestigeBonus);
  
  // BOSS REWARD CHECK
  // Check if this level is a boss level and if it was NOT already completed (first win bonus)
  // Actually, standard behavior allows farming levels, but boss rewards should probably be significant.
  // For simplicity, we add boss rewards every time, or we could check previousStars === 0 for first time only.
  // Let's add them every time for now, as bosses are hard.
  const boss = BOSSES_DATA.find(b => b.level === levelId);
  let bossCoins = 0;
  
  if (boss) {
      bossCoins = boss.reward.coins;
      // Stars from boss reward: this logic is slightly tricky because "spentStars" handles star currency.
      // So we assume boss reward stars are "free currency" stars, meaning we decrease "spentStars" 
      // (which increases available stars)
      current.spentStars -= boss.reward.stars; 
  }

  let coinsEarned = baseCoins + bonusCoins + prestigeCoins + bossCoins;
  
  current.coins += coinsEarned;

  if (levelId === current.unlockedLevel && levelId < MAX_LEVELS + 1) { // Allow go to 101 to trigger prestige button
    current.unlockedLevel = levelId + 1;
  }

  if (stars > previousStars) {
    current.stars[levelId] = stars;
  }

  const currentScore = current.scores[levelId];
  if (currentScore === undefined || moves < currentScore) {
    current.scores[levelId] = moves;
  }

  const currentTime = current.times[levelId];
  if (currentTime === undefined || timeInSeconds < currentTime) {
    current.times[levelId] = timeInSeconds;
  }

  saveProgress(current);
  
  // Trigger Achievements
  updateAchievementProgress('level_win');
  const totalStars = Object.values(current.stars).reduce((a: number, b: number) => a + b, 0);
  updateAchievementProgress('stars_total', totalStars, true);
  
  updateAchievementProgress('moves_total', moves); // Incremental
  if (timeInSeconds < 45) updateAchievementProgress('speed_10', 1);
  updateAchievementProgress('total_coins', coinsEarned); // Incremental

  return { progress: current, newStars: stars, coinsEarned, bossReward: boss ? boss.reward : null };
};

export const buyPowerUp = (type: string, cost: number): boolean => {
    const current = getProgress();
    if (current.coins >= cost) {
        current.coins -= cost;
        current.inventory[type] = (current.inventory[type] || 0) + 1;
        saveProgress(current);
        updateAchievementProgress('shop_spend', cost);
        return true;
    }
    return false;
};

export const buyLabItem = (itemId: string, cost: number): boolean => {
    const current = getProgress();
    const totalStars = Object.values(current.stars).reduce((a, b) => a + b, 0);
    const availableStars = totalStars - current.spentStars;

    if (availableStars >= cost && !current.labItems.includes(itemId)) {
        current.spentStars += cost;
        current.labItems.push(itemId);
        saveProgress(current);
        updateAchievementProgress('lab_1', 1, true);
        updateAchievementProgress('lab_4', current.labItems.length, true);
        updateAchievementProgress('lab_8', current.labItems.length, true);
        updateAchievementProgress('lab_13', current.labItems.length, true);
        return true;
    }
    return false;
};

export const buyPet = (petId: string, cost: number): boolean => {
    const current = getProgress();
    const totalStars = Object.values(current.stars).reduce((a, b) => a + b, 0);
    const availableStars = totalStars - current.spentStars;

    if (availableStars >= cost && !current.unlockedPets.includes(petId)) {
        current.spentStars += cost;
        current.unlockedPets.push(petId);
        current.petLevels[petId] = 1; // Start level 1
        
        // Auto equip if first pet
        if (!current.activePetId) current.activePetId = petId;
        
        saveProgress(current);
        return true;
    }
    return false;
};

export const equipPet = (petId: string): boolean => {
    const current = getProgress();
    if (current.unlockedPets.includes(petId)) {
        current.activePetId = petId;
        saveProgress(current);
        return true;
    }
    return false;
};