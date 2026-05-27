'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { X, Trophy, Crown, Zap } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { useLeaderboard } from '@/hooks/useLeaderboard';
import { LeaderboardEntry } from '@/lib/types';
import { Overlay } from './AuthModal';

export function LeaderboardModal() {
  const setPanel = useAppStore((s) => s.setPanel);
  const stats = useAppStore((s) => s.stats);
  const { fetchTopPlayers } = useLeaderboard();
  const [players, setPlayers] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopPlayers().then((data) => {
      setPlayers(data);
      setLoading(false);
    });
  }, []);

  const rankIcon = (rank: number) => {
    if (rank === 1) return <Crown size={14} className="text-yellow-400" />;
    if (rank === 2) return <Trophy size={14} className="text-slate-300" />;
    if (rank === 3) return <Trophy size={14} className="text-amber-600" />;
    return <span className="text-xs text-amber-500/50 w-3.5 text-center">{rank}</span>;
  };

  return (
    <Overlay onClose={() => setPanel('leaderboard', false)}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="relative w-full max-w-md max-h-[85vh] overflow-hidden flex flex-col"
        style={{
          background: 'linear-gradient(135deg, #0d2318, #0a1510)',
          border: '1px solid rgba(212,168,75,0.3)',
          borderRadius: 16,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 pb-3" style={{ borderBottom: '1px solid rgba(212,168,75,0.1)' }}>
          <div className="flex items-center gap-2">
            <Trophy size={18} className="text-amber-400" />
            <h2 className="text-lg font-bold text-amber-300">Leaderboard</h2>
          </div>
          <button onClick={() => setPanel('leaderboard', false)} className="text-amber-500/50 hover:text-amber-300">
            <X size={18} />
          </button>
        </div>

        {/* Your stats */}
        <div className="mx-4 mt-3 p-3 rounded-lg flex gap-4" style={{ background: 'rgba(212,168,75,0.08)', border: '1px solid rgba(212,168,75,0.15)' }}>
          <Stat label="Wins" value={stats.wins} />
          <Stat label="Losses" value={stats.losses} />
          <Stat label="Games" value={stats.gamesPlayed} />
          <Stat label="Win Rate" value={stats.gamesPlayed > 0 ? `${Math.round((stats.wins / stats.gamesPlayed) * 100)}%` : '—'} />
        </div>

        {/* Table */}
        <div className="overflow-y-auto flex-1 p-4 pt-3">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <span className="animate-spin h-6 w-6 border-2 border-amber-400 border-t-transparent rounded-full" />
            </div>
          ) : (
            <div className="flex flex-col gap-1.5">
              {players.map((p, i) => (
                <motion.div
                  key={p.rank}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg"
                  style={{
                    background: p.rank <= 3 ? 'rgba(212,168,75,0.1)' : 'rgba(255,255,255,0.03)',
                    border: p.rank <= 3 ? '1px solid rgba(212,168,75,0.2)' : '1px solid rgba(255,255,255,0.04)',
                  }}
                >
                  <div className="w-5 flex items-center justify-center">{rankIcon(p.rank)}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-semibold text-amber-100">{p.name}</span>
                      {p.isPro && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold" style={{ background: 'rgba(212,168,75,0.2)', color: '#d4a84b' }}>PRO</span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-amber-300">{p.wins.toLocaleString()}</div>
                    <div className="text-[10px] text-amber-500/50">{p.winRate}% win</div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        <p className="text-center text-[10px] text-amber-500/30 pb-3">
          Data via <code>GET /api/leaderboard</code> (stub)
        </p>
      </motion.div>
    </Overlay>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="flex-1 text-center">
      <div className="text-sm font-bold text-amber-300">{value}</div>
      <div className="text-[10px] text-amber-500/50">{label}</div>
    </div>
  );
}
