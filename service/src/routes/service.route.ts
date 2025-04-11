import { Router } from 'express';
import contentTypeRouter from './content-type.route';
import contentItemRouter from './content-item.route';
import pagesRouter from './pages.route';
import fileRouter from './file.route';
import datasourceRouter from './datasource.route';
import proxyRouter from './proxy.route';
const serviceRouter = Router();

serviceRouter.use('/', contentTypeRouter);
serviceRouter.use('/', contentItemRouter);
serviceRouter.use('/', pagesRouter);
serviceRouter.use('/', fileRouter);
serviceRouter.use('/', datasourceRouter);
serviceRouter.use('/', proxyRouter);

export default serviceRouter;
