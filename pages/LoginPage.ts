import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.getByPlaceholder('UserName');
    this.passwordInput = page.getByPlaceholder('Password');
    this.loginButton = page.getByRole('button', { name: 'Login' });
  }

  async goto() {
    await this.page.goto('https://demoqa.com/login', {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    });
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await expect(this.loginButton).toBeVisible();
    await expect(this.loginButton).toBeEnabled();
    await this.loginButton.click();
    await this.page.waitForURL('https://demoqa.com/profile', { timeout: 40000 });
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
