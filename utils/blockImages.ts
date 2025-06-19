import { Page } from '@playwright/test';

export async function blockImages(page: Page) {
  await page.route('**/*.{png,jpg,jpeg}', (route) => route.abort());
}
