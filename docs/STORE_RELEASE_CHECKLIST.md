# Store release checklist — Gummy Sudoku

Target: **general Puzzle**, age **4+**, no Kids Category. **Contains ads** (AdMob interstitial).

## Done in repo
- [x] Anonymous analytics events (incl. `cell_correct` / `cell_wrong`)
- [x] PostHog wiring via `EXPO_PUBLIC_POSTHOG_*`
- [x] AdMob interstitial (every 2nd completed number/animal; skip on win)
- [x] `eas.json` (development / preview / production)
- [x] iOS `buildNumber` + Android `versionCode` in `app.json`
- [x] Privacy policy: `docs/index.html` (host via GitHub Pages) — includes AdMob

## Host privacy policy (GitHub Pages — free)
1. Push `docs/` to GitHub (`main`)
2. Repo → **Settings** → **Pages**
3. Source: **Deploy from a branch**
4. Branch: `main` / folder: **/docs** → Save
5. After a minute, open:
   `https://anastasiabuniak.github.io/sudoku-game/`
6. Use that URL in App Store Connect + Play Console
7. Contact email: `anastasiia.melnychek@gmail.com` (also use in store listing support/privacy contacts)

## Your actions (required)
1. **PostHog** — confirm `.env` has API key; events visible in Live feed
2. **Expo account** — done if project is linked in `app.json`
3. **Host privacy policy** — GitHub Pages (confirm live URL reflects AdMob section)
4. **Apple Developer** + **Google Play Console** accounts
5. Create store listings from prepared assets in [`store/`](../store/README.md)
   - Icon: `store/icon/app-icon-1024-opaque.png` (Apple) / `app-icon-1024.png` (Play)
   - Screenshots: `store/screenshots/{iphone,ipad,android}/`
   - Play feature graphic: `store/feature-graphic/google-play-feature-1024x500.png`
   - Copy: `store/copy/` (short + long description, Apple subtitle/keywords)
   - Category **Puzzle**, age **4+**
6. Fill App Privacy / Data safety to match: PostHog analytics + **AdMob ads**
7. Play Console → App content: **Yes, my app contains ads**
8. Internal builds
   ```bash
   eas build --profile preview --platform android
   eas build --profile preview --platform ios
   ```
9. TestFlight + Play internal testing, then production submit

## Privacy disclosures (launch)
- Analytics: product interaction events (language, level, correct/wrong moves) via PostHog; also anonymous ad funnel events (`ad_show_requested`, `ad_opened`, `ad_closed`, `ad_clicked`, `ad_failed`) — no advertising IDs in our analytics
- Advertising: Google AdMob interstitial (device info / advertising ID may be used by Google)
- Linked to user: No (for our own profiles)
- Third parties: PostHog, Google AdMob
