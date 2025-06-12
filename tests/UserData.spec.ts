import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

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
