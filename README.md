# Gummy Sudoku

A candy-themed Sudoku game built with [Expo](https://expo.dev) (SDK 57) and React Native. Play on iOS, Android, or the web with multiple difficulty levels, progress tracking, sound effects, and localization in eight languages.

## Features

- Classic 9×9 Sudoku with Easy, Medium, and Hard difficulties
- Mistake limit, win/lose flows, and level progress persistence
- Sound effects and background music (mute toggle)
- Multi-language UI: English, Chinese, Hindi, Spanish, Arabic (RTL), Japanese, German, French
- Runs on iOS, Android, and web via Expo

## Prerequisites

- **Node.js** `22.13.x` or newer (required by Expo SDK 57)
- **npm** (comes with Node.js)
- **Expo Go** app on a physical device (optional), or an iOS Simulator / Android Emulator

### Platform tooling (optional)

| Target | Extra tools |
| --- | --- |
| iOS Simulator | macOS with [Xcode](https://developer.apple.com/xcode/) |
| Android Emulator | [Android Studio](https://developer.android.com/studio) |
| Physical device | [Expo Go](https://expo.dev/go) + same Wi‑Fi as your machine |

## Getting started

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd sudoku-game
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm start
   ```

   This launches the Expo CLI. From there you can:

   - Press `i` — open in iOS Simulator
   - Press `a` — open in Android Emulator
   - Press `w` — open in the browser
   - Scan the QR code with Expo Go on your phone

### Convenience scripts

| Command | Description |
| --- | --- |
| `npm start` | Start Expo (same as `expo start`) |
| `npm run ios` | Start and open iOS Simulator |
| `npm run android` | Start and open Android Emulator |
| `npm run web` | Start and open in the browser |

## Project structure

```
sudoku-game/
├── App.tsx              # App entry UI and game state
├── app.json             # Expo config
├── index.ts             # Registers the root component
├── assets/              # Icons, splash, sounds, images
└── src/
    ├── analytics/       # Event tracking helpers
    ├── components/      # UI components (board, controls, modals, …)
    ├── hooks/           # Audio, layout, persistence, progress
    ├── i18n/            # Localization and locale files
    ├── theme.ts         # Colors, fonts, spacing
    ├── types/           # Shared TypeScript types
    └── utils/           # Sudoku logic, levels, storage
```

## Tech stack

- Expo SDK ~57 / React Native 0.86 / React 19
- TypeScript
- `expo-audio`, `expo-font`, `expo-localization`, `expo-splash-screen`
- `@react-native-async-storage/async-storage` for persisted sessions
- `i18n-js` for translations

## Troubleshooting

- **Node version errors** — Upgrade to Node.js 22.13+ (`node -v` to check).
- **Metro cache issues** — Restart with a clean cache: `npx expo start -c`
- **Dependency mismatches** — Prefer `npx expo install <package>` so versions match SDK 57.

## License

See [LICENSE](./LICENSE).
