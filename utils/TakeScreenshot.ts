import { Page } from '@playwright/test';

export async function takeScreenshot(page: Page) {
  await page.screenshot({ path: 'screenshot.png', fullPage: true });
}
