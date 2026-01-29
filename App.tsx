import React, { useState, useEffect } from 'react';
import { ViewState, UserProgress, TEST_LEVEL_ID } from './types';
import { getProgress } from './services/storage';
import MainMenu from './screens/MainMenu';
import MapScreen from './screens/MapScreen';
import GameScreen from './screens/GameScreen';
import Leaderboard from './screens/Leaderboard';
import RulesScreen from './screens/RulesScreen';
import ShopScreen from './screens/ShopScreen';
import LabScreen from './screens/LabScreen';
import AchievementsScreen from './screens/AchievementsScreen';
import AdventureScreen from './screens/AdventureScreen';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('MENU');
  const [currentLevel, setCurrentLevel] = useState<number>(1);
  const [progress, setProgress] = useState<UserProgress>(getProgress());

  // Reload progress when entering views that might have changed data
  const refreshProgress = () => {
    setProgress(getProgress());
  };

  const handleStartGame = () => {
    refreshProgress();
    setView('MAP');
  };

  const handleSelectLevel = (levelId: number) => {
    setCurrentLevel(levelId);
    setView('GAME');
  };

  const handleTestMode = () => {
    setCurrentLevel(TEST_LEVEL_ID);
    setView('GAME');
  };

  const handleExitGame = () => {
    if (currentLevel === TEST_LEVEL_ID) {
      setView('MENU');
    } else {
      refreshProgress();
      setView('MAP');
    }
  };

  const handleBackToMenu = () => {
    refreshProgress();
    setView('MENU');
  };

  return (
    // h-[100dvh] ensures full height on mobile browsers with address bars
    <div className="w-full h-[100dvh] max-w-md mx-auto bg-slate-900 shadow-2xl relative overflow-hidden">
      {view === 'MENU' && (
        <MainMenu 
            onPlay={handleStartGame} 
            onShowLeaderboard={() => setView('LEADERBOARD')}
            onShowRules={() => setView('RULES')}
            onShowShop={() => setView('SHOP')}
            onShowLab={() => setView('LAB')}
            onShowAchievements={() => setView('ACHIEVEMENTS')}
            onShowAdventure={() => setView('ADVENTURE')}
            onTestMode={handleTestMode}
            progress={progress}
        />
      )}
      
      {view === 'MAP' && (
        <MapScreen 
            progress={progress}
            onLevelSelect={handleSelectLevel}
            onBack={handleBackToMenu}
        />
      )}

      {view === 'GAME' && (
        <GameScreen 
            levelId={currentLevel}
            onExit={handleExitGame}
        />
      )}

      {view === 'SHOP' && (
        <ShopScreen onBack={handleBackToMenu} />
      )}

      {view === 'LAB' && (
        <LabScreen onBack={handleBackToMenu} />
      )}

      {view === 'ACHIEVEMENTS' && (
        <AchievementsScreen onBack={handleBackToMenu} />
      )}

      {view === 'LEADERBOARD' && (
        <Leaderboard 
            progress={progress}
            onBack={handleBackToMenu}
        />
      )}

      {view === 'RULES' && (
        <RulesScreen 
            onBack={handleBackToMenu}
        />
      )}

      {view === 'ADVENTURE' && (
        <AdventureScreen 
            onBack={handleBackToMenu}
        />
      )}
    </div>
  );
};

export default App;