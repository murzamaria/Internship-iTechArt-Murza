import { Page, Locator } from '@playwright/test';

export class BookstorePage {
  readonly page: Page;
  readonly bookItem: Locator;

  constructor(page: Page) {
    this.page = page;
    this.bookItem = page.locator('.mr-2');
  }

  async goto() {
    await this.page.goto('https://demoqa.com/books');
  }

  async clickRandomBook() {
    const booksCountUI = await this.page.locator('.mr-2').count();
    const randomBook = Math.floor(Math.random() * booksCountUI);
    await this.page.locator('//*[@role="rowgroup"]').nth(randomBook).click();
  }
}
