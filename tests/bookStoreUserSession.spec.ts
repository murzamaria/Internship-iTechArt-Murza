import { test, expect } from '@playwright/test';
import { BookstorePage } from '../pages/bookstorePage';
import { ProfilePage } from '../pages/profilePage';
import { blockImages } from '../utils/blockImages';
import { takeScreenshot } from '../utils/takeScreenshot';
import { getRandom } from '../utils/getRandom';
import { decodeTime } from '../utils/decodeTime';
import { getCookies } from '../utils/getCookies';
import { getUserdata } from '../utils/getUserdata';
import { modifyBookInfo } from '../utils/modifyBookInfo';

test('Full session test: login, cookie validation, bookstore API&UI checks', async ({ page }) => {
  const bookstorePage = new BookstorePage(page);
  const profilePage = new ProfilePage(page);

  let userID;
  let userName;
  let expires;
  let token;

  await test.step('Check for successful login', async () => {
    await profilePage.goto();
    await expect(page).toHaveURL(`${process.env.BASE_URL!}/profile`);
    await expect(profilePage.logoutButton).toBeEnabled();
  });

  await test.step('Get cookies values', async () => {
    ({ userID, userName, expires, token } = await getCookies(page, [
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

  await test.step('Block images', async () => {
    await blockImages(page);
  });

  let responseBookstore;
  await test.step('Capture response from Bookstore', async () => {
    responseBookstore = await bookstorePage.getBookstoreResponse();
  });

  await test.step('Take screenshot', async () => {
    await takeScreenshot(page);
  });

  await test.step('Check response and books amount', async () => {
    await expect(responseBookstore.ok()).toBeTruthy();
    const json = await responseBookstore.json();
    const booksArray = json.books;
    await expect(bookstorePage.bookItem).toHaveCount(booksArray.length);
  });

  await test.step('Modify book pages', async () => {
    const randomPages = await getRandom(1, 1000);
    await modifyBookInfo(page, 'pages', randomPages);
  });

  await test.step('Click random book', async () => {
    await bookstorePage.clickRandomBook();
  });

  let responseUserdata;

  await test.step('Request for userdata', async () => {
    responseUserdata = await getUserdata(page.request, userID, token);
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
