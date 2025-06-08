import { test, expect } from '@playwright/test';

import dotenv from 'dotenv';
dotenv.config();

test('Task3', async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();

  let userID: string | undefined;
  let token: string | undefined;

  await test.step('Log in', async () => {
    await page.goto('https://demoqa.com/login');
    await page.getByPlaceholder('UserName').fill(process.env.DEMO_QA_USERNAME!);
    await page.getByPlaceholder('Password').fill(process.env.DEMO_QA_PASSWORD!);
    await page.getByRole('button', { name: 'Login' }).click();
    await page.waitForURL('https://demoqa.com/profile', { timeout: 10000 });

    await expect(page).toHaveURL('https://demoqa.com/profile');
    await expect(page.getByText('Log out')).toBeEnabled();
  });

  await test.step('Cookies checks', async () => {
    const cookies = await context.cookies();

    userID = cookies.find((c) => c.name === 'userID')?.value;
    expect(userID).toBeTruthy();
    await expect(userID).not.toBe('');

    const userName = cookies.find((c) => c.name === 'userName');
    await expect(userName?.value).toEqual(process.env.DEMO_QA_USERNAME!);

    const expires = cookies.find((c) => c.name === 'expires');
    const nowTime = Date.now();
    const decoded = expires?.value ? decodeURIComponent(expires.value) : '';
    const expiresTime = decoded ? new Date(decoded).getTime() : 0;
    await expect(expiresTime).toBeGreaterThan(nowTime);

    token = cookies.find((c) => c.name === 'token')?.value;
    expect(token).toBeTruthy();
    await expect(token).toMatch(/[a-zA-Z0-9]/);
  });

  await test.step('Books Store checks and screenshot', async () => {
    await page.route('**/*.{png,jpg,jpeg}', (route) => route.abort());
    const [response] = await Promise.all([
      page.waitForResponse('https://demoqa.com/BookStore/v1/Books'),
      page.getByText('Book Store', { exact: true }).click(),
    ]);
    await page.screenshot({ path: 'screenshot.png', fullPage: true });

    //проверить перехваченный GET запрос
    await expect(response.ok()).toBeTruthy();
    const json = await response.json();
    const booksArray = json.books;
    await expect(page.locator('.mr-2')).toHaveCount(booksArray.length);
  });

  await test.step('Book data modification', async () => {
    // функция рандомайзера
    function getRandomPages(min = 1, max = 1000) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    //модификация запроса
    await page.route('https://demoqa.com/BookStore/v1/Book', async (route) => {
      const response = await route.fetch();
      const json = await response.json();
      json.pages = getRandomPages();

      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify(json),
      });
    });
  });
  await test.step('Click random book', async () => {
    //кликнуть на случайную книгу
    const booksCountUI = await page.locator('.mr-2').count();
    const randomBook = Math.floor(Math.random() * booksCountUI);
    await page.locator('//*[@role="rowgroup"]').nth(randomBook).click();
  });

  //выполнить API запрос (с помощью PW)
  await test.step('User Data check', async () => {
    const responsePW = await page.request.get(`https://demoqa.com/Account/v1/User/${userID}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // - проверить ответ
    await expect(responsePW.ok()).toBeTruthy();
    const userData = await responsePW.json();
    await expect(userData.books).toEqual([]);
    await expect(userData.username).toMatch(process.env.DEMO_QA_USERNAME!);
  });
});
