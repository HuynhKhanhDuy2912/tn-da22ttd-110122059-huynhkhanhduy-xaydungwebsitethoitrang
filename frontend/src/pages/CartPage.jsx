import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { apiRequest } from "../lib/api.js";

export default function CartPage() {
  const { token } = useAuth();
  const [cart, setCart] = useState(null);
  const [error, setError] = useState("");

  const loadCart = async () => {
    try {
      const response = await apiRequest("/carts/me", { token });
      setCart(response.data);
    } catch (loadError) {
      setError(loadError.message);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const updateItem = async (cartItemId, quantity) => {
    try {
      await apiRequest(`/carts/me/items/${cartItemId}`, {
        method: "PUT",
        token,
        body: { quantity }
      });
      loadCart();
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const removeItem = async (cartItemId) => {
    try {
      await apiRequest(`/carts/me/items/${cartItemId}`, {
        method: "DELETE",
        token
      });
      loadCart();
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  return (
    <section>
      <PageHeader
        title="Cart"
        description={`Subtotal: ${cart?.summary?.subTotal?.toLocaleString("vi-VN") || 0} VND`}
        aside={
          cart?.items?.length ? (
            <Link className="text-link" to="/checkout">
              Proceed to checkout
            </Link>
          ) : null
        }
      />
      {error ? <p className="error-text">{error}</p> : null}
      <div className="stack">
        {cart?.items?.map((item) => (
          <div key={item._id} className="card row-card">
            <div>
              <h3>{item.productId?.name}</h3>
              <p className="muted">
                {item.variantId?.color} / {item.variantId?.size}
              </p>
              <p>{item.pricing?.lineTotal?.toLocaleString("vi-VN")} VND</p>
            </div>
            <div className="inline-actions">
              <button className="secondary-button" onClick={() => updateItem(item._id, Math.max(item.quantity - 1, 1))}>
                -
              </button>
              <span>{item.quantity}</span>
              <button onClick={() => updateItem(item._id, item.quantity + 1)}>+</button>
              <button className="secondary-button" onClick={() => removeItem(item._id)}>
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
