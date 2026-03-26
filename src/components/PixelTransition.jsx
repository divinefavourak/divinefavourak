import { useMemo } from 'react';

const COLS = 22;
const ROWS = 14;
const TOTAL = COLS * ROWS;

export default function PixelTransition({ active }) {
  const delays = useMemo(
    () => Array.from({ length: TOTAL }, () => (Math.random() * 0.45).toFixed(3)),
    []
  );

  if (!active) return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10001,
        display: 'grid',
        gridTemplateColumns: `repeat(${COLS}, 1fr)`,
        gridTemplateRows: `repeat(${ROWS}, 1fr)`,
        pointerEvents: 'none',
      }}
    >
      {delays.map((delay, i) => (
        <div
          key={i}
          style={{
            background: '#000',
            opacity: 0,
            animation: 'px-flash 0.9s ease forwards',
            animationDelay: `${delay}s`,
          }}
        />
      ))}
    </div>
  );
}
