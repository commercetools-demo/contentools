import {
  NextFunction,
  Request,
  Response,
  Router
} from 'express';
import * as PageVersionController from '../controllers/page-version-controller';
import { logger } from '../utils/logger.utils';

const pageVersionRouter = Router();


// Get all versions for a page
pageVersionRouter.get(
  '/:businessUnitKey/pages/:key/versions',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { businessUnitKey, key } = req.params;
      const versions = await PageVersionController.getPageVersions(
        businessUnitKey,
        key
      );

      res.json(versions);
      
    } catch (error) {
      logger.error('Failed to get versions:', error);
      next(error);
    }
  }
);


export default pageVersionRouter;
