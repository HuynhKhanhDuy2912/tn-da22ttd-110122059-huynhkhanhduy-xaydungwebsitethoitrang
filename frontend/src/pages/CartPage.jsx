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
    <div className="px-4 md:px-8 py-8 md:py-12 max-w-4xl mx-auto">
      <PageHeader
        title="Giỏ hàng của bạn"
        description={`Tổng cộng: ${cart?.summary?.subTotal?.toLocaleString("vi-VN") || 0} ₫`}
        aside={
          cart?.items?.length ? (
            <Link className="px-8 py-3.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-black transition-all shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] hover:-translate-y-0.5 inline-block whitespace-nowrap" to="/checkout">
              Thanh toán ngay
            </Link>
          ) : null
        }
      />
      {error ? <p className="text-red-500 bg-red-50 px-6 py-4 rounded-xl border border-red-100 font-medium mb-8">{error}</p> : null}
      
      {!cart?.items?.length ? (
        <div className="text-center py-24 bg-white rounded-[32px] border border-slate-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
          <div className="w-24 h-24 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-3">Giỏ hàng trống</h3>
          <p className="text-slate-500 mb-8 max-w-md mx-auto">Chưa có sản phẩm nào trong giỏ hàng. Cùng khám phá hàng ngàn sản phẩm thời trang cao cấp nhé!</p>
          <Link to="/products" className="px-8 py-4 bg-brand-primary text-white rounded-xl font-bold hover:opacity-90 transition-all shadow-[0_4px_14px_0_rgba(59,130,246,0.3)] inline-block">Khám phá sản phẩm</Link>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {cart.items.map((item) => (
            <div key={item._id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 bg-white rounded-[24px] shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-slate-100 gap-6 transition-all hover:border-slate-200 hover:shadow-[0_8px_32px_rgba(0,0,0,0.04)]">
              <div className="flex gap-6 items-center flex-1">
                <div className="w-24 h-24 rounded-2xl bg-slate-50 overflow-hidden shrink-0 border border-slate-100">
                  <img src={item.variantId?.image || "https://placehold.co/200x200/f8fafc/94a3b8?text=Image"} alt={item.productId?.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1 line-clamp-1">{item.productId?.name}</h3>
                  <p className="text-sm font-medium text-slate-500 mb-3">
                    Phân loại: <span className="text-slate-700">{item.variantId?.color} / Size {item.variantId?.size}</span>
                  </p>
                  <p className="text-brand-primary font-bold text-lg">{item.pricing?.lineTotal?.toLocaleString("vi-VN")} ₫</p>
                </div>
              </div>
              <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-slate-100 pt-4 sm:pt-0">
                <div className="flex items-center bg-slate-50 rounded-xl border border-slate-200">
                  <button className="w-10 h-10 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-l-xl transition-colors font-medium cursor-pointer" onClick={() => updateItem(item._id, Math.max(item.quantity - 1, 1))}>
                    -
                  </button>
                  <span className="w-10 text-center font-bold text-slate-900 text-sm">{item.quantity}</span>
                  <button className="w-10 h-10 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-r-xl transition-colors font-medium cursor-pointer" onClick={() => updateItem(item._id, item.quantity + 1)}>
                    +
                  </button>
                </div>
                <button className="text-slate-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition-colors cursor-pointer" onClick={() => removeItem(item._id)} aria-label="Xóa sản phẩm">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
