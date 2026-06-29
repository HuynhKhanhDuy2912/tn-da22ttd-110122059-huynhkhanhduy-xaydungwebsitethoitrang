import { createCrudControllers } from "./base.controller.js";
import SizeGuide from "../models/SizeGuide.js";

const crud = createCrudControllers(SizeGuide, {
  modelName: "SizeGuide",
  populate: [{ path: "categoryId", select: "name" }],
});

const getByCategoryId = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const sizeGuide = await SizeGuide.findOne({
      categoryId,
      isActive: true,
    }).populate("categoryId", "name");

    if (!sizeGuide) {
      return res.status(200).json({
        success: true,
        message: "Chưa có bảng size cho danh mục này",
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Lấy bảng size thành công",
      data: sizeGuide,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export default {
  ...crud,
  getByCategoryId,
};
