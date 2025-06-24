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

  getRow(row: number) {
    return this.page.locator('.rt-tr-group').nth(row - 1);
  }

  getTableCell(row: number, column: number) {
    return this.getRow(row)
      .locator('.rt-td')
      .nth(column - 1);
  }

  async deleteBook(row: number) {
    await this.getRow(row).getByTitle('Delete', { exact: true }).click();
  }
}
