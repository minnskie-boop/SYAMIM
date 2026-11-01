import { MathQuestion } from '../types/game';

// DSKP 10.2 Matematik Tingkatan 1: Luas Segi Tiga, Segi Empat Selari, Lelayang dan Trapezium
export function generateQuestionForStage(stage: number): MathQuestion {
  // Stage 1 & 2: Segi Tiga, Segi Empat Selari, Anggaran Grid
  // Stage 3 & 4: Lelayang, Trapezium
  // Stage 5: Luas Gabungan Bentuk & Masalah KBAT

  const randInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
  const pickRandom = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

  if (stage === 1 || stage === 2) {
    const isTriangle = Math.random() < 0.6;
    if (isTriangle) {
      // Segi Tiga: Luas = 1/2 * t * h
      // Ensure even base or even height so area is an integer
      const base = randInt(3, 10) * 2;
      const height = randInt(4, 12);
      const slant = Math.round(Math.sqrt((base / 2) ** 2 + height ** 2)) + 1; // pengganggu (hipotenus/sisi condong)
      const correctArea = 0.5 * base * height;

      // Trap 1: Forgetting 1/2 -> base * height
      const trap1 = base * height;
      // Trap 2: Using slant height -> 0.5 * base * slant
      const trap2 = Math.round(0.5 * base * slant);
      // Trap 3: base + height
      const trap3 = base + height;

      const distractors = Array.from(new Set([trap1, trap2, trap3, correctArea + 6, correctArea - 4]))
        .filter(v => v !== correctArea && v > 0)
        .slice(0, 3);

      const allAnswers = [
        { label: 'A', value: correctArea, isCorrect: true },
        { label: 'B', value: distractors[0], isCorrect: false },
        { label: 'C', value: distractors[1], isCorrect: false },
        { label: 'D', value: distractors[2] ?? (correctArea + 8), isCorrect: false },
      ].sort(() => Math.random() - 0.5);

      const labels = ['A', 'B', 'C', 'D'];
      const finalOptions = allAnswers.map((opt, i) => ({
        ...opt,
        label: labels[i],
      }));

      return {
        id: `q_${Date.now()}_${Math.random()}`,
        topic: 'Segi Tiga',
        shapeType: 'triangle',
        question: `Rajah menunjukkan sebuah segi tiga dengan tapak = ${base} cm, tinggi serenjang = ${height} cm dan sisi condong = ${slant} cm. Hitung luas segi tiga tersebut.`,
        formula: 'Luas = 1/2 × tapak × tinggi serenjang',
        dimensions: { tapak: base, tinggi: height, sisi_condong: slant },
        options: finalOptions,
        explanation: `Rumus Luas Segi Tiga = 1/2 × tapak × tinggi\n= 1/2 × ${base} cm × ${height} cm\n= ${correctArea} cm².\n(Peringatan: Abaikan sisi condong ${slant} cm, gunakan tinggi tegak serenjang!)`,
        level: stage,
      };
    } else {
      // Segi Empat Selari: Luas = t * h
      const base = randInt(5, 14);
      const height = randInt(4, 10);
      const slant = height + randInt(2, 4); // sisi condong sebagai pengganggu
      const correctArea = base * height;

      // Trap 1: Using 1/2 * base * height
      const trap1 = Math.round(0.5 * base * height);
      // Trap 2: base * slant
      const trap2 = base * slant;
      // Trap 3: 2 * (base + height) [perimeter trap]
      const trap3 = 2 * (base + slant);

      const distractors = Array.from(new Set([trap1, trap2, trap3, correctArea + 10, correctArea - 8]))
        .filter(v => v !== correctArea && v > 0)
        .slice(0, 3);

      const allAnswers = [
        { label: 'A', value: correctArea, isCorrect: true },
        { label: 'B', value: distractors[0], isCorrect: false },
        { label: 'C', value: distractors[1], isCorrect: false },
        { label: 'D', value: distractors[2] ?? (correctArea + 12), isCorrect: false },
      ].sort(() => Math.random() - 0.5);

      const labels = ['A', 'B', 'C', 'D'];
      const finalOptions = allAnswers.map((opt, i) => ({
        ...opt,
        label: labels[i],
      }));

      return {
        id: `q_${Date.now()}_${Math.random()}`,
        topic: 'Segi Empat Selari',
        shapeType: 'parallelogram',
        question: `Diberi sebuah segi empat selari mempunyai panjang tapak ${base} cm, tinggi serenjang ${height} cm, dan sisi serong ${slant} cm. Berapakah luasnya?`,
        formula: 'Luas = tapak × tinggi serenjang',
        dimensions: { tapak: base, tinggi: height, sisi_serong: slant },
        options: finalOptions,
        explanation: `Rumus Luas Segi Empat Selari = tapak × tinggi serenjang\n= ${base} cm × ${height} cm\n= ${correctArea} cm².\n(Jangan bahagi 2 dan jangan gunakan sisi serong ${slant} cm!)`,
        level: stage,
      };
    }
  } else if (stage === 3 || stage === 4) {
    const isKite = Math.random() < 0.5;
    if (isKite) {
      // Lelayang: Luas = 1/2 * d1 * d2
      const d1 = randInt(3, 8) * 2;
      const d2 = randInt(4, 12);
      const correctArea = 0.5 * d1 * d2;

      // Trap 1: Forgot 1/2 -> d1 * d2
      const trap1 = d1 * d2;
      // Trap 2: d1 + d2
      const trap2 = d1 + d2;
      // Trap 3: 2 * (d1 + d2)
      const trap3 = 2 * (d1 + d2);

      const distractors = Array.from(new Set([trap1, trap2, trap3, correctArea + 6, correctArea - 5]))
        .filter(v => v !== correctArea && v > 0)
        .slice(0, 3);

      const allAnswers = [
        { label: 'A', value: correctArea, isCorrect: true },
        { label: 'B', value: distractors[0], isCorrect: false },
        { label: 'C', value: distractors[1], isCorrect: false },
        { label: 'D', value: distractors[2] ?? (correctArea + 14), isCorrect: false },
      ].sort(() => Math.random() - 0.5);

      const labels = ['A', 'B', 'C', 'D'];
      const finalOptions = allAnswers.map((opt, i) => ({
        ...opt,
        label: labels[i],
      }));

      return {
        id: `q_${Date.now()}_${Math.random()}`,
        topic: 'Lelayang',
        shapeType: 'kite',
        question: `Rajah sebuah lelayang hiasan sekolah mempunyai dua garis pepenjuru dengan panjang ${d1} cm dan ${d2} cm. Cari luas lelayang tersebut.`,
        formula: 'Luas = 1/2 × pepenjuru 1 × pepenjuru 2',
        dimensions: { pepenjuru_1: d1, pepenjuru_2: d2 },
        options: finalOptions,
        explanation: `Rumus Luas Lelayang = 1/2 × d₁ × d₂\n= 1/2 × ${d1} cm × ${d2} cm\n= ${correctArea} cm².`,
        level: stage,
      };
    } else {
      // Trapezium: Luas = 1/2 * (a + b) * h
      const a = randInt(4, 12);
      const diff = randInt(2, 6) * 2; // ensure (a+b) is even or h is even
      const b = a + diff;
      const h = randInt(4, 10);
      const correctArea = 0.5 * (a + b) * h;

      // Trap 1: Forgot 1/2 -> (a + b) * h
      const trap1 = (a + b) * h;
      // Trap 2: Just a * h or b * h
      const trap2 = b * h;
      // Trap 3: 1/2 * a * b * h
      const trap3 = Math.round(0.5 * a * b);

      const distractors = Array.from(new Set([trap1, trap2, trap3, correctArea + 8, correctArea - 6]))
        .filter(v => v !== correctArea && v > 0)
        .slice(0, 3);

      const allAnswers = [
        { label: 'A', value: correctArea, isCorrect: true },
        { label: 'B', value: distractors[0], isCorrect: false },
        { label: 'C', value: distractors[1], isCorrect: false },
        { label: 'D', value: distractors[2] ?? (correctArea + 16), isCorrect: false },
      ].sort(() => Math.random() - 0.5);

      const labels = ['A', 'B', 'C', 'D'];
      const finalOptions = allAnswers.map((opt, i) => ({
        ...opt,
        label: labels[i],
      }));

      return {
        id: `q_${Date.now()}_${Math.random()}`,
        topic: 'Trapezium',
        shapeType: 'trapezium',
        question: `Sebuah trapezium mempunyai dua sisi selari yang berukuran ${a} cm dan ${b} cm, manakala tinggi serenjang di antaranya ialah ${h} cm. Kirakan luas trapezium itu.`,
        formula: 'Luas = 1/2 × (a + b) × tinggi',
        dimensions: { sisi_selari_a: a, sisi_selari_b: b, tinggi: h },
        options: finalOptions,
        explanation: `Rumus Luas Trapezium = 1/2 × (hasil tambah dua sisi selari) × tinggi\n= 1/2 × (${a} + ${b}) × ${h}\n= 1/2 × ${a + b} × ${h}\n= ${correctArea} cm².`,
        level: stage,
      };
    }
  } else {
    // Stage 5: Luas Gabungan Bentuk & KBAT
    // e.g., Segi empat tepat + Segi tiga ATAU Segi empat tepat tolak Segi tiga
    const type = pickRandom(['taman_sekolah', 'pentas_dewan', 'perisai_boss']);

    if (type === 'taman_sekolah') {
      // Taman Sekolah: Segi Empat Tepat (panjang L, lebar W) + Segi Tiga (tapak W, tinggi H_tri)
      const length = randInt(8, 14);
      const width = randInt(4, 8) * 2; // genap
      const triHeight = randInt(3, 7);

      const areaRect = length * width;
      const areaTri = 0.5 * width * triHeight;
      const totalArea = areaRect + areaTri;

      const trap1 = areaRect;
      const trap2 = areaRect + (width * triHeight);
      const trap3 = (length + width) * 2;

      const distractors = Array.from(new Set([trap1, trap2, trap3, totalArea + 10, totalArea - 12]))
        .filter(v => v !== totalArea && v > 0)
        .slice(0, 3);

      const allAnswers = [
        { label: 'A', value: totalArea, isCorrect: true },
        { label: 'B', value: distractors[0], isCorrect: false },
        { label: 'C', value: distractors[1], isCorrect: false },
        { label: 'D', value: distractors[2] ?? (totalArea + 18), isCorrect: false },
      ].sort(() => Math.random() - 0.5);

      const labels = ['A', 'B', 'C', 'D'];
      const finalOptions = allAnswers.map((opt, i) => ({
        ...opt,
        label: labels[i],
      }));

      return {
        id: `q_${Date.now()}_${Math.random()}`,
        topic: 'Gabungan Bentuk',
        shapeType: 'compound',
        question: `(KBAT Taman Herba Sekolah) Rajah menunjukkan pelan gabungan segi empat tepat (${length} m × ${width} m) dan segi tiga sama kaki di hujungnya (tapak = ${width} m, tinggi = ${triHeight} m). Cari luas keseluruhan tanah itu dalam m².`,
        formula: 'Luas Keseluruhan = Luas Segi Empat Tepat + Luas Segi Tiga',
        dimensions: { panjang_tepat: length, lebar_tepat: width, tinggi_segi_tiga: triHeight },
        options: finalOptions,
        explanation: `Langkah 1 (Luas Segi Empat Tepat) = ${length} × ${width} = ${areaRect} m².\nLangkah 2 (Luas Segi Tiga) = 1/2 × ${width} × ${triHeight} = ${areaTri} m².\nJumlah Luas Gabungan = ${areaRect} + ${areaTri} = ${totalArea} m².`,
        level: 5,
      };
    } else if (type === 'pentas_dewan') {
      // Kawasan Berlorek: Segi Empat Tepat (L × W) ditolak Segi Tiga atau Trapezium kecil di bucu
      const L = 16;
      const W = 10;
      const triBase = 6;
      const triH = 4;
      const areaTotal = L * W;
      const areaWhite = 0.5 * triBase * triH;
      const shadedArea = areaTotal - areaWhite;

      const trap1 = areaTotal;
      const trap2 = areaTotal + areaWhite;
      const trap3 = shadedArea - 10;

      const distractors = Array.from(new Set([trap1, trap2, trap3, shadedArea + 12]))
        .filter(v => v !== shadedArea && v > 0)
        .slice(0, 3);

      const allAnswers = [
        { label: 'A', value: shadedArea, isCorrect: true },
        { label: 'B', value: distractors[0], isCorrect: false },
        { label: 'C', value: distractors[1], isCorrect: false },
        { label: 'D', value: distractors[2] ?? (shadedArea + 15), isCorrect: false },
      ].sort(() => Math.random() - 0.5);

      const labels = ['A', 'B', 'C', 'D'];
      const finalOptions = allAnswers.map((opt, i) => ({
        ...opt,
        label: labels[i],
      }));

      return {
        id: `q_${Date.now()}_${Math.random()}`,
        topic: 'Gabungan Bentuk',
        shapeType: 'compound',
        question: `(KBAT Dinding Pentas Dewan) Sehelai kain rentang berbentuk segi empat tepat (${L} m × ${W} m) dipotong sebahagiannya di bucu membentuk segi tiga bersudut tegak (tapak = ${triBase} m, tinggi = ${triH} m). Berapakah baki luas kain rentang yang tinggal (kawasan berlorek)?`,
        formula: 'Luas Kawasan Tinggal = Luas Segi Empat Tepat - Luas Segi Tiga Dipotong',
        dimensions: { kain_panjang: L, kain_lebar: W, potong_tapak: triBase, potong_tinggi: triH },
        options: finalOptions,
        explanation: `Luas Segi Empat Tepat Asal = ${L} × ${W} = ${areaTotal} m².\nLuas Segi Tiga Dipotong = 1/2 × ${triBase} × ${triH} = ${areaWhite} m².\nBaki Luas Kain = ${areaTotal} - ${areaWhite} = ${shadedArea} m².`,
        level: 5,
      };
    } else {
      // Perisai Trapezium Boss:
      const a = 10;
      const b = 18;
      const h = 8;
      const correctArea = 0.5 * (a + b) * h;

      const trap1 = (a + b) * h;
      const trap2 = 0.5 * a * b;
      const trap3 = b * h;

      const distractors = Array.from(new Set([trap1, trap2, trap3, correctArea + 10, correctArea - 8]))
        .filter(v => v !== correctArea && v > 0)
        .slice(0, 3);

      const allAnswers = [
        { label: 'A', value: correctArea, isCorrect: true },
        { label: 'B', value: distractors[0], isCorrect: false },
        { label: 'C', value: distractors[1], isCorrect: false },
        { label: 'D', value: distractors[2] ?? (correctArea + 20), isCorrect: false },
      ].sort(() => Math.random() - 0.5);

      const labels = ['A', 'B', 'C', 'D'];
      const finalOptions = allAnswers.map((opt, i) => ({
        ...opt,
        label: labels[i],
      }));

      return {
        id: `q_${Date.now()}_${Math.random()}`,
        topic: 'Trapezium',
        shapeType: 'trapezium',
        question: `(PERISAI BOS PROF ZERO) Perisai tenaga bos berbentuk trapezium berdimensi sisi atas ${a} unit, sisi bawah ${b} unit, dan tinggi serenjang ${h} unit. Hitung luas medan perisai untuk memecahkannya!`,
        formula: 'Luas = 1/2 × (a + b) × t',
        dimensions: { sisi_selari_a: a, sisi_selari_b: b, tinggi: h },
        options: finalOptions,
        explanation: `Medan Perisai Trapezium = 1/2 × (${a} + ${b}) × ${h}\n= 1/2 × 28 × 8 = 112 unit².\nTahniah, jawapan tepat melemahkan perisai!`,
        level: 5,
      };
    }
  }
}
