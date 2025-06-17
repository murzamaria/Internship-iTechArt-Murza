import { Locator } from '@playwright/test';
import { BasePage } from '../pages/BasePage';

export class BookstorePage extends BasePage {
  readonly bookItem: Locator;

  constructor(page) {
    super(page);
    this.bookItem = page.locator('.mr-2');
  }

  async goto() {
    await super.goto('/books');
  }

  async goToBookStore() {
    await this.page.getByText('Book Store', { exact: true }).click();
  }

  async clickRandomBook() {
    const booksCountUI = await this.page.locator('.mr-2').count();
    const randomBook = Math.floor(Math.random() * booksCountUI);
    await this.page.locator('//*[@role="rowgroup"]').nth(randomBook).click();
  }

  async getBookstoreResponse() {
    const response = await this.page.waitForResponse(`${process.env.BASE_URL!}/BookStore/v1/Books`);
    return response;
  }
}
