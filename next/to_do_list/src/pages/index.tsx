import Image from 'next/image';
import { space, inter } from './fonts';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import ListTitle from './_components/listTitle';

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
    process.env.EXPRESS_HOST_NAME! + '/fetchLists/' + cookieId;

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
  return (
    <main
      className={
        'flex min-h-screen flex-col items-center justify-between p-24 ' +
        space.className
      }
    >
      <div>Welcome</div>
      {listTitles.map((title) => {
        return (
          <div className='flex flex-row'>
            <div className='mr-4'>{title.title}</div>
            <div className='mr-4'>
              {new Date(title.createdAt).toDateString().slice(4)}
            </div>
            <div className='mr-4'>expand</div>
            <div className='mr-4'>delete</div>
          </div>
        );
      })}
      <div>footer</div>
    </main>
  );
}
