export type Board = number[][];

/** Legacy numbers-mode level ids (kept for typing/back-compat). */
export type Difficulty = 'easy' | 'medium' | 'hard' | 'profi' | 'master';

/**
 * Describes a sudoku grid shape. `size` is the edge length; boxes are
 * `boxRows` tall and `boxCols` wide (e.g. classic 9×9 uses 3×3 boxes, while a
 * kid-friendly 4×4 uses 2×2 boxes and 6×6 uses 2×3 boxes).
 */
export type GridSpec = {
  size: number;
  boxRows: number;
  boxCols: number;
};

export const DEFAULT_GRID: GridSpec = { size: 9, boxRows: 3, boxCols: 3 };

export function isGridSpec(value: unknown): value is GridSpec {
  if (!value || typeof value !== 'object') return false;
  const spec = value as Partial<GridSpec>;
  return (
    typeof spec.size === 'number' &&
    typeof spec.boxRows === 'number' &&
    typeof spec.boxCols === 'number' &&
    spec.size > 0 &&
    spec.boxRows > 0 &&
    spec.boxCols > 0 &&
    spec.size % spec.boxRows === 0 &&
    spec.size % spec.boxCols === 0
  );
}

export function createEmptyBoard(spec: GridSpec): Board {
  return Array.from({ length: spec.size }, () => Array(spec.size).fill(0));
}

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function cloneBoard(board: Board): Board {
  return board.map((row) => [...row]);
}

export function isValidPlacement(
  board: Board,
  row: number,
  col: number,
  value: number,
  spec: GridSpec,
): boolean {
  if (value === 0) return true;

  for (let i = 0; i < spec.size; i += 1) {
    if (board[row][i] === value && i !== col) return false;
    if (board[i][col] === value && i !== row) return false;
  }

  const boxRow = Math.floor(row / spec.boxRows) * spec.boxRows;
  const boxCol = Math.floor(col / spec.boxCols) * spec.boxCols;

  for (let r = boxRow; r < boxRow + spec.boxRows; r += 1) {
    for (let c = boxCol; c < boxCol + spec.boxCols; c += 1) {
      if (board[r][c] === value && (r !== row || c !== col)) return false;
    }
  }

  return true;
}

export function solveBoard(board: Board, spec: GridSpec): boolean {
  const values = Array.from({ length: spec.size }, (_, index) => index + 1);

  for (let row = 0; row < spec.size; row += 1) {
    for (let col = 0; col < spec.size; col += 1) {
      if (board[row][col] !== 0) continue;

      for (const value of shuffle(values)) {
        if (!isValidPlacement(board, row, col, value, spec)) continue;
        board[row][col] = value;
        if (solveBoard(board, spec)) return true;
        board[row][col] = 0;
      }

      return false;
    }
  }

  return true;
}

export function generateSolvedBoard(spec: GridSpec): Board {
  const board = createEmptyBoard(spec);
  solveBoard(board, spec);
  return board;
}

/**
 * Builds a puzzle by removing cells from a solved board until only `clues`
 * remain filled.
 */
export function generatePuzzle(
  spec: GridSpec,
  clues: number,
): { puzzle: Board; solution: Board } {
  const solution = generateSolvedBoard(spec);
  const puzzle = cloneBoard(solution);
  const total = spec.size * spec.size;
  const cells = shuffle(
    Array.from({ length: total }, (_, index) => ({
      row: Math.floor(index / spec.size),
      col: index % spec.size,
    })),
  );

  const targetClues = Math.max(1, Math.min(total, clues));
  let remaining = total;

  for (const { row, col } of cells) {
    if (remaining <= targetClues) break;
    puzzle[row][col] = 0;
    remaining -= 1;
  }

  return { puzzle, solution };
}

/** Marks only user-filled cells that do not match the solution. */
export function getIncorrectCells(board: Board, given: Board, solution: Board): Set<string> {
  const incorrect = new Set<string>();
  const size = board.length;

  for (let row = 0; row < size; row += 1) {
    for (let col = 0; col < size; col += 1) {
      const value = board[row][col];
      if (value === 0 || given[row][col] !== 0) continue;
      if (value !== solution[row][col]) {
        incorrect.add(`${row}-${col}`);
      }
    }
  }

  return incorrect;
}

export function isBoardComplete(board: Board, solution: Board): boolean {
  const size = board.length;
  for (let row = 0; row < size; row += 1) {
    for (let col = 0; col < size; col += 1) {
      if (board[row][col] !== solution[row][col]) return false;
    }
  }
  return true;
}

export function isBoxComplete(
  board: Board,
  solution: Board,
  row: number,
  col: number,
  spec: GridSpec,
): boolean {
  const boxRow = Math.floor(row / spec.boxRows) * spec.boxRows;
  const boxCol = Math.floor(col / spec.boxCols) * spec.boxCols;

  for (let r = boxRow; r < boxRow + spec.boxRows; r += 1) {
    for (let c = boxCol; c < boxCol + spec.boxCols; c += 1) {
      if (board[r][c] !== solution[r][c]) return false;
    }
  }
  return true;
}

export function isGivenCell(given: Board, row: number, col: number): boolean {
  return given[row][col] !== 0;
}

/** How many cells correctly show this symbol (given + user). */
export function countCorrectDigit(board: Board, solution: Board, digit: number): number {
  let count = 0;
  const size = board.length;
  for (let row = 0; row < size; row += 1) {
    for (let col = 0; col < size; col += 1) {
      if (solution[row][col] === digit && board[row][col] === digit) {
        count += 1;
      }
    }
  }
  return count;
}

/** True when this move finishes every placement of a symbol on the board. */
export function didCompleteDigit(
  previousBoard: Board,
  nextBoard: Board,
  solution: Board,
  digit: number,
): boolean {
  const size = solution.length;
  if (digit < 1 || digit > size) return false;
  return (
    countCorrectDigit(previousBoard, solution, digit) < size &&
    countCorrectDigit(nextBoard, solution, digit) >= size
  );
}

export type CheerEvent = {
  id: number;
  row: number;
  col: number;
  boxComplete: boolean;
};
