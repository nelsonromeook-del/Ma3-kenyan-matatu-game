import React, { useState } from 'react';
import LoadingScreen from './components/LoadingScreen';
import IntroVideo from './components/IntroVideo';
import MatatuSelect from './components/MatatuSelect';
import Game3D from './game3d/components/Game3D';
import { matatus } from './data/matatus';
import './App.css';

function App() {
  const [gameState, setGameState] = useState('loading'); // loading → intro → select → playing
  const [selectedMatatu, setSelectedMatatu] = useState(null);

  const handleLoadComplete = () => {
    setGameState('intro');
  };

  const handleIntroComplete = () => {
    setGameState('select');
  };

  const handleMatatuSelect = (matatu) => {
    setSelectedMatatu(matatu);
    setGameState('playing');
  };

  const handleExit = () => {
    setGameState('select');
    setSelectedMatatu(null);
  };

  return (
    <div className="App">
      {gameState === 'loading' && (
        <LoadingScreen onLoadComplete={handleLoadComplete} />
      )}
      
      {gameState === 'intro' && (
        <IntroVideo onComplete={handleIntroComplete} />
      )}
      
      {gameState === 'select' && (
        <MatatuSelect 
          matatus={matatus} 
          onSelect={handleMatatuSelect} 
        />
      )}
      
      {gameState === 'playing' && selectedMatatu && (
        <Game3D 
          selectedMatatu={selectedMatatu} 
          onExit={handleExit} 
        />
      )}
    </div>
  );
}

export default App;