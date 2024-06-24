import Image from 'next/image';
import { space, inter } from './fonts';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/navigation';
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

export const getServerSideProps = (async (context) => {
  let cookieId = context.req.cookies.id;
  // on first load, cookieId will be undefined, so extracted from headers.
  let firstLoadCookieId = context.res.getHeader('set-cookie');
  if (!cookieId && typeof firstLoadCookieId === 'object') {
    cookieId = firstLoadCookieId[0].slice(3, -8);
  }

  let getUrl: string =
    process.env.NEXT_PUBLIC_EXPRESS_HOST_NAME! +
    '/fetchLists/?cookieId=' +
    cookieId;

  const res = await fetch(getUrl, {
    method: 'GET',
  });
  const listTitles: { listTitles: listTitles[] } = await res.json();

  return { props: { listTitles: listTitles.listTitles, cookieId: cookieId } };
}) satisfies GetServerSideProps<{ listTitles: listTitles[]; cookieId: any }>;

export default function Page({
  listTitles,
  cookieId,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [activeListId, setActiveListId] = useState<number>(0);
  const [activeListItems, setActiveListItems] = useState<listItems[]>([]);
  const [activeListTitles, setActiveListTitles] =
    useState<listTitles[]>(listTitles);

  async function deleteTitle(id: number) {
    let deleteTitleUrl: string =
      process.env.NEXT_PUBLIC_EXPRESS_HOST_NAME +
      '/deleteTitle/?id=' +
      id.toString();

    const res = await fetch(deleteTitleUrl, {
      method: 'DELETE',
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
      id.toString();

    const res = await fetch(deleteItemUrl, {
      method: 'DELETE',
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
    });
    const tempRes: any = await res.json();
    const listTitles: listTitles[] = tempRes.listTitles;
    setActiveListTitles(listTitles);
    return;
  }

  async function getItems(titleId: number) {
    let getUrl: string =
      process.env.NEXT_PUBLIC_EXPRESS_HOST_NAME! +
      '/fetchItems/?titleId=' +
      titleId;

    const res = await fetch(getUrl, {
      method: 'GET',
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
      completeBool;
    const res = await fetch(completeUrl, {
      method: 'PATCH',
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
        process.env.NEXT_PUBLIC_EXPRESS_HOST_NAME! +
        '/createTitle/?cookieId=' +
        cookieId +
        '&title=' +
        formData.get('title');

      const res = await fetch(createUrl, {
        method: 'POST',
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
        process.env.NEXT_PUBLIC_EXPRESS_HOST_NAME! +
        '/createItem/?titleId=' +
        activeListId +
        '&message=' +
        formData.get('item');

      const res = await fetch(createUrl, {
        method: 'POST',
      });

      if (res.status === 200) {
        setActiveListItems(await getItems(activeListId));
        //@ts-ignore
        document.getElementById('itemInput').reset();
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
    <main
      className={'flex min-h-screen w-full flex-col m-2 ' + space.className}
    >
      <h1 className='flex w-full text-xl my-2'>To Do:</h1>
      {activeListTitles.map((title) => {
        // Inactive list
        if (activeListId != parseInt(title.id)) {
          return (
            <div className='flex flex-row my-1 text-base' key={title.id}>
              <div
                onClick={() => activateList(parseInt(title.id))}
                className='flex flex-row w-full justify-between'
              >
                <div className='mr-4'>{title.title}</div>
                <div className='mr-4'>&#x25BC;</div>
              </div>
            </div>
          );
          // Active list
        } else if (activeListId === parseInt(title.id)) {
          return (
            <div className='flex flex-col my-1 text-base' key={title.id}>
              <div
                className='flex flex-row my-1 text-base'
                key={title.id}
                onClick={() => activateList(parseInt(title.id))}
              >
                <div
                  className='mr-4'
                  onClick={() => {
                    deleteTitle(parseInt(title.id));
                  }}
                >
                  &#x2715;
                </div>
                <div className='flex flex-row w-full justify-between'>
                  <div className='mr-4'>{title.title}</div>
                  <div className='mr-4'>&#x25B2;</div>
                </div>
              </div>
              {/* List items */}
              {activeListItems.map((item) => {
                {
                  /* incomplete item*/
                }
                if (item.complete === false) {
                  return (
                    <div className='flex flex-row my-1 text-sm' key={item.id}>
                      <div
                        className='mr-4'
                        onClick={() => {
                          deleteItem(parseInt(item.id));
                        }}
                      >
                        &#x2715;
                      </div>
                      <div className='flex flex-row w-full justify-between'>
                        <div className='mr-4'>{item.message}</div>
                        <div
                          className='mr-4'
                          onClick={() => {
                            completeItem(parseInt(item.id), item.complete);
                          }}
                        >
                          &#9744;
                        </div>
                      </div>
                    </div>
                  );
                }
                {
                  /* complete item*/
                }
                if (item.complete === true) {
                  return (
                    <div
                      className='flex flex-row my-1 text-sm text-gray-300'
                      key={item.id}
                    >
                      <div
                        className='mr-4'
                        onClick={() => {
                          deleteItem(parseInt(item.id));
                        }}
                      >
                        &#x2715;
                      </div>
                      <div className='flex flex-row w-full justify-between'>
                        <div className='mr-4 line-through'>{item.message}</div>
                        <div
                          className='mr-4'
                          onClick={() => {
                            completeItem(parseInt(item.id), item.complete);
                          }}
                        >
                          &#9746;
                        </div>
                      </div>
                    </div>
                  );
                }
              })}
              <div className='flex flex-row my-1 ml-7 text-sm'>
                <form
                  id='itemInput'
                  className='flex flex-row w-full justify-between'
                  onSubmit={createItem}
                >
                  <input
                    type='text'
                    name='item'
                    placeholder='New item...'
                    maxLength={30}
                    size={30}
                  />
                  <button className='mr-4 ml-6' type='submit'>
                    &#65291;
                  </button>
                </form>
              </div>
            </div>
          );
        }
      })}
      <div className='flex flex-row my-1 text-base'>
        <form
          id='titleInput'
          className='flex flex-row w-full justify-between'
          onSubmit={createTitle}
        >
          <input
            type='text'
            name='title'
            placeholder='New list...'
            maxLength={30}
            size={30}
          />
          <button className='mr-4 ml-6' type='submit'>
            &#65291;
          </button>
        </form>
      </div>
    </main>
  );
}
