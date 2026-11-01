import React, { useState } from 'react';
import { X, BookOpen, Users, Skull, Gamepad2, Lightbulb, Check } from 'lucide-react';

interface HelpTipsModalProps {
  onClose: () => void;
}

export const HelpTipsModal: React.FC<HelpTipsModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'rumus' | 'wira' | 'zombi' | 'cara'>('rumus');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-4xl bg-slate-900 border-2 border-emerald-500 rounded-2xl shadow-2xl p-6 text-white flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-700 pb-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Panduan & Rujukan Math DSKP 10.2</h2>
              <p className="text-xs text-slate-400">
                Kuasai rumus luas poligon Tingkatan 1 dan strategi pertahanan menara sekolah!
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-2">
          <button
            onClick={() => setActiveTab('rumus')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'rumus'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Rumus DSKP 10.2</span>
          </button>

          <button
            onClick={() => setActiveTab('wira')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'wira'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Wira Sekolah (11)</span>
          </button>

          <button
            onClick={() => setActiveTab('zombi')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'zombi'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Skull className="w-4 h-4" />
            <span>Zombi & Bos (10)</span>
          </button>

          <button
            onClick={() => setActiveTab('cara')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'cara'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Gamepad2 className="w-4 h-4" />
            <span>Cara Bermain</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="overflow-y-auto pr-2 flex-1 space-y-4">
          {activeTab === 'rumus' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Segi Tiga */}
              <div className="p-4 bg-slate-800/80 border border-blue-500/40 rounded-xl">
                <span className="text-xs font-bold uppercase text-blue-400 block mb-1">
                  1. Luas Segi Tiga
                </span>
                <div className="p-2.5 bg-blue-950/60 rounded-lg font-mono text-sm text-blue-200 font-bold mb-2">
                  Luas = ½ × tapak × tinggi serenjang
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  <strong>Peringatan Penting:</strong> Tinggi mestilah garis yang bersudut tegak (90°) dengan tapak. Jangan sesekali gunakan panjang sisi condong/hipotenus!
                </p>
              </div>

              {/* Segi Empat Selari */}
              <div className="p-4 bg-slate-800/80 border border-amber-500/40 rounded-xl">
                <span className="text-xs font-bold uppercase text-amber-400 block mb-1">
                  2. Luas Segi Empat Selari
                </span>
                <div className="p-2.5 bg-amber-950/60 rounded-lg font-mono text-sm text-amber-200 font-bold mb-2">
                  Luas = tapak × tinggi serenjang
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  <strong>Peringatan Penting:</strong> Jangan bahagi dua! Formula ini terhasil daripada memotong segi tiga di satu hujung dan mencantumkannya di hujung bertentangan.
                </p>
              </div>

              {/* Lelayang */}
              <div className="p-4 bg-slate-800/80 border border-emerald-500/40 rounded-xl">
                <span className="text-xs font-bold uppercase text-emerald-400 block mb-1">
                  3. Luas Lelayang
                </span>
                <div className="p-2.5 bg-emerald-950/60 rounded-lg font-mono text-sm text-emerald-200 font-bold mb-2">
                  Luas = ½ × pepenjuru 1 (d₁) × pepenjuru 2 (d₂)
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Dua garis pepenjuru lelayang bersilang pada sudut tegak (90°) dan membahagi lelayang kepada empat buah segi tiga bersudut tegak.
                </p>
              </div>

              {/* Trapezium */}
              <div className="p-4 bg-slate-800/80 border border-rose-500/40 rounded-xl">
                <span className="text-xs font-bold uppercase text-rose-400 block mb-1">
                  4. Luas Trapezium
                </span>
                <div className="p-2.5 bg-rose-950/60 rounded-lg font-mono text-sm text-rose-200 font-bold mb-2">
                  Luas = ½ × (a + b) × tinggi serenjang
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  <em>a</em> dan <em>b</em> ialah pasangan dua sisi selari. Tambahkan kedua-dua sisi selari terlebih dahulu sebelum didarabkan dengan tinggi serenjang dan ½.
                </p>
              </div>

              {/* Gabungan Bentuk & KBAT */}
              <div className="p-4 bg-slate-800/80 border border-purple-500/40 rounded-xl md:col-span-2">
                <span className="text-xs font-bold uppercase text-purple-400 block mb-1">
                  5. Luas Bentuk Gabungan (KBAT)
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-300">
                  <div className="p-2 bg-purple-950/50 rounded-lg">
                    <strong className="text-purple-300 block mb-1">Strategi Penjumlahan:</strong>
                    Bahagikan poligon kompleks kepada bentuk asas (cth: Segi Empat Tepat + Segi Tiga), hitung luas setiap satu dan campurkan.
                  </div>
                  <div className="p-2 bg-purple-950/50 rounded-lg">
                    <strong className="text-purple-300 block mb-1">Strategi Kawasan Berlorek:</strong>
                    Hitung luas poligon keseluruhan luar, kemudian tolak bahagian yang tidak berlorek (ditebuk/dipotong).
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'wira' && (
            <div className="space-y-3">
              <div className="p-3 bg-slate-800 rounded-xl flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white text-sm">Cikgu Math (50 IQ)</h4>
                  <p className="text-xs text-slate-300">Menjana mentol IQ secara berkala. Letak di barisan paling kiri.</p>
                </div>
                <span className="px-2 py-1 bg-amber-500/20 text-amber-300 rounded text-xs font-bold">Penjana</span>
              </div>

              <div className="p-3 bg-slate-800 rounded-xl flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white text-sm">Jaguh Lembing (100 IQ)</h4>
                  <p className="text-xs text-slate-300">Tembakan lurus 3D berterusan dari jarak jauh. Tulang belakang pertahanan.</p>
                </div>
                <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs font-bold">Penembak</span>
              </div>

              <div className="p-3 bg-slate-800 rounded-xl flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white text-sm">Cikgu PJ (175 IQ)</h4>
                  <p className="text-xs text-slate-300">Membaling bola sukan 3D secara lengkung dengan kerosakan kelompok (AoE Splash).</p>
                </div>
                <span className="px-2 py-1 bg-orange-500/20 text-orange-300 rounded text-xs font-bold">AoE Splash</span>
              </div>

              <div className="p-3 bg-slate-800 rounded-xl flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white text-sm">Budak Taekwondo (150 IQ)</h4>
                  <p className="text-xs text-slate-300">Tumbukan laju jarak dekat bertubi-tubi. Sangat kuat menewaskan zombi laju.</p>
                </div>
                <span className="px-2 py-1 bg-red-500/20 text-red-300 rounded text-xs font-bold">Pejuang Dekat</span>
              </div>

              <div className="p-3 bg-slate-800 rounded-xl flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white text-sm">Pengawas PSS (50 IQ)</h4>
                  <p className="text-xs text-slate-300">Benteng buku teks tebal dengan HP 2000! Melambatkan gerombolan zombi.</p>
                </div>
                <span className="px-2 py-1 bg-emerald-500/20 text-emerald-300 rounded text-xs font-bold">Benteng</span>
              </div>

              <div className="p-3 bg-slate-800 rounded-xl flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white text-sm">Abang Kantin (150 IQ)</h4>
                  <p className="text-xs text-slate-300">Balingan kuali kuah panas melangkaui perisai meja dan papan hitam zombi!</p>
                </div>
                <span className="px-2 py-1 bg-amber-500/20 text-amber-300 rounded text-xs font-bold">Anti-Perisai</span>
              </div>

              <div className="p-3 bg-slate-800 rounded-xl flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white text-sm">Pelampung Sekolah (25 IQ)</h4>
                  <p className="text-xs text-slate-300">Wajib untuk Stage 3! Letak di lorong air supaya watak lain boleh ditanam di atasnya.</p>
                </div>
                <span className="px-2 py-1 bg-cyan-500/20 text-cyan-300 rounded text-xs font-bold">Akuatik</span>
              </div>
            </div>
          )}

          {activeTab === 'zombi' && (
            <div className="space-y-3">
              <div className="p-3 bg-slate-800 rounded-xl">
                <h4 className="font-bold text-red-400 text-sm">Zombi Meja Kerusi</h4>
                <p className="text-xs text-slate-300">
                  Membawa perisai meja kayu. Gunakan <strong>Abang Kantin</strong> atau <strong>Budak Sains</strong> yang merosakkan badan zombi secara terus.
                </p>
              </div>

              <div className="p-3 bg-slate-800 rounded-xl">
                <h4 className="font-bold text-red-400 text-sm">Zombi Merentas Desa</h4>
                <p className="text-xs text-slate-300">
                  Berlari laju dan akan melompat melepasi watak pertama yang ditemuinya! Sediakan pertahanan berlapis.
                </p>
              </div>

              <div className="p-3 bg-slate-800 rounded-xl">
                <h4 className="font-bold text-red-400 text-sm">Bos Stage 3: Zombi Sotong Gergasi</h4>
                <p className="text-xs text-slate-300">
                  Menyemburkan dakwat hitam pekat untuk mengaburkan soalan kuiz Math. Bertenang dan baca soalan dengan teliti.
                </p>
              </div>

              <div className="p-3 bg-slate-800 rounded-xl">
                <h4 className="font-bold text-red-400 text-sm">Final Boss: Prof. "Zero Markah"</h4>
                <p className="text-xs text-slate-300">
                  Fasa 1: Baling fail Gred F. Fasa 2: Perisai Trapezium 3D kebal yang hanya boleh dipecahkan dengan menjawab 3 soalan DSKP 10.2 berturut-turut!
                </p>
              </div>
            </div>
          )}

          {activeTab === 'cara' && (
            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <div className="p-3 bg-slate-800 rounded-xl flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block text-sm mb-1">1. Kumpul Kuasa IQ & Selesaikan Math</strong>
                  Klik pada mentol IQ 3D yang jatuh dari langit atau dijana Cikgu Math. Permainan akan dijeda seketika untuk soalan Math. Jawapan tepat memberi +50 IQ Power & +100 Skor!
                </div>
              </div>

              <div className="p-3 bg-slate-800 rounded-xl flex items-start gap-3">
                <Users className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block text-sm mb-1">2. Susun Wira Pada Petak 3D</strong>
                  Pilih wira daripada dek bawah skrin, kemudian klik pada petak grid 3D untuk meletakkannya. Wira akan menyerang zombi yang memasuki lorong yang sama.
                </div>
              </div>

              <div className="p-3 bg-slate-800 rounded-xl flex items-start gap-3">
                <Check className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block text-sm mb-1">3. Penolak Lorong (Pembersih Lorong 3D)</strong>
                  Setiap lorong dilindungi satu penolak kecemasan 3D di hujung kiri. Jika zombi berjaya mara melepasi barisan anda, penolak akan meluncur laju menyapu semua zombi di lorong tersebut (1 kali guna per lorong).
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Close Button */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl text-xs transition-colors"
          >
            Tutup Panduan
          </button>
        </div>
      </div>
    </div>
  );
};
