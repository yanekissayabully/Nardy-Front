// 'use client';

// import { useState, useEffect } from 'react';

// const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// interface User {
//   id: string;
//   email: string;
//   username: string;
//   isPro: boolean;
// }

// export function useAuth() {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   // Проверяем сохранённую сессию при загрузке
//   useEffect(() => {
//     const token = localStorage.getItem('supabase_token');
//     if (token) {
//       fetchUser(token);
//     }
//   }, []);

//   const fetchUser = async (token: string) => {
//     try {
//       const res = await fetch(`${API_URL}/api/auth/me`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = await res.json();
//       if (res.ok && data.user) {
//         setUser(data.user);
//       } else {
//         localStorage.removeItem('supabase_token');
//       }
//     } catch (err) {
//       console.error('Fetch user error:', err);
//       localStorage.removeItem('supabase_token');
//     }
//   };

//   const login = async (email: string, password: string) => {
//     setLoading(true);
//     setError(null);

//     try {
//       const res = await fetch(`${API_URL}/api/auth/login`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email, password }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data.error || 'Login failed');
//       }

//       if (data.session?.access_token) {
//         localStorage.setItem('supabase_token', data.session.access_token);
//       }

//       setUser(data.user);
//       return { success: true };
//     } catch (err: any) {
//       setError(err.message);
//       return { success: false, error: err.message };
//     } finally {
//       setLoading(false);
//     }
//   };

//   const register = async (email: string, password: string, username: string) => {
//     setLoading(true);
//     setError(null);

//     try {
//       // Шаг 1: Регистрация
//       const registerRes = await fetch(`${API_URL}/api/auth/register`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email, password, username }),
//       });

//       const registerData = await registerRes.json();
//       console.log('Register response:', registerData);

//       if (!registerRes.ok) {
//         throw new Error(registerData.error || 'Registration failed');
//       }

//       // Если сессия есть сразу (email confirmation отключён в Supabase)
//       if (registerData.session?.access_token) {
//         localStorage.setItem('supabase_token', registerData.session.access_token);
//         setUser(registerData.user);
//         return { success: true };
//       }

//       // Шаг 2: Если сессии нет — сразу логинимся
//       // (это происходит когда Supabase требует email confirmation,
//       //  но мы хотим пустить пользователя сразу)
//       console.log('No session after register, attempting auto-login...');
//       const loginRes = await fetch(`${API_URL}/api/auth/login`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email, password }),
//       });

//       const loginData = await loginRes.json();
//       console.log('Auto-login response:', loginData);

//       if (!loginRes.ok) {
//         // Регистрация прошла, но логин не удался (возможно нужно подтвердить email)
//         // Всё равно показываем успех регистрации
//         return { 
//           success: true, 
//           needsEmailConfirmation: true,
//           message: 'Account created! Please check your email to confirm your account.'
//         };
//       }

//       if (loginData.session?.access_token) {
//         localStorage.setItem('supabase_token', loginData.session.access_token);
//       }

//       setUser(loginData.user);
//       return { success: true };
//     } catch (err: any) {
//       console.error('Register error:', err);
//       setError(err.message);
//       return { success: false, error: err.message };
//     } finally {
//       setLoading(false);
//     }
//   };

//   const logout = async () => {
//     try {
//       await fetch(`${API_URL}/api/auth/logout`, { method: 'POST' });
//     } catch (err) {
//       console.error('Logout error:', err);
//     }
//     localStorage.removeItem('supabase_token');
//     setUser(null);
//   };

//   return { user, loading, error, login, register, logout };
// }


'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export function useAuth() {
  const user = useAppStore((s) => s.currentUser);
  const setCurrentUser = useAppStore((s) => s.setCurrentUser);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Восстанавливаем сессию при первом монтировании — только если user ещё не загружен
  useEffect(() => {
    if (user) return; // уже есть — не трогаем
    const token = localStorage.getItem('supabase_token');
    if (token) {
      fetchUser(token);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchUser = async (token: string) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.user) {
        setCurrentUser(data.user);
      } else {
        localStorage.removeItem('supabase_token');
      }
    } catch (err) {
      console.error('Fetch user error:', err);
      localStorage.removeItem('supabase_token');
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      if (data.session?.access_token) {
        localStorage.setItem('supabase_token', data.session.access_token);
      }
      setCurrentUser(data.user);
      return { success: true };
    } catch (err: any) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, username: string) => {
    setLoading(true);
    setError(null);
    try {
      const registerRes = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, username }),
      });
      const registerData = await registerRes.json();
      if (!registerRes.ok) throw new Error(registerData.error || 'Registration failed');

      // Если сессия пришла сразу (email confirmation отключён)
      if (registerData.session?.access_token) {
        localStorage.setItem('supabase_token', registerData.session.access_token);
        setCurrentUser(registerData.user);
        return { success: true };
      }

      // Иначе — автологин
      const loginRes = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const loginData = await loginRes.json();

      if (!loginRes.ok) {
        return { success: true, needsEmailConfirmation: true };
      }
      if (loginData.session?.access_token) {
        localStorage.setItem('supabase_token', loginData.session.access_token);
      }
      setCurrentUser(loginData.user);
      return { success: true };
    } catch (err: any) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fetch(`${API_URL}/api/auth/logout`, { method: 'POST' });
    } catch {}
    localStorage.removeItem('supabase_token');
    setCurrentUser(null);
  };

  return { user, loading, error, login, register, logout };
}