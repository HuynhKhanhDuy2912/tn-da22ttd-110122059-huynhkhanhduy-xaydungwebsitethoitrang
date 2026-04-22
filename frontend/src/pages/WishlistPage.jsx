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
    <div className="px-4 md:px-8 py-8 md:py-12 max-w-5xl mx-auto">
      <PageHeader
        title="Danh sách yêu thích"
        description={`Bạn đã lưu ${wishlist.totalItems} sản phẩm.`}
      />
      {error ? <p className="text-red-500 bg-red-50 px-6 py-4 rounded-xl border border-red-100 font-medium my-6">{error}</p> : null}
      
      {wishlist.items.length === 0 && !error ? (
        <div className="text-center py-20 bg-slate-50 rounded-[24px] border border-slate-100 border-dashed mt-8">
          <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Danh sách trống</h3>
          <p className="text-slate-500">Bạn chưa lưu sản phẩm nào. Hãy tìm những sản phẩm bạn thích và thêm vào đây.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {wishlist.items.map((item) => (
            <div key={item._id} className="flex justify-between items-center p-6 bg-white rounded-[24px] shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-slate-100 gap-4 transition-all hover:border-slate-200 hover:shadow-[0_8px_32px_rgba(0,0,0,0.04)]">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-1 line-clamp-1">{item.productId?.name}</h3>
                <p className="text-sm font-medium text-slate-500 capitalize">{item.productId?.style || "Thời trang"}</p>
              </div>
              <button 
                className="text-slate-400 hover:text-red-500 p-3 rounded-full hover:bg-red-50 transition-colors cursor-pointer shrink-0" 
                onClick={() => removeItem(item.productId?._id)}
                aria-label="Xóa khỏi danh sách"
                title="Xóa"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
