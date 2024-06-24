import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'DELETE') {
    let deleteTitleUrl: string =
      process.env.NEXT_PUBLIC_EXPRESS_HOST_NAME! +
      '/deleteTitle/?id=' +
      req.query.id;
    console.log(deleteTitleUrl);

    console.log('delete test');
    const res = await fetch(deleteTitleUrl, {
      mode: 'no-cors',
      method: 'DELETE',
    });
    const deleteRes: any = await res.json();
    console.log(deleteRes);

    return;
  }
}
