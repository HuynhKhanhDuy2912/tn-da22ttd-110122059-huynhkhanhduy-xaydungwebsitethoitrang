import { useEffect, useState } from "react";
import PageHeader from "../components/PageHeader.jsx";
import ProductCard from "../components/ProductCard.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { apiRequest } from "../lib/api.js";

export default function RecommendationsPage() {
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadRecommendations = async () => {
    try {
      const response = await apiRequest("/recommendations/me", { token });
      setItems(response.data);
    } catch (loadError) {
      setError(loadError.message);
    }
  };

  useEffect(() => {
    loadRecommendations();
  }, []);

  const handleWishlist = async (product) => {
    try {
      await apiRequest("/wishlists/me", {
        method: "POST",
        token,
        body: {
          productId: product._id,
          addedFrom: "recommendation"
        }
      });

      setMessage(`Đã thêm ${product.name} vào danh sách yêu thích`);
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const handleAddToCart = async (product, variant) => {
    try {
      await apiRequest("/carts/me/items", {
        method: "POST",
        token,
        body: {
          productId: product._id,
          variantId: variant._id,
          quantity: 1,
          source: "recommendation"
        }
      });

      setMessage(`Đã thêm ${product.name} vào giỏ hàng`);
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  return (
    <div className="px-4 md:px-8 py-8 md:py-12 max-w-7xl mx-auto">
      <PageHeader
        title="Gợi ý cho bạn"
        description="Các sản phẩm được chọn lọc dựa trên sở thích, lịch sử tìm kiếm và hoạt động của bạn."
        aside={
          <button 
            className="px-5 py-2.5 bg-white text-slate-700 font-bold rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-2 cursor-pointer text-sm"
            onClick={loadRecommendations}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
            Làm mới
          </button>
        }
      />
      
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-[24px] p-1 mt-8 mb-10 shadow-lg">
        <div className="bg-white/95 backdrop-blur-sm rounded-[22px] p-6 md:p-8 flex items-start gap-4">
          <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center shrink-0">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
          </div>
          <div>
            <strong className="block text-lg font-bold text-slate-900 mb-2">Cách hệ thống hoạt động</strong>
            <p className="text-slate-600 leading-relaxed max-w-3xl">
              Hệ thống kết hợp các phong cách, màu sắc yêu thích, sản phẩm trong danh sách mong muốn và hành vi tương tác của bạn để đưa ra những gợi ý phù hợp nhất hiện đang có sẵn trong kho.
            </p>
          </div>
        </div>
      </div>

      {message ? <p className="text-green-600 bg-green-50 px-6 py-4 rounded-xl border border-green-100 font-medium mb-8">{message}</p> : null}
      {error ? <p className="text-red-500 bg-red-50 px-6 py-4 rounded-xl border border-red-100 font-medium mb-8">{error}</p> : null}
      
      {items.length === 0 && !error ? (
        <div className="text-center py-20 bg-slate-50 rounded-[24px] border border-slate-100 border-dashed">
          <h3 className="text-xl font-bold text-slate-900 mb-2">Chưa có đủ dữ liệu</h3>
          <p className="text-slate-500">Hãy tương tác thêm với các sản phẩm để chúng tôi có thể đưa ra gợi ý tốt hơn cho bạn.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {items.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onAddToWishlist={handleWishlist}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      )}
    </div>
  );
}
