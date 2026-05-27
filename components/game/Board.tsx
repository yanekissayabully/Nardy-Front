'use client';

import { useAppStore } from '@/lib/store';
import { PointSlot } from './PointSlot';
import { Bar } from './Bar';
import { motion, AnimatePresence } from 'framer-motion';
import { Checker } from './Checker';

export function Board() {
  const game = useAppStore((s) => s.game);
  const skinId = useAppStore((s) => s.activeSkinId);
  const selectPointAction = useAppStore((s) => s.selectPointAction);

  const { points, bar, bornOff, currentPlayer, selectedPoint, validMoves } = game;

  // Layout:
  // Bottom row (left→right): points 1-12  (indices 0-11), displayed as 1→12
  // Top row (left→right):    points 13-24 (indices 12-23), displayed as 24→13
  // White home: points 1-6 (indices 0-5)
  // Black home: points 19-24 (indices 18-23)

  const bottomPoints = points.slice(0, 12); // indices 0-11
  const topPoints = points.slice(12, 24);   // indices 12-23

  // Top row displays right-to-left: point 24 (idx 23) on the left ... point 13 (idx 12) on the right
  const topPointsReversed = [...topPoints].reverse(); // idx 23,22,...,12

  const isHomePoint = (index: number) => {
    // White home: indices 0-5, Black home: indices 18-23
    return (index >= 0 && index <= 5) || (index >= 18 && index <= 23);
  };

  const handlePointClick = (index: number) => {
    selectPointAction(index);
  };

  const handleBarClick = () => {
    selectPointAction(-1);
  };

  return (
    <div
      className="relative rounded-2xl overflow-hidden shadow-2xl"
      style={{
        background: 'linear-gradient(180deg, #0d2318 0%, #0a1a10 50%, #0d2318 100%)',
        border: '3px solid rgba(212,168,75,0.4)',
        boxShadow: '0 0 60px rgba(0,0,0,0.8), inset 0 0 30px rgba(0,0,0,0.3)',
        padding: '10px',
      }}
    >
      {/* Gold outer frame accent */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{ border: '1px solid rgba(212,168,75,0.15)', margin: 6 }}
      />

      <div className="flex flex-col gap-0">
        {/* TOP half: points 24→13 */}
        <div className="flex items-stretch" style={{ height: 190 }}>
          {/* Left 6 columns: points 24→19 */}
          <div className="flex flex-1">
            {topPointsReversed.slice(0, 6).map((point, i) => {
              const idx = 23 - i;
              return (
                <PointSlot
                  key={idx}
                  index={idx}
                  point={point}
                  isTop={true}
                  isSelected={selectedPoint === idx}
                  isValid={validMoves.includes(idx)}
                  isHome={isHomePoint(idx)}
                  skinId={skinId}
                  currentPlayer={currentPlayer}
                  onClick={handlePointClick}
                />
              );
            })}
          </div>

          {/* Bar */}
          <Bar
            bar={bar}
            selectedPoint={selectedPoint}
            validMoves={validMoves}
            skinId={skinId}
            currentPlayer={currentPlayer}
            onSelect={handleBarClick}
          />

          {/* Right 6 columns: points 18→13 */}
          <div className="flex flex-1">
            {topPointsReversed.slice(6, 12).map((point, i) => {
              const idx = 17 - i;
              return (
                <PointSlot
                  key={idx}
                  index={idx}
                  point={point}
                  isTop={true}
                  isSelected={selectedPoint === idx}
                  isValid={validMoves.includes(idx)}
                  isHome={isHomePoint(idx)}
                  skinId={skinId}
                  currentPlayer={currentPlayer}
                  onClick={handlePointClick}
                />
              );
            })}
          </div>
        </div>

        {/* Middle divider */}
        <div
          className="w-full flex items-center justify-center"
          style={{
            height: 20,
            background: 'rgba(0,0,0,0.4)',
            borderTop: '1px solid rgba(212,168,75,0.1)',
            borderBottom: '1px solid rgba(212,168,75,0.1)',
          }}
        >
          <span className="text-[9px] text-amber-500/30 tracking-widest font-bold uppercase">
            Long Backgammon · Длинные Нарды
          </span>
        </div>

        {/* BOTTOM half: points 1-12 */}
        <div className="flex items-stretch" style={{ height: 190 }}>
          {/* Left 6: points 1-6 */}
          <div className="flex flex-1">
            {bottomPoints.slice(0, 6).map((point, i) => (
              <PointSlot
                key={i}
                index={i}
                point={point}
                isTop={false}
                isSelected={selectedPoint === i}
                isValid={validMoves.includes(i)}
                isHome={isHomePoint(i)}
                skinId={skinId}
                currentPlayer={currentPlayer}
                onClick={handlePointClick}
              />
            ))}
          </div>

          {/* Bar spacer */}
          <div style={{ flexShrink: 0, width: 44 }} />

          {/* Right 6: points 7-12 */}
          <div className="flex flex-1">
            {bottomPoints.slice(6, 12).map((point, i) => (
              <PointSlot
                key={i + 6}
                index={i + 6}
                point={point}
                isTop={false}
                isSelected={selectedPoint === i + 6}
                isValid={validMoves.includes(i + 6)}
                isHome={false}
                skinId={skinId}
                currentPlayer={currentPlayer}
                onClick={handlePointClick}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Born Off indicators */}
      <div className="flex justify-between items-center mt-2 px-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-amber-500/50 font-bold uppercase tracking-wider">White Off</span>
          <div className="flex gap-0.5 flex-wrap max-w-[80px]">
            {Array.from({ length: bornOff.white }).map((_, i) => (
              <div
                key={i}
                className="w-3 h-3 rounded-full"
                style={{ background: '#f5f0e8', border: '1px solid rgba(212,168,75,0.5)' }}
              />
            ))}
          </div>
          <span className="text-xs text-amber-300 font-bold">{bornOff.white}/15</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-amber-300 font-bold">{bornOff.black}/15</span>
          <div className="flex gap-0.5 flex-wrap max-w-[80px] justify-end">
            {Array.from({ length: bornOff.black }).map((_, i) => (
              <div
                key={i}
                className="w-3 h-3 rounded-full"
                style={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.3)' }}
              />
            ))}
          </div>
          <span className="text-[10px] text-amber-500/50 font-bold uppercase tracking-wider">Black Off</span>
        </div>
      </div>

      {/* Game over overlay */}
      <AnimatePresence>
        {game.gamePhase === 'gameover' && game.winner && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl"
            style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
          >
            <motion.div
              initial={{ scale: 0.5, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="text-center"
            >
              <div className="text-5xl mb-3">
                {game.winner === 'white' ? '⚪' : '⚫'}
              </div>
              <h2 className="text-3xl font-bold mb-2" style={{ color: '#d4a84b' }}>
                {game.winner === 'white' ? 'White' : 'Black'} Wins!
              </h2>
              <p className="text-amber-200/70 text-sm">All 15 checkers borne off</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
