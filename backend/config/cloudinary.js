import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'fashionstore',
    allowedFormats: ['jpg', 'png', 'jpeg', 'webp'],
  },
});

export const upload = multer({ storage: storage });

export const deleteImageFromCloudinary = async (imageUrl) => {
  if (!imageUrl) return;
  try {
    const urlParts = imageUrl.split('/');
    const lastPart = urlParts[urlParts.length - 1];
    const folder = urlParts[urlParts.length - 2];
    const fileNameWithoutExt = lastPart.split('.')[0];
    const publicId = `${folder}/${fileNameWithoutExt}`;
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error);
  }
};

export { cloudinary };
