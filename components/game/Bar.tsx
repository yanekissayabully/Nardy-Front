'use client';

import { motion } from 'framer-motion';
import { Color } from '@/lib/types';
import { Checker } from './Checker';
import { SKINS } from '@/lib/store';

interface Props {
  bar: { white: number; black: number };
  selectedPoint: number | null;
  validMoves: number[];
  skinId: string;
  currentPlayer: Color;
  onSelect: (idx: -1) => void;
}

export function Bar({ bar, selectedPoint, validMoves, skinId, currentPlayer, onSelect }: Props) {
  const isBarSelected = selectedPoint === -1;
  const isBarValid = validMoves.includes(-1);
  const hasWhite = bar.white > 0;
  const hasBlack = bar.black > 0;

  return (
    <div
      className="flex flex-col items-center justify-between"
      style={{
        width: 44,
        height: '100%',
        background: 'rgba(10,20,15,0.9)',
        borderLeft: '1px solid rgba(212,168,75,0.2)',
        borderRight: '1px solid rgba(212,168,75,0.2)',
      }}
    >
      {/* Black checkers on bar (top half) */}
      <div
        className="flex flex-col items-center gap-1 p-1 cursor-pointer"
        style={{ flex: 1 }}
        onClick={() => currentPlayer === 'black' && hasBlack && onSelect(-1)}
      >
        {hasBlack && (
          <motion.div
            className="flex flex-col items-center gap-1"
            animate={isBarSelected && currentPlayer === 'black' ? { scale: 1.1 } : { scale: 1 }}
          >
            {Array.from({ length: Math.min(bar.black, 4) }).map((_, i) => (
              <Checker key={i} color="black" count={bar.black} skinId={skinId} />
            ))}
            {bar.black > 4 && (
              <span className="text-[10px] text-amber-300 font-bold">+{bar.black - 4}</span>
            )}
          </motion.div>
        )}
      </div>

      {/* Bar label */}
      <div className="text-[9px] text-amber-500/40 font-bold tracking-widest rotate-90 select-none my-2">
        BAR
      </div>

      {/* White checkers on bar (bottom half) */}
      <div
        className="flex flex-col items-center gap-1 p-1 cursor-pointer"
        style={{ flex: 1 }}
        onClick={() => currentPlayer === 'white' && hasWhite && onSelect(-1)}
      >
        {hasWhite && (
          <motion.div
            className="flex flex-col items-center gap-1"
            animate={isBarSelected && currentPlayer === 'white' ? { scale: 1.1 } : { scale: 1 }}
          >
            {Array.from({ length: Math.min(bar.white, 4) }).map((_, i) => (
              <Checker key={i} color="white" count={bar.white} skinId={skinId} />
            ))}
            {bar.white > 4 && (
              <span className="text-[10px] text-amber-300 font-bold">+{bar.white - 4}</span>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
