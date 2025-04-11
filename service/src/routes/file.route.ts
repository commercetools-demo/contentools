import { logger } from '../utils/logger.utils';
import multer from 'multer';
import { FileControllerFactory } from '../controllers/file-controller';
import { Router, RequestHandler } from 'express';
import { compileTypeScript } from '../utils/compile.utils';


const fileRouter = Router();

const upload = multer({ storage: multer.memoryStorage() });
const fileController = FileControllerFactory.createFileController();

fileRouter.post(
  '/upload-image',
  upload.single('file') as any,
  (async (req, res, next) => {
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
  }) as RequestHandler
);

fileRouter.post(
  '/compile-upload',
  (async (req, res, next) => {
    try {
      const { code, key } = req.body;

      if (!code) {
        return res.status(400).json({ error: 'No code provided' });
      }

      if (!key) {
        return res.status(400).json({ error: 'No component key provided' });
      }

      // Compile the TypeScript code
      const compilationResult = await compileTypeScript(code);
      
      if (!compilationResult.success) {
        return res.status(400).json({ 
          errors: compilationResult.errors 
        });
      }

      // Create a JS file in memory
      const fileName = `${key}.js`;
      const jsCode = compilationResult.outputText;
      
      // Use Buffer to create a file-like object that matches Express.Multer.File
      const jsFile: Express.Multer.File = {
        buffer: Buffer.from(jsCode),
        originalname: fileName,
        mimetype: 'application/javascript',
        encoding: '7bit',
        size: jsCode.length,
        fieldname: 'file',
        destination: `deployed-content-types`,
        filename: fileName,
        path: `deployed-content-types/${fileName}`
      } as Express.Multer.File;

      // Upload the compiled JS file
      const fileUrl = await fileController.uploadFile(jsFile, 'deployed-content-types');

      res.json({ 
        success: true, 
        url: fileUrl 
      });
    } catch (error) {
      logger.error('Failed to compile and upload:', error);
      next(error);
    }
  }) as RequestHandler
);

export default fileRouter;
