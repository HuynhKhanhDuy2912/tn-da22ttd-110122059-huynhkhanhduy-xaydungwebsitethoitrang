import express from 'express';
import { upload, deleteMediaFromCloudinaryIfUnused, forceDeleteFromCloudinary, countMediaReferences } from '../config/cloudinary.js';
import { protect, authorize } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Upload an image or video
router.post('/', protect, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file provided' });
    }
    const mediaType = req.file.mimetype?.startsWith('video/') ? 'video' : 'image';
    return res.status(200).json({
      success: true,
      message: `${mediaType === 'video' ? 'Video' : 'Image'} uploaded successfully`,
      imageUrl: req.file.path,
      mediaUrl: req.file.path,
      mediaType
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// Delete an image or video
router.delete('/', protect, authorize('admin'), async (req, res) => {
  try {
    const { imageUrl } = req.body;
    if (!imageUrl) {
      return res.status(400).json({ success: false, message: 'No imageUrl provided' });
    }

    // Safety: kiểm tra xem ảnh có đang được dùng không trước khi xóa
    const refCount = await countMediaReferences(imageUrl);
    if (refCount > 0) {
      return res.status(200).json({
        success: true,
        message: `File is still referenced by ${refCount} record(s), skipped Cloudinary deletion`
      });
    }

    await forceDeleteFromCloudinary(imageUrl);

    return res.status(200).json({
      success: true,
      message: 'File deleted from Cloudinary'
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
