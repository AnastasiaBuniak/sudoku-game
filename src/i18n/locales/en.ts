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
  modes: {
    numbers: 'Numbers',
    animals: 'Animals',
  },
  levels: {
    easy: 'Easy',
    medium: 'Medium',
    hard: 'Hard',
    profi: 'Expert',
    master: 'Master',
    cubs: 'Cubs',
    meadow: 'Meadow',
    forest: 'Forest',
    jungle: 'Jungle',
  },
  game: {
    chances: 'Chances',
    chancesLeft: '%{count} chances left',
    erase: 'Erase',
    newGame: 'New Game',
    nice: 'Nice!',
    levelUnlocked: 'Great! You unlocked %{level}!',
  },
  win: {
    title: 'Sweet!',
    message: 'You solved the puzzle!',
    unlockTitle: 'New level unlocked!',
    unlockBody: 'Great — you unlocked the next level',
    playUnlocked: 'Play %{level}',
    playNext: 'Play Next',
    backHome: 'Back to Home',
    keepLooking: 'Keep Looking',
  },
  gameOver: {
    title: 'Out of chances!',
    message: 'That puzzle was tricky. Want to try a fresh one?',
    tryAgain: 'Try Again',
    backHome: 'Back to Home',
  },
  howToPlay: {
    title: 'How to play',
    step1: 'Tap an empty cell',
    step2Numbers: 'Tap a number below',
    step2Animals: 'Tap an animal below',
    step3Numbers: 'Each number only once in every row, column, and box',
    step3Animals: 'Each animal only once in every row, column, and box',
    chances: 'Hearts are your chances. A wrong answer uses one up.',
    gotIt: 'Got it!',
  },
  a11y: {
    backHome: 'Go back to home',
    mute: 'Mute sounds',
    unmute: 'Unmute sounds',
    language: 'Language',
    howToPlay: 'How to play',
  },
};

export default en;
