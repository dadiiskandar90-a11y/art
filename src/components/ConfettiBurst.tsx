import React from 'react';

interface ConfettiPiece {
  id: number;
  left: string;
  top: string;
  color: string;
  tx: string;
  ty: string;
  rot: string;
  delay: string;
}

const PIECES: ConfettiPiece[] = [
  { id: 1, left: '15%', top: '30%', color: '#2563EB', tx: '-40px', ty: '-70px', rot: '180deg', delay: '0ms' },
  { id: 2, left: '28%', top: '20%', color: '#F59E0B', tx: '-20px', ty: '-95px', rot: '260deg', delay: '30ms' },
  { id: 3, left: '42%', top: '18%', color: '#10B981', tx: '10px', ty: '-105px', rot: '-200deg', delay: '15ms' },
  { id: 4, left: '56%', top: '18%', color: '#EF4444', tx: '25px', ty: '-95px', rot: '220deg', delay: '45ms' },
  { id: 5, left: '72%', top: '22%', color: '#8B5CF6', tx: '45px', ty: '-85px', rot: '-260deg', delay: '20ms' },
  { id: 6, left: '84%', top: '32%', color: '#0EA5E9', tx: '55px', ty: '-65px', rot: '190deg', delay: '40ms' },
  { id: 7, left: '22%', top: '52%', color: '#EC4899', tx: '-55px', ty: '40px', rot: '-160deg', delay: '50ms' },
  { id: 8, left: '38%', top: '48%', color: '#F59E0B', tx: '-15px', ty: '60px', rot: '310deg', delay: '10ms' },
  { id: 9, left: '62%', top: '48%', color: '#10B981', tx: '20px', ty: '55px', rot: '-280deg', delay: '35ms' },
  { id: 10, left: '78%', top: '52%', color: '#2563EB', tx: '50px', ty: '45px', rot: '240deg', delay: '25ms' },
];

export function ConfettiBurst({ burstKey }: { burstKey: number }) {
  return (
    <div
      key={burstKey}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-40 overflow-hidden"
    >
      {PIECES.map((piece) => (
        <span
          key={piece.id}
          className="animate-confetti-piece absolute h-3 w-3 rounded-sm"
          style={
            {
              left: piece.left,
              top: piece.top,
              backgroundColor: piece.color,
              animationDelay: piece.delay,
              '--tx': piece.tx,
              '--ty': piece.ty,
              '--rot': piece.rot,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
