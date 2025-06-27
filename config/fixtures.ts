import { test as base } from '@playwright/test';
import { ProfilePage } from '../pages/profilePage';
import { blockImages } from '../utils/blockImages';

type MyFixtures = {
  startPage: ProfilePage;
};

export const test = base.extend<MyFixtures>({
  startPage: async ({ page }, use) => {
    const profilePage = new ProfilePage(page);
    await profilePage.goto();
    await blockImages(page);

    await use(profilePage);
  },
});
export { expect } from '@playwright/test';
