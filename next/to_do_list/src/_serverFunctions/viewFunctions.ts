import { listTitles, listItems, tokenResponse } from './models.ts';
export async function fetchListTitles(
  cookieId: string,
  apiAccessToken: string,
): Promise<{ listTitles: listTitles[] }> {
  let getUrl: string =
    process.env.NEXT_PUBLIC_EXPRESS_HOST_NAME +
    '/fetchLists/?cookieId=' +
    cookieId;

  try {
    const res = await fetch(getUrl, {
      method: 'GET',
      headers: {
        authorization: apiAccessToken,
      },
    });
    const listTitles: { listTitles: listTitles[] } = await res.json();
    return { listTitles: listTitles.listTitles };
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch listTitles');
  }
}

export async function fetchItems(
  titleId: number,
  cookieId: string,
  apiAccessToken: string,
) {
  if (titleId == 0) {
    return [];
  }
  let getUrl: string =
    process.env.NEXT_PUBLIC_EXPRESS_HOST_NAME +
    '/fetchItems/?titleId=' +
    titleId +
    '&cookieId=' +
    cookieId;

  try {
    const res = await fetch(getUrl, {
      method: 'GET',
      headers: {
        authorization: apiAccessToken,
      },
    });
    const tempRes: any = await res.json();
    const listItems: listItems[] = tempRes.listItems;
    return listItems;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch items');
  }
}
