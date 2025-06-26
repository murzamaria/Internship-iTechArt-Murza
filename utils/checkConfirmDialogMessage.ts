import { Page, expect } from '@playwright/test';

export async function checkMessageOfConfirmDialog(page: Page, expectedMessage: string) {
  const dialog = await page.waitForEvent('dialog');
  expect(dialog.message()).toBe(expectedMessage);
  await dialog.accept();
}
