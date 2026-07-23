export type Board = number[][];
export type Difficulty = 'easy' | 'medium' | 'hard' | 'profi' | 'master';

const SIZE = 9;
const BOX = 3;

/** Kid-friendly clue counts: early levels leave few empty cells. */
const CLUES: Record<Difficulty, number> = {
  easy: 54,
  medium: 46,
  hard: 38,
  profi: 32,
  master: 28,
};

export function createEmptyBoard(): Board {
  return Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
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

export function isValidPlacement(board: Board, row: number, col: number, value: number): boolean {
  if (value === 0) return true;

  for (let i = 0; i < SIZE; i += 1) {
    if (board[row][i] === value && i !== col) return false;
    if (board[i][col] === value && i !== row) return false;
  }

  const boxRow = Math.floor(row / BOX) * BOX;
  const boxCol = Math.floor(col / BOX) * BOX;

  for (let r = boxRow; r < boxRow + BOX; r += 1) {
    for (let c = boxCol; c < boxCol + BOX; c += 1) {
      if (board[r][c] === value && (r !== row || c !== col)) return false;
    }
  }

  return true;
}

export function solveBoard(board: Board): boolean {
  for (let row = 0; row < SIZE; row += 1) {
    for (let col = 0; col < SIZE; col += 1) {
      if (board[row][col] !== 0) continue;

      for (const value of shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9])) {
        if (!isValidPlacement(board, row, col, value)) continue;
        board[row][col] = value;
        if (solveBoard(board)) return true;
        board[row][col] = 0;
      }

      return false;
    }
  }

  return true;
}

export function generateSolvedBoard(): Board {
  const board = createEmptyBoard();
  solveBoard(board);
  return board;
}

export function generatePuzzle(difficulty: Difficulty): { puzzle: Board; solution: Board } {
  const solution = generateSolvedBoard();
  const puzzle = cloneBoard(solution);
  const cells = shuffle(
    Array.from({ length: SIZE * SIZE }, (_, index) => ({
      row: Math.floor(index / SIZE),
      col: index % SIZE,
    })),
  );

  const targetClues = CLUES[difficulty];
  let clues = SIZE * SIZE;

  for (const { row, col } of cells) {
    if (clues <= targetClues) break;
    puzzle[row][col] = 0;
    clues -= 1;
  }

  return { puzzle, solution };
}

/** Marks only user-filled cells that do not match the solution. */
export function getIncorrectCells(board: Board, given: Board, solution: Board): Set<string> {
  const incorrect = new Set<string>();

  for (let row = 0; row < SIZE; row += 1) {
    for (let col = 0; col < SIZE; col += 1) {
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
  for (let row = 0; row < SIZE; row += 1) {
    for (let col = 0; col < SIZE; col += 1) {
      if (board[row][col] !== solution[row][col]) return false;
    }
  }
  return true;
}

export function isBoxComplete(board: Board, solution: Board, row: number, col: number): boolean {
  const boxRow = Math.floor(row / BOX) * BOX;
  const boxCol = Math.floor(col / BOX) * BOX;

  for (let r = boxRow; r < boxRow + BOX; r += 1) {
    for (let c = boxCol; c < boxCol + BOX; c += 1) {
      if (board[r][c] !== solution[r][c]) return false;
    }
  }
  return true;
}

export function isGivenCell(given: Board, row: number, col: number): boolean {
  return given[row][col] !== 0;
}

/** How many cells correctly show this digit (given + user). */
export function countCorrectDigit(board: Board, solution: Board, digit: number): number {
  let count = 0;
  for (let row = 0; row < SIZE; row += 1) {
    for (let col = 0; col < SIZE; col += 1) {
      if (solution[row][col] === digit && board[row][col] === digit) {
        count += 1;
      }
    }
  }
  return count;
}

/** True when this move finishes all 9 placements of a digit. */
export function didCompleteDigit(
  previousBoard: Board,
  nextBoard: Board,
  solution: Board,
  digit: number,
): boolean {
  if (digit < 1 || digit > 9) return false;
  return (
    countCorrectDigit(previousBoard, solution, digit) < 9 &&
    countCorrectDigit(nextBoard, solution, digit) >= 9
  );
}

export type CheerEvent = {
  id: number;
  row: number;
  col: number;
  boxComplete: boolean;
};
