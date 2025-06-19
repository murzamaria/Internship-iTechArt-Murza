import { Page } from '@playwright/test';

export async function modifyBookInfo(page: Page, paramName: string, newValue: string | number) {
  await page.route(`${process.env.BASE_URL!}/BookStore/v1/Book`, async (route) => {
    const response = await route.fetch();
    const json = await response.json();
    json[paramName] = newValue;
    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify(json),
    });
  });
}
