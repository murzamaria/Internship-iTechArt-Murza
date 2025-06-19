import { test, expect } from '@playwright/test';

test('Task3', async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();

  let userID: string | undefined;
  let token: string | undefined;

  await test.step('Open login page', async () => {
    await page.goto('https://demoqa.com/login');
  });
  await test.step('Fill in the username and password', async () => {
    await page.getByPlaceholder('UserName').fill(process.env.DEMO_QA_USERNAME!);
    await page.getByPlaceholder('Password').fill(process.env.DEMO_QA_PASSWORD!);
  });
  await test.step('Check for successful login', async () => {
    await page.getByRole('button', { name: 'Login' }).click();
    await page.waitForURL('https://demoqa.com/profile', { timeout: 30000 });
    await expect(page).toHaveURL('https://demoqa.com/profile');
    await expect(page.getByText('Log out')).toBeEnabled();
  });

  const cookies = await context.cookies();

  await test.step('UserID check in cookies', async () => {
    userID = cookies.find((c) => c.name === 'userID')?.value;
    await expect(userID).toBeTruthy();
    await expect(userID).not.toBe('');
  });

  await test.step('UserName check in cookies', async () => {
    const userName = cookies.find((c) => c.name === 'userName');
    await expect(userName?.value).toEqual(process.env.DEMO_QA_USERNAME!);
  });

  let expires;
  let decodedTime;
  let expiresTime;

  await test.step('Get expires time cookie', async () => {
    expires = cookies.find((c) => c.name === 'expires');
  });

  await test.step('Decode expires time value', async () => {
    decodedTime = expires?.value ? decodeURIComponent(expires.value) : '';
    expiresTime = decodedTime ? new Date(decodedTime).getTime() : 0;
  });
  await test.step('Expires time check', async () => {
    const nowTime = Date.now();
    await expect(expiresTime).toBeGreaterThan(nowTime);
  });

  await test.step('Token check in cookies', async () => {
    token = cookies.find((c) => c.name === 'token')?.value;
    await expect(token).toBeTruthy();
    await expect(token).toMatch(/[a-zA-Z0-9]/);
  });

  let responseBookstore;

  await test.step('Set timeout and block images', async () => {
    test.setTimeout(60_000);
    await page.route('**/*.{png,jpg,jpeg}', (route) => route.abort());
  });

  await test.step('Capture response from Bookstore', async () => {
    [responseBookstore] = await Promise.all([
      page.waitForResponse('https://demoqa.com/BookStore/v1/Books'),
      page.getByText('Book Store', { exact: true }).click(),
    ]);
  });

  await test.step('Take screenshot', async () => {
    await page.screenshot({ path: 'screenshot.png', fullPage: true });
  });

  await test.step('Books amount check', async () => {
    await expect(responseBookstore.ok()).toBeTruthy();
    const json = await responseBookstore.json();
    const booksArray = json.books;
    await expect(page.locator('.mr-2')).toHaveCount(booksArray.length);
  });

  function getRandomPages(min = 1, max = 1000) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  await test.step('Modify book pages in the response', async () => {
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
    const booksCountUI = await page.locator('.mr-2').count();
    const randomBook = Math.floor(Math.random() * booksCountUI);
    await page.locator('//*[@role="rowgroup"]').nth(randomBook).click();
  });

  let responseUserdata;
  await test.step('API request for userdata', async () => {
    responseUserdata = await page.request.get(`https://demoqa.com/Account/v1/User/${userID}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  });
  await test.step('Check for successful userdata response', async () => {
    console.log('Status:', responseUserdata.status());
    await expect(responseUserdata.ok()).toBeTruthy();
  });

  await test.step('Check userdata', async () => {
    const userData = await responseUserdata.json();
    await expect(userData.books).toEqual([]);
    await expect(userData.username).toMatch(process.env.DEMO_QA_USERNAME!);
  });
});
