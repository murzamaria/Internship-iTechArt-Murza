import { test, expect, request } from '@playwright/test';
import fs from 'fs/promises';

let creds: { username: string; password: string };
test.beforeAll(async () => {
  const data = await fs.readFile('properties.json', 'utf-8');
  creds = JSON.parse(data);
});

test('Task3', async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('https://demoqa.com/login');
  await page.getByPlaceholder('UserName').fill(creds.username);
  await page.getByPlaceholder('Password').fill(creds.password);
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForURL('**/profile', { timeout: 10000 });

  // проверяю, что пользователь авторизован
  await expect(page).toHaveURL('https://demoqa.com/profile');
  await expect(page.getByText('Log out')).toBeEnabled();

  //проверка куков: userID, userName, expires, token
  const cookies = await context.cookies();

  const userID = cookies.find((c) => c.name === 'userID');
  expect(userID).toBeTruthy();
  await expect(userID?.value).not.toBe('');

  const userName = cookies.find((c) => c.name === 'userName');
  await expect(userName?.value).toEqual(creds.username);

  const expires = cookies.find((c) => c.name === 'expires');
  const nowTime = Date.now();
  const decoded = expires?.value ? decodeURIComponent(expires.value) : '';
  const expiresTime = decoded ? new Date(decoded).getTime() : 0;
  await expect(expiresTime).toBeGreaterThan(nowTime);

  const token = cookies.find((c) => c.name === 'token');
  expect(token).toBeTruthy();
  await expect(token?.value).toMatch(/[a-zA-Z0-9]/);

  // - через page.route заблокировать все картинки
  // - через page.waitForResponse создать ожидание для перехвата GET запроса https://demoqa.com/BookStore/v1/Books
  // - в меню слева кликнуть Book Store
  // скриншот

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

  //кликнуть на случайную книгу
  const booksCountUI = await page.locator('.mr-2').count();
  const randomBook = Math.floor(Math.random() * booksCountUI);
  await page.locator('//*[@role="rowgroup"]').nth(randomBook).click();

  //выполнить API запрос (с помощью PW)
  const responsePW = await page.request.get(`https://demoqa.com/Account/v1/User/${userID?.value}`, {
    headers: {
      Authorization: `Bearer ${token?.value}`,
    },
  });

  // - проверить ответ
  await expect(responsePW.ok()).toBeTruthy();
  const userData = await responsePW.json();
  await expect(userData.books).toEqual([]);
  await expect(userData.username).toMatch(creds.username);
});
