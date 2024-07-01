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
        className='flex flex-row py-1.5 text-sm bg-gray-200 border-b border-gray-400 md:hidden'
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
            className='mr-4 select-none'
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
            className='mr-4 text-red-500 text-black select-none'
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
        className='flex flex-row py-1.5 text-sm text-black/50 bg-gray-200 border-b border-gray-400 md:hidden'
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
            className='select-none'
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
            className='mr-4 text-red-500 text-black select-none'
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
        className='flex flex-row py-1.5 text-sm bg-gray-200 border-b border-gray-400'
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
            className='mr-4 select-none'
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
            className='mr-4 text-red-500 text-black select-none'
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
        className='flex flex-row py-1.5 text-sm text-black/50 bg-gray-200 border-b border-gray-400'
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
            className='select-none'
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
            className='mr-4 text-red-500 text-black select-none'
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
    <div className='flex flex-row py-2 text-sm bg-gray-200 border-b border-gray-400 md:hidden'>
      <form
        id='itemInput2'
        className='flex flex-row w-full'
        onSubmit={props.createItemUpdate}
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

export function NewItemLarge(props: {
  createItemUpdate: FormEventHandler<HTMLFormElement>;
  activeListId: number;
}) {
  if (props.activeListId !== 0) {
    return (
      <div className='flex flex-row py-1.5 text-sm bg-gray-200 border-b border-gray-400'>
        <form
          id='itemInput'
          className='flex flex-row w-full'
          onSubmit={props.createItemUpdate}
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
