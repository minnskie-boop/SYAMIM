import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import confetti from 'canvas-confetti';
import {
  HeroType,
  ZombieType,
  PlacedHero,
  ZombieInstance,
  ProjectileInstance,
  AcidPuddle,
  LawnCleanerInstance,
  IqBulbInstance,
  StageConfig,
  PlayerProfile,
  MathQuestion,
} from './types/game';
import { GameScene, GridCoord } from './three/GameScene';
import {
  createHeroModel,
  createZombieModel,
  createLawnMowerModel,
  createIqBulbModel,
  createProjectileModel,
  createAcidPuddleModel,
} from './three/models';
import { generateQuestionForStage } from './math/dskpQuestions';
import { soundManager } from './audio/sound';
import { HUD } from './components/HUD';
import { HeroDeckModal, ALL_HERO_DEFS } from './components/HeroDeckModal';
import { MathQuestionModal } from './components/MathQuestionModal';
import { HelpTipsModal } from './components/HelpTipsModal';
import { ScoreboardModal } from './components/ScoreboardModal';
import {
  Sparkles,
  Trophy,
  Play,
  RotateCcw,
  CheckCircle,
  AlertTriangle,
  HelpCircle,
  GraduationCap,
} from 'lucide-react';

// Stages configuration
const STAGE_CONFIGS: StageConfig[] = [
  {
    stageNumber: 1,
    title: 'Padang Sekolah (Siang)',
    themeName: 'Padang Hijau & Trek Larian',
    description: 'Kuasai anggaran grid dan luas Segi Tiga [1/2 × t × h] serta Segi Empat Selari [t × h].',
    envType: 'field_day',
    cleanerName: 'Pembaris Besi 1 Meter 3D',
    allowedHeroCount: 7,
    totalWaves: 4,
    zombieTypes: ['zombi_ponteng', 'zombi_merentas_desa', 'zombi_meja_kerusi'],
    bossType: 'boss_olahragawan',
    bossName: 'Bos Zombi Olahragawan 3D',
    bossHp: 1600,
  },
  {
    stageNumber: 2,
    title: 'Gelanggang Sukan (Petang)',
    themeName: 'Gelanggang Marmar Serbaguna',
    description: 'Segi Empat Selari dan Segi Tiga lanjutan di bawah pencahayaan senja sekolah.',
    envType: 'court_sunset',
    cleanerName: 'Troli Bola Sukan 3D',
    allowedHeroCount: 7,
    totalWaves: 4,
    zombieTypes: ['zombi_ponteng', 'zombi_meja_kerusi', 'zombi_merentas_desa', 'zombi_skateboard'],
    bossType: 'boss_kapten_korporal',
    bossName: 'Bos Zombi Kapten Korporal 3D',
    bossHp: 2200,
  },
  {
    stageNumber: 3,
    title: 'Kolam Renang Akuatik Sekolah',
    themeName: 'Zon Air & Laluan Pelampung',
    description: 'Lorong 2 & 3 ialah air! Kuasai luas Lelayang [1/2 × d1 × d2] dan Trapezium [1/2 × (a+b) × h].',
    envType: 'pool_aqua',
    cleanerName: 'Pembersih Kolam Otomatik 3D',
    hasWaterLanes: true,
    waterRows: [1, 2], // rows 1 & 2 are swimming pool water
    allowedHeroCount: 7,
    totalWaves: 4,
    zombieTypes: ['zombi_ponteng', 'zombi_skateboard', 'zombi_pembuli'],
    bossType: 'boss_sotong_gergasi',
    bossName: 'Bos Zombi Sotong Gergasi 3D',
    bossHp: 2800,
  },
  {
    stageNumber: 4,
    title: 'Dewan Terbuka Sekolah (Malam & Pentas)',
    themeName: 'Pentas Kayu Bertingkat',
    description: 'Pertahankan pentas dewan malam daripada Zombi Guru Disiplin Pencen!',
    envType: 'hall_night',
    cleanerName: 'Troli PA System 3D',
    allowedHeroCount: 7,
    totalWaves: 4,
    zombieTypes: ['zombi_meja_kerusi', 'zombi_pembuli', 'zombi_skateboard'],
    bossType: 'boss_guru_disiplin',
    bossName: 'Bos Zombi Guru Disiplin Pencen 3D',
    bossHp: 3400,
  },
  {
    stageNumber: 5,
    title: 'Pejabat Pengetua & Bumbung (Final)',
    themeName: 'Ribut Petir & Pertempuran Muktamad',
    description: 'Perang Matematik Menentang Prof. "Zero Markah"! Pecahkan Perisai Trapezium 3D!',
    envType: 'roof_storm',
    cleanerName: 'Troli Buku PSS Gergasi 3D',
    allowedHeroCount: 8,
    totalWaves: 4,
    zombieTypes: ['zombi_ponteng', 'zombi_meja_kerusi', 'zombi_merentas_desa', 'zombi_pembuli', 'zombi_skateboard'],
    bossType: 'boss_prof_zero',
    bossName: 'Prof. "Zero Markah" 3D',
    bossHp: 4200,
  },
];

export default function App() {
  // App screen flow (support ?autostart=1 for instant testability)
  const [screen, setScreen] = useState<'welcome' | 'deck' | 'playing' | 'victory' | 'gameover'>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('autostart') === '1' ? 'playing' : 'welcome';
  });
  const [currentStageIndex, setCurrentStageIndex] = useState<number>(0);
  const currentStage = STAGE_CONFIGS[currentStageIndex];

  // Student Profile state
  const [studentName, setStudentName] = useState<string>(() => localStorage.getItem('msd_studentName') || '');
  const [className, setClassName] = useState<string>(() => localStorage.getItem('msd_className') || '1 Amanah');
  const [playerProfile, setPlayerProfile] = useState<PlayerProfile>(() => {
    const saved = localStorage.getItem('msd_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      studentName: '',
      className: '1 Amanah',
      totalScore: 0,
      mathCorrect: 0,
      mathAttempted: 0,
      stagesCompleted: 0,
      stageHighScores: {},
    };
  });

  // Selected hero deck (default 7 heroes)
  const [selectedHeroes, setSelectedHeroes] = useState<HeroType[]>([
    'cikgu_math',
    'jaguh_lembing',
    'cikgu_pj',
    'budak_taekwondo',
    'pengawas_pss',
    'abang_kantin',
    'budak_sains',
  ]);

  // Game gameplay states
  const [iqPower, setIqPower] = useState<number>(100);
  const [score, setScore] = useState<number>(0);
  const [currentWave, setCurrentWave] = useState<number>(1);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [shovelActive, setShovelActive] = useState<boolean>(false);
  const [activeHeroToPlace, setActiveHeroToPlace] = useState<HeroType | null>(null);

  // Modals
  const [showHelp, setShowHelp] = useState<boolean>(false);
  const [showScoreboard, setShowScoreboard] = useState<boolean>(false);
  const [activeMathQuestion, setActiveMathQuestion] = useState<MathQuestion | null>(null);
  const [inkBlinded, setInkBlinded] = useState<boolean>(false);
  const [bulbCount, setBulbCount] = useState<number>(0);

  // Boss tracking
  const [bossHp, setBossHp] = useState<number | undefined>(undefined);
  const [bossMaxHp, setBossMaxHp] = useState<number | undefined>(undefined);
  const [bossPhase, setBossPhase] = useState<number>(1);
  const [profConsecutiveCorrect, setProfConsecutiveCorrect] = useState<number>(0);

  // Hero Cooldowns
  const [heroCooldowns, setHeroCooldowns] = useState<Record<HeroType, number>>({} as any);

  // Three.js Mount reference
  const canvasMountRef = useRef<HTMLDivElement>(null);
  const gameSceneRef = useRef<GameScene | null>(null);

  // Game Engine entities refs (mutables to avoid React render churn)
  const heroesRef = useRef<PlacedHero[]>([]);
  const zombiesRef = useRef<ZombieInstance[]>([]);
  const projectilesRef = useRef<ProjectileInstance[]>([]);
  const acidPuddlesRef = useRef<AcidPuddle[]>([]);
  const lawnCleanersRef = useRef<LawnCleanerInstance[]>([]);
  const iqBulbsRef = useRef<IqBulbInstance[]>([]);

  // Timing & execution refs
  const isPausedRef = useRef<boolean>(false);
  const isMathModalOpenRef = useRef<boolean>(false);
  const speedMultiplierRef = useRef<number>(1);
  const lastSkyBulbDropTimeRef = useRef<number>(Date.now());
  const nextWaveSpawnTimeRef = useRef<number>(Date.now() + 8000);
  const isLoopRunningRef = useRef<boolean>(false);

  // Keep refs in sync with state
  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);
  useEffect(() => {
    isMathModalOpenRef.current = !!activeMathQuestion;
  }, [activeMathQuestion]);
  useEffect(() => {
    speedMultiplierRef.current = speedMultiplier;
  }, [speedMultiplier]);

  // Sync profile storage
  useEffect(() => {
    localStorage.setItem('msd_studentName', studentName);
    localStorage.setItem('msd_className', className);
    setPlayerProfile((prev) => {
      const updated = { ...prev, studentName, className };
      localStorage.setItem('msd_profile', JSON.stringify(updated));
      return updated;
    });
  }, [studentName, className]);

  // Adjust default deck on Stage 3 to include Pelampung Sekolah
  useEffect(() => {
    if (currentStage.hasWaterLanes && !selectedHeroes.includes('pelampung_sekolah')) {
      setSelectedHeroes((prev) => ['pelampung_sekolah', ...prev.slice(0, 6)]);
    }
  }, [currentStageIndex, currentStage.hasWaterLanes]);

  // Initialize Three.js scene when playing screen starts
  useEffect(() => {
    if (screen !== 'playing') return;
    if (!canvasMountRef.current) return;

    // Reset game entities
    heroesRef.current = [];
    zombiesRef.current = [];
    projectilesRef.current = [];
    acidPuddlesRef.current = [];
    iqBulbsRef.current = [];
    setIqPower(currentStage.stageNumber === 1 ? 125 : 150);
    setCurrentWave(1);
    setBossHp(undefined);
    setBossMaxHp(undefined);
    setBossPhase(1);
    setProfConsecutiveCorrect(0);
    lastSkyBulbDropTimeRef.current = Date.now();
    nextWaveSpawnTimeRef.current = Date.now() + 7000;

    // Create 3D Scene
    const sceneInstance = new GameScene(canvasMountRef.current, currentStage);
    gameSceneRef.current = sceneInstance;

    // Setup 5 Lawn Cleaners (one per row on the left)
    lawnCleanersRef.current = [];
    for (let r = 0; r < 5; r++) {
      const mowerMesh = createLawnMowerModel(currentStage.stageNumber);
      const mowerPos = sceneInstance.getGridWorldPos(r, -0.9);
      mowerMesh.position.set(mowerPos.x, 0, mowerPos.z);
      sceneInstance.scene.add(mowerMesh);

      lawnCleanersRef.current.push({
        row: r,
        x: -0.9,
        active: true,
        triggered: false,
        speed: 10,
        meshRef: mowerMesh,
      });
    }

    // Handle Tile Click: Placing hero or using Shovel
    sceneInstance.onTileClick = (coord: GridCoord) => {
      handleTileAction(coord);
    };

    // Handle 3D IQ Bulb click
    sceneInstance.onIqBulbClick = (bulbId: string) => {
      collectIqBulb(bulbId);
    };

    isLoopRunningRef.current = true;
    let animId = 0;
    let lastTickTime = performance.now();

    const loop = (now: number) => {
      if (!isLoopRunningRef.current) return;
      const rawDelta = (now - lastTickTime) / 1000;
      lastTickTime = now;
      const delta = Math.min(rawDelta, 0.1) * speedMultiplierRef.current;

      if (!isPausedRef.current && !isMathModalOpenRef.current) {
        updateSimulation(delta);
      }

      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);

    return () => {
      isLoopRunningRef.current = false;
      cancelAnimationFrame(animId);
      if (gameSceneRef.current) {
        gameSceneRef.current.dispose();
        gameSceneRef.current = null;
      }
    };
  }, [screen, currentStageIndex]);

  // Handle Tile Action (Place Hero or Shovel)
  const handleTileAction = (coord: GridCoord) => {
    const scene = gameSceneRef.current;
    if (!scene) return;

    const existingIdx = heroesRef.current.findIndex(
      (h) => h.row === coord.row && h.col === coord.col
    );

    // If Shovel is active: remove hero
    if (shovelActive) {
      if (existingIdx !== -1) {
        const removed = heroesRef.current[existingIdx];
        if (removed.meshRef) scene.scene.remove(removed.meshRef);
        heroesRef.current.splice(existingIdx, 1);
        soundManager.playPunch();
      }
      setShovelActive(false);
      return;
    }

    // Placing a hero
    if (!activeHeroToPlace) return;
    const heroDef = ALL_HERO_DEFS.find((h) => h.id === activeHeroToPlace)!;

    if (iqPower < heroDef.cost) return;
    if ((heroCooldowns[activeHeroToPlace] || 0) > 0) return;

    // Water lane checks for Stage 3
    const isWaterRow = currentStage.hasWaterLanes && currentStage.waterRows?.includes(coord.row);

    if (isWaterRow) {
      if (activeHeroToPlace === 'pelampung_sekolah') {
        // Can only place float if tile is empty
        if (existingIdx !== -1) return;
      } else {
        // Need a float already placed here
        if (existingIdx === -1 || heroesRef.current[existingIdx].heroType !== 'pelampung_sekolah') {
          return;
        }
      }
    } else {
      // Land row: Pelampung is water-only
      if (activeHeroToPlace === 'pelampung_sekolah') return;
      // Cannot place on an already occupied tile
      if (existingIdx !== -1) return;
    }

    // Create 3D Hero Model
    const heroMesh = createHeroModel(activeHeroToPlace);
    const tilePos = scene.getTileWorldPos(coord.row, coord.col);
    heroMesh.position.set(tilePos.x, isWaterRow ? 0.08 : 0, tilePos.z);
    scene.scene.add(heroMesh);

    soundManager.playPlantHero();

    // Deduct IQ Power & trigger cooldown
    setIqPower((p) => p - heroDef.cost);
    setHeroCooldowns((cd) => ({
      ...cd,
      [activeHeroToPlace]: heroDef.cooldown,
    }));

    if (isWaterRow && existingIdx !== -1 && heroesRef.current[existingIdx].heroType === 'pelampung_sekolah') {
      // Stacking hero on top of existing float
      heroesRef.current[existingIdx].heroType = activeHeroToPlace;
      heroesRef.current[existingIdx].hp = heroDef.hp;
      heroesRef.current[existingIdx].maxHp = heroDef.hp;
      heroesRef.current[existingIdx].hasFloatBelow = true;
      if (heroesRef.current[existingIdx].meshRef) {
        scene.scene.remove(heroesRef.current[existingIdx].meshRef);
      }
      heroesRef.current[existingIdx].meshRef = heroMesh;
    } else {
      heroesRef.current.push({
        id: `hero_${Date.now()}_${Math.random()}`,
        heroType: activeHeroToPlace,
        row: coord.row,
        col: coord.col,
        hp: heroDef.hp,
        maxHp: heroDef.hp,
        lastActionTime: Date.now(),
        meshRef: heroMesh,
        hasFloatBelow: false,
      });
    }

    setActiveHeroToPlace(null);
  };

  // Collect 3D IQ Lightbulb -> Trigger DSKP 10.2 Math Question
  const collectIqBulb = (bulbId: string) => {
    const scene = gameSceneRef.current;
    if (!scene) return;

    const bulbIdx = iqBulbsRef.current.findIndex((b) => b.id === bulbId);
    if (bulbIdx !== -1) {
      const bulb = iqBulbsRef.current[bulbIdx];
      if (bulb.meshRef) scene.scene.remove(bulb.meshRef);
      iqBulbsRef.current.splice(bulbIdx, 1);
      setBulbCount(iqBulbsRef.current.length);
    }

    soundManager.playBulbClick();

    // Freeze game immediately and generate educational DSKP 10.2 question matching stage
    isMathModalOpenRef.current = true;
    const question = generateQuestionForStage(currentStage.stageNumber);
    setActiveMathQuestion(question);
  };

  // Handle Math Question Answered
  const handleAnswerMathQuestion = (isCorrect: boolean) => {
    isMathModalOpenRef.current = false;
    if (isCorrect) {
      soundManager.playMathCorrect();
      setIqPower((p) => p + 50);
      setScore((s) => s + 100);
      setPlayerProfile((prev) => ({
        ...prev,
        mathCorrect: prev.mathCorrect + 1,
        mathAttempted: prev.mathAttempted + 1,
        totalScore: prev.totalScore + 100,
      }));

      // Stage 5 Final Boss Phase 2 Mechanic: 3 consecutive correct answers shatter Trapezium shield!
      if (currentStage.stageNumber === 5 && bossPhase === 2) {
        setProfConsecutiveCorrect((c) => {
          const next = c + 1;
          if (next >= 3) {
            // Shield broken! Boss takes massive damage
            setBossHp(0);
            soundManager.playVictory();
          }
          return next;
        });
      }
    } else {
      soundManager.playMathWrong();
      setIqPower((p) => p + 10); // denda
      setPlayerProfile((prev) => ({
        ...prev,
        mathAttempted: prev.mathAttempted + 1,
      }));
      setProfConsecutiveCorrect(0);
    }

    setActiveMathQuestion(null);
  };

  // Main Simulation Update Loop (Real-Time 3D)
  const updateSimulation = (delta: number) => {
    const scene = gameSceneRef.current;
    if (!scene) return;
    const now = Date.now();

    // 1. Cooldowns Countdown
    setHeroCooldowns((cds) => {
      let changed = false;
      const next = { ...cds };
      for (const k in next) {
        const key = k as HeroType;
        if (next[key] > 0) {
          next[key] = Math.max(0, next[key] - delta);
          changed = true;
        }
      }
      return changed ? next : cds;
    });

    // 2. Sky IQ Bulb Automatic Drop (every 10-12s)
    if (now - lastSkyBulbDropTimeRef.current > 11000) {
      lastSkyBulbDropTimeRef.current = now;
      const col = Math.floor(Math.random() * 8);
      const row = Math.floor(Math.random() * 5);
      const targetPos = scene.getTileWorldPos(row, col);

      const bulbMesh = createIqBulbModel();
      bulbMesh.position.set(targetPos.x, 8, targetPos.z);
      (bulbMesh as any).bulbId = `bulb_sky_${now}`;
      scene.scene.add(bulbMesh);

      iqBulbsRef.current.push({
        id: (bulbMesh as any).bulbId,
        x: targetPos.x,
        y: 8,
        z: targetPos.z,
        targetY: 0.8,
        meshRef: bulbMesh,
        createdTime: now,
        source: 'sky',
      });
      setBulbCount(iqBulbsRef.current.length);
      soundManager.playBulbSpawn();
    }

    // 3. Update IQ Bulbs animation (spin & float down)
    for (let i = iqBulbsRef.current.length - 1; i >= 0; i--) {
      const b = iqBulbsRef.current[i];
      if (b.meshRef) {
        b.meshRef.rotation.y += delta * 2.5;
        if (b.y > b.targetY) {
          b.y -= delta * 3.5;
          b.meshRef.position.y = b.y;
        } else {
          // gentle bobbing
          b.meshRef.position.y = b.targetY + Math.sin(now * 0.005 + i) * 0.12;
        }
      }
      // Bulbs expire after 22s if unclicked
      if (now - b.createdTime > 22000) {
        if (b.meshRef) scene.scene.remove(b.meshRef);
        iqBulbsRef.current.splice(i, 1);
        setBulbCount(iqBulbsRef.current.length);
      }
    }

    // 4. Wave Spawner
    if (now > nextWaveSpawnTimeRef.current) {
      if (currentWave <= currentStage.totalWaves) {
        // Spawn wave zombies
        const count = currentWave * 2 + Math.floor(Math.random() * 2);
        for (let k = 0; k < count; k++) {
          const row = Math.floor(Math.random() * 5);
          const zType =
            currentStage.zombieTypes[
              Math.floor(Math.random() * currentStage.zombieTypes.length)
            ];
          spawnZombie(zType, row, 8.8 + k * 0.7);
        }
        setCurrentWave((w) => w + 1);
        nextWaveSpawnTimeRef.current = now + 16000;
        soundManager.playZombieGroan();
      } else if (currentWave === currentStage.totalWaves + 1 && zombiesRef.current.length === 0) {
        // Spawn BOSS WAVE!
        spawnBoss();
        setCurrentWave((w) => w + 1);
      }
    }

    // 5. Update Placed Heroes (Idle bobbing & Attack logic)
    heroesRef.current.forEach((hero) => {
      if (!hero.meshRef) return;

      // Idle breathing animation
      hero.meshRef.position.y = (hero.hasFloatBelow ? 0.1 : 0) + Math.sin(now * 0.004 + hero.col) * 0.03;

      // Check if zombies exist in the same row
      const laneZombies = zombiesRef.current.filter((z) => z.row === hero.row && z.x > hero.col);

      // Hero Actions
      switch (hero.heroType) {
        case 'cikgu_math': {
          // Generates an IQ bulb every 14s
          if (now - hero.lastActionTime > 14000) {
            hero.lastActionTime = now;
            const tilePos = scene.getTileWorldPos(hero.row, hero.col);
            const bulbMesh = createIqBulbModel();
            bulbMesh.position.set(tilePos.x + 0.3, 0.6, tilePos.z);
            (bulbMesh as any).bulbId = `bulb_cikgu_${now}`;
            scene.scene.add(bulbMesh);

            iqBulbsRef.current.push({
              id: (bulbMesh as any).bulbId,
              x: tilePos.x + 0.3,
              y: 0.6,
              z: tilePos.z,
              targetY: 0.6,
              meshRef: bulbMesh,
              createdTime: now,
              source: 'cikgu_math',
            });
            setBulbCount(iqBulbsRef.current.length);
            soundManager.playBulbSpawn();
          }
          break;
        }

        case 'jaguh_lembing': {
          // Throws spear down lane every 2.0s
          if (laneZombies.length > 0 && now - hero.lastActionTime > 2000) {
            hero.lastActionTime = now;
            const startPos = scene.getTileWorldPos(hero.row, hero.col);
            const spearMesh = createProjectileModel('spear');
            spearMesh.position.set(startPos.x + 0.3, 0.7, startPos.z);
            scene.scene.add(spearMesh);

            projectilesRef.current.push({
              id: `proj_spear_${now}`,
              row: hero.row,
              x: hero.col + 0.3,
              y: 0.7,
              z: startPos.z,
              type: 'spear',
              damage: 35,
              speed: 7.5,
              meshRef: spearMesh,
            });
            soundManager.playSpearThrow();
          }
          break;
        }

        case 'cikgu_pj': {
          // High parabolic basketball lob every 3.2s with splash damage
          if (laneZombies.length > 0 && now - hero.lastActionTime > 3200) {
            hero.lastActionTime = now;
            const targetZ = laneZombies[0];
            const startPos = scene.getTileWorldPos(hero.row, hero.col);
            const ballMesh = createProjectileModel('ball');
            ballMesh.position.set(startPos.x + 0.2, 0.8, startPos.z);
            scene.scene.add(ballMesh);

            projectilesRef.current.push({
              id: `proj_ball_${now}`,
              row: hero.row,
              x: hero.col + 0.2,
              y: 0.8,
              z: startPos.z,
              startX: hero.col + 0.2,
              startY: 0.8,
              targetX: targetZ.x,
              progress: 0,
              type: 'ball',
              damage: 55,
              splashRadius: 1.2,
              speed: 4.5,
              isArc: true,
              meshRef: ballMesh,
            });
            soundManager.playSpearThrow();
          }
          break;
        }

        case 'budak_taekwondo': {
          // Melee punch when zombie is in adjacent front tile (col <= z.x <= col + 1.2)
          const closeZ = laneZombies.find((z) => z.x >= hero.col && z.x <= hero.col + 1.2);
          if (closeZ && now - hero.lastActionTime > 750) {
            hero.lastActionTime = now;
            closeZ.hp -= 40;
            soundManager.playPunch();
            // Punch visual jab
            hero.meshRef.position.x += 0.15;
            setTimeout(() => {
              if (hero.meshRef) hero.meshRef.position.x -= 0.15;
            }, 90);
          }
          break;
        }

        case 'budak_sains': {
          // Throws acid flask leaving acid puddle
          if (laneZombies.length > 0 && now - hero.lastActionTime > 4000) {
            hero.lastActionTime = now;
            const targetZ = laneZombies[0];
            const startPos = scene.getTileWorldPos(hero.row, hero.col);
            const flaskMesh = createProjectileModel('acid');
            flaskMesh.position.set(startPos.x + 0.2, 0.8, startPos.z);
            scene.scene.add(flaskMesh);

            projectilesRef.current.push({
              id: `proj_acid_${now}`,
              row: hero.row,
              x: hero.col + 0.2,
              y: 0.8,
              z: startPos.z,
              startX: hero.col + 0.2,
              startY: 0.8,
              targetX: targetZ.x,
              progress: 0,
              type: 'acid',
              damage: 30,
              speed: 4.0,
              isArc: true,
              meshRef: flaskMesh,
            });
            soundManager.playSpearThrow();
          }
          break;
        }

        case 'abang_kantin': {
          // Throws hot soup over shields every 3.0s
          if (laneZombies.length > 0 && now - hero.lastActionTime > 3000) {
            hero.lastActionTime = now;
            const targetZ = laneZombies[0];
            const startPos = scene.getTileWorldPos(hero.row, hero.col);
            const soupMesh = createProjectileModel('soup');
            soupMesh.position.set(startPos.x + 0.2, 0.8, startPos.z);
            scene.scene.add(soupMesh);

            projectilesRef.current.push({
              id: `proj_soup_${now}`,
              row: hero.row,
              x: hero.col + 0.2,
              y: 0.8,
              z: startPos.z,
              startX: hero.col + 0.2,
              startY: 0.8,
              targetX: targetZ.x,
              progress: 0,
              type: 'soup',
              damage: 65,
              speed: 4.2,
              isArc: true,
              meshRef: soupMesh,
            });
            soundManager.playSpearThrow();
          }
          break;
        }

        case 'pengawal_keselamatan': {
          // Blows whistle and stuns lane every 15s
          if (laneZombies.length > 0 && now - hero.lastActionTime > 15000) {
            hero.lastActionTime = now;
            laneZombies.forEach((z) => {
              z.isStunned = true;
              z.stunUntil = now + 4000;
            });
            soundManager.playWhistle();
          }
          break;
        }

        case 'cikgu_seni': {
          // Explodes when zombie walks on same tile
          const steppedZ = zombiesRef.current.find(
            (z) => z.row === hero.row && Math.abs(z.x - hero.col) < 0.4
          );
          if (steppedZ) {
            soundManager.playLawnMower();
            // AoE damage
            zombiesRef.current
              .filter((z) => z.row === hero.row && Math.abs(z.x - hero.col) < 1.4)
              .forEach((z) => (z.hp -= 250));
            hero.hp = 0; // consumed
          }
          break;
        }

        case 'budak_silat': {
          // Keris slash hitting 2 tiles front and 1 tile behind
          const inRange = zombiesRef.current.filter(
            (z) => z.row === hero.row && z.x >= hero.col - 1.0 && z.x <= hero.col + 2.0
          );
          if (inRange.length > 0 && now - hero.lastActionTime > 1200) {
            hero.lastActionTime = now;
            inRange.forEach((z) => (z.hp -= 45));
            soundManager.playPunch();
            hero.meshRef.rotation.y += 0.5;
            setTimeout(() => {
              if (hero.meshRef) hero.meshRef.rotation.y -= 0.5;
            }, 120);
          }
          break;
        }
      }
    });

    // 6. Update Projectiles
    for (let pIdx = projectilesRef.current.length - 1; pIdx >= 0; pIdx--) {
      const p = projectilesRef.current[pIdx];

      if (p.isArc && p.startX !== undefined && p.targetX !== undefined) {
        // Parabolic trajectory
        p.progress = (p.progress || 0) + delta * (p.speed / Math.max(1, p.targetX - p.startX));
        p.x = THREE.MathUtils.lerp(p.startX, p.targetX, p.progress);
        // Parabolic height formula: 4 * h * p * (1 - p)
        p.y = 0.6 + 4 * 1.8 * p.progress * (1 - p.progress);

        if (p.meshRef) {
          const worldPos = scene.getGridWorldPos(p.row, p.x);
          p.meshRef.position.set(worldPos.x, p.y, worldPos.z);
          p.meshRef.rotation.z += delta * 6;
        }

        // Hit target
        if (p.progress >= 1.0) {
          if (p.type === 'ball') {
            // AoE splash
            zombiesRef.current
              .filter((z) => z.row === p.row && Math.abs(z.x - p.targetX!) < (p.splashRadius || 1.2))
              .forEach((z) => (z.hp -= p.damage));
            soundManager.playHit();
          } else if (p.type === 'acid') {
            // Drop acid puddle on ground
            const puddleMesh = createAcidPuddleModel();
            const pWorld = scene.getGridWorldPos(p.row, p.targetX);
            puddleMesh.position.set(pWorld.x, 0.02, pWorld.z);
            scene.scene.add(puddleMesh);

            acidPuddlesRef.current.push({
              id: `puddle_${now}`,
              row: p.row,
              col: Math.round(p.targetX),
              damagePerSec: 25,
              expiresAt: now + 5000,
              meshRef: puddleMesh,
            });
            soundManager.playHit();
          } else if (p.type === 'soup') {
            // Directly damages zombie bypassing shield
            const hitZ = zombiesRef.current.find(
              (z) => z.row === p.row && Math.abs(z.x - p.targetX!) < 0.6
            );
            if (hitZ) hitZ.hp -= p.damage;
            soundManager.playHit();
          }

          if (p.meshRef) scene.scene.remove(p.meshRef);
          projectilesRef.current.splice(pIdx, 1);
        }
      } else {
        // Straight projectile (Spear)
        p.x += delta * p.speed;
        if (p.meshRef) {
          const worldPos = scene.getGridWorldPos(p.row, p.x);
          p.meshRef.position.set(worldPos.x, p.y, worldPos.z);
        }

        // Check collision with zombies
        const hitZombie = zombiesRef.current.find(
          (z) => z.row === p.row && Math.abs(z.x - p.x) < 0.45
        );
        if (hitZombie) {
          hitZombie.hp -= p.damage;
          soundManager.playHit();
          if (p.meshRef) scene.scene.remove(p.meshRef);
          projectilesRef.current.splice(pIdx, 1);
        } else if (p.x > 9.5) {
          // Off screen
          if (p.meshRef) scene.scene.remove(p.meshRef);
          projectilesRef.current.splice(pIdx, 1);
        }
      }
    }

    // 7. Update Acid Puddles
    for (let apIdx = acidPuddlesRef.current.length - 1; apIdx >= 0; apIdx--) {
      const puddle = acidPuddlesRef.current[apIdx];
      if (now > puddle.expiresAt) {
        if (puddle.meshRef) scene.scene.remove(puddle.meshRef);
        acidPuddlesRef.current.splice(apIdx, 1);
      } else {
        // Deal damage over time to zombies stepping on puddle
        zombiesRef.current
          .filter((z) => z.row === puddle.row && Math.abs(z.x - puddle.col) < 0.6)
          .forEach((z) => (z.hp -= puddle.damagePerSec * delta));
      }
    }

    // 8. Update Zombies (Walking, attacking heroes, lawn mower triggers)
    for (let zIdx = zombiesRef.current.length - 1; zIdx >= 0; zIdx--) {
      const z = zombiesRef.current[zIdx];

      // Stun check
      if (z.isStunned) {
        if (now > (z.stunUntil || 0)) {
          z.isStunned = false;
        } else {
          continue; // skip movement & attacks while stunned
        }
      }

      // Check if zombie is dead
      if (z.hp <= 0) {
        if (z.isBoss) {
          handleBossDefeated();
        }
        if (z.meshRef) scene.scene.remove(z.meshRef);
        zombiesRef.current.splice(zIdx, 1);
        setScore((s) => s + (z.isBoss ? 1000 : 25));
        continue;
      }

      // Boss HP update for HUD
      if (z.isBoss) {
        setBossHp(Math.max(0, Math.round(z.hp)));

        // Stage 5 Prof Zero Phase Transition
        if (currentStage.stageNumber === 5 && z.hp < z.maxHp * 0.5 && bossPhase === 1) {
          setBossPhase(2);
          z.bossPhase = 2;
          if (z.meshRef) {
            const shield = z.meshRef.getObjectByName('trapeziumShield');
            if (shield) shield.visible = true;
          }
        }
      }

      // Check if hero is immediately in front to eat
      const blockingHero = heroesRef.current.find(
        (h) => h.row === z.row && Math.abs(h.col - z.x) < 0.4
      );

      if (blockingHero) {
        // Zombi Merentas Desa jump mechanic: leaps over the first hero!
        if (z.type === 'zombi_merentas_desa' && !z.hasJumped) {
          z.hasJumped = true;
          z.x -= 1.1; // jump over!
          soundManager.playSpearThrow();
        } else {
          // Chewing hero
          if (now - z.lastAttackTime > z.attackInterval) {
            z.lastAttackTime = now;
            blockingHero.hp -= z.damage;
            soundManager.playHit();

            if (blockingHero.hp <= 0) {
              if (blockingHero.meshRef) scene.scene.remove(blockingHero.meshRef);
              const bIdx = heroesRef.current.indexOf(blockingHero);
              if (bIdx !== -1) heroesRef.current.splice(bIdx, 1);
            }
          }
        }
      } else {
        // Walk forward towards left
        z.x -= delta * z.speed;
      }

      // Animate 3D Zombie Mesh
      if (z.meshRef) {
        const worldPos = scene.getGridWorldPos(z.row, z.x);
        z.meshRef.position.set(worldPos.x, 0, worldPos.z);

        // Limbs swing animation
        const armL = z.meshRef.getObjectByName('armL');
        const armR = z.meshRef.getObjectByName('armR');
        const legL = z.meshRef.getObjectByName('legL');
        const legR = z.meshRef.getObjectByName('legR');
        const swing = Math.sin(now * 0.006 * (z.speed * 4));

        if (armL) armL.rotation.x = -Math.PI / 3 + swing * 0.4;
        if (armR) armR.rotation.x = -Math.PI / 3 - swing * 0.4;
        if (legL) legL.rotation.x = swing * 0.5;
        if (legR) legR.rotation.x = -swing * 0.5;
      }

      // Lawn Mower Trigger: When zombie reaches x < -0.3
      if (z.x < -0.3) {
        const mower = lawnCleanersRef.current.find((m) => m.row === z.row);
        if (mower && mower.active && !mower.triggered) {
          mower.triggered = true;
          soundManager.playLawnMower();
        } else if (!mower || !mower.active) {
          // Game Over: Zombie invaded school!
          handleGameOver();
          return;
        }
      }
    }

    // 9. Update Lawn Cleaners (Rushing down row and wiping zombies)
    lawnCleanersRef.current.forEach((mower) => {
      if (mower.triggered && mower.active) {
        mower.x += delta * mower.speed;
        if (mower.meshRef) {
          const worldPos = scene.getGridWorldPos(mower.row, mower.x);
          mower.meshRef.position.set(worldPos.x, 0, worldPos.z);
        }

        // Wipe all zombies in this row
        zombiesRef.current
          .filter((z) => z.row === mower.row && z.x <= mower.x + 0.6)
          .forEach((z) => {
            z.hp = 0;
            soundManager.playHit();
          });

        // Finished rushing
        if (mower.x > 9.5) {
          mower.active = false;
          if (mower.meshRef) scene.scene.remove(mower.meshRef);
        }
      }
    });

    // Check Stage Victory
    if (
      currentWave > currentStage.totalWaves + 1 &&
      zombiesRef.current.length === 0 &&
      bossHp !== undefined &&
      bossHp <= 0
    ) {
      handleStageVictory();
    }
  };

  // Spawn Zombie Helper
  const spawnZombie = (type: ZombieType, row: number, startX: number) => {
    const scene = gameSceneRef.current;
    if (!scene) return;

    let speed = 0.45;
    let hp = 150;
    let damage = 25;
    let attackInterval = 900;

    if (type === 'zombi_meja_kerusi') {
      hp = 380;
      speed = 0.32;
    } else if (type === 'zombi_merentas_desa') {
      hp = 90;
      speed = 0.95;
    } else if (type === 'zombi_pembuli') {
      hp = 650;
      speed = 0.28;
      damage = 45;
    } else if (type === 'zombi_skateboard') {
      hp = 180;
      speed = 0.85;
    }

    const zombieMesh = createZombieModel(type);
    const worldPos = scene.getGridWorldPos(row, startX);
    zombieMesh.position.set(worldPos.x, 0, worldPos.z);
    scene.scene.add(zombieMesh);

    zombiesRef.current.push({
      id: `zombie_${Date.now()}_${Math.random()}`,
      type,
      name: type.replace('_', ' '),
      row,
      x: startX,
      speed,
      hp,
      maxHp: hp,
      damage,
      attackInterval,
      lastAttackTime: Date.now(),
      meshRef: zombieMesh,
      hasShield: type === 'zombi_meja_kerusi' || type === 'zombi_pembuli',
    });
  };

  // Spawn Stage Boss
  const spawnBoss = () => {
    const scene = gameSceneRef.current;
    if (!scene) return;

    const bossType = currentStage.bossType;
    const bossMesh = createZombieModel(bossType);
    const midRow = 2;
    const startX = 8.5;
    const worldPos = scene.getGridWorldPos(midRow, startX);
    bossMesh.position.set(worldPos.x, 0, worldPos.z);
    scene.scene.add(bossMesh);

    const bHp = currentStage.bossHp;
    setBossHp(bHp);
    setBossMaxHp(bHp);
    setBossPhase(1);

    zombiesRef.current.push({
      id: `boss_${Date.now()}`,
      type: bossType,
      name: currentStage.bossName,
      row: midRow,
      x: startX,
      speed: 0.25,
      hp: bHp,
      maxHp: bHp,
      damage: 65,
      attackInterval: 800,
      lastAttackTime: Date.now(),
      meshRef: bossMesh,
      isBoss: true,
      bossPhase: 1,
    });

    soundManager.playZombieGroan();

    // Stage 3 Sotong ink splash trigger
    if (bossType === 'boss_sotong_gergasi') {
      setTimeout(() => {
        setInkBlinded(true);
        setTimeout(() => setInkBlinded(false), 5000);
      }, 3000);
    }
  };

  // Handle Boss Defeated
  const handleBossDefeated = () => {
    soundManager.playVictory();
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
    setTimeout(() => {
      handleStageVictory();
    }, 1800);
  };

  // Handle Stage Victory
  const handleStageVictory = () => {
    soundManager.playVictory();
    setScreen('victory');

    // Update Profile
    setPlayerProfile((prev) => {
      const nextHighScores = { ...prev.stageHighScores };
      const prevBest = nextHighScores[currentStage.stageNumber] || 0;
      if (score > prevBest) nextHighScores[currentStage.stageNumber] = score;

      const updated = {
        ...prev,
        totalScore: prev.totalScore + score,
        stagesCompleted: Math.max(prev.stagesCompleted, currentStage.stageNumber),
        stageHighScores: nextHighScores,
      };
      localStorage.setItem('msd_profile', JSON.stringify(updated));
      return updated;
    });

    confetti({
      particleCount: 160,
      spread: 100,
      origin: { y: 0.5 },
    });
  };

  // Handle Game Over
  const handleGameOver = () => {
    soundManager.playDefeat();
    setScreen('gameover');
  };

  return (
    <div data-state={screen} className="relative w-screen h-screen overflow-hidden bg-slate-950 font-sans select-none">
      {/* 3D WebGL Canvas Container */}
      <div ref={canvasMountRef} className="absolute inset-0 w-full h-full z-0" />

      {/* 1. WELCOME SCREEN */}
      {screen === 'welcome' && (
        <div className="relative z-50 flex items-center justify-center min-h-screen p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-slate-900/95 border-2 border-emerald-500 rounded-3xl shadow-2xl p-6 md:p-8 text-white flex flex-col items-center text-center">
            {/* Title & Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
              <GraduationCap className="w-4 h-4" />
              <span>DSKP 10.2 Matematik Tingkatan 1</span>
            </div>

            <h1 className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-emerald-300 to-cyan-300 leading-tight mb-2">
              Math School Defense
            </h1>
            <p className="text-xs md:text-sm font-semibold text-slate-300 mb-6">
              Master Luas DSKP 10.2 (3D WebGL Edition)
            </p>

            {/* Student Info Inputs */}
            <div className="w-full space-y-3 mb-6 text-left">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Nama Murid:
                </label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Contoh: Muhammad Danial / Sarah Lee"
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-400 transition-colors"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Kelas Tingkatan 1:
                </label>
                <input
                  type="text"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  placeholder="Contoh: 1 Amanah / 1 Arif / 1 Bestari"
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-400 transition-colors"
                />
              </div>
            </div>

            {/* Primary Action Button */}
            <button
              onClick={() => {
                if (!studentName.trim()) setStudentName('Murid Pintar');
                setScreen('deck');
              }}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-black text-base rounded-2xl shadow-xl shadow-emerald-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] mb-3"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>Mula Bertahan di Sekolah!</span>
            </button>

            {/* Sub buttons: Tips & Scoreboard */}
            <div className="grid grid-cols-2 gap-3 w-full">
              <button
                onClick={() => setShowHelp(true)}
                className="flex items-center justify-center gap-1.5 py-2.5 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-xl text-xs font-bold border border-slate-700 transition-colors"
              >
                <HelpCircle className="w-4 h-4 text-amber-400" />
                <span>Panduan Rumus</span>
              </button>

              <button
                onClick={() => setShowScoreboard(true)}
                className="flex items-center justify-center gap-1.5 py-2.5 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-xl text-xs font-bold border border-slate-700 transition-colors"
              >
                <Trophy className="w-4 h-4 text-yellow-400" />
                <span>Papan Skor Guru</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. DECK SELECTION MODAL */}
      {screen === 'deck' && (
        <HeroDeckModal
          selectedHeroes={selectedHeroes}
          onToggleHero={(id) => {
            setSelectedHeroes((prev) =>
              prev.includes(id) ? prev.filter((h) => h !== id) : [...prev, id]
            );
          }}
          onStartStage={() => setScreen('playing')}
          stageNumber={currentStage.stageNumber}
          stageTitle={currentStage.title}
          maxSlots={currentStage.allowedHeroCount}
        />
      )}

      {/* 3. PLAYING HUD */}
      {screen === 'playing' && (
        <HUD
          studentName={studentName}
          className={className}
          iqPower={iqPower}
          score={score}
          stageNumber={currentStage.stageNumber}
          stageTitle={currentStage.title}
          currentWave={currentWave}
          totalWaves={currentStage.totalWaves}
          selectedHeroes={selectedHeroes}
          activeHeroToPlace={activeHeroToPlace}
          onSelectHeroToPlace={setActiveHeroToPlace}
          heroCooldowns={heroCooldowns}
          shovelActive={shovelActive}
          onToggleShovel={() => {
            setShovelActive(!shovelActive);
            if (!shovelActive) setActiveHeroToPlace(null);
          }}
          isPaused={isPaused}
          onTogglePause={() => setIsPaused(!isPaused)}
          speedMultiplier={speedMultiplier}
          onToggleSpeed={() => setSpeedMultiplier((s) => (s === 1 ? 2 : 1))}
          isMuted={isMuted}
          onToggleMute={() => setIsMuted(soundManager.toggleMute())}
          onOpenHelp={() => setShowHelp(true)}
          onOpenScoreboard={() => setShowScoreboard(true)}
          bossHp={bossHp}
          bossMaxHp={bossMaxHp}
          bossName={currentStage.bossName}
          bossPhase={bossPhase}
          activeBulbCount={bulbCount}
          onCollectAnyBulb={() => {
            if (iqBulbsRef.current.length > 0) {
              collectIqBulb(iqBulbsRef.current[0].id);
            }
          }}
        />
      )}

      {/* 4. MATH POPUP QUESTION MODAL */}
      {activeMathQuestion && (
        <MathQuestionModal
          question={activeMathQuestion}
          onAnswer={handleAnswerMathQuestion}
          inkBlinded={inkBlinded}
        />
      )}

      {/* 5. VICTORY STAGE MODAL */}
      {screen === 'victory' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-md bg-slate-900 border-2 border-emerald-400 rounded-3xl p-6 text-white text-center shadow-2xl">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="w-10 h-10" />
            </div>

            <h2 className="text-2xl font-black text-emerald-400 mb-1">
              TAHNIAH, SEKOLAH TERSELAMAT!
            </h2>
            <p className="text-xs text-slate-300 mb-4">
              Anda berjaya menewaskan bos dan mempertahankan kawasan {currentStage.title}!
            </p>

            <div className="bg-slate-800/90 rounded-2xl p-4 mb-4 border border-slate-700">
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Skor Diperoleh:</span>
                <span className="font-bold text-amber-300 text-sm">{score} Mata</span>
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>Soalan Math Betul:</span>
                <span className="font-bold text-emerald-400 text-sm">{playerProfile.mathCorrect}</span>
              </div>
            </div>

            {currentStageIndex < STAGE_CONFIGS.length - 1 ? (
              <button
                onClick={() => {
                  setCurrentStageIndex((i) => i + 1);
                  setScreen('deck');
                }}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 font-bold rounded-xl text-sm transition-colors mb-2"
              >
                Mara ke Stage {currentStageIndex + 2} →
              </button>
            ) : (
              <p className="text-sm font-black text-amber-400 mb-3">
                🏆 TAHNIAH! ANDA TELAH MENAMATKAN SEMUA 5 STAGE DSKP 10.2!
              </p>
            )}

            <button
              onClick={() => setScreen('welcome')}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 font-semibold rounded-xl text-xs text-slate-300 transition-colors"
            >
              Kembali ke Menu Utama
            </button>
          </div>
        </div>
      )}

      {/* 6. GAME OVER MODAL */}
      {screen === 'gameover' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-md bg-slate-900 border-2 border-rose-500 rounded-3xl p-6 text-white text-center shadow-2xl">
            <div className="w-16 h-16 bg-rose-500/20 text-rose-400 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-10 h-10" />
            </div>

            <h2 className="text-2xl font-black text-rose-400 mb-1">ZOMBI MENEMBUSI SEKOLAH!</h2>
            <p className="text-xs text-slate-300 mb-4">
              Benteng pertahanan telah roboh. Ulangkaji rumus dan rancang strategi baharu!
            </p>

            <button
              onClick={() => setScreen('playing')}
              className="w-full py-3 bg-rose-600 hover:bg-rose-500 font-bold rounded-xl text-sm transition-colors mb-2 flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Cuba Semula Stage {currentStage.stageNumber}</span>
            </button>

            <button
              onClick={() => {
                setShowHelp(true);
              }}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 font-semibold rounded-xl text-xs text-amber-300 transition-colors mb-2"
            >
              Ulangkaji Rumus DSKP 10.2
            </button>

            <button
              onClick={() => setScreen('welcome')}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 font-semibold rounded-xl text-xs text-slate-300 transition-colors"
            >
              Menu Utama
            </button>
          </div>
        </div>
      )}

      {/* Modals for Help and Scoreboard */}
      {showHelp && <HelpTipsModal onClose={() => setShowHelp(false)} />}
      {showScoreboard && (
        <ScoreboardModal profile={playerProfile} onClose={() => setShowScoreboard(false)} />
      )}
    </div>
  );
}
