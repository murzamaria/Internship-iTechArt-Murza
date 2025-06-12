import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { BookstorePage } from '../pages/BookstorePage';
import { blockImages } from '../utils/BlockImages';
import { takeScreenshot } from '../utils/TakeScreenshot';
import { getRandom } from '../utils/Randomizer';

test('Bookstore', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const bookstorePage = new BookstorePage(page);

  await test.step('Login with valid creds', async () => {
    await loginPage.goto();
    await loginPage.login(process.env.DEMO_QA_USERNAME!, process.env.DEMO_QA_PASSWORD!);
  });
  await test.step('Set timeout and block images', async () => {
    test.setTimeout(60_000);
    await blockImages(page);
  });

  let responseBookstore;
  await test.step('Capture response from Bookstore', async () => {
    [responseBookstore] = await Promise.all([
      page.waitForResponse('https://demoqa.com/BookStore/v1/Books'),
      await page.getByText('Book Store', { exact: true }).click(),
    ]);
  });

  await test.step('Take screenshot', async () => {
    await takeScreenshot(page);
  });

  await test.step('Books amount check', async () => {
    await expect(responseBookstore.ok()).toBeTruthy();
    const json = await responseBookstore.json();
    const booksArray = json.books;
    await expect(bookstorePage.bookItem).toHaveCount(booksArray.length);
  });

  await test.step('Click random book', async () => {
    await bookstorePage.clickRandomBook();
  });

  await test.step('Modify book pages in the response', async () => {
    await page.route('https://demoqa.com/BookStore/v1/Book', async (route) => {
      const response = await route.fetch();
      const json = await response.json();
      json.pages = getRandom(1, 1000);
      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify(json),
      });
    });
  });
});
