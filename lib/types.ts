export type Color = 'white' | 'black';

export interface Point {
  color: Color | null;
  count: number;
}

// 24 points (index 0=point1 ... 23=point24) + bar + bornOff
export interface GameState {
  points: Point[]; // length 24
  bar: { white: number; black: number };
  bornOff: { white: number; black: number };
  currentPlayer: Color;
  dice: number[];
  movesLeft: number[]; // remaining dice values to use
  gamePhase: 'rolling' | 'moving' | 'gameover';
  winner: Color | null;
  selectedPoint: number | null; // -1 = bar
  validMoves: number[]; // target points
  moveHistory: MoveRecord[];
  isRolling: boolean;
}

export interface MoveRecord {
  player: Color;
  from: number | 'bar';
  to: number | 'bornOff';
  dieUsed: number;
  timestamp: number;
}

export interface Skin {
  id: string;
  name: string;
  white: string;
  black: string;
  isPremium: boolean;
}

export interface PlayerStats {
  wins: number;
  losses: number;
  gamesPlayed: number;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  wins: number;
  winRate: number;
  isPro: boolean;
}
