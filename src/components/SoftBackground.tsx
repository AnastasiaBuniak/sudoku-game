import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme';

const STARS = [
  { top: 56, left: 28, size: 10, color: colors.starPink, rotate: '18deg' },
  { top: 110, right: 36, size: 12, color: colors.starYellow, rotate: '-12deg' },
  { top: 180, left: 18, size: 8, color: colors.starLavender, rotate: '8deg' },
  { top: 240, right: 22, size: 10, color: colors.starMint, rotate: '-20deg' },
  { top: 320, left: 48, size: 7, color: colors.starPink, rotate: '30deg' },
  { bottom: 160, right: 50, size: 11, color: colors.starYellow, rotate: '15deg' },
  { bottom: 90, left: 30, size: 9, color: colors.starMint, rotate: '-8deg' },
] as const;

const SPARKLES = [
  { top: 80, left: '22%' as const, size: 4 },
  { top: 140, right: '18%' as const, size: 3 },
  { top: 210, left: '70%' as const, size: 3 },
  { top: 280, left: '12%' as const, size: 4 },
  { bottom: 200, right: '28%' as const, size: 3 },
  { bottom: 120, left: '55%' as const, size: 4 },
];

function CandyStar({
  size,
  color,
  rotate,
  style,
}: {
  size: number;
  color: string;
  rotate: string;
  style: object;
}) {
  return (
    <View style={[styles.starWrap, style, { width: size, height: size, transform: [{ rotate }] }]}>
      <View style={[styles.starArm, { backgroundColor: color, width: size, height: size * 0.34, top: size * 0.33 }]} />
      <View
        style={[
          styles.starArm,
          {
            backgroundColor: color,
            width: size * 0.34,
            height: size,
            left: size * 0.33,
          },
        ]}
      />
    </View>
  );
}

export function SoftBackground() {
  return (
    <View style={styles.root} pointerEvents="none">
      <LinearGradient
        colors={[colors.bgTop, colors.bgMid, colors.bgBottom]}
        locations={[0, 0.45, 1]}
        style={StyleSheet.absoluteFill}
      />

      {STARS.map((star, index) => (
        <CandyStar
          key={`star-${index}`}
          size={star.size}
          color={star.color}
          rotate={star.rotate}
          style={{
            position: 'absolute' as const,
            top: 'top' in star ? star.top : undefined,
            bottom: 'bottom' in star ? star.bottom : undefined,
            left: 'left' in star ? star.left : undefined,
            right: 'right' in star ? star.right : undefined,
          }}
        />
      ))}

      {SPARKLES.map((sparkle, index) => (
        <View
          key={`sparkle-${index}`}
          style={[
            styles.sparkle,
            {
              top: 'top' in sparkle ? sparkle.top : undefined,
              bottom: 'bottom' in sparkle ? sparkle.bottom : undefined,
              left: 'left' in sparkle ? sparkle.left : undefined,
              right: 'right' in sparkle ? sparkle.right : undefined,
              width: sparkle.size,
              height: sparkle.size,
              borderRadius: sparkle.size,
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFill,
    overflow: 'hidden',
  },
  starWrap: {
    position: 'absolute',
    zIndex: 0,
  },
  starArm: {
    position: 'absolute',
    borderRadius: 999,
  },
  sparkle: {
    position: 'absolute',
    backgroundColor: colors.sparkle,
  },
});
