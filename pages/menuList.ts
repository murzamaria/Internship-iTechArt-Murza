import { Page, Locator } from '@playwright/test';

export class Menu {
  readonly page: Page;
  readonly loginButton: Locator;
  readonly bookStoreButton: Locator;
  readonly profileButton: Locator;
  readonly bookStoreApiButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.loginButton = page.getByText('Login', { exact: true });
    this.bookStoreButton = page.getByText('Book Store', { exact: true });
    this.profileButton = page.getByText('Profile', { exact: true });
    this.bookStoreApiButton = page.getByText('Book Store API', { exact: true });
  }

  async clickLogin() {
    await this.loginButton.click();
  }

  async clickBookStore() {
    await this.bookStoreButton.click();
  }

  async clickProfile() {
    await this.profileButton.click();
  }

  async clickBookStoreApi() {
    await this.bookStoreApiButton.click();
  }
}
