import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';

export const prisma = new PrismaClient();

dotenv.config();

const app: Express = express();
const port = process.env.PORT;
const listItemRouter = require('./routes/listItem/listItem.routes.ts');
const listTitleRouter = require('./routes/listTitle/listTitle.routes.ts');

app.use(cors());

app.use('/', listItemRouter);

app.use('/', listTitleRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
