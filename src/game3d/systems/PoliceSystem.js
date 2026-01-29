/**
 * MA3 - POLICE SYSTEM
 * Kenyan traffic police with chase mechanics
 */

export class PoliceSystem {
  constructor() {
    this.isChasing = false;
    this.wantedLevel = 0;
    this.lastWarningTime = 0;
    this.chaseStartTime = 0;
    
    this.warnings = [
      "⚠️ Police ahead - slow down!",
      "🚨 OVERSPEEDING! Police pursuing!",
      "👮 Stop the vehicle! Lete licence!",
      "🚓 Police chase in progress!"
    ];
    
    this.speedLimit = 80; // km/h
    this.chaseThreshold = 120; // km/h
  }
  
  update(speed) {
    const now = Date.now();
    
    // Check for speeding
    if (speed > this.chaseThreshold && !this.isChasing) {
      this.startChase();
    }
    
    // Warning for approaching speed limit
    if (speed > this.speedLimit && speed < this.chaseThreshold) {
      if (now - this.lastWarningTime > 10000) {
        this.showWarning(this.warnings[0]);
        this.lastWarningTime = now;
      }
    }
    
    // Update chase
    if (this.isChasing) {
      this.updateChase(speed, now);
    }
  }
  
  startChase() {
    this.isChasing = true;
    this.wantedLevel = 1;
    this.chaseStartTime = Date.now();
    
    console.log('🚨 Police chase started!');
    this.showWarning(this.warnings[1]);
    
    // Play siren sound (if you have audio)
    this.playSiren();
  }
  
  updateChase(speed, now) {
    const chaseDuration = (now - this.chaseStartTime) / 1000; // seconds
    
    // Escape if slow down for 10 seconds
    if (speed < 50 && chaseDuration > 10) {
      this.endChase(false);
      return;
    }
    
    // Caught if speed < 20 for 3 seconds
    if (speed < 20 && chaseDuration > 3) {
      this.endChase(true);
      return;
    }
    
    // Show chase UI
    if (Math.floor(chaseDuration) % 5 === 0 && chaseDuration > 0) {
      this.showWarning(this.warnings[3]);
    }
  }
  
  endChase(caught) {
    this.isChasing = false;
    this.wantedLevel = 0;
    
    if (caught) {
      console.log('🚔 You were caught by police!');
      this.showBribeDialog();
    } else {
      console.log('✅ You escaped the police!');
      this.showWarning('✅ Police lost you. Drive safe!');
    }
  }
  
  showWarning(message) {
    const warning = document.createElement('div');
    warning.style.position = 'fixed';
    warning.style.top = '10%';
    warning.style.left = '50%';
    warning.style.transform = 'translateX(-50%)';
    warning.style.background = 'rgba(255, 0, 0, 0.9)';
    warning.style.color = '#FFFFFF';
    warning.style.padding = '20px 40px';
    warning.style.borderRadius = '10px';
    warning.style.fontSize = '28px';
    warning.style.fontWeight = 'bold';
    warning.style.zIndex = '10000';
    warning.style.border = '3px solid #FF0000';
    warning.style.animation = 'pulse 0.5s infinite';
    warning.textContent = message;
    
    document.body.appendChild(warning);
    
    setTimeout(() => {
      document.body.removeChild(warning);
    }, 3000);
  }
  
  showBribeDialog() {
    const dialog = document.createElement('div');
    dialog.style.position = 'fixed';
    dialog.style.top = '50%';
    dialog.style.left = '50%';
    dialog.style.transform = 'translate(-50%, -50%)';
    dialog.style.background = 'rgba(0, 0, 0, 0.95)';
    dialog.style.color = '#FFD700';
    dialog.style.padding = '40px';
    dialog.style.borderRadius = '15px';
    dialog.style.fontSize = '24px';
    dialog.style.zIndex = '10001';
    dialog.style.border = '3px solid #FFD700';
    dialog.style.textAlign = 'center';
    
    dialog.innerHTML = `
      <h2 style="color: #FF4444; margin-bottom: 20px;">🚔 POLICE STOP</h2>
      <p>"Wewe kijana unakuja hapa mbio kwani ni ya nini?"</p>
      <p style="margin: 20px 0;">Fine: KES 1,000</p>
      <button id="payBribe" style="
        background: #FFD700;
        color: #000;
        padding: 15px 40px;
        border: none;
        border-radius: 8px;
        font-size: 20px;
        font-weight: bold;
        cursor: pointer;
        margin: 10px;
      ">Pay Fine (KES 1,000)</button>
      <button id="goToStation" style="
        background: #666;
        color: #FFF;
        padding: 15px 40px;
        border: none;
        border-radius: 8px;
        font-size: 20px;
        cursor: pointer;
        margin: 10px;
      ">Go to Station</button>
    `;
    
    document.body.appendChild(dialog);
    
    document.getElementById('payBribe').onclick = () => {
      document.body.removeChild(dialog);
      this.showWarning('💸 Paid KES 1,000 bribe. Drive safe!');
    };
    
    document.getElementById('goToStation').onclick = () => {
      document.body.removeChild(dialog);
      this.showWarning('🚨 Going to police station... (30 min delay)');
    };
  }
  
  playSiren() {
    // Placeholder - add actual siren sound later
    console.log('🚨 *SIREN SOUNDS*');
  }
  
  isInChase() {
    return this.isChasing;
  }
}

export default PoliceSystem;