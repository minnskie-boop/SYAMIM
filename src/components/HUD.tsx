import React from 'react';
import { HeroType, HeroDef } from '../types/game';
import { ALL_HERO_DEFS } from './HeroDeckModal';
import {
  Lightbulb,
  Trophy,
  Volume2,
  VolumeX,
  Pause,
  Play,
  FastForward,
  HelpCircle,
  Shovel,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface HUDProps {
  studentName: string;
  className: string;
  iqPower: number;
  score: number;
  stageNumber: number;
  stageTitle: string;
  currentWave: number;
  totalWaves: number;
  selectedHeroes: HeroType[];
  activeHeroToPlace: HeroType | null;
  onSelectHeroToPlace: (hero: HeroType | null) => void;
  heroCooldowns: Record<HeroType, number>;
  shovelActive: boolean;
  onToggleShovel: () => void;
  isPaused: boolean;
  onTogglePause: () => void;
  speedMultiplier: number;
  onToggleSpeed: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenHelp: () => void;
  onOpenScoreboard: () => void;
  bossHp?: number;
  bossMaxHp?: number;
  bossName?: string;
  bossPhase?: number;
  activeBulbCount?: number;
  onCollectAnyBulb?: () => void;
}

export const HUD: React.FC<HUDProps> = ({
  studentName,
  className,
  iqPower,
  score,
  stageNumber,
  stageTitle,
  currentWave,
  totalWaves,
  selectedHeroes,
  activeHeroToPlace,
  onSelectHeroToPlace,
  heroCooldowns,
  shovelActive,
  onToggleShovel,
  isPaused,
  onTogglePause,
  speedMultiplier,
  onToggleSpeed,
  isMuted,
  onToggleMute,
  onOpenHelp,
  onOpenScoreboard,
  bossHp,
  bossMaxHp,
  bossName,
  bossPhase,
  activeBulbCount = 0,
  onCollectAnyBulb,
}) => {
  const [isDockCollapsed, setIsDockCollapsed] = React.useState(false);

  return (
    <div className="pointer-events-none fixed inset-0 z-40 flex flex-col justify-between p-3 select-none">
      {/* 1. TOP BAR */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        {/* Left: Student Profile & Stage Info */}
        <div className="pointer-events-auto flex items-center gap-2 bg-slate-900/90 border border-slate-700/80 px-3.5 py-2 rounded-2xl shadow-xl">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-400">
                {studentName || 'Murid Pintar'}
              </span>
              <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                {className || 'Ting. 1'}
              </span>
            </div>
            <span className="text-[11px] font-semibold text-slate-200">
              Stage {stageNumber}: {stageTitle}
            </span>
          </div>

          <div className="h-6 w-[1px] bg-slate-700 mx-1" />

          {/* Wave indicator */}
          <div className="flex flex-col text-right">
            <span className="text-[9px] uppercase font-bold text-slate-400">Gelombang</span>
            <span className="text-xs font-black text-indigo-400">
              {currentWave > totalWaves ? 'BOS AKHIR!' : `${currentWave} / ${totalWaves}`}
            </span>
          </div>
        </div>

        {/* Center: Boss Health Bar (if active) */}
        {bossHp !== undefined && bossMaxHp !== undefined && bossHp > 0 && (
          <div className="pointer-events-auto flex flex-col items-center bg-slate-900/95 border-2 border-rose-500/80 px-4 py-1.5 rounded-2xl shadow-2xl min-w-[280px]">
            <div className="flex items-center justify-between w-full text-xs font-black mb-1">
              <span className="text-rose-400">{bossName}</span>
              <span className="text-amber-300">
                {bossPhase === 2 ? 'FASA 2: PERISAI TRAPEZIUM' : `HP: ${bossHp}/${bossMaxHp}`}
              </span>
            </div>
            <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden border border-slate-700">
              <div
                className={`h-full transition-all duration-200 ${
                  bossPhase === 2 ? 'bg-cyan-400 shadow-md shadow-cyan-400' : 'bg-rose-500'
                }`}
                style={{ width: `${Math.max(0, Math.min(100, (bossHp / bossMaxHp) * 100))}%` }}
              />
            </div>
          </div>
        )}

        {/* Right: Resources & Game Controls */}
        <div className="pointer-events-auto flex items-center gap-2">
          {/* Active Bulb Collection Trigger */}
          {activeBulbCount > 0 && (
            <button
              onClick={onCollectAnyBulb}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-400 to-yellow-300 hover:from-amber-300 hover:to-yellow-200 text-slate-950 font-black rounded-2xl shadow-lg shadow-amber-400/40 text-xs transition-transform hover:scale-105 animate-pulse"
              title="Klik untuk selesaikan soalan Math DSKP 10.2 dan tambah Kuasa IQ!"
            >
              <Lightbulb className="w-4 h-4 fill-current" />
              <span>Selesaikan Math ({activeBulbCount})!</span>
            </button>
          )}

          {/* IQ Power Display */}
          <div className="flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-yellow-500/10 border-2 border-amber-400/80 px-3 py-1.5 rounded-2xl shadow-lg">
            <Lightbulb className="w-5 h-5 text-amber-400 animate-bounce" />
            <div className="flex flex-col">
              <span className="text-[9px] uppercase font-extrabold text-amber-300 tracking-wider">Kuasa IQ</span>
              <span className="text-base font-black text-white leading-none">{iqPower}</span>
            </div>
          </div>

          {/* Score Display */}
          <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-700 px-3 py-1.5 rounded-2xl shadow-lg">
            <Trophy className="w-4 h-4 text-yellow-400" />
            <div className="flex flex-col">
              <span className="text-[9px] uppercase font-bold text-slate-400">Skor</span>
              <span className="text-sm font-black text-amber-300 leading-none">{score}</span>
            </div>
          </div>

          {/* Quick Buttons */}
          <div className="flex items-center gap-1 bg-slate-900/90 border border-slate-700 p-1 rounded-2xl shadow-lg">
            {/* Speed Toggle */}
            <button
              onClick={onToggleSpeed}
              title="Laju Permainan (1x / 2x)"
              className={`p-2 rounded-xl text-xs font-black transition-colors ${
                speedMultiplier > 1 ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <FastForward className="w-4 h-4" />
            </button>

            {/* Pause / Resume */}
            <button
              onClick={onTogglePause}
              title={isPaused ? 'Sambung Semula' : 'Jeda Permainan'}
              className="p-2 text-slate-300 hover:bg-slate-800 rounded-xl transition-colors"
            >
              {isPaused ? <Play className="w-4 h-4 text-emerald-400" /> : <Pause className="w-4 h-4" />}
            </button>

            {/* Sound Toggle */}
            <button
              onClick={onToggleMute}
              title={isMuted ? 'Buka Bunyi' : 'Bisu'}
              className="p-2 text-slate-300 hover:bg-slate-800 rounded-xl transition-colors"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>

            {/* Help / Tips */}
            <button
              onClick={onOpenHelp}
              title="Panduan Rumus DSKP & Wira"
              className="p-2 text-amber-400 hover:bg-slate-800 rounded-xl transition-colors font-bold"
            >
              <HelpCircle className="w-4 h-4" />
            </button>

            {/* Scoreboard */}
            <button
              onClick={onOpenScoreboard}
              title="Papan Skor & Rekod Guru"
              className="p-2 text-yellow-400 hover:bg-slate-800 rounded-xl transition-colors"
            >
              <Trophy className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. UNIFIED BOTTOM CONTROL DOCK (Three.js discipline) */}
      <div className="pointer-events-auto mx-auto w-full max-w-4xl flex flex-col items-center">
        {/* Collapse / Expand Toggle Button */}
        <button
          onClick={() => setIsDockCollapsed(!isDockCollapsed)}
          className="flex items-center gap-1 px-3 py-1 bg-slate-900/90 border-t border-x border-slate-700 text-[10px] font-bold text-slate-300 rounded-t-xl hover:text-white transition-colors"
        >
          {isDockCollapsed ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          <span>{isDockCollapsed ? 'Papar Dek Wira' : 'Sembunyi Dek'}</span>
        </button>

        {/* The Card Deck Bar */}
        {!isDockCollapsed && (
          <div className="w-full bg-slate-900/95 border-2 border-slate-700/80 p-2.5 rounded-2xl shadow-2xl backdrop-blur-md flex items-center justify-between gap-2 overflow-x-auto">
            {/* Shovel / Cangkul Tool */}
            <button
              onClick={onToggleShovel}
              title="Cangkul: Buang watak untuk kosongkan petak"
              className={`flex flex-col items-center justify-center p-2 rounded-xl border-2 transition-all shrink-0 w-16 h-20 ${
                shovelActive
                  ? 'bg-rose-600 border-rose-300 text-white shadow-lg shadow-rose-600/40'
                  : 'bg-slate-800/90 border-slate-600 text-slate-300 hover:border-slate-400'
              }`}
            >
              <Shovel className="w-5 h-5 mb-1" />
              <span className="text-[10px] font-bold">Cangkul</span>
            </button>

            {/* Hero Cards List */}
            <div className="flex items-center gap-2 overflow-x-auto py-1">
              {selectedHeroes.map((heroId) => {
                const def = ALL_HERO_DEFS.find((h) => h.id === heroId)!;
                const canAfford = iqPower >= def.cost;
                const cdRemaining = heroCooldowns[heroId] || 0;
                const isReady = cdRemaining <= 0;
                const isSelected = activeHeroToPlace === heroId;

                return (
                  <button
                    key={heroId}
                    disabled={!canAfford || !isReady}
                    onClick={() => {
                      if (shovelActive) onToggleShovel();
                      onSelectHeroToPlace(isSelected ? null : heroId);
                    }}
                    className={`relative flex flex-col justify-between p-2 rounded-xl border-2 transition-all shrink-0 w-24 h-20 text-left overflow-hidden ${
                      isSelected
                        ? 'bg-indigo-600 border-yellow-400 text-white shadow-lg shadow-indigo-500/40 -translate-y-1'
                        : canAfford && isReady
                        ? 'bg-slate-800/95 hover:bg-slate-750 border-slate-600 hover:border-amber-400 text-white'
                        : 'bg-slate-900/80 border-slate-800 text-slate-500 opacity-60 cursor-not-allowed'
                    }`}
                  >
                    {/* Top: Name & Role */}
                    <div>
                      <span className="block text-[11px] font-bold truncate leading-tight">
                        {def.name}
                      </span>
                      <span className="text-[9px] text-indigo-300 truncate block">
                        {def.role}
                      </span>
                    </div>

                    {/* Bottom: Cost Badge */}
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-0.5 text-[11px] font-black text-amber-300">
                        <Lightbulb className="w-3 h-3 fill-current" />
                        {def.cost}
                      </span>
                    </div>

                    {/* Cooldown Overlay */}
                    {!isReady && (
                      <div className="absolute inset-0 bg-slate-950/80 flex flex-col items-center justify-center text-amber-300 font-black text-xs">
                        <span>{cdRemaining.toFixed(1)}s</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
