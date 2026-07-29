import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const BASE_WIDTH = 390;
const BASE_HEIGHT = 844;
/** Board / number tableau as a fraction of screen width. */
const BOARD_WIDTH_RATIO = 0.98;
const BOARD_WIDTH_MIN_RATIO = 0.96;
const BOARD_WIDTH_MAX_RATIO = 0.98;

export type LayoutMetrics = {
  width: number;
  height: number;
  isTablet: boolean;
  isCompact: boolean;
  isLandscape: boolean;
  scale: number;
  fontScale: number;
  contentMaxWidth: number;
  pagePaddingX: number;
  pagePaddingY: number;
  gap: number;
  hitSize: number;
  /** Sudoku board edge length (~98% of screen width, height-clamped). */
  boardSize: number;
  padMaxWidth: number;
  heroSize: number;
  titleSize: number;
  playTitleSize: number;
  buttonFontSize: number;
  modalMaxWidth: number;
  insets: { top: number; bottom: number; left: number; right: number };
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function useLayoutMetrics(): LayoutMetrics {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  return useMemo(() => {
    const shortest = Math.min(width, height);
    const isTablet = shortest >= 600;
    const isLandscape = width > height;
    const isCompact = height < 720 || width < 360;
    const widthScale = width / BASE_WIDTH;
    const heightScale = height / BASE_HEIGHT;
    const scale = clamp(
      Math.min(widthScale, heightScale) * (isTablet ? 1.05 : 1),
      0.78,
      isTablet ? 1.4 : 1.2,
    );
    const fontScale = clamp(scale, 0.85, isTablet ? 1.3 : 1.12);

    // Keep side padding to ~1% each side so a 98% board fits without clipping.
    const pagePaddingX = isTablet
      ? 24
      : Math.max(4, Math.round(width * ((1 - BOARD_WIDTH_RATIO) / 2)));
    const pagePaddingY = isCompact || isLandscape ? 8 : isTablet ? 20 : 14;
    const gap = isCompact || isLandscape ? 8 : isTablet ? 18 : 14;

    const hitSize = Math.max(44, Math.round(44 * scale));
    const titleSize = Math.round((isCompact ? 34 : 42) * fontScale);
    const playTitleSize = Math.round((isCompact || isLandscape ? 22 : 30) * fontScale);
    const buttonFontSize = Math.round((isCompact ? 24 : 28) * fontScale);
    const heroSize = Math.round(
      (isCompact ? 120 : isTablet ? 220 : 168) * Math.min(scale, 1.2),
    );
    const modalMaxWidth = Math.min(isTablet ? 420 : 340, width - pagePaddingX * 2);

    const usableWidth = Math.max(240, width - insets.left - insets.right);
    const contentWidth = Math.max(200, usableWidth - pagePaddingX * 2);

    // Target ~98% of screen width.
    const idealBoard = Math.round(width * BOARD_WIDTH_RATIO);
    const minBoardByWidth = Math.round(width * BOARD_WIDTH_MIN_RATIO);
    const maxBoardByWidth = Math.round(width * BOARD_WIDTH_MAX_RATIO);
    let boardSize = clamp(idealBoard, minBoardByWidth, maxBoardByWidth);
    boardSize = Math.min(boardSize, contentWidth, Math.floor(usableWidth * BOARD_WIDTH_MAX_RATIO));

    // ScrollView can handle overflow on tall devices. Only shrink for short /
    // landscape screens so the board + pad still fit in one comfortable view.
    const safeHeight = height - insets.top - insets.bottom;
    const shouldClampHeight = isLandscape || height < 700;
    if (shouldClampHeight) {
      const headerBlock =
        Math.round((isCompact || isLandscape ? 56 : 76) * fontScale) + hitSize * 0.25;
      const controlsBlock = Math.round(44 * scale);
      const gapBudget = gap * (isLandscape ? 3 : 4);
      const estimatedPadHeight = (size: number) =>
        Math.max(36, size / 9) + Math.round(48 * scale) + gap;
      const chromeWithoutPad = headerBlock + controlsBlock + gapBudget + pagePaddingY * 2;
      const maxBoardForHeight = Math.max(
        180,
        safeHeight - chromeWithoutPad - estimatedPadHeight(boardSize),
      );

      if (boardSize > maxBoardForHeight) {
        boardSize = Math.floor(maxBoardForHeight);
        const tighterMax = Math.max(
          180,
          safeHeight - chromeWithoutPad - estimatedPadHeight(boardSize),
        );
        boardSize = Math.floor(Math.min(boardSize, tighterMax, contentWidth));
      }
    }

    // Absolute floors/ceilings for tiny or huge devices.
    boardSize = Math.floor(
      clamp(boardSize, isCompact ? 200 : 220, Math.min(contentWidth, usableWidth * BOARD_WIDTH_MAX_RATIO)),
    );

    const contentMaxWidth = contentWidth;
    const padMaxWidth = boardSize;

    return {
      width,
      height,
      isTablet,
      isCompact,
      isLandscape,
      scale,
      fontScale,
      contentMaxWidth,
      pagePaddingX,
      pagePaddingY,
      gap,
      hitSize,
      boardSize,
      padMaxWidth,
      heroSize,
      titleSize,
      playTitleSize,
      buttonFontSize,
      modalMaxWidth,
      insets: {
        top: insets.top,
        bottom: insets.bottom,
        left: insets.left,
        right: insets.right,
      },
    };
  }, [width, height, insets.top, insets.bottom, insets.left, insets.right]);
}
