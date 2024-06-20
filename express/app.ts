import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

const prisma = new PrismaClient();

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.get('/', async (req: Request, res: Response) => {
  res.json({ data: 'Hello World! TEST!' });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

/*
  const newEntry = await prisma.toDoList.create({
    data: {
      cookieId: 'testing cookieId',
      message: 'this is a test message.',
    },
  });
 
*/
