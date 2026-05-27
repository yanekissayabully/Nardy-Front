'use client';

import { motion } from 'framer-motion';
import { X, Volume2, VolumeX, Zap, ZapOff, Settings as SettingsIcon, Bot } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { Overlay } from './AuthModal';

export function SettingsModal() {
  const setPanel = useAppStore((s) => s.setPanel);
  const soundEnabled = useAppStore((s) => s.soundEnabled);
  const animationsEnabled = useAppStore((s) => s.animationsEnabled);
  const aiDifficulty = useAppStore((s) => s.aiDifficulty);
  const setSoundEnabled = useAppStore((s) => s.setSoundEnabled);
  const setAnimationsEnabled = useAppStore((s) => s.setAnimationsEnabled);
  const setAiDifficulty = useAppStore((s) => s.setAiDifficulty);

  return (
    <Overlay onClose={() => setPanel('settings', false)}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="relative w-full max-w-sm"
        style={{
          background: 'linear-gradient(135deg, #0d2318, #0a1510)',
          border: '1px solid rgba(212,168,75,0.3)',
          borderRadius: 16,
          padding: 24,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setPanel('settings', false)}
          className="absolute top-4 right-4 text-amber-500/50 hover:text-amber-300"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-2 mb-5">
          <SettingsIcon size={18} className="text-amber-400" />
          <h2 className="text-lg font-bold text-amber-300">Settings</h2>
        </div>

        <div className="flex flex-col gap-4">
          {/* Sound */}
          <SettingRow
            icon={soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            label="Sound Effects"
            description="Dice roll & move sounds"
          >
            <Toggle value={soundEnabled} onChange={setSoundEnabled} />
          </SettingRow>

          {/* Animations */}
          <SettingRow
            icon={animationsEnabled ? <Zap size={16} /> : <ZapOff size={16} />}
            label="Animations"
            description="Piece movement & dice animations"
          >
            <Toggle value={animationsEnabled} onChange={setAnimationsEnabled} />
          </SettingRow>

          {/* AI Difficulty */}
          <div className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-amber-500/70"><Bot size={16} /></span>
              <div>
                <div className="text-sm font-semibold text-amber-100">AI Difficulty</div>
                <div className="text-[10px] text-amber-500/50">Computer opponent strength</div>
              </div>
            </div>
            <div className="flex gap-2">
              {(['easy', 'medium', 'hard'] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => setAiDifficulty(d)}
                  className="flex-1 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all"
                  style={{
                    background: aiDifficulty === d ? 'rgba(212,168,75,0.2)' : 'rgba(255,255,255,0.03)',
                    color: aiDifficulty === d ? '#d4a84b' : 'rgba(212,168,75,0.4)',
                    border: aiDifficulty === d ? '1px solid rgba(212,168,75,0.3)' : '1px solid rgba(255,255,255,0.05)',
                  }}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </Overlay>
  );
}

function SettingRow({ icon, label, description, children }: {
  icon: React.ReactNode;
  label: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
      <span className="text-amber-500/70">{icon}</span>
      <div className="flex-1">
        <div className="text-sm font-semibold text-amber-100">{label}</div>
        <div className="text-[10px] text-amber-500/50">{description}</div>
      </div>
      {children}
    </div>
  );
}

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className="relative w-10 h-5 rounded-full transition-all flex-shrink-0"
      style={{ background: value ? 'rgba(212,168,75,0.5)' : 'rgba(255,255,255,0.1)' }}
    >
      <motion.div
        className="absolute top-0.5 w-4 h-4 rounded-full shadow"
        animate={{ left: value ? 22 : 2 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        style={{ background: value ? '#d4a84b' : '#6b7280' }}
      />
    </button>
  );
}
