import fs from 'fs';
import path from 'path';

export default async function globalTeardown() {
  const filePath = path.resolve('./.auth/user.json');
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}
