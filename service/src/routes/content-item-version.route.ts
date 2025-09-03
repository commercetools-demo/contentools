import {
  NextFunction,
  Request,
  Response,
  Router
} from 'express';
import * as ContentVersionController from '../controllers/content-version-controller';
import { logger } from '../utils/logger.utils';

const contentItemVersionRouter = Router();

// Get all versions for a content item
contentItemVersionRouter.get(
  '/:businessUnitKey/content-items/:key/versions',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { businessUnitKey, key } = req.params;
      const versions = await ContentVersionController.getContentVersions(
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

export default contentItemVersionRouter;
