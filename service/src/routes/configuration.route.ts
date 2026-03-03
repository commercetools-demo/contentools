import { Router, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.utils';
import * as ConfigurationController from '../controllers/configuration.controller';
import { validateJwt } from '../middleware/jwt.middleware';
import { validateProject } from '../middleware/project.middleware';
import { requireProjectKey } from '../middleware/project-key.middleware';
import { AuthenticatedRequest } from '../types/service.types';

const configurationRouter = Router();

configurationRouter.get(
  '/:businessUnitKey/configuration/theme',
  requireProjectKey,
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { businessUnitKey } = req.params;
      const theme = await ConfigurationController.getTheme(
        req,
        businessUnitKey
      );
      res.status(200).json(theme);
    } catch (error) {
      logger.error('Failed to get configuration theme:', error);
      next(error);
    }
  }
);

configurationRouter.get(
  '/:businessUnitKey/configuration',
  requireProjectKey,
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { businessUnitKey } = req.params;
      const { theme, header } =
        await ConfigurationController.getAllConfigurations(
          req,
          businessUnitKey
        );
      res.status(200).json({ theme, header });
    } catch (error) {
      logger.error('Failed to get configurations:', error);
      next(error);
    }
  }
);

configurationRouter.post(
  '/:businessUnitKey/configuration/theme',
  validateJwt,
  validateProject,
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { value } = req.body;
      const { businessUnitKey } = req.params;
      const theme = await ConfigurationController.createTheme(
        req,
        businessUnitKey,
        value
      );
      res.status(201).json(theme);
    } catch (error) {
      logger.error('Failed to create configuration theme:', error);
      next(error);
    }
  }
);

configurationRouter.put(
  '/:businessUnitKey/configuration/theme',
  validateJwt,
  validateProject,
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { value } = req.body;
      const { businessUnitKey } = req.params;
      const theme = await ConfigurationController.updateTheme(
        req,
        businessUnitKey,
        value
      );
      res.json(theme);
    } catch (error) {
      logger.error('Failed to update configuration theme:', error);
      next(error);
    }
  }
);

configurationRouter.delete(
  '/:businessUnitKey/configuration/theme',
  validateJwt,
  validateProject,
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { businessUnitKey } = req.params;
      await ConfigurationController.deleteTheme(req, businessUnitKey);
      res.status(204).send();
    } catch (error) {
      logger.error('Failed to delete configuration theme:', error);
      next(error);
    }
  }
);

// Header configuration
configurationRouter.get(
  '/:businessUnitKey/configuration/header',
  requireProjectKey,
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { businessUnitKey } = req.params;
      const header = await ConfigurationController.getHeader(
        req,
        businessUnitKey
      );
      res.status(200).json(header);
    } catch (error) {
      logger.error('Failed to get configuration header:', error);
      next(error);
    }
  }
);

configurationRouter.post(
  '/:businessUnitKey/configuration/header',
  validateJwt,
  validateProject,
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { value } = req.body;
      const { businessUnitKey } = req.params;
      const header = await ConfigurationController.createHeader(
        req,
        businessUnitKey,
        value
      );
      res.status(201).json(header);
    } catch (error) {
      logger.error('Failed to create configuration header:', error);
      next(error);
    }
  }
);

configurationRouter.put(
  '/:businessUnitKey/configuration/header',
  validateJwt,
  validateProject,
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { value } = req.body;
      const { businessUnitKey } = req.params;
      const header = await ConfigurationController.updateHeader(
        req,
        businessUnitKey,
        value
      );
      res.json(header);
    } catch (error) {
      logger.error('Failed to update configuration header:', error);
      next(error);
    }
  }
);

configurationRouter.delete(
  '/:businessUnitKey/configuration/header',
  validateJwt,
  validateProject,
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { businessUnitKey } = req.params;
      await ConfigurationController.deleteHeader(req, businessUnitKey);
      res.status(204).send();
    } catch (error) {
      logger.error('Failed to delete configuration header:', error);
      next(error);
    }
  }
);

export default configurationRouter;
