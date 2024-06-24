import Image from 'next/image';
import { space, inter } from './fonts';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/navigation';

// To be used once api setup
type listTitles = {
  id: string;
  cookieId: string;
  createdAt: Date;
  title: string;
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
  let router = useRouter();

  async function deleteTitle(id: number) {
    let deleteTitleUrl: string =
      process.env.NEXT_PUBLIC_EXPRESS_HOST_NAME +
      '/deleteTitle/?id=' +
      id.toString();

    const res = await fetch(deleteTitleUrl, {
      method: 'DELETE',
    });
    if (res.status === 200) {
      router.refresh();
      return;
    } else {
      console.error(res);
      return res.status;
    }
  }

  return (
    <main
      className={'flex min-h-screen w-full flex-col m-2 ' + space.className}
    >
      <h1 className='flex w-full text-xl my-2'>My Notes:</h1>
      {listTitles.map((title) => {
        return (
          <div className='flex flex-row my-1 text-sm' key={title.id}>
            <div
              className='mr-4'
              onClick={() => {
                deleteTitle(parseInt(title.id));
              }}
            >
              X
            </div>
            <div className='mr-4'>{title.title}</div>
            <div className='mr-4'>^</div>
          </div>
        );
      })}
      <div className='flex flex-row my-1 text-sm'>
        <div className='mr-4 ml-6'>Input new list...</div>
        <div className='mr-4'>*</div>
      </div>
    </main>
  );
}

/*
 
                        <div className='mr-4'>
                            {new Date(title.createdAt).toDateString().slice(4)}
                        </div>

*/
