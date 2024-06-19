import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.get('/', (req: Request, res: Response) => {
  res.json({ data: 'Hello World! TEST!' });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
