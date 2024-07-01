import { listTitles, listItems, tokenResponse } from './models.ts';

export async function deleteTitle(
  cookieId: string,
  id: number,
  apiAccessToken: string,
) {
  let deleteTitleUrl: string =
    process.env.NEXT_PUBLIC_EXPRESS_HOST_NAME +
    '/deleteTitle/?id=' +
    id.toString() +
    '&cookieId=' +
    cookieId;

  try {
    const res = await fetch(deleteTitleUrl, {
      method: 'DELETE',
      headers: {
        authorization: apiAccessToken,
      },
    });

    if (res.status !== 200) {
      throw new Error('Failed to delete list title');
    }
    return res.status;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to delete list title');
  }
}

export async function deleteItem(
  id: number,
  cookieId: string,
  apiAccessToken: string,
) {
  let deleteItemUrl: string =
    process.env.NEXT_PUBLIC_EXPRESS_HOST_NAME +
    '/deleteItem/?id=' +
    id.toString() +
    '&cookieId=' +
    cookieId;

  try {
    const res = await fetch(deleteItemUrl, {
      method: 'DELETE',
      headers: {
        authorization: apiAccessToken!,
      },
    });
    if (res.status !== 200) {
      console.error(res);
      throw new Error('Failed to delete list item');
    }
    return res.status;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to delete list item');
  }
}
export async function completeItem(
  id: number,
  currentBool: boolean,
  cookieId: string,
  apiAccessToken: string,
) {
  let completeBool: string = '';
  if (currentBool) {
    completeBool = '0';
  } else if (!currentBool) {
    completeBool = '1';
  }
  let completeUrl: string =
    process.env.NEXT_PUBLIC_EXPRESS_HOST_NAME +
    '/complete/?id=' +
    id +
    '&completeBool=' +
    completeBool +
    '&cookieId=' +
    cookieId;

  try {
    const res = await fetch(completeUrl, {
      method: 'PATCH',
      headers: {
        authorization: apiAccessToken!,
      },
    });
    if (res.status !== 200) {
      console.error(res);
      throw new Error('Failed completing item');
    }

    return res.status;
  } catch (error) {
    console.error(error);
    throw new Error('Failed completing item');
  }
}

export async function createTitle(
  title: string,
  cookieId: string,
  apiAccessToken: string,
) {
  let createUrl: string =
    process.env.NEXT_PUBLIC_EXPRESS_HOST_NAME +
    '/createTitle/?cookieId=' +
    cookieId +
    '&title=' +
    title;

  try {
    const res = await fetch(createUrl, {
      method: 'POST',
      headers: {
        authorization: apiAccessToken,
      },
    });
    if (res.status !== 200) {
      console.error(res);
      throw new Error('Failed creating item');
    }
    return res.status;
  } catch (error) {
    console.error(error);
    throw new Error('Failed creating item');
  }
}

export async function createItem(
  activeListId: number,
  message: string,
  cookieId: string,
  apiAccessToken: string,
) {
  let createUrl: string =
    process.env.NEXT_PUBLIC_EXPRESS_HOST_NAME +
    '/createItem/?titleId=' +
    activeListId +
    '&message=' +
    message +
    '&cookieId=' +
    cookieId;

  try {
    const res = await fetch(createUrl, {
      method: 'POST',
      headers: {
        authorization: apiAccessToken,
      },
    });

    if (res.status !== 200) {
      console.error(res);
      throw new Error('Failed to create item');
    }
    return res.status;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to create item');
  }
}
