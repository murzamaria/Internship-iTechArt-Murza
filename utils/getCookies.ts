import { Page } from '@playwright/test';

export async function getCookies(page: Page, cookieNames: string[]) {
  const context = page.context();
  const cookies = await context.cookies();

  const result: Record<string, string | undefined> = {};
  for (const cookie of cookieNames) {
    const value = cookies.find((c) => c.name === cookie)?.value;
    result[cookie] = value;
  }
  return result;
}
