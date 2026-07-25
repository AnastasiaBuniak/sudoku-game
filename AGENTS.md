# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v57.0.0/ before writing any code.

## Cursor Cloud specific instructions

Single-service Expo SDK 57 app (Gummy Sudoku, React Native + `react-native-web`). Requires Node >= 22.13 (VM has 22.14). No iOS/Android tooling in the cloud VM, so develop and test against the **web** target.

- Run the dev server: `npx expo start --web --port 8081` (scripts in `package.json`: `npm run web`, `npm start`). Metro serves the app at `http://localhost:8081`; the first bundle build takes ~10-30s, so let it finish before treating a blank page as broken.
- Type-check (there is no separate lint or test script): `npx tsc --noEmit`.
- `.env` is gitignored; copy `.env.example` to `.env` (contains only public `EXPO_PUBLIC_POSTHOG_*` analytics keys). The app runs without it, but Expo logs an env warning.
