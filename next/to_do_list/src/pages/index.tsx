import { space } from '../fonts';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useState, FormEvent } from 'react';

type listTitles = {
  id: string;
  cookieId: string;
  createdAt: Date;
  title: string;
};

type listItems = {
  id: string;
  titleId: number;
  cookieId: string;
  createdAt: Date;
  message: string;
  complete: boolean;
};

type tokenResponse = {
  access_token: string;
  expires_in: number;
  token_type: string;
};

export const getServerSideProps = (async (context) => {
  // using cookie middleware to assign an id that is used to load users lists
  let cookieId = context.req.cookies.id;
  // on first load, cookieId will be undefined, so extracted from headers.
  let firstLoadCookieId = context.res.getHeader('set-cookie');
  if (!cookieId && typeof firstLoadCookieId === 'object') {
    cookieId = firstLoadCookieId[0].slice(3, -8);
  }

  // fetching token to access api to pass to client side
  const tokenRes = await fetch(process.env.API_POST_URL!, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: process.env.API_BODY,
  });

  const tempRes: tokenResponse = await tokenRes.json();
  const apiAccessToken: string = 'BEARER ' + tempRes.access_token;

  // fetching list titles on server before first load
  let getUrl: string =
    process.env.NEXT_PUBLIC_EXPRESS_HOST_NAME +
    '/fetchLists/?cookieId=' +
    cookieId;

  const res = await fetch(getUrl, {
    method: 'GET',
    headers: {
      authorization: apiAccessToken!,
    },
  });

  const listTitles: { listTitles: listTitles[] } = await res.json();

  return {
    props: {
      listTitles: listTitles.listTitles,
      cookieId: cookieId,
      apiAccessToken: apiAccessToken,
    },
  };
}) satisfies GetServerSideProps<{
  listTitles: listTitles[];
  cookieId: any;
  apiAccessToken: string;
}>;

export default function Page({
  listTitles,
  cookieId,
  apiAccessToken,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [activeListId, setActiveListId] = useState<number>(0);
  const [activeListItems, setActiveListItems] = useState<listItems[]>([]);
  const [activeListTitles, setActiveListTitles] =
    useState<listTitles[]>(listTitles);

  async function deleteTitle(id: number) {
    let deleteTitleUrl: string =
      process.env.NEXT_PUBLIC_EXPRESS_HOST_NAME +
      '/deleteTitle/?id=' +
      id.toString() +
      '&cookieId=' +
      cookieId;

    const res = await fetch(deleteTitleUrl, {
      method: 'DELETE',
      headers: {
        authorization: apiAccessToken,
      },
    });
    if (res.status === 200) {
      if (typeof cookieId === 'string') {
        await updateTitles();
      }
      return;
    } else {
      console.error(res);
      return res.status;
    }
  }

  async function deleteItem(id: number) {
    let deleteItemUrl: string =
      process.env.NEXT_PUBLIC_EXPRESS_HOST_NAME +
      '/deleteItem/?id=' +
      id.toString() +
      '&cookieId=' +
      cookieId;

    const res = await fetch(deleteItemUrl, {
      method: 'DELETE',
      headers: {
        authorization: apiAccessToken!,
      },
    });
    if (res.status === 200) {
      setActiveListItems(await getItems(activeListId));
      return;
    } else {
      console.error(res);
      return res.status;
    }
  }

  async function updateTitles() {
    let updateUrl: string =
      process.env.NEXT_PUBLIC_EXPRESS_HOST_NAME! +
      '/fetchLists/?cookieId=' +
      cookieId;

    const res = await fetch(updateUrl, {
      method: 'GET',
      headers: {
        authorization: apiAccessToken!,
      },
    });
    const tempRes: any = await res.json();
    const listTitles: listTitles[] = tempRes.listTitles;
    setActiveListTitles(listTitles);
    return;
  }

  async function getItems(titleId: number) {
    let getUrl: string =
      process.env.NEXT_PUBLIC_EXPRESS_HOST_NAME +
      '/fetchItems/?titleId=' +
      titleId +
      '&cookieId=' +
      cookieId;

    const res = await fetch(getUrl, {
      method: 'GET',
      headers: {
        authorization: apiAccessToken!,
      },
    });
    const tempRes: any = await res.json();
    const listItems: listItems[] = tempRes.listItems;
    return listItems;
  }

  async function completeItem(id: number, currentBool: boolean) {
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
    const res = await fetch(completeUrl, {
      method: 'PATCH',
      headers: {
        authorization: apiAccessToken!,
      },
    });
    if (res.status === 200) {
      setActiveListItems(await getItems(activeListId));
      return;
    } else {
      console.error(res);
      return res.status;
    }
  }

  async function createTitle(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    if (typeof formData.get('title') === 'string') {
      let createUrl: string =
        process.env.NEXT_PUBLIC_EXPRESS_HOST_NAME +
        '/createTitle/?cookieId=' +
        cookieId +
        '&title=' +
        formData.get('title');

      const res = await fetch(createUrl, {
        method: 'POST',
        headers: {
          authorization: apiAccessToken!,
        },
      });

      if (res.status === 200) {
        //@ts-ignore
        document.getElementById('titleInput').reset();
        updateTitles();
        return;
      } else {
        console.error(res);
        return res.status;
      }
    }
  }

  async function createItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    if (typeof formData.get('item') === 'string') {
      let createUrl: string =
        process.env.NEXT_PUBLIC_EXPRESS_HOST_NAME +
        '/createItem/?titleId=' +
        activeListId +
        '&message=' +
        formData.get('item') +
        '&cookieId=' +
        cookieId;

      const res = await fetch(createUrl, {
        method: 'POST',
        headers: {
          authorization: apiAccessToken!,
        },
      });

      if (res.status === 200) {
        setActiveListItems(await getItems(activeListId));
        if (document.getElementById('itemInput')) {
          //@ts-ignore
          document.getElementById('itemInput').reset();
        }
        if (document.getElementById('itemInput2')) {
          //@ts-ignore
          document.getElementById('itemInput2').reset();
        }
        return;
      } else {
        console.error(res);
        return res.status;
      }
    }
  }

  async function activateList(id: number) {
    if (activeListId != id) {
      setActiveListId(id);
      let listItems: listItems[] = await getItems(id);
      setActiveListItems(listItems);
    } else if (activeListId === id) {
      setActiveListId(0);
      setActiveListItems([]);
    }
    return activeListItems;
  }

  return (
    <main className={'flex h-screen w-full flex ' + space.className}>
      <div className='flex flex-col w-full h-screen'>
        <h1 className='flex w-full h-[50px] text-xl py-2 px-2 bg-gray-400 border-b border-black text-black select-none'>
          To Do Lists
        </h1>
        <div className='flex w-full h-full flex-col md:flex-row'>
          <div className='flex h-full w-full flex-col md:max-w-[30%] overflow-hidden border-r border-gray-400'>
            {activeListTitles.map((title) => {
              // Inactive list title
              if (activeListId != parseInt(title.id)) {
                return (
                  <div
                    className='flex flex-row py-1 pl-10 text-base bg-gray-300 border-b border-gray-600 select-none'
                    key={title.id}
                  >
                    <div
                      onClick={() => activateList(parseInt(title.id))}
                      className='flex flex-row w-full justify-between'
                    >
                      <div className='mr-4 select-none'>{title.title}</div>
                    </div>
                  </div>
                );
                // Active list title
              } else if (activeListId === parseInt(title.id)) {
                return (
                  <div className='flex flex-col text-base' key={title.id}>
                    <div
                      className='w-full flex flex-row py-1 pl-3.5 text-base bg-gray-300 border-b border-gray-600 md:bg-gray-200'
                      key={title.id}
                      onClick={() => activateList(parseInt(title.id))}
                    >
                      <div
                        className='mr-3.5 text-red-500 text-black select-none'
                        onClick={() => {
                          deleteTitle(parseInt(title.id));
                        }}
                      >
                        &#x2715;
                      </div>
                      <div className='flex flex-row w-full justify-between'>
                        <div className='mr-4 select-none'>{title.title}</div>
                      </div>
                    </div>
                    {/* List items on small screens */}
                    {activeListItems.map((item) => {
                      {
                        /* incomplete item - small screen*/
                      }
                      if (item.complete === false) {
                        return (
                          <div
                            className='flex flex-row py-1.5 text-sm bg-gray-200 border-b border-gray-400 md:hidden'
                            key={item.id}
                          >
                            <div
                              className='ml-4 mr-4 select-none'
                              onClick={() => {
                                completeItem(parseInt(item.id), item.complete);
                              }}
                            >
                              &#9744;
                            </div>
                            <div className='flex flex-row w-full justify-between'>
                              <div
                                className='mr-4 select-none'
                                onClick={() => {
                                  completeItem(
                                    parseInt(item.id),
                                    item.complete
                                  );
                                }}
                              >
                                {item.message}
                              </div>
                              <div
                                className='mr-4 text-red-500 text-black select-none'
                                onClick={() => {
                                  deleteItem(parseInt(item.id));
                                }}
                              >
                                &#x2715;
                              </div>
                            </div>
                          </div>
                        );
                      }
                      {
                        /* complete item - small screen */
                      }
                      if (item.complete === true) {
                        return (
                          <div
                            className='flex flex-row py-1.5 text-sm text-black/50 bg-gray-200 border-b border-gray-400 md:hidden'
                            key={item.id}
                          >
                            <div
                              className='mr-4 ml-4 select-none'
                              onClick={() => {
                                completeItem(parseInt(item.id), item.complete);
                              }}
                            >
                              &#9745;
                            </div>
                            <div className='flex flex-row w-full justify-between'>
                              <div
                                className='select-none'
                                onClick={() => {
                                  completeItem(
                                    parseInt(item.id),
                                    item.complete
                                  );
                                }}
                              >
                                {item.message}
                              </div>
                              <div
                                className='mr-4 text-red-500 text-black select-none'
                                onClick={() => {
                                  deleteItem(parseInt(item.id));
                                }}
                              >
                                &#x2715;
                              </div>
                            </div>
                          </div>
                        );
                      }
                    })}

                    {/* create new item - small screen */}
                    <div className='flex flex-row py-2 text-sm bg-gray-200 border-b border-gray-400 md:hidden'>
                      <form
                        id='itemInput2'
                        className='flex flex-row w-full'
                        onSubmit={createItem}
                      >
                        <button
                          className='mr-4 ml-3.5 text-green-500 font-black select-none'
                          type='submit'
                        >
                          &#65291;
                        </button>
                        <input
                          className='bg-transparent outline-none'
                          type='text'
                          name='item'
                          placeholder='New item...'
                          maxLength={90}
                          minLength={1}
                          required
                          size={30}
                        />
                      </form>
                    </div>
                  </div>
                );
              }
            })}
            {/* create new list title */}
            <div className='flex flex-row py-1 text-base bg-gray-300'>
              <form
                id='titleInput'
                className='flex flex-row w-full'
                onSubmit={createTitle}
              >
                <button
                  className='mr-3 ml-3.5 text-green-500 font-black select-none'
                  type='submit'
                >
                  &#65291;
                </button>
                <input
                  className='bg-transparent outline-none'
                  type='text'
                  name='title'
                  placeholder='New list...'
                  maxLength={30}
                  minLength={1}
                  required
                  size={30}
                />
              </form>
            </div>
          </div>
          {/* active list items - large screens */}
          <div className='flex-col w-full h-full bg-gray-100 hidden md:flex'>
            {activeListItems.map((item) => {
              {
                /* incomplete item - large screen */
              }
              if (item.complete === false) {
                return (
                  <div
                    className='flex flex-row py-1.5 text-sm bg-gray-200 border-b border-gray-400'
                    key={item.id}
                  >
                    <div
                      className='ml-4 mr-4 select-none'
                      onClick={() => {
                        completeItem(parseInt(item.id), item.complete);
                      }}
                    >
                      &#9744;
                    </div>
                    <div className='flex flex-row w-full justify-between'>
                      <div
                        className='mr-4 select-none'
                        onClick={() => {
                          completeItem(parseInt(item.id), item.complete);
                        }}
                      >
                        {item.message}
                      </div>
                      <div
                        className='mr-4 text-red-500 text-black select-none'
                        onClick={() => {
                          deleteItem(parseInt(item.id));
                        }}
                      >
                        &#x2715;
                      </div>
                    </div>
                  </div>
                );
              }
              {
                /* complete item - large screen */
              }
              if (item.complete === true) {
                return (
                  <div
                    className='flex flex-row py-1.5 text-sm text-black/50 bg-gray-200 border-b border-gray-400'
                    key={item.id}
                  >
                    <div
                      className='mr-4 ml-4 select-none'
                      onClick={() => {
                        completeItem(parseInt(item.id), item.complete);
                      }}
                    >
                      &#9745;
                    </div>
                    <div className='flex flex-row w-full justify-between'>
                      <div
                        className='select-none'
                        onClick={() => {
                          completeItem(parseInt(item.id), item.complete);
                        }}
                      >
                        {item.message}
                      </div>
                      <div
                        className='mr-4 text-red-500 text-black select-none'
                        onClick={() => {
                          deleteItem(parseInt(item.id));
                        }}
                      >
                        &#x2715;
                      </div>
                    </div>
                  </div>
                );
              }
            })}
            {/* New item input - large screen - only needs to render when a list is active */}
            {[1].map((x, index) => {
              if (index === 0) {
                if (activeListId != 0) {
                  return (
                    <div className='flex flex-row py-1.5 text-sm bg-gray-200 border-b border-gray-400'>
                      <form
                        id='itemInput'
                        className='flex flex-row w-full'
                        onSubmit={createItem}
                      >
                        <button
                          className='mr-4 ml-3.5 text-green-500 font-black select-none'
                          type='submit'
                        >
                          &#65291;
                        </button>
                        <input
                          className='bg-transparent outline-none'
                          type='text'
                          name='item'
                          placeholder='New item...'
                          maxLength={90}
                          minLength={1}
                          required
                          size={30}
                        />
                      </form>
                    </div>
                  );
                }
              }
            })}
          </div>
        </div>
      </div>
    </main>
  );
}
