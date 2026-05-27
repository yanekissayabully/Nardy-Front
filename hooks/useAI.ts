'use client';

import { useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface AnalysisResult {
  advice: string;
  detailedAnalysis: Array<{
    moveNumber: number;
    mistake: string;
    betterMove: string;
    reason: string;
  }>;
  keyLearnings: string[];
}

export function useAI() {
  const [isLoading, setIsLoading] = useState(false);

  const getCoachAdvice = async (gameLog: any, winner: string, loser: string): Promise<string> => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/ai/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameLog, winner, loser }),
      });
      
      const data: AnalysisResult = await res.json();
      return data.advice || data.keyLearnings?.join(' ') || 'Keep practicing! Focus on building primes.';
    } catch (error) {
      console.error('AI analysis error:', error);
      return 'Build a prime (6 consecutive blocked points) and avoid leaving blots in your home board.';
    } finally {
      setIsLoading(false);
    }
  };

  const getDetailedAnalysis = async (gameLog: any, winner: string, loser: string): Promise<AnalysisResult | null> => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/ai/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameLog, winner, loser }),
      });
      
      return await res.json();
    } catch (error) {
      console.error('AI analysis error:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { getCoachAdvice, getDetailedAnalysis, isLoading };
}