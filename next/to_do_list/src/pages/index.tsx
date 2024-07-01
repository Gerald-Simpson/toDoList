import { space } from '../fonts';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useState, useEffect, FormEvent } from 'react';
import {
  fetchListTitles,
  fetchItems,
} from '../_serverFunctions/viewFunctions.ts';
import { fetchApiAccessToken } from '../_serverFunctions/authFunctions.ts';
import {
  deleteTitle,
  deleteItem,
  completeItem,
  createTitle,
  createItem,
} from '../_serverFunctions/controllerFunctions.ts';
import {
  listTitles,
  listItems,
  tokenResponse,
} from '../_serverFunctions/models.ts';
import ListItem from '../_componenets/listItem.tsx';

export const getServerSideProps = (async (context) => {
  // using cookie middleware to assign an id that is used to load users lists
  let cookieId: string = '';
  if (typeof context.req.cookies.id === 'string') {
    cookieId = context.req.cookies.id;
  }

  // on first load, cookieId will be undefined, so extracted from headers.
  let firstLoadCookieId = context.res.getHeader('set-cookie');
  if (!context.req.cookies.id && typeof firstLoadCookieId === 'object') {
    cookieId = firstLoadCookieId[0].slice(3, -8);
  }

  // fetching token to access api to pass to client side
  let apiAccessToken: string = await fetchApiAccessToken();

  // Fetch listTitles
  let listTitles: { listTitles: listTitles[] } = await fetchListTitles(
    cookieId,
    apiAccessToken,
  );

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

  async function updateTitles() {
    const listTitles: { listTitles: listTitles[] } = await fetchListTitles(
      cookieId,
      apiAccessToken,
    );
    setActiveListTitles(listTitles.listTitles);
    return;
  }

  async function updateItems() {
    setActiveListItems(
      await fetchItems(activeListId, cookieId, apiAccessToken),
    );
  }

  // Updates activeListItems when activeListId changes
  useEffect(() => {
    async function test() {
      setActiveListItems(
        await fetchItems(activeListId, cookieId, apiAccessToken),
      );
    }
    test();
  }, [activeListId]);

  async function deleteTitleUpdate(
    cookieId: string,
    id: number,
    apiAccessToken: string,
  ) {
    let resStatus = await deleteTitle(cookieId, id, apiAccessToken);
    if (resStatus == 200) {
      updateTitles();
    }
  }

  async function deleteItemUpdate(
    cookieId: string,
    id: number,
    apiAccessToken: string,
  ) {
    let resStatus = await deleteItem(id, cookieId, apiAccessToken);
    if (resStatus == 200) {
      updateItems();
    }
  }

  async function completeItemUpdate(
    id: number,
    currentBool: boolean,
    cookieId: string,
    apiAccessToken: string,
  ) {
    let resStatus = await completeItem(
      id,
      currentBool,
      cookieId,
      apiAccessToken,
    );

    if (resStatus == 200) {
      updateItems();
    }
  }

  async function createTitleUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    let title = formData.get('title');
    if (typeof title === 'string') {
      let resStatus = await createTitle(title, cookieId, apiAccessToken);
      if (resStatus == 200) {
        //@ts-ignore
        document.getElementById('titleInput').reset();
        updateTitles();
        return;
      }
    }
  }

  async function createItemUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    let message = formData.get('item');
    if (typeof message === 'string') {
      let resStatus = await createItem(
        activeListId,
        message,
        cookieId,
        apiAccessToken,
      );

      if (resStatus == 200) {
        if (document.getElementById('itemInput')) {
          //@ts-ignore
          document.getElementById('itemInput').reset();
        }
        if (document.getElementById('itemInput2')) {
          //@ts-ignore
          document.getElementById('itemInput2').reset();
        }
        updateItems();
        return;
      }
    }
  }

  async function activateList(id: number) {
    if (activeListId !== id) {
      setActiveListId(id);
    } else if (activeListId == id) {
      setActiveListId(0);
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
              if (activeListId !== parseInt(title.id)) {
                return <ListTitle title={title} active={false} />;
              }
              // Active list title
              if (activeListId === parseInt(title.id)) {
                return <ListTitle title={title} active={true} />;
              }
            })}
            {/* create new list title */}
            <div className='flex flex-row py-1 text-base bg-gray-300'>
              <form
                id='titleInput'
                className='flex flex-row w-full'
                onSubmit={createTitleUpdate}
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
                  <ListItem
                    item={item}
                    mobile={false}
                    complete={false}
                    cookieId={cookieId}
                    apiAccessToken={apiAccessToken}
                    id={item.id}
                    message={item.message}
                    completeItemUpdate={completeItemUpdate}
                    deleteItemUpdate={deleteItemUpdate}
                  />
                );
              }
              {
                /* complete item - large screen */
              }
              if (item.complete === true) {
                return (
                  <ListItem
                    item={item}
                    mobile={false}
                    complete={true}
                    cookieId={cookieId}
                    apiAccessToken={apiAccessToken}
                    id={item.id}
                    message={item.message}
                    completeItemUpdate={completeItemUpdate}
                    deleteItemUpdate={deleteItemUpdate}
                  />
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
                        onSubmit={createItemUpdate}
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

  function ListTitle(props: { title: listTitles; active: boolean }) {
    // Inactive list title
    if (!props.active) {
      return (
        <div
          className='flex flex-row py-1 pl-10 text-base bg-gray-300 border-b border-gray-600 select-none'
          key={props.title.id}
        >
          <div
            onClick={() => activateList(parseInt(props.title.id))}
            className='flex flex-row w-full justify-between'
          >
            <div className='mr-4 select-none'>{props.title.title}</div>
          </div>
        </div>
      );
    }
    // Active list title
    if (props.active) {
      return (
        <div className='flex flex-col text-base' key={props.title.id}>
          <div
            className='w-full flex flex-row py-1 pl-3.5 text-base bg-gray-300 border-b border-gray-600 md:bg-gray-200'
            key={props.title.id}
            onClick={() => activateList(parseInt(props.title.id))}
          >
            <div
              className='mr-3.5 text-red-500 text-black select-none'
              onClick={() => {
                deleteTitleUpdate(
                  cookieId,
                  parseInt(props.title.id),
                  apiAccessToken,
                );
              }}
            >
              &#x2715;
            </div>
            <div className='flex flex-row w-full justify-between'>
              <div className='mr-4 select-none'>{props.title.title}</div>
            </div>
          </div>
          {/* List items on small screens */}
          {activeListItems.map((item) => {
            if (!item.complete) {
              return (
                <ListItem
                  item={item}
                  mobile={true}
                  complete={false}
                  cookieId={cookieId}
                  apiAccessToken={apiAccessToken}
                  id={item.id}
                  message={item.message}
                  completeItemUpdate={completeItemUpdate}
                  deleteItemUpdate={deleteItemUpdate}
                />
              );
            } else if (item.complete) {
              return (
                <ListItem
                  item={item}
                  mobile={true}
                  complete={true}
                  cookieId={cookieId}
                  apiAccessToken={apiAccessToken}
                  id={item.id}
                  message={item.message}
                  completeItemUpdate={completeItemUpdate}
                  deleteItemUpdate={deleteItemUpdate}
                />
              );
            }
          })}

          {/* create new item - small screen */}
          <div className='flex flex-row py-2 text-sm bg-gray-200 border-b border-gray-400 md:hidden'>
            <form
              id='itemInput2'
              className='flex flex-row w-full'
              onSubmit={createItemUpdate}
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
  }
}
