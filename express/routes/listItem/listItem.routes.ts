import express, { Express, Request, Response } from 'express';
import { checkJwt } from '../auth/auth';
import { listItemController } from './listItem.controller';

export const listItemRouter = express.Router();

// Fetch all listItems
listItemRouter.get('/fetchItems/', checkJwt, listItemController.get);

// Create new listItem
listItemRouter.post('/createItem/', checkJwt, listItemController.post);

// Delete listTitle
listItemRouter.delete('/deleteTitle/', checkJwt, listItemController.remove);

// Invert complete boolean state of a listItem
listItemRouter.patch('/complete/', checkJwt, listItemController.patch);
