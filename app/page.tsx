'use client';

import { AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { TopNav } from '@/components/layout/TopNav';
import { Board } from '@/components/game/Board';
import { GameControls } from '@/components/game/GameControls';
import { MoveHistoryPanel } from '@/components/modals/MoveHistory';
import { AuthModal } from '@/components/modals/AuthModal';
import { LeaderboardModal } from '@/components/modals/Leaderboard';
import { CoachPopup } from '@/components/modals/CoachPopup';
import { SkinShop } from '@/components/modals/SkinShop';
import { SettingsModal } from '@/components/modals/Settings';

export default function Page() {
  const showAuth = useAppStore((s) => s.showAuth);
  const showLeaderboard = useAppStore((s) => s.showLeaderboard);
  const showCoach = useAppStore((s) => s.showCoach);
  const showSkinShop = useAppStore((s) => s.showSkinShop);
  const showSettings = useAppStore((s) => s.showSettings);

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: 'linear-gradient(160deg, #07150d 0%, #0a1a10 50%, #081208 100%)' }}
    >
      <TopNav />

      <main className="flex-1 flex flex-col lg:flex-row gap-4 p-4 max-w-7xl mx-auto w-full">
        {/* Board — takes most of the space */}
        <div className="flex-1 min-w-0 flex items-start justify-center">
          <div className="w-full">
            <Board />
          </div>
        </div>

        {/* Side panel: controls */}
        <aside className="w-full lg:w-64 xl:w-72 flex-shrink-0">
          <GameControls />

          {/* How to play */}
          <div
            className="mt-4 p-4 rounded-xl text-xs leading-relaxed"
            style={{
              background: 'rgba(13,35,24,0.6)',
              border: '1px solid rgba(212,168,75,0.1)',
              color: 'rgba(212,168,75,0.5)',
            }}
          >
            <p className="font-bold text-amber-400/70 mb-2 text-[11px] uppercase tracking-wider">How to Play</p>
            <ul className="space-y-1">
              <li>1. Click <strong className="text-amber-400/70">Roll Dice</strong> to start your turn.</li>
              <li>2. Click a piece to see valid moves (green highlight).</li>
              <li>3. Click a highlighted point to move.</li>
              <li>4. Bear off all 15 pieces from your home board to win.</li>
            </ul>
            <div className="mt-3 pt-2" style={{ borderTop: '1px solid rgba(212,168,75,0.1)' }}>
              <p className="font-bold text-amber-400/70 mb-1 text-[11px] uppercase tracking-wider">Rules</p>
              <p>White: 24→1 &nbsp;|&nbsp; Black: 1→24</p>
              <p className="mt-0.5">No hitting. Cannot land on opponent.</p>
            </div>
          </div>
        </aside>
      </main>

      {/* Slide-out move history */}
      <MoveHistoryPanel />

      {/* Modals */}
      <AnimatePresence>
        {showAuth && <AuthModal key="auth" />}
        {showLeaderboard && <LeaderboardModal key="leaderboard" />}
        {showCoach && <CoachPopup key="coach" />}
        {showSkinShop && <SkinShop key="skinShop" />}
        {showSettings && <SettingsModal key="settings" />}
      </AnimatePresence>
    </div>
  );
}
