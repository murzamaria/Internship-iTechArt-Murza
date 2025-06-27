import fs from 'fs';
import path from 'path';
import { test as teardown } from '@playwright/test';

teardown('Global teardown', async ({}) => {
  const filePath = path.resolve('./.auth/user.json');
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
});
