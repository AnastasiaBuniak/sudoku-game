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
  modes: {
    numbers: 'أرقام',
    animals: 'حيوانات',
  },
  levels: {
    easy: 'سهل',
    medium: 'متوسط',
    hard: 'صعب',
    profi: 'محترف',
    master: 'خبير',
    cubs: 'الصغار',
    meadow: 'مرج',
    forest: 'غابة',
    jungle: 'أدغال',
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
    playNext: 'العب التالي',
    backHome: 'العودة للرئيسية',
    keepLooking: 'تابع النظر',
  },
  gameOver: {
    title: 'انتهت الفرص!',
    message: 'كان اللغز صعباً. هل تريد محاولة جديدة؟',
    tryAgain: 'حاول مجدداً',
    backHome: 'العودة للرئيسية',
  },
  howToPlay: {
    title: 'طريقة اللعب',
    step1: 'اضغط على خانة فارغة',
    step2Numbers: 'اضغط على رقم بالأسفل',
    step2Animals: 'اضغط على حيوان بالأسفل',
    step3Numbers: 'كل رقم مرة واحدة فقط في كل صف وعمود ومربع',
    step3Animals: 'كل حيوان مرة واحدة فقط في كل صف وعمود ومربع',
    chances: 'القلوب هي فرصك. الإجابة الخاطئة تستهلك واحدةً.',
    gotIt: 'فهمت!',
  },
  a11y: {
    backHome: 'العودة إلى الرئيسية',
    mute: 'كتم الصوت',
    unmute: 'تشغيل الصوت',
    language: 'اللغة',
    howToPlay: 'طريقة اللعب',
  },
};

export default ar;
