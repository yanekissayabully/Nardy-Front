'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  dice: number[];
  movesLeft: number[];
  isRolling: boolean;
}

const DOT_POSITIONS: Record<number, [number, number][]> = {
  1: [[50, 50]],
  2: [[25, 25], [75, 75]],
  3: [[25, 25], [50, 50], [75, 75]],
  4: [[25, 25], [75, 25], [25, 75], [75, 75]],
  5: [[25, 25], [75, 25], [50, 50], [25, 75], [75, 75]],
  6: [[25, 20], [75, 20], [25, 50], [75, 50], [25, 80], [75, 80]],
};

function DieFace({ value, used, rolling }: { value: number; used: boolean; rolling: boolean }) {
  const dots = DOT_POSITIONS[value] ?? [];

  return (
    <motion.div
      key={`die-${value}-${used}`}
      initial={{ rotateX: 0, rotateY: 0, scale: 0.8, opacity: 0 }}
      animate={
        rolling
          ? {
              rotateX: [0, 360, 720, 0],
              rotateY: [0, 180, 540, 0],
              scale: [0.8, 1.1, 0.9, 1],
              opacity: 1,
            }
          : { rotateX: 0, rotateY: 0, scale: used ? 0.85 : 1, opacity: used ? 0.35 : 1 }
      }
      transition={{ duration: rolling ? 0.8 : 0.3, ease: 'easeOut' }}
      className="relative w-12 h-12 rounded-xl shadow-lg flex-shrink-0"
      style={{
        background: used
          ? 'linear-gradient(135deg, #374151, #1f2937)'
          : 'linear-gradient(135deg, #f5f0e8, #e8e0d0)',
        border: used ? '2px solid #4b5563' : '2px solid #d4a84b',
        perspective: '200px',
      }}
    >
      <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
        {dots.map(([cx, cy], i) => (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={used ? 7 : 8}
            fill={used ? '#6b7280' : '#1a1a2e'}
          />
        ))}
      </svg>
    </motion.div>
  );
}

export function DiceDisplay({ dice, movesLeft, isRolling }: Props) {
  if (dice.length === 0) return null;

  return (
    <div className="flex gap-2 items-center justify-center flex-wrap">
      <AnimatePresence>
        {dice.map((val, idx) => {
          // Count how many of this value are still in movesLeft
          const usedCount = dice.filter((d, i) => i <= idx && d === val).length;
          const availableCount = movesLeft.filter((d) => d === val).length;
          const totalCount = dice.filter((d) => d === val).length;
          // Mark this die as used if it's in the "used" portion
          const usedInOrder = dice
            .map((d, i) => ({ d, i }))
            .filter(({ d }) => d === val);
          const thisEntry = usedInOrder.findIndex(({ i }) => i === idx);
          const used = thisEntry >= availableCount;

          return (
            <DieFace key={`die-${idx}`} value={val} used={used} rolling={isRolling} />
          );
        })}
      </AnimatePresence>
    </div>
  );
}
