import { Storage } from '@google-cloud/storage';
import { logger } from '../../utils/logger.utils';
import { FileController } from '../file-controller';

export class GCPFileController implements FileController {
  private storage: Storage;
  private bucket: string;

  constructor() {
    this.bucket = process.env.GCP_BUCKET_NAME || '';
    this.storage = new Storage({
      projectId: process.env.GCP_PROJECT_ID,
      credentials: {
        client_email: process.env.GCP_CLIENT_EMAIL,
        private_key: process.env.GCP_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
    });
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    try {
      const bucket = this.storage.bucket(this.bucket);
      const blob = bucket.file(`uploads/${Date.now()}-${file.originalname}`);
      
      await blob.save(file.buffer, {
        contentType: file.mimetype,
        public: true,
      });

      // Return the public URL of the uploaded file
      return `https://storage.googleapis.com/${this.bucket}/${blob.name}`;
    } catch (error) {
      logger.error('Failed to upload file to GCP:', error);
      throw new Error('Failed to upload file');
    }
  }
}
