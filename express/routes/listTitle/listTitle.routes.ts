import express, { Express, Request, Response } from 'express';
import { checkJwt } from '../auth/auth';
const listTitleController = require('./listTitle.controller.ts');

const router = express.Router();

// Fetch all listTitles
router.get('/fetchLists/', checkJwt, listTitleController.get);
//
// Create new listTitle
router.post('/createTitle/', checkJwt, listTitleController.post);

// Delete listTitle
router.delete('/deleteItem/', checkJwt, listTitleController.remove);

module.exports = router;
