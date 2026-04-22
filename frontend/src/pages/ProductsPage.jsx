import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import PageHeader from "../components/PageHeader.jsx";
import ProductCard from "../components/ProductCard.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { apiRequest } from "../lib/api.js";
import {
  attachVariantsToProducts,
  buildCatalogFilters,
  filterProducts
} from "../lib/catalog.js";

export default function ProductsPage() {
  const { token } = useAuth();
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [variants, setVariants] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    style: "",
    gender: "",
    occasion: ""
  });

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

  useEffect(() => {
    setFilters((current) => ({
      ...current,
      search: searchParams.get("search") || ""
    }));
  }, [searchParams]);

  const productsWithVariants = useMemo(
    () => attachVariantsToProducts(products, variants),
    [products, variants]
  );
  const filterOptions = useMemo(
    () => buildCatalogFilters(productsWithVariants),
    [productsWithVariants]
  );
  const filteredProducts = useMemo(
    () => filterProducts(productsWithVariants, filters),
    [productsWithVariants, filters]
  );

  const handleWishlist = async (product) => {
    try {
      await apiRequest("/wishlists/me", {
        method: "POST",
        token,
        body: {
          productId: product._id,
          addedFrom: "product_page"
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
          source: "product_page"
        }
      });

      setMessage(`Đã thêm ${product.name} vào giỏ hàng`);
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const inputClass = "border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-50/50 text-slate-900 transition-all focus:bg-white focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 focus:outline-none w-full text-sm";
  const labelClass = "font-bold text-slate-900 text-xs uppercase tracking-wider mb-2 block";

  return (
    <div className="flex flex-col pb-16">
      <section className="relative h-[300px] md:h-[400px] flex items-center justify-center overflow-hidden bg-slate-900 text-white rounded-[2rem] mx-4 mt-4 shadow-xl">
        <img 
          src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2070&auto=format&fit=crop" 
          alt="Products Background" 
          className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
        <div className="relative z-10 text-center max-w-2xl px-6">
          <span className="uppercase tracking-[0.3em] text-xs font-bold text-brand-primary mb-4 block">Bộ sưu tập đầy đủ</span>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight tracking-tight">Cửa hàng Thời trang</h2>
          <p className="text-white/80 text-lg">
            Duyệt qua các sản phẩm, lưu sản phẩm yêu thích và khám phá phong cách riêng của bạn.
          </p>
        </div>
        <div className="hidden md:flex absolute bottom-8 gap-12 right-12 z-10 bg-black/30 backdrop-blur-md px-8 py-4 rounded-2xl border border-white/10">
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold text-brand-primary leading-none mb-1">{products.length}</span>
            <p className="text-xs text-white/70 uppercase tracking-widest font-bold">Sản phẩm</p>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold text-brand-primary leading-none mb-1">{variants.length}</span>
            <p className="text-xs text-white/70 uppercase tracking-widest font-bold">Biến thể</p>
          </div>
        </div>
      </section>

      <div className="px-4 md:px-8 mt-8">
        <PageHeader
          title="Tất cả sản phẩm"
          description="Giao diện mua sắm lấy cảm hứng từ các trang thương mại điện tử thời trang hiện đại."
          aside={<span className="text-brand-primary font-bold bg-brand-primary/10 px-4 py-2 rounded-full text-sm">{filteredProducts.length} sản phẩm</span>}
        />
        
        {message ? <p className="text-green-600 bg-green-50 px-6 py-4 rounded-xl border border-green-100 font-medium mb-6">{message}</p> : null}
        {error ? <p className="text-red-500 bg-red-50 px-6 py-4 rounded-xl border border-red-100 font-medium mb-6">{error}</p> : null}
        
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="w-full lg:w-72 shrink-0 bg-white p-6 rounded-[24px] shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-slate-100 h-fit sticky top-24">
            <div className="mb-6 pb-6 border-b border-slate-100">
              <label className={labelClass}>Tìm kiếm</label>
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                <input
                  className={`${inputClass} pl-10`}
                  placeholder="Tìm kiếm sản phẩm..."
                  value={filters.search}
                  onChange={(event) =>
                    setFilters((current) => ({ ...current, search: event.target.value }))
                  }
                />
              </div>
            </div>
            <div className="space-y-6 mb-8">
              <div>
                <label className={labelClass}>Kiểu dáng</label>
                <select
                  className={inputClass}
                  value={filters.style}
                  onChange={(event) =>
                    setFilters((current) => ({ ...current, style: event.target.value }))
                  }
                >
                  <option value="">Tất cả kiểu dáng</option>
                  {filterOptions.styles.map((item) => (
                    <option key={item} value={item} className="capitalize">
                      {item}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Giới tính</label>
                <select
                  className={inputClass}
                  value={filters.gender}
                  onChange={(event) =>
                    setFilters((current) => ({ ...current, gender: event.target.value }))
                  }
                >
                  <option value="">Tất cả</option>
                  {filterOptions.genders.map((item) => (
                    <option key={item} value={item} className="capitalize">
                      {item === "male" ? "Nam" : item === "female" ? "Nữ" : "Unisex"}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Dịp sử dụng</label>
                <select
                  className={inputClass}
                  value={filters.occasion}
                  onChange={(event) =>
                    setFilters((current) => ({ ...current, occasion: event.target.value }))
                  }
                >
                  <option value="">Tất cả các dịp</option>
                  {filterOptions.occasions.map((item) => (
                    <option key={item} value={item} className="capitalize">
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <button
              className="w-full px-4 py-3 rounded-xl font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors text-sm"
              onClick={() =>
                setFilters({
                  search: "",
                  style: "",
                  gender: "",
                  occasion: ""
                })
              }
            >
              Xóa bộ lọc
            </button>
          </aside>

          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <p className="text-slate-600 text-sm font-medium">
                Khám phá những thiết kế tinh tế và hiện đại nhất
              </p>
              <Link className="text-sm font-bold text-brand-primary hover:text-slate-900 transition-colors flex items-center gap-1" to="/recommendations">
                Gợi ý cho bạn <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
              </Link>
            </div>
            
            {filteredProducts.length === 0 ? (
              <div className="text-center py-20 bg-slate-50 rounded-[24px] border border-slate-100 border-dashed">
                <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Không tìm thấy sản phẩm</h3>
                <p className="text-slate-500">Thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm của bạn.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    onAddToWishlist={token ? handleWishlist : null}
                    onAddToCart={token ? handleAddToCart : null}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
