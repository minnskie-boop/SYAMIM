import React from 'react';
import { HeroType, HeroDef } from '../types/game';
import { Shield, Zap, Sparkles, AlertCircle, Play } from 'lucide-react';

export const ALL_HERO_DEFS: HeroDef[] = [
  {
    id: 'cikgu_math',
    name: 'Cikgu Math',
    cost: 50,
    cooldown: 5,
    hp: 300,
    description: 'Menjana mentol IQ Power 3D secara berkala untuk belanja pertahanan.',
    role: 'Penjana IQ',
  },
  {
    id: 'jaguh_lembing',
    name: 'Jaguh Lembing',
    cost: 100,
    cooldown: 4,
    hp: 300,
    description: 'Melontar lembing 3D secara berterusan ke arah zombi dari jarak jauh.',
    role: 'Penembak Jarak Jauh',
  },
  {
    id: 'cikgu_pj',
    name: 'Cikgu PJ',
    cost: 175,
    cooldown: 7,
    hp: 350,
    description: 'Membaling bola sukan 3D secara trajektori parabola dengan impak percikan luas (AoE).',
    role: 'AoE Splash',
  },
  {
    id: 'budak_taekwondo',
    name: 'Budak Taekwondo',
    cost: 150,
    cooldown: 6,
    hp: 450,
    description: 'Melancarkan tumbukan laju 3D bertubi-tubi kepada zombi di petak hadapan.',
    role: 'Pejuang Dekat',
  },
  {
    id: 'pengawas_pss',
    name: 'Pengawas PSS',
    cost: 50,
    cooldown: 18,
    hp: 2000,
    description: 'Benteng buku teks tebal 3D berdaya tahan tinggi menghalang kemaraan zombi.',
    role: 'Benteng Pertahanan',
  },
  {
    id: 'budak_sains',
    name: 'Budak Sains',
    cost: 125,
    cooldown: 8,
    hp: 300,
    description: 'Membaling kelalang asid kimia 3D yang menghasilkan takungan racun merosakkan zombi.',
    role: 'Kerosakan Berterusan',
  },
  {
    id: 'abang_kantin',
    name: 'Abang Kantin',
    cost: 150,
    cooldown: 8,
    hp: 350,
    description: 'Melontar kuali kuah kari panas melengkung melepasi perisai meja zombi.',
    role: 'Anti-Perisai',
  },
  {
    id: 'pengawal_keselamatan',
    name: 'Pengawal Keselamatan',
    cost: 175,
    cooldown: 15,
    hp: 400,
    description: 'Menyuluh kon lampu suluh 3D & tiup wisel membekukan zombi 1 lorong selama 4 saat.',
    role: 'Kawalan & Stun',
  },
  {
    id: 'cikgu_seni',
    name: 'Cikgu Seni',
    cost: 125,
    cooldown: 12,
    hp: 250,
    description: 'Melukis petak grid berletup yang meletup apabila dipijak zombi.',
    role: 'Perangkap Letupan',
  },
  {
    id: 'budak_silat',
    name: 'Budak Silat',
    cost: 225,
    cooldown: 10,
    hp: 550,
    description: 'Serangan tangkas keris 3D merangkumi 2 petak di depan dan 1 petak di belakang.',
    role: 'Pendekar Handal',
  },
  {
    id: 'pelampung_sekolah',
    name: 'Pelampung Sekolah',
    cost: 25,
    cooldown: 3,
    hp: 400,
    description: 'Wajib untuk Stage 3! Letakkan di atas air kolam supaya watak lain boleh berdiri di atasnya.',
    role: 'Sokongan Akuatik',
    isWaterOnly: true,
  },
];

interface HeroDeckModalProps {
  selectedHeroes: HeroType[];
  onToggleHero: (id: HeroType) => void;
  onStartStage: () => void;
  stageNumber: number;
  stageTitle: string;
  maxSlots?: number;
}

export const HeroDeckModal: React.FC<HeroDeckModalProps> = ({
  selectedHeroes,
  onToggleHero,
  onStartStage,
  stageNumber,
  stageTitle,
  maxSlots = 7,
}) => {
  const isStage3 = stageNumber === 3;
  const hasFloatSelected = selectedHeroes.includes('pelampung_sekolah');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-4xl bg-slate-900 border-2 border-indigo-500 rounded-2xl shadow-2xl p-6 text-white flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-700 pb-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 rounded-full text-xs font-bold uppercase">
                Stage {stageNumber}
              </span>
              <h2 className="text-xl font-bold text-white">{stageTitle}</h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Pilih 6 hingga {maxSlots} wira warga sekolah untuk dibawa ke gelanggang pertahanan.
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-400 block">Slot Terpilih:</span>
            <span
              className={`text-lg font-black ${
                selectedHeroes.length >= 6 ? 'text-emerald-400' : 'text-amber-400'
              }`}
            >
              {selectedHeroes.length} / {maxSlots}
            </span>
          </div>
        </div>

        {/* Stage 3 Aquatic Notice */}
        {isStage3 && !hasFloatSelected && (
          <div className="mb-4 p-3 bg-amber-950/80 border border-amber-500/60 rounded-xl text-xs text-amber-200 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
            <span>
              <strong>PERHATIAN STAGE 3:</strong> Lorong tengah ialah air kolam renang! Sila bawa <strong>Pelampung Sekolah (25 IQ)</strong> untuk menempatkan wira di atas air.
            </span>
          </div>
        )}

        {/* Selected Deck Bar */}
        <div className="mb-4 p-3 bg-slate-950/80 border border-slate-800 rounded-xl">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            Dek Pasukan Semasa:
          </span>
          <div className="flex items-center gap-2 flex-wrap min-h-[50px]">
            {selectedHeroes.map((heroId) => {
              const def = ALL_HERO_DEFS.find((h) => h.id === heroId)!;
              return (
                <div
                  key={heroId}
                  onClick={() => onToggleHero(heroId)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-indigo-900/60 hover:bg-rose-900/70 border border-indigo-400/50 hover:border-rose-400 rounded-lg cursor-pointer transition-all text-xs font-bold"
                  title="Klik untuk buang daripada dek"
                >
                  <span>{def.name}</span>
                  <span className="text-amber-300 font-normal">({def.cost} IQ)</span>
                  <span className="text-rose-400 font-bold ml-1">×</span>
                </div>
              );
            })}
            {selectedHeroes.length === 0 && (
              <span className="text-xs text-slate-500 italic">Belum ada wira dipilih. Klik kad di bawah.</span>
            )}
          </div>
        </div>

        {/* All Available Heroes Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 overflow-y-auto pr-1 flex-1">
          {ALL_HERO_DEFS.map((hero) => {
            const isSelected = selectedHeroes.includes(hero.id);
            const canSelect = isSelected || selectedHeroes.length < maxSlots;

            return (
              <div
                key={hero.id}
                onClick={() => canSelect && onToggleHero(hero.id)}
                className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-indigo-950/90 border-indigo-400 shadow-md shadow-indigo-500/20'
                    : canSelect
                    ? 'bg-slate-800 hover:bg-slate-750 border-slate-700 hover:border-slate-500'
                    : 'bg-slate-900 border-slate-800 opacity-40 cursor-not-allowed'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-1 mb-1.5">
                    <h3 className="font-bold text-sm text-white">{hero.name}</h3>
                    <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-400/40 rounded-full text-xs font-extrabold shrink-0">
                      {hero.cost} IQ
                    </span>
                  </div>

                  <span className="inline-block text-[10px] font-semibold text-indigo-300 bg-indigo-900/40 px-2 py-0.5 rounded mb-2">
                    {hero.role}
                  </span>

                  <p className="text-xs text-slate-300 leading-relaxed mb-2">
                    {hero.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-700/60 text-[11px] text-slate-400">
                  <span>HP: {hero.hp}</span>
                  <span>Bertenang: {hero.cooldown}s</span>
                  <span
                    className={`font-bold ${
                      isSelected ? 'text-emerald-400' : 'text-slate-500'
                    }`}
                  >
                    {isSelected ? '✓ Terpilih' : '+ Pilih'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Start Game Action Bar */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
          <p className="text-xs text-slate-400">
            {selectedHeroes.length < 6
              ? `Sila pilih sekurang-kurangnya ${6 - selectedHeroes.length} watak lagi.`
              : 'Dek wira sudah sedia untuk beraksi!'}
          </p>

          <button
            disabled={selectedHeroes.length < 6}
            onClick={onStartStage}
            className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>Mula Pertahanan Stage {stageNumber}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
