import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  HelpCircle,
  Home,
  Layers,
  Palette,
  Play,
  RotateCcw,
  Shapes,
  Sparkles,
  Volume2,
  VolumeX,
  XCircle,
} from 'lucide-react';
import { QUIZ_QUESTIONS, QuizTopic } from './data/questions';
import { QuestionVisual } from './components/QuestionVisual';
import { ConfettiBurst } from './components/ConfettiBurst';
import { soundManager } from './utils/sound';

type GameState = 'MENU' | 'PLAYING' | 'FINISHED';

interface AnswerRecord {
  questionId: number;
  topic: QuizTopic;
  selectedOption: number | null;
  correctIndex: number;
  isCorrect: boolean;
  isTimedOut: boolean;
}

interface PredicateInfo {
  title: string;
  grade: string;
  message: string;
  accentClass: string;
  surfaceClass: string;
}

const QUESTION_TIME_SECONDS = 20;
const POINTS_PER_CORRECT = 10;
const TOTAL_QUESTIONS = QUIZ_QUESTIONS.length;
const OPTION_LABELS = ['A', 'B', 'C', 'D'] as const;

const HERO_STUDIO_IMG = '/src/assets/images/hero_art_studio_1794819026359.jpg';
const TROPHY_IMG = '/src/assets/images/trophy_art_medal_1794819025757.jpg';
const UNSUR_IMG = '/src/assets/images/unsur_seni_rupa_1794819026627.jpg';
const SENI_3D_IMG = '/src/assets/images/seni_tiga_dimensi_1794819027005.jpg';

const TOPICS_LIST: QuizTopic[] = [
  'Unsur Seni Rupa',
  'Garis, Bentuk, Warna, Tekstur & Ruang',
  'Prinsip Seni Rupa',
  'Seni Rupa 2D & 3D',
];

function getPredicate(score: number): PredicateInfo {
  if (score >= 180) {
    return {
      title: 'Seniman Hebat!',
      grade: 'Sangat Baik',
      message: 'Luar biasa! Kamu menguasai unsur, prinsip, dan karya seni rupa kelas 6 dengan sangat baik.',
      accentClass: 'text-emerald-700',
      surfaceClass: 'bg-emerald-50 border-emerald-200',
    };
  }
  if (score >= 140) {
    return {
      title: 'Kreator Berbakat!',
      grade: 'Baik',
      message: 'Kerja bagus! Pemahamanmu tentang seni rupa sudah kuat, tinggal pertajam beberapa detail saja.',
      accentClass: 'text-blue-700',
      surfaceClass: 'bg-blue-50 border-blue-200',
    };
  }
  if (score >= 100) {
    return {
      title: 'Perupa Muda!',
      grade: 'Cukup',
      message: 'Semangat terus! Kamu sudah memahami dasar seni rupa dan bisa meraih skor lebih tinggi lagi.',
      accentClass: 'text-amber-800',
      surfaceClass: 'bg-amber-50 border-amber-200',
    };
  }
  return {
    title: 'Terus Berlatih!',
    grade: 'Perlu Bimbingan',
    message: 'Jangan menyerah! Baca kembali pembahasan setiap soal dan coba main lagi untuk meningkatkan skormu.',
    accentClass: 'text-rose-700',
    surfaceClass: 'bg-rose-50 border-rose-200',
  };
}

export default function App() {
  const [gameState, setGameState] = useState<GameState>('MENU');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME_SECONDS);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isTimedOut, setIsTimedOut] = useState(false);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [confettiKey, setConfettiKey] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showReview, setShowReview] = useState(false);

  const [heroImgFailed, setHeroImgFailed] = useState(false);
  const [trophyImgFailed, setTrophyImgFailed] = useState(false);
  const [unsurImgFailed, setUnsurImgFailed] = useState(false);
  const [seni3dImgFailed, setSeni3dImgFailed] = useState(false);

  const nextButtonRef = useRef<HTMLButtonElement | null>(null);
  const currentQuestion = QUIZ_QUESTIONS[currentIndex];
  const hasAnswered = selectedOption !== null || isTimedOut;

  // Keep SoundManager synced with UI state
  useEffect(() => {
    soundManager.enabled = soundEnabled;
  }, [soundEnabled]);

  // 20-second countdown timer per question
  useEffect(() => {
    if (gameState !== 'PLAYING' || hasAnswered) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(intervalId);
          return 0;
        }
        const nextVal = prev - 1;
        if (nextVal <= 5 && nextVal > 0) {
          soundManager.playTick();
        }
        return nextVal;
      });
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [gameState, hasAnswered, currentIndex]);

  // Handle timeout when timer reaches 0
  useEffect(() => {
    if (gameState !== 'PLAYING' || hasAnswered || timeLeft > 0) {
      return;
    }

    setIsTimedOut(true);
    soundManager.playWrong();
    setAnswers((prev) => {
      if (prev.some((item) => item.questionId === currentQuestion.id)) {
        return prev;
      }
      return [
        ...prev,
        {
          questionId: currentQuestion.id,
          topic: currentQuestion.topic,
          selectedOption: null,
          correctIndex: currentQuestion.correctIndex,
          isCorrect: false,
          isTimedOut: true,
        },
      ];
    });
  }, [gameState, hasAnswered, timeLeft, currentQuestion]);

  // Auto-hide transient confetti burst after animation
  useEffect(() => {
    if (!showConfetti) return;
    const timer = window.setTimeout(() => setShowConfetti(false), 1100);
    return () => window.clearTimeout(timer);
  }, [showConfetti, confettiKey]);

  const startNewGame = () => {
    soundManager.playClick();
    setCurrentIndex(0);
    setScore(0);
    setTimeLeft(QUESTION_TIME_SECONDS);
    setSelectedOption(null);
    setIsTimedOut(false);
    setAnswers([]);
    setShowConfetti(false);
    setShowReview(false);
    setGameState('PLAYING');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const returnToMenu = () => {
    soundManager.playClick();
    setGameState('MENU');
    setShowConfetti(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectAnswer = (optionIdx: number) => {
    if (hasAnswered || gameState !== 'PLAYING') return;

    setSelectedOption(optionIdx);
    const isCorrect = optionIdx === currentQuestion.correctIndex;

    if (isCorrect) {
      setScore((prev) => prev + POINTS_PER_CORRECT);
      soundManager.playCorrect();
      setConfettiKey((k) => k + 1);
      setShowConfetti(true);
    } else {
      soundManager.playWrong();
    }

    setAnswers((prev) => [
      ...prev,
      {
        questionId: currentQuestion.id,
        topic: currentQuestion.topic,
        selectedOption: optionIdx,
        correctIndex: currentQuestion.correctIndex,
        isCorrect,
        isTimedOut: false,
      },
    ]);
  };

  const handleNextQuestion = () => {
    soundManager.playClick();
    if (currentIndex + 1 < TOTAL_QUESTIONS) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsTimedOut(false);
      setTimeLeft(QUESTION_TIME_SECONDS);
    } else {
      soundManager.playFinish();
      setGameState('FINISHED');
      if (score >= 100) {
        setConfettiKey((k) => k + 1);
        setShowConfetti(true);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Keyboard shortcuts during gameplay (A-D / 1-4 to answer, Enter for next)
  useEffect(() => {
    if (gameState !== 'PLAYING') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!hasAnswered) {
        const keyMap: Record<string, number> = {
          '1': 0,
          '2': 1,
          '3': 2,
          '4': 3,
          a: 0,
          b: 1,
          c: 2,
          d: 3,
        };
        const mapped = keyMap[e.key.toLowerCase()];
        if (mapped !== undefined) {
          e.preventDefault();
          handleSelectAnswer(mapped);
        }
      } else if (e.key === 'Enter') {
        e.preventDefault();
        handleNextQuestion();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  const correctCount = useMemo(
    () => answers.filter((a) => a.isCorrect).length,
    [answers]
  );

  const topicBreakdown = useMemo(() => {
    return TOPICS_LIST.map((topic) => {
      const topicAnswers = answers.filter((a) => a.topic === topic);
      const totalInTopic = QUIZ_QUESTIONS.filter((q) => q.topic === topic).length;
      const correctInTopic = topicAnswers.filter((a) => a.isCorrect).length;
      return {
        topic,
        correct: correctInTopic,
        total: totalInTopic,
      };
    });
  }, [answers]);

  const predicate = getPredicate(score);

  return (
    <div className="min-h-screen bg-[#F6F8FC] text-slate-800 flex flex-col">
      {showConfetti && <ConfettiBurst burstKey={confettiKey} />}

      {/* MENU VIEW */}
      {gameState === 'MENU' && (
        <>
          {/* Clean 3-Zone Top Bar */}
          <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur-sm">
            <div className="mx-auto flex max-w-6xl items-center justify-between gap-8 px-4 py-3.5 sm:px-6">
              <a
                href="#top"
                className="font-display text-lg font-extrabold tracking-tight text-slate-900 whitespace-nowrap shrink-0"
              >
                Art Quiz Challenge
              </a>

              <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
                <a href="#aturan" className="hover:text-blue-600 transition-colors whitespace-nowrap shrink-0">
                  Aturan Main
                </a>
                <a href="#materi" className="hover:text-blue-600 transition-colors whitespace-nowrap shrink-0">
                  Materi Kuis
                </a>
                <a href="#penilaian" className="hover:text-blue-600 transition-colors whitespace-nowrap shrink-0">
                  Sistem Predikat
                </a>
              </nav>

              <div className="flex items-center shrink-0">
                <button
                  type="button"
                  onClick={startNewGame}
                  className="inline-flex min-h-[40px] items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:bg-blue-700 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Play className="h-4 w-4 fill-current" />
                  <span>Mulai Game</span>
                </button>
              </div>
            </div>
          </header>

          <main id="top" className="flex-1">
            {/* Hero Section */}
            <section className="mx-auto max-w-6xl px-4 pt-8 pb-10 sm:px-6 sm:pt-12 sm:pb-14">
              <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12">
                <div className="flex flex-col justify-center lg:col-span-6">
                  <p className="text-sm font-semibold text-blue-600">
                    Seni Rupa Kelas 6 SD · 20 Soal Pilihan Ganda
                  </p>
                  <h1 className="font-display mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl leading-[1.15] text-balance">
                    ART QUIZ CHALLENGE – SENI RUPA KELAS 6
                  </h1>
                  <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
                    Uji pengetahuanmu tentang unsur seni rupa, warna, prinsip komposisi, serta karya dua dimensi dan tiga dimensi dalam kuis seru berhadiah poin dan predikat seniman!
                  </p>

                  <div className="mt-7 flex flex-wrap items-center gap-4">
                    <button
                      type="button"
                      onClick={startNewGame}
                      className="inline-flex min-h-[48px] items-center justify-center gap-2.5 rounded-2xl bg-blue-600 px-7 py-3 text-base font-bold text-white shadow-md shadow-blue-600/20 transition-all duration-150 hover:bg-blue-700 hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <Play className="h-5 w-5 fill-current" />
                      <span>Mulai Game</span>
                    </button>

                    <a
                      href="#materi"
                      className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-3 text-base font-semibold text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50 whitespace-nowrap shrink-0"
                    >
                      <BookOpen className="h-5 w-5 text-blue-600" />
                      <span>Pelajari Topik</span>
                    </a>
                  </div>
                </div>

                <div className="lg:col-span-6">
                  <div className="relative h-64 sm:h-80 lg:h-full min-h-[280px] w-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                    {!heroImgFailed ? (
                      <img
                        src={HERO_STUDIO_IMG}
                        alt="Ilustrasi meja belajar seni rupa dengan kuas, palet cat air, balok warna, origami, dan pot tanah liat"
                        referrerPolicy="no-referrer"
                        onError={() => setHeroImgFailed(true)}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-amber-50 to-emerald-50 p-8 text-center">
                        <Palette className="h-16 w-16 text-blue-600" />
                        <p className="font-display mt-4 text-xl font-bold text-slate-800">
                          Studio Seni Rupa Kelas 6
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Full-Width 4-Column Rules Strip Below Hero Split */}
              <div
                id="aturan"
                className="mt-10 grid grid-cols-2 gap-4 rounded-2xl border border-slate-200 bg-white p-5 sm:grid-cols-4 sm:gap-6 sm:p-6"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <HelpCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-display text-xl font-bold text-slate-900 tabular-nums">20 Soal</p>
                    <p className="text-xs sm:text-sm text-slate-600">4 pilihan ganda (A–D)</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-display text-xl font-bold text-slate-900 tabular-nums">20 Detik</p>
                    <p className="text-xs sm:text-sm text-slate-600">Timer aktif tiap soal</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-display text-xl font-bold text-slate-900 tabular-nums">+10 Poin</p>
                    <p className="text-xs sm:text-sm text-slate-600">Skor maksimal 200</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                    <Award className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-display text-xl font-bold text-slate-900">Pembahasan</p>
                    <p className="text-xs sm:text-sm text-slate-600">Penjelasan & predikat</p>
                  </div>
                </div>
              </div>
            </section>

            {/* 4 Curriculum Topics */}
            <section id="materi" className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
              <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-blue-600">Cakupan Materi Kuis</p>
                  <h2 className="font-display mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
                    4 Topik Seni Rupa Kelas 6
                  </h2>
                </div>
                <p className="text-sm text-slate-600">
                  Masing-masing topik terdiri dari 5 soal terarah beserta pembahasan singkat.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Topic 1 */}
                <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition-transform duration-150 hover:-translate-y-0.5">
                  <div className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                        <Palette className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-500">Topik 01 · Soal 1–5</p>
                        <h3 className="font-display text-lg font-bold text-slate-900">
                          Unsur Seni Rupa
                        </h3>
                      </div>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-slate-600">
                      Mengenal titik sebagai unsur terkecil, bidang datar, unsur gelap terang untuk kesan volume, serta perbedaan unsur dan prinsip seni.
                    </p>
                  </div>
                </article>

                {/* Topic 2 */}
                <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition-transform duration-150 hover:-translate-y-0.5">
                  <div className="grid grid-cols-1 sm:grid-cols-12 h-full">
                    <div className="p-6 sm:col-span-7">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                          <Shapes className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-500">Topik 02 · Soal 6–10</p>
                          <h3 className="font-display text-lg font-bold text-slate-900">
                            Garis, Bentuk, Warna, Tekstur & Ruang
                          </h3>
                        </div>
                      </div>
                      <p className="mt-3 text-sm leading-relaxed text-slate-600">
                        Karakter garis lengkung dan lurus, bentuk organis, warna primer &amp; sekunder, serta perbedaan tekstur nyata dan tekstur semu.
                      </p>
                    </div>
                    <div className="h-40 sm:h-auto sm:col-span-5 border-t sm:border-t-0 sm:border-l border-slate-100 bg-slate-50">
                      {!unsurImgFailed ? (
                        <img
                          src={UNSUR_IMG}
                          alt="Ilustrasi cat air, roda warna, garis, dan bentuk seni rupa"
                          referrerPolicy="no-referrer"
                          onError={() => setUnsurImgFailed(true)}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-amber-500">
                          <Palette className="h-10 w-10" />
                        </div>
                      )}
                    </div>
                  </div>
                </article>

                {/* Topic 3 */}
                <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition-transform duration-150 hover:-translate-y-0.5">
                  <div className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                        <Layers className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-500">Topik 03 · Soal 11–15</p>
                        <h3 className="font-display text-lg font-bold text-slate-900">
                          Prinsip Keseimbangan, Kesatuan, Irama & Proporsi
                        </h3>
                      </div>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-slate-600">
                      Memahami keseimbangan simetris, kesatuan komposisi (unity), irama pengulangan motif, proporsi ukuran, dan pusat perhatian.
                    </p>
                  </div>
                </article>

                {/* Topic 4 */}
                <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition-transform duration-150 hover:-translate-y-0.5">
                  <div className="grid grid-cols-1 sm:grid-cols-12 h-full">
                    <div className="p-6 sm:col-span-7">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                          <Award className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-500">Topik 04 · Soal 16–20</p>
                          <h3 className="font-display text-lg font-bold text-slate-900">
                            Seni Rupa 2D &amp; 3D
                          </h3>
                        </div>
                      </div>
                      <p className="mt-3 text-sm leading-relaxed text-slate-600">
                        Membedakan karya dua dimensi dan tiga dimensi bervolume, teknik membentuk tanah liat, seni relief dinding candi, serta teknik menganyam.
                      </p>
                    </div>
                    <div className="h-40 sm:h-auto sm:col-span-5 border-t sm:border-t-0 sm:border-l border-slate-100 bg-slate-50">
                      {!seni3dImgFailed ? (
                        <img
                          src={SENI_3D_IMG}
                          alt="Ilustrasi karya 3D seperti vas gerabah, origami, dan patung kayu"
                          referrerPolicy="no-referrer"
                          onError={() => setSeni3dImgFailed(true)}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-rose-500">
                          <Shapes className="h-10 w-10" />
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              </div>
            </section>

            {/* Predicate / Scoring System */}
            <section id="penilaian" className="mx-auto max-w-6xl px-4 pt-4 pb-16 sm:px-6">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-blue-600">Sistem Penilaian &amp; Predikat</p>
                    <h2 className="font-display mt-1 text-2xl font-bold text-slate-900">
                      Kumpulkan Skor Hingga 200 Poin!
                    </h2>
                    <p className="mt-2 max-w-xl text-sm text-slate-600">
                      Setiap jawaban benar bernilai 10 poin. Selesaikan seluruh 20 soal untuk melihat jumlah jawaban benar dan predikat akhirmu.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={startNewGame}
                    className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-2xl bg-blue-600 px-6 py-3 text-base font-bold text-white transition-all duration-150 hover:bg-blue-700 active:scale-[0.98] whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <Play className="h-5 w-5 fill-current" />
                    <span>Mulai Game Sekarang</span>
                  </button>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-4">
                    <p className="font-mono text-sm font-bold text-emerald-700 tabular-nums">180 – 200 Poin</p>
                    <p className="font-display mt-1 text-base font-bold text-slate-900">Seniman Hebat!</p>
                    <p className="text-xs text-slate-600">Predikat: Sangat Baik</p>
                  </div>

                  <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-4">
                    <p className="font-mono text-sm font-bold text-blue-700 tabular-nums">140 – 170 Poin</p>
                    <p className="font-display mt-1 text-base font-bold text-slate-900">Kreator Berbakat!</p>
                    <p className="text-xs text-slate-600">Predikat: Baik</p>
                  </div>

                  <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4">
                    <p className="font-mono text-sm font-bold text-amber-700 tabular-nums">100 – 130 Poin</p>
                    <p className="font-display mt-1 text-base font-bold text-slate-900">Perupa Muda!</p>
                    <p className="text-xs text-slate-600">Predikat: Cukup</p>
                  </div>

                  <div className="rounded-xl border border-rose-200 bg-rose-50/70 p-4">
                    <p className="font-mono text-sm font-bold text-rose-700 tabular-nums">0 – 90 Poin</p>
                    <p className="font-display mt-1 text-base font-bold text-slate-900">Terus Berlatih!</p>
                    <p className="text-xs text-slate-600">Predikat: Perlu Bimbingan</p>
                  </div>
                </div>
              </div>
            </section>
          </main>

          <footer className="border-t border-slate-200 bg-white py-5">
            <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 text-xs text-slate-500 sm:flex-row sm:px-6">
              <span>ART QUIZ CHALLENGE – SENI RUPA KELAS 6</span>
              <span>Media Belajar Interaktif Seni Rupa Sekolah Dasar</span>
            </div>
          </footer>
        </>
      )}

      {/* ACTIVE GAMEPLAY VIEW */}
      {gameState === 'PLAYING' && (
        <div className="flex min-h-screen flex-col">
          {/* Compact Game HUD (fits comfortably under 15% mobile viewport height) */}
          <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
            <div className="mx-auto flex max-w-4xl items-center justify-between gap-3 px-4 py-2.5 sm:px-6">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <button
                  type="button"
                  onClick={returnToMenu}
                  aria-label="Kembali ke menu utama"
                  className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs sm:text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Home className="h-4 w-4 text-slate-500" />
                  <span className="hidden sm:inline">Menu</span>
                </button>
                <span className="font-display text-sm sm:text-base font-bold text-slate-900 truncate">
                  Art Quiz Challenge
                </span>
              </div>

              <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                <div className="text-right">
                  <span className="block text-[11px] font-medium text-slate-500">Skor</span>
                  <span className="font-mono text-sm sm:text-base font-bold text-blue-600 tabular-nums">
                    {score}
                  </span>
                </div>

                <div className="h-6 w-px bg-slate-200" aria-hidden="true" />

                <div
                  className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 font-mono text-sm font-bold tabular-nums transition-colors ${
                    timeLeft <= 5 && !hasAnswered
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : 'bg-slate-100 text-slate-800 border border-slate-200'
                  }`}
                  aria-live="polite"
                >
                  <Clock className={`h-4 w-4 ${timeLeft <= 5 && !hasAnswered ? 'text-rose-600' : 'text-slate-600'}`} />
                  <span>{String(timeLeft).padStart(2, '0')} dtk</span>
                </div>

                <button
                  type="button"
                  onClick={() => setSoundEnabled((prev) => !prev)}
                  aria-label={soundEnabled ? 'Matikan suara efek' : 'Aktifkan suara efek'}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-50 cursor-pointer shrink-0"
                >
                  {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Question Progress Bar */}
            <div className="h-1.5 w-full bg-slate-100">
              <div
                className="h-full bg-blue-600 transition-all duration-300"
                style={{ width: `${((currentIndex + (hasAnswered ? 1 : 0)) / TOTAL_QUESTIONS) * 100}%` }}
              />
            </div>
          </header>

          {/* Main Question Workspace */}
          <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col justify-center px-4 py-5 sm:px-6 sm:py-8">
            <AnimatePresence mode="wait">
              <motion.section
                key={currentQuestion.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className={`rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8 ${
                  isTimedOut ? 'animate-answer-shake' : ''
                }`}
              >
                {/* Unboxed Metadata + Timer Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
                  <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm font-semibold text-slate-500">
                    <span className="text-blue-600 tabular-nums">
                      Soal {currentIndex + 1} / {TOTAL_QUESTIONS}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{currentQuestion.topic}</span>
                  </div>

                  {/* Per-question timer progress bar */}
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-24 sm:w-32 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full transition-all duration-500 ${
                          timeLeft <= 5
                            ? 'bg-rose-500'
                            : timeLeft <= 10
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                        }`}
                        style={{ width: `${(timeLeft / QUESTION_TIME_SECONDS) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Question + Illustration Split */}
                <div className="mt-5 grid grid-cols-1 gap-6 md:grid-cols-12 md:items-start">
                  <div className="md:col-span-8">
                    <h2 className="font-display text-lg font-bold leading-snug text-slate-900 sm:text-2xl">
                      {currentQuestion.question}
                    </h2>

                    {/* 4 Answer Choices */}
                    <div className="mt-5 grid grid-cols-1 gap-3" role="radiogroup" aria-label="Pilihan jawaban">
                      {currentQuestion.options.map((optionText, idx) => {
                        const isSelected = selectedOption === idx;
                        const isCorrectOption = idx === currentQuestion.correctIndex;

                        let buttonStyle =
                          'border-slate-200 bg-white text-slate-800 hover:border-blue-400 hover:bg-blue-50/40';
                        let letterStyle = 'bg-slate-100 text-slate-700 border-slate-200';
                        let animationClass = '';
                        let statusTag: string | null = null;

                        if (hasAnswered) {
                          if (isCorrectOption) {
                            buttonStyle = 'border-emerald-500 bg-emerald-50 text-emerald-950';
                            letterStyle = 'bg-emerald-600 text-white border-emerald-600';
                            statusTag = isSelected ? 'Benar (+10)' : 'Jawaban Benar';
                            if (isSelected) {
                              animationClass = 'animate-answer-pop';
                            }
                          } else if (isSelected && !isCorrectOption) {
                            buttonStyle = 'border-rose-500 bg-rose-50 text-rose-950';
                            letterStyle = 'bg-rose-600 text-white border-rose-600';
                            statusTag = 'Salah';
                            animationClass = 'animate-answer-shake';
                          } else {
                            buttonStyle = 'border-slate-200 bg-slate-50/70 text-slate-400';
                            letterStyle = 'bg-slate-100 text-slate-400 border-slate-200';
                          }
                        }

                        return (
                          <button
                            key={idx}
                            type="button"
                            disabled={hasAnswered}
                            onClick={() => handleSelectAnswer(idx)}
                            className={`group flex min-h-[54px] w-full items-center justify-between gap-3 rounded-2xl border-2 px-4 py-3 text-left transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${buttonStyle} ${animationClass} ${
                              hasAnswered ? 'cursor-default' : 'cursor-pointer active:scale-[0.99]'
                            }`}
                          >
                            <div className="flex items-center gap-3.5 min-w-0">
                              <span
                                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border font-display text-sm font-bold transition-colors ${letterStyle}`}
                              >
                                {OPTION_LABELS[idx]}
                              </span>
                              <span className="text-sm font-semibold sm:text-base leading-snug">
                                {optionText}
                              </span>
                            </div>

                            {hasAnswered && isCorrectOption && (
                              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 whitespace-nowrap shrink-0">
                                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                                <span className="hidden sm:inline">{statusTag}</span>
                              </span>
                            )}

                            {hasAnswered && isSelected && !isCorrectOption && (
                              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-700 whitespace-nowrap shrink-0">
                                <XCircle className="h-5 w-5 text-rose-600" />
                                <span className="hidden sm:inline">{statusTag}</span>
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Educational Visual Companion */}
                  <div className="md:col-span-4">
                    <div className="h-44 sm:h-48 md:h-56 w-full">
                      <QuestionVisual cue={currentQuestion.visualCue} />
                    </div>
                    <p className="mt-2 text-center text-xs text-slate-500">
                      Ilustrasi konsep soal
                    </p>
                  </div>
                </div>

                {/* Explanation & Next Button (Appears after answering or timeout) */}
                <AnimatePresence>
                  {hasAnswered && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                      className={`mt-6 rounded-2xl border p-4 sm:p-5 ${
                        selectedOption === currentQuestion.correctIndex
                          ? 'border-emerald-200 bg-emerald-50/80'
                          : 'border-amber-200 bg-amber-50/80'
                      }`}
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            {selectedOption === currentQuestion.correctIndex ? (
                              <>
                                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                                <p className="font-display text-base font-bold text-emerald-900">
                                  Hebat! Jawabanmu Benar (+10 Poin)
                                </p>
                              </>
                            ) : isTimedOut ? (
                              <>
                                <Clock className="h-5 w-5 text-rose-600 shrink-0" />
                                <p className="font-display text-base font-bold text-rose-900">
                                  Waktu Habis! (0 Poin) · Jawaban benar: {OPTION_LABELS[currentQuestion.correctIndex]}
                                </p>
                              </>
                            ) : (
                              <>
                                <XCircle className="h-5 w-5 text-rose-600 shrink-0" />
                                <p className="font-display text-base font-bold text-slate-900">
                                  Kurang Tepat (0 Poin) · Jawaban benar: {OPTION_LABELS[currentQuestion.correctIndex]}
                                </p>
                              </>
                            )}
                          </div>

                          <p className="text-sm leading-relaxed text-slate-700">
                            <span className="font-bold text-slate-900">Pembahasan: </span>
                            {currentQuestion.explanation}
                          </p>
                        </div>

                        <button
                          ref={nextButtonRef}
                          type="button"
                          onClick={handleNextQuestion}
                          className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-all duration-150 hover:bg-blue-700 active:scale-[0.98] whitespace-nowrap shrink-0 cursor-pointer"
                        >
                          <span>
                            {currentIndex + 1 < TOTAL_QUESTIONS ? 'Soal Berikutnya' : 'Lihat Hasil Akhir'}
                          </span>
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.section>
            </AnimatePresence>
          </main>
        </div>
      )}

      {/* FINAL RESULT VIEW */}
      {gameState === 'FINISHED' && (
        <div className="flex min-h-screen flex-col">
          <header className="border-b border-slate-200 bg-white">
            <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
              <span className="font-display text-lg font-extrabold tracking-tight text-slate-900 whitespace-nowrap">
                Art Quiz Challenge
              </span>
              <button
                type="button"
                onClick={startNewGame}
                className="inline-flex min-h-[40px] items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Main Lagi</span>
              </button>
            </div>
          </header>

          <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10"
            >
              {/* Trophy + Predicate Header */}
              <div className="flex flex-col items-center text-center">
                <div className="h-28 w-28 overflow-hidden rounded-2xl border border-slate-200 bg-amber-50/40 sm:h-32 sm:w-32">
                  {!trophyImgFailed ? (
                    <img
                      src={TROPHY_IMG}
                      alt="Piala penghargaan seniman Art Quiz Challenge"
                      referrerPolicy="no-referrer"
                      onError={() => setTrophyImgFailed(true)}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <Award className="h-14 w-14 text-amber-500" />
                    </div>
                  )}
                </div>

                <p className="mt-5 text-sm font-semibold text-slate-500">
                  Hasil Akhir · Seni Rupa Kelas 6
                </p>
                <h1 className={`font-display mt-1 text-3xl font-extrabold sm:text-4xl ${predicate.accentClass}`}>
                  {predicate.title}
                </h1>
                <p className="mt-1 text-sm font-bold text-slate-700">
                  Predikat: {predicate.grade}
                </p>
                <p className="mt-3 max-w-lg text-sm sm:text-base text-slate-600">
                  {predicate.message}
                </p>
              </div>

              {/* 3 Main Result Stats */}
              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 text-center">
                  <p className="text-xs font-semibold text-slate-500">Skor Akhir</p>
                  <p className="font-display mt-1 text-3xl font-extrabold text-blue-600 tabular-nums">
                    {score} <span className="text-base font-semibold text-slate-400">/ 200</span>
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 text-center">
                  <p className="text-xs font-semibold text-slate-500">Jumlah Jawaban Benar</p>
                  <p className="font-display mt-1 text-3xl font-extrabold text-emerald-600 tabular-nums">
                    {correctCount} <span className="text-base font-semibold text-slate-400">/ {TOTAL_QUESTIONS}</span>
                  </p>
                </div>

                <div className={`rounded-2xl border p-5 text-center ${predicate.surfaceClass}`}>
                  <p className="text-xs font-semibold text-slate-600">Predikat</p>
                  <p className={`font-display mt-1 text-xl font-extrabold ${predicate.accentClass}`}>
                    {predicate.grade}
                  </p>
                </div>
              </div>

              {/* Topic Mastery Breakdown */}
              <div className="mt-8 border-t border-slate-100 pt-6">
                <h2 className="font-display text-lg font-bold text-slate-900">
                  Pencapaian Tiap Materi
                </h2>
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {topicBreakdown.map((item) => {
                    const percent = Math.round((item.correct / item.total) * 100);
                    return (
                      <div key={item.topic} className="rounded-xl border border-slate-200 p-4">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-semibold text-slate-800">{item.topic}</span>
                          <span className="font-mono text-xs font-bold text-slate-600 tabular-nums shrink-0">
                            {item.correct}/{item.total} Benar
                          </span>
                        </div>
                        <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full bg-blue-600 transition-all duration-500"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Primary Action Buttons */}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={startNewGame}
                  className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-2xl bg-blue-600 px-8 py-3 text-base font-bold text-white shadow-md shadow-blue-600/20 transition-all duration-150 hover:bg-blue-700 active:scale-[0.98] whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <RotateCcw className="h-5 w-5" />
                  <span>Main Lagi</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowReview((prev) => !prev)}
                  className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-3 text-base font-semibold text-slate-700 transition-colors hover:bg-slate-50 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  <span>{showReview ? 'Tutup Pembahasan' : 'Lihat Pembahasan Soal'}</span>
                </button>

                <button
                  type="button"
                  onClick={returnToMenu}
                  className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-3 text-base font-semibold text-slate-700 transition-colors hover:bg-slate-50 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Home className="h-5 w-5 text-slate-500" />
                  <span>Menu Utama</span>
                </button>
              </div>
            </motion.section>

            {/* Optional Full Question Review */}
            {showReview && (
              <section className="mt-6 space-y-3">
                {QUIZ_QUESTIONS.map((q, index) => {
                  const rec = answers.find((a) => a.questionId === q.id);
                  const isCorrect = rec?.isCorrect ?? false;
                  return (
                    <div
                      key={q.id}
                      className="rounded-2xl border border-slate-200 bg-white p-5"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-slate-500">
                          Soal {index + 1} · {q.topic}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 text-xs font-bold ${
                            isCorrect ? 'text-emerald-700' : 'text-rose-700'
                          }`}
                        >
                          {isCorrect ? (
                            <>
                              <CheckCircle2 className="h-4 w-4" />
                              <span>Benar (+10 Poin)</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="h-4 w-4" />
                              <span>{rec?.isTimedOut ? 'Waktu Habis (0 Poin)' : 'Salah (0 Poin)'}</span>
                            </>
                          )}
                        </span>
                      </div>
                      <p className="font-display mt-2 text-base font-bold text-slate-900">
                        {q.question}
                      </p>
                      <p className="mt-2 text-sm font-semibold text-emerald-700">
                        Jawaban Benar: {OPTION_LABELS[q.correctIndex]}. {q.options[q.correctIndex]}
                      </p>
                      <p className="mt-1 text-sm text-slate-600">
                        <span className="font-semibold text-slate-800">Pembahasan: </span>
                        {q.explanation}
                      </p>
                    </div>
                  );
                })}
              </section>
            )}
          </main>
        </div>
      )}
    </div>
  );
}
