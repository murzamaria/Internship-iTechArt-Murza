import { chromium } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';
import { LoginPage } from '../pages/loginPage';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const authFile = path.join(__dirname, '../.auth/user.json');

export default async function globalSetup() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login(process.env.DEMO_QA_USERNAME!, process.env.DEMO_QA_PASSWORD!);

  await page.context().storageState({ path: authFile });
}
