'use client';

import { motion } from 'framer-motion';
import { Color } from '@/lib/types';
import { SKINS } from '@/lib/store';

interface Props {
  color: Color;
  count: number;
  skinId: string;
  isTop?: boolean;
}

export function Checker({ color, count, skinId, isTop }: Props) {
  const skin = SKINS.find((s) => s.id === skinId) ?? SKINS[0];
  const bg = color === 'white' ? skin.white : skin.black;
  const textColor = color === 'white' ? '#1a1a2e' : '#f5f0e8';

  const showCount = count > 3;

  return (
    <motion.div
      layout
      initial={{ scale: 0.6, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.6, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-md flex-shrink-0 relative"
      style={{
        background: bg,
        border: `2px solid ${color === 'white' ? 'rgba(212,168,75,0.6)' : 'rgba(255,255,255,0.2)'}`,
        boxShadow: `0 2px 8px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.2)`,
        color: textColor,
      }}
    >
      {showCount && count}
    </motion.div>
  );
}
