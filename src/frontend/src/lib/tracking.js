import { apiRequest } from "./api.js";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

/**
 * Track a user behavior event.
 * @param {string} token - User token.
 * @param {object} params - Tracking parameters.
 * @param {string} params.actionType - view_product, search, favorite, etc.
 * @param {string} [params.productId] - Related product ID.
 * @param {string} [params.source] - Event source.
 * @param {number} [params.duration] - View duration in seconds.
 * @param {string} [params.searchKeyword] - Search keyword.
 * @param {object} [params.metadata] - Extra metadata.
 * @param {string} [params.trackingSessionId] - Stable ID for one view session.
 */
export const trackBehavior = async (token, params) => {
  if (!token) return null;

  try {
    const {
      actionType,
      productId,
      source,
      duration,
      searchKeyword,
      metadata,
      trackingSessionId
    } = params;

    return apiRequest("/user-behaviors/track", {
      method: "POST",
      token,
      body: {
        actionType,
        ...(productId && { productId }),
        ...(source && { source }),
        ...(duration != null && { duration }),
        ...(searchKeyword && { searchKeyword }),
        ...(metadata && { metadata }),
        ...(trackingSessionId && { trackingSessionId })
      }
    }).catch((error) => {
      console.warn("Failed to track user behavior:", error.message);
      return null;
    });
  } catch (error) {
    console.warn("Failed to call tracking API:", error.message);
    return null;
  }
};

/**
 * Track through navigator.sendBeacon so duration can still be sent when the
 * page is hidden or closed.
 *
 * @param {string} token - User token.
 * @param {object} params - Same tracking parameters as trackBehavior.
 */
export const trackBehaviorBeacon = (token, params) => {
  if (!token || typeof navigator.sendBeacon !== "function") return false;

  try {
    const {
      actionType,
      productId,
      source,
      duration,
      searchKeyword,
      metadata,
      trackingSessionId
    } = params;

    const body = {
      actionType,
      ...(productId && { productId }),
      ...(source && { source }),
      ...(duration != null && { duration }),
      ...(searchKeyword && { searchKeyword }),
      ...(metadata && { metadata }),
      ...(trackingSessionId && { trackingSessionId })
    };

    const url = `${API_BASE_URL}/user-behaviors/track/beacon`;
    const payload = { ...body, _token: token };
    const blob = new Blob([JSON.stringify(payload)], { type: "application/json" });

    return navigator.sendBeacon(url, blob);
  } catch (error) {
    return false;
  }
};
