# Store release checklist — Gummy Sudoku

Target: **general Puzzle**, age **4+**, no Kids Category. Ads later.

## Done in repo
- [x] Anonymous analytics events (incl. `cell_correct` / `cell_wrong`)
- [x] PostHog wiring via `EXPO_PUBLIC_POSTHOG_*`
- [x] `eas.json` (development / preview / production)
- [x] iOS `buildNumber` + Android `versionCode` in `app.json`
- [x] Privacy policy draft: `docs/index.html` (host via GitHub Pages)

## Host privacy policy (GitHub Pages — free)
1. Push `docs/` to GitHub (`main`)
2. Repo → **Settings** → **Pages**
3. Source: **Deploy from a branch**
4. Branch: `main` / folder: **/docs** → Save
5. After a minute, open:
   `https://anastasiabuniak.github.io/sudoku-game/`
6. Use that URL in App Store Connect + Play Console
7. Replace `REPLACE_WITH_YOUR_EMAIL` in `docs/index.html` before submit

## Your actions (required)
1. **PostHog** — confirm `.env` has API key; events visible in Live feed
2. **Expo account**
   ```bash
   npm i -g eas-cli
   eas login
   eas init
   ```
   This writes `extra.eas.projectId` (and usually `owner`) into `app.json`
3. **Host privacy policy** — see GitHub Pages steps above
4. **Apple Developer** + **Google Play Console** accounts
5. Create store listings (screenshots, description, category Puzzle, 4+)
6. Fill App Privacy / Data safety to match: anonymous analytics via PostHog; no ads yet
7. Internal builds
   ```bash
   eas build --profile preview --platform android
   eas build --profile preview --platform ios
   ```
8. TestFlight + Play internal testing, then production submit

## Privacy disclosures (launch)
- Data collected: product interaction events (language, level, correct/wrong moves)
- Purpose: Analytics
- Linked to user: No
- Tracking (Apple definition): No (product analytics only, no IDFA)
- Third party: PostHog
