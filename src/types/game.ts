export type HeroType =
  | 'cikgu_math'
  | 'jaguh_lembing'
  | 'cikgu_pj'
  | 'budak_taekwondo'
  | 'pengawas_pss'
  | 'budak_sains'
  | 'abang_kantin'
  | 'pengawal_keselamatan'
  | 'cikgu_seni'
  | 'budak_silat'
  | 'pelampung_sekolah';

export type ZombieType =
  | 'zombi_ponteng'
  | 'zombi_meja_kerusi'
  | 'zombi_merentas_desa'
  | 'zombi_pembuli'
  | 'zombi_skateboard'
  | 'boss_olahragawan'
  | 'boss_kapten_korporal'
  | 'boss_sotong_gergasi'
  | 'boss_guru_disiplin'
  | 'boss_prof_zero';

export interface HeroDef {
  id: HeroType;
  name: string;
  cost: number;
  cooldown: number; // in seconds
  hp: number;
  description: string;
  role: string;
  isWaterOnly?: boolean;
  canPlaceOnWaterWithoutFloat?: boolean;
}

export interface PlacedHero {
  id: string;
  heroType: HeroType;
  row: number;
  col: number;
  hp: number;
  maxHp: number;
  lastActionTime: number;
  meshRef?: any;
  hasFloatBelow?: boolean;
  isLocked?: boolean; // Disiplin locked
  lockedUntil?: number;
  state?: 'idle' | 'attack' | 'special';
}

export interface ZombieInstance {
  id: string;
  type: ZombieType;
  name: string;
  row: number;
  x: number; // grid x position (from 8.5 down to -1)
  speed: number;
  hp: number;
  maxHp: number;
  damage: number;
  attackInterval: number;
  lastAttackTime: number;
  meshRef?: any;
  hasShield?: boolean;
  shieldHp?: number;
  hasJumped?: boolean;
  isStunned?: boolean;
  stunUntil?: number;
  isBoss?: boolean;
  bossPhase?: number;
  bossSpecialTimer?: number;
}

export interface ProjectileInstance {
  id: string;
  row: number;
  x: number;
  y: number;
  z: number;
  targetX?: number;
  startX?: number;
  startY?: number;
  progress?: number;
  type: 'spear' | 'ball' | 'acid' | 'soup' | 'shotput' | 'fail_paper';
  damage: number;
  splashRadius?: number;
  speed: number;
  isArc?: boolean;
  meshRef?: any;
}

export interface AcidPuddle {
  id: string;
  row: number;
  col: number;
  damagePerSec: number;
  expiresAt: number;
  meshRef?: any;
}

export interface LawnCleanerInstance {
  row: number;
  x: number;
  active: boolean;
  triggered: boolean;
  speed: number;
  meshRef?: any;
}

export interface IqBulbInstance {
  id: string;
  x: number;
  y: number;
  z: number;
  targetY: number;
  meshRef?: any;
  createdTime: number;
  source: 'sky' | 'cikgu_math';
}

export interface MathQuestion {
  id: string;
  topic: 'Segi Tiga' | 'Segi Empat Selari' | 'Lelayang' | 'Trapezium' | 'Gabungan Bentuk' | 'Anggaran Grid';
  shapeType: 'triangle' | 'parallelogram' | 'kite' | 'trapezium' | 'compound' | 'grid';
  question: string;
  formula: string;
  dimensions: Record<string, number | string>;
  options: { label: string; value: number | string; isCorrect: boolean }[];
  explanation: string;
  level: number; // 1 to 5
}

export interface StageConfig {
  stageNumber: number;
  title: string;
  themeName: string;
  description: string;
  envType: 'field_day' | 'court_sunset' | 'pool_aqua' | 'hall_night' | 'roof_storm';
  cleanerName: string;
  hasWaterLanes?: boolean;
  waterRows?: number[];
  allowedHeroCount: number;
  totalWaves: number;
  zombieTypes: ZombieType[];
  bossType: ZombieType;
  bossName: string;
  bossHp: number;
}

export interface PlayerProfile {
  studentName: string;
  className: string;
  totalScore: number;
  mathCorrect: number;
  mathAttempted: number;
  stagesCompleted: number;
  stageHighScores: Record<number, number>;
}
