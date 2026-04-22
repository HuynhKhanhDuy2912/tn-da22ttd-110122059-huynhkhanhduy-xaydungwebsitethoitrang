import express from 'express';
import { upload, cloudinary } from '../config/cloudinary.js';
import { protect, authorize } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Upload an image
router.post('/', protect, authorize('admin'), upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file provided' });
    }
    return res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      imageUrl: req.file.path
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// Delete an image
router.delete('/', protect, authorize('admin'), async (req, res) => {
  try {
    const { imageUrl } = req.body;
    if (!imageUrl) {
      return res.status(400).json({ success: false, message: 'No imageUrl provided' });
    }

    // Extract public_id from Cloudinary URL
    // e.g., https://res.cloudinary.com/cloud_name/image/upload/v1234567890/fashionstore/my_image.jpg
    // public_id is fashionstore/my_image
    const urlParts = imageUrl.split('/');
    const lastPart = urlParts[urlParts.length - 1]; // my_image.jpg
    const folder = urlParts[urlParts.length - 2]; // fashionstore
    const fileNameWithoutExt = lastPart.split('.')[0];
    const publicId = `${folder}/${fileNameWithoutExt}`;

    await cloudinary.uploader.destroy(publicId);

    return res.status(200).json({
      success: true,
      message: 'Image deleted from Cloudinary'
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
