import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from '../pages/BasePage';

export class LoginPage extends BasePage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.getByPlaceholder('UserName');
    this.passwordInput = page.getByPlaceholder('Password');
    this.loginButton = page.getByRole('button', { name: 'Login' });
  }

  async goto() {
    await super.goto('/login');
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await expect(this.loginButton).toBeVisible();
    await expect(this.loginButton).toBeEnabled();
    await this.loginButton.click();
    await this.page.waitForURL(`${process.env.BASE_URL!}/profile`, { timeout: 40000 });
  }

  async loginAndGetCookies(username: string, password: string) {
    await this.goto();
    await this.login(username, password);

    const context = this.page.context();
    const cookies = await context.cookies();

    const userID = cookies.find((c) => c.name === 'userID')?.value;
    const userName = cookies.find((c) => c.name === 'userName');
    const expires = cookies.find((c) => c.name === 'expires');
    const token = cookies.find((c) => c.name === 'token')?.value;

    return { userID, userName, expires, token };
  }
}
