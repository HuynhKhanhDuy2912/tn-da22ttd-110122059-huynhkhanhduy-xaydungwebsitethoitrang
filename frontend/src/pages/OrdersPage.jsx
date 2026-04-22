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
      case "pending": return "text-yellow-600 border-yellow-600";
      case "confirmed": return "text-blue-600 border-blue-600";
      case "shipping": return "text-purple-600 border-purple-600";
      case "completed": return "text-green-600 border-green-600";
      case "cancelled": return "text-gray-500 border-gray-500";
      default: return "text-gray-500 border-gray-500";
    }
  };

  const translateStatus = (status) => {
    const map = {
      pending: "ĐANG CHỜ",
      confirmed: "ĐÃ XÁC NHẬN",
      shipping: "ĐANG GIAO",
      completed: "HOÀN THÀNH",
      cancelled: "ĐÃ HỦY"
    };
    return map[status] || status.toUpperCase();
  };

  return (
    <div className="px-4 md:px-0 py-8 max-w-5xl mx-auto">
      <PageHeader title="ĐƠN HÀNG CỦA BẠN" description="LỊCH SỬ MUA HÀNG VÀ TRẠNG THÁI ĐƠN HÀNG HIỆN TẠI." />
      
      {error ? <p className="text-red-500 bg-red-50 px-6 py-4 border border-red-100 font-bold my-6 text-sm">{error}</p> : null}
      
      {orders.length === 0 && !error ? (
        <div className="text-center py-32 bg-gray-50 border border-gray-200 mt-8">
          <h3 className="text-xl font-bold text-black mb-3 uppercase tracking-widest">CHƯA CÓ ĐƠN HÀNG NÀO</h3>
          <p className="text-gray-500 text-sm">Bạn chưa thực hiện đơn hàng nào. Hãy khám phá sản phẩm của chúng tôi!</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6 mt-8">
          {orders.map((order) => (
            <div key={order._id} className="bg-white p-6 md:p-8 border border-gray-200 transition-colors hover:border-black">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-6 border-b border-gray-200">
                <div>
                  <h3 className="text-xl font-extrabold text-black mb-2 uppercase tracking-widest">ĐƠN HÀNG #{order._id.slice(-6).toUpperCase()}</h3>
                  <span className={`inline-block px-3 py-1 text-xs font-bold tracking-widest border ${getStatusColor(order.status)}`}>
                    {translateStatus(order.status)}
                  </span>
                </div>
                <div className="flex flex-col md:items-end">
                  <span className="text-xs text-gray-500 font-bold mb-1 uppercase tracking-widest">TỔNG CỘNG</span>
                  <strong className="text-2xl font-bold text-black">{order.totalPrice?.toLocaleString("vi-VN")} ₫</strong>
                </div>
              </div>
              
              <div className="flex flex-col gap-3 mb-6">
                {order.items?.map((item) => (
                  <div key={item._id} className="flex justify-between items-center p-4 bg-gray-50 border border-gray-200">
                    <span className="font-bold text-black line-clamp-1 mr-4 uppercase tracking-wider text-sm">{item.productId?.name}</span>
                    <span className="text-xs font-bold text-gray-600 shrink-0 bg-white px-3 py-1.5 border border-gray-200 uppercase tracking-widest">
                      {item.variantId?.color} / SIZE {item.variantId?.size} <span className="text-gray-400 mx-1">×</span> {item.quantity}
                    </span>
                  </div>
                ))}
              </div>
              
              {["pending", "confirmed"].includes(order.status) ? (
                <div className="flex justify-end pt-2">
                  <button 
                    className="px-6 py-3 bg-white text-black font-bold border border-black hover:bg-black hover:text-white transition-colors text-xs tracking-widest uppercase cursor-pointer" 
                    onClick={() => cancelOrder(order._id)}
                  >
                    HỦY ĐƠN HÀNG
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
