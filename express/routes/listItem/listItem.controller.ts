import express, { Express, Request, Response, NextFunction } from 'express';
import { idSchema, cookieSchema } from '../general.models';
import {
  listItemsSchema,
  messageSchema,
  singleItemSchema,
  deleteItemsSchema,
  completeSchema,
} from './listItem.models';
import { singleTitleSchema } from '../listTitle/listTitle.models';
import { prisma } from '../../app';

async function get(req: Request, res: Response) {
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
      console.error('Failed to fetch items. ' + err);
      await prisma.$disconnect();
      process.exit(1);
    });
}

async function post(req: Request, res: Response) {
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
      console.error('Failed to add item. ' + err);
      await prisma.$disconnect();
      process.exit(1);
    });
}

async function remove(req: Request, res: Response) {
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
      console.error('Failed to delete item. ' + err);
      await prisma.$disconnect();
      process.exit(1);
    });
}

async function patch(req: Request, res: Response) {
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
}

module.exports = { get, post, remove, patch };
