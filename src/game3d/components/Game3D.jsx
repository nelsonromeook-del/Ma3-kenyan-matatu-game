/**
 * MA3 - 3D GAME COMPONENT
 * React wrapper for the 3D game engine
 */

import React, { useEffect, useRef, useState } from 'react';
import GameEngine from '../engine/GameEngine';
import VehiclePhysics from '../engine/VehiclePhysics';
import NairobiWorld from '../engine/NairobiWorld';
import ConductorSystem from '../systems/ConductorSystem';
import PoliceSystem from '../systems/PoliceSystem';
import '../styles/Game3D.css';

const Game3D = ({ selectedMatatu, onExit }) => {
  const canvasRef = useRef(null);
  const engineRef = useRef(null);
  const vehicleRef = useRef(null);
  const worldRef = useRef(null);
  const conductorRef = useRef(null);
  const policeRef = useRef(null);
  const animationFrameRef = useRef(null);
  
  const [gameState, setGameState] = useState({
    speed: 0,
    rpm: 0,
    gear: 1,
    score: 0,
    money: 0,
    passengers: 0,
    fps: 60,
    time: '12:00'
  });
  
  const [isPaused, setIsPaused] = useState(false);
  const [showControls, setShowControls] = useState(true);

  useEffect(() => {
    if (!canvasRef.current) return;
    
    console.log('🎮 Initializing 3D Game...');
    console.log('Selected Matatu:', selectedMatatu);
    
    try {
      // Initialize systems
      engineRef.current = new GameEngine(canvasRef.current);
      worldRef.current = new NairobiWorld(engineRef.current);
      vehicleRef.current = new VehiclePhysics(engineRef.current, selectedMatatu);
      conductorRef.current = new ConductorSystem();
      policeRef.current = new PoliceSystem();
      
      console.log('✅ All systems initialized');
      
      startGameLoop();
      console.log('🔍 Engine:', engineRef.current);
      console.log('🔍 Vehicle:', vehicleRef.current);
      console.log('🔍 World:', worldRef.current);
      console.log('🔍 Scene children:', engineRef.current?.scene.children.length);
      
      // Hide controls after 5 seconds
      const controlsTimer = setTimeout(() => {
        setShowControls(false);
      }, 5000);
      
      return () => {
        clearTimeout(controlsTimer);
        stopGameLoop();
        if (vehicleRef.current) vehicleRef.current.dispose();
        if (engineRef.current) engineRef.current.dispose();
      };
    } catch (error) {
      console.error('❌ Error initializing 3D game:', error);
    }
  }, [selectedMatatu]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setIsPaused(!isPaused);
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isPaused]);

  const startGameLoop = () => {
    const gameLoop = () => {
      if (!engineRef.current || !vehicleRef.current) return;
      
      const engine = engineRef.current;
      const vehicle = vehicleRef.current;
      
      // Update engine (physics, time, particles)
      engine.update();
      
      // Update vehicle
      vehicle.update(engine.input, engine.delta);
      
      // Update camera
      engine.updateCamera(vehicle.mesh);
      
      // Update conductor system
      if (conductorRef.current) {
        const isMoving = vehicle.getSpeed() > 5;
        conductorRef.current.update(isMoving, vehicle.getSpeed());
      }
      
      // Update police system
      if (policeRef.current) {
        policeRef.current.update(vehicle.getSpeed());
      }
      
      // Update game state for HUD
      setGameState(prev => ({
        ...prev,
        speed: Math.round(vehicle.getSpeed()),
        rpm: Math.round(vehicle.getRPM()),
        gear: vehicle.getGear(),
        fps: engine.getFPS(),
        time: engine.timeSystem ? engine.timeSystem.getTimeOfDay() : '12:00'
      }));
      
      // Render scene
      engine.render();
      
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };
    
    gameLoop();
  };

  const stopGameLoop = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
    if (!isPaused) {
      stopGameLoop();
    } else {
      startGameLoop();
    }
  };

  const handleReset = () => {
    if (vehicleRef.current && worldRef.current) {
      const spawnPos = worldRef.current.getSpawnPosition();
      vehicleRef.current.reset(spawnPos);
      setGameState(prev => ({
        ...prev,
        speed: 0,
        rpm: 800,
        gear: 1
      }));
    }
  };

  return (
    <div className="game3d-container">
      <canvas ref={canvasRef} className="game3d-canvas" />
      
      <div className="game3d-hud">
        {/* Top Left - Vehicle Info */}
        <div className="hud-top-left">
          <div className="matatu-name">{selectedMatatu.name}</div>
          <div className="route-info">{selectedMatatu.route}</div>
          <div className="matatu-type">{selectedMatatu.type.replace('_', ' ').toUpperCase()}</div>
        </div>
        
        {/* Top Right - Stats */}
        <div className="hud-top-right">
          <div className="hud-item">
            <span className="hud-label">TIME</span>
            <span className="hud-value">{gameState.time}</span>
          </div>
          <div className="hud-item">
            <span className="hud-label">SCORE</span>
            <span className="hud-value">{gameState.score}</span>
          </div>
          <div className="hud-item">
            <span className="hud-label">MONEY</span>
            <span className="hud-value">KES {gameState.money}</span>
          </div>
          <div className="hud-item">
            <span className="hud-label">PASSENGERS</span>
            <span className="hud-value">{gameState.passengers}/14</span>
          </div>
        </div>
        
        {/* Bottom Left - Speedometer */}
        <div className="speedometer">
          <div className="speed-display">
            <span className="speed-value">{gameState.speed}</span>
            <span className="speed-unit">KM/H</span>
          </div>
          <div className="rpm-display">
            <span className="rpm-label">RPM</span>
            <span className="rpm-value">{gameState.rpm}</span>
          </div>
          <div className="gear-display">
            <span className="gear-label">GEAR</span>
            <span className="gear-value">{gameState.gear}</span>
          </div>
          {vehicleRef.current?.isDrifting && (
            <div className="drift-indicator">
              <span>🔥 DRIFT MODE</span>
            </div>
          )}
        </div>
        
        {/* Bottom Right - Minimap */}
        <div className="minimap">
          <div className="minimap-label">NAIROBI MAP</div>
          <div className="minimap-canvas">
            <div className="player-dot"></div>
            <div className="minimap-roads"></div>
          </div>
          <div className="minimap-info">
            <span>Speed: {gameState.speed} km/h</span>
            <span>Camera: {engineRef.current?.cameraMode || 'chase'}</span>
          </div>
        </div>
        
        {/* FPS Counter */}
        <div className="fps-counter">
          {gameState.fps} FPS
        </div>
        
        {/* Controls Guide (shows for 5 seconds) */}
        {showControls && (
          <div className="controls-guide">
            <h3>🎮 CONTROLS</h3>
            <div className="controls-grid">
              <div className="control-row">
                <span className="control-key">W / ↑</span>
                <span className="control-desc">Accelerate</span>
              </div>
              <div className="control-row">
                <span className="control-key">S / ↓</span>
                <span className="control-desc">Reverse</span>
              </div>
              <div className="control-row">
                <span className="control-key">A / ←</span>
                <span className="control-desc">Turn Left</span>
              </div>
              <div className="control-row">
                <span className="control-key">D / →</span>
                <span className="control-desc">Turn Right</span>
              </div>
              <div className="control-row">
                <span className="control-key">SPACE</span>
                <span className="control-desc">Handbrake (Drift)</span>
              </div>
              <div className="control-row">
                <span className="control-key">SHIFT</span>
                <span className="control-desc">Brake</span>
              </div>
              <div className="control-row">
                <span className="control-key">H</span>
                <span className="control-desc">Horn</span>
              </div>
              <div className="control-row">
                <span className="control-key">C</span>
                <span className="control-desc">Change Camera</span>
              </div>
              <div className="control-row">
                <span className="control-key">ESC</span>
                <span className="control-desc">Pause</span>
              </div>
            </div>
            <p className="controls-hint">Controls will hide in {Math.ceil((5000 - Date.now()) / 1000)}s...</p>
          </div>
        )}
        
        {/* Pause Menu */}
        {isPaused && (
          <div className="pause-overlay">
            <div className="pause-menu">
              <h2>⏸️ GAME PAUSED</h2>
              <p className="pause-subtitle">Tumesimama stage kidogo</p>
              <div className="pause-buttons">
                <button className="btn btn-primary" onClick={handlePause}>
                  ▶️ RESUME
                </button>
                <button className="btn btn-secondary" onClick={handleReset}>
                  🔄 RESET POSITION
                </button>
                <button className="btn btn-danger" onClick={onExit}>
                  🚪 EXIT TO MENU
                </button>
              </div>
              <div className="pause-stats">
                <div className="stat">
                  <span>Distance:</span>
                  <strong>{Math.round(gameState.score / 10)} km</strong>
                </div>
                <div className="stat">
                  <span>Top Speed:</span>
                  <strong>{gameState.speed} km/h</strong>
                </div>
                <div className="stat">
                  <span>Earnings:</span>
                  <strong>KES {gameState.money}</strong>
                </div>
                <div className="stat">
                  <span>Time:</span>
                  <strong>{gameState.time}</strong>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Game3D;