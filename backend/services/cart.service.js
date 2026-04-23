import Cart from "../models/Cart.js";
import CartItem from "../models/CartItem.js";
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
        unitPrice: Math.round(unitPrice),
        lineTotal: Math.round(lineTotal)
      }
    };
  });

  const subTotal = normalizedItems.reduce((sum, i) => sum + i.pricing.lineTotal, 0);
  const itemCount = normalizedItems.reduce((sum, i) => sum + i.quantity, 0);

  return { items: normalizedItems, subTotal: Math.round(subTotal), itemCount };
};

export const getCartDetail = async (userId) => {
  let cart = await Cart.findOne({ userId });
  if (!cart) cart = await Cart.create({ userId });

  const rawItems = await populateCartItems(
    CartItem.find({ cartId: cart._id })
  );

  return { cart, ...calculateCartTotals(rawItems) };
};

export const addItemToCart = async (user, body) => {
  const { productId, variantId, quantity = 1, source = "product_page" } = body;

  const variant = await ProductVariant.findById(variantId);
  if (!variant) throw new Error("Variant not found");
  if (!variant.isActive) throw new Error("Variant is not available");
  if (variant.stock < quantity) throw new Error("Not enough stock");

  let cart = await Cart.findOne({ userId: user._id });
  if (!cart) cart = await Cart.create({ userId: user._id });

  let item = await CartItem.findOne({ cartId: cart._id, variantId });
  if (item) {
    item.quantity += quantity;
    await item.save();
  } else {
    item = await CartItem.create({ cartId: cart._id, productId, variantId, quantity });
  }

  // Track behavior
  try {
    await UserBehavior.create({
      userId: user._id,
      productId,
      actionType: "add_to_cart",
      source,
      metadata: { variantId, quantity }
    });
  } catch (_) { /* non-critical */ }

  return populateCartItems(CartItem.findById(item._id));
};

export const updateCartItemQuantity = async (userId, cartItemId, quantity) => {
  const cart = await Cart.findOne({ userId });
  if (!cart) throw new Error("Cart not found");

  const item = await CartItem.findOne({ _id: cartItemId, cartId: cart._id });
  if (!item) throw new Error("Cart item not found");

  if (quantity <= 0) {
    await item.deleteOne();
    return null;
  }

  const variant = await ProductVariant.findById(item.variantId);
  if (variant && variant.stock < quantity) throw new Error("Not enough stock");

  item.quantity = quantity;
  await item.save();

  return populateCartItems(CartItem.findById(item._id));
};

export const removeCartItem = async (userId, cartItemId) => {
  const cart = await Cart.findOne({ userId });
  if (!cart) throw new Error("Cart not found");

  const item = await CartItem.findOneAndDelete({ _id: cartItemId, cartId: cart._id });
  if (!item) throw new Error("Cart item not found");

  return item;
};

export const clearCart = async (userId) => {
  const cart = await Cart.findOne({ userId });
  if (!cart) return;
  await CartItem.deleteMany({ cartId: cart._id });
};
