import { Router } from 'express';
import { logger } from '../utils/logger.utils';
import {
  createCustomObject,
  getCustomObject,
  updateCustomObject,
  deleteCustomObject,
  getCustomObjects
} from '../controllers/custom-object.controller';

const serviceRouter = Router();

// Get all custom objects in a container
serviceRouter.get('/:businessUnitKey/custom-objects', async (req, res, next) => {
  try {
    const { businessUnitKey } = req.params;
    const objects = await getCustomObjects(businessUnitKey);
    res.json(objects);
  } catch (error) {
    logger.error('Failed to get custom objects:', error);
    next(error);
  }
});

// Get a specific custom object
serviceRouter.get('/:businessUnitKey/custom-objects/:key', async (req, res, next) => {
  try {
    const { key } = req.params;
    const object = await getCustomObject(key);
    res.json(object);
  } catch (error) {
    logger.error(`Failed to get custom object with key ${req.params.key}:`, error);
    next(error);
  }
});

// Create a new custom object
serviceRouter.post('/:businessUnitKey/custom-objects/:key', async (req, res, next) => {
  try {
    const { businessUnitKey, key } = req.params;
    const { value } = req.body;
    
    if (!value) {
      return res.status(400).json({ error: 'Value is required in the request body' });
    }

    const object = await createCustomObject(businessUnitKey, key, value);
    res.status(201).json(object);
  } catch (error) {
    logger.error(`Failed to create custom object with key ${req.params.key}:`, error);
    next(error);
  }
});

// Update a custom object
serviceRouter.put('/:businessUnitKey/custom-objects/:key', async (req, res, next) => {
  try {
    const { businessUnitKey, key } = req.params;
    const { value } = req.body;
    
    if (!value) {
      return res.status(400).json({ error: 'Value is required in the request body' });
    }

    const object = await updateCustomObject(businessUnitKey, key, value);
    res.json(object);
  } catch (error) {
    logger.error(`Failed to update custom object with key ${req.params.key}:`, error);
    next(error);
  }
});

// Delete a custom object
serviceRouter.delete('/:businessUnitKey/custom-objects/:key', async (req, res, next) => {
  try {
    const { key } = req.params;
    await deleteCustomObject(key);
    res.status(204).send();
  } catch (error) {
    logger.error(`Failed to delete custom object with key ${req.params.key}:`, error);
    next(error);
  }
});

export default serviceRouter;
