import { useEffect, useState } from "react";
import AdminPageHeader from "../../components/AdminPageHeader.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { apiRequest } from "../../lib/api.js";

const orderStatuses = ["pending", "confirmed", "shipping", "completed", "cancelled"];

export default function AdminOrdersPage() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadOrders = async () => {
    try {
      const response = await apiRequest("/orders/admin/all", { token });
      setOrders(response.data);
    } catch (loadError) {
      setError(loadError.message);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [token]);

  const updateStatus = async (orderId, status) => {
    try {
      await apiRequest(`/orders/admin/${orderId}/status`, {
        method: "PATCH",
        token,
        body: { status }
      });
      setMessage("Order status updated");
      loadOrders();
    } catch (updateError) {
      setError(updateError.message);
    }
  };

  return (
    <section className="grid gap-6">
      <AdminPageHeader title="Orders" description="Review incoming orders and update their lifecycle." />
      {message ? <p className="text-green-600 font-medium m-0">{message}</p> : null}
      {error ? <p className="text-red-500 font-medium m-0">{error}</p> : null}
      <section className="bg-white rounded-[24px] p-7 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-black/5">
        <div className="grid gap-3">
          {orders.map((order) => (
            <div key={order._id} className="flex justify-between gap-4 p-5 items-center bg-white rounded-xl border border-slate-200 shadow-sm hover:border-slate-300 transition-all">
              <div>
                <strong className="block text-slate-800 mb-1 text-lg">{order.userId?.full_name || order.userId?.username}</strong>
                <p className="m-0 text-sm text-slate-600 mb-1">
                  <span className="font-medium text-slate-700">Người nhận:</span> {order.receiverName} · {order.receiverPhone}
                </p>
                <p className="m-0 text-sm text-slate-600">
                  <span className="font-medium text-slate-700">Địa chỉ:</span> {order.shippingAddress}
                </p>
              </div>
              <div className="flex flex-col items-end gap-3">
                <span className="font-bold text-blue-600 text-lg">{order.totalPrice?.toLocaleString("vi-VN")} đ</span>
                <select
                  className="border border-slate-300 rounded-lg px-3 py-1.5 bg-slate-50 text-slate-900 transition-all text-sm focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none font-medium capitalize"
                  value={order.status}
                  onChange={(event) => updateStatus(order._id, event.target.value)}
                >
                  {orderStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      </section>
    </section>
  );
}
