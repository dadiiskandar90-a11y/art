import { useState } from 'react';
import { Palette } from 'lucide-react';
import { VisualCue } from '../data/questions';

const UNSUR_IMG = '/src/assets/images/unsur_seni_rupa_1794819026627.jpg';
const SENI_3D_IMG = '/src/assets/images/seni_tiga_dimensi_1794819027005.jpg';

export function QuestionVisual({ cue }: { cue: VisualCue }) {
  const [imgError, setImgError] = useState(false);

  if ((cue === 'unsur-umum' || cue === 'warna-komplementer') && !imgError) {
    return (
      <div className="relative h-full w-full overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <img
          src={UNSUR_IMG}
          alt="Ilustrasi cat air, lingkaran warna, dan garis seni rupa"
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  if ((cue === 'karya-3d' || cue === 'teknik-3d') && !imgError) {
    return (
      <div className="relative h-full w-full overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <img
          src={SENI_3D_IMG}
          alt="Ilustrasi karya seni rupa tiga dimensi seperti vas gerabah, origami, dan patung kayu"
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  return (
    <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-4">
      {renderDiagram(cue)}
    </div>
  );
}

function renderDiagram(cue: VisualCue) {
  switch (cue) {
    case 'titik':
      return (
        <svg viewBox="0 0 240 160" className="h-full max-h-44 w-full" aria-label="Ilustrasi titik menyatu membentuk garis">
          <circle cx="36" cy="80" r="8" fill="#2563EB" />
          <circle cx="62" cy="80" r="6" fill="#3B82F6" />
          <circle cx="84" cy="80" r="5" fill="#60A5FA" />
          <circle cx="102" cy="80" r="4" fill="#F59E0B" />
          <circle cx="116" cy="80" r="4" fill="#F59E0B" />
          <circle cx="130" cy="80" r="4" fill="#EF4444" />
          <line x1="146" y1="80" x2="206" y2="80" stroke="#EF4444" strokeWidth="6" strokeLinecap="round" />
          <circle cx="52" cy="40" r="5" fill="#10B981" />
          <circle cx="192" cy="44" r="7" fill="#F59E0B" />
          <circle cx="176" cy="122" r="6" fill="#2563EB" />
        </svg>
      );

    case 'gelap-terang':
      return (
        <svg viewBox="0 0 240 160" className="h-full max-h-44 w-full" aria-label="Ilustrasi pencahayaan dan bayangan pada bentuk bulat">
          <defs>
            <radialGradient id="sphereGrad" cx="35%" cy="32%" r="65%">
              <stop offset="0%" stopColor="#FEF08A" />
              <stop offset="45%" stopColor="#EF4444" />
              <stop offset="100%" stopColor="#7F1D1D" />
            </radialGradient>
          </defs>
          <ellipse cx="134" cy="128" rx="48" ry="12" fill="#CBD5E1" />
          <circle cx="120" cy="80" r="46" fill="url(#sphereGrad)" />
          <path d="M40 30 L68 50" stroke="#F59E0B" strokeWidth="4" strokeLinecap="round" />
          <circle cx="34" cy="26" r="9" fill="#FBBF24" />
        </svg>
      );

    case 'bidang':
      return (
        <svg viewBox="0 0 240 160" className="h-full max-h-44 w-full" aria-label="Ilustrasi berbagai bidang datar dua dimensi">
          <rect x="28" y="42" width="54" height="54" rx="4" fill="#3B82F6" fillOpacity="0.88" />
          <polygon points="126,34 162,102 90,102" fill="#F59E0B" fillOpacity="0.92" />
          <circle cx="186" cy="84" r="32" fill="#10B981" fillOpacity="0.88" />
        </svg>
      );

    case 'ruang-perspektif':
      return (
        <svg viewBox="0 0 240 160" className="h-full max-h-44 w-full" aria-label="Ilustrasi perspektif jalan menyempit ke titik hilang">
          <rect x="16" y="16" width="208" height="128" rx="10" fill="#E0F2FE" />
          <polygon points="16,144 120,66 224,144" fill="#86EFAC" />
          <polygon points="48,144 120,66 192,144" fill="#475569" />
          <line x1="120" y1="68" x2="120" y2="144" stroke="#FACC15" strokeWidth="3" strokeDasharray="6 6" />
          <circle cx="120" cy="66" r="4" fill="#EF4444" />
        </svg>
      );

    case 'garis-ekspresif':
      return (
        <svg viewBox="0 0 240 160" className="h-full max-h-44 w-full" aria-label="Ilustrasi variasi garis lurus, zig-zag, dan lengkung">
          <line x1="28" y1="36" x2="212" y2="36" stroke="#1E293B" strokeWidth="5" strokeLinecap="round" />
          <polyline points="28,80 58,62 88,98 118,62 148,98 178,62 212,80" fill="none" stroke="#EF4444" strokeWidth="5" strokeLinejoin="round" strokeLinecap="round" />
          <path d="M28 126 Q58 104, 88 126 T148 126 T212 126" fill="none" stroke="#2563EB" strokeWidth="5" strokeLinecap="round" />
        </svg>
      );

    case 'bentuk-organis':
      return (
        <svg viewBox="0 0 240 160" className="h-full max-h-44 w-full" aria-label="Ilustrasi bentuk organis seperti daun dan awan">
          <path d="M60 120 C35 90, 50 40, 102 36 C105 82, 92 114, 60 120 Z" fill="#10B981" />
          <path d="M60 120 C72 90, 86 62, 102 36" stroke="#065F46" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M134 94 C122 94, 114 84, 118 72 C122 58, 138 56, 148 64 C158 50, 182 54, 186 72 C198 74, 202 94, 184 94 Z" fill="#38BDF8" />
        </svg>
      );

    case 'warna-primer':
      return (
        <svg viewBox="0 0 240 160" className="h-full max-h-44 w-full" aria-label="Ilustrasi tiga warna primer saling bertemu">
          <circle cx="96" cy="70" r="36" fill="#EF4444" fillOpacity="0.88" />
          <circle cx="144" cy="70" r="36" fill="#FACC15" fillOpacity="0.88" />
          <circle cx="120" cy="108" r="36" fill="#2563EB" fillOpacity="0.88" />
        </svg>
      );

    case 'tekstur':
      return (
        <svg viewBox="0 0 240 160" className="h-full max-h-44 w-full" aria-label="Perbandingan permukaan halus dan pola tekstur kasar">
          <rect x="28" y="34" width="84" height="92" rx="12" fill="#BAE6FD" stroke="#0284C7" strokeWidth="2" />
          <rect x="128" y="34" width="84" height="92" rx="12" fill="#FDE68A" stroke="#D97706" strokeWidth="2" />
          <path d="M140 54 L152 62 L140 70 L152 78 L140 86 L152 94 L140 102" fill="none" stroke="#B45309" strokeWidth="3" strokeLinecap="round" />
          <path d="M168 50 L180 58 L168 66 L180 74 L168 82 L180 90 L168 98" fill="none" stroke="#B45309" strokeWidth="3" strokeLinecap="round" />
          <circle cx="196" cy="64" r="3" fill="#B45309" />
          <circle cx="196" cy="88" r="3" fill="#B45309" />
        </svg>
      );

    case 'keseimbangan':
      return (
        <svg viewBox="0 0 240 160" className="h-full max-h-44 w-full" aria-label="Ilustrasi keseimbangan simetris dengan garis sumbu tengah">
          <line x1="120" y1="20" x2="120" y2="140" stroke="#94A3B8" strokeWidth="2" strokeDasharray="5 5" />
          <path d="M120 74 C92 32, 40 36, 48 76 C52 96, 86 98, 120 84 Z" fill="#F59E0B" />
          <path d="M120 74 C148 32, 200 36, 192 76 C188 96, 154 98, 120 84 Z" fill="#F59E0B" />
          <path d="M120 84 C94 94, 70 126, 94 132 C108 134, 116 112, 120 96 Z" fill="#2563EB" />
          <path d="M120 84 C146 94, 170 126, 146 132 C132 134, 124 112, 120 96 Z" fill="#2563EB" />
          <rect x="116" y="54" width="8" height="54" rx="4" fill="#1E293B" />
        </svg>
      );

    case 'kesatuan':
      return (
        <svg viewBox="0 0 240 160" className="h-full max-h-44 w-full" aria-label="Ilustrasi komposisi unsur yang saling terhubung harmonis">
          <circle cx="120" cy="80" r="52" fill="#EFF6FF" stroke="#BFDBFE" strokeWidth="2" />
          <rect x="86" y="56" width="38" height="38" rx="8" fill="#2563EB" />
          <circle cx="136" cy="76" r="22" fill="#F59E0B" fillOpacity="0.9" />
          <polygon points="116,74 148,116 84,116" fill="#10B981" fillOpacity="0.9" />
        </svg>
      );

    case 'irama':
      return (
        <svg viewBox="0 0 240 160" className="h-full max-h-44 w-full" aria-label="Ilustrasi pengulangan pola yang membentuk ritme">
          {[0, 1, 2, 3, 4].map((i) => (
            <g key={i} transform={`translate(${26 + i * 40}, 42)`}>
              <rect x="0" y={i % 2 === 0 ? 0 : 14} width="26" height="58" rx="13" fill={i % 2 === 0 ? '#2563EB' : '#10B981'} />
              <circle cx="13" cy={i % 2 === 0 ? 14 : 28} r="5" fill="#FACC15" />
            </g>
          ))}
        </svg>
      );

    case 'proporsi':
      return (
        <svg viewBox="0 0 240 160" className="h-full max-h-44 w-full" aria-label="Ilustrasi perbandingan ukuran antar bagian">
          <circle cx="72" cy="82" r="34" fill="#FDBA74" stroke="#EA580C" strokeWidth="2.5" />
          <circle cx="60" cy="76" r="4" fill="#1E293B" />
          <circle cx="84" cy="76" r="4" fill="#1E293B" />
          <path d="M64 94 Q72 100 80 94" stroke="#1E293B" strokeWidth="3" fill="none" strokeLinecap="round" />
          <rect x="136" y="42" width="22" height="78" rx="6" fill="#3B82F6" />
          <rect x="172" y="72" width="22" height="48" rx="6" fill="#10B981" />
        </svg>
      );

    case 'pusat-perhatian':
      return (
        <svg viewBox="0 0 240 160" className="h-full max-h-44 w-full" aria-label="Ilustrasi satu objek utama lebih menonjol di tengah">
          <circle cx="44" cy="48" r="10" fill="#CBD5E1" />
          <circle cx="52" cy="112" r="12" fill="#CBD5E1" />
          <circle cx="192" cy="52" r="11" fill="#CBD5E1" />
          <circle cx="188" cy="114" r="9" fill="#CBD5E1" />
          <polygon
            points="120,28 134,62 170,64 142,88 152,124 120,104 88,124 98,88 70,64 106,62"
            fill="#EF4444"
          />
        </svg>
      );

    case 'karya-2d':
      return (
        <svg viewBox="0 0 240 160" className="h-full max-h-44 w-full" aria-label="Ilustrasi kanvas lukisan datar dua dimensi">
          <rect x="48" y="24" width="144" height="112" rx="6" fill="#FEF3C7" stroke="#92400E" strokeWidth="6" />
          <circle cx="92" cy="60" r="14" fill="#F59E0B" />
          <polygon points="62,120 104,70 144,120" fill="#10B981" />
          <polygon points="108,120 144,76 178,120" fill="#2563EB" />
        </svg>
      );

    case 'relief':
      return (
        <svg viewBox="0 0 240 160" className="h-full max-h-44 w-full" aria-label="Ilustrasi ukiran timbul pada dinding batu">
          <rect x="34" y="28" width="172" height="104" rx="8" fill="#D6D3D1" stroke="#78716C" strokeWidth="3" />
          <rect x="50" y="42" width="140" height="76" rx="4" fill="#E7E5E4" stroke="#A8A29E" strokeWidth="2" />
          <path d="M78 106 C78 72, 108 56, 120 56 C132 56, 162 72, 162 106 Z" fill="#A8A29E" stroke="#57534E" strokeWidth="2.5" />
          <circle cx="120" cy="76" r="10" fill="#D6D3D1" stroke="#57534E" strokeWidth="2" />
        </svg>
      );

    case 'anyaman':
      return (
        <svg viewBox="0 0 240 160" className="h-full max-h-44 w-full" aria-label="Ilustrasi pola silang anyaman bambu">
          {[0, 1, 2, 3].map((row) => (
            <rect
              key={`h-${row}`}
              x="44"
              y={32 + row * 26}
              width="152"
              height="16"
              rx="4"
              fill={row % 2 === 0 ? '#F59E0B' : '#D97706'}
            />
          ))}
          {[0, 1, 2, 3, 4].map((col) => (
            <rect
              key={`v-${col}`}
              x={54 + col * 28}
              y="22"
              width="16"
              height="116"
              rx="4"
              fill={col % 2 === 0 ? '#10B981' : '#059669'}
              fillOpacity="0.82"
            />
          ))}
        </svg>
      );

    default:
      return (
        <div className="flex flex-col items-center gap-2 text-slate-400">
          <Palette className="h-10 w-10" />
          <span className="text-xs font-medium">Ilustrasi Seni Rupa</span>
        </div>
      );
  }
}
