import { Page, Locator } from '@playwright/test';
import { BasePage } from './basePage';

export class ProfilePage extends BasePage {
  readonly logoutButton: Locator;

  constructor(page: Page) {
    super(page);
    this.logoutButton = page.getByText('Log out');
  }

  async goto() {
    await super.goto('/profile');
  }
}
