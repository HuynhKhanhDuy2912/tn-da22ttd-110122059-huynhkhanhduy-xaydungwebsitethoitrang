import Product from "../models/Product.js";
import ProductVariant from "../models/ProductVariant.js";
import SearchHistory from "../models/SearchHistory.js";
import UserBehavior from "../models/UserBehavior.js";
import Wishlist from "../models/Wishlist.js";

const actionWeights = {
  view_product: 1,
  click: 2,
  favorite: 3,
  add_to_wishlist: 4,
  add_to_cart: 5,
  purchase: 7
};

const incrementScore = (map, key, score) => {
  if (!key) {
    return;
  }

  map[key] = (map[key] || 0) + score;
};

const buildAffinityMaps = ({ user, wishlistItems, behaviors, searches, variants }) => {
  const styleScores = {};
  const colorScores = {};
  const categoryScores = {};
  const wishlistProductIds = new Set(wishlistItems.map((item) => item.productId?._id?.toString() || item.productId?.toString()));
  const variantColorByProductId = variants.reduce((accumulator, variant) => {
    const productId = variant.productId.toString();

    if (!accumulator[productId]) {
      accumulator[productId] = {};
    }

    accumulator[productId][variant.color] = true;
    return accumulator;
  }, {});

  user.favoriteStyles?.forEach((style) => incrementScore(styleScores, style, 4));
  user.favoriteColors?.forEach((color) => incrementScore(colorScores, color, 4));

  wishlistItems.forEach((item) => {
    const product = item.productId;

    if (!product) {
      return;
    }

    incrementScore(styleScores, product.style, 5);
    incrementScore(categoryScores, product.categoryId?._id?.toString(), 4);

    const productColors = Object.keys(variantColorByProductId[product._id.toString()] || {});
    productColors.forEach((color) => incrementScore(colorScores, color, 4));
  });

  behaviors.forEach((behavior) => {
    const weight = actionWeights[behavior.actionType] || 1;
    const product = behavior.productId;

    if (product) {
      incrementScore(styleScores, product.style, weight);
      incrementScore(categoryScores, product.categoryId?._id?.toString(), weight);

      const productColors = Object.keys(variantColorByProductId[product._id.toString()] || {});
      productColors.forEach((color) => incrementScore(colorScores, color, weight));
    }

    incrementScore(styleScores, behavior.metadata?.style, Math.max(weight - 1, 1));
    incrementScore(colorScores, behavior.metadata?.color, Math.max(weight - 1, 1));
    incrementScore(
      categoryScores,
      behavior.metadata?.categoryId?._id?.toString() || behavior.metadata?.categoryId?.toString(),
      Math.max(weight - 1, 1)
    );
  });

  searches.forEach((search) => {
    incrementScore(styleScores, search.filters?.style, 2);
    incrementScore(colorScores, search.filters?.color, 2);
    incrementScore(
      categoryScores,
      search.filters?.categoryId?._id?.toString() || search.filters?.categoryId?.toString(),
      2
    );
  });

  return {
    styleScores,
    colorScores,
    categoryScores,
    wishlistProductIds
  };
};

export const getPersonalizedRecommendations = async (user, limit = 12) => {
  const safeLimit = Math.min(Math.max(Number(limit) || 12, 1), 30);

  const [products, variants, wishlistItems, behaviors, searches] = await Promise.all([
    Product.find({ isActive: true }).populate("categoryId", "name"),
    ProductVariant.find({ isActive: true, stock: { $gt: 0 } }),
    Wishlist.find({ userId: user._id }).populate({
      path: "productId",
      populate: { path: "categoryId", select: "name" }
    }),
    UserBehavior.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .limit(100)
      .populate("productId")
      .populate("metadata.categoryId", "name"),
    SearchHistory.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .limit(50)
      .populate("filters.categoryId", "name")
  ]);

  const affinity = buildAffinityMaps({
    user,
    wishlistItems,
    behaviors,
    searches,
    variants
  });

  const availableVariantMap = variants.reduce((accumulator, variant) => {
    const productId = variant.productId.toString();

    if (!accumulator[productId]) {
      accumulator[productId] = [];
    }

    accumulator[productId].push({
      _id: variant._id,
      color: variant.color,
      size: variant.size,
      stock: variant.stock,
      sku: variant.sku,
      image: variant.image,
      priceAdjustment: variant.priceAdjustment
    });

    return accumulator;
  }, {});

  const interactedProductIds = new Set(
    behaviors
      .map((behavior) => behavior.productId?._id?.toString() || behavior.productId?.toString())
      .filter(Boolean)
  );

  const scoredProducts = products
    .filter((product) => availableVariantMap[product._id.toString()]?.length)
    .map((product) => {
      const productId = product._id.toString();
      const categoryId = product.categoryId?._id?.toString() || product.categoryId?.toString();
      const productVariants = availableVariantMap[productId] || [];
      const availableColors = [...new Set(productVariants.map((variant) => variant.color))];

      let score = 0;
      const reasons = [];

      if (affinity.styleScores[product.style]) {
        score += affinity.styleScores[product.style];
        reasons.push(`Phu hop phong cach ${product.style}`);
      }

      if (categoryId && affinity.categoryScores[categoryId]) {
        score += affinity.categoryScores[categoryId];
        reasons.push("Dung nhom san pham ban quan tam");
      }

      const matchedColors = availableColors.filter((color) => affinity.colorScores[color]);

      if (matchedColors.length) {
        const colorBonus = matchedColors.reduce(
          (total, color) => total + affinity.colorScores[color],
          0
        );

        score += colorBonus;
        reasons.push(`Hop mau yeu thich: ${matchedColors.slice(0, 2).join(", ")}`);
      }

      if (user.gender && user.gender !== "other" && product.gender === user.gender) {
        score += 2;
      }

      if (product.gender === "unisex") {
        score += 1;
      }

      if (
        user.budgetRange?.max > 0 &&
        product.price <= user.budgetRange.max &&
        product.price >= (user.budgetRange.min || 0)
      ) {
        score += 2;
        reasons.push("Nam trong muc ngan sach");
      }

      if (product.averageRating > 0) {
        score += product.averageRating;
      }

      if (affinity.wishlistProductIds.has(productId)) {
        score -= 100;
      }

      if (interactedProductIds.has(productId)) {
        score -= 10;
      }

      return {
        product,
        score,
        reasons,
        availableVariants: productVariants
      };
    })
    .sort((left, right) => right.score - left.score)
    .slice(0, safeLimit);

  return scoredProducts.map((item) => ({
    ...item.product.toObject(),
    recommendationScore: item.score,
    recommendationReasons: item.reasons.slice(0, 3),
    availableVariants: item.availableVariants
  }));
};
