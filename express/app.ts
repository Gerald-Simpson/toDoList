import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import { listItemRouter } from './routes/listItem/listItem.routes';
import { listTitleRouter } from './routes/listTitle/listTitle.routes';

export const prisma = new PrismaClient();

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(cors());

app.use('/', listItemRouter);

app.use('/', listTitleRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
