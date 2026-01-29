/**
 * MA3 - DUST PARTICLES
 * Nairobi dust clouds when drifting/braking
 */

import * as THREE from 'three';

export class DustSystem {
  constructor(scene) {
    this.scene = scene;
    this.particlePool = [];
    this.activeParticles = [];
    this.maxParticles = 200;
    
    this.init();
  }
  
  init() {
    // Create particle pool
    for (let i = 0; i < this.maxParticles; i++) {
      const geometry = new THREE.SphereGeometry(0.3, 8, 8);
      const material = new THREE.MeshBasicMaterial({
        color: 0xD2B48C,
        transparent: true,
        opacity: 0.5
      });
      
      const particle = new THREE.Mesh(geometry, material);
      particle.visible = false;
      this.scene.add(particle);
      
      this.particlePool.push({
        mesh: particle,
        velocity: new THREE.Vector3(),
        life: 0
      });
    }
    
    console.log('💨 Dust system initialized');
  }
  
  emit(position, velocity, amount = 10) {
    for (let i = 0; i < amount; i++) {
      const particle = this.getInactiveParticle();
      if (!particle) break;
      
      // Set position
      particle.mesh.position.copy(position);
      particle.mesh.position.x += (Math.random() - 0.5) * 2;
      particle.mesh.position.y += Math.random() * 0.5;
      particle.mesh.position.z += (Math.random() - 0.5) * 2;
      
      // Set velocity
      particle.velocity.set(
        velocity.x * 0.2 + (Math.random() - 0.5) * 3,
        Math.random() * 2 + 1,
        velocity.z * 0.2 + (Math.random() - 0.5) * 3
      );
      
      // Set life
      particle.life = 1.0 + Math.random() * 0.5;
      
      // Make visible
      particle.mesh.visible = true;
      particle.mesh.material.opacity = 0.6;
      
      this.activeParticles.push(particle);
    }
  }
  
  getInactiveParticle() {
    for (const particle of this.particlePool) {
      if (!particle.mesh.visible) {
        return particle;
      }
    }
    return null;
  }
  
  update(delta) {
    for (let i = this.activeParticles.length - 1; i >= 0; i--) {
      const particle = this.activeParticles[i];
      
      // Update position
      particle.mesh.position.x += particle.velocity.x * delta;
      particle.mesh.position.y += particle.velocity.y * delta;
      particle.mesh.position.z += particle.velocity.z * delta;
      
      // Apply drag and gravity
      particle.velocity.y -= 9.8 * delta * 0.5;
      particle.velocity.multiplyScalar(0.95);
      
      // Fade out
      particle.life -= delta;
      particle.mesh.material.opacity = Math.max(0, particle.life * 0.6);
      
      // Scale up
      const scale = 1 + (1 - particle.life) * 2;
      particle.mesh.scale.set(scale, scale, scale);
      
      // Remove if dead
      if (particle.life <= 0) {
        particle.mesh.visible = false;
        this.activeParticles.splice(i, 1);
      }
    }
  }
  
  dispose() {
    for (const particle of this.particlePool) {
      this.scene.remove(particle.mesh);
      particle.mesh.geometry.dispose();
      particle.mesh.material.dispose();
    }
  }
}

export default DustSystem;