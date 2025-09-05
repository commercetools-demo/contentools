import { Router, RequestHandler } from 'express';
import { logger } from '../utils/logger.utils';
import * as PageController from '../controllers/page.controller';
import CustomError from '../errors/custom.error';

const pagesRouter = Router();

pagesRouter.get('/:businessUnitKey/pages', async (req, res, next) => {
  try {
    const { businessUnitKey } = req.params;

    const objects = await PageController.getPages(businessUnitKey);
    res.json(objects);
  } catch (error) {
    logger.error('Failed to get custom objects:', error);
    next(error);
  }
});

pagesRouter.get('/:businessUnitKey/pages/:key', async (req, res, next) => {
  try {
    const { businessUnitKey, key } = req.params;
    const object = await PageController.getPageWithStates(businessUnitKey, key);
    if (!object) {
      throw new CustomError(404, 'Page not found');
    }
    res.json(object);
  } catch (error) {
    logger.error(
      `Failed to get custom object with key ${req.params.key}:`,
      error
    );
    next(error);
  }
});

pagesRouter.post('/:businessUnitKey/pages', (async (req, res, next) => {
  try {
    const { businessUnitKey } = req.params;
    const { value } = req.body;

    if (!value) {
      throw new CustomError(400, 'Value is required in the request body');
    }

    const object = await PageController.createPage(businessUnitKey, value);

    res.status(201).json(object);
  } catch (error) {
    logger.error(
      `Failed to create custom object with key ${req.params.key}:`,
      error
    );
    next(error);
  }
}) as RequestHandler);

pagesRouter.put('/:businessUnitKey/pages/:key', (async (req, res, next) => {
  try {
    const { businessUnitKey, key } = req.params;
    const { value } = req.body;

    if (!value) {
      return res
        .status(400)
        .json({ error: 'Value is required in the request body' });
    }

    const object = await PageController.updatePage(businessUnitKey, key, value);
    res.json(object);
  } catch (error) {
    logger.error(
      `Failed to update custom object with key ${req.params.key}:`,
      error
    );
    next(error);
  }
}) as RequestHandler);

pagesRouter.delete('/:businessUnitKey/pages/:key', async (req, res, next) => {
  try {
    const { businessUnitKey, key } = req.params;
    await PageController.deletePage(businessUnitKey, key);
    res.status(204).send();
  } catch (error) {
    logger.error(
      `Failed to delete custom object with key ${req.params.key}:`,
      error
    );
    next(error);
  }
});

pagesRouter.post(
  '/:businessUnitKey/pages/:key/components',
  async (req, res, next) => {
    try {
      const { businessUnitKey, key } = req.params;
      const { componentType, rowId, cellId } = req.body;
      const object = await PageController.addContentItemToPage(
        businessUnitKey,
        key,
        componentType,
        rowId,
        cellId
      );
      res.status(201).json(object);
    } catch (error) {
      logger.error(
        `Failed to add component to page with key ${req.params.key}:`,
        error
      );
      next(error);
    }
  }
);

// pagesRouter.delete('/:businessUnitKey/pages/:key/components/:rowId', async (req, res, next) => {
//   try {
//     const { businessUnitKey, key, rowId } = req.params;
//     await PageController.removeContentItemFromPage(businessUnitKey, key, rowId);
//     res.status(204).send();
//   } catch (error) {
//     logger.error(
//       `Failed to remove component from page with key ${req.params.key}:`,
//       error
//     );
//     next(error);
//   }
// });

pagesRouter.delete(
  '/:businessUnitKey/pages/:key/rows/:rowId',
  async (req, res, next) => {
    try {
      const { businessUnitKey, key, rowId } = req.params;
      const object = await PageController.removeRowFromPage(businessUnitKey, key, rowId);
      res.status(200).json(object);
    } catch (error) {
      logger.error(
        `Failed to remove row from page with key ${req.params.key}:`,
        error
      );
      next(error);
    }
  }
);

pagesRouter.post(
  '/:businessUnitKey/pages/:key/rows',
  async (req, res, next) => {
    try {
      const { businessUnitKey, key } = req.params;
      const object = await PageController.addRowToPage(businessUnitKey, key);
      res.status(201).json(object);
    } catch (error) {
      logger.error(
        `Failed to add row to page with key ${req.params.key}:`,
        error
      );
      next(error);
    }
  }
);

pagesRouter.put(
  '/:businessUnitKey/pages/:key/rows/:rowId/cells/:cellId',
  async (req, res, next) => {
    try {
      const { businessUnitKey, key, rowId, cellId } = req.params;
      const { updates } = req.body;

      const object = await PageController.updateCellSpanInPage(businessUnitKey, key, rowId, cellId, updates);
      res.status(200).json(object);
    } catch (error) {
      logger.error(
        `Failed to update cell span in page with key ${req.params.key}:`,
        error
      );

      next(error);
    }
  }
);

pagesRouter.put(
  '/:businessUnitKey/pages/:key/components/:contentItemKey',
  async (req, res, next) => {
    try {
      const { businessUnitKey, key, contentItemKey } = req.params;
      const { updates } = req.body;
      const object = await PageController.updateComponentInPage(businessUnitKey, key, contentItemKey, updates);
      res.status(200).json(object);
    } catch (error) {
      logger.error(
        `Failed to update component in page with key ${req.params.key}:`,
        error
      );
      next(error);
    }
  }
);

pagesRouter.delete(
  '/:businessUnitKey/pages/:key/components/:contentItemKey',
  async (req, res, next) => {
    try {
      const { businessUnitKey, key, contentItemKey } = req.params;
      const object = await PageController.removeComponentFromPage(businessUnitKey, key, contentItemKey);
      res.status(200).json(object);
    } catch (error) {
      logger.error(
        `Failed to remove component from page with key ${req.params.key}:`,
        error
      );
      next(error);
    }
  } 
);



pagesRouter.get(
  '/:businessUnitKey/published/pages/:key',
  async (req, res, next) => {
    try {
      const { key, businessUnitKey } = req.params;

      const object = await PageController.getPublishedPage(
        businessUnitKey,
        key
      );
      if (!object) {
        throw new CustomError(404, 'Page not found');
      }
      res.status(200).json(object);
    } catch (error) {
      logger.error(
        `Failed to get published page with key ${req.params.key}:`,
        error
      );
      next(error);
    }
  }
);

pagesRouter.get(
  '/:businessUnitKey/preview/pages/:key',
  async (req, res, next) => {
    try {
      const { key, businessUnitKey } = req.params;

      const object = await PageController.getPreviewPage(
        businessUnitKey,
        key
      );
      res.status(200).json(object);
    } catch (error) {
      logger.error(
        `Failed to get preview page with key ${req.params.key}:`,
        error
      );
      next(error);
    }
  }
);

export default pagesRouter;
