import { Router } from 'express';
import pagesRouter from './pages.route';
import contentTypeRouter from './registry.route';
import fileRouter from './file.route';

const serviceRouter = Router();

serviceRouter.use('/', pagesRouter);
serviceRouter.use('/', contentTypeRouter);
serviceRouter.use('/', fileRouter);

export default serviceRouter;
