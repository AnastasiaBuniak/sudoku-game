import type { TranslationTree } from '../types';

/** Japanese — modern Sudoku’s home; very large player base. */
const ja: TranslationTree = {
  brand: {
    tagline: '子ども向けのやさしいパズル',
    a11yBoard: 'Gummy Sudoku のキャンディボード',
  },
  home: {
    continue: 'つづきから',
    continuePuzzle: '%{level}のパズル',
    newPuzzle: '新しいパズル',
    play: 'プレイ',
    chooseLevel: 'レベルを選ぶ',
    unlockPrompt: '%{level}をあと%{count}回クリアすると%{next}が解放！',
  },
  levels: {
    easy: 'かんたん',
    medium: 'ふつう',
    hard: 'むずかしい',
    profi: 'プロ',
    master: 'マスター',
  },
  game: {
    chances: 'チャンス',
    chancesLeft: '残り%{count}回',
    erase: 'けす',
    newGame: '新しいゲーム',
    nice: 'いいね！',
    levelUnlocked: '%{level}レベルが解放された！',
  },
  win: {
    title: 'やったね！',
    message: 'パズルをクリアしたよ！',
    playAgain: 'もういちど',
    backHome: 'ホームへ',
    keepLooking: 'みつづける',
  },
  gameOver: {
    title: 'チャンスがなくなった！',
    message: 'むずかしかったね。新しいパズルにする？',
    tryAgain: 'もういちど',
    backHome: 'ホームへ',
  },
  a11y: {
    backHome: 'ホームにもどる',
    mute: 'ミュート',
    unmute: 'ミュート解除',
    language: '言語',
  },
};

export default ja;
