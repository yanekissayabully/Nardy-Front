// 'use client';

// import { create } from 'zustand';
// import { persist } from 'zustand/middleware';
// import {
//   GameState,
//   Skin,
//   PlayerStats,
//   LeaderboardEntry,
// } from './types';
// import {
//   createInitialState,
//   rollDice,
//   selectPoint,
//   skipTurn,
//   hasAnyMove,
// } from './gameLogic';

// // ---------- Skins ----------
// export const SKINS: Skin[] = [
//   { id: 'classic', name: 'Classic', white: '#f5f0e8', black: '#1a1a2e', isPremium: false },
//   { id: 'amber', name: 'Amber & Onyx', white: '#f59e0b', black: '#1f2937', isPremium: false },
//   { id: 'jade', name: 'Jade & Ivory', white: '#fafafa', black: '#065f46', isPremium: true },
//   { id: 'ruby', name: 'Ruby & Gold', white: '#d97706', black: '#7f1d1d', isPremium: true },
//   { id: 'sapphire', name: 'Sapphire & Pearl', white: '#e2e8f0', black: '#1e3a8a', isPremium: true },
// ];

// // ---------- Leaderboard stub data ----------
// export const STUB_LEADERBOARD: LeaderboardEntry[] = [
//   { rank: 1, name: 'GreatMaster', wins: 1842, winRate: 71, isPro: true },
//   { rank: 2, name: 'SultanOfDice', wins: 1605, winRate: 68, isPro: true },
//   { rank: 3, name: 'BackgammonKing', wins: 1401, winRate: 65, isPro: true },
//   { rank: 4, name: 'TavlaChamp', wins: 1288, winRate: 62, isPro: false },
//   { rank: 5, name: 'NardiPro', wins: 1102, winRate: 60, isPro: true },
//   { rank: 6, name: 'DiceRoller99', wins: 987, winRate: 57, isPro: false },
//   { rank: 7, name: 'RedPointR', wins: 856, winRate: 55, isPro: false },
//   { rank: 8, name: 'BlockMaster', wins: 801, winRate: 53, isPro: true },
//   { rank: 9, name: 'Checkergirl', wins: 745, winRate: 51, isPro: false },
//   { rank: 10, name: 'BoardWizard', wins: 698, winRate: 49, isPro: false },
// ];

// interface AppState {
//   // Game
//   game: GameState;
//   savedGame: GameState | null;
//   theme: 'dark' | 'light';
//   activeSkinId: string;
//   stats: PlayerStats;
//   isPro: boolean;
//   // Settings
//   soundEnabled: boolean;
//   animationsEnabled: boolean;
//   aiDifficulty: 'easy' | 'medium' | 'hard';
//   // UI panels
//   showMoveHistory: boolean;
//   showLeaderboard: boolean;
//   showAuth: boolean;
//   showSkinShop: boolean;
//   showSettings: boolean;
//   showCoach: boolean;
//   coachAdvice: string;

//   // Actions
//   newGame: () => void;
//   rollDiceAction: () => void;
//   selectPointAction: (pointIndex: number) => void;
//   skipTurnAction: () => void;
//   saveGame: () => void;
//   loadGame: () => void;
//   toggleTheme: () => void;
//   setSkin: (id: string) => void;
//   setPanel: (panel: 'history' | 'leaderboard' | 'auth' | 'skinShop' | 'settings' | 'coach', open: boolean) => void;
//   setSoundEnabled: (v: boolean) => void;
//   setAnimationsEnabled: (v: boolean) => void;
//   setAiDifficulty: (v: 'easy' | 'medium' | 'hard') => void;
//   setCoachAdvice: (text: string) => void;
// }

// export const useAppStore = create<AppState>()(
//   persist(
//     (set, get) => ({
//       game: createInitialState(),
//       savedGame: null,
//       theme: 'dark',
//       activeSkinId: 'classic',
//       stats: { wins: 0, losses: 0, gamesPlayed: 0 },
//       isPro: false,
//       soundEnabled: true,
//       animationsEnabled: true,
//       aiDifficulty: 'medium',
//       showMoveHistory: false,
//       showLeaderboard: false,
//       showAuth: false,
//       showSkinShop: false,
//       showSettings: false,
//       showCoach: false,
//       coachAdvice: '',

//       newGame: () => set({ game: createInitialState() }),

//       rollDiceAction: () => {
//         const { game } = get();
//         if (game.gamePhase !== 'rolling') return;
//         const dice = rollDice();
//         const movesLeft = [...dice];
//         const newGame: GameState = {
//           ...game,
//           dice,
//           movesLeft,
//           gamePhase: 'moving',
//           isRolling: true,
//         };
//         // Check immediately if any move is possible
//         set({ game: newGame });
//         setTimeout(() => {
//           set((s) => ({ game: { ...s.game, isRolling: false } }));
//           // If no moves, auto-skip
//           const g = get().game;
//           if (!hasAnyMove(g)) {
//             setTimeout(() => {
//               set((s) => ({ game: skipTurn(s.game) }));
//             }, 1200);
//           }
//         }, 900);
//       },

//       selectPointAction: (pointIndex: number) => {
//         const { game } = get();
//         if (game.gamePhase !== 'moving') return;
//         const newGame = selectPoint(game, pointIndex);
//         // Check for game over
//         if (newGame.gamePhase === 'gameover') {
//           const winner = newGame.winner!;
//           set((s) => ({
//             game: newGame,
//             stats: {
//               ...s.stats,
//               wins: s.stats.wins + (winner === 'white' ? 1 : 0),
//               losses: s.stats.losses + (winner === 'black' ? 1 : 0),
//               gamesPlayed: s.stats.gamesPlayed + 1,
//             },
//             showCoach: true,
//             coachAdvice: winner === 'white'
//               ? 'Outstanding! You controlled the board perfectly. Keep applying aggressive blocking strategies.'
//               : 'Good effort! Focus on building prime blockades early in the game. Study your opponent\'s pip count.',
//           }));
//           return;
//         }
//         set({ game: newGame });
//       },

//       skipTurnAction: () => set((s) => ({ game: skipTurn(s.game) })),

//       saveGame: () => set((s) => ({ savedGame: s.game })),

//       loadGame: () => {
//         const { savedGame } = get();
//         if (savedGame) set({ game: savedGame });
//       },

//       toggleTheme: () =>
//         set((s) => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),

//       setSkin: (id: string) => set({ activeSkinId: id }),

//       setPanel: (panel, open) => {
//         const map: Record<string, keyof AppState> = {
//           history: 'showMoveHistory',
//           leaderboard: 'showLeaderboard',
//           auth: 'showAuth',
//           skinShop: 'showSkinShop',
//           settings: 'showSettings',
//           coach: 'showCoach',
//         };
//         set({ [map[panel]]: open } as Partial<AppState>);
//       },

//       setSoundEnabled: (v) => set({ soundEnabled: v }),
//       setAnimationsEnabled: (v) => set({ animationsEnabled: v }),
//       setAiDifficulty: (v) => set({ aiDifficulty: v }),
//       setCoachAdvice: (text) => set({ coachAdvice: text }),
//     }),
//     {
//       name: 'nardy-storage',
//       partialize: (s) => ({
//         savedGame: s.savedGame,
//         theme: s.theme,
//         activeSkinId: s.activeSkinId,
//         stats: s.stats,
//         isPro: s.isPro,
//         soundEnabled: s.soundEnabled,
//         animationsEnabled: s.animationsEnabled,
//         aiDifficulty: s.aiDifficulty,
//       }),
//     }
//   )
// );



// 'use client';

// import { create } from 'zustand';
// import { persist } from 'zustand/middleware';
// import {
//   GameState,
//   Skin,
//   PlayerStats,
//   LeaderboardEntry,
// } from './types';
// import {
//   createInitialState,
//   rollDice,
//   selectPoint,
//   skipTurn,
//   hasAnyMove,
// } from './gameLogic';

// // ---------- Skins ----------
// export const SKINS: Skin[] = [
//   { id: 'classic', name: 'Classic', white: '#f5f0e8', black: '#1a1a2e', isPremium: false },
//   { id: 'amber', name: 'Amber & Onyx', white: '#f59e0b', black: '#1f2937', isPremium: false },
//   { id: 'jade', name: 'Jade & Ivory', white: '#fafafa', black: '#065f46', isPremium: true },
//   { id: 'ruby', name: 'Ruby & Gold', white: '#d97706', black: '#7f1d1d', isPremium: true },
//   { id: 'sapphire', name: 'Sapphire & Pearl', white: '#e2e8f0', black: '#1e3a8a', isPremium: true },
// ];

// // ---------- Leaderboard stub data ----------
// export const STUB_LEADERBOARD: LeaderboardEntry[] = [
//   { rank: 1, name: 'GreatMaster', wins: 1842, winRate: 71, isPro: true },
//   { rank: 2, name: 'SultanOfDice', wins: 1605, winRate: 68, isPro: true },
//   { rank: 3, name: 'BackgammonKing', wins: 1401, winRate: 65, isPro: true },
//   { rank: 4, name: 'TavlaChamp', wins: 1288, winRate: 62, isPro: false },
//   { rank: 5, name: 'NardiPro', wins: 1102, winRate: 60, isPro: true },
//   { rank: 6, name: 'DiceRoller99', wins: 987, winRate: 57, isPro: false },
//   { rank: 7, name: 'RedPointR', wins: 856, winRate: 55, isPro: false },
//   { rank: 8, name: 'BlockMaster', wins: 801, winRate: 53, isPro: true },
//   { rank: 9, name: 'Checkergirl', wins: 745, winRate: 51, isPro: false },
//   { rank: 10, name: 'BoardWizard', wins: 698, winRate: 49, isPro: false },
// ];

// export interface CurrentUser {
//   id: string;
//   email: string;
//   username: string;
//   isPro: boolean;
// }

// interface AppState {
//   // Auth
//   currentUser: CurrentUser | null;
//   // Game
//   game: GameState;
//   savedGame: GameState | null;
//   theme: 'dark' | 'light';
//   activeSkinId: string;
//   stats: PlayerStats;
//   isPro: boolean;
//   // Settings
//   soundEnabled: boolean;
//   animationsEnabled: boolean;
//   aiDifficulty: 'easy' | 'medium' | 'hard';
//   // UI panels
//   showMoveHistory: boolean;
//   showLeaderboard: boolean;
//   showAuth: boolean;
//   showSkinShop: boolean;
//   showSettings: boolean;
//   showCoach: boolean;
//   coachAdvice: string;

//   // Actions
//   setCurrentUser: (user: CurrentUser | null) => void;
//   newGame: () => void;
//   rollDiceAction: () => void;
//   selectPointAction: (pointIndex: number) => void;
//   skipTurnAction: () => void;
//   saveGame: () => void;
//   loadGame: () => void;
//   toggleTheme: () => void;
//   setSkin: (id: string) => void;
//   setPanel: (panel: 'history' | 'leaderboard' | 'auth' | 'skinShop' | 'settings' | 'coach', open: boolean) => void;
//   setSoundEnabled: (v: boolean) => void;
//   setAnimationsEnabled: (v: boolean) => void;
//   setAiDifficulty: (v: 'easy' | 'medium' | 'hard') => void;
//   setCoachAdvice: (text: string) => void;
// }

// export const useAppStore = create<AppState>()(
//   persist(
//     (set, get) => ({
//       currentUser: null,
//       game: createInitialState(),
//       savedGame: null,
//       theme: 'dark',
//       activeSkinId: 'classic',
//       stats: { wins: 0, losses: 0, gamesPlayed: 0 },
//       isPro: false,
//       soundEnabled: true,
//       animationsEnabled: true,
//       aiDifficulty: 'medium',
//       showMoveHistory: false,
//       showLeaderboard: false,
//       showAuth: false,
//       showSkinShop: false,
//       showSettings: false,
//       showCoach: false,
//       coachAdvice: '',

//       setCurrentUser: (user) => set({ currentUser: user }),

//       newGame: () => set({ game: createInitialState() }),

//       rollDiceAction: () => {
//         const { game } = get();
//         if (game.gamePhase !== 'rolling') return;
//         const dice = rollDice();
//         const movesLeft = [...dice];
//         const newGame: GameState = {
//           ...game,
//           dice,
//           movesLeft,
//           gamePhase: 'moving',
//           isRolling: true,
//         };
//         set({ game: newGame });
//         setTimeout(() => {
//           set((s) => ({ game: { ...s.game, isRolling: false } }));
//           const g = get().game;
//           if (!hasAnyMove(g)) {
//             setTimeout(() => {
//               set((s) => ({ game: skipTurn(s.game) }));
//             }, 1200);
//           }
//         }, 900);
//       },

//       selectPointAction: (pointIndex: number) => {
//         const { game } = get();
//         if (game.gamePhase !== 'moving') return;
//         const newGame = selectPoint(game, pointIndex);
//         if (newGame.gamePhase === 'gameover') {
//           const winner = newGame.winner!;
//           set((s) => ({
//             game: newGame,
//             stats: {
//               ...s.stats,
//               wins: s.stats.wins + (winner === 'white' ? 1 : 0),
//               losses: s.stats.losses + (winner === 'black' ? 1 : 0),
//               gamesPlayed: s.stats.gamesPlayed + 1,
//             },
//             showCoach: true,
//             coachAdvice: winner === 'white'
//               ? 'Outstanding! You controlled the board perfectly. Keep applying aggressive blocking strategies.'
//               : 'Good effort! Focus on building prime blockades early in the game. Study your opponent\'s pip count.',
//           }));
//           return;
//         }
//         set({ game: newGame });
//       },

//       skipTurnAction: () => set((s) => ({ game: skipTurn(s.game) })),

//       saveGame: () => set((s) => ({ savedGame: s.game })),

//       loadGame: () => {
//         const { savedGame } = get();
//         if (savedGame) set({ game: savedGame });
//       },

//       toggleTheme: () =>
//         set((s) => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),

//       setSkin: (id: string) => set({ activeSkinId: id }),

//       setPanel: (panel, open) => {
//         const map: Record<string, keyof AppState> = {
//           history: 'showMoveHistory',
//           leaderboard: 'showLeaderboard',
//           auth: 'showAuth',
//           skinShop: 'showSkinShop',
//           settings: 'showSettings',
//           coach: 'showCoach',
//         };
//         set({ [map[panel]]: open } as Partial<AppState>);
//       },

//       setSoundEnabled: (v) => set({ soundEnabled: v }),
//       setAnimationsEnabled: (v) => set({ animationsEnabled: v }),
//       setAiDifficulty: (v) => set({ aiDifficulty: v }),
//       setCoachAdvice: (text) => set({ coachAdvice: text }),
//     }),
//     {
//       name: 'nardy-storage',
//       partialize: (s) => ({
//         savedGame: s.savedGame,
//         theme: s.theme,
//         activeSkinId: s.activeSkinId,
//         stats: s.stats,
//         isPro: s.isPro,
//         soundEnabled: s.soundEnabled,
//         animationsEnabled: s.animationsEnabled,
//         aiDifficulty: s.aiDifficulty,
//         // currentUser намеренно НЕ персистим — восстанавливаем через токен
//       }),
//     }
//   )
// );



// 'use client';

// import { create } from 'zustand';
// import { persist } from 'zustand/middleware';
// import {
//   GameState,
//   Skin,
//   PlayerStats,
//   LeaderboardEntry,
// } from './types';
// import {
//   createInitialState,
//   rollDice,
//   selectPoint,
//   skipTurn,
//   hasAnyMove,
// } from './gameLogic';

// // ---------- Skins ----------
// export const SKINS: Skin[] = [
//   { id: 'classic', name: 'Classic', white: '#f5f0e8', black: '#1a1a2e', isPremium: false },
//   { id: 'amber', name: 'Amber & Onyx', white: '#f59e0b', black: '#1f2937', isPremium: false },
//   { id: 'jade', name: 'Jade & Ivory', white: '#fafafa', black: '#065f46', isPremium: true },
//   { id: 'ruby', name: 'Ruby & Gold', white: '#d97706', black: '#7f1d1d', isPremium: true },
//   { id: 'sapphire', name: 'Sapphire & Pearl', white: '#e2e8f0', black: '#1e3a8a', isPremium: true },
// ];

// // ---------- Leaderboard stub data ----------
// export const STUB_LEADERBOARD: LeaderboardEntry[] = [
//   { rank: 1, name: 'GreatMaster', wins: 1842, winRate: 71, isPro: true },
//   { rank: 2, name: 'SultanOfDice', wins: 1605, winRate: 68, isPro: true },
//   { rank: 3, name: 'BackgammonKing', wins: 1401, winRate: 65, isPro: true },
//   { rank: 4, name: 'TavlaChamp', wins: 1288, winRate: 62, isPro: false },
//   { rank: 5, name: 'NardiPro', wins: 1102, winRate: 60, isPro: true },
//   { rank: 6, name: 'DiceRoller99', wins: 987, winRate: 57, isPro: false },
//   { rank: 7, name: 'RedPointR', wins: 856, winRate: 55, isPro: false },
//   { rank: 8, name: 'BlockMaster', wins: 801, winRate: 53, isPro: true },
//   { rank: 9, name: 'Checkergirl', wins: 745, winRate: 51, isPro: false },
//   { rank: 10, name: 'BoardWizard', wins: 698, winRate: 49, isPro: false },
// ];

// interface AppState {
//   // Game
//   game: GameState;
//   savedGame: GameState | null;
//   theme: 'dark' | 'light';
//   activeSkinId: string;
//   stats: PlayerStats;
//   isPro: boolean;
//   // Settings
//   soundEnabled: boolean;
//   animationsEnabled: boolean;
//   aiDifficulty: 'easy' | 'medium' | 'hard';
//   // UI panels
//   showMoveHistory: boolean;
//   showLeaderboard: boolean;
//   showAuth: boolean;
//   showSkinShop: boolean;
//   showSettings: boolean;
//   showCoach: boolean;
//   coachAdvice: string;

//   // Actions
//   newGame: () => void;
//   rollDiceAction: () => void;
//   selectPointAction: (pointIndex: number) => void;
//   skipTurnAction: () => void;
//   saveGame: () => void;
//   loadGame: () => void;
//   toggleTheme: () => void;
//   setSkin: (id: string) => void;
//   setPanel: (panel: 'history' | 'leaderboard' | 'auth' | 'skinShop' | 'settings' | 'coach', open: boolean) => void;
//   setSoundEnabled: (v: boolean) => void;
//   setAnimationsEnabled: (v: boolean) => void;
//   setAiDifficulty: (v: 'easy' | 'medium' | 'hard') => void;
//   setCoachAdvice: (text: string) => void;
// }

// export const useAppStore = create<AppState>()(
//   persist(
//     (set, get) => ({
//       game: createInitialState(),
//       savedGame: null,
//       theme: 'dark',
//       activeSkinId: 'classic',
//       stats: { wins: 0, losses: 0, gamesPlayed: 0 },
//       isPro: false,
//       soundEnabled: true,
//       animationsEnabled: true,
//       aiDifficulty: 'medium',
//       showMoveHistory: false,
//       showLeaderboard: false,
//       showAuth: false,
//       showSkinShop: false,
//       showSettings: false,
//       showCoach: false,
//       coachAdvice: '',

//       newGame: () => set({ game: createInitialState() }),

//       rollDiceAction: () => {
//         const { game } = get();
//         if (game.gamePhase !== 'rolling') return;
//         const dice = rollDice();
//         const movesLeft = [...dice];
//         const newGame: GameState = {
//           ...game,
//           dice,
//           movesLeft,
//           gamePhase: 'moving',
//           isRolling: true,
//         };
//         // Check immediately if any move is possible
//         set({ game: newGame });
//         setTimeout(() => {
//           set((s) => ({ game: { ...s.game, isRolling: false } }));
//           // If no moves, auto-skip
//           const g = get().game;
//           if (!hasAnyMove(g)) {
//             setTimeout(() => {
//               set((s) => ({ game: skipTurn(s.game) }));
//             }, 1200);
//           }
//         }, 900);
//       },

//       selectPointAction: (pointIndex: number) => {
//         const { game } = get();
//         if (game.gamePhase !== 'moving') return;
//         const newGame = selectPoint(game, pointIndex);
//         // Check for game over
//         if (newGame.gamePhase === 'gameover') {
//           const winner = newGame.winner!;
//           set((s) => ({
//             game: newGame,
//             stats: {
//               ...s.stats,
//               wins: s.stats.wins + (winner === 'white' ? 1 : 0),
//               losses: s.stats.losses + (winner === 'black' ? 1 : 0),
//               gamesPlayed: s.stats.gamesPlayed + 1,
//             },
//             showCoach: true,
//             coachAdvice: winner === 'white'
//               ? 'Outstanding! You controlled the board perfectly. Keep applying aggressive blocking strategies.'
//               : 'Good effort! Focus on building prime blockades early in the game. Study your opponent\'s pip count.',
//           }));
//           return;
//         }
//         set({ game: newGame });
//       },

//       skipTurnAction: () => set((s) => ({ game: skipTurn(s.game) })),

//       saveGame: () => set((s) => ({ savedGame: s.game })),

//       loadGame: () => {
//         const { savedGame } = get();
//         if (savedGame) set({ game: savedGame });
//       },

//       toggleTheme: () =>
//         set((s) => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),

//       setSkin: (id: string) => set({ activeSkinId: id }),

//       setPanel: (panel, open) => {
//         const map: Record<string, keyof AppState> = {
//           history: 'showMoveHistory',
//           leaderboard: 'showLeaderboard',
//           auth: 'showAuth',
//           skinShop: 'showSkinShop',
//           settings: 'showSettings',
//           coach: 'showCoach',
//         };
//         set({ [map[panel]]: open } as Partial<AppState>);
//       },

//       setSoundEnabled: (v) => set({ soundEnabled: v }),
//       setAnimationsEnabled: (v) => set({ animationsEnabled: v }),
//       setAiDifficulty: (v) => set({ aiDifficulty: v }),
//       setCoachAdvice: (text) => set({ coachAdvice: text }),
//     }),
//     {
//       name: 'nardy-storage',
//       partialize: (s) => ({
//         savedGame: s.savedGame,
//         theme: s.theme,
//         activeSkinId: s.activeSkinId,
//         stats: s.stats,
//         isPro: s.isPro,
//         soundEnabled: s.soundEnabled,
//         animationsEnabled: s.animationsEnabled,
//         aiDifficulty: s.aiDifficulty,
//       }),
//     }
//   )
// );



'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  GameState,
  Skin,
  PlayerStats,
  LeaderboardEntry,
} from './types';
import {
  createInitialState,
  rollDice,
  selectPoint,
  skipTurn,
  hasAnyMove,
} from './gameLogic';

// ---------- Skins ----------
export const SKINS: Skin[] = [
  { id: 'classic', name: 'Classic', white: '#f5f0e8', black: '#1a1a2e', isPremium: false },
  { id: 'amber', name: 'Amber & Onyx', white: '#f59e0b', black: '#1f2937', isPremium: false },
  { id: 'jade', name: 'Jade & Ivory', white: '#fafafa', black: '#065f46', isPremium: true },
  { id: 'ruby', name: 'Ruby & Gold', white: '#d97706', black: '#7f1d1d', isPremium: true },
  { id: 'sapphire', name: 'Sapphire & Pearl', white: '#e2e8f0', black: '#1e3a8a', isPremium: true },
];

// ---------- Leaderboard stub data ----------
export const STUB_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, name: 'GreatMaster', wins: 1842, winRate: 71, isPro: true },
  { rank: 2, name: 'SultanOfDice', wins: 1605, winRate: 68, isPro: true },
  { rank: 3, name: 'BackgammonKing', wins: 1401, winRate: 65, isPro: true },
  { rank: 4, name: 'TavlaChamp', wins: 1288, winRate: 62, isPro: false },
  { rank: 5, name: 'NardiPro', wins: 1102, winRate: 60, isPro: true },
  { rank: 6, name: 'DiceRoller99', wins: 987, winRate: 57, isPro: false },
  { rank: 7, name: 'RedPointR', wins: 856, winRate: 55, isPro: false },
  { rank: 8, name: 'BlockMaster', wins: 801, winRate: 53, isPro: true },
  { rank: 9, name: 'Checkergirl', wins: 745, winRate: 51, isPro: false },
  { rank: 10, name: 'BoardWizard', wins: 698, winRate: 49, isPro: false },
];

export interface CurrentUser {
  id: string;
  email: string;
  username: string;
  isPro: boolean;
}

interface AppState {
  // Auth
  currentUser: CurrentUser | null;
  // Game
  game: GameState;
  savedGame: GameState | null;
  theme: 'dark' | 'light';
  activeSkinId: string;
  stats: PlayerStats;
  isPro: boolean;
  // Settings
  soundEnabled: boolean;
  animationsEnabled: boolean;
  aiDifficulty: 'easy' | 'medium' | 'hard';
  // UI panels
  showMoveHistory: boolean;
  showLeaderboard: boolean;
  showAuth: boolean;
  showSkinShop: boolean;
  showSettings: boolean;
  showCoach: boolean;
  showMultiplayer: boolean;
  coachAdvice: string;

  // Actions
  setCurrentUser: (user: CurrentUser | null) => void;
  newGame: () => void;
  rollDiceAction: () => void;
  selectPointAction: (pointIndex: number) => void;
  skipTurnAction: () => void;
  saveGame: () => void;
  loadGame: () => void;
  toggleTheme: () => void;
  setSkin: (id: string) => void;
  setPanel: (panel: 'history' | 'leaderboard' | 'auth' | 'skinShop' | 'settings' | 'coach' | 'multiplayer', open: boolean) => void;
  setSoundEnabled: (v: boolean) => void;
  setAnimationsEnabled: (v: boolean) => void;
  setAiDifficulty: (v: 'easy' | 'medium' | 'hard') => void;
  setCoachAdvice: (text: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      game: createInitialState(),
      savedGame: null,
      theme: 'dark',
      activeSkinId: 'classic',
      stats: { wins: 0, losses: 0, gamesPlayed: 0 },
      isPro: false,
      soundEnabled: true,
      animationsEnabled: true,
      aiDifficulty: 'medium',
      showMoveHistory: false,
      showLeaderboard: false,
      showAuth: false,
      showSkinShop: false,
      showSettings: false,
      showCoach: false,
      showMultiplayer: false,
      coachAdvice: '',

      setCurrentUser: (user) => set({ currentUser: user }),

      newGame: () => set({ game: createInitialState() }),

      rollDiceAction: () => {
        const { game } = get();
        if (game.gamePhase !== 'rolling') return;
        const dice = rollDice();
        const movesLeft = [...dice];
        const newGame: GameState = {
          ...game,
          dice,
          movesLeft,
          gamePhase: 'moving',
          isRolling: true,
        };
        set({ game: newGame });
        setTimeout(() => {
          set((s) => ({ game: { ...s.game, isRolling: false } }));
          const g = get().game;
          if (!hasAnyMove(g)) {
            setTimeout(() => {
              set((s) => ({ game: skipTurn(s.game) }));
            }, 1200);
          }
        }, 900);
      },

      selectPointAction: (pointIndex: number) => {
        const { game } = get();
        if (game.gamePhase !== 'moving') return;
        const newGame = selectPoint(game, pointIndex);
        if (newGame.gamePhase === 'gameover') {
          const winner = newGame.winner!;
          set((s) => ({
            game: newGame,
            stats: {
              ...s.stats,
              wins: s.stats.wins + (winner === 'white' ? 1 : 0),
              losses: s.stats.losses + (winner === 'black' ? 1 : 0),
              gamesPlayed: s.stats.gamesPlayed + 1,
            },
            showCoach: true,
            coachAdvice: winner === 'white'
              ? 'Outstanding! You controlled the board perfectly. Keep applying aggressive blocking strategies.'
              : 'Good effort! Focus on building prime blockades early in the game. Study your opponent\'s pip count.',
          }));
          return;
        }
        set({ game: newGame });
      },

      skipTurnAction: () => set((s) => ({ game: skipTurn(s.game) })),

      saveGame: () => set((s) => ({ savedGame: s.game })),

      loadGame: () => {
        const { savedGame } = get();
        if (savedGame) set({ game: savedGame });
      },

      toggleTheme: () =>
        set((s) => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),

      setSkin: (id: string) => set({ activeSkinId: id }),

      setPanel: (panel, open) => {
        const map: Record<string, keyof AppState> = {
          history: 'showMoveHistory',
          leaderboard: 'showLeaderboard',
          auth: 'showAuth',
          skinShop: 'showSkinShop',
          settings: 'showSettings',
          coach: 'showCoach',
          multiplayer: 'showMultiplayer',
        };
        set({ [map[panel]]: open } as Partial<AppState>);
      },

      setSoundEnabled: (v) => set({ soundEnabled: v }),
      setAnimationsEnabled: (v) => set({ animationsEnabled: v }),
      setAiDifficulty: (v) => set({ aiDifficulty: v }),
      setCoachAdvice: (text) => set({ coachAdvice: text }),
    }),
    {
      name: 'nardy-storage',
      partialize: (s) => ({
        savedGame: s.savedGame,
        theme: s.theme,
        activeSkinId: s.activeSkinId,
        stats: s.stats,
        isPro: s.isPro,
        soundEnabled: s.soundEnabled,
        animationsEnabled: s.animationsEnabled,
        aiDifficulty: s.aiDifficulty,
        // currentUser намеренно НЕ персистим — восстанавливаем через токен
      }),
    }
  )
);