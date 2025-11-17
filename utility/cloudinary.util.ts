// cloudinary.util.ts
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';



export const createCategoryStorage = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME!,
    api_key: process.env.CLOUDINARY_API_KEY!,
    api_secret: process.env.CLOUDINARY_API_SECRET!,
  });

  const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => ({
      folder: 'categories',
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
};
