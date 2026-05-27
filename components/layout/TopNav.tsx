// 'use client';

// import { Sun, Moon, Trophy, User, Palette, Settings, History } from 'lucide-react';
// import { useAppStore } from '@/lib/store';
// import { motion } from 'framer-motion';

// export function TopNav() {
//   const theme = useAppStore((s) => s.theme);
//   const toggleTheme = useAppStore((s) => s.toggleTheme);
//   const setPanel = useAppStore((s) => s.setPanel);
//   const stats = useAppStore((s) => s.stats);

//   return (
//     <header
//       className="flex items-center justify-between px-4 py-3 sticky top-0 z-30"
//       style={{
//         background: 'rgba(10,21,16,0.9)',
//         backdropFilter: 'blur(12px)',
//         borderBottom: '1px solid rgba(212,168,75,0.15)',
//       }}
//     >
//       {/* Logo */}
//       <div className="flex items-center gap-2.5">
//         <div
//           className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm"
//           style={{ background: 'linear-gradient(135deg, #d4a84b, #b8860b)', color: '#1a1a2e' }}
//         >
//           N
//         </div>
//         <div>
//           <span className="font-bold text-amber-200 text-sm tracking-wide">NardiPro</span>
//           <span className="hidden sm:inline text-amber-500/40 text-xs ml-1.5">Длинные Нарды</span>
//         </div>
//       </div>

//       {/* Center: quick stats */}
//       <div className="hidden md:flex items-center gap-4">
//         <QuickStat label="Wins" value={stats.wins} />
//         <div style={{ width: 1, height: 16, background: 'rgba(212,168,75,0.15)' }} />
//         <QuickStat label="Games" value={stats.gamesPlayed} />
//       </div>

//       {/* Actions */}
//       <div className="flex items-center gap-1">
//         <NavBtn onClick={() => setPanel('history', true)} title="Move History">
//           <History size={15} />
//         </NavBtn>
//         <NavBtn onClick={() => setPanel('leaderboard', true)} title="Leaderboard">
//           <Trophy size={15} />
//         </NavBtn>
//         <NavBtn onClick={() => setPanel('skinShop', true)} title="Skins">
//           <Palette size={15} />
//         </NavBtn>
//         <NavBtn onClick={() => setPanel('settings', true)} title="Settings">
//           <Settings size={15} />
//         </NavBtn>
//         <NavBtn onClick={toggleTheme} title="Toggle Theme">
//           {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
//         </NavBtn>
//         <motion.button
//           onClick={() => setPanel('auth', true)}
//           whileTap={{ scale: 0.95 }}
//           className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ml-1 transition-all"
//           style={{
//             background: 'rgba(212,168,75,0.12)',
//             color: '#d4a84b',
//             border: '1px solid rgba(212,168,75,0.25)',
//           }}
//         >
//           <User size={13} />
//           <span className="hidden sm:inline">Sign In</span>
//         </motion.button>
//       </div>
//     </header>
//   );
// }

// function NavBtn({ children, onClick, title }: { children: React.ReactNode; onClick: () => void; title: string }) {
//   return (
//     <motion.button
//       onClick={onClick}
//       whileTap={{ scale: 0.9 }}
//       title={title}
//       className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
//       style={{ color: 'rgba(212,168,75,0.6)' }}
//       whileHover={{ color: 'rgba(212,168,75,1)', background: 'rgba(212,168,75,0.08)' } as any}
//     >
//       {children}
//     </motion.button>
//   );
// }

// function QuickStat({ label, value }: { label: string; value: number }) {
//   return (
//     <div className="text-center">
//       <div className="text-xs font-bold text-amber-300">{value}</div>
//       <div className="text-[9px] text-amber-500/40">{label}</div>
//     </div>
//   );
// }



'use client';

import { Sun, Moon, Trophy, User, Palette, Settings, History, LogOut } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';

export function TopNav() {
  const theme = useAppStore((s) => s.theme);
  const toggleTheme = useAppStore((s) => s.toggleTheme);
  const setPanel = useAppStore((s) => s.setPanel);
  const stats = useAppStore((s) => s.stats);
  const { user, logout } = useAuth();

  return (
    <header
      className="flex items-center justify-between px-4 py-3 sticky top-0 z-30"
      style={{
        background: 'rgba(10,21,16,0.9)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(212,168,75,0.15)',
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm"
          style={{ background: 'linear-gradient(135deg, #d4a84b, #b8860b)', color: '#1a1a2e' }}
        >
          N
        </div>
        <div>
          <span className="font-bold text-amber-200 text-sm tracking-wide">Nardiki</span>
        </div>
      </div>

      {/* Center: quick stats */}
      <div className="hidden md:flex items-center gap-4">
        <QuickStat label="Wins" value={stats.wins} />
        <div style={{ width: 1, height: 16, background: 'rgba(212,168,75,0.15)' }} />
        <QuickStat label="Games" value={stats.gamesPlayed} />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1">
        <NavBtn onClick={() => setPanel('history', true)} title="Move History">
          <History size={15} />
        </NavBtn>
        <NavBtn onClick={() => setPanel('leaderboard', true)} title="Leaderboard">
          <Trophy size={15} />
        </NavBtn>
        <NavBtn onClick={() => setPanel('skinShop', true)} title="Skins">
          <Palette size={15} />
        </NavBtn>
        <NavBtn onClick={() => setPanel('settings', true)} title="Settings">
          <Settings size={15} />
        </NavBtn>
        <NavBtn onClick={toggleTheme} title="Toggle Theme">
          {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
        </NavBtn>

        {user ? (
          /* Залогинен — показываем имя и кнопку выхода */
          <div className="flex items-center gap-1 ml-1">
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold"
              style={{
                background: 'rgba(212,168,75,0.12)',
                color: '#d4a84b',
                border: '1px solid rgba(212,168,75,0.25)',
              }}
            >
              <User size={13} />
              <span className="hidden sm:inline max-w-[80px] truncate">{user.username}</span>
            </div>
            <motion.button
              onClick={logout}
              whileTap={{ scale: 0.9 }}
              title="Sign Out"
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
              style={{ color: 'rgba(212,168,75,0.6)' }}
            >
              <LogOut size={15} />
            </motion.button>
          </div>
        ) : (
          /* Не залогинен — кнопка Sign In */
          <motion.button
            onClick={() => setPanel('auth', true)}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ml-1 transition-all"
            style={{
              background: 'rgba(212,168,75,0.12)',
              color: '#d4a84b',
              border: '1px solid rgba(212,168,75,0.25)',
            }}
          >
            <User size={13} />
            <span className="hidden sm:inline">Sign In</span>
          </motion.button>
        )}
      </div>
    </header>
  );
}

function NavBtn({ children, onClick, title }: { children: React.ReactNode; onClick: () => void; title: string }) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.9 }}
      title={title}
      className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
      style={{ color: 'rgba(212,168,75,0.6)' }}
      whileHover={{ color: 'rgba(212,168,75,1)', background: 'rgba(212,168,75,0.08)' } as any}
    >
      {children}
    </motion.button>
  );
}

function QuickStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="text-center">
      <div className="text-xs font-bold text-amber-300">{value}</div>
      <div className="text-[9px] text-amber-500/40">{label}</div>
    </div>
  );
}