import Image from 'next/image';
import { space, inter } from './fonts';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';

// To be used once api setup
type toDoData = {
  cookieId: string;
  name: string;
};

export const getServerSideProps = (async (context) => {
  let cookieId = context.req.cookies.id;
  // on first load of site cookieId will be undefined but can pull it from headers.
  let firstLoadCookieId = context.res.getHeader('set-cookie');
  if (!cookieId && typeof firstLoadCookieId === 'object') {
    cookieId = firstLoadCookieId[0].slice(3, -8);
  }
  const res = await fetch(process.env.EXPRESS_HOST_NAME!, {
    method: 'GET',
  });
  // type should to toDoData above when ready
  const toDoData: any = await res.json();

  return { props: { toDoData: toDoData, cookieId: cookieId } };
}) satisfies GetServerSideProps<{ toDoData: any; cookieId: any }>;

export default function Page({
  toDoData,
  cookieId,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <main
      className={
        'flex min-h-screen flex-col items-center justify-between p-24 ' +
        space.className
      }
    >
      <div>TESTing</div>
      <div>{toDoData.data}</div>
      <div>{cookieId}</div>
      <div>TESTing this is a test this is a test this is a test</div>
    </main>
  );
}
