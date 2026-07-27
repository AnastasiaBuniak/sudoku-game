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
  modes: {
    numbers: 'すうじ',
    animals: 'どうぶつ',
  },
  levels: {
    easy: 'かんたん',
    medium: 'ふつう',
    hard: 'むずかしい',
    profi: 'エキスパート',
    master: 'マスター',
    cubs: 'ちびっこ',
    meadow: '草原',
    forest: 'もり',
    jungle: 'ジャングル',
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
    playNext: 'つぎへ',
    backHome: 'ホームへ',
    keepLooking: 'みつづける',
  },
  gameOver: {
    title: 'チャンスがなくなった！',
    message: 'むずかしかったね。新しいパズルにする？',
    tryAgain: 'もういちど',
    backHome: 'ホームへ',
  },
  howToPlay: {
    title: 'あそびかた',
    step1: 'あきマスをタップ',
    step2Numbers: 'したの数字をタップ',
    step2Animals: 'したのどうぶつをタップ',
    step3Numbers: 'タテ・ヨコ・ブロックに、同じ数字は1つだけ',
    step3Animals: 'タテ・ヨコ・ブロックに、同じどうぶつは1つだけ',
    chances: 'ハートはチャンス。まちがえるとひとつ減るよ。',
    gotIt: 'わかった！',
  },
  a11y: {
    backHome: 'ホームにもどる',
    mute: 'ミュート',
    unmute: 'ミュート解除',
    language: '言語',
    howToPlay: 'あそびかた',
  },
};

export default ja;
