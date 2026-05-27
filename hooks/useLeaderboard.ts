// 'use client';

// import { LeaderboardEntry } from '@/lib/types';

// const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// export function useLeaderboard() {
//   const fetchTopPlayers = async (): Promise<LeaderboardEntry[]> => {
//     try {
//       const res = await fetch(`${API_URL}/api/leaderboard`);
//       if (!res.ok) throw new Error('Failed to fetch leaderboard');
//       const data = await res.json();
//       return data.map((entry: any, index: number) => ({
//         rank: entry.rank || index + 1,
//         name: entry.username,
//         wins: entry.wins,
//         winRate: entry.win_rate,
//         isPro: entry.is_pro,
//       }));
//     } catch (error) {
//       console.error('Leaderboard error:', error);
//       return [];
//     }
//   };

//   const submitWin = async (winnerId: string, loserId: string): Promise<void> => {
//     try {
//       await fetch(`${API_URL}/api/leaderboard/update-stats`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ winnerId, loserId }),
//       });
//     } catch (error) {
//       console.error('Submit win error:', error);
//     }
//   };

//   return { fetchTopPlayers, submitWin };
// }



'use client';

import { LeaderboardEntry } from '@/lib/types';
import { STUB_LEADERBOARD } from '@/lib/store';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export function useLeaderboard() {
  const fetchTopPlayers = async (city?: string): Promise<LeaderboardEntry[]> => {
    try {
      const url = city
        ? `${API_URL}/api/leaderboard?city=${encodeURIComponent(city)}`
        : `${API_URL}/api/leaderboard`;

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 3000);

      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeout);

      if (!res.ok) throw new Error('Failed to fetch leaderboard');
      const data = await res.json();

      if (!Array.isArray(data) || data.length === 0) return STUB_LEADERBOARD;

      return data.map((entry: any, index: number) => ({
        rank: entry.rank || index + 1,
        name: entry.username || entry.name,
        wins: entry.total_wins ?? entry.wins ?? 0,
        winRate: entry.win_rate ?? entry.winRate ?? 0,
        isPro: entry.is_pro ?? entry.isPro ?? false,
        city: entry.city,
      }));
    } catch (error) {
      // Бэк недоступен — показываем стаб-данные
      return STUB_LEADERBOARD;
    }
  };

  const submitWin = async (winnerId: string, loserId: string): Promise<void> => {
    try {
      await fetch(`${API_URL}/api/leaderboard/update-stats`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ winnerId, loserId }),
      });
    } catch (error) {
      console.error('Submit win error:', error);
    }
  };

  return { fetchTopPlayers, submitWin };
}