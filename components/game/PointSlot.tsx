'use client';

import { motion } from 'framer-motion';
import { Point, Color } from '@/lib/types';
import { Checker } from './Checker';

interface Props {
  index: number;       // 0-23
  point: Point;
  isTop: boolean;      // top half of board (points 13-24)
  isSelected: boolean;
  isValid: boolean;
  isHome: boolean;     // part of home board highlight
  skinId: string;
  currentPlayer: Color;
  onClick: (index: number) => void;
}

export function PointSlot({
  index,
  point,
  isTop,
  isSelected,
  isValid,
  isHome,
  skinId,
  currentPlayer,
  onClick,
}: Props) {
  const displayNum = index + 1;

  // Triangle color: alternate between amber/dark
  const isOdd = displayNum % 2 === 1;

  const triangleColor = isOdd
    ? 'rgba(180, 100, 20, 0.85)'
    : 'rgba(30, 58, 60, 0.85)';

  const highlightColor = isValid
    ? 'rgba(34, 197, 94, 0.4)'
    : isSelected
    ? 'rgba(251, 191, 36, 0.4)'
    : 'transparent';

  const checkers = point.count > 0 && point.color ? (
    Array.from({ length: Math.min(point.count, 5) }).map((_, i) => (
      <Checker
        key={i}
        color={point.color!}
        count={point.count}
        skinId={skinId}
        isTop={isTop}
      />
    ))
  ) : null;

  // Point number label position
  const labelAtTop = !isTop;

  return (
    <div
      className="relative flex flex-col items-center cursor-pointer select-none group"
      style={{ flex: 1, minWidth: 0, minHeight: 160 }}
      onClick={() => onClick(index)}
    >
      {/* Triangle SVG */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 40 160"
        preserveAspectRatio="none"
      >
        {isTop ? (
          <polygon
            points="20,10 0,155 40,155"
            fill={triangleColor}
            opacity={0.9}
          />
        ) : (
          <polygon
            points="20,150 0,5 40,5"
            fill={triangleColor}
            opacity={0.9}
          />
        )}
        {/* Home highlight */}
        {isHome && (
          <rect
            x={0}
            y={0}
            width={40}
            height={160}
            fill="rgba(212,168,75,0.06)"
          />
        )}
        {/* Valid/selected highlight */}
        {(isValid || isSelected) && (
          <rect
            x={0}
            y={0}
            width={40}
            height={160}
            fill={highlightColor}
          />
        )}
      </svg>

      {/* Valid move pulsing ring */}
      {isValid && (
        <motion.div
          className="absolute inset-0 rounded pointer-events-none"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.2, repeat: Infinity }}
          style={{ border: '2px solid rgba(34,197,94,0.8)', borderRadius: 4 }}
        />
      )}

      {/* Point number */}
      <span
        className="relative z-10 text-[9px] font-bold select-none"
        style={{
          color: 'rgba(255,255,255,0.5)',
          marginTop: labelAtTop ? 2 : 'auto',
          marginBottom: labelAtTop ? 'auto' : 2,
          order: labelAtTop ? -1 : 1,
        }}
      >
        {displayNum}
      </span>

      {/* Checkers */}
      <div
        className="relative z-10 flex flex-col items-center gap-0.5"
        style={{
          flexDirection: isTop ? 'column' : 'column-reverse',
          paddingTop: isTop ? 12 : 0,
          paddingBottom: isTop ? 0 : 12,
          flex: 1,
          justifyContent: isTop ? 'flex-start' : 'flex-end',
        }}
      >
        {checkers}
        {point.count > 5 && (
          <span
            className="text-[10px] font-bold"
            style={{ color: point.color === 'white' ? '#1a1a2e' : '#f5f0e8' }}
          >
            +{point.count - 5}
          </span>
        )}
      </div>
    </div>
  );
}
