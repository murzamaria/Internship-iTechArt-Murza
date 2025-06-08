import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './Internship-Itechart-Murza',
  timeout: 30 * 1000,
  expect: {
    timeout: 5000,
  },
  fullyParallel: true,
  reporter: [['list'], ['html', { open: 'never' }]],

  use: {
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
    headless: false,
    viewport: { width: 1280, height: 720 },
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
      use: {
        browserName: 'webkit',
      },
    },
  ],
});
