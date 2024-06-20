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
  let otherCookieId = context.res.getHeader('set-cookie');
  if (!cookieId && typeof otherCookieId === 'string') {
    cookieId = otherCookieId;
  }
  console.log(cookieId);
  console.log(otherCookieId);
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
  /*
                      const router = useRouter();
                    if (cookieId === 'not set') {
                      router.reload();
                }
                          */
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
