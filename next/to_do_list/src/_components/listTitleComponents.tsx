import { listTitles } from '../_serverFunctions/models.ts';
import { FormEvent, FormEventHandler } from 'react';

export default function ListTitle(props: {
  title: listTitles;
  active: boolean;
  activateList: Function;
  deleteTitleUpdate: Function;
  cookieId: string;
  apiAccessToken: string;
  createItemUpdate: Function;
}) {
  // Inactive list title
  if (!props.active) {
    return (
      <div
        className='flex flex-row py-1 pl-10 text-base bg-gray-300 border-b border-gray-600 select-none'
        key={props.title.id}
      >
        <div
          onClick={() => props.activateList(parseInt(props.title.id))}
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
          onClick={() => props.activateList(parseInt(props.title.id))}
        >
          <div
            className='mr-3.5 text-red-500 text-black select-none'
            onClick={() => {
              props.deleteTitleUpdate(
                props.cookieId,
                parseInt(props.title.id),
                props.apiAccessToken,
              );
            }}
          >
            &#x2715;
          </div>
          <div className='flex flex-row w-full justify-between'>
            <div className='mr-4 select-none'>{props.title.title}</div>
          </div>
        </div>
      </div>
    );
  }
}

export function NewTitle(props: {
  createTitleUpdate: FormEventHandler<HTMLFormElement>;
}) {
  return (
    <div className='flex flex-row py-1 text-base bg-gray-300'>
      <form
        id='titleInput'
        className='flex flex-row w-full'
        onSubmit={props.createTitleUpdate}
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
  );
}
