import React from 'react';
import { PlayerProfile } from '../types/game';
import { X, Trophy, Award, Target, BookCheck, Download } from 'lucide-react';

interface ScoreboardModalProps {
  profile: PlayerProfile;
  onClose: () => void;
  allRecords?: PlayerProfile[];
}

export const ScoreboardModal: React.FC<ScoreboardModalProps> = ({ profile, onClose, allRecords = [] }) => {
  const accuracy =
    profile.mathAttempted > 0
      ? Math.round((profile.mathCorrect / profile.mathAttempted) * 100)
      : 100;

  // Export report for teachers
  const handleExportTeacherReport = () => {
    const report = {
      namaMurid: profile.studentName,
      kelas: profile.className,
      tarikh: new Date().toLocaleDateString('ms-MY'),
      jumlahSkor: profile.totalScore,
      ketepatanMath: `${accuracy}%`,
      soalanDijawab: profile.mathAttempted,
      soalanBetul: profile.mathCorrect,
      rekodTahap: profile.stageHighScores,
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Laporan_Math_DSKP10.2_${profile.studentName.replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border-2 border-yellow-500 rounded-2xl shadow-2xl p-6 text-white flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-700 pb-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-yellow-500/20 text-yellow-400 rounded-xl">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Papan Skor & Rekod Prestasi Murid</h2>
              <p className="text-xs text-slate-400">
                Pemantauan Penguasaan Matematik DSKP 10.2 (Tingkatan 1)
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

        {/* Student Profile Summary Box */}
        <div className="p-4 bg-gradient-to-r from-slate-800 to-indigo-950/80 border border-slate-700 rounded-xl mb-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-xs text-indigo-300 font-semibold uppercase block">Profil Murid:</span>
              <h3 className="text-lg font-black text-white">{profile.studentName || 'Murid Pintar'}</h3>
              <p className="text-xs text-slate-300">Kelas: {profile.className || 'Tingkatan 1'}</p>
            </div>

            <div className="flex items-center gap-4 text-center">
              <div className="p-2.5 bg-black/30 rounded-xl border border-slate-700">
                <span className="text-[10px] text-slate-400 uppercase block">Jumlah Skor</span>
                <span className="text-xl font-black text-amber-400">{profile.totalScore}</span>
              </div>
              <div className="p-2.5 bg-black/30 rounded-xl border border-slate-700">
                <span className="text-[10px] text-slate-400 uppercase block">Ketepatan Math</span>
                <span
                  className={`text-xl font-black ${
                    accuracy >= 80 ? 'text-emerald-400' : accuracy >= 50 ? 'text-amber-400' : 'text-rose-400'
                  }`}
                >
                  {accuracy}%
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-700/60 text-xs text-slate-300">
            <div className="flex items-center gap-1.5">
              <BookCheck className="w-4 h-4 text-emerald-400" />
              <span>Jawapan Tepat: {profile.mathCorrect} soalan</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Target className="w-4 h-4 text-blue-400" />
              <span>Jumlah Dicuba: {profile.mathAttempted} soalan</span>
            </div>
          </div>
        </div>

        {/* Stage High Scores Table */}
        <div className="flex-1 overflow-y-auto mb-4">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
            Rekod Terbaik Setiap Peringkat (Stage Best Scores):
          </span>
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((s) => {
              const stageNames = [
                'Stage 1: Padang Sekolah (Siang) - Segi Tiga & Segi Empat Selari',
                'Stage 2: Gelanggang Sukan (Petang) - Segi Empat Selari & Grid',
                'Stage 3: Kolam Renang Akuatik - Lelayang & Trapezium',
                'Stage 4: Dewan Terbuka (Malam) - Trapezium & Bentuk Gabungan',
                'Stage 5: Bumbung Sekolah (Final) - Prof Zero & KBAT',
              ];
              const score = profile.stageHighScores[s] || 0;

              return (
                <div
                  key={s}
                  className="p-3 bg-slate-800/80 border border-slate-700 rounded-xl flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center text-xs font-bold">
                      {s}
                    </div>
                    <span className="text-xs font-medium text-slate-200">{stageNames[s - 1]}</span>
                  </div>

                  <span className="text-sm font-black text-amber-400">
                    {score > 0 ? `${score} Mata` : 'Belum Selesai'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Teacher Tracking Actions */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={handleExportTeacherReport}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Muat Turun Laporan Guru (.JSON)</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xs font-bold transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
