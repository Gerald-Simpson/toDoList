import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

const prisma = new PrismaClient();

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

// Fetch all list titles for user using cookieId
app.get('/fetchLists/:cookieId', async (req: Request, res: Response) => {
  async function getLists() {
    const allTitles = await prisma.listTitle.findMany({
      where: { cookieId: req.params.cookieId },
    });
    console.log(allTitles);
    res.json({
      listTitles: allTitles,
    });
  }

  getLists()
    .then(async () => {
      await prisma.$disconnect();
    })
    .catch(async (err) => {
      console.error(err);
      await prisma.$disconnect();
      process.exit(1);
    });
});

// Fetch all listItems from a titleId and user cookieId
app.get('/fetchItems/:titleId', async (req: Request, res: Response) => {
  async function getItems() {
    const allItems = await prisma.listItems.findMany({
      where: {
        titleId: parseInt(req.params.titleId),
      },
    });
    console.log(allItems);
    res.json({
      listItems: allItems,
    });
  }

  getItems()
    .then(async () => {
      await prisma.$disconnect();
    })
    .catch(async (err) => {
      console.error(err);
      await prisma.$disconnect();
      process.exit(1);
    });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

/*
    const newEntry = await prisma.listTitle.create({
      data: {
        cookieId: 'e44a5162-8ab3-49dd-ab7d-777dabea7bca',
        title: 'this is a test message.',
      },
    });
 
*/
