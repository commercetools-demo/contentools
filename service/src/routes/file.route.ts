
import { logger } from '../utils/logger.utils';
import multer from 'multer';
import { FileControllerFactory } from '../controllers/file-controller';
import { Router } from 'express';

const fileRouter = Router();

const upload = multer({ storage: multer.memoryStorage() });
const fileController = FileControllerFactory.createFileController();

fileRouter.post('/upload-image', upload.single('file') as any, async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }
  
      const fileUrl = await fileController.uploadFile(req.file);
      res.json({ url: fileUrl });
    } catch (error) {
      logger.error('Failed to upload file:', error);
      next(error);
    }
  });

  export default fileRouter;