import { Router, RequestHandler } from 'express';
import { logger } from '../utils/logger.utils';
import { CustomObjectController } from '../controllers/custom-object.controller';
import { DATASOURCE_CONTAINER } from '../constants';
import { resolveDatasource } from '../controllers/datasource-resolution.route';
import { validateJwt } from '../middleware/jwt.middleware';
import { validateProject } from '../middleware/project.middleware';
import { requireProjectKey } from '../middleware/project-key.middleware';

const datasourceRouter = Router();

datasourceRouter.get('/datasource', requireProjectKey, async (req, res, next) => {
  try {
    const datasourceController = new CustomObjectController(req, DATASOURCE_CONTAINER);
    const objects = await datasourceController.getCustomObjects();
    res.json(objects);
  } catch (error) {
    logger.error('Failed to get datasource objects:', error);
    next(error);
  }
});

datasourceRouter.get('/datasource/:key', requireProjectKey, async (req, res, next) => {
  try {
    const { key } = req.params;
    const datasourceController = new CustomObjectController(req, DATASOURCE_CONTAINER);
    const object = await datasourceController.getCustomObject(key);
    res.json(object);
  } catch (error) {
    logger.error(
      `Failed to get datasource object with key ${req.params.key}:`,
      error
    );
    next(error);
  }
});

datasourceRouter.post('/datasource/:key', validateJwt, validateProject, (async (req, res, next) => {
  try {
    // return error if key exists
    const { key } = req.params;
    try {
      const datasourceController = new CustomObjectController(req, DATASOURCE_CONTAINER);
      const objectExists = await datasourceController.getCustomObject(key);
      if (objectExists) {
        return res
          .status(400)
          .json({ error: 'datasource object with key already exists' });
      }
    } catch (error) {
      // Key doesn't exist, continue with creation
    }
    const { value } = req.body;
    const datasourceController = new CustomObjectController(req, DATASOURCE_CONTAINER);
    const object = await datasourceController.createCustomObject(key, value);
    res.status(201).json(object);
  } catch (error) {
    logger.error(
      `Failed to create datasource object with key ${req.params.key}:`,
      error
    );
    next(error);
  }
}) as RequestHandler);

datasourceRouter.put('/datasource/:key', validateJwt, validateProject, async (req, res, next) => {
  try {
    const { key } = req.params;
    const { value } = req.body;
    const datasourceController = new CustomObjectController(req, DATASOURCE_CONTAINER);
    const object = await datasourceController.updateCustomObject(key, value);
    res.json(object);
  } catch (error) {
    logger.error(
      `Failed to update datasource object with key ${req.params.key}:`,
      error
    );
    next(error);
  }
});

datasourceRouter.delete('/datasource/:key', validateJwt, validateProject, async (req, res, next) => {
  try {
    const { key } = req.params;
    const datasourceController = new CustomObjectController(req, DATASOURCE_CONTAINER);
    await datasourceController.deleteCustomObject(key);
    res.status(204).send();
  } catch (error) {
    logger.error(
      `Failed to delete datasource object with key ${req.params.key}:`,
      error
    );
    next(error);
  }
});

datasourceRouter.post('/datasource/:key/test', validateJwt, validateProject, async (req, res, next) => {
  try {
    const { key } = req.params;
    const { params } = req.body;
    const datasourceController = new CustomObjectController(req, DATASOURCE_CONTAINER);
    const object = await datasourceController.getCustomObject(key);
    const result = await resolveDatasource(req, key, params);
    res.json(result);
  } catch (error) {
    logger.error(
      `Failed to test datasource object with key ${req.params.key}:`,
      error
    );
    next(error);
  }
});

export default datasourceRouter;
