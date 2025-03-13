import { Router } from 'express';
import { logger } from '../utils/logger.utils';
import {
  CustomObjectController
} from '../controllers/custom-object.controller';

const serviceRouter = Router();

const MAIN_CONTAINER = process.env.MAIN_CONTAINER || 'default';
const REGISTRY_CONTAINER = process.env.REGISTRY_CONTAINER || 'registry';

const businessUnitController = new CustomObjectController(MAIN_CONTAINER);
const registryController = new CustomObjectController(REGISTRY_CONTAINER);


serviceRouter.get('/registry', async (req, res, next) => {
  try {
    const objects = await registryController.getCustomObjects();
    res.json(objects);
  } catch (error) {
    logger.error('Failed to get registry objects:', error);
    next(error);
  }
});

serviceRouter.get('/registry/:key', async (req, res, next) => {
  try {
    const { key } = req.params;
    const object = await registryController.getCustomObject(key);
    res.json(object);
  } catch (error) {
    logger.error(`Failed to get registry object with key ${req.params.key}:`, error);
    next(error);
  }
});

serviceRouter.post('/registry/:key', async (req, res, next) => {
  try {
    const { key } = req.params;
    const { value } = req.body;
    const object = await registryController.createCustomObject(key, value);
    res.status(201).json(object);
  } catch (error) {
    logger.error(`Failed to create registry object with key ${req.params.key}:`, error);
    next(error);
  }
});

serviceRouter.put('/registry/:key', async (req, res, next) => {
  try {
    const { key } = req.params;
    const { value } = req.body;
    const object = await registryController.updateCustomObject(key, value);
    res.json(object);
  } catch (error) {
    logger.error(`Failed to update registry object with key ${req.params.key}:`, error);
    next(error);
  }
});


serviceRouter.get('/:businessUnitKey/custom-objects', async (req, res, next) => {
  try {
    const { businessUnitKey } = req.params;
    const objects = await businessUnitController.getCustomObjects(`value(businessUnitKey = "${businessUnitKey}")`);
    res.json(objects);
  } catch (error) {
    logger.error('Failed to get custom objects:', error);
    next(error);
  }
});

serviceRouter.get('/:businessUnitKey/custom-objects/:key', async (req, res, next) => {
  try {
    const { key } = req.params;
    const object = await businessUnitController.getCustomObject(key);
    res.json(object);
  } catch (error) {
    logger.error(`Failed to get custom object with key ${req.params.key}:`, error);
    next(error);
  }
});

serviceRouter.post('/:businessUnitKey/custom-objects/:key', async (req, res, next) => {
  try {
    const { businessUnitKey, key } = req.params;
    const { value } = req.body;
    
    if (!value) {
      return res.status(400).json({ error: 'Value is required in the request body' });
    }

    const object = await businessUnitController.createCustomObject(key, {
      ...value,
      businessUnitKey
    });
    res.status(201).json(object);
  } catch (error) {
    logger.error(`Failed to create custom object with key ${req.params.key}:`, error);
    next(error);
  }
});

serviceRouter.put('/:businessUnitKey/custom-objects/:key', async (req, res, next) => {
  try {
    const { businessUnitKey, key } = req.params;
    const { value } = req.body;
    
    if (!value) {
      return res.status(400).json({ error: 'Value is required in the request body' });
    }

    const object = await businessUnitController.updateCustomObject(key, {
      ...value,
      businessUnitKey
    });
    res.json(object);
  } catch (error) {
    logger.error(`Failed to update custom object with key ${req.params.key}:`, error);
    next(error);
  }
});

serviceRouter.delete('/:businessUnitKey/custom-objects/:key', async (req, res, next) => {
  try {
    const { key } = req.params;
    await businessUnitController.deleteCustomObject(key);
    res.status(204).send();
  } catch (error) {
    logger.error(`Failed to delete custom object with key ${req.params.key}:`, error);
    next(error);
  }
});

export default serviceRouter;
