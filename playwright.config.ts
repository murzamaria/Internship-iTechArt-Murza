import { defineConfig } from '@playwright/test';
import { CustomLogger } from './custom-logger';
import dotenv from 'dotenv';
dotenv.config();

export default defineConfig({
  testDir: 'tests',
  timeout: 70 * 1000,
  expect: {
    timeout: 5000,
  },
  fullyParallel: true,
  reporter: [['list'], ['html', { open: 'never' }]],

  use: {
    headless: true,
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
    //viewport: { width: 1280, height: 720 },
    launchOptions: {
      logger: new CustomLogger(),
    },
  },

  projects: [
    {
      name: 'Chromium',
      use: {
        browserName: 'chromium',
      },
    },
    {
      name: 'Firefox',
      use: {
        browserName: 'firefox',
      },
    },
    {
      name: 'WebKit',
      timeout: 80 * 1000,
      use: {
        browserName: 'webkit',
      },
    },
  ],
});
