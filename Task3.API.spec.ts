import { test, expect, request } from '@playwright/test';
import fs from 'fs/promises';

let creds: { username: string; password: string };
test.beforeAll(async () => {
  const data = await fs.readFile('properties.json', 'utf-8');
  creds = JSON.parse(data);
});

test('Login to profile', async ({ browser }) => {
  //логинюсь через пост запрос и сохраняю кукис в state.js, т.к. httpCredentials не работает с https
  const apiContext = await request.newContext();
  const loginResponse = await apiContext.post('https://demoqa.com/Account/v1/Login', {
    data: {
      userName: creds.username,
      password: creds.password,
    },
  });

  const loginData = await loginResponse.json();

  await fs.writeFile(
    'state.json',
    JSON.stringify({
      cookies: [
        {
          name: 'userName',
          value: creds.username,
          domain: 'demoqa.com',
          path: '/',
          httpOnly: false,
          secure: false,
          sameSite: 'Lax',
        },
        {
          name: 'token',
          value: loginData.token,
          domain: 'demoqa.com',
          path: '/',
          httpOnly: false,
          secure: false,
          sameSite: 'Lax',
        },
        {
          name: 'userID',
          value: loginData.userId,
          domain: 'demoqa.com',
          path: '/',
          httpOnly: false,
          secure: false,
          sameSite: 'Lax',
        },
        {
          name: 'expires',
          value: loginData.expires,
          domain: 'demoqa.com',
          path: '/',
          httpOnly: false,
          secure: false,
          sameSite: 'Lax',
        },
      ],
      origins: [],
    }),
  );

  //создаю контекст и проверяю, что пользователь авторизован
  const context = await browser.newContext({ storageState: 'state.json' });
  const page = await context.newPage();
  await page.goto('https://demoqa.com/profile');
  await expect(page.getByRole('button', { name: 'Log out' })).toBeEnabled();
});

test('Bookstore', async ({ browser }) => {
  const context = await browser.newContext({ storageState: 'state.json' });
  const page = await context.newPage();
  await page.goto('https://demoqa.com/profile');

  //проверка куков: userID, userName, expires, token
  const cookies = await context.cookies();

  const userID = cookies.find((c) => c.name === 'userID');
  expect(userID).toBeTruthy();
  await expect(userID?.value).not.toBe('');

  const userName = cookies.find((c) => c.name === 'userName');
  await expect(userName?.value).toEqual(creds.username);

  const expires = cookies.find((c) => c.name === 'expires');
  const nowTime = Date.now();
  const expiresTime = expires ? new Date(expires.value).getTime() : 0;
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
  const booksCountUI = await page.locator('.mr-2').count();
  await expect(booksArray.length).toEqual(booksCountUI);

  // функция рандомайзера
  function getRandomPages(min = 1, max = 50) {
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
  await expect(Array.isArray(userData.books)).toBeTruthy();
  await expect(userData.username).toMatch(creds.username);
});
