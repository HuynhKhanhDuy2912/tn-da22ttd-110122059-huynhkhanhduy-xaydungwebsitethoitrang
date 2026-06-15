export const FALLBACK_PRODUCT_IMAGE =
  "https://placehold.co/900x1200/F5F5F5/222?text=Fashion";

export function normalizeProductImageUrl(value) {
  if (typeof value === "string") return value.trim();
  if (value?.imageUrl) return String(value.imageUrl).trim();
  if (value?.image) return String(value.image).trim();
  return "";
}

export function getProductImageUrls(product = {}) {
  if (!Array.isArray(product.images)) return [];

  return product.images
    .map(normalizeProductImageUrl)
    .filter(Boolean);
}

export function getProductGalleryImageUrls(product = {}, activeColor = "") {
  if (!Array.isArray(product.galleryImages)) return [];

  const normalizedActiveColor = String(activeColor || "").trim().toLowerCase();
  const sameColor = [];
  const noColor = [];
  const otherColor = [];

  product.galleryImages.forEach((item) => {
    const url = normalizeProductImageUrl(item);
    if (!url) return;

    const imageColor = String(item?.color || "").trim().toLowerCase();
    if (normalizedActiveColor && imageColor === normalizedActiveColor) {
      sameColor.push(url);
    } else if (!imageColor) {
      noColor.push(url);
    } else {
      otherColor.push(url);
    }
  });

  return [...sameColor, ...noColor, ...otherColor];
}

export function findFirstDistinctImage(candidates = [], currentImage = "") {
  const normalizedCurrent = normalizeProductImageUrl(currentImage);

  return candidates
    .map(normalizeProductImageUrl)
    .find((url) => url && url !== normalizedCurrent) || "";
}
