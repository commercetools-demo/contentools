import {
  Router,
  Request,
  Response,
  NextFunction,
  RequestHandler,
} from 'express';
import { logger } from '../utils/logger.utils';
import { CustomObjectController } from '../controllers/custom-object.controller';
import { ContentItemController } from '../controllers/content-item.controller';

const contentItemRouter = Router();
export const CONTENT_ITEM_CONTAINER =
  process.env.CONTENT_ITEM_CONTAINER || 'content-item';
const businessUnitController = new CustomObjectController(
  CONTENT_ITEM_CONTAINER
);

contentItemRouter.get(
  '/:businessUnitKey/content-items',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { businessUnitKey } = req.params;
      const objects = await businessUnitController.getCustomObjects(
        `value(businessUnitKey = "${businessUnitKey}")`
      );
      res.json(objects);
    } catch (error) {
      logger.error('Failed to get custom objects:', error);
      next(error);
    }
  }
);

contentItemRouter.get(
  '/:businessUnitKey/content-items/:key',
  async (req, res, next) => {
    try {
      const { key } = req.params;
      const contentItemController = new ContentItemController(
        businessUnitController
      );
      const object = await contentItemController.getContentItem(key);
      res.json(object);
    } catch (error) {
      logger.error(
        `Failed to get custom object with key ${req.params.key}:`,
        error
      );
      next(error);
    }
  }
);

contentItemRouter.post('/:businessUnitKey/content-items/:key', (async (
  req,
  res,
  next
) => {
  try {
    const { businessUnitKey, key } = req.params;
    const { value } = req.body;

    if (!value) {
      return res
        .status(400)
        .json({ error: 'Value is required in the request body' });
    }

    const object = await businessUnitController.createCustomObject(key, {
      ...value,
      businessUnitKey,
    });
    res.status(201).json(object);
  } catch (error) {
    logger.error(
      `Failed to create custom object with key ${req.params.key}:`,
      error
    );
    next(error);
  }
}) as RequestHandler);

contentItemRouter.put('/:businessUnitKey/content-items/:key', (async (
  req,
  res,
  next
) => {
  try {
    const { businessUnitKey, key } = req.params;
    const { value } = req.body;

    if (!value) {
      return res
        .status(400)
        .json({ error: 'Value is required in the request body' });
    }

    const object = await businessUnitController.updateCustomObject(key, {
      ...value,
      businessUnitKey,
    });
    res.json(object);
  } catch (error) {
    logger.error(
      `Failed to update custom object with key ${req.params.key}:`,
      error
    );
    next(error);
  }
}) as RequestHandler);

contentItemRouter.delete(
  '/:businessUnitKey/content-items/:key',
  async (req, res, next) => {
    try {
      const { key } = req.params;
      await businessUnitController.deleteCustomObject(key);
      res.status(204).send();
    } catch (error) {
      logger.error(
        `Failed to delete custom object with key ${req.params.key}:`,
        error
      );
      next(error);
    }
  }
);

export default contentItemRouter;
