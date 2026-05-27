// 'use client';

// import { motion } from 'framer-motion';
// import { X, Brain, RefreshCw } from 'lucide-react';
// import { useAppStore } from '@/lib/store';
// import { useAI } from '@/hooks/useAI';
// import { useState } from 'react';
// import { Overlay } from './AuthModal';

// export function CoachPopup() {
//   const setPanel = useAppStore((s) => s.setPanel);
//   const coachAdvice = useAppStore((s) => s.coachAdvice);
//   const setCoachAdvice = useAppStore((s) => s.setCoachAdvice);
//   const newGame = useAppStore((s) => s.newGame);
//   const { getCoachAdvice } = useAI();
//   const [loading, setLoading] = useState(false);

//   const refresh = async () => {
//     setLoading(true);
//     const advice = await getCoachAdvice();
//     setCoachAdvice(advice);
//     setLoading(false);
//   };

//   return (
//     <Overlay onClose={() => setPanel('coach', false)}>
//       <motion.div
//         initial={{ scale: 0.85, opacity: 0, y: 30 }}
//         animate={{ scale: 1, opacity: 1, y: 0 }}
//         exit={{ scale: 0.85, opacity: 0, y: 30 }}
//         transition={{ type: 'spring', stiffness: 280, damping: 22 }}
//         className="relative w-full max-w-sm"
//         style={{
//           background: 'linear-gradient(135deg, #0d2318, #0a1510)',
//           border: '1px solid rgba(212,168,75,0.3)',
//           borderRadius: 16,
//           padding: 28,
//         }}
//         onClick={(e) => e.stopPropagation()}
//       >
//         <button
//           onClick={() => setPanel('coach', false)}
//           className="absolute top-4 right-4 text-amber-500/50 hover:text-amber-300"
//         >
//           <X size={18} />
//         </button>

//         <div className="flex flex-col items-center text-center gap-4">
//           <div
//             className="w-14 h-14 rounded-full flex items-center justify-center"
//             style={{ background: 'rgba(212,168,75,0.15)', border: '2px solid rgba(212,168,75,0.3)' }}
//           >
//             <Brain size={26} className="text-amber-400" />
//           </div>

//           <div>
//             <h2 className="text-lg font-bold text-amber-300 mb-1">AI Coach</h2>
//             <p className="text-xs text-amber-500/50">Powered by game analysis</p>
//           </div>

//           <div
//             className="w-full p-4 rounded-xl text-sm leading-relaxed text-amber-100/80"
//             style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(212,168,75,0.1)' }}
//           >
//             {loading ? (
//               <div className="flex items-center justify-center py-2">
//                 <span className="animate-spin h-4 w-4 border-2 border-amber-400 border-t-transparent rounded-full" />
//               </div>
//             ) : (
//               coachAdvice || 'Complete a game to receive personalized advice.'
//             )}
//           </div>

//           <div className="flex gap-3 w-full">
//             <button
//               onClick={refresh}
//               disabled={loading}
//               className="flex-1 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all"
//               style={{ background: 'rgba(212,168,75,0.1)', color: '#d4a84b', border: '1px solid rgba(212,168,75,0.2)' }}
//             >
//               <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
//               New Tip
//             </button>
//             <button
//               onClick={() => { setPanel('coach', false); newGame(); }}
//               className="flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all active:scale-95"
//               style={{ background: 'linear-gradient(135deg, #d4a84b, #b8860b)', color: '#1a1a2e' }}
//             >
//               New Game
//             </button>
//           </div>

//           <p className="text-[10px] text-amber-500/30">
//             API: <code>POST /api/ai/analyze</code> (stub)
//           </p>
//         </div>
//       </motion.div>
//     </Overlay>
//   );
// }




'use client';

import { motion } from 'framer-motion';
import { X, Brain, RefreshCw } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { useAI } from '@/hooks/useAI';
import { useState } from 'react';
import { Overlay } from './AuthModal';

export function CoachPopup() {
  const setPanel = useAppStore((s) => s.setPanel);
  const coachAdvice = useAppStore((s) => s.coachAdvice);
  const setCoachAdvice = useAppStore((s) => s.setCoachAdvice);
  const newGame = useAppStore((s) => s.newGame);
  const { getCoachAdvice } = useAI();
  const [loading, setLoading] = useState(false);

  const refresh = async () => {
    setLoading(true);
    const advice = await getCoachAdvice([], 'white', 'black');
    setCoachAdvice(advice);
    setLoading(false);
  };

  return (
    <Overlay onClose={() => setPanel('coach', false)}>
      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.85, opacity: 0, y: 30 }}
        transition={{ type: 'spring', stiffness: 280, damping: 22 }}
        className="relative w-full max-w-sm"
        style={{
          background: 'linear-gradient(135deg, #0d2318, #0a1510)',
          border: '1px solid rgba(212,168,75,0.3)',
          borderRadius: 16,
          padding: 28,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setPanel('coach', false)}
          className="absolute top-4 right-4 text-amber-500/50 hover:text-amber-300"
        >
          <X size={18} />
        </button>

        <div className="flex flex-col items-center text-center gap-4">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(212,168,75,0.15)', border: '2px solid rgba(212,168,75,0.3)' }}
          >
            <Brain size={26} className="text-amber-400" />
          </div>

          <div>
            <h2 className="text-lg font-bold text-amber-300 mb-1">AI Coach</h2>
            <p className="text-xs text-amber-500/50">Powered by game analysis</p>
          </div>

          <div
            className="w-full p-4 rounded-xl text-sm leading-relaxed text-amber-100/80"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(212,168,75,0.1)' }}
          >
            {loading ? (
              <div className="flex items-center justify-center py-2">
                <span className="animate-spin h-4 w-4 border-2 border-amber-400 border-t-transparent rounded-full" />
              </div>
            ) : (
              coachAdvice || 'Complete a game to receive personalized advice.'
            )}
          </div>

          <div className="flex gap-3 w-full">
            <button
              onClick={refresh}
              disabled={loading}
              className="flex-1 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all"
              style={{ background: 'rgba(212,168,75,0.1)', color: '#d4a84b', border: '1px solid rgba(212,168,75,0.2)' }}
            >
              <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
              New Tip
            </button>
            <button
              onClick={() => { setPanel('coach', false); newGame(); }}
              className="flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all active:scale-95"
              style={{ background: 'linear-gradient(135deg, #d4a84b, #b8860b)', color: '#1a1a2e' }}
            >
              New Game
            </button>
          </div>

          <p className="text-[10px] text-amber-500/30">
            API: <code>POST /api/ai/analyze</code> (stub)
          </p>
        </div>
      </motion.div>
    </Overlay>
  );
}