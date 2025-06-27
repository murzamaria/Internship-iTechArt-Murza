import { test as setup } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';
import { LoginPage } from '../pages/loginPage';

setup('Setup auth session', async ({ page }) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const authFile = path.join(__dirname, '../.auth/user.json');

  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login(process.env.DEMO_QA_USERNAME!, process.env.DEMO_QA_PASSWORD!);

  await page.context().storageState({ path: authFile });
});
