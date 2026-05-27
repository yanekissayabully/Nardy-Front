// 'use client';

// import { useState, useEffect, useCallback } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { X, Link2, Users, Copy, Check, Loader2, Wifi, WifiOff, ArrowRight, LogIn } from 'lucide-react';
// import { useAppStore } from '@/lib/store';
// import { useMultiplayer } from '@/hooks/useMultiplayer';
// import { Overlay } from './AuthModal';

// type Screen = 'menu' | 'create' | 'join' | 'waiting' | 'connecting';

// export function MultiplayerModal() {
//   const setPanel = useAppStore((s) => s.setPanel);
//   const game = useAppStore((s) => s.game);
//   const newGame = useAppStore((s) => s.newGame);

//   const [screen, setScreen] = useState<Screen>('menu');
//   const [roomId, setRoomId] = useState('');
//   const [joinCode, setJoinCode] = useState('');
//   const [copied, setCopied] = useState(false);
//   const [error, setError] = useState('');
//   const [myColor, setMyColor] = useState<'white' | 'black' | null>(null);
//   const [opponentConnected, setOpponentConnected] = useState(false);

//   const mp = useMultiplayer();

//   const handleCreateRoom = async () => {
//     setScreen('connecting');
//     setError('');
//     try {
//       mp.connect();
//       // Даём время на подключение
//       await new Promise((r) => setTimeout(r, 800));
//       const id = await mp.createRoom();
//       setRoomId(id);
//       setMyColor('white');
//       setScreen('waiting');

//       // Слушаем старт игры
//       mp.onGameStart((data) => {
//         setOpponentConnected(true);
//       });
//     } catch (e) {
//       setError('Failed to connect to server. Make sure the backend is running.');
//       setScreen('menu');
//     }
//   };

//   const handleJoinRoom = async () => {
//     if (joinCode.trim().length < 4) {
//       setError('Enter a valid room code');
//       return;
//     }
//     setScreen('connecting');
//     setError('');
//     try {
//       mp.connect();
//       await new Promise((r) => setTimeout(r, 800));
//       const ok = await mp.joinRoom(joinCode.trim().toUpperCase());
//       if (!ok) {
//         setError('Room not found or already full');
//         setScreen('join');
//         return;
//       }
//       setMyColor('black');
//       setOpponentConnected(true);
//       setRoomId(joinCode.trim().toUpperCase());
//       // Игра уже началась — закрываем модал
//       setTimeout(() => {
//         newGame();
//         setPanel('multiplayer', false);
//       }, 1200);
//     } catch (e) {
//       setError('Connection failed. Check the room code and try again.');
//       setScreen('join');
//     }
//   };

//   const handleCopy = () => {
//     const link = `${window.location.origin}?room=${roomId}`;
//     navigator.clipboard.writeText(link).then(() => {
//       setCopied(true);
//       setTimeout(() => setCopied(false), 2000);
//     });
//   };

//   const handleCopyCode = () => {
//     navigator.clipboard.writeText(roomId).then(() => {
//       setCopied(true);
//       setTimeout(() => setCopied(false), 2000);
//     });
//   };

//   const handleStartWithBot = () => {
//     // Пока мультиплеер не подключён — играем локально
//     newGame();
//     setPanel('multiplayer', false);
//   };

//   return (
//     <Overlay onClose={() => setPanel('multiplayer', false)}>
//       <motion.div
//         initial={{ scale: 0.9, opacity: 0, y: 20 }}
//         animate={{ scale: 1, opacity: 1, y: 0 }}
//         exit={{ scale: 0.9, opacity: 0, y: 20 }}
//         transition={{ type: 'spring', stiffness: 300, damping: 25 }}
//         className="relative w-full max-w-sm overflow-hidden"
//         style={{
//           background: 'linear-gradient(135deg, #0d2318, #0a1510)',
//           border: '1px solid rgba(212,168,75,0.3)',
//           borderRadius: 16,
//         }}
//         onClick={(e) => e.stopPropagation()}
//       >
//         {/* Header */}
//         <div
//           className="flex items-center justify-between p-5 pb-4"
//           style={{ borderBottom: '1px solid rgba(212,168,75,0.1)' }}
//         >
//           <div className="flex items-center gap-2">
//             <Users size={18} className="text-amber-400" />
//             <h2 className="text-lg font-bold text-amber-300">Multiplayer</h2>
//           </div>
//           <button onClick={() => setPanel('multiplayer', false)} className="text-amber-500/50 hover:text-amber-300">
//             <X size={18} />
//           </button>
//         </div>

//         <div className="p-5">
//           <AnimatePresence mode="wait">

//             {/* MENU */}
//             {screen === 'menu' && (
//               <motion.div
//                 key="menu"
//                 initial={{ opacity: 0, x: 20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 exit={{ opacity: 0, x: -20 }}
//                 className="flex flex-col gap-3"
//               >
//                 <p className="text-xs text-amber-500/60 mb-1">
//                   Play with a friend via shared link — no account required.
//                 </p>

//                 <BigButton
//                   icon={<Link2 size={18} />}
//                   title="Create Room"
//                   subtitle="Get a link to share with a friend"
//                   onClick={handleCreateRoom}
//                   color="#d4a84b"
//                 />

//                 <BigButton
//                   icon={<LogIn size={18} />}
//                   title="Join Room"
//                   subtitle="Enter a code from your friend"
//                   onClick={() => { setError(''); setScreen('join'); }}
//                   color="#4ade80"
//                 />

//                 <div
//                   className="h-px w-full my-1"
//                   style={{ background: 'rgba(212,168,75,0.1)' }}
//                 />

//                 <button
//                   onClick={handleStartWithBot}
//                   className="text-center text-xs text-amber-500/40 hover:text-amber-400 transition-colors py-1"
//                 >
//                   Or play locally (same screen) →
//                 </button>

//                 {error && (
//                   <div
//                     className="p-3 rounded-lg text-xs text-red-300"
//                     style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}
//                   >
//                     {error}
//                   </div>
//                 )}
//               </motion.div>
//             )}

//             {/* JOIN */}
//             {screen === 'join' && (
//               <motion.div
//                 key="join"
//                 initial={{ opacity: 0, x: 20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 exit={{ opacity: 0, x: -20 }}
//                 className="flex flex-col gap-4"
//               >
//                 <button
//                   onClick={() => setScreen('menu')}
//                   className="text-xs text-amber-500/50 hover:text-amber-400 text-left transition-colors"
//                 >
//                   ← Back
//                 </button>

//                 <div>
//                   <label className="text-xs text-amber-400/70 block mb-2">Room Code</label>
//                   <input
//                     autoFocus
//                     value={joinCode}
//                     onChange={(e) => setJoinCode(e.target.value.toUpperCase().slice(0, 8))}
//                     onKeyDown={(e) => e.key === 'Enter' && handleJoinRoom()}
//                     placeholder="e.g. AB12CD"
//                     className="w-full px-4 py-3 rounded-xl text-amber-100 text-center text-2xl font-mono tracking-widest outline-none"
//                     style={{
//                       background: 'rgba(255,255,255,0.05)',
//                       border: '1px solid rgba(212,168,75,0.3)',
//                       letterSpacing: '0.2em',
//                     }}
//                   />
//                 </div>

//                 {error && (
//                   <div
//                     className="p-3 rounded-lg text-xs text-red-300"
//                     style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}
//                   >
//                     {error}
//                   </div>
//                 )}

//                 <motion.button
//                   whileTap={{ scale: 0.97 }}
//                   onClick={handleJoinRoom}
//                   className="w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
//                   style={{
//                     background: 'linear-gradient(135deg, #22c55e, #16a34a)',
//                     color: '#fff',
//                   }}
//                 >
//                   <ArrowRight size={16} />
//                   Join Game
//                 </motion.button>
//               </motion.div>
//             )}

//             {/* CONNECTING */}
//             {screen === 'connecting' && (
//               <motion.div
//                 key="connecting"
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 exit={{ opacity: 0 }}
//                 className="flex flex-col items-center gap-4 py-8"
//               >
//                 <Loader2 size={32} className="text-amber-400 animate-spin" />
//                 <p className="text-sm text-amber-300">Connecting to server...</p>
//               </motion.div>
//             )}

//             {/* WAITING for opponent */}
//             {screen === 'waiting' && (
//               <motion.div
//                 key="waiting"
//                 initial={{ opacity: 0, x: 20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 exit={{ opacity: 0, x: -20 }}
//                 className="flex flex-col gap-4"
//               >
//                 <div className="flex items-center gap-2">
//                   <AnimatePresence>
//                     {opponentConnected ? (
//                       <motion.div
//                         initial={{ scale: 0 }}
//                         animate={{ scale: 1 }}
//                         className="flex items-center gap-2"
//                       >
//                         <Wifi size={14} className="text-green-400" />
//                         <span className="text-xs text-green-400 font-semibold">Opponent connected!</span>
//                       </motion.div>
//                     ) : (
//                       <div className="flex items-center gap-2">
//                         <motion.div
//                           animate={{ opacity: [1, 0.3, 1] }}
//                           transition={{ duration: 1.5, repeat: Infinity }}
//                         >
//                           <WifiOff size={14} className="text-amber-400" />
//                         </motion.div>
//                         <span className="text-xs text-amber-400">Waiting for opponent...</span>
//                       </div>
//                     )}
//                   </AnimatePresence>
//                 </div>

//                 {/* Room code */}
//                 <div
//                   className="p-4 rounded-xl text-center"
//                   style={{ background: 'rgba(212,168,75,0.07)', border: '1px solid rgba(212,168,75,0.2)' }}
//                 >
//                   <p className="text-[10px] text-amber-500/50 mb-1 uppercase tracking-wider">Room Code</p>
//                   <div className="text-3xl font-mono font-bold text-amber-300 tracking-widest mb-3">
//                     {roomId}
//                   </div>
//                   <div className="flex gap-2">
//                     <button
//                       onClick={handleCopyCode}
//                       className="flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
//                       style={{
//                         background: copied ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.06)',
//                         color: copied ? '#4ade80' : 'rgba(212,168,75,0.7)',
//                         border: '1px solid rgba(212,168,75,0.2)',
//                       }}
//                     >
//                       {copied ? <Check size={12} /> : <Copy size={12} />}
//                       {copied ? 'Copied!' : 'Copy Code'}
//                     </button>
//                     <button
//                       onClick={handleCopy}
//                       className="flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
//                       style={{
//                         background: 'rgba(212,168,75,0.1)',
//                         color: '#d4a84b',
//                         border: '1px solid rgba(212,168,75,0.25)',
//                       }}
//                     >
//                       <Link2 size={12} />
//                       Copy Link
//                     </button>
//                   </div>
//                 </div>

//                 {/* You are playing as */}
//                 <div className="flex items-center justify-center gap-2 text-xs text-amber-500/50">
//                   <span>You play as</span>
//                   <div
//                     className="w-4 h-4 rounded-full border-2"
//                     style={{
//                       background: myColor === 'white' ? '#f5f0e8' : '#1a1a2e',
//                       borderColor: myColor === 'white' ? '#d4a84b' : '#d4a84b',
//                     }}
//                   />
//                   <span className="text-amber-400 font-semibold capitalize">{myColor}</span>
//                 </div>

//                 {/* Dots animation */}
//                 {!opponentConnected && (
//                   <div className="flex justify-center gap-1.5 pt-2">
//                     {[0, 1, 2].map((i) => (
//                       <motion.div
//                         key={i}
//                         animate={{ y: [0, -6, 0] }}
//                         transition={{ duration: 0.8, delay: i * 0.2, repeat: Infinity }}
//                         className="w-1.5 h-1.5 rounded-full"
//                         style={{ background: 'rgba(212,168,75,0.4)' }}
//                       />
//                     ))}
//                   </div>
//                 )}

//                 {opponentConnected && (
//                   <motion.button
//                     initial={{ opacity: 0, y: 10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     whileTap={{ scale: 0.97 }}
//                     onClick={() => { newGame(); setPanel('multiplayer', false); }}
//                     className="w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
//                     style={{
//                       background: 'linear-gradient(135deg, #d4a84b, #b8860b)',
//                       color: '#1a1a2e',
//                     }}
//                   >
//                     Start Game →
//                   </motion.button>
//                 )}

//                 <button
//                   onClick={() => { mp.disconnect(); setScreen('menu'); }}
//                   className="text-center text-xs text-amber-500/30 hover:text-amber-500/60 transition-colors"
//                 >
//                   Cancel
//                 </button>
//               </motion.div>
//             )}

//           </AnimatePresence>
//         </div>
//       </motion.div>
//     </Overlay>
//   );
// }

// function BigButton({
//   icon, title, subtitle, onClick, color,
// }: {
//   icon: React.ReactNode;
//   title: string;
//   subtitle: string;
//   onClick: () => void;
//   color: string;
// }) {
//   return (
//     <motion.button
//       whileTap={{ scale: 0.98 }}
//       whileHover={{ scale: 1.01 }}
//       onClick={onClick}
//       className="w-full p-4 rounded-xl flex items-center gap-3 text-left transition-all"
//       style={{
//         background: `rgba(${color === '#d4a84b' ? '212,168,75' : '74,222,128'},0.08)`,
//         border: `1px solid ${color}33`,
//       }}
//     >
//       <div
//         className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
//         style={{ background: `${color}22`, color }}
//       >
//         {icon}
//       </div>
//       <div>
//         <div className="text-sm font-bold" style={{ color }}>{title}</div>
//         <div className="text-[11px] text-amber-500/50 mt-0.5">{subtitle}</div>
//       </div>
//       <ArrowRight size={14} className="ml-auto" style={{ color: `${color}60` }} />
//     </motion.button>
//   );
// }



'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Link2, Users, Copy, Check, Loader2, Wifi, WifiOff, ArrowRight, LogIn } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { useMultiplayer } from '@/hooks/useMultiplayer';
import { Overlay } from './AuthModal';

type Screen = 'menu' | 'join' | 'connecting' | 'waiting';

export function MultiplayerModal() {
  const setPanel = useAppStore((s) => s.setPanel);
  const newGame = useAppStore((s) => s.newGame);

  const [screen, setScreen] = useState<Screen>('menu');
  const [roomId, setRoomId] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [isJoiner, setIsJoiner] = useState(false); // второй игрок или первый

  const mp = useMultiplayer();

  const handleClose = () => {
    mp.disconnect();
    setPanel('multiplayer', false);
  };

  const handleCreateRoom = async () => {
    setScreen('connecting');
    setError('');
    try {
      const id = await mp.createRoom();
      setRoomId(id);
      setIsJoiner(false);
      setScreen('waiting');
    } catch (e: any) {
      setError(e.message || 'Failed to connect. Make sure the backend is running on port 3001.');
      setScreen('menu');
    }
  };

  const handleJoinRoom = async () => {
    const code = joinCode.trim().toUpperCase();
    if (code.length < 4) {
      setError('Enter a valid room code');
      return;
    }
    setScreen('connecting');
    setError('');
    try {
      await mp.joinRoom(code);
      setRoomId(code);
      setIsJoiner(true);
      setScreen('waiting');
    } catch (e: any) {
      setError(e.message || 'Room not found or already full.');
      setScreen('join');
    }
  };

  const handleStartGame = () => {
    newGame();
    setPanel('multiplayer', false);
    // НЕ дисконнектимся — сокет нужен для передачи ходов
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(roomId).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleCopyLink = () => {
    const link = `${window.location.origin}?room=${roomId}`;
    navigator.clipboard.writeText(link).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Оба игрока готовы когда: создатель получил opponentReady, или джойнер уже подключился
  const bothReady = mp.opponentReady || isJoiner;

  return (
    <Overlay onClose={handleClose}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="relative w-full max-w-sm overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0d2318, #0a1510)',
          border: '1px solid rgba(212,168,75,0.3)',
          borderRadius: 16,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 pb-4" style={{ borderBottom: '1px solid rgba(212,168,75,0.1)' }}>
          <div className="flex items-center gap-2">
            <Users size={18} className="text-amber-400" />
            <h2 className="text-lg font-bold text-amber-300">Multiplayer</h2>
          </div>
          <button onClick={handleClose} className="text-amber-500/50 hover:text-amber-300 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-5">
          <AnimatePresence mode="wait">

            {/* MENU */}
            {screen === 'menu' && (
              <motion.div key="menu" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-3">
                <p className="text-xs text-amber-500/60 mb-1">Play with a friend via shared code — no account required.</p>

                <BigButton icon={<Link2 size={18} />} title="Create Room" subtitle="Get a code to share with a friend" onClick={handleCreateRoom} color="#d4a84b" />
                <BigButton icon={<LogIn size={18} />} title="Join Room" subtitle="Enter a code from your friend" onClick={() => { setError(''); setScreen('join'); }} color="#4ade80" />

                <div className="h-px w-full my-1" style={{ background: 'rgba(212,168,75,0.1)' }} />
                <button onClick={() => { newGame(); setPanel('multiplayer', false); }} className="text-center text-xs text-amber-500/40 hover:text-amber-400 transition-colors py-1">
                  Or play locally (same screen) →
                </button>

                {error && <ErrorBox message={error} />}
              </motion.div>
            )}

            {/* JOIN */}
            {screen === 'join' && (
              <motion.div key="join" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-4">
                <button onClick={() => { setError(''); setScreen('menu'); }} className="text-xs text-amber-500/50 hover:text-amber-400 text-left transition-colors">← Back</button>

                <div>
                  <label className="text-xs text-amber-400/70 block mb-2">Room Code</label>
                  <input
                    autoFocus
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value.toUpperCase().slice(0, 8))}
                    onKeyDown={(e) => e.key === 'Enter' && handleJoinRoom()}
                    placeholder="AB12CD"
                    className="w-full px-4 py-3 rounded-xl text-amber-100 text-center text-2xl font-mono outline-none"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(212,168,75,0.3)', letterSpacing: '0.2em' }}
                  />
                </div>

                {error && <ErrorBox message={error} />}

                <motion.button whileTap={{ scale: 0.97 }} onClick={handleJoinRoom} className="w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2" style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)', color: '#fff' }}>
                  <ArrowRight size={16} /> Join Game
                </motion.button>
              </motion.div>
            )}

            {/* CONNECTING */}
            {screen === 'connecting' && (
              <motion.div key="connecting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-4 py-10">
                <Loader2 size={32} className="text-amber-400 animate-spin" />
                <p className="text-sm text-amber-300">Connecting to server...</p>
              </motion.div>
            )}

            {/* WAITING */}
            {screen === 'waiting' && (
              <motion.div key="waiting" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-4">

                {/* Status badge */}
                <div className="flex items-center gap-2">
                  {bothReady ? (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-2">
                      <Wifi size={14} className="text-green-400" />
                      <span className="text-xs text-green-400 font-semibold">
                        {isJoiner ? 'Connected! Waiting for host to start...' : 'Opponent connected!'}
                      </span>
                    </motion.div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
                        <WifiOff size={14} className="text-amber-400" />
                      </motion.div>
                      <span className="text-xs text-amber-400">Waiting for opponent...</span>
                    </div>
                  )}
                </div>

                {/* Room code */}
                <div className="p-4 rounded-xl text-center" style={{ background: 'rgba(212,168,75,0.07)', border: '1px solid rgba(212,168,75,0.2)' }}>
                  <p className="text-[10px] text-amber-500/50 mb-1 uppercase tracking-wider">Room Code</p>
                  <div className="text-3xl font-mono font-bold text-amber-300 tracking-widest mb-3">{roomId}</div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleCopyCode}
                      className="flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                      style={{ background: copied ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.06)', color: copied ? '#4ade80' : 'rgba(212,168,75,0.7)', border: '1px solid rgba(212,168,75,0.2)' }}
                    >
                      {copied ? <Check size={12} /> : <Copy size={12} />}
                      {copied ? 'Copied!' : 'Copy Code'}
                    </button>
                    <button
                      onClick={handleCopyLink}
                      className="flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                      style={{ background: 'rgba(212,168,75,0.1)', color: '#d4a84b', border: '1px solid rgba(212,168,75,0.25)' }}
                    >
                      <Link2 size={12} /> Copy Link
                    </button>
                  </div>
                </div>

                {/* Color indicator */}
                <div className="flex items-center justify-center gap-2 text-xs text-amber-500/50">
                  <span>You play as</span>
                  <div className="w-4 h-4 rounded-full border-2" style={{ background: mp.myColor === 'white' ? '#f5f0e8' : '#1a1a2e', borderColor: '#d4a84b' }} />
                  <span className="text-amber-400 font-semibold capitalize">{mp.myColor}</span>
                </div>

                {/* Waiting dots (only when no opponent yet) */}
                {!bothReady && (
                  <div className="flex justify-center gap-1.5 pt-1">
                    {[0, 1, 2].map((i) => (
                      <motion.div key={i} animate={{ y: [0, -6, 0] }} transition={{ duration: 0.8, delay: i * 0.2, repeat: Infinity }} className="w-1.5 h-1.5 rounded-full" style={{ background: 'rgba(212,168,75,0.4)' }} />
                    ))}
                  </div>
                )}

                {/* Start button — только у создателя комнаты когда оппонент подключился */}
                {bothReady && !isJoiner && (
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleStartGame}
                    className="w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
                    style={{ background: 'linear-gradient(135deg, #d4a84b, #b8860b)', color: '#1a1a2e' }}
                  >
                    Start Game →
                  </motion.button>
                )}

                {/* Joiner видит кнопку тоже — игра стартует у обоих */}
                {bothReady && isJoiner && (
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleStartGame}
                    className="w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
                    style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)', color: '#fff' }}
                  >
                    Ready to Play →
                  </motion.button>
                )}

                <button
                  onClick={() => { mp.disconnect(); setScreen('menu'); setRoomId(''); }}
                  className="text-center text-xs text-amber-500/30 hover:text-amber-500/60 transition-colors"
                >
                  Cancel
                </button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </motion.div>
    </Overlay>
  );
}

function BigButton({ icon, title, subtitle, onClick, color }: { icon: React.ReactNode; title: string; subtitle: string; onClick: () => void; color: string }) {
  return (
    <motion.button whileTap={{ scale: 0.98 }} whileHover={{ scale: 1.01 }} onClick={onClick} className="w-full p-4 rounded-xl flex items-center gap-3 text-left transition-all" style={{ background: `${color}12`, border: `1px solid ${color}33` }}>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${color}22`, color }}>{icon}</div>
      <div>
        <div className="text-sm font-bold" style={{ color }}>{title}</div>
        <div className="text-[11px] text-amber-500/50 mt-0.5">{subtitle}</div>
      </div>
      <ArrowRight size={14} className="ml-auto" style={{ color: `${color}60` }} />
    </motion.button>
  );
}

function ErrorBox({ message }: { message: string }) {
  return (
    <div className="p-3 rounded-lg text-xs text-red-300" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
      {message}
    </div>
  );
}