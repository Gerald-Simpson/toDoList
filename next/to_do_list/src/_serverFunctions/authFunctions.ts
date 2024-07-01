import { listTitles, listItems, tokenResponse } from './models.ts';

export async function fetchApiAccessToken(): Promise<string> {
  try {
    const tokenRes = await fetch(process.env.API_POST_URL!, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: process.env.API_BODY,
    });

    const tempRes: tokenResponse = await tokenRes.json();
    const apiAccessToken: string = 'BEARER ' + tempRes.access_token;
    return apiAccessToken;
  } catch (error) {
    console.error(error);
    throw new Error('failed to fetch apiAccessToken');
  }
}
