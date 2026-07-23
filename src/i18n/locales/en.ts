import type { TranslationTree } from '../types';

const en: TranslationTree = {
  brand: {
    tagline: 'Soft puzzles for kids',
    a11yBoard: 'Gummy Sudoku candy board',
  },
  home: {
    continue: 'Continue',
    continuePuzzle: '%{level} puzzle',
    newPuzzle: 'New Puzzle',
    play: 'Play',
    chooseLevel: 'Choose a level',
    unlockPrompt: 'Win %{count} more %{level} puzzles to unlock %{next}!',
  },
  levels: {
    easy: 'Easy',
    medium: 'Medium',
    hard: 'Hard',
    profi: 'Profi',
    master: 'Master',
  },
  game: {
    chances: 'Chances',
    chancesLeft: '%{count} chances left',
    erase: 'Erase',
    newGame: 'New Game',
    nice: 'Nice!',
    levelUnlocked: '%{level} level unlocked!',
  },
  win: {
    title: 'Sweet!',
    message: 'You solved the puzzle!',
    playAgain: 'Play Again',
    backHome: 'Back to Home',
    keepLooking: 'Keep Looking',
  },
  gameOver: {
    title: 'Out of chances!',
    message: 'That puzzle was tricky. Want to try a fresh one?',
    tryAgain: 'Try Again',
    backHome: 'Back to Home',
  },
  a11y: {
    backHome: 'Go back to home',
    mute: 'Mute sounds',
    unmute: 'Unmute sounds',
    language: 'Language',
  },
};

export default en;
