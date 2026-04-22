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

  const getStatusColor = (status) => {
    switch (status) {
      case "pending": return "bg-amber-100 text-amber-700 border-amber-200";
      case "confirmed": return "bg-blue-100 text-blue-700 border-blue-200";
      case "shipping": return "bg-purple-100 text-purple-700 border-purple-200";
      case "completed": return "bg-green-100 text-green-700 border-green-200";
      case "cancelled": return "bg-slate-100 text-slate-600 border-slate-200";
      default: return "bg-slate-100 text-slate-600 border-slate-200";
    }
  };

  const translateStatus = (status) => {
    const map = {
      pending: "Đang chờ",
      confirmed: "Đã xác nhận",
      shipping: "Đang giao",
      completed: "Hoàn thành",
      cancelled: "Đã hủy"
    };
    return map[status] || status;
  };

  return (
    <div className="px-4 md:px-8 py-8 md:py-12 max-w-5xl mx-auto">
      <PageHeader title="Đơn hàng của bạn" description="Lịch sử mua hàng và trạng thái đơn hàng hiện tại." />
      
      {error ? <p className="text-red-500 bg-red-50 px-6 py-4 rounded-xl border border-red-100 font-medium my-6">{error}</p> : null}
      
      {orders.length === 0 && !error ? (
        <div className="text-center py-20 bg-slate-50 rounded-[24px] border border-slate-100 mt-8">
          <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Chưa có đơn hàng nào</h3>
          <p className="text-slate-500">Bạn chưa thực hiện đơn hàng nào. Hãy khám phá sản phẩm của chúng tôi!</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6 mt-8">
          {orders.map((order) => (
            <div key={order._id} className="bg-white p-6 md:p-8 rounded-[24px] shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-slate-100 transition-shadow hover:shadow-[0_8px_32px_rgba(0,0,0,0.04)]">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-6 border-b border-slate-100">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Đơn hàng #{order._id.slice(-6).toUpperCase()}</h3>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wide border ${getStatusColor(order.status)}`}>
                    {translateStatus(order.status)}
                  </span>
                </div>
                <div className="flex flex-col md:items-end">
                  <span className="text-sm text-slate-500 font-medium mb-1">Tổng cộng</span>
                  <strong className="text-2xl font-bold text-brand-primary">{order.totalPrice?.toLocaleString("vi-VN")} ₫</strong>
                </div>
              </div>
              
              <div className="flex flex-col gap-3 mb-6">
                {order.items?.map((item) => (
                  <div key={item._id} className="flex justify-between items-center p-4 bg-slate-50/80 rounded-xl border border-slate-100/50">
                    <span className="font-medium text-slate-800 line-clamp-1 mr-4">{item.productId?.name}</span>
                    <span className="text-sm font-medium text-slate-600 shrink-0 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
                      {item.variantId?.color} / Size {item.variantId?.size} <span className="text-slate-400 mx-1">×</span> {item.quantity}
                    </span>
                  </div>
                ))}
              </div>
              
              {["pending", "confirmed"].includes(order.status) ? (
                <div className="flex justify-end pt-2">
                  <button 
                    className="px-6 py-2.5 bg-white text-red-500 font-bold rounded-xl border border-red-200 hover:bg-red-50 hover:border-red-300 transition-colors text-sm cursor-pointer shadow-sm" 
                    onClick={() => cancelOrder(order._id)}
                  >
                    Hủy đơn hàng
                  </button>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
