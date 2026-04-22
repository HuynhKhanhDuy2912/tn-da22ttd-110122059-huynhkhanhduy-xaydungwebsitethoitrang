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
    <div className="px-4 md:px-0 py-8 max-w-4xl mx-auto">
      <PageHeader
        title="GIỎ HÀNG CỦA BẠN"
        description={`TỔNG CỘNG: ${cart?.summary?.subTotal?.toLocaleString("vi-VN") || 0} ₫`}
        aside={
          cart?.items?.length ? (
            <Link className="px-8 py-4 bg-black text-white font-bold hover:bg-gray-800 transition-colors inline-block whitespace-nowrap uppercase tracking-widest text-xs cursor-pointer" to="/checkout">
              THANH TOÁN NGAY
            </Link>
          ) : null
        }
      />
      {error ? <p className="text-red-500 bg-red-50 px-6 py-4 border border-red-100 font-bold mb-8 text-sm">{error}</p> : null}
      
      {!cart?.items?.length ? (
        <div className="text-center py-32 bg-gray-50 border border-gray-200">
          <h3 className="text-xl font-bold text-black mb-3 uppercase tracking-widest">GIỎ HÀNG TRỐNG</h3>
          <p className="text-gray-500 mb-8 max-w-md mx-auto text-sm">Chưa có sản phẩm nào trong giỏ hàng. Cùng khám phá hàng ngàn sản phẩm thời trang cao cấp nhé!</p>
          <Link to="/products" className="px-8 py-4 bg-black text-white font-bold hover:bg-gray-800 transition-colors inline-block uppercase tracking-widest text-xs">KHÁM PHÁ SẢN PHẨM</Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {cart.items.map((item) => (
            <div key={item._id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 bg-white border border-gray-200 gap-6 transition-all hover:border-black">
              <div className="flex gap-6 items-center flex-1">
                <div className="w-24 h-32 bg-gray-100 overflow-hidden shrink-0">
                  <img src={item.variantId?.image || "https://placehold.co/200x300/f8fafc/94a3b8?text=Image"} alt={item.productId?.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-black mb-1 line-clamp-1 uppercase tracking-wider">{item.productId?.name}</h3>
                  <p className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-widest">
                    MÀU SẮC: <span className="text-black">{item.variantId?.color}</span> | KÍCH THƯỚC: <span className="text-black">{item.variantId?.size}</span>
                  </p>
                  <p className="text-black font-bold text-lg">{item.pricing?.lineTotal?.toLocaleString("vi-VN")} ₫</p>
                </div>
              </div>
              <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-gray-200 pt-4 sm:pt-0">
                <div className="flex items-center border border-gray-300">
                  <button className="w-10 h-10 flex items-center justify-center text-black hover:bg-gray-100 transition-colors font-bold cursor-pointer" onClick={() => updateItem(item._id, Math.max(item.quantity - 1, 1))}>
                    -
                  </button>
                  <span className="w-10 text-center font-bold text-black text-sm">{item.quantity}</span>
                  <button className="w-10 h-10 flex items-center justify-center text-black hover:bg-gray-100 transition-colors font-bold cursor-pointer" onClick={() => updateItem(item._id, item.quantity + 1)}>
                    +
                  </button>
                </div>
                <button className="text-gray-400 hover:text-red-500 p-2 hover:bg-red-50 transition-colors cursor-pointer uppercase text-xs font-bold tracking-widest" onClick={() => removeItem(item._id)} aria-label="Xóa sản phẩm">
                  XÓA
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
