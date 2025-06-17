import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { BookstorePage } from '../pages/BookstorePage';
import { blockImages } from '../utils/BlockImages';
import { takeScreenshot } from '../utils/TakeScreenshot';
import { Book } from '../pages/BookPage';
import { getRandom } from '../utils/Randomizer';
import { decodeTime } from '../utils/DecodeTime';

test('Login', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await test.step('Login with valid creds', async () => {
    await loginPage.goto();
    await loginPage.login(process.env.DEMO_QA_USERNAME!, process.env.DEMO_QA_PASSWORD!);
  });
  await test.step('Check for successful login', async () => {
    await expect(loginPage.page).toHaveURL('https://demoqa.com/profile');
    await expect(loginPage.page.getByText('Log out')).toBeEnabled();
  });
});

test('Login and get cookies values', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const { userID, userName, expires, token } = await loginPage.loginAndGetCookies(
    process.env.DEMO_QA_USERNAME!,
    process.env.DEMO_QA_PASSWORD!,
  );

  await test.step('UserID check', async () => {
    await expect(userID).toBeTruthy();
    await expect(userID).not.toBe('');
  });

  await test.step('UserName check', async () => {
    await expect(userName?.value).toEqual(process.env.DEMO_QA_USERNAME!);
  });

  await test.step('Expires time check', async () => {
    const decodedTime = decodeTime(expires?.value);
    const nowTime = Date.now();
    await expect(decodedTime).toBeGreaterThan(nowTime);
  });

  await test.step('Token check', async () => {
    await expect(token).toBeTruthy();
    await expect(token).toMatch(/[a-zA-Z0-9]/);
  });
});

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
      bookstorePage.getBookstoreResponse(),
      bookstorePage.goToBookStore(),
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
});

test('Replace book pages with random number', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const bookstorePage = new BookstorePage(page);
  const bookObject = new Book(page);

  await test.step('Login with valid creds', async () => {
    await loginPage.goto();
    await loginPage.login(process.env.DEMO_QA_USERNAME!, process.env.DEMO_QA_PASSWORD!);
  });

  await bookstorePage.goto();

  await test.step('Click random book', async () => {
    await bookstorePage.clickRandomBook();
  });
  let randomPages;
  await test.step('Modify book pages', async () => {
    randomPages = getRandom(1, 1000);
    await bookObject.modifyBookPages(randomPages);
  });
  /*потенциальный тест на сравнение изменённого кол-ва страниц в джсоне с тем, 
  что на юае - но на сайте при открытии книги нет ничего

  await test.step('Check book pages replacement', async () => {
    await expect(bookObject.pagesInfo).toContainText(randomPages);
  });*/
});

test('Check User Data', async ({ page }) => {
  let responseUserdata;
  let userID;
  let token;

  await test.step('Get userID and token', async () => {
    const loginPage = new LoginPage(page);
    ({ userID, token } = await loginPage.loginAndGetCookies(
      process.env.DEMO_QA_USERNAME!,
      process.env.DEMO_QA_PASSWORD!,
    ));
  });

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
