import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

const cookieSchema = z.string().length(36);
const idSchema = z.coerce.number().int();
const titleSchema = z.string().min(1);
const messageSchema = z.string().min(1);
const completeSchema = z.coerce.number().min(0).max(1);

const listTitleSchema = z.array(
  z.object({
    id: z.number().int(),
    cookieId: z.string(),
    createdAt: z.coerce.date(),
    title: z.string(),
  })
);

const listItemsSchema = z.array(
  z.object({
    id: z.number().int(),
    titleId: z.coerce.number().int(),
    createdAt: z.coerce.date(),
    message: z.string(),
    complete: z.boolean(),
  })
);

const singleTitleSchema = z.object({
  id: z.number().int(),
  cookieId: z.string(),
  createdAt: z.coerce.date(),
  title: z.string(),
});

const singleItemSchema = z.object({
  id: z.number().int(),
  titleId: z.coerce.number().int(),
  createdAt: z.coerce.date(),
  message: z.string(),
  complete: z.boolean(),
});

// Fetch all listTitles for user using cookieId
app.get('/fetchLists/', async (req: Request, res: Response) => {
  async function getLists() {
    cookieSchema.parse(req.query.cookieId);
    if (typeof req.query.cookieId === 'string') {
      const allTitles = await prisma.listTitle.findMany({
        where: { cookieId: req.query.cookieId },
      });
      console.log(allTitles);
      listTitleSchema.parse(allTitles);
      res.json({
        listTitles: allTitles,
      });
      if (req.query.test) {
        console.log('query test works');
        console.log(req.query.test);
      }
    }
  }

  getLists()
    .then(async () => {
      await prisma.$disconnect();
    })
    .catch(async (err) => {
      console.error(err);
      await prisma.$disconnect();
      res.status(500).json({ error: 'error requesting data' });
      process.exit(1);
    });
});

// Fetch all listItems from a titleId
app.get('/fetchItems/', async (req: Request, res: Response) => {
  async function getItems() {
    idSchema.parse(req.query.titleId);
    if (typeof req.query.titleId === 'string') {
      const allItems = await prisma.listItems.findMany({
        where: {
          titleId: parseInt(req.query.titleId),
        },
      });
      console.log(allItems);
      listItemsSchema.parse(allItems);
      res.json({
        listItems: allItems,
      });
    }
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

// Create new listTitle from a cookieId and title
app.post('/createTitle/', async (req: Request, res: Response) => {
  async function createTitle() {
    cookieSchema.parse(req.query.cookieId);
    titleSchema.parse(req.query.title);
    if (
      typeof req.query.cookieId === 'string' &&
      typeof req.query.title === 'string'
    ) {
      const newTitle = await prisma.listTitle.create({
        data: {
          cookieId: req.query.cookieId,
          title: req.query.title,
        },
      });
      console.log(newTitle);
      singleTitleSchema.parse(newTitle);
      res.sendStatus(200);
    }
  }

  createTitle()
    .then(async () => {
      await prisma.$disconnect();
    })
    .catch(async (err) => {
      console.error(err);
      await prisma.$disconnect();
      process.exit(1);
    });
});

// Create new listItem from a titleId and message
app.post('/createItem/', async (req: Request, res: Response) => {
  async function createItem() {
    idSchema.parse(req.query.titleId);
    messageSchema.parse(req.query.message);
    console.log('pre test');
    if (
      typeof req.query.titleId === 'string' &&
      typeof req.query.message === 'string'
    ) {
      console.log('post test');
      const newItem = await prisma.listItems.create({
        data: {
          titleId: parseInt(req.query.titleId),
          message: req.query.message,
        },
      });
      console.log(newItem);
      singleItemSchema.parse(newItem);
      res.sendStatus(200);
    }
  }

  createItem()
    .then(async () => {
      await prisma.$disconnect();
    })
    .catch(async (err) => {
      console.error(err);
      await prisma.$disconnect();
      process.exit(1);
    });
});

// Delete listTitle from a id
app.delete('/deleteTitle/', async (req: Request, res: Response) => {
  async function deleteTitle() {
    idSchema.parse(req.query.id);
    if (typeof req.query.id === 'string') {
      const deletedItems = await prisma.listItems.deleteMany({
        where: {
          titleId: parseInt(req.query.id),
        },
      });
      listItemsSchema.parse(deletedItems);
      const deletedTitle = await prisma.listTitle.delete({
        where: {
          id: parseInt(req.query.id),
        },
      });
      singleTitleSchema.parse(deletedTitle);
      res.sendStatus(200);
    }
  }
  deleteTitle()
    .then(async () => {
      await prisma.$disconnect();
    })
    .catch(async (err) => {
      console.error(err);
      await prisma.$disconnect();
      process.exit(1);
    });
});

// Delete listTitle from an id
app.delete('/deleteItem/', async (req: Request, res: Response) => {
  async function deleteItem() {
    idSchema.parse(req.query.id);
    if (typeof req.query.id === 'string') {
      const deletedItem = await prisma.listItems.delete({
        where: {
          id: parseInt(req.query.id),
        },
      });
      singleItemSchema.parse(deletedItem);
      res.sendStatus(200);
    }
  }

  deleteItem()
    .then(async () => {
      await prisma.$disconnect();
    })
    .catch(async (err) => {
      console.error(err);
      await prisma.$disconnect();
      process.exit(1);
    });
});

// Patch to invert complete state of listItem using an id and boolean
app.patch('/complete/', async (req: Request, res: Response) => {
  async function completedItem() {
    idSchema.parse(req.query.id);
    completeSchema.parse(req.query.completeBool);
    if (
      typeof req.query.id === 'string' &&
      typeof req.query.completeBool === 'string'
    ) {
      const completedItem = await prisma.listItems.update({
        where: {
          id: parseInt(req.query.id),
        },
        data: {
          complete: Boolean(req.query.completeBool),
        },
      });
      singleItemSchema.parse(completedItem);
      res.sendStatus(200);
    }
  }

  completedItem()
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
