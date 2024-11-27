import { listItems } from '../_serverFunctions/models.ts';
import { FormEvent, FormEventHandler } from 'react';

export default function ListItem(props: {
  item: listItems;
  mobile: boolean;
  complete: boolean;
  cookieId: string;
  apiAccessToken: string;
  id: string;
  message: string;
  completeItemUpdate: Function;
  deleteItemUpdate: Function;
}) {
  {
    /* incomplete item - small screen*/
  }
  if (props.complete === false && props.mobile) {
    return (
      <div
        className='flex flex-row py-1.5 bg-blue-50 text-base bg-sm md:hidden'
        key={props.id}
      >
        <div
          className='ml-4 mr-4 select-none'
          onClick={() => {
            props.completeItemUpdate(
              parseInt(props.id),
              props.complete,
              props.cookieId,
              props.apiAccessToken,
            );
          }}
        >
          &#9744;
        </div>
        <div className='flex flex-row w-full justify-between'>
          <div
            className='mr-4 font-light select-none'
            onClick={() => {
              props.completeItemUpdate(
                parseInt(props.id),
                props.complete,
                props.cookieId,
                props.apiAccessToken,
              );
            }}
          >
            {props.message}
          </div>
          <div
            className='mr-4 text-rose-700 text-black select-none'
            onClick={() => {
              props.deleteItemUpdate(
                props.cookieId,
                parseInt(props.id),
                props.apiAccessToken,
              );
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
  if (props.complete === true && props.mobile) {
    return (
      <div
        className='flex flex-row py-1.5 bg-blue-50 md:bg-white text-base text-black/50 bg-white md:hidden'
        key={props.id}
      >
        <div
          className='mr-4 ml-4 select-none'
          onClick={() => {
            props.completeItemUpdate(
              parseInt(props.id),
              props.complete,
              props.cookieId,
              props.apiAccessToken,
            );
          }}
        >
          &#9745;
        </div>
        <div className='flex flex-row w-full justify-between'>
          <div
            className='select-none font-light'
            onClick={() => {
              props.completeItemUpdate(
                parseInt(props.id),
                props.complete,
                props.cookieId,
                props.apiAccessToken,
              );
            }}
          >
            {props.message}
          </div>
          <div
            className='mr-4 text-rose-700 text-black select-none'
            onClick={() => {
              props.deleteItemUpdate(
                props.cookieId,
                parseInt(props.id),
                props.apiAccessToken,
              );
            }}
          >
            &#x2715;
          </div>
        </div>
      </div>
    );
  }
  // incomplete item - large screen
  if (!props.complete && !props.mobile) {
    return (
      <div
        className='flex flex-row py-1 text-lg bg-white items-center'
        key={props.id}
      >
        <div
          className='ml-4 mr-4 select-none'
          onClick={() => {
            props.completeItemUpdate(
              parseInt(props.id),
              props.complete,
              props.cookieId,
              props.apiAccessToken,
            );
          }}
        >
          &#9744;
        </div>
        <div className='flex flex-row w-full justify-between'>
          <div
            className='mr-4 font-light select-none'
            onClick={() => {
              props.completeItemUpdate(
                parseInt(props.id),
                props.complete,
                props.cookieId,
                props.apiAccessToken,
              );
            }}
          >
            {props.message}
          </div>
          <div
            className='mr-4 text-rose-700 text-2xl text-black select-none'
            onClick={() => {
              props.deleteItemUpdate(
                props.cookieId,
                parseInt(props.id),
                props.apiAccessToken,
              );
            }}
          >
            &#x2715;
          </div>
        </div>
      </div>
    );
  }
  // complete item - large screen
  if (props.complete && !props.mobile) {
    return (
      <div
        className='flex flex-row py-1 text-lg text-black/50 bg-white'
        key={props.id}
      >
        <div
          className='mr-4 ml-4 select-none'
          onClick={() => {
            props.completeItemUpdate(
              parseInt(props.id),
              props.complete,
              props.cookieId,
              props.apiAccessToken,
            );
          }}
        >
          &#9745;
        </div>
        <div className='flex flex-row w-full justify-between'>
          <div
            className='font-light select-none'
            onClick={() => {
              props.completeItemUpdate(
                parseInt(props.id),
                props.complete,
                props.cookieId,
                props.apiAccessToken,
              );
            }}
          >
            {props.message}
          </div>
          <div
            className='mr-4 text-rose-700 text-2xl text-black select-none'
            onClick={() => {
              props.deleteItemUpdate(
                props.cookieId,
                parseInt(props.id),
                props.apiAccessToken,
              );
            }}
          >
            &#x2715;
          </div>
        </div>
      </div>
    );
  }
}

export function ListItemsCombinedMobile(props: {
  cookieId: string;
  apiAccessToken: string;
  activeListItems: listItems[];
  completeItemUpdate: Function;
  deleteItemUpdate: Function;
}) {
  {
    return props.activeListItems.map((item) => {
      return (
        <ListItem
          item={item}
          mobile={true}
          complete={item.complete}
          cookieId={props.cookieId}
          apiAccessToken={props.apiAccessToken}
          id={item.id}
          message={item.message}
          completeItemUpdate={props.completeItemUpdate}
          deleteItemUpdate={props.deleteItemUpdate}
        />
      );
    });
  }
}

export function NewItemMobile(props: {
  createItemUpdate: FormEventHandler<HTMLFormElement>;
}) {
  return (
    <div className='flex flex-row py-0.5 text-base bg-blue-50 border-b border-indigo-100 md:hidden'>
      <form
        id='itemInput2'
        className='flex flex-row w-full'
        onSubmit={props.createItemUpdate}
      >
        <button
          className='mr-3 ml-2.5 text-emerald-600 text-2xl font-black select-none'
          type='submit'
        >
          &#65291;
        </button>
        <input
          className='bg-transparent outline-none font-light'
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

export function NewItemLarge(props: {
  createItemUpdate: FormEventHandler<HTMLFormElement>;
  activeListId: number;
}) {
  if (props.activeListId !== 0) {
    return (
      <div className='flex flex-row py-0.5 text-lg bg-white'>
        <form
          id='itemInput'
          className='flex flex-row w-full'
          onSubmit={props.createItemUpdate}
        >
          <button
            className='mr-3 ml-2 text-emerald-600 text-3xl font-black select-none'
            type='submit'
          >
            &#65291;
          </button>
          <input
            className='bg-transparent font-light outline-none'
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
