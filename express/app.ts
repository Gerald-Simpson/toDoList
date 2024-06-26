import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import cors from 'cors';
import { auth } from 'express-oauth2-jwt-bearer';

const prisma = new PrismaClient();

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

// Authorization middleware. When used, the Access Token must
// exist and be verified against the Auth0 JSON Web Key Set.
const checkJwt = auth({
  audience: 'http://localhost:3001/',
  issuerBaseURL: `https://dev-lqrmsqwllauuo8yp.uk.auth0.com/`,
});

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
    cookieId: z.string(),
    titleId: z.coerce.number().int(),
    createdAt: z.coerce.date(),
    message: z.string(),
    complete: z.boolean(),
  })
);

const deleteItemsSchema = z.object({
  count: z.number().min(0),
});

const singleTitleSchema = z.object({
  id: z.number().int(),
  cookieId: z.string(),
  createdAt: z.coerce.date(),
  title: z.string(),
});

const singleItemSchema = z.object({
  id: z.number().int(),
  cookieId: z.string(),
  titleId: z.coerce.number().int(),
  createdAt: z.coerce.date(),
  message: z.string(),
  complete: z.boolean(),
});

app.use(cors());

// Fetch all listTitles
app.get('/fetchLists/', checkJwt, async (req: Request, res: Response) => {
  async function getLists() {
    cookieSchema.parse(req.query.cookieId);
    if (typeof req.query.cookieId === 'string') {
      const allTitles = await prisma.listTitle.findMany({
        where: { cookieId: req.query.cookieId },
      });
      listTitleSchema.parse(allTitles);
      res.json({
        listTitles: allTitles,
      });
      if (req.query.test) {
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

// Fetch all listItems
app.get('/fetchItems/', checkJwt, async (req: Request, res: Response) => {
  async function getItems() {
    idSchema.parse(req.query.titleId);
    cookieSchema.parse(req.query.cookieId);
    if (
      typeof req.query.titleId === 'string' &&
      typeof req.query.cookieId === 'string'
    ) {
      const allItems = await prisma.listItems.findMany({
        where: {
          titleId: parseInt(req.query.titleId),
          cookieId: req.query.cookieId,
        },
      });
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

// Create new listTitle
app.post('/createTitle/', checkJwt, async (req: Request, res: Response) => {
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

// Create new listItem
app.post('/createItem/', checkJwt, async (req: Request, res: Response) => {
  async function createItem() {
    idSchema.parse(req.query.titleId);
    messageSchema.parse(req.query.message);
    cookieSchema.parse(req.query.cookieId);
    if (
      typeof req.query.titleId === 'string' &&
      typeof req.query.message === 'string' &&
      typeof req.query.cookieId === 'string'
    ) {
      const newItem = await prisma.listItems.create({
        data: {
          titleId: parseInt(req.query.titleId),
          message: req.query.message,
          cookieId: req.query.cookieId,
        },
      });
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

// Delete listTitle
app.delete('/deleteTitle/', checkJwt, async (req: Request, res: Response) => {
  async function deleteTitle() {
    idSchema.parse(req.query.id);
    cookieSchema.parse(req.query.cookieId);
    if (
      typeof req.query.id === 'string' &&
      typeof req.query.cookieId === 'string'
    ) {
      const deletedItems = await prisma.listItems.deleteMany({
        where: {
          titleId: parseInt(req.query.id),
          cookieId: req.query.cookieId,
        },
      });
      if (typeof deletedItems === 'object') {
        deleteItemsSchema.parse(deletedItems);
      }
      const deletedTitle = await prisma.listTitle.delete({
        where: {
          id: parseInt(req.query.id),
          cookieId: req.query.cookieId,
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

// Delete listTitle
app.delete('/deleteItem/', checkJwt, async (req: Request, res: Response) => {
  async function deleteItem() {
    idSchema.parse(req.query.id);
    cookieSchema.parse(req.query.cookieId);
    if (
      typeof req.query.id === 'string' &&
      typeof req.query.cookieId === 'string'
    ) {
      const deletedItem = await prisma.listItems.delete({
        where: {
          id: parseInt(req.query.id),
          cookieId: req.query.cookieId,
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

// Invert complete boolean state of a listItem
app.patch('/complete/', checkJwt, async (req: Request, res: Response) => {
  async function completedItem() {
    idSchema.parse(req.query.id);
    cookieSchema.parse(req.query.cookieId);
    completeSchema.parse(req.query.completeBool);
    if (
      typeof req.query.id === 'string' &&
      typeof req.query.completeBool === 'string' &&
      typeof req.query.cookieId === 'string'
    ) {
      const completedItem = await prisma.listItems.update({
        where: {
          id: parseInt(req.query.id),
          cookieId: req.query.cookieId,
        },
        data: {
          complete: Boolean(parseInt(req.query.completeBool)),
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
