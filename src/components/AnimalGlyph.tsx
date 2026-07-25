import { memo, type ReactElement } from 'react';
import Svg, { Circle, Ellipse, Line, Path, Polygon } from 'react-native-svg';
import { ANIMALS, type AnimalKey } from '../game/modes';

type Props = {
  /** 1-based cell value; mapped to an animal via ANIMALS. */
  value: number;
  size: number;
  dimmed?: boolean;
};

const EYE = '#3A2E4A';

/** Maps a 1-based board value to its animal key. */
export function animalForValue(value: number): AnimalKey | null {
  if (value < 1 || value > ANIMALS.length) return null;
  return ANIMALS[value - 1];
}

function Rabbit() {
  return (
    <>
      <Ellipse cx={39} cy={28} rx={8} ry={22} fill="#F6A5C0" />
      <Ellipse cx={61} cy={28} rx={8} ry={22} fill="#F6A5C0" />
      <Ellipse cx={39} cy={30} rx={3.4} ry={14} fill="#F7D6E4" />
      <Ellipse cx={61} cy={30} rx={3.4} ry={14} fill="#F7D6E4" />
      <Circle cx={50} cy={62} r={26} fill="#F6A5C0" />
      <Circle cx={41} cy={60} r={3.4} fill={EYE} />
      <Circle cx={59} cy={60} r={3.4} fill={EYE} />
      <Ellipse cx={50} cy={69} rx={3.2} ry={2.4} fill="#E0567F" />
    </>
  );
}

function Cat() {
  return (
    <>
      <Polygon points="24,26 40,42 22,50" fill="#FFA94D" />
      <Polygon points="76,26 60,42 78,50" fill="#FFA94D" />
      <Circle cx={50} cy={58} r={28} fill="#FFA94D" />
      <Circle cx={40} cy={54} r={3.6} fill={EYE} />
      <Circle cx={60} cy={54} r={3.6} fill={EYE} />
      <Path d="M50 62 l-3 4 h6 z" fill="#E0567F" />
      <Line x1={24} y1={60} x2={38} y2={62} stroke={EYE} strokeWidth={1.6} strokeLinecap="round" />
      <Line x1={24} y1={68} x2={38} y2={67} stroke={EYE} strokeWidth={1.6} strokeLinecap="round" />
      <Line x1={76} y1={60} x2={62} y2={62} stroke={EYE} strokeWidth={1.6} strokeLinecap="round" />
      <Line x1={76} y1={68} x2={62} y2={67} stroke={EYE} strokeWidth={1.6} strokeLinecap="round" />
    </>
  );
}

function Bear() {
  return (
    <>
      <Circle cx={30} cy={32} r={13} fill="#B27A4B" />
      <Circle cx={70} cy={32} r={13} fill="#B27A4B" />
      <Circle cx={30} cy={32} r={6} fill="#D8A878" />
      <Circle cx={70} cy={32} r={6} fill="#D8A878" />
      <Circle cx={50} cy={58} r={30} fill="#C08457" />
      <Circle cx={40} cy={54} r={3.8} fill={EYE} />
      <Circle cx={60} cy={54} r={3.8} fill={EYE} />
      <Ellipse cx={50} cy={66} rx={12} ry={9} fill="#EAD2B8" />
      <Ellipse cx={50} cy={63} rx={3.4} ry={2.6} fill={EYE} />
    </>
  );
}

function Fox() {
  return (
    <>
      <Polygon points="20,20 40,40 24,48" fill="#F0662E" />
      <Polygon points="80,20 60,40 76,48" fill="#F0662E" />
      <Path d="M22 44 h56 l-14 22 a18 18 0 0 1 -28 0 z" fill="#F0662E" />
      <Path d="M36 58 l-9 14 a14 14 0 0 0 23 0 z" fill="#FBEEE4" />
      <Path d="M64 58 l9 14 a14 14 0 0 1 -23 0 z" fill="#FBEEE4" />
      <Circle cx={40} cy={52} r={3.6} fill={EYE} />
      <Circle cx={60} cy={52} r={3.6} fill={EYE} />
      <Path d="M50 78 l-4 -6 h8 z" fill={EYE} />
    </>
  );
}

function Frog() {
  return (
    <>
      <Circle cx={34} cy={34} r={12} fill="#8ED968" />
      <Circle cx={66} cy={34} r={12} fill="#8ED968" />
      <Circle cx={34} cy={33} r={5} fill="#FFFFFF" />
      <Circle cx={66} cy={33} r={5} fill="#FFFFFF" />
      <Circle cx={34} cy={34} r={2.6} fill={EYE} />
      <Circle cx={66} cy={34} r={2.6} fill={EYE} />
      <Path d="M22 48 a28 24 0 0 0 56 0 z" fill="#8ED968" />
      <Path d="M38 66 q12 10 24 0" stroke={EYE} strokeWidth={2.4} strokeLinecap="round" fill="none" />
    </>
  );
}

function Panda() {
  return (
    <>
      <Circle cx={28} cy={30} r={12} fill={EYE} />
      <Circle cx={72} cy={30} r={12} fill={EYE} />
      <Circle cx={50} cy={58} r={30} fill="#F4F4F6" />
      <Ellipse cx={39} cy={55} rx={7} ry={9} fill={EYE} transform="rotate(-18 39 55)" />
      <Ellipse cx={61} cy={55} rx={7} ry={9} fill={EYE} transform="rotate(18 61 55)" />
      <Circle cx={40} cy={55} r={2.8} fill="#FFFFFF" />
      <Circle cx={60} cy={55} r={2.8} fill="#FFFFFF" />
      <Ellipse cx={50} cy={68} rx={3.4} ry={2.6} fill={EYE} />
    </>
  );
}

const RENDERERS: Record<AnimalKey, () => ReactElement> = {
  rabbit: Rabbit,
  cat: Cat,
  bear: Bear,
  fox: Fox,
  frog: Frog,
  panda: Panda,
};

function AnimalGlyphBase({ value, size, dimmed }: Props) {
  const key = animalForValue(value);
  if (!key) return null;
  const Renderer = RENDERERS[key];
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100" opacity={dimmed ? 0.55 : 1}>
      <Renderer />
    </Svg>
  );
}

export const AnimalGlyph = memo(AnimalGlyphBase);
