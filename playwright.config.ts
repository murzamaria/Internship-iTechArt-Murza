import { defineConfig } from '@playwright/test';
import { CustomLogger } from './custom-logger';
import dotenv from 'dotenv';
dotenv.config();

const baseProject = {
  dependencies: ['auth setup'],
  use: {
    storageState: './.auth/user.json',
  },
};

export default defineConfig({
  testDir: '.',
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
    launchOptions: {
      logger: new CustomLogger(),
    },
  },

  projects: [
    {
      name: 'auth setup',
      testMatch: /auth\.setup\.ts/,
      teardown: 'auth teardown',
    },
    {
      name: 'auth teardown',
      testMatch: /auth\.teardown\.ts/,
    },
    {
      ...baseProject,
      name: 'Chromium',
      use: {
        ...baseProject.use,
        browserName: 'chromium',
      },
    },
    {
      ...baseProject,
      name: 'Firefox',
      use: {
        ...baseProject.use,
        browserName: 'firefox',
      },
    },
    {
      ...baseProject,
      name: 'WebKit',
      timeout: 80 * 1000,
      use: {
        ...baseProject.use,
        browserName: 'webkit',
      },
    },
  ],
});
