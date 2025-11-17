import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from './cloudinary.config';

export const CategoryStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: 'categories',
    format: file.mimetype.split('/')[1],
    public_id: Date.now().toString(),
  }),
});

export const upload = {
  storage: CategoryStorage,
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
      return cb(new Error('Only JPG, JPEG, PNG allowed!'), false);
    }
    cb(null, true);
  },
};

