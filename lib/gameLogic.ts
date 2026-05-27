import { Color, GameState, MoveRecord, Point } from './types';

// Long Backgammon (Длинные Нарды) rules:
// White moves from point 24 → 1 (decreasing index direction)
// Black moves from point 1 → 24 (increasing index direction)
// Points are 1-indexed in display, 0-indexed internally
// White starts at point 24 (index 23), Black starts at point 1 (index 0)
// No hitting: you cannot land on a point that already has opponent pieces
// Blocking: you cannot pass through a point occupied by 2+ opponent pieces

const TOTAL_CHECKERS = 15;

export function createInitialState(): GameState {
  const points: Point[] = Array.from({ length: 24 }, () => ({ color: null, count: 0 }));

  // Long backgammon start: all 15 white checkers on point 24 (index 23)
  points[23] = { color: 'white', count: 15 };
  // All 15 black checkers on point 1 (index 0)
  points[0] = { color: 'black', count: 15 };

  return {
    points,
    bar: { white: 0, black: 0 },
    bornOff: { white: 0, black: 0 },
    currentPlayer: 'white',
    dice: [],
    movesLeft: [],
    gamePhase: 'rolling',
    winner: null,
    selectedPoint: null,
    validMoves: [],
    moveHistory: [],
    isRolling: false,
  };
}

export function rollDice(): number[] {
  const d1 = Math.ceil(Math.random() * 6);
  const d2 = Math.ceil(Math.random() * 6);
  return d1 === d2 ? [d1, d1, d1, d1] : [d1, d2];
}

// Direction: white moves toward lower indices, black toward higher
export function getDirection(player: Color): number {
  return player === 'white' ? -1 : 1;
}

export function getHomeRange(player: Color): [number, number] {
  // white home: points 1-6 (indices 0-5), black home: points 19-24 (indices 18-23)
  return player === 'white' ? [0, 5] : [18, 23];
}

// Check if all checkers are in home board
export function allInHome(state: GameState, player: Color): boolean {
  if (state.bar[player] > 0) return false;
  const [homeStart, homeEnd] = getHomeRange(player);
  for (let i = 0; i < 24; i++) {
    if (i < homeStart || i > homeEnd) {
      if (state.points[i].color === player && state.points[i].count > 0) {
        return false;
      }
    }
  }
  return true;
}

export function getValidMoves(
  state: GameState,
  fromIndex: number, // -1 means bar
  die: number
): number[] {
  const player = state.currentPlayer;
  const dir = getDirection(player);
  const valid: number[] = [];

  if (fromIndex === -1) {
    // Moving from bar
    // White re-enters at opponent's side: white bar-entry at points 19-24 (indices 18-23)
    // Black re-enters at points 1-6 (indices 0-5)
    const entryIndex = player === 'white' ? (24 - die) : (die - 1);
    if (entryIndex >= 0 && entryIndex < 24) {
      const pt = state.points[entryIndex];
      if (pt.color !== (player === 'white' ? 'black' : 'white') || pt.count < 2) {
        valid.push(entryIndex);
      }
    }
    return valid;
  }

  const targetIndex = fromIndex + dir * die;

  if (allInHome(state, player)) {
    // Bearing off
    const [homeStart, homeEnd] = getHomeRange(player);
    if (targetIndex < 0 || targetIndex > 23) {
      // Check exact or highest pip
      valid.push(-2); // -2 means bornOff
      return valid;
    }
    // Also allow bearing off if no checker further back
    const exactOk = targetIndex < homeStart || targetIndex > homeEnd;
    if (!exactOk) {
      const pt = state.points[targetIndex];
      if (!pt.color || pt.color === player || pt.count < 2) {
        valid.push(targetIndex);
      }
    }
    return valid;
  }

  if (targetIndex < 0 || targetIndex > 23) return valid;

  const pt = state.points[targetIndex];
  // In long backgammon: cannot land on any point with opponent checker (not just 2+)
  // BUT: cannot PASS THROUGH a point blocked by 2+ opponents
  if (pt.color === (player === 'white' ? 'black' : 'white') && pt.count >= 1) {
    return valid; // cannot land on opponent
  }

  // Check path is not blocked by 2+ opponent checkers
  // (for die values > 1 we check intermediate points)
  const opponent: Color = player === 'white' ? 'black' : 'white';
  for (let step = 1; step < die; step++) {
    const intermediate = fromIndex + dir * step;
    if (intermediate >= 0 && intermediate < 24) {
      const ipt = state.points[intermediate];
      if (ipt.color === opponent && ipt.count >= 2) {
        return valid; // path blocked
      }
    }
  }

  valid.push(targetIndex);
  return valid;
}

export function getAllValidMovesForDie(
  state: GameState,
  die: number
): Array<{ from: number; to: number }> {
  const player = state.currentPlayer;
  const moves: Array<{ from: number; to: number }> = [];

  if (state.bar[player] > 0) {
    const tos = getValidMoves(state, -1, die);
    tos.forEach((to) => moves.push({ from: -1, to }));
    return moves;
  }

  for (let i = 0; i < 24; i++) {
    if (state.points[i].color === player && state.points[i].count > 0) {
      const tos = getValidMoves(state, i, die);
      tos.forEach((to) => moves.push({ from: i, to }));
    }
  }
  return moves;
}

export function hasAnyMove(state: GameState): boolean {
  for (const die of state.movesLeft) {
    if (getAllValidMovesForDie(state, die).length > 0) return true;
  }
  return false;
}

export function applyMove(
  state: GameState,
  fromIndex: number, // -1 = bar
  toIndex: number,   // -2 = bornOff
  die: number
): GameState {
  const newState = deepCloneState(state);
  const player = newState.currentPlayer;

  // Remove from source
  if (fromIndex === -1) {
    newState.bar[player]--;
  } else {
    newState.points[fromIndex].count--;
    if (newState.points[fromIndex].count === 0) {
      newState.points[fromIndex].color = null;
    }
  }

  // Place at destination
  if (toIndex === -2) {
    newState.bornOff[player]++;
  } else {
    const pt = newState.points[toIndex];
    pt.color = player;
    pt.count++;
  }

  // Record move
  const record: MoveRecord = {
    player,
    from: fromIndex === -1 ? 'bar' : fromIndex,
    to: toIndex === -2 ? 'bornOff' : toIndex,
    dieUsed: die,
    timestamp: Date.now(),
  };
  newState.moveHistory = [...newState.moveHistory, record];

  // Remove used die
  const dieIdx = newState.movesLeft.indexOf(die);
  if (dieIdx !== -1) newState.movesLeft.splice(dieIdx, 1);

  // Check win
  if (newState.bornOff[player] === TOTAL_CHECKERS) {
    newState.gamePhase = 'gameover';
    newState.winner = player;
    newState.selectedPoint = null;
    newState.validMoves = [];
    return newState;
  }

  // Check if moves remain
  if (newState.movesLeft.length === 0 || !hasAnyMove(newState)) {
    // Switch player
    newState.currentPlayer = player === 'white' ? 'black' : 'white';
    newState.movesLeft = [];
    newState.gamePhase = 'rolling';
  }

  newState.selectedPoint = null;
  newState.validMoves = [];

  return newState;
}

export function selectPoint(state: GameState, pointIndex: number): GameState {
  const newState = deepCloneState(state);
  const player = newState.currentPlayer;

  if (newState.gamePhase !== 'moving') return newState;

  // If a destination is clicked
  if (newState.selectedPoint !== null && newState.validMoves.includes(pointIndex)) {
    const from = newState.selectedPoint;
    const to = pointIndex;

    // Find which die to use
    const dir = getDirection(player);
    let dieToUse: number | null = null;
    if (from === -1) {
      // From bar
      const entryIndex = player === 'white' ? (24 - to - 1) : to;
      // Actually: white bar entry at index = 24 - die → die = 24 - index
      const dieNeeded = player === 'white' ? (24 - to) : (to + 1);
      if (newState.movesLeft.includes(dieNeeded)) dieToUse = dieNeeded;
    } else if (to === -2) {
      // Bearing off - find smallest usable die
      const [homeStart, homeEnd] = getHomeRange(player);
      for (const d of [...newState.movesLeft].sort((a, b) => a - b)) {
        const target = from + dir * d;
        if (target < 0 || target > 23) { dieToUse = d; break; }
      }
      if (!dieToUse) {
        for (const d of [...newState.movesLeft].sort((a, b) => b - a)) {
          dieToUse = d; break;
        }
      }
    } else {
      const needed = Math.abs(to - from);
      if (newState.movesLeft.includes(needed)) dieToUse = needed;
    }

    if (dieToUse !== null) {
      return applyMove(newState, from, to, dieToUse);
    }
  }

  // Select a piece
  const isBarSelected = pointIndex === -1;
  const hasPiece = isBarSelected
    ? newState.bar[player] > 0
    : (newState.points[pointIndex]?.color === player && newState.points[pointIndex]?.count > 0);

  if (!hasPiece) {
    newState.selectedPoint = null;
    newState.validMoves = [];
    return newState;
  }

  newState.selectedPoint = pointIndex;

  // Collect all valid destinations across all dice
  const allValid = new Set<number>();
  const uniqueDice = [...new Set(newState.movesLeft)];
  for (const die of uniqueDice) {
    const moves = getValidMoves(newState, pointIndex, die);
    moves.forEach((m) => allValid.add(m));
  }
  newState.validMoves = [...allValid];

  return newState;
}

export function skipTurn(state: GameState): GameState {
  const newState = deepCloneState(state);
  newState.currentPlayer = newState.currentPlayer === 'white' ? 'black' : 'white';
  newState.movesLeft = [];
  newState.gamePhase = 'rolling';
  newState.selectedPoint = null;
  newState.validMoves = [];
  return newState;
}

function deepCloneState(state: GameState): GameState {
  return {
    ...state,
    points: state.points.map((p) => ({ ...p })),
    bar: { ...state.bar },
    bornOff: { ...state.bornOff },
    dice: [...state.dice],
    movesLeft: [...state.movesLeft],
    validMoves: [...state.validMoves],
    moveHistory: [...state.moveHistory],
  };
}
