import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME!,
      api_key: process.env.CLOUDINARY_API_KEY!,
      api_secret: process.env.CLOUDINARY_API_SECRET!,
    });
  }

  createCategoryStorage() {
    return this.createStorage('categories');
  }

  createInventoryStorage() {
    return this.createStorage('inventory');
  }
  createStorage(folder: string) {
    const storage = new CloudinaryStorage({
      cloudinary,
      params: async (req, file) => ({
        folder: folder,
        format: file.mimetype.split('/')[1],
        public_id: Date.now().toString(),
      }),
    });

    return {
      storage,
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
          return cb(new Error('Only JPG, JPEG, PNG allowed!'), false);
        }
        cb(null, true);
      },
    };
  }
}
