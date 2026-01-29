/**
 * MA3 - CONDUCTOR SYSTEM
 * Authentic Kenyan matatu conductor with Sheng
 */

export class ConductorSystem {
  constructor() {
    this.shouts = [
      "TOWN TOWN TOWN! MOJA MOJA!",
      "Beshte form ni form, tuuuuune!",
      "WANNE WANNE BUDA BUDA!",
      "Gari inafika stage saa hii saa hii!",
      "Ngong Road express! Karen direct!",
      "Stage mbele! Nani ako down??",
      "Boss toka fare yako haraka!",
      "Tunafika tao in five minutes, ondokeni haraka!",
      "Embakasi! Umoja! Pipeline!",
      "CBD CBD! Last trip ya leo!"
    ];
    
    this.lastShoutTime = 0;
    this.shoutInterval = 8000; // Shout every 8 seconds
  }
  
  update(isMoving, speed) {
    const now = Date.now();
    
    // Only shout when moving
    if (isMoving && speed > 10 && now - this.lastShoutTime > this.shoutInterval) {
      this.shout();
      this.lastShoutTime = now;
    }
  }
  
  shout() {
    const randomShout = this.shouts[Math.floor(Math.random() * this.shouts.length)];
    console.log(`🗣️ Conductor: "${randomShout}"`);
    
    // Show on screen (if you have a notification system)
    this.showNotification(randomShout);
  }
  
  showNotification(text) {
    // Create floating notification
    const notification = document.createElement('div');
    notification.style.position = 'fixed';
    notification.style.top = '20%';
    notification.style.left = '50%';
    notification.style.transform = 'translateX(-50%)';
    notification.style.background = 'rgba(0, 0, 0, 0.8)';
    notification.style.color = '#FFD700';
    notification.style.padding = '15px 30px';
    notification.style.borderRadius = '10px';
    notification.style.fontSize = '24px';
    notification.style.fontWeight = 'bold';
    notification.style.zIndex = '10000';
    notification.style.animation = 'fadeInOut 3s ease-in-out';
    notification.textContent = text;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 3000);
  }
}

export default ConductorSystem;