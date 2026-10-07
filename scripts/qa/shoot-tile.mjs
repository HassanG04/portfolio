import { chromium } from 'playwright';
import path from 'path';

const fileUrl = 'file://' + path.resolve('docs/style-tile.html');
const outDir = path.resolve('docs/shots/U-D');

async function shoot() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(fileUrl);
  
  // 1440 Light
  await page.emulateMedia({ colorScheme: 'light' });
  await page.setViewportSize({ width: 1440, height: 1600 });
  await page.screenshot({ path: path.join(outDir, 'tile-1440-light.png'), fullPage: true });

  // 1440 Dark
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.screenshot({ path: path.join(outDir, 'tile-1440-dark.png'), fullPage: true });

  // 390 Light
  await page.emulateMedia({ colorScheme: 'light' });
  await page.setViewportSize({ width: 390, height: 2000 });
  await page.screenshot({ path: path.join(outDir, 'tile-390-light.png'), fullPage: true });

  // 390 Dark
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.screenshot({ path: path.join(outDir, 'tile-390-dark.png'), fullPage: true });

  await browser.close();
  console.log('Screenshots saved to ' + outDir);
}

shoot().catch(console.error);
