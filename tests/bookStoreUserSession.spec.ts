import { test, expect } from '../config/fixtures';
import { BookstorePage } from '../pages/bookstorePage';
import { takeScreenshot } from '../utils/takeScreenshot';
import { getRandom } from '../utils/getRandom';
import { decodeTime } from '../utils/decodeTime';
import { getCookies } from '../utils/getCookies';
import { getUserdata } from '../utils/getUserdata';
import { modifyBookInfo } from '../utils/modifyBookInfo';

test('Full session test: login, cookie validation, bookstore API&UI checks', async ({
  startPage,
}) => {
  const bookstorePage = new BookstorePage(startPage.page);
  let userID;
  let userName;
  let expires;
  let token;

  await test.step('Check for successful login', async () => {
    await expect(startPage.page).toHaveURL(`${process.env.BASE_URL!}/profile`);
    await expect(startPage.logoutButton).toBeEnabled();
  });

  await test.step('Get cookies values', async () => {
    ({ userID, userName, expires, token } = await getCookies(startPage.page, [
      'userID',
      'userName',
      'expires',
      'token',
    ]));
  });

  await test.step('UserID check', async () => {
    await expect(userID).toBeTruthy();
    await expect(userID).not.toBe('');
  });

  await test.step('UserName check', async () => {
    await expect(userName).toEqual(process.env.DEMO_QA_USERNAME!);
  });

  await test.step('Expires time check', async () => {
    const decodedTime = decodeTime(expires);
    const nowTime = Date.now();
    await expect(decodedTime).toBeGreaterThan(nowTime);
  });

  await test.step('Token check', async () => {
    await expect(token).toBeTruthy();
    await expect(token).toMatch(/[a-zA-Z0-9]/);
  });

  let responseBookstore;
  await test.step('Capture response from Bookstore', async () => {
    responseBookstore = await bookstorePage.getBookstoreResponse();
  });

  await test.step('Take screenshot', async () => {
    await takeScreenshot(startPage.page);
  });

  await test.step('Check response and books amount', async () => {
    await expect(responseBookstore.ok()).toBeTruthy();
    const json = await responseBookstore.json();
    const booksArray = json.books;
    await expect(bookstorePage.bookItem).toHaveCount(booksArray.length);
  });

  await test.step('Modify book pages', async () => {
    const randomPages = await getRandom(1, 1000);
    await modifyBookInfo(startPage.page, 'pages', randomPages);
  });

  await test.step('Click random book', async () => {
    await bookstorePage.clickRandomBook();
  });

  let responseUserdata;

  await test.step('Request for userdata', async () => {
    responseUserdata = await getUserdata(startPage.page.request, userID, token);
  });

  await test.step('Check for successful userdata response', async () => {
    await expect(responseUserdata.ok()).toBeTruthy();
  });

  await test.step('Check username and user books', async () => {
    const userData = await responseUserdata.json();
    await expect(userData.books).toEqual([]);
    await expect(userData.username).toMatch(process.env.DEMO_QA_USERNAME!);
  });
});
