import { test as base } from '@playwright/test';
import { Page } from '@playwright/test';
import { ProfilePage } from '../pages/profilePage';
import { blockImages } from '../utils/blockImages';

type MyFixtures = {
  startPage: Page;
};

export const test = base.extend<MyFixtures>({
  startPage: async ({ page }, use) => {
    await blockImages(page);
    const profilePage = new ProfilePage(page);
    await profilePage.goto();
    await use(page);
  },
});
export { expect } from '@playwright/test';
