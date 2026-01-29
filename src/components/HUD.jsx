import React from 'react';
import './HUD.css';
import { formatScore, formatMoney, getLevelFromScore } from '../utils/helpers';

const HUD = ({ 
  score = 0, 
  money = 0, 
  passengers = 0, 
  level = 1,
  speed = 1,
  matatuName = 'MATATU',
  routeName = 'ROUTE',
  capacity = 14
}) => {
  const progressPercent = (passengers / capacity) * 100;
  
  return (
    <div className="hud">
      {/* Top Bar */}
      <div className="hud-top">
        <div className="hud-left">
          <div className="hud-item hud-score">
            <span className="hud-label">SCORE</span>
            <span className="hud-value">{formatScore(score)}</span>
          </div>
          
          <div className="hud-item">
            <span className="hud-label">TIME</span>
            <span className="hud-value">{gameState.time || '12:00'}</span>
          </div>
          
          <div className="hud-item hud-level">
            <span className="hud-label">LEVEL</span>
            <span className="hud-value">{level}</span>
          </div>
        </div>
        
        <div className="hud-center">
          <div className="hud-matatu-info">
            <div className="matatu-name">{matatuName}</div>
            <div className="route-name">{routeName}</div>
          </div>
        </div>
        
        <div className="hud-right">
          <div className="hud-item hud-money">
            <span className="hud-label">CASH</span>
            <span className="hud-value">{formatMoney(money)}</span>
          </div>
        </div>
      </div>
      
      {/* Passenger Bar */}
      <div className="hud-passenger-bar">
        <div className="passenger-bar-label">
          <span>PASSENGERS</span>
          <span>{passengers}/{capacity}</span>
        </div>
        <div className="passenger-bar-container">
          <div 
            className="passenger-bar-fill" 
            style={{ width: `${progressPercent}%` }}
          >
            {progressPercent >= 100 && <span className="full-bonus">FULL! +100</span>}
          </div>
        </div>
      </div>
      
      {/* Speed Indicator */}
      <div className="hud-speed">
        <div className="speed-label">SPEED</div>
        <div className="speed-bars">
          {[...Array(10)].map((_, i) => (
            <div 
              key={i} 
              className={`speed-bar ${i < Math.floor(speed * 2) ? 'active' : ''}`}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HUD;
