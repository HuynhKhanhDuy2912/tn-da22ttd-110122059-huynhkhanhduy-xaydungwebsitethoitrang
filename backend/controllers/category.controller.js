import Category from "../models/Category.js";
import Product from "../models/Product.js";
import { createCrudControllers } from "./base.controller.js";

const baseCrud = createCrudControllers(Category, {
  modelName: "Category",
  populate: [{ path: "parentId", select: "name" }]
});

const remove = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id).populate("parentId", "name");

    if (!category) {
      return res.status(404).json({ success: false, message: "Danh mục không tồn tại" });
    }

    // Nếu là danh mục gốc: kiểm tra có danh mục con không
    const isRoot = !category.parentId;
    if (isRoot) {
      const childCount = await Category.countDocuments({ parentId: category._id });
      if (childCount > 0) {
        return res.status(400).json({
          success: false,
          message: `Không thể xóa danh mục gốc "${category.name}" vì đang có ${childCount} danh mục con. Hãy xóa danh mục con trước.`
        });
      }
    }

    // Kiểm tra có sản phẩm nào thuộc danh mục này không
    const productCount = await Product.countDocuments({ categoryId: category._id });
    if (productCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Không thể xóa danh mục "${category.name}" vì đang có ${productCount} sản phẩm. Hãy chuyển hoặc xóa các sản phẩm trước.`
      });
    }

    await Category.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: `Đã xóa danh mục "${category.name}"`,
      data: category
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export default { ...baseCrud, remove };
