# Store assets — Gummy Sudoku

Ready-to-upload files for **App Store Connect** and **Google Play Console**.

## Quick upload map

| Asset | Path | Spec |
| --- | --- | --- |
| App icon (Apple upload) | `icon/app-icon-1024-opaque.png` | 1024×1024 PNG, **no alpha** |
| App icon (source / Play) | `icon/app-icon-1024.png` | 1024×1024 (may include alpha) |
| Animals variant (optional marketing) | `icon/app-icon-animals-1024.png` | 1024×1024 |
| Google Play feature graphic | `feature-graphic/google-play-feature-1024x500.png` | **1024×500** exact |
| iPhone screenshots | `screenshots/iphone/` | 1290×2796 (6.7") |
| iPad screenshots | `screenshots/ipad/` | 2048×2732 (13") |
| Android phone screenshots | `screenshots/android/` | 1080×2400 |
| Listing copy | `copy/` | short, long, subtitle, keywords |

**Primary store icon:** use `app-icon-1024.png` (numbers candy grid). It matches `assets/icon.png` already wired in `app.json`.

## Screenshot set (recommended order)

1. Home — Numbers  
2. Home — Animals  
3. Game — Animals (Cubs 4×4)  
4. Game — Numbers (Easy 9×9)

## Copy / paste

- Apple subtitle → `copy/subtitle-apple.txt`
- Apple promotional text → `copy/promotional-text-apple.txt`
- Apple keywords → `copy/keywords-apple.txt`
- Google short description → `copy/short-description.txt`
- Full description (both stores) → `copy/long-description.txt`
- Full metadata notes → `copy/en-listing.md`

## Metadata (launch)

- Category: **Games → Puzzle**
- Age: **4+** (general audience — not Kids Category)
- Ads: **Yes** (occasional interstitial after win/loss via AdMob)
- Support email: `anastasiia.melnychek@gmail.com`
- Privacy policy: `https://anastasiabuniak.github.io/sudoku-game/` (source: `docs/index.html`)

## Regenerate screenshots

With the web app running (`npm run web` → http://localhost:8081):

```bash
npm run store:screenshots
```

Requires Playwright Chromium (`npx playwright install chromium` once).
