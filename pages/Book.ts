import { Page } from '@playwright/test';

export class Book {
  readonly page: Page;
  readonly baseUrl: string;

  constructor(page: Page) {
    this.page = page;
  }

  async modifyBookPages(pages: number) {
    await this.page.route(`${process.env.BASE_URL!}/BookStore/v1/Book`, async (route) => {
      const response = await route.fetch();
      const json = await response.json();
      json.pages = pages;
      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify(json),
      });
    });
  }
  /*
  get pagesInfo() {
    return this.page.getByText();
  }*/
}
