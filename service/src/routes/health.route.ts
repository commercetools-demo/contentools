import { Router } from 'express';

const healthRouter = Router();

healthRouter.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', projectkey: process.env.CTP_PROJECT_KEY });
});

export default healthRouter;
