import { listItems } from '../_serverFunctions/models.ts';

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
