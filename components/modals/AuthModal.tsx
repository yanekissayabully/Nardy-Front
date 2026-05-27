// 'use client';

// import { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { X, Mail, Lock, User, LogIn, UserPlus, CheckCircle } from 'lucide-react';
// import { useAuth } from '@/hooks/useAuth';
// import { useAppStore } from '@/lib/store';

// export function AuthModal() {
//   const setPanel = useAppStore((s) => s.setPanel);
//   const [mode, setMode] = useState<'login' | 'register'>('login');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [name, setName] = useState('');
//   const [localError, setLocalError] = useState<string | null>(null);
//   const [successMessage, setSuccessMessage] = useState<string | null>(null);
//   const { login, register, loading, error, user } = useAuth();

//   // Автоматически закрываем модалку при успешной авторизации
//   useEffect(() => {
//     if (user) {
//       console.log('✅ User authenticated, closing modal');
//       setTimeout(() => {
//         setPanel('auth', false);
//       }, 300);
//     }
//   }, [user, setPanel]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLocalError(null);
//     setSuccessMessage(null);

//     console.log('Submitting:', { mode, email, name });

//     let result: any;
//     if (mode === 'login') {
//       result = await login(email, password);
//     } else {
//       if (!name.trim()) {
//         setLocalError('Username is required');
//         return;
//       }
//       result = await register(email, password, name);
//     }

//     console.log('Auth result:', result);

//     if (result?.error) {
//       setLocalError(result.error);
//     } else if (result?.needsEmailConfirmation) {
//       setSuccessMessage('Account created! Please check your email to confirm, then sign in.');
//       setMode('login');
//       setPassword('');
//     }
//   };

//   const displayError = localError || error;

//   return (
//     <Overlay onClose={() => setPanel('auth', false)}>
//       <motion.div
//         initial={{ scale: 0.9, opacity: 0, y: 20 }}
//         animate={{ scale: 1, opacity: 1, y: 0 }}
//         exit={{ scale: 0.9, opacity: 0, y: 20 }}
//         transition={{ type: 'spring', stiffness: 300, damping: 25 }}
//         className="relative w-full max-w-sm"
//         style={{
//           background: 'linear-gradient(135deg, #0d2318, #0a1510)',
//           border: '1px solid rgba(212,168,75,0.3)',
//           borderRadius: 16,
//           padding: 32,
//         }}
//         onClick={(e) => e.stopPropagation()}
//       >
//         <button
//           onClick={() => setPanel('auth', false)}
//           className="absolute top-4 right-4 text-amber-500/50 hover:text-amber-300 transition-colors"
//         >
//           <X size={18} />
//         </button>

//         <div className="text-center mb-6">
//           <h2 className="text-xl font-bold text-amber-300 mb-1">
//             {mode === 'login' ? 'Sign In' : 'Create Account'}
//           </h2>
//           <p className="text-sm text-amber-500/60">
//             {mode === 'login' ? 'Welcome back, champion!' : 'Join the arena today'}
//           </p>
//         </div>

//         <div className="flex rounded-lg overflow-hidden mb-6" style={{ border: '1px solid rgba(212,168,75,0.2)' }}>
//           {(['login', 'register'] as const).map((m) => (
//             <button
//               key={m}
//               type="button"
//               onClick={() => {
//                 setMode(m);
//                 setLocalError(null);
//                 setSuccessMessage(null);
//               }}
//               className="flex-1 py-2 text-sm font-semibold transition-all"
//               style={{
//                 background: mode === m ? 'rgba(212,168,75,0.2)' : 'transparent',
//                 color: mode === m ? '#d4a84b' : 'rgba(212,168,75,0.4)',
//               }}
//             >
//               {m === 'login' ? 'Sign In' : 'Register'}
//             </button>
//           ))}
//         </div>

//         {successMessage && (
//           <div
//             className="flex items-start gap-2 mb-4 p-3 rounded-lg text-xs"
//             style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)' }}
//           >
//             <CheckCircle size={14} className="text-green-400 mt-0.5 shrink-0" />
//             <span className="text-green-300">{successMessage}</span>
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="flex flex-col gap-3">
//           {mode === 'register' && (
//             <InputField
//               icon={<User size={14} />}
//               placeholder="Display Name"
//               value={name}
//               onChange={setName}
//             />
//           )}
//           <InputField
//             icon={<Mail size={14} />}
//             placeholder="Email"
//             type="email"
//             value={email}
//             onChange={setEmail}
//           />
//           <InputField
//             icon={<Lock size={14} />}
//             placeholder="Password"
//             type="password"
//             value={password}
//             onChange={setPassword}
//           />

//           {displayError && (
//             <p className="text-red-400 text-xs text-center">{displayError}</p>
//           )}

//           <button
//             type="submit"
//             disabled={loading}
//             className="mt-2 py-3 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all active:scale-95"
//             style={{
//               background: loading ? 'rgba(212,168,75,0.3)' : 'linear-gradient(135deg, #d4a84b, #b8860b)',
//               color: loading ? 'rgba(255,255,255,0.5)' : '#1a1a2e',
//             }}
//           >
//             {loading ? (
//               <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
//             ) : mode === 'login' ? (
//               <><LogIn size={15} /> Sign In</>
//             ) : (
//               <><UserPlus size={15} /> Create Account</>
//             )}
//           </button>
//         </form>

//         <div className="text-center text-xs text-amber-500/40 mt-4">
//           <span>Join to track your stats and compete globally!</span>
//         </div>
//       </motion.div>
//     </Overlay>
//   );
// }

// function InputField({ icon, placeholder, type = 'text', value, onChange }: {
//   icon: React.ReactNode;
//   placeholder: string;
//   type?: string;
//   value: string;
//   onChange: (v: string) => void;
// }) {
//   return (
//     <div
//       className="flex items-center gap-2 px-3 py-2 rounded-lg"
//       style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(212,168,75,0.15)' }}
//     >
//       <span className="text-amber-500/50">{icon}</span>
//       <input
//         type={type}
//         placeholder={placeholder}
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//         className="flex-1 bg-transparent text-sm text-amber-100 placeholder-amber-500/30 outline-none"
//         required
//       />
//     </div>
//   );
// }

// export function Overlay({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       className="fixed inset-0 z-50 flex items-center justify-center p-4"
//       style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}
//       onClick={onClose}
//     >
//       {children}
//     </motion.div>
//   );
// }




'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Mail, Lock, User, LogIn, UserPlus, CheckCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useAppStore } from '@/lib/store';

export function AuthModal() {
  const setPanel = useAppStore((s) => s.setPanel);
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { login, register, loading, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setSuccessMessage(null);

    let result: any;
    if (mode === 'login') {
      result = await login(email, password);
    } else {
      if (!name.trim()) {
        setLocalError('Username is required');
        return;
      }
      result = await register(email, password, name);
    }

    if (result?.error) {
      setLocalError(result.error);
    } else if (result?.needsEmailConfirmation) {
      setSuccessMessage('Account created! Please check your email to confirm, then sign in.');
      setMode('login');
      setPassword('');
    } else if (result?.success) {
      // Успешно — закрываем модалку
      setPanel('auth', false);
    }
  };

  const displayError = localError || error;

  return (
    <Overlay onClose={() => setPanel('auth', false)}>
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
          padding: 32,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setPanel('auth', false)}
          className="absolute top-4 right-4 text-amber-500/50 hover:text-amber-300 transition-colors"
        >
          <X size={18} />
        </button>

        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-amber-300 mb-1">
            {mode === 'login' ? 'Sign In' : 'Create Account'}
          </h2>
          <p className="text-sm text-amber-500/60">
            {mode === 'login' ? 'Welcome back, champion!' : 'Join the arena today'}
          </p>
        </div>

        <div className="flex rounded-lg overflow-hidden mb-6" style={{ border: '1px solid rgba(212,168,75,0.2)' }}>
          {(['login', 'register'] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => {
                setMode(m);
                setLocalError(null);
                setSuccessMessage(null);
              }}
              className="flex-1 py-2 text-sm font-semibold transition-all"
              style={{
                background: mode === m ? 'rgba(212,168,75,0.2)' : 'transparent',
                color: mode === m ? '#d4a84b' : 'rgba(212,168,75,0.4)',
              }}
            >
              {m === 'login' ? 'Sign In' : 'Register'}
            </button>
          ))}
        </div>

        {successMessage && (
          <div
            className="flex items-start gap-2 mb-4 p-3 rounded-lg text-xs"
            style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)' }}
          >
            <CheckCircle size={14} className="text-green-400 mt-0.5 shrink-0" />
            <span className="text-green-300">{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {mode === 'register' && (
            <InputField
              icon={<User size={14} />}
              placeholder="Display Name"
              value={name}
              onChange={setName}
            />
          )}
          <InputField
            icon={<Mail size={14} />}
            placeholder="Email"
            type="email"
            value={email}
            onChange={setEmail}
          />
          <InputField
            icon={<Lock size={14} />}
            placeholder="Password"
            type="password"
            value={password}
            onChange={setPassword}
          />

          {displayError && (
            <p className="text-red-400 text-xs text-center">{displayError}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 py-3 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all active:scale-95"
            style={{
              background: loading ? 'rgba(212,168,75,0.3)' : 'linear-gradient(135deg, #d4a84b, #b8860b)',
              color: loading ? 'rgba(255,255,255,0.5)' : '#1a1a2e',
            }}
          >
            {loading ? (
              <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
            ) : mode === 'login' ? (
              <><LogIn size={15} /> Sign In</>
            ) : (
              <><UserPlus size={15} /> Create Account</>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-amber-500/40 mt-4">
          Join to track your stats and compete globally!
        </div>
      </motion.div>
    </Overlay>
  );
}

function InputField({ icon, placeholder, type = 'text', value, onChange }: {
  icon: React.ReactNode;
  placeholder: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div
      className="flex items-center gap-2 px-3 py-2 rounded-lg"
      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(212,168,75,0.15)' }}
    >
      <span className="text-amber-500/50">{icon}</span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 bg-transparent text-sm text-amber-100 placeholder-amber-500/30 outline-none"
        required
      />
    </div>
  );
}

export function Overlay({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      {children}
    </motion.div>
  );
}