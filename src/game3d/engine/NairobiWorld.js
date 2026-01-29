/**
 * MA3 - NAIROBI WORLD
 * Generates the Nairobi environment
 */

import * as THREE from 'three';
import * as CANNON from 'cannon-es';

export class NairobiWorld {
  constructor(engine) {
    this.engine = engine;
    this.ground = null;
    this.buildings = [];
    
    this.init();
  }
  
  init() {
    this.createGround();
    this.createBuildings();
    this.createRoad();
    
    console.log('🏙️ Nairobi world created');
  }
  
  createGround() {
    // Physics ground
    const groundShape = new CANNON.Plane();
    const groundBody = new CANNON.Body({
      mass: 0,
      shape: groundShape,
      material: this.engine.groundMaterial
    });
    groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
    this.engine.addToPhysics(groundBody);
    
    // Visual ground
    const groundGeometry = new THREE.PlaneGeometry(1000, 1000);
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: 0x8B7355,
      roughness: 0.9,
      metalness: 0.1
    });
    
    this.ground = new THREE.Mesh(groundGeometry, groundMaterial);
    this.ground.rotation.x = -Math.PI / 2;
    this.ground.receiveShadow = true;
    this.engine.addToScene(this.ground);
  }
  
  createRoad() {
    const roadGeometry = new THREE.PlaneGeometry(20, 1000);
    const roadMaterial = new THREE.MeshStandardMaterial({
      color: 0x2C2C2C,
      roughness: 0.8,
      metalness: 0.2
    });
    
    const road = new THREE.Mesh(roadGeometry, roadMaterial);
    road.rotation.x = -Math.PI / 2;
    road.position.y = 0.01;
    road.receiveShadow = true;
    this.engine.addToScene(road);
    
    // Lane markings
    const laneMarkingGeometry = new THREE.PlaneGeometry(0.3, 5);
    const laneMarkingMaterial = new THREE.MeshBasicMaterial({
      color: 0xFFFF00
    });
    
    for (let i = -100; i < 100; i += 3) {
      const marking = new THREE.Mesh(laneMarkingGeometry, laneMarkingMaterial);
      marking.rotation.x = -Math.PI / 2;
      marking.position.set(0, 0.02, i * 5);
      this.engine.addToScene(marking);
    }
  }
  
  createBuildings() {
    const buildingCount = 20;
    
    for (let i = 0; i < buildingCount; i++) {
      const height = Math.random() * 30 + 10;
      const width = Math.random() * 8 + 5;
      const depth = Math.random() * 8 + 5;
      
      const geometry = new THREE.BoxGeometry(width, height, depth);
      const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(
          Math.random() * 0.3 + 0.4,
          Math.random() * 0.3 + 0.4,
          Math.random() * 0.3 + 0.4
        ),
        roughness: 0.7,
        metalness: 0.3
      });
      
      const building = new THREE.Mesh(geometry, material);
      
      const side = Math.random() > 0.5 ? 1 : -1;
      building.position.x = side * (30 + Math.random() * 50);
      building.position.y = height / 2;
      building.position.z = (Math.random() - 0.5) * 500;
      
      building.castShadow = true;
      building.receiveShadow = true;
      
      this.engine.addToScene(building);
      this.buildings.push(building);
    }
  }
  
  getSpawnPosition() {
    return new CANNON.Vec3(0, 2, 0);
  }
  
  dispose() {
    if (this.ground) {
      this.engine.removeFromScene(this.ground);
      this.ground.geometry.dispose();
      this.ground.material.dispose();
    }
    
    this.buildings.forEach(building => {
      this.engine.removeFromScene(building);
      building.geometry.dispose();
      building.material.dispose();
    });
  }
}

export default NairobiWorld;