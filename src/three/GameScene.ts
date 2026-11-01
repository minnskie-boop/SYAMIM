import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { StageConfig, HeroType, ZombieType, PlacedHero, ZombieInstance, ProjectileInstance, IqBulbInstance, LawnCleanerInstance } from '../types/game';
import { createHeroModel, createZombieModel, createLawnMowerModel, createIqBulbModel, createProjectileModel, createAcidPuddleModel } from './models';
import { buildStageEnvironment, EnvironmentObjects } from './stageEnvironment';

export interface GridCoord {
  row: number;
  col: number;
}

export class GameScene {
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;
  public renderer: THREE.WebGLRenderer;
  private container: HTMLElement;
  private isSoftwareGl: boolean = false;
  private envObjects: EnvironmentObjects | null = null;

  // Grid dimensions
  public readonly gridRows = 5;
  public readonly gridCols = 9;
  public readonly cellWidth = 1.3;
  public readonly cellDepth = 1.3;
  public readonly originX: number;
  public readonly originZ: number;

  // Interaction
  private raycaster = new THREE.Raycaster();
  private pointer = new THREE.Vector2();
  private groundPlaneMesh: THREE.Mesh;
  private hoverTileMesh: THREE.Mesh;

  // Animation frame
  private frameId: number = 0;
  private clock = new THREE.Clock();
  private isDestroyed = false;

  // Callbacks
  public onTileClick?: (coord: GridCoord) => void;
  public onIqBulbClick?: (bulbId: string) => void;

  constructor(container: HTMLElement, stageConfig: StageConfig) {
    this.container = container;
    this.originX = -((this.gridCols * this.cellWidth) / 2) + this.cellWidth / 2;
    this.originZ = -((this.gridRows * this.cellDepth) / 2) + this.cellDepth / 2;

    // 1. Detect software WebGL
    this.isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // 2. Setup Scene & Camera
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(
      stageConfig.envType === 'field_day'
        ? 0x87ceeb
        : stageConfig.envType === 'court_sunset'
        ? 0xf97316
        : stageConfig.envType === 'pool_aqua'
        ? 0x38bdf8
        : stageConfig.envType === 'hall_night'
        ? 0x0f172a
        : 0x1e293b
    );
    this.scene.fog = new THREE.FogExp2(this.scene.background.getHex(), 0.025);

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    // Angled PVZ 3D isometric perspective
    this.camera.position.set(0, 11, 11.5);
    this.camera.lookAt(0, 0, 0.5);

    // 3. Renderer configuration
    this.renderer = new THREE.WebGLRenderer({
      antialias: !this.isSoftwareGl,
      powerPreference: 'high-performance',
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(this.isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.renderer.shadowMap.enabled = !this.isSoftwareGl;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(this.renderer.domElement);

    // 4. Studio Environment Lighting (RoomEnvironment)
    const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
    this.scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 3-Point Studio Rig: Warm Key Light with tight shadows + Cool Hemisphere Fill
    const dirLight = new THREE.DirectionalLight(0xfffaed, 1.8);
    dirLight.position.set(6, 14, 8);
    dirLight.castShadow = !this.isSoftwareGl;
    if (dirLight.castShadow) {
      dirLight.shadow.mapSize.width = 1024;
      dirLight.shadow.mapSize.height = 1024;
      dirLight.shadow.camera.near = 0.5;
      dirLight.shadow.camera.far = 35;
      const d = 10;
      dirLight.shadow.camera.left = -d;
      dirLight.shadow.camera.right = d;
      dirLight.shadow.camera.top = d;
      dirLight.shadow.camera.bottom = -d;
      dirLight.shadow.bias = -0.0005;
      dirLight.shadow.normalBias = 0.02;
    }
    this.scene.add(dirLight);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.8);
    hemiLight.position.set(0, 20, 0);
    this.scene.add(hemiLight);

    // 5. Build Environment
    this.envObjects = buildStageEnvironment(
      this.scene,
      stageConfig,
      this.gridRows,
      this.gridCols,
      this.cellWidth,
      this.cellDepth
    );

    // 6. Invisible Ground Raycast Plane & Hover Indicator
    const groundGeo = new THREE.PlaneGeometry(this.gridCols * this.cellWidth, this.gridRows * this.cellDepth);
    this.groundPlaneMesh = new THREE.Mesh(groundGeo, new THREE.MeshBasicMaterial({ visible: false }));
    this.groundPlaneMesh.rotation.x = -Math.PI / 2;
    this.groundPlaneMesh.position.y = 0.01;
    this.scene.add(this.groundPlaneMesh);

    // Tile hover highlight
    const hoverGeo = new THREE.PlaneGeometry(this.cellWidth * 0.95, this.cellDepth * 0.95);
    const hoverMat = new THREE.MeshBasicMaterial({
      color: 0xfacc15,
      transparent: true,
      opacity: 0.25,
      side: THREE.DoubleSide,
    });
    this.hoverTileMesh = new THREE.Mesh(hoverGeo, hoverMat);
    this.hoverTileMesh.rotation.x = -Math.PI / 2;
    this.hoverTileMesh.position.y = 0.04;
    this.hoverTileMesh.visible = false;
    this.scene.add(this.hoverTileMesh);

    // Events
    window.addEventListener('resize', this.onWindowResize);
    this.container.addEventListener('pointermove', this.onPointerMove);
    this.container.addEventListener('pointerdown', this.onPointerDown);

    // Start loop
    this.tick();
  }

  // Convert row and col to world position
  public getTileWorldPos(row: number, col: number): THREE.Vector3 {
    return new THREE.Vector3(
      this.originX + col * this.cellWidth,
      0,
      this.originZ + row * this.cellDepth
    );
  }

  // Convert row and continuous X grid float to world position
  public getGridWorldPos(row: number, gridX: number): THREE.Vector3 {
    return new THREE.Vector3(
      this.originX + gridX * this.cellWidth,
      0,
      this.originZ + row * this.cellDepth
    );
  }

  // Pointer move for tile highlight
  private onPointerMove = (e: MouseEvent) => {
    const rect = this.container.getBoundingClientRect();
    this.pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.pointer, this.camera);
    const intersects = this.raycaster.intersectObject(this.groundPlaneMesh);

    if (intersects.length > 0) {
      const pt = intersects[0].point;
      const col = Math.floor((pt.x - (this.originX - this.cellWidth / 2)) / this.cellWidth);
      const row = Math.floor((pt.z - (this.originZ - this.cellDepth / 2)) / this.cellDepth);

      if (row >= 0 && row < this.gridRows && col >= 0 && col < this.gridCols) {
        const tilePos = this.getTileWorldPos(row, col);
        this.hoverTileMesh.position.x = tilePos.x;
        this.hoverTileMesh.position.z = tilePos.z;
        this.hoverTileMesh.visible = true;
        return;
      }
    }
    this.hoverTileMesh.visible = false;
  };

  // Pointer click for placing heroes or collecting IQ bulbs
  private onPointerDown = (e: MouseEvent) => {
    const rect = this.container.getBoundingClientRect();
    this.pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.pointer, this.camera);

    // First check if clicked on an IQ Bulb
    const bulbHits = this.raycaster.intersectObjects(this.scene.children, true);
    for (const hit of bulbHits) {
      let curr: THREE.Object3D | null = hit.object;
      let foundBulbId: string | null = null;
      while (curr && curr !== this.scene) {
        if ((curr as any).bulbId) {
          foundBulbId = (curr as any).bulbId;
          break;
        }
        curr = curr.parent;
      }
      if (foundBulbId && this.onIqBulbClick) {
        this.onIqBulbClick(foundBulbId);
        return;
      }
    }

    // Otherwise check ground click
    const groundHits = this.raycaster.intersectObject(this.groundPlaneMesh);
    if (groundHits.length > 0) {
      const pt = groundHits[0].point;
      const col = Math.floor((pt.x - (this.originX - this.cellWidth / 2)) / this.cellWidth);
      const row = Math.floor((pt.z - (this.originZ - this.cellDepth / 2)) / this.cellDepth);

      if (row >= 0 && row < this.gridRows && col >= 0 && col < this.gridCols) {
        if (this.onTileClick) {
          this.onTileClick({ row, col });
        }
      }
    }
  };

  private onWindowResize = () => {
    if (!this.container || this.isDestroyed) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  };

  // Paced loop for software WebGL guard
  private afterDraw = (cb: () => void) => {
    const gl = this.renderer.getContext() as WebGL2RenderingContext;
    const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
    gl.flush();
    const poll = () => {
      const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
      if (state === gl.UNSIGNALED) {
        this.frameId = window.setTimeout(poll, 5);
      } else {
        if (sync) gl.deleteSync(sync);
        this.frameId = window.setTimeout(cb, 70);
      }
    };
    this.frameId = window.setTimeout(poll, 5);
  };

  private tick = () => {
    if (this.isDestroyed) return;
    const delta = Math.min(this.clock.getDelta(), 0.1);
    const elapsedTime = this.clock.getElapsedTime();

    if (this.envObjects) {
      this.envObjects.update(delta, elapsedTime);
    }

    this.renderer.render(this.scene, this.camera);

    if (this.isSoftwareGl) {
      this.afterDraw(this.tick);
    } else {
      this.frameId = requestAnimationFrame(this.tick);
    }
  };

  public dispose() {
    this.isDestroyed = true;
    cancelAnimationFrame(this.frameId);
    clearTimeout(this.frameId);
    window.removeEventListener('resize', this.onWindowResize);
    this.container.removeEventListener('pointermove', this.onPointerMove);
    this.container.removeEventListener('pointerdown', this.onPointerDown);

    if (this.envObjects) {
      this.envObjects.cleanup();
    }

    this.renderer.dispose();
    if (this.renderer.domElement.parentElement) {
      this.renderer.domElement.parentElement.removeChild(this.renderer.domElement);
    }
  }
}
