import type { TranslationTree } from '../types';

/** Hindi — 3rd most spoken worldwide; Sudoku growing fast in India. */
const hi: TranslationTree = {
  brand: {
    tagline: 'बच्चों के लिए नरम पहेलियाँ',
    a11yBoard: 'Gummy Sudoku कैंडी बोर्ड',
  },
  home: {
    continue: 'जारी रखें',
    continuePuzzle: '%{level} पहेली',
    newPuzzle: 'नई पहेली',
    play: 'खेलें',
    chooseLevel: 'स्तर चुनें',
    unlockPrompt: '%{next} खोलने के लिए %{count} और %{level} पहेलियाँ जीतें!',
  },
  modes: {
    numbers: 'संख्याएँ',
    animals: 'जानवर',
  },
  levels: {
    easy: 'आसान',
    medium: 'मध्यम',
    hard: 'कठिन',
    profi: 'विशेषज्ञ',
    master: 'मास्टर',
    cubs: 'शावक',
    meadow: 'घासभूमि',
    forest: 'वन',
    jungle: 'जंगल',
  },
  game: {
    chances: 'मौके',
    chancesLeft: '%{count} मौके बचे',
    undo: 'पूर्ववत',
    newGame: 'नया खेल',
    nice: 'शाबाश!',
    levelUnlocked: 'शाबाश! %{level} स्तर खुला!',
  },
  win: {
    title: 'वाह!',
    message: 'आपने पहेली हल कर ली!',
    unlockTitle: 'नया स्तर खुला!',
    unlockBody: 'बहुत बढ़िया — आपने अगला स्तर खोल लिया',
    playUnlocked: '%{level} खेलें',
    playNext: 'अगला खेलें',
    backHome: 'होम पर जाएँ',
    keepLooking: 'देखते रहें',
  },
  gameOver: {
    title: 'मौके खत्म!',
    message: 'यह पहेली थोड़ी मुश्किल थी। नई कोशिश करें?',
    tryAgain: 'फिर कोशिश करें',
    backHome: 'होम पर जाएँ',
  },
  howToPlay: {
    title: 'कैसे खेलें',
    step1: 'खाली खाने पर टैप करें',
    step2Numbers: 'नीचे कोई संख्या चुनें',
    step2Animals: 'नीचे कोई जानवर चुनें',
    step3Numbers: 'हर पंक्ति, स्तंभ और बॉक्स में हर संख्या सिर्फ़ एक बार',
    step3Animals: 'हर पंक्ति, स्तंभ और बॉक्स में हर जानवर सिर्फ़ एक बार',
    chances: 'दिल आपके मौके हैं। गलत जवाब से एक कम होता है।',
    gotIt: 'समझ गए!',
  },
  a11y: {
    backHome: 'होम पर वापस जाएँ',
    mute: 'आवाज़ बंद करें',
    unmute: 'आवाज़ चालू करें',
    language: 'भाषा',
    howToPlay: 'कैसे खेलें',
    undo: 'पिछली चाल पूर्ववत करें',
  },
};

export default hi;
