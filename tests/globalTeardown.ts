import fs from 'fs';
import path from 'path';

export default async function globalTeardown() {
  const filePath = path.resolve('./.auth/user.json');
  if (fs.existsSync(filePath)) {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const storage = JSON.parse(fileContent);

    const cookies = storage.cookies || [];

    const userID = cookies.find((c) => c.name === 'userID')?.value;
    const token = cookies.find((c) => c.name === 'token')?.value;
    await fetch(`https://demoqa.com/BookStore/v1/Books?UserId=${userID}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  }
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}
