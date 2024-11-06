import express, { Express, Request, Response } from 'express';
import { checkJwt } from '../auth/auth';
import { listTitleController } from './listTitle.controller';

export const listTitleRouter = express.Router();

// Fetch all listTitles
listTitleRouter.get('/fetchLists/', checkJwt, listTitleController.get);
//
// Create new listTitle
listTitleRouter.post('/createTitle/', checkJwt, listTitleController.post);

// Delete listTitle
listTitleRouter.delete('/deleteItem/', checkJwt, listTitleController.remove);
