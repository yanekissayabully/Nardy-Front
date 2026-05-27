'use client';

import { motion } from 'framer-motion';
import { X, Lock, ShoppingBag, CreditCard } from 'lucide-react';
import { useAppStore, SKINS } from '@/lib/store';
import { Overlay } from './AuthModal';

export function SkinShop() {
  const setPanel = useAppStore((s) => s.setPanel);
  const activeSkinId = useAppStore((s) => s.activeSkinId);
  const isPro = useAppStore((s) => s.isPro);
  const setSkin = useAppStore((s) => s.setSkin);

  const handleCheckout = async () => {
    // TODO: fetch('/api/payments/create-checkout', { method: 'POST' })
    alert('Stripe checkout coming soon! POST /api/payments/create-checkout');
  };

  return (
    <Overlay onClose={() => setPanel('skinShop', false)}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="relative w-full max-w-md"
        style={{
          background: 'linear-gradient(135deg, #0d2318, #0a1510)',
          border: '1px solid rgba(212,168,75,0.3)',
          borderRadius: 16,
          padding: 24,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setPanel('skinShop', false)}
          className="absolute top-4 right-4 text-amber-500/50 hover:text-amber-300"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <ShoppingBag size={18} className="text-amber-400" />
          <h2 className="text-lg font-bold text-amber-300">Piece Skins</h2>
          {!isPro && (
            <span className="ml-auto px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: 'rgba(212,168,75,0.15)', color: '#d4a84b' }}>
              Upgrade to PRO
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 gap-3 mb-4">
          {SKINS.map((skin) => {
            const isLocked = skin.isPremium && !isPro;
            const isActive = activeSkinId === skin.id;

            return (
              <motion.button
                key={skin.id}
                onClick={() => !isLocked && setSkin(skin.id)}
                whileTap={!isLocked ? { scale: 0.97 } : {}}
                className="flex items-center gap-4 p-3 rounded-xl transition-all text-left"
                style={{
                  background: isActive ? 'rgba(212,168,75,0.15)' : 'rgba(255,255,255,0.03)',
                  border: isActive ? '1px solid rgba(212,168,75,0.4)' : '1px solid rgba(255,255,255,0.07)',
                  opacity: isLocked ? 0.6 : 1,
                  cursor: isLocked ? 'not-allowed' : 'pointer',
                }}
              >
                {/* Preview circles */}
                <div className="flex gap-2 items-center">
                  <div
                    className="w-8 h-8 rounded-full shadow-md"
                    style={{ background: skin.white, border: '2px solid rgba(212,168,75,0.4)' }}
                  />
                  <div
                    className="w-8 h-8 rounded-full shadow-md"
                    style={{ background: skin.black, border: '2px solid rgba(255,255,255,0.2)' }}
                  />
                </div>

                <div className="flex-1">
                  <div className="text-sm font-semibold text-amber-100">{skin.name}</div>
                  {skin.isPremium && (
                    <div className="text-[10px] text-amber-500/60">Premium skin</div>
                  )}
                </div>

                {isLocked && <Lock size={14} className="text-amber-500/50" />}
                {isActive && !isLocked && (
                  <div className="w-2 h-2 rounded-full bg-amber-400" />
                )}
              </motion.button>
            );
          })}
        </div>

        {!isPro && (
          <button
            onClick={handleCheckout}
            className="w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all active:scale-95"
            style={{ background: 'linear-gradient(135deg, #d4a84b, #b8860b)', color: '#1a1a2e' }}
          >
            <CreditCard size={15} />
            Upgrade to PRO — Unlock All Skins
          </button>
        )}

        <p className="text-center text-[10px] text-amber-500/30 mt-3">
          Payments via Stripe: <code>POST /api/payments/create-checkout</code>
        </p>
      </motion.div>
    </Overlay>
  );
}
