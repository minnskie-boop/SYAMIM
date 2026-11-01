import React, { useState } from 'react';
import { MathQuestion } from '../types/game';
import { CheckCircle2, XCircle, Lightbulb, Calculator, HelpCircle } from 'lucide-react';

interface MathQuestionModalProps {
  question: MathQuestion;
  onAnswer: (isCorrect: boolean) => void;
  inkBlinded?: boolean;
}

export const MathQuestionModal: React.FC<MathQuestionModalProps> = ({
  question,
  onAnswer,
  inkBlinded = false,
}) => {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [showFormulaHint, setShowFormulaHint] = useState(false);

  const handleSelect = (idx: number) => {
    if (revealed) return;
    setSelectedIdx(idx);
    setRevealed(true);

    const isCorrect = question.options[idx].isCorrect;
    setTimeout(() => {
      onAnswer(isCorrect);
    }, isCorrect ? 1600 : 2800);
  };

  // Render clean, dynamic pedagogical SVG diagram for each shape
  const renderShapeDiagram = () => {
    const dim = question.dimensions;

    switch (question.shapeType) {
      case 'triangle':
        return (
          <svg className="w-full h-44 mx-auto" viewBox="0 0 280 160">
            {/* Triangle shape */}
            <polygon
              points="40,130 240,130 160,30"
              fill="#bfdbfe"
              stroke="#1d4ed8"
              strokeWidth="3"
            />
            {/* Perpendicular dashed height line */}
            <line
              x1="160"
              y1="30"
              x2="160"
              y2="130"
              stroke="#dc2626"
              strokeWidth="2"
              strokeDasharray="4 3"
            />
            {/* Right angle symbol */}
            <polyline
              points="160,118 172,118 172,130"
              fill="none"
              stroke="#dc2626"
              strokeWidth="2"
            />
            {/* Dimension labels */}
            <text x="140" y="152" fill="#1e3a8a" fontSize="13" fontWeight="bold" textAnchor="middle">
              Tapak = {dim.tapak} cm
            </text>
            <text x="175" y="80" fill="#dc2626" fontSize="12" fontWeight="bold">
              Tinggi = {dim.tinggi} cm
            </text>
            {dim.sisi_condong && (
              <text x="80" y="70" fill="#4b5563" fontSize="11" fontStyle="italic">
                {dim.sisi_condong} cm
              </text>
            )}
          </svg>
        );

      case 'parallelogram':
        return (
          <svg className="w-full h-44 mx-auto" viewBox="0 0 300 160">
            {/* Parallelogram shape */}
            <polygon
              points="45,130 195,130 245,40 95,40"
              fill="#fef08a"
              stroke="#b45309"
              strokeWidth="3"
            />
            {/* Perpendicular height line */}
            <line
              x1="95"
              y1="40"
              x2="95"
              y2="130"
              stroke="#dc2626"
              strokeWidth="2"
              strokeDasharray="4 3"
            />
            <polyline
              points="95,118 107,118 107,130"
              fill="none"
              stroke="#dc2626"
              strokeWidth="2"
            />
            {/* Dimension labels */}
            <text x="120" y="152" fill="#78350f" fontSize="13" fontWeight="bold" textAnchor="middle">
              Tapak = {dim.tapak} cm
            </text>
            <text x="105" y="85" fill="#dc2626" fontSize="12" fontWeight="bold">
              Tinggi t = {dim.tinggi} cm
            </text>
            {dim.sisi_serong && (
              <text x="50" y="80" fill="#6b7280" fontSize="11" fontStyle="italic">
                Sisi = {dim.sisi_serong} cm
              </text>
            )}
          </svg>
        );

      case 'kite':
        return (
          <svg className="w-full h-44 mx-auto" viewBox="0 0 280 160">
            {/* Kite shape */}
            <polygon
              points="140,15 220,70 140,145 60,70"
              fill="#bbf7d0"
              stroke="#15803d"
              strokeWidth="3"
            />
            {/* Diagonals d1 and d2 */}
            <line
              x1="140"
              y1="15"
              x2="140"
              y2="145"
              stroke="#0284c7"
              strokeWidth="2"
              strokeDasharray="4 3"
            />
            <line
              x1="60"
              y1="70"
              x2="220"
              y2="70"
              stroke="#0284c7"
              strokeWidth="2"
              strokeDasharray="4 3"
            />
            {/* Right angle symbol at center intersection */}
            <polyline
              points="140,60 150,60 150,70"
              fill="none"
              stroke="#0284c7"
              strokeWidth="1.5"
            />
            {/* Dimension labels */}
            <text x="146" y="45" fill="#0369a1" fontSize="12" fontWeight="bold">
              d₁ = {dim.pepenjuru_1} cm
            </text>
            <text x="180" y="88" fill="#0369a1" fontSize="12" fontWeight="bold">
              d₂ = {dim.pepenjuru_2} cm
            </text>
          </svg>
        );

      case 'trapezium':
        return (
          <svg className="w-full h-44 mx-auto" viewBox="0 0 280 160">
            {/* Trapezium shape */}
            <polygon
              points="40,130 240,130 200,40 80,40"
              fill="#fed7aa"
              stroke="#c2410c"
              strokeWidth="3"
            />
            {/* Perpendicular height line */}
            <line
              x1="80"
              y1="40"
              x2="80"
              y2="130"
              stroke="#dc2626"
              strokeWidth="2"
              strokeDasharray="4 3"
            />
            <polyline
              points="80,118 92,118 92,130"
              fill="none"
              stroke="#dc2626"
              strokeWidth="2"
            />
            {/* Parallel marks */}
            <text x="140" y="32" fill="#c2410c" fontSize="12" fontWeight="bold" textAnchor="middle">
              a = {dim.sisi_selari_a} cm (atas)
            </text>
            <text x="140" y="152" fill="#c2410c" fontSize="12" fontWeight="bold" textAnchor="middle">
              b = {dim.sisi_selari_b} cm (bawah)
            </text>
            <text x="92" y="85" fill="#dc2626" fontSize="12" fontWeight="bold">
              t = {dim.tinggi} cm
            </text>
          </svg>
        );

      case 'compound':
      default:
        return (
          <svg className="w-full h-44 mx-auto" viewBox="0 0 280 160">
            {/* Compound Rectangle + Triangle */}
            <rect
              x="50"
              y="50"
              width="130"
              height="80"
              fill="#e0e7ff"
              stroke="#4338ca"
              strokeWidth="2.5"
            />
            <polygon
              points="180,50 240,90 180,130"
              fill="#fbcfe8"
              stroke="#db2777"
              strokeWidth="2.5"
            />
            <text x="110" y="95" fill="#3730a3" fontSize="12" fontWeight="bold" textAnchor="middle">
              Segi Empat Tepat
            </text>
            <text x="195" y="95" fill="#9d174d" fontSize="11" fontWeight="bold">
              Segi Tiga
            </text>
            <text x="110" y="145" fill="#1f2937" fontSize="11" textAnchor="middle">
              Langkah: Hitung & Jumlahkan Luas Kedua Bentuk
            </text>
          </svg>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-slate-900 border-2 border-amber-400 rounded-2xl shadow-2xl p-6 text-white overflow-hidden">
        {/* Ink Blinded Overlay if boss ink ability active */}
        {inkBlinded && (
          <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center bg-slate-950/85">
            <div className="text-center p-6 bg-slate-900/90 rounded-2xl border border-purple-500 shadow-xl">
              <span className="text-4xl">🐙💦</span>
              <p className="text-purple-300 font-bold mt-2 text-lg">Dakwat Sotong Mengaburkan Pandangan!</p>
              <p className="text-xs text-slate-400 mt-1">Perhatikan rajah dengan teliti!</p>
            </div>
          </div>
        )}

        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-700 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-500/20 text-amber-400 rounded-lg">
              <Lightbulb className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                DSKP 10.2: {question.topic}
              </span>
              <h2 className="text-lg font-bold text-slate-100">Koleksi Kuasa IQ Warga Sekolah</h2>
            </div>
          </div>

          <button
            onClick={() => setShowFormulaHint(!showFormulaHint)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-900/60 hover:bg-blue-800 text-blue-200 border border-blue-600 rounded-lg text-xs font-medium transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
            <span>{showFormulaHint ? 'Sembunyi Rumus' : 'Bantuan Rumus'}</span>
          </button>
        </div>

        {/* Formula Hint Card */}
        {showFormulaHint && (
          <div className="mb-3 p-3 bg-blue-950/80 border border-blue-500/50 rounded-xl text-xs text-blue-200 flex items-center gap-3">
            <Calculator className="w-5 h-5 text-blue-400 shrink-0" />
            <div>
              <span className="font-bold text-blue-300">Petua Formula DSKP:</span> {question.formula}
            </div>
          </div>
        )}

        {/* Visual Diagram */}
        <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-2 mb-4">
          {renderShapeDiagram()}
        </div>

        {/* Question Text */}
        <p className="text-sm font-medium text-slate-200 leading-relaxed mb-4">
          {question.question}
        </p>

        {/* Options Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {question.options.map((opt, idx) => {
            let btnStyle = 'bg-slate-800 hover:bg-slate-700 border-slate-600 text-slate-100';

            if (revealed) {
              if (opt.isCorrect) {
                btnStyle = 'bg-emerald-600 border-emerald-400 text-white shadow-lg shadow-emerald-500/30 scale-[1.02]';
              } else if (selectedIdx === idx) {
                btnStyle = 'bg-rose-600 border-rose-400 text-white';
              } else {
                btnStyle = 'bg-slate-800/40 border-slate-700 text-slate-500 opacity-50';
              }
            }

            return (
              <button
                key={opt.label}
                disabled={revealed}
                onClick={() => handleSelect(idx)}
                className={`flex items-center gap-3 p-3 rounded-xl border-2 font-semibold text-sm transition-all duration-150 text-left ${btnStyle}`}
              >
                <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-black/25 text-amber-300 font-bold shrink-0">
                  {opt.label}
                </span>
                <span className="truncate">{opt.value} cm² / unit²</span>
              </button>
            );
          })}
        </div>

        {/* Explanation Card upon answering */}
        {revealed && (
          <div
            className={`p-3.5 rounded-xl border flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2 ${
              question.options[selectedIdx!].isCorrect
                ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
                : 'bg-rose-950/80 border-rose-500 text-rose-200'
            }`}
          >
            {question.options[selectedIdx!].isCorrect ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            )}
            <div className="text-xs leading-relaxed">
              <p className="font-bold text-sm mb-1">
                {question.options[selectedIdx!].isCorrect
                  ? 'TAHNIAH! JAWAPAN TEPAT (+50 IQ Power, +100 Skor)!'
                  : 'KURANG TEPAT! (+10 IQ Power ganti rugi)'}
              </p>
              <pre className="font-sans whitespace-pre-wrap">{question.explanation}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
