import {
  Router,
  Request,
  Response,
  NextFunction,
  RequestHandler,
} from 'express';
import { logger } from '../utils/logger.utils';
import * as PageStateController from '../controllers/page-state-controller';
import CustomError from '../errors/custom.error';

const pageStateRouter = Router();

// Get states for a content item
pageStateRouter.get(
  '/:businessUnitKey/pages/:key/states',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { businessUnitKey, key } = req.params;
      const stateKey = `${businessUnitKey}_${key}`;

      try {
        const object = await PageStateController.getState(stateKey);
        res.json(object);
      } catch (error) {
        // If not found, return empty states object
        if ((error as any).statusCode === 404) {
          res.json({
            key,
            businessUnitKey,
            states: {},
          });
        } else {
          throw new CustomError(500, 'Failed to get states');
        }
      }
    } catch (error) {
      logger.error('Failed to get states:', error);
      next(error);
    }
  }
);

// Publish state (move draft to published)
pageStateRouter.put(
  '/:businessUnitKey/pages/:key/states/published',
  (async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { clearDraft } = req.query;
      const { businessUnitKey, key } = req.params;
      const { value } = req.body;

      const state = await PageStateController.createPublishedState(
        businessUnitKey,
        key,
        value,
        clearDraft === 'true'
      );
      res.json(state);
    } catch (error) {
      logger.error('Failed to publish state:', error);
      next(error);
    }
  }) as RequestHandler
);

// Delete draft state (revert to published)
pageStateRouter.delete(
  '/:businessUnitKey/pages/:key/states/draft',
  (async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { businessUnitKey, key } = req.params;

      const state = await PageStateController.deleteDraftState(
        businessUnitKey,
        key
      );
      res.json(state);
    } catch (error) {
      logger.error('Failed to delete draft state:', error);
      next(error);
    }
  }) as RequestHandler
);

export default pageStateRouter;
