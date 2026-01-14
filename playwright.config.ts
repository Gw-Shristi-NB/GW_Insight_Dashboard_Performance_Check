import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  use: {
    headless: false,
    baseURL: 'https://live02.guardware.com.au/ss4/webadmin/login',
    viewport: { width: 1280, height: 720 }
  },
  reporter: [['list']],
  projects: [
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },
    {
      name: 'chromium',
      use: {
        storageState: 'auth-restricted.json',
      },
      dependencies: ['setup'],
    },
  ],
});
