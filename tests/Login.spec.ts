import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

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
