import Image from 'next/image';
import { space, inter } from './fonts';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';

// To be used once api setup
type toDoData = {
  cookieId: string;
  name: string;
};

export const getServerSideProps = (async () => {
  const res = await fetch(process.env.EXPRESS_HOST_NAME!, {
    method: 'GET',
  });
  // type should to toDoData above when ready
  const toDoData: any = await res.json();
  console.log(toDoData);

  return { props: { toDoData } };
}) satisfies GetServerSideProps<{ toDoData: any }>;

export default function Page({
  toDoData,
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
      <div>TESTing this is a test this is a test this is a test</div>
    </main>
  );
}
