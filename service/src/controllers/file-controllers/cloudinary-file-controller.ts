import { v2 as cloudinary } from 'cloudinary';
import { logger } from '../../utils/logger.utils';
import { FileController } from '../file-controller';

export class CloudinaryFileController implements FileController {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async uploadFile(file: any): Promise<string> {
    try {
      // Convert buffer to base64
      const base64File = file.buffer.toString('base64');
      const dataUri = `data:${file.mimetype};base64,${base64File}`;

      const result = await cloudinary.uploader.upload(dataUri, {
        folder: 'uploads',
        resource_type: 'auto',
      });

      return result.secure_url;
    } catch (error) {
      logger.error('Failed to upload file to Cloudinary:', error);
      throw new Error('Failed to upload file');
    }
  }
}
