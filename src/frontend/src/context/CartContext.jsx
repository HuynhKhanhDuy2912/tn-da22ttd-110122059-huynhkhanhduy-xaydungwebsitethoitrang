import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { apiRequest } from "../lib/api.js";
import { useAuth } from "./AuthContext.jsx";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { token, isAuthenticated } = useAuth();
  const [cartCount, setCartCount] = useState(0);
  const [isCartCountLoading, setIsCartCountLoading] = useState(false);

  const refreshCartCount = useCallback(async () => {
    if (!isAuthenticated || !token) {
      setCartCount(0);
      return;
    }

    setIsCartCountLoading(true);
    try {
      const response = await apiRequest("/carts/me", { token });
      setCartCount(Number(response.data?.items?.length || 0));
    } catch (_error) {
      setCartCount(0);
    } finally {
      setIsCartCountLoading(false);
    }
  }, [isAuthenticated, token]);

  useEffect(() => {
    refreshCartCount();
  }, [refreshCartCount]);

  useEffect(() => {
    const handleCartChanged = () => {
      refreshCartCount();
    };

    window.addEventListener("cart:changed", handleCartChanged);
    window.addEventListener("focus", handleCartChanged);

    return () => {
      window.removeEventListener("cart:changed", handleCartChanged);
      window.removeEventListener("focus", handleCartChanged);
    };
  }, [refreshCartCount]);

  const value = useMemo(
    () => ({ cartCount, isCartCountLoading, refreshCartCount, setCartCount }),
    [cartCount, isCartCountLoading, refreshCartCount]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
