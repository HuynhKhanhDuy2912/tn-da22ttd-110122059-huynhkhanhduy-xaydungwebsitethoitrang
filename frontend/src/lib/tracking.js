import { apiRequest } from "./api.js";

/**
 * Theo dõi hành vi người dùng (User Behavior Tracking)
 * @param {string} token - User token
 * @param {object} params - Tracking parameters
 * @param {string} params.actionType - 'view_product', 'search', 'favorite', 'remove_from_wishlist', etc.
 * @param {string} [params.productId] - ID sản phẩm liên quan
 * @param {string} [params.source] - Nguồn phát sinh ('product_page', 'search', 'category', 'home', etc.)
 * @param {string} [params.searchKeyword] - Từ khóa tìm kiếm
 * @param {object} [params.metadata] - Metadata bổ sung (categoryId, style, etc.)
 */
export const trackBehavior = async (token, params) => {
  if (!token) return;

  try {
    const { actionType, productId, source, searchKeyword, metadata } = params;

    // Không đợi response để tránh block UI
    apiRequest("/user-behaviors/track", {
      method: "POST",
      token,
      body: {
        actionType,
        ...(productId && { productId }),
        ...(source && { source }),
        ...(searchKeyword && { searchKeyword }),
        ...(metadata && { metadata })
      }
    }).catch(err => {
      console.warn("Lỗi khi ghi nhận hành vi người dùng:", err.message);
    });
  } catch (error) {
    console.warn("Lỗi khi gọi API tracking:", error.message);
  }
};
