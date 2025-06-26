import { Page, Locator } from '@playwright/test';
import { BasePage } from './basePage';

export class ProfilePage extends BasePage {
  readonly logoutButton: Locator;
  readonly bookItem: Locator;
  readonly deleteAllBooksButton: Locator;

  constructor(page: Page) {
    super(page);
    this.logoutButton = page.getByText('Log out');
    this.bookItem = page.locator('.mr-2');
    this.deleteAllBooksButton = page.getByRole('button', { name: 'Delete All Books' });
  }

  async goto() {
    await super.goto('/profile');
  }

  getRowLocator(row: number) {
    return this.page.locator('.rt-tr-group').nth(row - 1);
  }

  getTableCellLocator(row: number, column: number) {
    return this.getRowLocator(row)
      .locator('.rt-td')
      .nth(column - 1);
  }

  async deleteBook(row: number) {
    await this.getRowLocator(row).getByTitle('Delete', { exact: true }).click();
  }

  async getRowIndexByTitle(title: string): Promise<number | undefined> {
    const rows = await this.bookItem.all();
    for (let i = 1; i <= rows.length; i++) {
      const cell = await this.getTableCellLocator(i, 2).textContent();
      if (cell?.trim() == title) {
        return i;
      }
    }
    return undefined;
  }
}
