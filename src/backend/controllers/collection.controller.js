import Collection from "../models/Collection.js";
import { createCrudControllers } from "./base.controller.js";
import { attachGalleryImagesToProducts } from "../services/productImage.service.js";

const productSelect = "name slug price discount images isActive";

const attachGalleryToCollectionProducts = async (collection) => {
  if (!collection) return collection;

  const plain = collection.toObject ? collection.toObject() : collection;
  const products = Array.isArray(plain.products)
    ? plain.products.filter(Boolean)
    : [];

  return {
    ...plain,
    products: await attachGalleryImagesToProducts(products)
  };
};

const crud = createCrudControllers(Collection, {
  modelName: "Collection",
  populate: [
    {
      path: "products",
      select: productSelect
    }
  ],
  defaultSort: { order: 1, createdAt: -1 }
});

const getById = async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id)
      .populate({
        path: "products",
        select: productSelect
      });

    if (!collection) {
      return res.status(404).json({
        success: false,
        message: "Collection not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Collection fetched successfully",
      data: await attachGalleryToCollectionProducts(collection)
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Custom: get collection by slug (public)
const getBySlug = async (req, res) => {
  try {
    const collection = await Collection.findOne({ slug: req.params.slug })
      .populate({
        path: "products",
        select: productSelect,
        match: { isActive: true }
      });

    if (!collection) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy bộ sưu tập"
      });
    }

    return res.status(200).json({
      success: true,
      data: await attachGalleryToCollectionProducts(collection)
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export default {
  ...crud,
  getById,
  getBySlug
};
