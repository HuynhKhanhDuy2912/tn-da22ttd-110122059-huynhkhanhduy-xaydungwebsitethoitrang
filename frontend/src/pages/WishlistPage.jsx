import { useEffect, useState } from "react";
import PageHeader from "../components/PageHeader.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { apiRequest } from "../lib/api.js";

export default function WishlistPage() {
  const { token } = useAuth();
  const [wishlist, setWishlist] = useState({ totalItems: 0, items: [] });
  const [error, setError] = useState("");

  const loadWishlist = async () => {
    try {
      const response = await apiRequest("/wishlists/me", { token });
      setWishlist(response.data);
    } catch (loadError) {
      setError(loadError.message);
    }
  };

  useEffect(() => {
    loadWishlist();
  }, []);

  const removeItem = async (productId) => {
    try {
      await apiRequest(`/wishlists/me/product/${productId}`, {
        method: "DELETE",
        token
      });
      loadWishlist();
    } catch (removeError) {
      setError(removeError.message);
    }
  };

  return (
    <div className="px-4 md:px-0 py-8 max-w-5xl mx-auto">
      <PageHeader
        title="DANH SÁCH YÊU THÍCH"
        description={`BẠN ĐÃ LƯU ${wishlist.totalItems} SẢN PHẨM.`}
      />
      {error ? <p className="text-red-500 bg-red-50 px-6 py-4 border border-red-100 font-bold my-6 text-sm">{error}</p> : null}
      
      {wishlist.items.length === 0 && !error ? (
        <div className="text-center py-32 bg-gray-50 border border-gray-200 mt-8">
          <h3 className="text-xl font-bold text-black mb-3 uppercase tracking-widest">DANH SÁCH TRỐNG</h3>
          <p className="text-gray-500 text-sm">Bạn chưa lưu sản phẩm nào. Hãy tìm những sản phẩm bạn thích và thêm vào đây.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          {wishlist.items.map((item) => (
            <div key={item._id} className="flex justify-between items-center p-6 bg-white border border-gray-200 gap-4 transition-colors hover:border-black">
              <div>
                <h3 className="text-lg font-bold text-black mb-1 line-clamp-1 uppercase tracking-wider">{item.productId?.name}</h3>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{item.productId?.style || "THỜI TRANG"}</p>
              </div>
              <button 
                className="text-gray-400 hover:text-red-500 p-2 hover:bg-red-50 transition-colors cursor-pointer shrink-0 uppercase text-xs font-bold tracking-widest" 
                onClick={() => removeItem(item.productId?._id)}
                aria-label="Xóa khỏi danh sách"
                title="Xóa"
              >
                XÓA
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
