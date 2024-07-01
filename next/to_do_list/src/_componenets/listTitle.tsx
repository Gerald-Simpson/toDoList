import { listTitles } from '../_serverFunctions/models.ts';

export default function ListTitle(props: {
  title: listTitles;
  active: boolean;
  activateList: Function;
  deleteTitleUpdate: Function;
  cookieId: string;
  apiAccessToken: string;
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
        {/* List items on small screens */}
        {activeListItems.map((item) => {
          if (!item.complete) {
            return <ListItem item={item} mobile={true} />;
          } else if (item.complete) {
            return <ListItem item={item} mobile={true} />;
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
