/**
 * MA3 - REALISTIC VEHICLE PHYSICS
 * Based on real car physics principles
 * Includes: suspension, tire grip, weight transfer, drifting, LED underglow, dust particles
 */

import * as THREE from 'three';
import * as CANNON from 'cannon-es';

export class VehiclePhysics {
  constructor(engine, matatuData) {
    this.engine = engine;
    this.matatuData = matatuData;
    
    this.mass = this.getMassFromType(matatuData.type);
    this.wheelBase = 2.5;
    this.wheelTrack = 1.5;
    this.centerOfMass = 0.8;
    
    this.maxSpeed = matatuData.specs.speed * 50;
    this.acceleration = matatuData.specs.handling === 'aggressive' ? 8 : 6;
    this.handling = this.getHandlingMultiplier(matatuData.specs.handling);
    
    this.chassisBody = null;
    this.vehicle = null;
    this.wheels = [];
    
    this.mesh = null;
    this.wheelMeshes = [];
    
    this.speed = 0;
    this.rpm = 0;
    this.gear = 1;
    this.steeringAngle = 0;
    this.isDrifting = false;
    
    // Underglow
    this.underglowLight = null;
    this.underglowMesh = null;
    
    this.init();
  }
  
  getMassFromType(type) {
    const masses = {
      'nganya': 1400,
      'sacco_matatu': 1600,
      'premium_bus': 3500,
      'classic_bus': 4500
    };
    return masses[type] || 1400;
  }
  
  getHandlingMultiplier(handling) {
    const multipliers = {
      'sharp': 1.3,
      'aggressive': 1.2,
      'balanced': 1.0,
      'smooth': 0.9,
      'stable': 0.8,
      'heavy': 0.6,
      'wild': 1.4
    };
    return multipliers[handling] || 1.0;
  }
  
  init() {
    this.createChassis();
    this.createVehicle();
    this.createWheels();
    this.createVisuals();
    
    console.log(`🚗 ${this.matatuData.name} physics initialized`);
    console.log(`   Mass: ${this.mass}kg, Max Speed: ${this.maxSpeed}km/h`);
  }
  
  createChassis() {
    const width = this.wheelTrack;
    const height = 1.5;
    const length = this.wheelBase * 1.8;
    
    const chassisShape = new CANNON.Box(
      new CANNON.Vec3(width / 2, height / 2, length / 2)
    );
    
    this.chassisBody = new CANNON.Body({
      mass: this.mass,
      shape: chassisShape,
      position: new CANNON.Vec3(0, 2, 0),
      material: this.engine.wheelMaterial
    });
    
    this.chassisBody.linearDamping = 0.1;
    this.chassisBody.angularDamping = 0.3;
    
    this.engine.addToPhysics(this.chassisBody);
  }
  
  createVehicle() {
    this.vehicle = new CANNON.RaycastVehicle({
      chassisBody: this.chassisBody,
      indexRightAxis: 0,
      indexUpAxis: 1,
      indexForwardAxis: 2
    });
    
    this.vehicle.addToWorld(this.engine.world);
  }
  
  createWheels() {
    const wheelOptions = {
      radius: 0.35,
      directionLocal: new CANNON.Vec3(0, -1, 0),
      suspensionStiffness: 30,
      suspensionRestLength: 0.3,
      frictionSlip: 4,
      dampingRelaxation: 2.3,
      dampingCompression: 4.4,
      maxSuspensionForce: 100000,
      rollInfluence: 0.01,
      axleLocal: new CANNON.Vec3(-1, 0, 0),
      chassisConnectionPointLocal: new CANNON.Vec3(1, 0, 1),
      maxSuspensionTravel: 0.3,
      customSlidingRotationalSpeed: -30,
      useCustomSlidingRotationalSpeed: true
    };
    
    const positions = [
      { x: -this.wheelTrack / 2, z: this.wheelBase / 2 },
      { x: this.wheelTrack / 2, z: this.wheelBase / 2 },
      { x: -this.wheelTrack / 2, z: -this.wheelBase / 2 },
      { x: this.wheelTrack / 2, z: -this.wheelBase / 2 }
    ];
    
    positions.forEach((pos, i) => {
      const options = { ...wheelOptions };
      options.chassisConnectionPointLocal = new CANNON.Vec3(pos.x, 0, pos.z);
      options.isFrontWheel = i < 2;
      this.vehicle.addWheel(options);
    });
  }
  
  createVisuals() {
    this.mesh = new THREE.Group();
    
    const chassisGeometry = new THREE.BoxGeometry(
      this.wheelTrack,
      1.5,
      this.wheelBase * 1.8
    );
    
    const chassisMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(this.matatuData.visual.primaryColor),
      metalness: 0.7,
      roughness: 0.3,
      envMapIntensity: 1.0
    });
    
    const chassisMesh = new THREE.Mesh(chassisGeometry, chassisMaterial);
    chassisMesh.castShadow = true;
    chassisMesh.receiveShadow = true;
    this.mesh.add(chassisMesh);
    
    this.addDecals(chassisMesh);
    
    const windowGeometry = new THREE.BoxGeometry(
      this.wheelTrack * 0.95,
      0.6,
      this.wheelBase * 1.2
    );
    
    const windowMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x88CCFF,
      metalness: 0.0,
      roughness: 0.1,
      transmission: 0.9,
      thickness: 0.5,
      opacity: 0.3,
      transparent: true
    });
    
    const windowMesh = new THREE.Mesh(windowGeometry, windowMaterial);
    windowMesh.position.y = 0.8;
    this.mesh.add(windowMesh);
    
    this.createWheelMeshes();
    this.addHeadlights();
    
    if (this.matatuData.visual.ledLights) {
      this.addUnderglow();
    }
    
    this.addRouteNumber();
    
    this.engine.addToScene(this.mesh);
  }
  
  addDecals(chassisMesh) {
    const stripeGeometry = new THREE.PlaneGeometry(0.3, this.wheelBase * 1.5);
    const stripeMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(this.matatuData.visual.secondaryColor),
      metalness: 0.8,
      roughness: 0.2
    });
    
    const leftStripe = new THREE.Mesh(stripeGeometry, stripeMaterial);
    leftStripe.position.set(-this.wheelTrack / 2 - 0.01, 0, 0);
    leftStripe.rotation.y = Math.PI / 2;
    this.mesh.add(leftStripe);
    
    const rightStripe = leftStripe.clone();
    rightStripe.position.x = this.wheelTrack / 2 + 0.01;
    this.mesh.add(rightStripe);
  }
  
  createWheelMeshes() {
    const wheelGeometry = new THREE.CylinderGeometry(0.35, 0.35, 0.3, 32);
    const wheelMaterial = new THREE.MeshStandardMaterial({
      color: 0x222222,
      metalness: 0.2,
      roughness: 0.8
    });
    
    const rimGeometry = new THREE.CylinderGeometry(0.25, 0.25, 0.32, 32);
    const rimColor = this.getRimColor();
    const rimMaterial = new THREE.MeshStandardMaterial({
      color: rimColor,
      metalness: 0.9,
      roughness: 0.1
    });
    
    for (let i = 0; i < 4; i++) {
      const wheelGroup = new THREE.Group();
      
      const tire = new THREE.Mesh(wheelGeometry, wheelMaterial);
      tire.rotation.z = Math.PI / 2;
      tire.castShadow = true;
      wheelGroup.add(tire);
      
      const rim = new THREE.Mesh(rimGeometry, rimMaterial);
      rim.rotation.z = Math.PI / 2;
      wheelGroup.add(rim);
      
      this.wheelMeshes.push(wheelGroup);
      this.mesh.add(wheelGroup);
    }
  }
  
  getRimColor() {
    const rimColors = {
      'chrome': 0xC0C0C0,
      'gold': 0xFFD700,
      'black': 0x000000,
      'silver': 0xAAAAAA,
      'pink': 0xFF69B4,
      'blue': 0x0066FF,
      'red': 0xFF0000,
      'orange': 0xFF6600,
      'purple': 0x9932CC
    };
    return rimColors[this.matatuData.visual.rimColor] || 0xC0C0C0;
  }
  
  addHeadlights() {
    const lightGeometry = new THREE.SphereGeometry(0.15, 16, 16);
    const lightMaterial = new THREE.MeshStandardMaterial({
      color: 0xFFFFAA,
      emissive: 0xFFFF00,
      emissiveIntensity: 2
    });
    
    const leftLight = new THREE.Mesh(lightGeometry, lightMaterial);
    leftLight.position.set(-this.wheelTrack / 3, 0.3, this.wheelBase);
    this.mesh.add(leftLight);
    
    const rightLight = leftLight.clone();
    rightLight.position.x = this.wheelTrack / 3;
    this.mesh.add(rightLight);
    
    const leftSpot = new THREE.SpotLight(0xFFFFAA, 2, 50, Math.PI / 6, 0.5);
    leftSpot.position.copy(leftLight.position);
    leftSpot.castShadow = true;
    this.mesh.add(leftSpot);
    
    const rightSpot = leftSpot.clone();
    rightSpot.position.copy(rightLight.position);
    this.mesh.add(rightSpot);
  }
  
  addUnderglow() {
    const glowColor = new THREE.Color(this.matatuData.visual.primaryColor);
    
    // Main underglow light
    const underglow = new THREE.PointLight(glowColor, 3, 8);
    underglow.position.y = -0.5;
    this.mesh.add(underglow);
    this.underglowLight = underglow;
    
    // Add glow mesh for visual effect
    const glowGeometry = new THREE.PlaneGeometry(this.wheelTrack * 1.2, this.wheelBase * 2);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: glowColor,
      transparent: true,
      opacity: 0.4,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending
    });
    
    const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
    glowMesh.rotation.x = -Math.PI / 2;
    glowMesh.position.y = -0.4;
    this.mesh.add(glowMesh);
    this.underglowMesh = glowMesh;
  }
  
  addRouteNumber() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, 256, 128);
    
    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 80px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.matatuData.routeNumber || '46', 128, 64);
    
    const texture = new THREE.CanvasTexture(canvas);
    const signMaterial = new THREE.MeshBasicMaterial({ map: texture });
    const signGeometry = new THREE.PlaneGeometry(0.6, 0.3);
    
    const routeSign = new THREE.Mesh(signGeometry, signMaterial);
    routeSign.position.set(0, 1.2, this.wheelBase * 0.9);
    this.mesh.add(routeSign);
  }
  
  update(input, delta) {
    if (!this.vehicle) return;
    
    const maxForce = this.mass * this.acceleration;
    let engineForce = 0;
    
    if (input.forward) {
      engineForce = maxForce;
      this.rpm = Math.min(this.rpm + delta * 3000, 7000);
    } else if (input.backward) {
      engineForce = -maxForce * 0.5;
      this.rpm = Math.min(this.rpm + delta * 2000, 5000);
    } else {
      this.rpm = Math.max(this.rpm - delta * 4000, 800);
    }
    
    let brakeForce = 0;
    if (input.brake) {
      brakeForce = this.mass * 10;
    }
    if (input.handbrake) {
      brakeForce = this.mass * 15;
      this.vehicle.setBrake(brakeForce, 2);
      this.vehicle.setBrake(brakeForce, 3);
      this.isDrifting = true;
    } else {
      this.isDrifting = false;
    }
    
    const maxSteerVal = 0.5 * this.handling;
    if (input.left) {
      this.steeringAngle = Math.min(this.steeringAngle + delta * 2, maxSteerVal);
    } else if (input.right) {
      this.steeringAngle = Math.max(this.steeringAngle - delta * 2, -maxSteerVal);
    } else {
      this.steeringAngle *= 0.9;
    }
    
    this.vehicle.setSteeringValue(this.steeringAngle, 0);
    this.vehicle.setSteeringValue(this.steeringAngle, 1);
    
    this.vehicle.applyEngineForce(engineForce, 2);
    this.vehicle.applyEngineForce(engineForce, 3);
    
    this.vehicle.setBrake(brakeForce, 0);
    this.vehicle.setBrake(brakeForce, 1);
    
    const velocity = this.chassisBody.velocity;
    this.speed = Math.sqrt(
      velocity.x * velocity.x + 
      velocity.z * velocity.z
    ) * 3.6;
    
    if (this.speed > this.maxSpeed) {
      const factor = this.maxSpeed / this.speed;
      this.chassisBody.velocity.scale(factor, this.chassisBody.velocity);
    }
    
    // Emit dust when drifting or braking hard
    if (this.isDrifting || (input.brake && this.speed > 30)) {
      const dustAmount = Math.min(Math.floor(this.speed / 10), 15);
      if (this.engine.dustSystem) {
        this.engine.dustSystem.emit(
          this.mesh.position.clone(),
          this.chassisBody.velocity,
          dustAmount
        );
      }
    }
    
    this.updateVisuals();
    
    // Enhanced underglow animation
    if (this.underglowLight) {
      const time = Date.now() * 0.003;
      const pulse = Math.sin(time) * 0.5 + 0.5; // 0 to 1
      
      // Pulse with speed
      const speedFactor = Math.min(this.speed / 100, 1);
      this.underglowLight.intensity = 2 + pulse * 2 + speedFactor;
      
      // Pulse the glow mesh too
      if (this.underglowMesh) {
        this.underglowMesh.material.opacity = 0.3 + pulse * 0.3;
      }
    }
  }
  
  updateVisuals() {
    this.mesh.position.copy(this.chassisBody.position);
    this.mesh.quaternion.copy(this.chassisBody.quaternion);
    
    for (let i = 0; i < this.vehicle.wheelInfos.length; i++) {
      this.vehicle.updateWheelTransform(i);
      const transform = this.vehicle.wheelInfos[i].worldTransform;
      
      this.wheelMeshes[i].position.copy(transform.position);
      this.wheelMeshes[i].quaternion.copy(transform.quaternion);
    }
  }
  
  getSpeed() {
    return this.speed;
  }
  
  getRPM() {
    return this.rpm;
  }
  
  getGear() {
    if (this.speed < 20) return 1;
    if (this.speed < 40) return 2;
    if (this.speed < 60) return 3;
    if (this.speed < 80) return 4;
    return 5;
  }
  
  getPosition() {
    return this.mesh.position;
  }
  
  getQuaternion() {
    return this.mesh.quaternion;
  }
  
  reset(position) {
    this.chassisBody.position.copy(position);
    this.chassisBody.velocity.set(0, 0, 0);
    this.chassisBody.angularVelocity.set(0, 0, 0);
    this.chassisBody.quaternion.setFromEuler(0, 0, 0);
    this.speed = 0;
    this.rpm = 800;
  }
  
  dispose() {
    try {
      // Remove physics body
      if (this.chassisBody && this.engine && this.engine.world) {
        this.engine.removeFromPhysics(this.chassisBody);
      }
      
      // Remove visual mesh
      if (this.mesh && this.engine) {
        this.engine.removeFromScene(this.mesh);
      }
      
      // Remove vehicle from world (safely)
      if (this.vehicle && this.vehicle.world) {
        this.vehicle.removeFromWorld();
      }
      
      console.log('🗑️ Vehicle disposed successfully');
    } catch (error) {
      console.warn('⚠️ Error disposing vehicle:', error.message);
    }
  }
}

export default VehiclePhysics;