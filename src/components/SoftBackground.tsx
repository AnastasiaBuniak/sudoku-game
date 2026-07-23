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
    <>
      <LinearGradient
        colors={[colors.bgTop, colors.bgMid, colors.bgBottom]}
        locations={[0, 0.45, 1]}
        style={StyleSheet.absoluteFill}
      />

      <View style={[styles.cloud, styles.cloud1]} />
      <View style={[styles.cloud, styles.cloud2]} />
      <View style={[styles.cloud, styles.cloud3]} />
      <View style={[styles.cloud, styles.cloud4]} />
      <View style={[styles.cloud, styles.cloud5]} />

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
    </>
  );
}

const styles = StyleSheet.create({
  cloud: {
    position: 'absolute',
    borderRadius: 999,
  },
  cloud1: {
    width: 220,
    height: 110,
    backgroundColor: colors.blobPink,
    top: -30,
    left: -50,
  },
  cloud2: {
    width: 180,
    height: 100,
    backgroundColor: colors.blobLavender,
    top: 60,
    right: -40,
  },
  cloud3: {
    width: 200,
    height: 120,
    backgroundColor: colors.blobBlue,
    bottom: 140,
    left: -60,
  },
  cloud4: {
    width: 160,
    height: 90,
    backgroundColor: colors.blobMint,
    bottom: 40,
    right: -30,
  },
  cloud5: {
    width: 140,
    height: 80,
    backgroundColor: colors.blobYellow,
    top: 220,
    left: -20,
    opacity: 0.7,
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
