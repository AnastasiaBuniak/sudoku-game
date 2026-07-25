/**
 * Capture store screenshots from the running Expo web app.
 * Usage: node store/scripts/capture-screenshots.mjs
 * Requires: npx playwright (browsers installed), app at http://localhost:8081
 */
import { chromium } from 'playwright';
import { mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const BASE = process.env.STORE_CAPTURE_URL || 'http://localhost:8081';

const VIEWPORTS = [
  {
    name: 'iphone-6.7',
    dir: 'screenshots/iphone',
    width: 430,
    height: 932,
    deviceScaleFactor: 3, // → 1290 × 2796
    isMobile: true,
  },
  {
    name: 'ipad-13',
    dir: 'screenshots/ipad',
    width: 1024,
    height: 1366,
    deviceScaleFactor: 2, // → 2048 × 2732
    isMobile: false,
  },
  {
    name: 'android-phone',
    dir: 'screenshots/android',
    width: 360,
    height: 800,
    deviceScaleFactor: 3, // → 1080 × 2400
    isMobile: true,
  },
];

async function waitForApp(page) {
  await page.goto(BASE, { waitUntil: 'networkidle', timeout: 120_000 });
  await page.getByText('Gummy Sudoku').first().waitFor({ timeout: 120_000 });
  // Let fonts / hero images settle
  await page.waitForTimeout(1500);
}

async function clickText(page, text, options = {}) {
  const loc = page.getByText(text, { exact: options.exact ?? true }).first();
  await loc.waitFor({ state: 'visible', timeout: 30_000 });
  await loc.click();
  await page.waitForTimeout(600);
}

async function captureFlow(context, vp) {
  const outDir = join(ROOT, vp.dir);
  mkdirSync(outDir, { recursive: true });

  const page = await context.newPage();
  await page.setViewportSize({ width: vp.width, height: vp.height });

  await waitForApp(page);

  const shot = async (slug) => {
    const path = join(outDir, `${vp.name}-${slug}.png`);
    await page.screenshot({ path, fullPage: false });
    console.log('wrote', path);
  };

  // 1) Home — Numbers mode
  await clickText(page, 'Numbers');
  await shot('01-home-numbers');

  // 2) Home — Animals mode
  await clickText(page, 'Animals');
  await shot('02-home-animals');

  // 3) Start Animals game (Cubs / Play)
  await clickText(page, 'Play');
  await page.waitForTimeout(1200);
  // Game screen usually shows "Chances" or erase
  await Promise.race([
    page.getByText(/chances/i).first().waitFor({ timeout: 20_000 }),
    page.getByText('Erase').first().waitFor({ timeout: 20_000 }),
  ]).catch(() => {});
  await page.waitForTimeout(800);
  await shot('03-game-animals');

  // 4) Back home, switch to Numbers, play Easy
  const back = page.getByLabel(/back|home/i).first();
  if (await back.count()) {
    await back.click();
  } else {
    // Fallback: reload to home
    await page.goto(BASE, { waitUntil: 'networkidle' });
    await page.getByText('Gummy Sudoku').first().waitFor();
  }
  await page.waitForTimeout(800);
  await clickText(page, 'Numbers');
  await clickText(page, 'Easy');
  await clickText(page, 'Play');
  await page.waitForTimeout(1200);
  await Promise.race([
    page.getByText(/chances/i).first().waitFor({ timeout: 20_000 }),
    page.getByText('Erase').first().waitFor({ timeout: 20_000 }),
  ]).catch(() => {});
  await page.waitForTimeout(800);
  await shot('04-game-numbers');

  await page.close();
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  try {
    for (const vp of VIEWPORTS) {
      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        deviceScaleFactor: vp.deviceScaleFactor,
        isMobile: vp.isMobile,
        hasTouch: true,
      });
      await captureFlow(context, vp);
      await context.close();
    }
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
