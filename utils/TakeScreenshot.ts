import { Page } from '@playwright/test';

export async function takeScreenshot(page: Page) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  await page.screenshot({ path: `screenshots/screenshot-${timestamp}.png`, fullPage: true });
}
