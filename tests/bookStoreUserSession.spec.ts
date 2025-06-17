import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { BookstorePage } from '../pages/BookstorePage';
import { Book } from '../pages/Book';
import { blockImages } from '../utils/blockImages';
import { takeScreenshot } from '../utils/takeScreenshot';
import { getRandom } from '../utils/getRandom';
import { decodeTime } from '../utils/decodeTime';
import { getCookies } from '../utils/getCookies';
import { getUserdata } from '../utils/getUserdata';

test('Full session test: login, cookie validation, bookstore API&UI checks', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const bookstorePage = new BookstorePage(page);
  const bookObject = new Book(page);

  let userID;
  let userName;
  let expires;
  let token;

  await test.step('Login with valid creds', async () => {
    await loginPage.goto();
    await loginPage.login(process.env.DEMO_QA_USERNAME!, process.env.DEMO_QA_PASSWORD!);
  });

  await test.step('Check for successful login', async () => {
    await expect(loginPage.page).toHaveURL('https://demoqa.com/profile');
    await expect(loginPage.page.getByText('Log out')).toBeEnabled();
  });

  await test.step('Get cookies values', async () => {
    ({ userID, userName, expires, token } = await getCookies(page));
  });

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

  await test.step('Set timeout and block images', async () => {
    test.setTimeout(60_000);
    await blockImages(page);
  });

  let responseBookstore;
  await test.step('Capture response from Bookstore', async () => {
    responseBookstore = await bookstorePage.getBookstoreResponse();
  });

  await test.step('Take screenshot', async () => {
    test.setTimeout(30_000);
    await takeScreenshot(page);
  });

  await test.step('Check response and books amount', async () => {
    await expect(responseBookstore.ok()).toBeTruthy();
    const json = await responseBookstore.json();
    const booksArray = json.books;
    await expect(bookstorePage.bookItem).toHaveCount(booksArray.length);
  });

  let randomPages;
  await test.step('Modify book pages', async () => {
    randomPages = getRandom(1, 1000);
    await bookObject.modifyBookPages(randomPages);
  });

  await test.step('Click random book', async () => {
    await bookstorePage.clickRandomBook();
  });

  // потенциальный тест на сравнение изменённого кол-ва страниц в джсоне с тем,
  // что на юае - но на сайте при открытии книги нет ничего
  /*  await test.step('Check book pages replacement', async () => {
    await expect(bookObject.pagesInfo).toContainText(randomPages);
  });*/

  let responseUserdata;

  await test.step('Request for userdata', async () => {
    responseUserdata = await getUserdata(page.request, userID, token);
  });

  await test.step('Check for successful userdata response', async () => {
    //console.log('Status:', responseUserdata.status());
    await expect(responseUserdata.ok()).toBeTruthy();
  });

  await test.step('Check username and user books', async () => {
    const userData = await responseUserdata.json();
    await expect(userData.books).toEqual([]);
    await expect(userData.username).toMatch(process.env.DEMO_QA_USERNAME!);
  });
});
