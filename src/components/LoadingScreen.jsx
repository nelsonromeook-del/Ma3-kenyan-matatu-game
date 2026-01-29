/**
 * MA3 - CINEMATIC LOADING SCREEN
 * Better than Slow Roads guaranteed
 */

import React, { useEffect, useState } from 'react';
import './LoadingScreen.css';

const LoadingScreen = ({ onLoadComplete }) => {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Starting engine...');
  
  const loadingStages = [
    { progress: 10, text: 'Tuning the engine... 🔧' },
    { progress: 20, text: 'Loading Nairobi streets... 🏙️' },
    { progress: 35, text: 'Painting the matatu... 🎨' },
    { progress: 50, text: 'Installing sound system... 🔊' },
    { progress: 65, text: 'Bribing traffic police... 💸' },
    { progress: 80, text: 'Calling the conductor... 📞' },
    { progress: 90, text: 'Fueling up... ⛽' },
    { progress: 100, text: 'Twende! 🚗💨' }
  ];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => onLoadComplete(), 500);
          return 100;
        }
        
        const newProgress = prev + Math.random() * 3;
        const stage = loadingStages.find(s => s.progress > prev && s.progress <= newProgress);
        if (stage) setLoadingText(stage.text);
        
        return Math.min(newProgress, 100);
      });
    }, 100);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="loading-screen">
      {/* Animated Nairobi skyline background */}
      <div className="loading-bg">
        <div className="skyline"></div>
        <div className="matatu-silhouette"></div>
      </div>
      
      {/* Main content */}
      <div className="loading-content">
        <div className="game-logo">
          <h1 className="title">MA3</h1>
          <p className="subtitle">Kenyan Matatu Experience</p>
        </div>
        
        {/* Progress bar */}
        <div className="progress-container">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progress}%` }}
            >
              <div className="progress-glow"></div>
            </div>
          </div>
          <div className="progress-text">{Math.round(progress)}%</div>
        </div>
        
        {/* Loading text */}
        <div className="loading-text">
          <span className="loading-dots">{loadingText}</span>
        </div>
        
        {/* Fun facts */}
        <div className="fun-fact">
          💡 Did you know? Matatus got their name from the 30 shillings fare ("ma-tatu" = three)
        </div>
      </div>
      
      {/* Particles effect */}
      <div className="particles">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="particle" style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${3 + Math.random() * 2}s`
          }}></div>
        ))}
      </div>
    </div>
  );
};

export default LoadingScreen;