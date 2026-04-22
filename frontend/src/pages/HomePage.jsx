import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import ProductCard from "../components/ProductCard.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { apiRequest } from "../lib/api.js";
import { attachVariantsToProducts } from "../lib/catalog.js";

const editCards = [
  {
    title: "Thời trang Nam",
    copy: "Phom dáng thoải mái, tông màu nhã nhặn và những món đồ cơ bản linh hoạt.",
    tone: "bg-[#e7ddd1] text-slate-900"
  },
  {
    title: "Thời trang Nữ",
    copy: "Đường nét mềm mại, layer thông minh và trang phục dạo phố thanh lịch.",
    tone: "bg-[#ded4c9] text-slate-900"
  },
  {
    title: "Bộ sưu tập",
    copy: "Khám phá các gợi ý phối đồ và lựa chọn cá nhân hóa từ dữ liệu của bạn.",
    tone: "bg-slate-900 text-white"
  }
];

export default function HomePage() {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [variants, setVariants] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const [productResponse, variantResponse] = await Promise.all([
          apiRequest("/products"),
          apiRequest("/product-variants")
        ]);

        setProducts(productResponse.data);
        setVariants(variantResponse.data);
      } catch (loadError) {
        setError(loadError.message);
      }
    };

    loadData();
  }, []);

  const productsWithVariants = useMemo(
    () => attachVariantsToProducts(products, variants),
    [products, variants]
  );

  const newArrivals = useMemo(
    () =>
      [...productsWithVariants]
        .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt))
        .slice(0, 4),
    [productsWithVariants]
  );

  const bestSellers = useMemo(
    () =>
      [...productsWithVariants]
        .sort((left, right) => (right.totalReviews || 0) - (left.totalReviews || 0))
        .slice(0, 4),
    [productsWithVariants]
  );

  const menswear = useMemo(
    () => productsWithVariants.filter((item) => item.gender === "male" || item.gender === "unisex").slice(0, 4),
    [productsWithVariants]
  );

  const womenswear = useMemo(
    () => productsWithVariants.filter((item) => item.gender === "female" || item.gender === "unisex").slice(0, 4),
    [productsWithVariants]
  );

  const handleWishlist = async (product, addedFrom = "home") => {
    try {
      await apiRequest("/wishlists/me", {
        method: "POST",
        token,
        body: {
          productId: product._id,
          addedFrom
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
          source: "home"
        }
      });

      setMessage(`Đã thêm ${product.name} vào giỏ hàng`);
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  return (
    <div className="flex flex-col gap-16 pb-16">
      <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden bg-slate-900 text-white rounded-[2rem] mx-4 mt-4 shadow-2xl">
        <img 
          src="https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2071&auto=format&fit=crop" 
          alt="Hero background" 
          className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay scale-105 hover:scale-100 transition-transform duration-[10s]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
        <div className="relative z-10 text-center max-w-3xl px-6 flex flex-col items-center">
          <span className="uppercase tracking-[0.3em] text-xs font-bold text-brand-primary mb-6 block bg-white/10 px-4 py-2 rounded-full backdrop-blur-md border border-white/10">Xu hướng Xuân Hè 2026</span>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">
            Nâng tầm phong cách cá nhân của bạn
          </h2>
          <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl leading-relaxed font-light">
            Khám phá trải nghiệm mua sắm thời trang hiện đại với bộ sưu tập độc quyền, hệ thống gợi ý thông minh và quy trình thanh toán mượt mà.
          </p>
          <div className="flex gap-4 flex-wrap justify-center">
            <Link className="px-8 py-4 bg-white text-slate-900 rounded-full font-bold hover:bg-brand-primary hover:text-white transition-all hover:-translate-y-1 shadow-lg hover:shadow-brand-primary/30" to="/products">
              Khám phá ngay
            </Link>
            <Link className="px-8 py-4 bg-white/10 text-white rounded-full font-bold hover:bg-white/20 transition-all backdrop-blur-md border border-white/20" to="/recommendations">
              Gợi ý cho bạn
            </Link>
          </div>
        </div>
      </section>

      <section className="px-4 md:px-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        {editCards.map((item) => (
          <article key={item.title} className={`relative h-[400px] rounded-[2rem] p-8 flex flex-col justify-end overflow-hidden group transition-transform hover:-translate-y-2 shadow-sm hover:shadow-xl ${item.tone}`}>
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10">
              <span className="uppercase tracking-[0.2em] text-xs font-bold opacity-70 mb-2 block">Bộ sưu tập</span>
              <h3 className="text-3xl font-bold mb-3">{item.title}</h3>
              <p className="opacity-80 mb-6 leading-relaxed max-w-[90%]">{item.copy}</p>
              <Link to="/products" className="inline-block border-b-2 border-current pb-1 font-bold tracking-wide hover:opacity-70 transition-opacity">Khám phá</Link>
            </div>
          </article>
        ))}
      </section>

      {message ? <p className="mx-4 md:mx-8 text-green-600 bg-green-50 px-6 py-4 rounded-xl border border-green-100 font-medium">{message}</p> : null}
      {error ? <p className="mx-4 md:mx-8 text-red-500 bg-red-50 px-6 py-4 rounded-xl border border-red-100 font-medium">{error}</p> : null}

      <section className="px-4 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
          <div>
            <span className="uppercase tracking-[0.2em] text-xs font-bold text-brand-primary mb-2 block">Hàng mới về</span>
            <h2 className="text-4xl font-extrabold tracking-tight text-slate-900">Sản phẩm mới nhất</h2>
          </div>
          <Link className="font-bold text-brand-primary hover:text-slate-900 transition-colors border-b-2 border-transparent hover:border-slate-900 pb-1" to="/products">
            Xem tất cả →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {newArrivals.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onAddToWishlist={token ? (item) => handleWishlist(item, "home") : null}
              onAddToCart={token ? handleAddToCart : null}
            />
          ))}
        </div>
      </section>

      <section className="px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <article className="p-12 rounded-[2rem] flex flex-col items-start justify-center min-h-[400px] bg-slate-900 text-white relative overflow-hidden group">
          <img src="https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=1974&auto=format&fit=crop" alt="Menswear" className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:scale-105 transition-transform duration-700" />
          <div className="relative z-10 max-w-md">
            <span className="uppercase tracking-[0.2em] text-xs font-bold text-white/70 mb-3 block">Dành cho nam</span>
            <h3 className="text-4xl font-bold mb-4 leading-tight">Phong cách lịch lãm & Phóng khoáng</h3>
            <p className="text-white/80 mb-8 text-lg">Trang phục thiết yếu hàng ngày mang đến sự cân bằng hoàn hảo giữa sự thoải mái và sang trọng.</p>
            <Link to="/products?gender=male" className="px-8 py-4 bg-white text-slate-900 rounded-full font-bold hover:bg-brand-primary hover:text-white transition-all shadow-lg">Khám phá thời trang Nam</Link>
          </div>
        </article>
        <article className="p-12 rounded-[2rem] flex flex-col items-start justify-center min-h-[400px] bg-[#f0e8df] text-slate-900 relative overflow-hidden group">
          <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop" alt="Womenswear" className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:scale-105 transition-transform duration-700 mix-blend-multiply" />
          <div className="relative z-10 max-w-md">
            <span className="uppercase tracking-[0.2em] text-xs font-bold text-slate-500 mb-3 block">Dành cho nữ</span>
            <h3 className="text-4xl font-bold mb-4 leading-tight">Đường nét mềm mại, hiện đại</h3>
            <p className="text-slate-600 mb-8 text-lg">Cập nhật tủ đồ của bạn từ trang phục công sở thanh lịch đến dạo phố sành điệu.</p>
            <Link to="/products?gender=female" className="px-8 py-4 bg-slate-900 text-white rounded-full font-bold hover:bg-brand-primary transition-all shadow-lg">Khám phá thời trang Nữ</Link>
          </div>
        </article>
      </section>

      <section className="px-4 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
          <div>
            <span className="uppercase tracking-[0.2em] text-xs font-bold text-brand-primary mb-2 block">Thịnh hành</span>
            <h2 className="text-4xl font-extrabold tracking-tight text-slate-900">Bán chạy nhất</h2>
          </div>
          <Link className="font-bold text-brand-primary hover:text-slate-900 transition-colors border-b-2 border-transparent hover:border-slate-900 pb-1" to="/recommendations">
            Gợi ý dành riêng cho bạn →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {bestSellers.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onAddToWishlist={token ? (item) => handleWishlist(item, "home") : null}
              onAddToCart={token ? handleAddToCart : null}
            />
          ))}
        </div>
      </section>

      <section className="mx-4 md:mx-8 bg-slate-50 rounded-[2rem] p-12 grid grid-cols-1 md:grid-cols-3 gap-12 text-center divide-y md:divide-y-0 md:divide-x divide-slate-200">
        <div className="flex flex-col items-center pt-8 md:pt-0">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
          </div>
          <h3 className="text-xl font-bold mb-3 text-slate-900">Theo dõi hành vi</h3>
          <p className="text-slate-500 leading-relaxed">Mỗi lượt thích, thêm vào giỏ hàng và xem sản phẩm đều giúp hệ thống hiểu bạn hơn.</p>
        </div>
        <div className="flex flex-col items-center pt-8 md:pt-0">
          <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-6">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>
          </div>
          <h3 className="text-xl font-bold mb-3 text-slate-900">Gợi ý cá nhân hóa</h3>
          <p className="text-slate-500 leading-relaxed">Người dùng nhận được những gợi ý sản phẩm dựa trên hồ sơ, tìm kiếm và lịch sử mua sắm.</p>
        </div>
        <div className="flex flex-col items-center pt-8 md:pt-0">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
          </div>
          <h3 className="text-xl font-bold mb-3 text-slate-900">Thanh toán tức thì</h3>
          <p className="text-slate-500 leading-relaxed">Từ lúc xem sản phẩm đến lúc tạo đơn hàng, giao diện luôn kết nối mượt mà với API của bạn.</p>
        </div>
      </section>
    </div>
  );
}
