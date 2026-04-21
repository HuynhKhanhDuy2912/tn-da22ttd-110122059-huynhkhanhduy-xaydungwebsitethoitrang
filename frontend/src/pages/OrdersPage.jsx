import { useEffect, useState } from "react";
import PageHeader from "../components/PageHeader.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { apiRequest } from "../lib/api.js";

export default function OrdersPage() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  const loadOrders = async () => {
    try {
      const response = await apiRequest("/orders/me", { token });
      setOrders(response.data);
    } catch (loadError) {
      setError(loadError.message);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const cancelOrder = async (orderId) => {
    try {
      await apiRequest(`/orders/me/${orderId}/cancel`, {
        method: "PATCH",
        token
      });
      loadOrders();
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  return (
    <section>
      <PageHeader title="Orders" description="Your recent checkout history." />
      {error ? <p className="error-text">{error}</p> : null}
      <div className="stack">
        {orders.map((order) => (
          <div key={order._id} className="card">
            <div className="order-head">
              <div>
                <h3>Order #{order._id.slice(-6)}</h3>
                <p className="muted">{order.status}</p>
              </div>
              <strong>{order.totalPrice?.toLocaleString("vi-VN")} VND</strong>
            </div>
            <div className="stack compact">
              {order.items?.map((item) => (
                <div key={item._id} className="row-card line-item">
                  <span>{item.productId?.name}</span>
                  <span>
                    {item.variantId?.color} / {item.variantId?.size} x {item.quantity}
                  </span>
                </div>
              ))}
            </div>
            {["pending", "confirmed"].includes(order.status) ? (
              <button className="secondary-button" onClick={() => cancelOrder(order._id)}>
                Cancel order
              </button>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}
