import { Page, Locator } from '@playwright/test';

export class Menu {
  readonly page: Page;
  readonly loginButton: Locator;
  readonly bookStoreButton: Locator;
  readonly profileButton: Locator;
  readonly bookStoreApiButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.loginButton = page.locator('.menu-list').getByText('Login', { exact: true });
    this.bookStoreButton = page.locator('.menu-list').getByText('Book Store', { exact: true });
    this.profileButton = page.locator('.menu-list').getByText('Profile', { exact: true });
    this.bookStoreApiButton = page
      .locator('.menu-list')
      .getByText('Book Store API', { exact: true });
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
