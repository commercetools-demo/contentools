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
serviceRouter.get('/custom-objects', async (req, res, next) => {
  try {
    const { container } = req.query;
    const objects = await getCustomObjects(container as string);
    res.json(objects);
  } catch (error) {
    logger.error('Failed to get custom objects:', error);
    next(error);
  }
});

// Get a specific custom object
serviceRouter.get('/custom-objects/:key', async (req, res, next) => {
  try {
    const { key } = req.params;
    const { container } = req.query;
    const object = await getCustomObject(container as string, key);
    res.json(object);
  } catch (error) {
    logger.error(`Failed to get custom object with key ${req.params.key}:`, error);
    next(error);
  }
});

// Create a new custom object
serviceRouter.post('/custom-objects/:key', async (req, res, next) => {
  try {
    const { key } = req.params;
    const { container } = req.query;
    const { value } = req.body;
    
    if (!value) {
      return res.status(400).json({ error: 'Value is required in the request body' });
    }

    const object = await createCustomObject(container as string, key, value);
    res.status(201).json(object);
  } catch (error) {
    logger.error(`Failed to create custom object with key ${req.params.key}:`, error);
    next(error);
  }
});

// Update a custom object
serviceRouter.put('/custom-objects/:key', async (req, res, next) => {
  try {
    const { key } = req.params;
    const { container } = req.query;
    const { value } = req.body;
    
    if (!value) {
      return res.status(400).json({ error: 'Value is required in the request body' });
    }

    const object = await updateCustomObject(container as string, key, value);
    res.json(object);
  } catch (error) {
    logger.error(`Failed to update custom object with key ${req.params.key}:`, error);
    next(error);
  }
});

// Delete a custom object
serviceRouter.delete('/custom-objects/:key', async (req, res, next) => {
  try {
    const { key } = req.params;
    const { container } = req.query;
    await deleteCustomObject(container as string, key);
    res.status(204).send();
  } catch (error) {
    logger.error(`Failed to delete custom object with key ${req.params.key}:`, error);
    next(error);
  }
});

export default serviceRouter;
