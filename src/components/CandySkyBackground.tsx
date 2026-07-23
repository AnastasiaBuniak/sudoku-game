import { Image, StyleSheet, View } from 'react-native';

type Props = {
  /** Slight white veil so UI stays readable over busy clouds. */
  softVeil?: boolean;
};

/**
 * Cotton-candy cloud sky from the Gummy Sudoku art (no board in the image).
 */
export function CandySkyBackground({ softVeil = true }: Props) {
  return (
    <View style={styles.root} pointerEvents="none">
      <Image
        source={require('../../assets/candy-sky.png')}
        style={styles.image}
        resizeMode="cover"
        accessibilityIgnoresInvertColors
      />
      {softVeil ? <View style={styles.veil} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFill,
  },
  image: {
    ...StyleSheet.absoluteFill,
    width: '100%',
    height: '100%',
  },
  veil: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(255, 248, 255, 0.18)',
  },
});
