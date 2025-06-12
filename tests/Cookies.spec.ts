import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { decodeTime } from '../utils/DecodeTime';

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
