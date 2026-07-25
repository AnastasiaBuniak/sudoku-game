import AsyncStorage from '@react-native-async-storage/async-storage';

const HOW_TO_PLAY_SEEN_KEY = '@sudoku/how-to-play-seen';

export async function loadHowToPlaySeen(): Promise<boolean> {
  try {
    return (await AsyncStorage.getItem(HOW_TO_PLAY_SEEN_KEY)) === '1';
  } catch {
    return false;
  }
}

export async function saveHowToPlaySeen(): Promise<void> {
  try {
    await AsyncStorage.setItem(HOW_TO_PLAY_SEEN_KEY, '1');
  } catch {
    // Ignore persistence failures; tip may show again next launch.
  }
}
