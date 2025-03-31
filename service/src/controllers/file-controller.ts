import { Express } from 'express';
import { AWSFileController } from './file-controllers/aws-file-controller';
import { GCPFileController } from './file-controllers/gcp-file-controller';
import { CloudinaryFileController } from './file-controllers/cloudinary-file-controller';

export interface FileController {
  uploadFile(file: Express.Multer.File): Promise<string>;
}

export class FileControllerFactory {
  static createFileController(): FileController {
    const storageType = process.env.STORAGE_TYPE?.toLowerCase() || 'aws';

    switch (storageType) {
      case 'aws':
        return new AWSFileController();
      case 'gcp':
        return new GCPFileController();
      case 'cloudinary':
        return new CloudinaryFileController();
      default:
        throw new Error(`Unsupported storage type: ${storageType}`);
    }
  }
}
