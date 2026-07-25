import type { TranslationTree } from '../types';

/** Mandarin Chinese — top global speakers + huge Sudoku player base. */
const zh: TranslationTree = {
  brand: {
    tagline: '给孩子们的软萌数独',
    a11yBoard: 'Gummy Sudoku 糖果棋盘',
  },
  home: {
    continue: '继续',
    continuePuzzle: '%{level}关卡',
    newPuzzle: '新谜题',
    play: '开始',
    chooseLevel: '选择难度',
    unlockPrompt: '再赢 %{count} 局%{level}即可解锁%{next}！',
  },
  modes: {
    numbers: '数字',
    animals: '动物',
  },
  levels: {
    easy: '简单',
    medium: '中等',
    hard: '困难',
    profi: '高手',
    master: '大师',
    cubs: '幼崽',
    meadow: '草地',
    forest: '森林',
    jungle: '丛林',
  },
  game: {
    chances: '机会',
    chancesLeft: '还剩 %{count} 次机会',
    erase: '擦除',
    newGame: '新游戏',
    nice: '太棒了！',
    levelUnlocked: '已解锁%{level}难度！',
  },
  win: {
    title: '太甜了！',
    message: '你解出了这道谜题！',
    playNext: '下一关',
    backHome: '返回主页',
    keepLooking: '继续看看',
  },
  gameOver: {
    title: '机会用完了！',
    message: '这道题有点难。要换一盘新的吗？',
    tryAgain: '再试一次',
    backHome: '返回主页',
  },
  howToPlay: {
    title: '怎么玩',
    step1: '点一个空格',
    step2Numbers: '点下方的数字',
    step2Animals: '点下方的小动物',
    step3: '填满每一行、每一列和每个宫格——不要重复',
    chances: '爱心是机会。答错会用掉一颗。',
    gotIt: '知道了！',
  },
  a11y: {
    backHome: '返回主页',
    mute: '静音',
    unmute: '取消静音',
    language: '语言',
    howToPlay: '怎么玩',
  },
};

export default zh;
