import { Page } from '@playwright/test';

export async function getCookies(page: Page) {
  const context = page.context();
  const cookies = await context.cookies();

  const userID = cookies.find((c) => c.name === 'userID')?.value;
  const userName = cookies.find((c) => c.name === 'userName');
  const expires = cookies.find((c) => c.name === 'expires');
  const token = cookies.find((c) => c.name === 'token')?.value;

  return { userID, userName, expires, token };
}
