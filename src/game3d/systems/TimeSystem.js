/**
 * MA3 - TIME SYSTEM
 * Real-time Nairobi day/night cycle
 */

import * as THREE from 'three';

export class TimeSystem {
  constructor(scene, sunLight) {
    this.scene = scene;
    this.sunLight = sunLight;
    
    // Start at noon
    this.currentHour = 12;
    this.timeSpeed = 0.05; // 1 in-game hour = 20 real seconds
    
    this.skyColors = {
      night: { sky: 0x0C1445, fog: 0x1A1A2E },
      dawn: { sky: 0xFF6B35, fog: 0xFFB347 },
      day: { sky: 0x87CEEB, fog: 0xE0F6FF },
      dusk: { sky: 0xFF4500, fog: 0xFF6347 }
    };
  }
  
  update(delta) {
    this.currentHour += delta * this.timeSpeed;
    if (this.currentHour >= 24) this.currentHour = 0;
    
    this.updateLighting();
    this.updateSky();
  }
  
  updateLighting() {
    if (!this.sunLight) return;
    
    const hour = this.currentHour;
    
    // Sun position (circular arc)
    const angle = (hour / 24) * Math.PI * 2 - Math.PI / 2;
    this.sunLight.position.x = Math.cos(angle) * 100;
    this.sunLight.position.y = Math.sin(angle) * 100;
    this.sunLight.position.z = 50;
    
    // Sun intensity
    if (hour >= 6 && hour < 7) {
      // Dawn (6-7am)
      this.sunLight.intensity = 0.5 + (hour - 6) * 1.0;
      this.sunLight.color.setHex(0xFFAA77);
    } else if (hour >= 7 && hour < 18) {
      // Day (7am-6pm)
      this.sunLight.intensity = 1.5;
      this.sunLight.color.setHex(0xFFFAF0);
    } else if (hour >= 18 && hour < 19) {
      // Dusk (6-7pm)
      this.sunLight.intensity = 1.5 - (hour - 18) * 1.2;
      this.sunLight.color.setHex(0xFF6347);
    } else {
      // Night (7pm-6am)
      this.sunLight.intensity = 0.3;
      this.sunLight.color.setHex(0x4444AA);
    }
  }
  
  updateSky() {
    const hour = this.currentHour;
    let skyColor, fogColor;
    
    if (hour >= 0 && hour < 5) {
      // Night
      skyColor = this.skyColors.night.sky;
      fogColor = this.skyColors.night.fog;
    } else if (hour >= 5 && hour < 7) {
      // Dawn
      skyColor = this.skyColors.dawn.sky;
      fogColor = this.skyColors.dawn.fog;
    } else if (hour >= 7 && hour < 17) {
      // Day
      skyColor = this.skyColors.day.sky;
      fogColor = this.skyColors.day.fog;
    } else if (hour >= 17 && hour < 19) {
      // Dusk
      skyColor = this.skyColors.dusk.sky;
      fogColor = this.skyColors.dusk.fog;
    } else {
      // Evening/Night
      skyColor = this.skyColors.night.sky;
      fogColor = this.skyColors.night.fog;
    }
    
    this.scene.background = new THREE.Color(skyColor);
    this.scene.fog.color = new THREE.Color(fogColor);
  }
  
  getTimeOfDay() {
    const hour = Math.floor(this.currentHour);
    const minute = Math.floor((this.currentHour - hour) * 60);
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  }
  
  isNight() {
    return this.currentHour < 6 || this.currentHour >= 19;
  }
  
  setTime(hour) {
    this.currentHour = hour;
  }
}

export default TimeSystem;