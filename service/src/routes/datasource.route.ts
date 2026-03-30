import { Router } from 'express';
import { logger } from '../utils/logger.utils';
import { DATASOURCES } from '../constants';
import { resolveDatasource } from '../controllers/datasource-resolution.route';
import { validateJwt } from '../middleware/jwt.middleware';
import { validateProject } from '../middleware/project.middleware';
import { requireProjectKey } from '../middleware/project-key.middleware';

const datasourceRouter = Router();

// List all datasources (served from the in-code constant)
datasourceRouter.get('/datasource', requireProjectKey, (_req, res) => {
  res.json(DATASOURCES);
});

// Get a single datasource by key
datasourceRouter.get('/datasource/:key', requireProjectKey, (req, res) => {
  const datasource = DATASOURCES.find((d) => d.key === req.params.key);
  if (!datasource) {
    res.status(404).json({ error: `Datasource '${req.params.key}' not found` });
    return;
  }
  res.json(datasource);
});

// Test / resolve a datasource with supplied params
datasourceRouter.post(
  '/datasource/:key/test',
  validateJwt,
  validateProject,
  async (req, res, next) => {
    try {
      const { key } = req.params;
      const datasource = DATASOURCES.find((d) => d.key === key);
      if (!datasource) {
        res.status(404).json({ error: `Datasource '${key}' not found` });
        return;
      }
      const { params } = req.body;
      const result = await resolveDatasource(req, key, params);
      res.json(result);
    } catch (error) {
      logger.error(
        `Failed to test datasource '${req.params.key}':`,
        error
      );
      next(error);
    }
  }
);

export default datasourceRouter;
