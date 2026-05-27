'use client';

import { LeaderboardEntry } from '@/lib/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export function useLeaderboard() {
  const fetchTopPlayers = async (): Promise<LeaderboardEntry[]> => {
    try {
      const res = await fetch(`${API_URL}/api/leaderboard`);
      if (!res.ok) throw new Error('Failed to fetch leaderboard');
      const data = await res.json();
      return data.map((entry: any, index: number) => ({
        rank: entry.rank || index + 1,
        name: entry.username,
        wins: entry.wins,
        winRate: entry.win_rate,
        isPro: entry.is_pro,
      }));
    } catch (error) {
      console.error('Leaderboard error:', error);
      return [];
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