import { Page, Locator } from '@playwright/test';
export class DeletionDialog {
  readonly page: Page;
  readonly modalHeader: Locator;
  readonly modalBody: Locator;
  readonly okButton: Locator;
  readonly cancelButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.modalHeader = page.locator('.modal-header');
    this.modalBody = page.locator('.modal-body');
    this.okButton = page.getByRole('button', { name: 'OK', exact: true });
    this.cancelButton = page.getByRole('button', { name: 'Cancel', exact: true });
  }
}
