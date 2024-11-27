import { space, funnel, delius, atma, jolly, mukta } from '../fonts';
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
import { listTitles, listItems } from '../_serverFunctions/models.ts';
import ListItem, {
  ListItemsCombinedMobile,
  NewItemMobile,
  NewItemLarge,
} from '../_components/listItemComponents.tsx';
import ListTitle, { NewTitle } from '../_components/listTitleComponents.tsx';

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

  const createItemUpdate = async (event: FormEvent<HTMLFormElement>) => {
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
  };

  async function activateList(id: number) {
    if (activeListId !== id) {
      setActiveListId(id);
    } else if (activeListId == id) {
      setActiveListId(0);
    }
    return activeListItems;
  }

  return (
    <main
      className={'flex h-screen w-full flex text-indigo-950 ' + mukta.className}
    >
      <div className='flex flex-col w-full md:px-8 h-screen'>
        <div className='flex flex-col justify-center py-3 md:py-6 w-full bg-white'>
          <h1
            className={
              'text-4xl md:text-5xl text-rose-950 px-4 font-semibold select-none ' +
              jolly.className
            }
          >
            to do
          </h1>
        </div>
        <div className='flex w-full h-full flex-col md:flex-row'>
          <div className='flex h-full w-full flex-col md:max-w-[25%] overflow-hidden md:mr-12 border-t border-indigo-100'>
            {activeListTitles.map((title) => {
              // Inactive list title
              if (activeListId !== parseInt(title.id)) {
                return (
                  <ListTitle
                    title={title}
                    active={false}
                    activateList={activateList}
                    deleteTitleUpdate={deleteTitleUpdate}
                    cookieId={cookieId}
                    apiAccessToken={apiAccessToken}
                    createItemUpdate={createItemUpdate}
                  />
                );
              }
              // Active list title
              if (activeListId === parseInt(title.id)) {
                return (
                  <div>
                    <ListTitle
                      title={title}
                      active={true}
                      activateList={activateList}
                      deleteTitleUpdate={deleteTitleUpdate}
                      cookieId={cookieId}
                      apiAccessToken={apiAccessToken}
                      createItemUpdate={createItemUpdate}
                    />
                    {/* list items - only rendered for mobile */}
                    <ListItemsCombinedMobile
                      cookieId={cookieId}
                      apiAccessToken={apiAccessToken}
                      activeListItems={activeListItems}
                      completeItemUpdate={completeItemUpdate}
                      deleteItemUpdate={deleteItemUpdate}
                    />
                    {/* new item - only rendered for mobile */}
                    <NewItemMobile createItemUpdate={createItemUpdate} />
                  </div>
                );
              }
            })}
            {/* create new list title */}
            <NewTitle createTitleUpdate={createTitleUpdate} />
          </div>
          {/* active list items - large screens */}
          <div className='flex-col w-full h-full bg-white hidden md:flex'>
            {activeListItems.map((item) => {
              {
                /* item - large screen */
              }
              return (
                <ListItem
                  item={item}
                  mobile={false}
                  complete={item.complete}
                  cookieId={cookieId}
                  apiAccessToken={apiAccessToken}
                  id={item.id}
                  message={item.message}
                  completeItemUpdate={completeItemUpdate}
                  deleteItemUpdate={deleteItemUpdate}
                />
              );
            })}
            {/* New item input - only renders for large screen & when a list is active */}
            <NewItemLarge
              createItemUpdate={createItemUpdate}
              activeListId={activeListId}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
