import type { TranslationTree } from '../types';

/** Arabic (MSA) — 5th most spoken; RTL UI. */
const ar: TranslationTree = {
  brand: {
    tagline: 'ألغاز ناعمة للأطفال',
    a11yBoard: 'لوحة حلوى Gummy Sudoku',
  },
  home: {
    continue: 'متابعة',
    continuePuzzle: 'لغز %{level}',
    newPuzzle: 'لغز جديد',
    play: 'العب',
    chooseLevel: 'اختر مستوى',
    unlockPrompt: 'اربح %{count} ألغاز إضافية من مستوى %{level} لفتح %{next}!',
  },
  levels: {
    easy: 'سهل',
    medium: 'متوسط',
    hard: 'صعب',
    profi: 'محترف',
    master: 'خبير',
  },
  game: {
    chances: 'فرص',
    chancesLeft: 'تبقى %{count} فرص',
    erase: 'مسح',
    newGame: 'لعبة جديدة',
    nice: 'رائع!',
    levelUnlocked: 'تم فتح مستوى %{level}!',
  },
  win: {
    title: 'حلو!',
    message: 'لقد حللت اللغز!',
    playAgain: 'العب مجدداً',
    backHome: 'العودة للرئيسية',
    keepLooking: 'تابع النظر',
  },
  gameOver: {
    title: 'انتهت الفرص!',
    message: 'كان اللغز صعباً. هل تريد محاولة جديدة؟',
    tryAgain: 'حاول مجدداً',
    backHome: 'العودة للرئيسية',
  },
  a11y: {
    backHome: 'العودة إلى الرئيسية',
    mute: 'كتم الصوت',
    unmute: 'تشغيل الصوت',
    language: 'اللغة',
  },
};

export default ar;
