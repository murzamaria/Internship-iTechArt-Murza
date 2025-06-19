import { APIRequestContext } from '@playwright/test';

export async function getUserdata(request: APIRequestContext, userID: string, token: string) {
  const responseUserdata = await request.get(`https://demoqa.com/Account/v1/User/${userID}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return responseUserdata;
}
