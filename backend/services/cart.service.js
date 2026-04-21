import Cart from "../models/Cart.js";
import CartItem from "../models/CartItem.js";
import Product from "../models/Product.js";
import ProductVariant from "../models/ProductVariant.js";
import UserBehavior from "../models/UserBehavior.js";

const populateCartItems = (query) =>
  query
    .populate("cartId", "userId")
    .populate("productId", "name price discount images style")
    .populate("variantId", "size color sku stock priceAdjustment image");

const calculateCartTotals = (items) => {
  const normalizedItems = items.map((item) => {
    const productPrice = item.productId?.price || 0;
    const discountPercent = item.productId?.discount || 0;
    const discountedBasePrice = productPrice - (productPrice * discountPercent) / 100;
    const variantAdjustment = item.variantId?.priceAdjustment || 0;
    const unitPrice = Math.max(discountedBasePrice + variantAdjustment, 0);
    const lineTotal = unitPrice * item.quantity;

    return {
      ...item.toObject(),
      pricing: {
        productPrice,
        discountPercent,
        variantAdjustment,
        unitPrice,
        lineTotal
      }
    };
  });

  const subTotal = normalizedItems.reduce(
    (total, item) => total + item.pricing.lineTotal,
    0
  );

  return {
    items: normalizedItems,
    summary: {
      itemCount: normalizedItems.reduce((total, item) => total + item.quantity, 0),
      uniqueItems: normalizedItems.length,
      subTotal
    }
  };
};

export const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ userId });

  if (!cart) {
    cart = await Cart.create({ userId });
  }

  return cart;
};

export const getCartDetail = async (userId) => {
  const cart = await getOrCreateCart(userId);
  const itemsQuery = CartItem.find({ cartId: cart._id });
  populateCartItems(itemsQuery);
  const items = await itemsQuery;

  return {
    cart,
    ...calculateCartTotals(items)
  };
};

export const addItemToCart = async (user, payload) => {
  const { productId, variantId, quantity = 1 } = payload;

  if (!productId || !variantId) {
    throw new Error("productId and variantId are required");
  }

  const safeQuantity = Math.max(Number(quantity) || 1, 1);
  const [product, variant, cart] = await Promise.all([
    Product.findById(productId),
    ProductVariant.findById(variantId),
    getOrCreateCart(user._id)
  ]);

  if (!product || !product.isActive) {
    throw new Error("Product not found or inactive");
  }

  if (!variant || !variant.isActive) {
    throw new Error("Variant not found or inactive");
  }

  if (variant.productId.toString() !== product._id.toString()) {
    throw new Error("Variant does not belong to the selected product");
  }

  const existingItem = await CartItem.findOne({
    cartId: cart._id,
    variantId: variant._id
  });

  const requestedQuantity = (existingItem?.quantity || 0) + safeQuantity;

  if (variant.stock < requestedQuantity) {
    throw new Error("Not enough stock available");
  }

  let cartItem;

  if (existingItem) {
    existingItem.quantity = requestedQuantity;
    cartItem = await existingItem.save();
  } else {
    cartItem = await CartItem.create({
      cartId: cart._id,
      productId: product._id,
      variantId: variant._id,
      quantity: safeQuantity
    });
  }

  await UserBehavior.create({
    userId: user._id,
    productId: product._id,
    actionType: "add_to_cart",
    source: payload.source || "cart",
    metadata: {
      style: product.style,
      color: variant.color
    },
    sessionId: payload.sessionId || ""
  });

  const populatedItemQuery = CartItem.findById(cartItem._id);
  populateCartItems(populatedItemQuery);
  const populatedItem = await populatedItemQuery;

  return populatedItem;
};

export const updateCartItemQuantity = async (userId, cartItemId, quantity) => {
  const cart = await getOrCreateCart(userId);
  const item = await CartItem.findOne({
    _id: cartItemId,
    cartId: cart._id
  }).populate("variantId", "stock");

  if (!item) {
    throw new Error("Cart item not found");
  }

  const safeQuantity = Number(quantity);

  if (!Number.isFinite(safeQuantity) || safeQuantity < 1) {
    throw new Error("quantity must be at least 1");
  }

  if (item.variantId.stock < safeQuantity) {
    throw new Error("Not enough stock available");
  }

  item.quantity = safeQuantity;
  await item.save();

  const updatedItemQuery = CartItem.findById(item._id);
  populateCartItems(updatedItemQuery);
  return updatedItemQuery;
};

export const removeCartItem = async (userId, cartItemId) => {
  const cart = await getOrCreateCart(userId);
  const deletedItem = await CartItem.findOneAndDelete({
    _id: cartItemId,
    cartId: cart._id
  });

  if (!deletedItem) {
    throw new Error("Cart item not found");
  }

  return deletedItem;
};

export const clearCart = async (userId) => {
  const cart = await getOrCreateCart(userId);
  await CartItem.deleteMany({ cartId: cart._id });
  return { success: true };
};
