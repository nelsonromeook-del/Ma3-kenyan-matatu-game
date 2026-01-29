/**
 * MA3 - GAME ENGINE
 * Three.js + Cannon.js physics engine
 * Enhanced with post-processing, time system, and particles
 */

import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import TimeSystem from '../systems/TimeSystem';
import DustSystem from '../particles/DustSystem';

export class GameEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.world = null;
    
    // Materials
    this.groundMaterial = null;
    this.wheelMaterial = null;
    
    // Lighting
    this.sun = null;
    this.ambient = null;
    
    // Input
    this.input = {
      forward: false,
      backward: false,
      left: false,
      right: false,
      brake: false,
      handbrake: false
    };
    
    // Camera
    this.cameraMode = 'chase';
    this.cameraDistance = 15;
    this.cameraHeight = 5;
    this.cameraOffset = new THREE.Vector3(0, this.cameraHeight, -this.cameraDistance);
    this.cameraVelocity = new THREE.Vector3();
    
    // Time
    this.clock = new THREE.Clock();
    this.delta = 0;
    this.fps = 60;
    this.frameCount = 0;
    this.lastFPSUpdate = 0;
    
    // Systems
    this.timeSystem = null;
    this.dustSystem = null;
    
    this.init();
  }
  
  init() {
    this.initScene();
    this.initRenderer();
    this.initCamera();
    this.initLighting();
    this.initPhysics();
    this.initInput();
    this.initTimeSystem();
    this.initParticles();
    
    console.log('🎮 Game Engine initialized');
  }
  
  initScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x87CEEB);
    this.scene.fog = new THREE.Fog(0x87CEEB, 50, 500);
    
    console.log('🌍 Scene created');
  }
  
  initRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: false
    });
    
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
    
    window.addEventListener('resize', () => this.onResize());
    
    console.log('🖼️ Renderer initialized');
  }
  
  initCamera() {
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    
    this.camera.position.set(0, 10, -20);
    this.camera.lookAt(0, 0, 0);
    
    console.log('📷 Camera ready');
  }
  
  initLighting() {
    // Ambient light
    this.ambient = new THREE.AmbientLight(0xffffff, 0.4);
    this.scene.add(this.ambient);
    
    // Directional light (sun)
    this.sun = new THREE.DirectionalLight(0xffffff, 1.5);
    this.sun.position.set(50, 100, 50);
    this.sun.castShadow = true;
    
    // Shadow settings
    this.sun.shadow.mapSize.width = 2048;
    this.sun.shadow.mapSize.height = 2048;
    this.sun.shadow.camera.near = 0.5;
    this.sun.shadow.camera.far = 500;
    this.sun.shadow.camera.left = -100;
    this.sun.shadow.camera.right = 100;
    this.sun.shadow.camera.top = 100;
    this.sun.shadow.camera.bottom = -100;
    
    this.scene.add(this.sun);
    
    // Hemisphere light (sky/ground)
    const hemiLight = new THREE.HemisphereLight(0x87CEEB, 0x8B7355, 0.5);
    this.scene.add(hemiLight);
    
    console.log('💡 Lighting setup complete');
  }
  
  initPhysics() {
    this.world = new CANNON.World({
      gravity: new CANNON.Vec3(0, -9.82, 0)
    });
    
    this.world.broadphase = new CANNON.SAPBroadphase(this.world);
    this.world.defaultContactMaterial.friction = 0.4;
    this.world.defaultContactMaterial.restitution = 0.3;
    
    // Materials
    this.groundMaterial = new CANNON.Material('ground');
    this.wheelMaterial = new CANNON.Material('wheel');
    
    // Contact materials
    const wheelGroundContact = new CANNON.ContactMaterial(
      this.wheelMaterial,
      this.groundMaterial,
      {
        friction: 0.8,
        restitution: 0.1,
        contactEquationStiffness: 1000
      }
    );
    
    this.world.addContactMaterial(wheelGroundContact);
    
    console.log('⚙️ Physics engine ready');
  }
  
  initInput() {
    window.addEventListener('keydown', (e) => {
      switch(e.key.toLowerCase()) {
        case 'w':
        case 'arrowup':
          this.input.forward = true;
          break;
        case 's':
        case 'arrowdown':
          this.input.backward = true;
          break;
        case 'a':
        case 'arrowleft':
          this.input.left = true;
          break;
        case 'd':
        case 'arrowright':
          this.input.right = true;
          break;
        case 'shift':
          this.input.brake = true;
          break;
        case ' ':
          e.preventDefault();
          this.input.handbrake = true;
          break;
        case 'c':
          this.changeCameraMode();
          break;
        case 'h':
          console.log('🎺 HOOOOORN!');
          break;
      }
    });
    
    window.addEventListener('keyup', (e) => {
      switch(e.key.toLowerCase()) {
        case 'w':
        case 'arrowup':
          this.input.forward = false;
          break;
        case 's':
        case 'arrowdown':
          this.input.backward = false;
          break;
        case 'a':
        case 'arrowleft':
          this.input.left = false;
          break;
        case 'd':
        case 'arrowright':
          this.input.right = false;
          break;
        case 'shift':
          this.input.brake = false;
          break;
        case ' ':
          this.input.handbrake = false;
          break;
      }
    });
    
    console.log('🎮 Input system ready');
  }
  
  initTimeSystem() {
    this.timeSystem = new TimeSystem(this.scene, this.sun);
    console.log('⏰ Time system initialized');
  }
  
  initParticles() {
    this.dustSystem = new DustSystem(this.scene);
    console.log('✨ Particle systems ready');
  }
  
  changeCameraMode() {
    const modes = ['chase', 'hood', 'drone', 'cinematic'];
    const currentIndex = modes.indexOf(this.cameraMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    this.cameraMode = modes[nextIndex];
    
    console.log(`📷 Camera mode: ${this.cameraMode}`);
  }
  
  updateCamera(vehicleMesh) {
    if (!vehicleMesh) return;
    
    const vehiclePos = vehicleMesh.position;
    const vehicleQuat = vehicleMesh.quaternion;
    
    switch(this.cameraMode) {
      case 'chase':
        this.updateChaseCamera(vehiclePos, vehicleQuat);
        break;
      case 'hood':
        this.updateHoodCamera(vehiclePos, vehicleQuat);
        break;
      case 'drone':
        this.updateDroneCamera(vehiclePos);
        break;
      case 'cinematic':
        this.updateCinematicCamera(vehiclePos, vehicleQuat);
        break;
    }
  }
  
  updateChaseCamera(vehiclePos, vehicleQuat) {
    // Calculate target position behind vehicle
    const offset = new THREE.Vector3(0, this.cameraHeight, -this.cameraDistance);
    offset.applyQuaternion(vehicleQuat);
    
    const targetPos = new THREE.Vector3().copy(vehiclePos).add(offset);
    
    // Smooth lerp
    this.camera.position.lerp(targetPos, 0.08);
    
    // Look at point slightly ahead of vehicle
    const lookAtOffset = new THREE.Vector3(0, 1, 5);
    lookAtOffset.applyQuaternion(vehicleQuat);
    const lookAtPos = new THREE.Vector3().copy(vehiclePos).add(lookAtOffset);
    
    this.camera.lookAt(lookAtPos);
  }
  
  updateHoodCamera(vehiclePos, vehicleQuat) {
    // Position camera inside vehicle (driver POV)
    const offset = new THREE.Vector3(0, 2, 1);
    offset.applyQuaternion(vehicleQuat);
    
    const targetPos = new THREE.Vector3().copy(vehiclePos).add(offset);
    this.camera.position.lerp(targetPos, 0.1);
    
    // Look forward
    const lookAtOffset = new THREE.Vector3(0, 1.5, 20);
    lookAtOffset.applyQuaternion(vehicleQuat);
    const lookAtPos = new THREE.Vector3().copy(vehiclePos).add(lookAtOffset);
    
    this.camera.lookAt(lookAtPos);
  }
  
  updateDroneCamera(vehiclePos) {
    // High aerial view
    const targetPos = new THREE.Vector3(
      vehiclePos.x,
      vehiclePos.y + 50,
      vehiclePos.z - 30
    );
    
    this.camera.position.lerp(targetPos, 0.05);
    this.camera.lookAt(vehiclePos);
  }
  
  updateCinematicCamera(vehiclePos, vehicleQuat) {
    // Side tracking shot
    const time = Date.now() * 0.0005;
    const radius = 20;
    
    const offset = new THREE.Vector3(
      Math.cos(time) * radius,
      10,
      Math.sin(time) * radius
    );
    
    const targetPos = new THREE.Vector3().copy(vehiclePos).add(offset);
    this.camera.position.lerp(targetPos, 0.03);
    this.camera.lookAt(vehiclePos);
  }
  
  update() {
    this.delta = Math.min(this.clock.getDelta(), 0.1);
    
    // Update physics
    this.world.step(1 / 60, this.delta, 3);
    
    // Update time system
    if (this.timeSystem) {
      this.timeSystem.update(this.delta);
    }
    
    // Update particle systems
    if (this.dustSystem) {
      this.dustSystem.update(this.delta);
    }
    
    // Calculate FPS
    this.frameCount++;
    const now = performance.now();
    if (now - this.lastFPSUpdate > 1000) {
      this.fps = Math.round((this.frameCount * 1000) / (now - this.lastFPSUpdate));
      this.frameCount = 0;
      this.lastFPSUpdate = now;
    }
  }
  
  render() {
    this.renderer.render(this.scene, this.camera);
  }
  
  addToScene(object) {
    this.scene.add(object);
  }
  
  removeFromScene(object) {
    this.scene.remove(object);
  }
  
  addToPhysics(body) {
    this.world.addBody(body);
  }
  
  removeFromPhysics(body) {
    this.world.removeBody(body);
  }
  
  getFPS() {
    return this.fps;
  }
  
  onResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    
    this.renderer.setSize(width, height);
  }
  
  dispose() {
    console.log('🗑️ Disposing game engine...');
    
    // Dispose renderer
    if (this.renderer) {
      this.renderer.dispose();
    }
    
    // Dispose time system
    if (this.timeSystem) {
      // TimeSystem doesn't need disposal
      this.timeSystem = null;
    }
    
    // Dispose particle systems
    if (this.dustSystem) {
      this.dustSystem.dispose();
    }
    
    // Clear scene
    if (this.scene) {
      this.scene.traverse((object) => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
    }
    
    // Remove event listeners
    window.removeEventListener('resize', this.onResize);
    
    console.log('✅ Game engine disposed');
  }
}

export default GameEngine;