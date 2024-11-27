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
        className='flex flex-row py-1.5 md:py-3 pl-10 text-base md:text-lg bg-white border-b border-indigo-100 select-none'
        key={props.title.id}
      >
        <div
          onClick={() => props.activateList(parseInt(props.title.id))}
          className='flex flex-row w-full justify-between'
        >
          <div className='mr-4 font-light select-none'>{props.title.title}</div>
        </div>
      </div>
    );
  }
  // Active list title
  if (props.active) {
    return (
      <div className='flex flex-col' key={props.title.id}>
        <div
          className='w-full flex flex-row items-center text-base py-1.5 md:py-2.5 pl-4 md:pl-3.5 md:border-b border-indigo-100 bg-blue-100'
          key={props.title.id}
          onClick={() => props.activateList(parseInt(props.title.id))}
        >
          <div
            className='mr-3 md:mr-3.5 text-rose-700 md:text-2xl text-black select-none'
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
          <div className='flex mt-0.5 flex-row w-full justify-between'>
            <div className='mr-4 ml-1 md:text-lg font-medium select-none'>
              {props.title.title}
            </div>
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
    <div className='flex flex-row py-0.5 md:py-1.5 ml-0.5 md:ml-0 text-base md:text-lg bg-white'>
      <form
        id='titleInput'
        className='flex flex-row w-full'
        onSubmit={props.createTitleUpdate}
      >
        <button
          className='mr-3.5 pl-2 text-emerald-600 text-2xl md:text-3xl font-black select-none'
          type='submit'
        >
          &#65291;
        </button>
        <input
          className='bg-transparent font-base ml-0.5 font-light outline-none'
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
