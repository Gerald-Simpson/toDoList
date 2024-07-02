import express, { Express, Request, Response } from 'express';
import { checkJwt } from '../auth/auth';
import { idSchema, cookieSchema } from '../general.models';
import { listItemsSchema } from './listItem.models';
import { prisma } from '../../app.ts';
const listItemController = require('./listItem.controller.ts');

const router = express.Router();

// Fetch all listItems
router.get('/fetchItems/', checkJwt, listItemController.get);

// Create new listItem
router.post('/createItem/', checkJwt, listItemController.post);

// Delete listTitle
router.delete('/deleteTitle/', checkJwt, listItemController.remove);

// Invert complete boolean state of a listItem
router.patch('/complete/', checkJwt, listItemController.patch);

module.exports = router;
