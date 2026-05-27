'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, History } from 'lucide-react';
import { useAppStore } from '@/lib/store';

export function MoveHistoryPanel() {
  const showMoveHistory = useAppStore((s) => s.showMoveHistory);
  const setPanel = useAppStore((s) => s.setPanel);
  const moveHistory = useAppStore((s) => s.game.moveHistory);

  return (
    <AnimatePresence>
      {showMoveHistory && (
        <motion.div
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed right-0 top-0 bottom-0 z-40 w-64 flex flex-col"
          style={{
            background: 'linear-gradient(180deg, #0d2318, #0a1510)',
            borderLeft: '1px solid rgba(212,168,75,0.2)',
          }}
        >
          <div className="flex items-center justify-between p-4" style={{ borderBottom: '1px solid rgba(212,168,75,0.1)' }}>
            <div className="flex items-center gap-2">
              <History size={15} className="text-amber-400" />
              <span className="text-sm font-bold text-amber-300">Move History</span>
            </div>
            <button onClick={() => setPanel('history', false)} className="text-amber-500/50 hover:text-amber-300">
              <X size={16} />
            </button>
          </div>

          <div className="overflow-y-auto flex-1 p-3">
            {moveHistory.length === 0 ? (
              <p className="text-center text-amber-500/40 text-xs mt-8">No moves yet.</p>
            ) : (
              <div className="flex flex-col gap-1.5">
                {[...moveHistory].reverse().map((move, i) => (
                  <motion.div
                    key={moveHistory.length - 1 - i}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
                  >
                    <div
                      className="w-4 h-4 rounded-full flex-shrink-0"
                      style={{
                        background: move.player === 'white' ? '#f5f0e8' : '#1a1a2e',
                        border: `1px solid ${move.player === 'white' ? 'rgba(212,168,75,0.5)' : 'rgba(255,255,255,0.3)'}`,
                      }}
                    />
                    <span className="text-amber-500/60 font-mono">
                      {move.from === 'bar' ? 'Bar' : `P${(move.from as number) + 1}`}
                      {' → '}
                      {move.to === 'bornOff' ? 'Off' : `P${(move.to as number) + 1}`}
                    </span>
                    <span className="ml-auto text-amber-500/40">[{move.dieUsed}]</span>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          <div className="p-3 text-center text-[10px] text-amber-500/30" style={{ borderTop: '1px solid rgba(212,168,75,0.1)' }}>
            {moveHistory.length} total moves
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
