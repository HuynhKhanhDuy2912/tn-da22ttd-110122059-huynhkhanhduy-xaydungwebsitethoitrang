import ProductImage from "../models/PrductImage.js";

const toPlainObject = (item) => (item?.toObject ? item.toObject() : item);

const uniqueUrls = (urls = []) => {
  const seen = new Set();
  const result = [];

  urls.forEach((url) => {
    const normalized = typeof url === "string" ? url.trim() : "";
    if (!normalized || seen.has(normalized)) return;
    seen.add(normalized);
    result.push(normalized);
  });

  return result;
};

export async function attachGalleryImagesToProducts(products) {
  const list = Array.isArray(products) ? products : [products].filter(Boolean);
  const productIds = list.map((item) => item?._id).filter(Boolean);

  if (!productIds.length) {
    return Array.isArray(products) ? [] : products;
  }

  const galleryImages = await ProductImage.find({
    productId: { $in: productIds }
  })
    .sort({ isMain: -1, _id: 1 })
    .lean();

  const imagesByProduct = new Map();
  galleryImages.forEach((image) => {
    const key = String(image.productId);
    if (!imagesByProduct.has(key)) imagesByProduct.set(key, []);
    imagesByProduct.get(key).push(image);
  });

  const decorated = list.map((item) => {
    const plain = toPlainObject(item);
    const gallery = imagesByProduct.get(String(plain._id)) || [];

    return {
      ...plain,
      images: uniqueUrls([
        ...(Array.isArray(plain.images) ? plain.images : []),
        ...gallery.map((image) => image.imageUrl)
      ]),
      galleryImages: gallery
    };
  });

  return Array.isArray(products) ? decorated : decorated[0];
}
