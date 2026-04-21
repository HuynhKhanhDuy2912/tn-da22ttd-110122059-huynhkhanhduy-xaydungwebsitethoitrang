import dotenv from "dotenv";

dotenv.config();

import { connectDatabase } from "../config/db.js";
import Category from "../models/Category.js";
import Outfit from "../models/Outfit.js";
import Product from "../models/Product.js";
import ProductVariant from "../models/ProductVariant.js";
import SearchHistory from "../models/SearchHistory.js";
import User from "../models/User.js";
import UserBehavior from "../models/UserBehavior.js";
import Wishlist from "../models/Wishlist.js";
import Review from "../models/Review.js";
import Cart from "../models/Cart.js";
import CartItem from "../models/CartItem.js";
import Order from "../models/Order.js";
import OrderItem from "../models/OrderItem.js";
import Payment from "../models/Payment.js";

const categorySeed = [
  { name: "Tops" },
  { name: "Bottoms" },
  { name: "Outerwear" },
  { name: "Shoes" }
];

const productSeed = (categories) => [
  {
    name: "Minimal White Shirt",
    description: "A clean white shirt for work and casual styling.",
    price: 420000,
    discount: 10,
    categoryId: categories.tops._id,
    brand: "FashionStore Studio",
    gender: "unisex",
    material: "cotton",
    style: "minimal",
    season: ["spring", "summer", "autumn"],
    occasion: ["casual", "work"],
    images: ["https://example.com/products/white-shirt.jpg"],
    tags: ["shirt", "minimal", "office"],
    averageRating: 4.6,
    totalReviews: 18,
    isActive: true
  },
  {
    name: "Streetwear Cargo Pants",
    description: "Relaxed cargo pants for a modern streetwear look.",
    price: 560000,
    discount: 5,
    categoryId: categories.bottoms._id,
    brand: "FashionStore Street",
    gender: "unisex",
    material: "twill",
    style: "streetwear",
    season: ["autumn", "winter"],
    occasion: ["casual", "street", "travel"],
    images: ["https://example.com/products/cargo-pants.jpg"],
    tags: ["cargo", "streetwear"],
    averageRating: 4.4,
    totalReviews: 12,
    isActive: true
  },
  {
    name: "Elegant Beige Skirt",
    description: "A soft beige skirt suited for date nights and work outfits.",
    price: 490000,
    discount: 0,
    categoryId: categories.bottoms._id,
    brand: "FashionStore Elegance",
    gender: "female",
    material: "linen blend",
    style: "elegant",
    season: ["spring", "summer"],
    occasion: ["date", "work", "formal"],
    images: ["https://example.com/products/beige-skirt.jpg"],
    tags: ["skirt", "elegant", "beige"],
    averageRating: 4.8,
    totalReviews: 24,
    isActive: true
  },
  {
    name: "Black Oversized Blazer",
    description: "Structured blazer for smart casual and office looks.",
    price: 790000,
    discount: 15,
    categoryId: categories.outerwear._id,
    brand: "FashionStore Studio",
    gender: "female",
    material: "polyester blend",
    style: "smart_casual",
    season: ["autumn", "winter", "spring"],
    occasion: ["work", "formal", "date"],
    images: ["https://example.com/products/black-blazer.jpg"],
    tags: ["blazer", "office", "black"],
    averageRating: 4.7,
    totalReviews: 20,
    isActive: true
  },
  {
    name: "Vintage Denim Jacket",
    description: "Layer-friendly denim jacket for daily wear.",
    price: 680000,
    discount: 0,
    categoryId: categories.outerwear._id,
    brand: "FashionStore Retro",
    gender: "unisex",
    material: "denim",
    style: "vintage",
    season: ["autumn", "winter", "spring"],
    occasion: ["casual", "travel", "street"],
    images: ["https://example.com/products/denim-jacket.jpg"],
    tags: ["denim", "jacket", "vintage"],
    averageRating: 4.5,
    totalReviews: 11,
    isActive: true
  },
  {
    name: "Sporty Running Sneakers",
    description: "Lightweight sneakers for active everyday comfort.",
    price: 920000,
    discount: 8,
    categoryId: categories.shoes._id,
    brand: "FashionStore Move",
    gender: "unisex",
    material: "mesh",
    style: "sporty",
    season: ["all_season"],
    occasion: ["sport", "casual", "travel"],
    images: ["https://example.com/products/running-sneakers.jpg"],
    tags: ["sneakers", "sport"],
    averageRating: 4.9,
    totalReviews: 31,
    isActive: true
  }
];

const buildVariantSeed = (products) => [
  {
    productId: products.whiteShirt._id,
    size: "M",
    color: "white",
    sku: "WS-M-WHITE",
    stock: 20,
    priceAdjustment: 0,
    image: "https://example.com/variants/white-shirt-white.jpg",
    isActive: true
  },
  {
    productId: products.whiteShirt._id,
    size: "L",
    color: "blue",
    sku: "WS-L-BLUE",
    stock: 10,
    priceAdjustment: 20000,
    image: "https://example.com/variants/white-shirt-blue.jpg",
    isActive: true
  },
  {
    productId: products.cargoPants._id,
    size: "L",
    color: "black",
    sku: "CP-L-BLACK",
    stock: 18,
    priceAdjustment: 0,
    image: "https://example.com/variants/cargo-black.jpg",
    isActive: true
  },
  {
    productId: products.cargoPants._id,
    size: "XL",
    color: "olive",
    sku: "CP-XL-OLIVE",
    stock: 12,
    priceAdjustment: 0,
    image: "https://example.com/variants/cargo-olive.jpg",
    isActive: true
  },
  {
    productId: products.beigeSkirt._id,
    size: "M",
    color: "beige",
    sku: "BS-M-BEIGE",
    stock: 15,
    priceAdjustment: 0,
    image: "https://example.com/variants/skirt-beige.jpg",
    isActive: true
  },
  {
    productId: products.blazer._id,
    size: "M",
    color: "black",
    sku: "BL-M-BLACK",
    stock: 9,
    priceAdjustment: 0,
    image: "https://example.com/variants/blazer-black.jpg",
    isActive: true
  },
  {
    productId: products.denimJacket._id,
    size: "L",
    color: "blue",
    sku: "DJ-L-BLUE",
    stock: 14,
    priceAdjustment: 0,
    image: "https://example.com/variants/denim-blue.jpg",
    isActive: true
  },
  {
    productId: products.sneakers._id,
    size: "42",
    color: "white",
    sku: "SN-42-WHITE",
    stock: 16,
    priceAdjustment: 0,
    image: "https://example.com/variants/sneaker-white.jpg",
    isActive: true
  }
];

const buildOutfitSeed = (products) => [
  {
    name: "Minimal Office Set",
    description: "A polished office outfit with a minimal aesthetic.",
    products: [products.whiteShirt._id, products.blazer._id],
    image: "https://example.com/outfits/minimal-office.jpg",
    occasion: "work",
    season: "autumn",
    bodyShape: ["rectangle", "hourglass"],
    style: "minimal",
    genderTarget: "female",
    colors: ["white", "black"],
    tags: ["office", "minimal"],
    weather: ["cool"],
    isActive: true,
    viewCount: 56,
    saveCount: 18
  },
  {
    name: "Street Weekend Combo",
    description: "Relaxed layers for a streetwear weekend look.",
    products: [products.cargoPants._id, products.denimJacket._id],
    image: "https://example.com/outfits/street-weekend.jpg",
    occasion: "street",
    season: "winter",
    bodyShape: ["rectangle", "triangle", "round"],
    style: "streetwear",
    genderTarget: "unisex",
    colors: ["black", "blue", "olive"],
    tags: ["streetwear", "weekend"],
    weather: ["cool", "cold"],
    isActive: true,
    viewCount: 74,
    saveCount: 26
  }
];

const buildUsers = () => [
  {
    username: "admin",
    email: "admin@fashionstore.com",
    password: "123456",
    full_name: "Fashion Admin",
    gender: "female",
    favoriteStyles: ["minimal", "smart_casual"],
    favoriteColors: ["black", "white", "beige"],
    role: "admin",
    isActive: true
  },
  {
    username: "demo_user",
    email: "demo@fashionstore.com",
    password: "123456",
    full_name: "Demo User",
    gender: "female",
    bodyShape: "hourglass",
    favoriteStyles: ["minimal", "elegant"],
    favoriteColors: ["black", "beige", "white"],
    sizeProfile: {
      top: "M",
      bottom: "M",
      shoes: "38"
    },
    budgetRange: {
      min: 300000,
      max: 900000
    },
    role: "user",
    isActive: true
  }
];

const destroyData = async () => {
  try {
    await User.collection.dropIndex("favoriteStyles_1_favoriteColors_1");
  } catch (error) {
    if (!["IndexNotFound", 27].includes(error.codeName) && error.code !== 27) {
      console.log("Skip dropping old user compound index:", error.message);
    }
  }

  try {
    await Product.collection.dropIndex("season_1_occasion_1");
  } catch (error) {
    if (!["IndexNotFound", 27].includes(error.codeName) && error.code !== 27) {
      console.log("Skip dropping old product compound index:", error.message);
    }
  }

  try {
    await Outfit.collection.dropIndex("tags_1_colors_1");
  } catch (error) {
    if (!["IndexNotFound", 27].includes(error.codeName) && error.code !== 27) {
      console.log("Skip dropping old outfit compound index:", error.message);
    }
  }

  await Promise.all([
    Payment.deleteMany({}),
    OrderItem.deleteMany({}),
    Order.deleteMany({}),
    CartItem.deleteMany({}),
    Cart.deleteMany({}),
    Review.deleteMany({}),
    Wishlist.deleteMany({}),
    UserBehavior.deleteMany({}),
    SearchHistory.deleteMany({}),
    Outfit.deleteMany({}),
    ProductVariant.deleteMany({}),
    Product.deleteMany({}),
    Category.deleteMany({}),
    User.deleteMany({})
  ]);
};

const importData = async () => {
  await destroyData();

  const createdCategories = await Category.insertMany(categorySeed);
  const categoryMap = {
    tops: createdCategories.find((item) => item.name === "Tops"),
    bottoms: createdCategories.find((item) => item.name === "Bottoms"),
    outerwear: createdCategories.find((item) => item.name === "Outerwear"),
    shoes: createdCategories.find((item) => item.name === "Shoes")
  };

  const createdUsers = [];
  for (const userData of buildUsers()) {
    const user = await User.create(userData);
    createdUsers.push(user);
  }

  const userMap = {
    admin: createdUsers.find((item) => item.email === "admin@fashionstore.com"),
    demo: createdUsers.find((item) => item.email === "demo@fashionstore.com")
  };

  const createdProducts = await Product.insertMany(productSeed(categoryMap));
  const productMap = {
    whiteShirt: createdProducts.find((item) => item.name === "Minimal White Shirt"),
    cargoPants: createdProducts.find((item) => item.name === "Streetwear Cargo Pants"),
    beigeSkirt: createdProducts.find((item) => item.name === "Elegant Beige Skirt"),
    blazer: createdProducts.find((item) => item.name === "Black Oversized Blazer"),
    denimJacket: createdProducts.find((item) => item.name === "Vintage Denim Jacket"),
    sneakers: createdProducts.find((item) => item.name === "Sporty Running Sneakers")
  };

  await ProductVariant.insertMany(buildVariantSeed(productMap));
  await Outfit.insertMany(buildOutfitSeed(productMap));

  await Wishlist.insertMany([
    {
      userId: userMap.demo._id,
      productId: productMap.blazer._id,
      addedFrom: "product_page",
      note: "Like for office look"
    },
    {
      userId: userMap.demo._id,
      productId: productMap.beigeSkirt._id,
      addedFrom: "recommendation",
      note: ""
    }
  ]);

  await SearchHistory.insertMany([
    {
      userId: userMap.demo._id,
      keyword: "minimal blazer",
      filters: {
        categoryId: categoryMap.outerwear._id,
        style: "minimal",
        color: "black",
        season: "autumn",
        occasion: "work",
        gender: "female",
        minPrice: 300000,
        maxPrice: 900000
      },
      resultCount: 3,
      sessionId: "seed-session-1"
    },
    {
      userId: userMap.demo._id,
      keyword: "beige skirt",
      filters: {
        categoryId: categoryMap.bottoms._id,
        style: "elegant",
        color: "beige",
        season: "summer",
        occasion: "date",
        gender: "female",
        minPrice: 200000,
        maxPrice: 700000
      },
      resultCount: 2,
      sessionId: "seed-session-2"
    }
  ]);

  await UserBehavior.insertMany([
    {
      userId: userMap.demo._id,
      productId: productMap.whiteShirt._id,
      actionType: "view_product",
      source: "home",
      duration: 25,
      metadata: {
        categoryId: categoryMap.tops._id,
        style: "minimal",
        color: "white",
        position: 1,
        deviceType: "desktop"
      },
      sessionId: "seed-session-1"
    },
    {
      userId: userMap.demo._id,
      productId: productMap.blazer._id,
      actionType: "add_to_wishlist",
      source: "recommendation",
      duration: 14,
      metadata: {
        categoryId: categoryMap.outerwear._id,
        style: "smart_casual",
        color: "black",
        position: 2,
        deviceType: "desktop"
      },
      sessionId: "seed-session-1"
    },
    {
      userId: userMap.demo._id,
      productId: productMap.beigeSkirt._id,
      actionType: "favorite",
      source: "search",
      duration: 20,
      metadata: {
        categoryId: categoryMap.bottoms._id,
        style: "elegant",
        color: "beige",
        position: 1,
        deviceType: "mobile"
      },
      sessionId: "seed-session-2"
    }
  ]);

  await Review.insertMany([
    {
      userId: userMap.demo._id,
      productId: productMap.whiteShirt._id,
      rating: 5,
      comment: "Form dep va de pho do."
    }
  ]);

  const cart = await Cart.create({
    userId: userMap.demo._id
  });

  const sneakerVariant = await ProductVariant.findOne({ sku: "SN-42-WHITE" });
  const blazerVariant = await ProductVariant.findOne({ sku: "BL-M-BLACK" });

  await CartItem.insertMany([
    {
      cartId: cart._id,
      productId: productMap.sneakers._id,
      variantId: sneakerVariant._id,
      quantity: 1
    },
    {
      cartId: cart._id,
      productId: productMap.blazer._id,
      variantId: blazerVariant._id,
      quantity: 1
    }
  ]);

  const order = await Order.create({
    userId: userMap.demo._id,
    totalPrice: 1710000,
    subTotal: 1650000,
    shippingFee: 60000,
    discount: 0,
    status: "pending",
    shippingAddress: "123 Nguyen Trai, District 1, HCMC",
    receiverName: "Demo User",
    receiverPhone: "0900000000",
    note: "Call before delivery"
  });

  await OrderItem.insertMany([
    {
      orderId: order._id,
      productId: productMap.blazer._id,
      variantId: blazerVariant._id,
      quantity: 1,
      price: 790000
    },
    {
      orderId: order._id,
      productId: productMap.sneakers._id,
      variantId: sneakerVariant._id,
      quantity: 1,
      price: 920000
    }
  ]);

  await Payment.create({
    orderId: order._id,
    userId: userMap.demo._id,
    amount: 1710000,
    paymentMethod: "cod",
    paymentStatus: "pending",
    transactionId: "SEED-COD-001",
    paidAt: new Date()
  });

  console.log("Seed data imported successfully");
  console.log("Admin account: admin@fashionstore.com / 123456");
  console.log("Demo account: demo@fashionstore.com / 123456");
};

const run = async () => {
  try {
    await connectDatabase();

    if (process.argv.includes("--destroy")) {
      await destroyData();
      console.log("Seed data destroyed successfully");
    } else {
      await importData();
    }

    process.exit(0);
  } catch (error) {
    console.error("Seed script failed:", error.message);
    process.exit(1);
  }
};

run();
