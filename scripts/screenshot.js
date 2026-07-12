import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const ACTOR_SLUG = 'getascraper/mahally-price-monitor';
const URL = `https://apify.com/${ACTOR_SLUG}`;
const OUTPUT = path.join(__dirname, '..', 'docs', 'hero-screenshot.png');

const browser = await chromium.launch({
  headless: true,
  args: ['--window-size=1280,900'],
});

const context = await browser.newContext({
  viewport: { width: 1280, height: 800 },
  deviceScaleFactor: 2,
  userAgent:
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 ' +
    '(KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
});

await context.addCookies([
  {
    name: 'apify_cookie_consent',
    value: 'true',
    domain: '.apify.com',
    path: '/',
  },
  {
    name: 'OptanonAlertBoxClosed',
    value: new Date().toISOString(),
    domain: '.apify.com',
    path: '/',
  },
  {
    name: 'OptanonConsent',
    value:
      'isGpcEnabled=0&datestamp=' +
      encodeURIComponent(new Date().toString()) +
      '&version=202304.1.0&hosts=&consentId=test&interactionCount=1&landingPath=NotLandingPage&groups=C0001%3A1%2CC0002%3A1%2CC0003%3A1%2CC0004%3A1',
    domain: '.apify.com',
    path: '/',
  },
]);

const page = await context.newPage();
await page.goto(URL, { waitUntil: 'load' });

try {
  const banner = page.locator('button:has-text("Accept"), button:has-text("Reject all")').first();
  if (await banner.isVisible({ timeout: 3000 })) {
    await banner.click();
    await page.waitForTimeout(1500);
  }
} catch {
  // No banner - continue
}

await page.waitForSelector('h1', { timeout: 15000 });
await page.waitForTimeout(3000);

await page.screenshot({
  path: OUTPUT,
  clip: { x: 0, y: 0, width: 1280, height: 800 },
  fullPage: false,
});

console.log(`Screenshot saved to ${OUTPUT}`);
await browser.close();
