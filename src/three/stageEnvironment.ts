import * as THREE from 'three';
import { StageConfig } from '../types/game';

export interface EnvironmentObjects {
  cleanup: () => void;
  update: (delta: number, time: number) => void;
  setLightning?: (intensity: number) => void;
}

export function buildStageEnvironment(
  scene: THREE.Scene,
  stageConfig: StageConfig,
  gridRows: number = 5,
  gridCols: number = 9,
  cellWidth: number = 1.3,
  cellDepth: number = 1.3
): EnvironmentObjects {
  const envGroup = new THREE.Group();
  envGroup.name = 'stage_environment';
  scene.add(envGroup);

  const totalWidth = gridCols * cellWidth;
  const totalDepth = gridRows * cellDepth;
  const originX = -totalWidth / 2 + cellWidth / 2;
  const originZ = -totalDepth / 2 + cellDepth / 2;

  let rainParticles: THREE.Points | null = null;
  let waterMeshes: THREE.Mesh[] = [];

  // 1. Grid Tiles (Checkerboard subtle texture for clear placement)
  const isPool = stageConfig.envType === 'pool_aqua';

  for (let r = 0; r < gridRows; r++) {
    const isWaterRow = isPool && stageConfig.waterRows?.includes(r);

    for (let c = 0; c < gridCols; c++) {
      const tileX = originX + c * cellWidth;
      const tileZ = originZ + r * cellDepth;

      if (isWaterRow) {
        // Sparkling swimming pool water
        const waterGeo = new THREE.PlaneGeometry(cellWidth * 0.98, cellDepth * 0.98);
        const waterMat = new THREE.MeshStandardMaterial({
          color: 0x0284c7,
          roughness: 0.1,
          metalness: 0.2,
          transparent: true,
          opacity: 0.85,
        });
        const waterTile = new THREE.Mesh(waterGeo, waterMat);
        waterTile.rotation.x = -Math.PI / 2;
        waterTile.position.set(tileX, 0.01, tileZ);
        waterTile.receiveShadow = true;
        envGroup.add(waterTile);
        waterMeshes.push(waterTile);

        // Pool floor under water
        const poolFloor = new THREE.Mesh(
          new THREE.PlaneGeometry(cellWidth, cellDepth),
          new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.6 })
        );
        poolFloor.rotation.x = -Math.PI / 2;
        poolFloor.position.set(tileX, -0.05, tileZ);
        envGroup.add(poolFloor);
      } else {
        // Ground tile based on stage theme
        let tileColor1 = 0x4ade80;
        let tileColor2 = 0x22c55e;

        if (stageConfig.envType === 'court_sunset') {
          tileColor1 = 0xf97316;
          tileColor2 = 0xea580c;
        } else if (stageConfig.envType === 'hall_night') {
          tileColor1 = 0xa16207;
          tileColor2 = 0x854d0e;
        } else if (stageConfig.envType === 'roof_storm') {
          tileColor1 = 0x475569;
          tileColor2 = 0x334155;
        }

        const isEven = (r + c) % 2 === 0;
        const tileMat = new THREE.MeshStandardMaterial({
          color: isEven ? tileColor1 : tileColor2,
          roughness: 0.7,
        });

        const tileMesh = new THREE.Mesh(
          new THREE.PlaneGeometry(cellWidth * 0.96, cellDepth * 0.96),
          tileMat
        );
        tileMesh.rotation.x = -Math.PI / 2;
        tileMesh.position.set(tileX, 0.01, tileZ);
        tileMesh.receiveShadow = true;
        envGroup.add(tileMesh);
      }
    }
  }

  // 2. Outer Perimeter & Ground Plate
  const groundBaseGeo = new THREE.PlaneGeometry(totalWidth + 14, totalDepth + 14);
  let baseColor = 0x166534;
  if (stageConfig.envType === 'court_sunset') baseColor = 0xc2410c;
  if (stageConfig.envType === 'pool_aqua') baseColor = 0x0369a1;
  if (stageConfig.envType === 'hall_night') baseColor = 0x3f2d1d;
  if (stageConfig.envType === 'roof_storm') baseColor = 0x1e293b;

  const groundBase = new THREE.Mesh(
    groundBaseGeo,
    new THREE.MeshStandardMaterial({ color: baseColor, roughness: 0.8 })
  );
  groundBase.rotation.x = -Math.PI / 2;
  groundBase.position.y = 0;
  groundBase.receiveShadow = true;
  envGroup.add(groundBase);

  // 3. Environment Props (School Buildings, Fences, Goalposts, Floodlights)
  if (stageConfig.envType === 'field_day') {
    // School Building in background
    const schoolBlock = new THREE.Mesh(
      new THREE.BoxGeometry(totalWidth + 10, 4, 2),
      new THREE.MeshStandardMaterial({ color: 0xfde047, roughness: 0.8 })
    );
    schoolBlock.position.set(0, 2, -totalDepth / 2 - 4.5);
    schoolBlock.castShadow = true;
    schoolBlock.receiveShadow = true;
    envGroup.add(schoolBlock);

    // Roof of school
    const roof = new THREE.Mesh(
      new THREE.ConeGeometry(totalWidth * 0.7, 2, 4),
      new THREE.MeshStandardMaterial({ color: 0x991b1b, roughness: 0.7 })
    );
    roof.position.set(0, 5, -totalDepth / 2 - 4.5);
    roof.rotation.y = Math.PI / 4;
    envGroup.add(roof);

    // Goalposts and decorative trees
    for (let tz of [-totalDepth / 2 - 2, totalDepth / 2 + 2]) {
      for (let tx of [-totalWidth / 2 - 2, totalWidth / 2 + 2]) {
        const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.2, 1.2, 6), new THREE.MeshStandardMaterial({ color: 0x78350f }));
        trunk.position.set(tx, 0.6, tz);
        const foliage = new THREE.Mesh(new THREE.SphereGeometry(0.7, 8, 8), new THREE.MeshStandardMaterial({ color: 0x15803d }));
        foliage.position.set(tx, 1.5, tz);
        envGroup.add(trunk, foliage);
      }
    }
  } else if (stageConfig.envType === 'court_sunset') {
    // Court floodlight poles
    for (let cx of [-totalWidth / 2 - 1.5, totalWidth / 2 + 1.5]) {
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 4.5, 8), new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.6 }));
      pole.position.set(cx, 2.25, 0);
      const lamp = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.2, 0.3), new THREE.MeshStandardMaterial({ color: 0xfef08a, emissive: 0xfef08a, emissiveIntensity: 0.8 }));
      lamp.position.set(cx, 4.4, 0);
      envGroup.add(pole, lamp);
    }
  } else if (stageConfig.envType === 'roof_storm') {
    // Rain Particles
    const rainCount = 1200;
    const rainGeo = new THREE.BufferGeometry();
    const rainPos = new Float32Array(rainCount * 3);
    for (let i = 0; i < rainCount; i++) {
      rainPos[i * 3] = (Math.random() - 0.5) * 25;
      rainPos[i * 3 + 1] = Math.random() * 15;
      rainPos[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    rainGeo.setAttribute('position', new THREE.BufferAttribute(rainPos, 3));
    const rainMat = new THREE.PointsMaterial({
      color: 0x93c5fd,
      size: 0.08,
      transparent: true,
      opacity: 0.6,
    });
    rainParticles = new THREE.Points(rainGeo, rainMat);
    envGroup.add(rainParticles);
  }

  return {
    cleanup: () => {
      scene.remove(envGroup);
    },
    update: (delta: number, time: number) => {
      // Animate water ripples
      if (waterMeshes.length > 0) {
        waterMeshes.forEach((wm, idx) => {
          (wm.material as THREE.MeshStandardMaterial).opacity = 0.8 + Math.sin(time * 3 + idx) * 0.1;
        });
      }
      // Animate rain falling down
      if (rainParticles) {
        const positions = rainParticles.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < positions.length / 3; i++) {
          positions[i * 3 + 1] -= delta * 18;
          if (positions[i * 3 + 1] < 0) {
            positions[i * 3 + 1] = 14;
          }
        }
        rainParticles.geometry.attributes.position.needsUpdate = true;
      }
    },
  };
}
