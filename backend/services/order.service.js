import Cart from "../models/Cart.js";
import CartItem from "../models/CartItem.js";
import Order from "../models/Order.js";
import OrderItem from "../models/OrderItem.js";
import Payment from "../models/Payment.js";
import ProductVariant from "../models/ProductVariant.js";

const ORDER_POPULATE = [
  { path: "userId", select: "username email full_name" }
];

const populateOrder = (query) => query.populate(ORDER_POPULATE);

export const createOrderFromCart = async (user, body) => {
  const { shippingAddress, receiverName, receiverPhone, note, paymentMethod = "cod" } = body;

  if (!shippingAddress) throw new Error("Shipping address is required");
  if (!receiverName) throw new Error("Receiver name is required");
  if (!receiverPhone) throw new Error("Receiver phone is required");

  const cart = await Cart.findOne({ userId: user._id });
  if (!cart) throw new Error("Cart not found");

  const cartItems = await CartItem.find({ cartId: cart._id })
    .populate("productId", "name price discount")
    .populate("variantId", "size color sku stock priceAdjustment isActive");

  if (cartItems.length === 0) throw new Error("Cart is empty");

  // Validate stock
  for (const item of cartItems) {
    if (!item.variantId?.isActive) throw new Error(`Variant for ${item.productId?.name} is no longer available`);
    if (item.variantId.stock < item.quantity) throw new Error(`Not enough stock for ${item.productId?.name}`);
  }

  // Calculate totals
  let subTotal = 0;
  const orderItemsData = cartItems.map((item) => {
    const basePrice = item.productId?.price || 0;
    const discount = item.productId?.discount || 0;
    const discounted = basePrice - (basePrice * discount) / 100;
    const adj = item.variantId?.priceAdjustment || 0;
    const unitPrice = Math.round(Math.max(discounted + adj, 0));
    subTotal += unitPrice * item.quantity;

    return {
      productId: item.productId._id,
      variantId: item.variantId._id,
      quantity: item.quantity,
      price: unitPrice
    };
  });

  const shippingFee = subTotal >= 500000 ? 0 : 30000;
  const totalPrice = subTotal + shippingFee;

  const order = await Order.create({
    userId: user._id,
    totalPrice,
    subTotal,
    shippingFee,
    discount: 0,
    status: "pending",
    shippingAddress,
    receiverName,
    receiverPhone,
    note: note || ""
  });

  await OrderItem.insertMany(orderItemsData.map((d) => ({ ...d, orderId: order._id })));

  await Payment.create({
    orderId: order._id,
    userId: user._id,
    amount: totalPrice,
    paymentMethod,
    paymentStatus: "pending"
  });

  // Deduct stock
  for (const item of cartItems) {
    await ProductVariant.findByIdAndUpdate(item.variantId._id, {
      $inc: { stock: -item.quantity }
    });
  }

  // Clear cart
  await CartItem.deleteMany({ cartId: cart._id });

  return populateOrder(Order.findById(order._id));
};

export const getMyOrders = async (userId) => {
  return Order.find({ userId }).sort({ createdAt: -1 }).populate(ORDER_POPULATE);
};

export const getOrderDetail = async (userId, orderId) => {
  const order = await Order.findOne({ _id: orderId, userId }).populate(ORDER_POPULATE);
  if (!order) throw new Error("Order not found");

  const items = await OrderItem.find({ orderId })
    .populate("productId", "name price images")
    .populate("variantId", "size color image");

  return { ...order.toObject(), items };
};

export const cancelOrder = async (userId, orderId) => {
  const order = await Order.findOne({ _id: orderId, userId });
  if (!order) throw new Error("Order not found");
  if (!["pending", "confirmed"].includes(order.status)) {
    throw new Error("Cannot cancel order at this stage");
  }

  // Restore stock
  const items = await OrderItem.find({ orderId });
  for (const item of items) {
    await ProductVariant.findByIdAndUpdate(item.variantId, {
      $inc: { stock: item.quantity }
    });
  }

  order.status = "cancelled";
  await order.save();
  return order;
};

export const getAdminOrders = async () => {
  return Order.find({}).sort({ createdAt: -1 }).populate(ORDER_POPULATE);
};

export const getAdminOrderDetail = async (orderId) => {
  const order = await Order.findById(orderId).populate(ORDER_POPULATE);
  if (!order) throw new Error("Order not found");

  const items = await OrderItem.find({ orderId })
    .populate("productId", "name price images")
    .populate("variantId", "size color image");

  return { ...order.toObject(), items };
};

export const updateAdminOrderStatus = async (orderId, status) => {
  const validStatuses = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];
  if (!validStatuses.includes(status)) throw new Error("Invalid status");

  const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
  if (!order) throw new Error("Order not found");
  return order;
};
