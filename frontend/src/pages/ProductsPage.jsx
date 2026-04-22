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

  const inputClass = "border border-gray-200 rounded-none px-4 py-2.5 bg-white text-black transition-colors focus:border-black focus:outline-none w-full text-sm appearance-none";
  const labelClass = "font-bold text-black text-xs uppercase tracking-widest mb-2 block";

  return (
    <div className="flex flex-col pb-16">
      <div className="px-4 md:px-0 mt-8">
        <PageHeader
          title="TẤT CẢ SẢN PHẨM"
          description="Khám phá bộ sưu tập thời trang hiện đại với thiết kế tối giản."
          aside={<span className="text-black font-bold border border-black px-4 py-2 text-xs uppercase tracking-widest">{filteredProducts.length} SẢN PHẨM</span>}
        />
        
        {message ? <p className="text-black bg-gray-100 px-6 py-4 border-l-4 border-black font-medium mb-6">{message}</p> : null}
        {error ? <p className="text-red-600 bg-red-50 px-6 py-4 border-l-4 border-red-600 font-medium mb-6">{error}</p> : null}
        
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <aside className="w-full lg:w-64 shrink-0 bg-white sticky top-24">
            <div className="mb-6 pb-6 border-b border-gray-200">
              <label className={labelClass}>TÌM KIẾM</label>
              <div className="relative border-b border-gray-300 focus-within:border-black">
                <input
                  className="w-full bg-transparent py-2 pl-2 pr-8 text-sm focus:outline-none"
                  placeholder="Nhập từ khóa..."
                  value={filters.search}
                  onChange={(event) =>
                    setFilters((current) => ({ ...current, search: event.target.value }))
                  }
                />
                <svg className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </div>
            </div>
            <div className="space-y-6 mb-8">
              <div>
                <label className={labelClass}>KIỂU DÁNG</label>
                <div className="relative">
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
                  <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
              <div>
                <label className={labelClass}>GIỚI TÍNH</label>
                <div className="relative">
                  <select
                    className={inputClass}
                    value={filters.gender}
                    onChange={(event) =>
                      setFilters((current) => ({ ...current, gender: event.target.value }))
                    }
                  >
                    <option value="">Tất cả giới tính</option>
                    {filterOptions.genders.map((item) => (
                      <option key={item} value={item} className="capitalize">
                        {item === "male" ? "Nam" : item === "female" ? "Nữ" : "Unisex"}
                      </option>
                    ))}
                  </select>
                  <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
              <div>
                <label className={labelClass}>DỊP SỬ DỤNG</label>
                <div className="relative">
                  <select
                    className={inputClass}
                    value={filters.occasion}
                    onChange={(event) =>
                      setFilters((current) => ({ ...current, occasion: event.target.value }))
                    }
                  >
                    <option value="">Tất cả dịp sử dụng</option>
                    {filterOptions.occasions.map((item) => (
                      <option key={item} value={item} className="capitalize">
                        {item}
                      </option>
                    ))}
                  </select>
                  <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>
            <button
              className="w-full px-4 py-3 font-bold text-black border border-black bg-transparent hover:bg-black hover:text-white transition-colors text-xs tracking-widest uppercase cursor-pointer"
              onClick={() =>
                setFilters({
                  search: "",
                  style: "",
                  gender: "",
                  occasion: ""
                })
              }
            >
              XÓA BỘ LỌC
            </button>
          </aside>

          <div className="flex-1 min-w-0">
            <div className="flex justify-end mb-6">
              <Link className="text-xs font-bold text-black hover:text-gray-500 transition-colors uppercase tracking-widest border-b border-black pb-1" to="/recommendations">
                GỢI Ý CHO BẠN
              </Link>
            </div>
            
            {filteredProducts.length === 0 ? (
              <div className="text-center py-32 bg-gray-50 border border-gray-200">
                <h3 className="text-lg font-bold text-black mb-2 uppercase tracking-widest">Không tìm thấy sản phẩm</h3>
                <p className="text-gray-500 text-sm">Thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm của bạn.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 gap-y-10">
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
