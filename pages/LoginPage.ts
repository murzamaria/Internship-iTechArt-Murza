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
}
