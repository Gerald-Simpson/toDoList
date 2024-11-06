import express, { Express, Request, Response, NextFunction } from 'express';
import { idSchema, cookieSchema } from '../general.models';
import {
  singleTitleSchema,
  listTitleSchema,
  titleSchema,
} from '../listTitle/listTitle.models';
import { singleItemSchema } from '../listItem/listItem.models';
import { prisma } from '../../app';

export let listTitleController = { get: get, post: post, remove: remove };

async function get(req: Request, res: Response) {
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
      console.error('Failed to fetch titles. ' + err);
      await prisma.$disconnect();
      res.status(500).json({ error: 'Failed to fetch titles.' });
      process.exit(1);
    });
}

async function post(req: Request, res: Response) {
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
      console.error('Failed to create title. ' + err);
      await prisma.$disconnect();
      process.exit(1);
    });
}

async function remove(req: Request, res: Response) {
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
      console.error('Failed to delete title. ' + err);
      await prisma.$disconnect();
      process.exit(1);
    });
}
