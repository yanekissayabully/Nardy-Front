'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Dices, RotateCcw, Save, Upload, SkipForward } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { DiceDisplay } from './DiceDisplay';

export function GameControls() {
  const game = useAppStore((s) => s.game);
  const rollDiceAction = useAppStore((s) => s.rollDiceAction);
  const skipTurnAction = useAppStore((s) => s.skipTurnAction);
  const newGame = useAppStore((s) => s.newGame);
  const saveGame = useAppStore((s) => s.saveGame);
  const loadGame = useAppStore((s) => s.loadGame);
  const savedGame = useAppStore((s) => s.savedGame);

  const { currentPlayer, gamePhase, dice, movesLeft, isRolling } = game;

  const canRoll = gamePhase === 'rolling';
  const canSkip = gamePhase === 'moving' && !isRolling;

  const playerLabel = currentPlayer === 'white' ? 'White' : 'Black';
  const playerColor = currentPlayer === 'white' ? '#f5f0e8' : '#d4a84b';

  return (
    <div
      className="flex flex-col gap-4 p-4 rounded-2xl"
      style={{
        background: 'linear-gradient(135deg, rgba(13,35,24,0.95), rgba(10,21,16,0.95))',
        border: '1px solid rgba(212,168,75,0.2)',
      }}
    >
      {/* Current player indicator */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-5 h-5 rounded-full shadow-lg"
            style={{
              background: currentPlayer === 'white' ? '#f5f0e8' : '#1a1a2e',
              border: `2px solid ${playerColor}`,
              boxShadow: `0 0 10px ${currentPlayer === 'white' ? 'rgba(245,240,232,0.4)' : 'rgba(212,168,75,0.3)'}`,
            }}
          />
          <span className="text-sm font-semibold" style={{ color: playerColor }}>
            {playerLabel}&apos;s Turn
          </span>
        </div>
        <span
          className="text-xs px-2 py-0.5 rounded-full"
          style={{
            background: canRoll ? 'rgba(212,168,75,0.15)' : 'rgba(34,197,94,0.1)',
            color: canRoll ? '#d4a84b' : '#4ade80',
            border: `1px solid ${canRoll ? 'rgba(212,168,75,0.3)' : 'rgba(34,197,94,0.2)'}`,
          }}
        >
          {gamePhase === 'gameover' ? 'Game Over' : canRoll ? 'Roll Dice' : `${movesLeft.length} move${movesLeft.length !== 1 ? 's' : ''} left`}
        </span>
      </div>

      {/* Dice display */}
      <AnimatePresence>
        {dice.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center"
          >
            <DiceDisplay dice={dice} movesLeft={movesLeft} isRolling={isRolling} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Roll button */}
      {canRoll && (
        <motion.button
          onClick={rollDiceAction}
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.02 }}
          className="w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all"
          style={{
            background: 'linear-gradient(135deg, #d4a84b, #b8860b)',
            color: '#1a1a2e',
            boxShadow: '0 4px 15px rgba(212,168,75,0.3)',
          }}
        >
          <Dices size={17} />
          Roll Dice
        </motion.button>
      )}

      {/* Skip turn button */}
      {canSkip && (
        <motion.button
          onClick={skipTurnAction}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all"
          style={{
            background: 'rgba(255,255,255,0.05)',
            color: 'rgba(212,168,75,0.6)',
            border: '1px solid rgba(212,168,75,0.15)',
          }}
        >
          <SkipForward size={13} />
          Pass / Skip Turn
        </motion.button>
      )}

      {/* Action buttons */}
      <div className="grid grid-cols-2 gap-2">
        <ActionButton onClick={newGame} icon={<RotateCcw size={13} />} label="New Game" />
        <ActionButton onClick={saveGame} icon={<Save size={13} />} label="Save" />
        <ActionButton
          onClick={loadGame}
          icon={<Upload size={13} />}
          label="Load"
          disabled={!savedGame}
        />
        <ActionButton
          onClick={() => {/* TODO */}}
          icon={<span className="text-xs">🔗</span>}
          label="Multiplayer"
          comingSoon
        />
      </div>
    </div>
  );
}

function ActionButton({
  onClick,
  icon,
  label,
  disabled,
  comingSoon,
}: {
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  disabled?: boolean;
  comingSoon?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all active:scale-95 relative"
      style={{
        background: disabled ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.05)',
        color: disabled ? 'rgba(212,168,75,0.25)' : 'rgba(212,168,75,0.7)',
        border: `1px solid ${disabled ? 'rgba(255,255,255,0.05)' : 'rgba(212,168,75,0.15)'}`,
      }}
    >
      {icon}
      {label}
      {comingSoon && (
        <span
          className="absolute -top-1.5 -right-1.5 px-1 py-0.5 rounded text-[8px] font-bold"
          style={{ background: '#d4a84b', color: '#1a1a2e' }}
        >
          SOON
        </span>
      )}
    </button>
  );
}
