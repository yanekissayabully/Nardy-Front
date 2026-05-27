// 'use client';

// import { useEffect, useState } from 'react';
// import { motion } from 'framer-motion';
// import { X, Trophy, Crown, Zap } from 'lucide-react';
// import { useAppStore } from '@/lib/store';
// import { useLeaderboard } from '@/hooks/useLeaderboard';
// import { LeaderboardEntry } from '@/lib/types';
// import { Overlay } from './AuthModal';

// export function LeaderboardModal() {
//   const setPanel = useAppStore((s) => s.setPanel);
//   const stats = useAppStore((s) => s.stats);
//   const { fetchTopPlayers } = useLeaderboard();
//   const [players, setPlayers] = useState<LeaderboardEntry[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchTopPlayers().then((data) => {
//       setPlayers(data);
//       setLoading(false);
//     });
//   }, []);

//   const rankIcon = (rank: number) => {
//     if (rank === 1) return <Crown size={14} className="text-yellow-400" />;
//     if (rank === 2) return <Trophy size={14} className="text-slate-300" />;
//     if (rank === 3) return <Trophy size={14} className="text-amber-600" />;
//     return <span className="text-xs text-amber-500/50 w-3.5 text-center">{rank}</span>;
//   };

//   return (
//     <Overlay onClose={() => setPanel('leaderboard', false)}>
//       <motion.div
//         initial={{ scale: 0.9, opacity: 0, y: 20 }}
//         animate={{ scale: 1, opacity: 1, y: 0 }}
//         exit={{ scale: 0.9, opacity: 0, y: 20 }}
//         transition={{ type: 'spring', stiffness: 300, damping: 25 }}
//         className="relative w-full max-w-md max-h-[85vh] overflow-hidden flex flex-col"
//         style={{
//           background: 'linear-gradient(135deg, #0d2318, #0a1510)',
//           border: '1px solid rgba(212,168,75,0.3)',
//           borderRadius: 16,
//         }}
//         onClick={(e) => e.stopPropagation()}
//       >
//         {/* Header */}
//         <div className="flex items-center justify-between p-5 pb-3" style={{ borderBottom: '1px solid rgba(212,168,75,0.1)' }}>
//           <div className="flex items-center gap-2">
//             <Trophy size={18} className="text-amber-400" />
//             <h2 className="text-lg font-bold text-amber-300">Leaderboard</h2>
//           </div>
//           <button onClick={() => setPanel('leaderboard', false)} className="text-amber-500/50 hover:text-amber-300">
//             <X size={18} />
//           </button>
//         </div>

//         {/* Your stats */}
//         <div className="mx-4 mt-3 p-3 rounded-lg flex gap-4" style={{ background: 'rgba(212,168,75,0.08)', border: '1px solid rgba(212,168,75,0.15)' }}>
//           <Stat label="Wins" value={stats.wins} />
//           <Stat label="Losses" value={stats.losses} />
//           <Stat label="Games" value={stats.gamesPlayed} />
//           <Stat label="Win Rate" value={stats.gamesPlayed > 0 ? `${Math.round((stats.wins / stats.gamesPlayed) * 100)}%` : '—'} />
//         </div>

//         {/* Table */}
//         <div className="overflow-y-auto flex-1 p-4 pt-3">
//           {loading ? (
//             <div className="flex items-center justify-center py-12">
//               <span className="animate-spin h-6 w-6 border-2 border-amber-400 border-t-transparent rounded-full" />
//             </div>
//           ) : (
//             <div className="flex flex-col gap-1.5">
//               {players.map((p, i) => (
//                 <motion.div
//                   key={p.rank}
//                   initial={{ opacity: 0, x: -20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   transition={{ delay: i * 0.05 }}
//                   className="flex items-center gap-3 px-3 py-2.5 rounded-lg"
//                   style={{
//                     background: p.rank <= 3 ? 'rgba(212,168,75,0.1)' : 'rgba(255,255,255,0.03)',
//                     border: p.rank <= 3 ? '1px solid rgba(212,168,75,0.2)' : '1px solid rgba(255,255,255,0.04)',
//                   }}
//                 >
//                   <div className="w-5 flex items-center justify-center">{rankIcon(p.rank)}</div>
//                   <div className="flex-1">
//                     <div className="flex items-center gap-1.5">
//                       <span className="text-sm font-semibold text-amber-100">{p.name}</span>
//                       {p.isPro && (
//                         <span className="px-1.5 py-0.5 rounded text-[9px] font-bold" style={{ background: 'rgba(212,168,75,0.2)', color: '#d4a84b' }}>PRO</span>
//                       )}
//                     </div>
//                   </div>
//                   <div className="text-right">
//                     <div className="text-sm font-bold text-amber-300">{p.wins.toLocaleString()}</div>
//                     <div className="text-[10px] text-amber-500/50">{p.winRate}% win</div>
//                   </div>
//                 </motion.div>
//               ))}
//             </div>
//           )}
//         </div>

//         <p className="text-center text-[10px] text-amber-500/30 pb-3">
//           Data via <code>GET /api/leaderboard</code> (stub)
//         </p>
//       </motion.div>
//     </Overlay>
//   );
// }

// function Stat({ label, value }: { label: string; value: number | string }) {
//   return (
//     <div className="flex-1 text-center">
//       <div className="text-sm font-bold text-amber-300">{value}</div>
//       <div className="text-[10px] text-amber-500/50">{label}</div>
//     </div>
//   );
// }



'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy, Crown, Zap, Globe, MapPin, RefreshCw, Star } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { useLeaderboard } from '@/hooks/useLeaderboard';
import { LeaderboardEntry } from '@/lib/types';
import { Overlay } from './AuthModal';

const CITIES = ['Global', 'Almaty', 'Astana', 'Shymkent', 'Moscow', 'Tashkent', 'Baku'];

// Extended stub data per city
const CITY_STUBS: Record<string, LeaderboardEntry[]> = {
  Almaty: [
    { rank: 1, name: 'AlmatyKing', wins: 542, winRate: 74, isPro: true },
    { rank: 2, name: 'ZenkovMaster', wins: 489, winRate: 69, isPro: true },
    { rank: 3, name: 'MedeuChamp', wins: 401, winRate: 65, isPro: false },
    { rank: 4, name: 'ApplePlayer', wins: 388, winRate: 62, isPro: false },
    { rank: 5, name: 'TianShanPro', wins: 321, winRate: 59, isPro: true },
    { rank: 6, name: 'BorovoeWiz', wins: 278, winRate: 55, isPro: false },
    { rank: 7, name: 'NardiKZ', wins: 241, winRate: 52, isPro: false },
    { rank: 8, name: 'AlaTooRuler', wins: 199, winRate: 49, isPro: false },
  ],
  Astana: [
    { rank: 1, name: 'BaiterekBoss', wins: 611, winRate: 77, isPro: true },
    { rank: 2, name: 'KhanTenge', wins: 523, winRate: 71, isPro: true },
    { rank: 3, name: 'SteppeEagle', wins: 445, winRate: 67, isPro: false },
    { rank: 4, name: 'NurSultan99', wins: 389, winRate: 63, isPro: true },
    { rank: 5, name: 'AstanaLord', wins: 301, winRate: 58, isPro: false },
  ],
  Tashkent: [
    { rank: 1, name: 'UzbekMaster', wins: 721, winRate: 79, isPro: true },
    { rank: 2, name: 'SilkRoadPro', wins: 634, winRate: 73, isPro: true },
    { rank: 3, name: 'NardiUz', wins: 512, winRate: 68, isPro: false },
  ],
  Baku: [
    { rank: 1, name: 'CaspianKing', wins: 893, winRate: 81, isPro: true },
    { rank: 2, name: 'BakuMaster', wins: 745, winRate: 75, isPro: true },
    { rank: 3, name: 'AzeriChamp', wins: 612, winRate: 70, isPro: true },
    { rank: 4, name: 'TablaGuru', wins: 489, winRate: 64, isPro: false },
  ],
};

export function LeaderboardModal() {
  const setPanel = useAppStore((s) => s.setPanel);
  const stats = useAppStore((s) => s.stats);
  const user = useAppStore((s) => s.currentUser);
  const { fetchTopPlayers } = useLeaderboard();
  const [players, setPlayers] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState('Global');
  const [refreshing, setRefreshing] = useState(false);

  const load = async (city: string, showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    else setLoading(true);

    if (city !== 'Global' && CITY_STUBS[city]) {
      await new Promise((r) => setTimeout(r, 400));
      setPlayers(CITY_STUBS[city]);
    } else {
      const data = await fetchTopPlayers(city === 'Global' ? undefined : city);
      setPlayers(data);
    }

    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    load(selectedCity);
  }, [selectedCity]);

  const rankIcon = (rank: number) => {
    if (rank === 1) return <Crown size={14} className="text-yellow-400" />;
    if (rank === 2) return <Trophy size={14} className="text-slate-300" />;
    if (rank === 3) return <Trophy size={14} className="text-amber-600" />;
    return <span className="text-xs text-amber-500/50 w-3.5 text-center font-mono">{rank}</span>;
  };

  const myWinRate = stats.gamesPlayed > 0
    ? Math.round((stats.wins / stats.gamesPlayed) * 100)
    : 0;

  return (
    <Overlay onClose={() => setPanel('leaderboard', false)}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="relative w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col"
        style={{
          background: 'linear-gradient(135deg, #0d2318, #0a1510)',
          border: '1px solid rgba(212,168,75,0.3)',
          borderRadius: 16,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-5 pb-3"
          style={{ borderBottom: '1px solid rgba(212,168,75,0.1)' }}
        >
          <div className="flex items-center gap-2">
            <Trophy size={18} className="text-amber-400" />
            <h2 className="text-lg font-bold text-amber-300">Leaderboard</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => load(selectedCity, true)}
              className="text-amber-500/50 hover:text-amber-300 transition-colors"
            >
              <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} />
            </button>
            <button
              onClick={() => setPanel('leaderboard', false)}
              className="text-amber-500/50 hover:text-amber-300 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Your stats card */}
        <div
          className="mx-4 mt-3 p-3 rounded-xl flex gap-3 items-center"
          style={{ background: 'rgba(212,168,75,0.07)', border: '1px solid rgba(212,168,75,0.15)' }}
        >
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #d4a84b, #b8860b)', color: '#1a1a2e' }}
          >
            {user ? user.username[0].toUpperCase() : '?'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-amber-200 truncate">
              {user ? user.username : 'Guest Player'}
            </div>
            <div className="text-[10px] text-amber-500/50">Your statistics</div>
          </div>
          <div className="flex gap-3">
            <MiniStat label="Wins" value={stats.wins} />
            <MiniStat label="Games" value={stats.gamesPlayed} />
            <MiniStat label="Rate" value={stats.gamesPlayed > 0 ? `${myWinRate}%` : '—'} />
          </div>
        </div>

        {/* City filter */}
        <div className="px-4 pt-3 pb-1">
          <div className="flex items-center gap-1.5 mb-2">
            <Globe size={11} className="text-amber-500/50" />
            <span className="text-[10px] text-amber-500/50 uppercase tracking-wider">Filter by city</span>
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
            {CITIES.map((city) => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className="flex-shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all"
                style={{
                  background: selectedCity === city
                    ? 'rgba(212,168,75,0.25)'
                    : 'rgba(255,255,255,0.04)',
                  color: selectedCity === city ? '#d4a84b' : 'rgba(212,168,75,0.45)',
                  border: selectedCity === city
                    ? '1px solid rgba(212,168,75,0.4)'
                    : '1px solid rgba(255,255,255,0.06)',
                }}
              >
                {city !== 'Global' && <MapPin size={9} />}
                {city === 'Global' && <Globe size={9} />}
                {city}
              </button>
            ))}
          </div>
        </div>

        {/* Players table */}
        <div className="overflow-y-auto flex-1 px-4 pb-4 pt-2">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center py-12"
              >
                <div className="flex flex-col items-center gap-3">
                  <span className="animate-spin h-6 w-6 border-2 border-amber-400 border-t-transparent rounded-full" />
                  <span className="text-xs text-amber-500/40">Loading players...</span>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={selectedCity}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col gap-1.5"
              >
                {players.length === 0 ? (
                  <div className="text-center py-10 text-amber-500/40 text-sm">
                    No players found for {selectedCity}
                  </div>
                ) : (
                  players.map((p, i) => (
                    <motion.div
                      key={`${p.rank}-${p.name}`}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
                      style={{
                        background: p.rank === 1
                          ? 'rgba(212,168,75,0.13)'
                          : p.rank <= 3
                          ? 'rgba(212,168,75,0.07)'
                          : 'rgba(255,255,255,0.03)',
                        border: p.rank === 1
                          ? '1px solid rgba(212,168,75,0.35)'
                          : p.rank <= 3
                          ? '1px solid rgba(212,168,75,0.15)'
                          : '1px solid rgba(255,255,255,0.05)',
                      }}
                    >
                      <div className="w-5 flex items-center justify-center flex-shrink-0">
                        {rankIcon(p.rank)}
                      </div>

                      {/* Color dot */}
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                        style={{
                          background: `hsl(${(p.rank * 47 + 120) % 360}, 50%, 35%)`,
                          color: 'rgba(255,255,255,0.8)',
                        }}
                      >
                        {p.name[0]}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-sm font-semibold text-amber-100 truncate">
                            {p.name}
                          </span>
                          {p.isPro && (
                            <span
                              className="px-1.5 py-0.5 rounded text-[9px] font-bold flex items-center gap-0.5"
                              style={{ background: 'rgba(212,168,75,0.2)', color: '#d4a84b' }}
                            >
                              <Star size={7} />PRO
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Win bar */}
                      <div className="text-right flex-shrink-0">
                        <div className="text-sm font-bold text-amber-300">
                          {p.wins.toLocaleString()}
                        </div>
                        <div className="flex items-center gap-1 justify-end mt-0.5">
                          <div
                            className="h-1 rounded-full"
                            style={{
                              width: `${Math.max(16, p.winRate * 0.4)}px`,
                              background: `rgba(212,168,75,${p.winRate / 100})`,
                            }}
                          />
                          <span className="text-[10px] text-amber-500/50">{p.winRate}%</span>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div
          className="px-4 pb-3 pt-2 flex items-center justify-between"
          style={{ borderTop: '1px solid rgba(212,168,75,0.08)' }}
        >
          <span className="text-[10px] text-amber-500/30">
            {selectedCity === 'Global' ? 'Global rankings' : `Top players in ${selectedCity}`}
          </span>
          <button
            onClick={() => setPanel('auth', true)}
            className="text-[10px] text-amber-400/60 hover:text-amber-400 transition-colors"
          >
            Sign in to appear here →
          </button>
        </div>
      </motion.div>
    </Overlay>
  );
}

function MiniStat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="text-center">
      <div className="text-xs font-bold text-amber-300">{value}</div>
      <div className="text-[9px] text-amber-500/50">{label}</div>
    </div>
  );
}