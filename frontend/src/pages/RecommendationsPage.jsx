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
    <div className="px-4 md:px-0 py-8 max-w-7xl mx-auto">
      <PageHeader
        title="GỢI Ý CHO BẠN"
        description="CÁC SẢN PHẨM ĐƯỢC CHỌN LỌC DỰA TRÊN SỞ THÍCH, LỊCH SỬ TÌM KIẾM VÀ HOẠT ĐỘNG CỦA BẠN."
        aside={
          <button 
            className="px-6 py-3 bg-white text-black font-bold border border-black hover:bg-black hover:text-white transition-colors flex items-center gap-2 cursor-pointer text-xs uppercase tracking-widest"
            onClick={loadRecommendations}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
            LÀM MỚI
          </button>
        }
      />
      
      <div className="bg-gray-100 p-8 mt-8 mb-10 border border-gray-200">
        <div className="flex items-start gap-4">
          <div>
            <strong className="block text-sm font-bold text-black mb-2 uppercase tracking-widest">CÁCH HỆ THỐNG HOẠT ĐỘNG</strong>
            <p className="text-gray-600 leading-relaxed max-w-3xl text-sm">
              Hệ thống kết hợp các phong cách, màu sắc yêu thích, sản phẩm trong danh sách mong muốn và hành vi tương tác của bạn để đưa ra những gợi ý phù hợp nhất hiện đang có sẵn trong kho.
            </p>
          </div>
        </div>
      </div>

      {message ? <p className="text-black bg-gray-100 px-6 py-4 border-l-4 border-black font-medium mb-8 text-sm">{message}</p> : null}
      {error ? <p className="text-red-500 bg-red-50 px-6 py-4 border-l-4 border-red-600 font-bold mb-8 text-sm">{error}</p> : null}
      
      {items.length === 0 && !error ? (
        <div className="text-center py-32 bg-gray-50 border border-gray-200">
          <h3 className="text-xl font-bold text-black mb-3 uppercase tracking-widest">CHƯA CÓ ĐỦ DỮ LIỆU</h3>
          <p className="text-gray-500 text-sm">Hãy tương tác thêm với các sản phẩm để chúng tôi có thể đưa ra gợi ý tốt hơn cho bạn.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 gap-y-10">
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
