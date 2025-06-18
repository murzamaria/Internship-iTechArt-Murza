import { Locator } from '@playwright/test';
import { BasePage } from './basePage';
import { getRandom } from '../utils/getRandom';
import { Menu } from './menuList';

export class BookstorePage extends BasePage {
  readonly bookItem: Locator;

  constructor(page) {
    super(page);
    this.bookItem = page.locator('.mr-2');
  }

  async goto() {
    await super.goto('/books');
  }

  async clickRandomBook() {
    const booksCountUI = await this.bookItem.count();
    const randomBook = await getRandom(1, booksCountUI);
    await this.bookItem.nth(randomBook).click();
  }

  async getBookstoreResponse() {
    const menu = new Menu(this.page);
    const [response] = await Promise.all([
      this.page.waitForResponse(`${process.env.BASE_URL!}/BookStore/v1/Books`),
      menu.clickBookStore(),
    ]);
    return response;
  }
}
