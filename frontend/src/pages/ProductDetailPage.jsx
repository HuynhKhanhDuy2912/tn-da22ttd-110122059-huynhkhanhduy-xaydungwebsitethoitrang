import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { apiRequest } from "../lib/api.js";
import { attachVariantsToProducts } from "../lib/catalog.js";

export default function ProductDetailPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [product, setProduct] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [allVariants, setAllVariants] = useState([]);
  const [variants, setVariants] = useState([]);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const [productResponse, productsResponse, variantResponse] = await Promise.all([
          apiRequest(`/products/${productId}`),
          apiRequest("/products"),
          apiRequest("/product-variants")
        ]);

        const currentProduct = productResponse.data;
        const allCatalogProducts = productsResponse.data;
        const currentVariants = variantResponse.data.filter(
          (variant) => variant.productId?._id === currentProduct._id
        );

        setProduct(currentProduct);
        setAllProducts(allCatalogProducts);
        setAllVariants(variantResponse.data);
        setVariants(currentVariants);
        
        if (currentVariants.length > 0) {
          const uniqueColors = [...new Set(currentVariants.map(v => v.color))];
          setSelectedColor(uniqueColors[0]);
          const sizesForColor = currentVariants.filter(v => v.color === uniqueColors[0]).map(v => v.size);
          setSelectedSize(sizesForColor[0]);
        }
      } catch (loadError) {
        setError(loadError.message);
      }
    };

    loadProduct();
    // Reset state on navigation
    setQuantity(1);
    setMessage("");
    setError("");
    window.scrollTo(0, 0);
  }, [productId]);

  const selectedVariant = useMemo(
    () => variants.find((v) => v.color === selectedColor && v.size === selectedSize) || variants[0],
    [selectedColor, selectedSize, variants]
  );

  const availableColors = useMemo(() => [...new Set(variants.map(v => v.color))], [variants]);
  
  const availableSizes = useMemo(() => {
    return [...new Set(variants.filter(v => v.color === selectedColor).map(v => v.size))];
  }, [variants, selectedColor]);

  // When color changes, automatically select the first available size for that color
  const handleColorChange = (color) => {
    setSelectedColor(color);
    const sizesForColor = variants.filter(v => v.color === color).map(v => v.size);
    if (!sizesForColor.includes(selectedSize)) {
      setSelectedSize(sizesForColor[0]);
    }
  };

  const currentImage = selectedVariant?.image || product?.images?.[0] || "https://placehold.co/720x900/f1e8db/6e5b49?text=Product+Detail";

  const galleryImages = useMemo(() => {
    const variantImages = variants.map((variant) => variant.image).filter(Boolean);
    const productImages = product?.images || [];
    return [...new Set([currentImage, ...variantImages, ...productImages])];
  }, [currentImage, product?.images, variants]);

  const relatedProducts = useMemo(() => {
    const sameStyle = allProducts.filter(
      (item) =>
        item._id !== productId &&
        product &&
        (item.style === product.style ||
          item.gender === product.gender ||
          item.categoryId === product.categoryId)
    );
    return sameStyle.slice(0, 4);
  }, [allProducts, product, productId]);

  const relatedProductsWithVariants = useMemo(() => {
    return attachVariantsToProducts(relatedProducts, allVariants);
  }, [relatedProducts, allVariants]);

  const handleAddToCart = async () => {
    if (!selectedVariant) return;

    try {
      await apiRequest("/carts/me/items", {
        method: "POST",
        token,
        body: {
          productId: product._id,
          variantId: selectedVariant._id,
          quantity: quantity,
          source: "product_page"
        }
      });
      setMessage("Đã thêm vào giỏ hàng");
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const handleBuyNow = async () => {
    if (!selectedVariant) return;

    try {
      await apiRequest("/carts/me/items", {
        method: "POST",
        token,
        body: {
          productId: product._id,
          variantId: selectedVariant._id,
          quantity: quantity,
          source: "buy_now"
        }
      });
      navigate("/checkout");
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  if (!product) {
    return (
      <section className="min-h-[50vh] flex items-center justify-center">
        <p className="text-gray-500 font-medium">{error || "Đang tải dữ liệu sản phẩm..."}</p>
      </section>
    );
  }

  return (
    <div className="px-4 md:px-0 py-8 max-w-[1400px] mx-auto">
      <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 mb-8 px-4 lg:px-8">
        <Link to="/" className="hover:text-black transition-colors">TRANG CHỦ</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-black transition-colors">SẢN PHẨM</Link>
        <span>/</span>
        <span className="text-black line-clamp-1">{product.name}</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 mb-20 relative items-start px-4 lg:px-8">
        {/* Left: Images Grid */}
        <div className="flex-1 w-full lg:w-3/5 grid grid-cols-2 gap-2 md:gap-4">
          {galleryImages.slice(0, 6).map((image, index) => (
            <div key={`${image}-${index}`} className="aspect-[3/4] bg-gray-100 overflow-hidden w-full group">
              <img src={image} alt={`${product.name}-${index}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            </div>
          ))}
        </div>

        {/* Right: Info (Sticky) */}
        <div className="flex-1 w-full lg:w-2/5 flex flex-col lg:sticky lg:top-24">
          <h2 className="text-2xl md:text-3xl font-extrabold text-black mb-4 leading-tight tracking-wider uppercase">{product.name}</h2>
          <p className="text-xl font-bold text-black mb-6">{product.price?.toLocaleString("vi-VN")} ₫</p>
          
          <div className="w-full h-[1px] bg-gray-200 mb-6"></div>
          
          <p className="text-gray-600 leading-relaxed mb-8 text-sm">{product.description}</p>

          {/* Color Selection */}
          <div className="mb-6">
            <div className="flex justify-between items-end mb-3">
              <h3 className="text-xs font-bold text-black uppercase tracking-widest">MÀU SẮC: <span className="text-gray-500 font-medium ml-1">{selectedColor}</span></h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {availableColors.map((color) => {
                const variantForColor = variants.find(v => v.color === color);
                const colorImage = variantForColor?.image;
                return (
                  <button
                    key={color}
                    className={`w-12 h-16 border overflow-hidden transition-all cursor-pointer ${
                      color === selectedColor
                        ? "border-black"
                        : "border-gray-200 hover:border-gray-400 opacity-60 hover:opacity-100"
                    }`}
                    onClick={() => handleColorChange(color)}
                    title={color}
                  >
                    {colorImage ? (
                       <img src={colorImage} alt={color} className="w-full h-full object-cover" />
                    ) : (
                       <span className="text-[10px] w-full h-full flex items-center justify-center bg-gray-100">{color}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Size Selection */}
          <div className="mb-8">
            <div className="flex justify-between items-end mb-3">
              <h3 className="text-xs font-bold text-black uppercase tracking-widest">KÍCH THƯỚC: <span className="text-gray-500 font-medium ml-1">{selectedSize}</span></h3>
              <button className="text-[10px] text-gray-500 underline uppercase tracking-widest hover:text-black cursor-pointer">Hướng dẫn chọn size</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {availableSizes.map((size) => (
                <button
                  key={size}
                  className={`w-14 h-10 border text-xs tracking-wider uppercase transition-all cursor-pointer flex items-center justify-center ${
                    size === selectedSize
                      ? "border-black bg-black text-white font-bold"
                      : "border-gray-300 bg-white text-black hover:border-black"
                  }`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="mb-8">
            <h3 className="text-xs font-bold text-black uppercase tracking-widest mb-3">SỐ LƯỢNG</h3>
            <div className="inline-flex items-center border border-gray-300 h-12">
              <button className="px-4 text-xl hover:bg-gray-100 h-full cursor-pointer" onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
              <span className="px-6 text-sm font-bold min-w-[3rem] text-center h-full flex items-center justify-center border-l border-r border-gray-300">{quantity}</span>
              <button className="px-4 text-xl hover:bg-gray-100 h-full cursor-pointer" onClick={() => setQuantity(quantity + 1)}>+</button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            {token ? (
              <>
                <button className="flex-1 py-4 bg-white text-black border border-black font-bold uppercase tracking-widest text-xs hover:bg-gray-100 transition-colors cursor-pointer" onClick={handleAddToCart}>
                  THÊM VÀO GIỎ
                </button>
                <button className="flex-1 py-4 bg-black text-white border border-black font-bold uppercase tracking-widest text-xs hover:bg-gray-800 transition-colors cursor-pointer" onClick={handleBuyNow}>
                  MUA NGAY
                </button>
              </>
            ) : (
              <Link className="w-full py-4 bg-black text-white text-center font-bold uppercase tracking-widest text-xs hover:bg-gray-800 transition-colors" to="/login">
                ĐĂNG NHẬP ĐỂ MUA HÀNG
              </Link>
            )}
          </div>

          {message ? <p className="text-black bg-gray-100 px-6 py-4 border-l-4 border-black font-medium mb-6 text-sm">{message}</p> : null}
          {error ? <p className="text-red-600 bg-red-50 px-6 py-4 border-l-4 border-red-600 font-medium mb-6 text-sm">{error}</p> : null}

          {/* Accordions */}
          <div className="space-y-0 divide-y divide-gray-200 mt-auto border-t border-b border-gray-200">
            <details className="group" open>
              <summary className="py-5 font-bold text-xs uppercase tracking-widest cursor-pointer list-none flex justify-between items-center">
                THÔNG TIN CHI TIẾT
                <span className="transition group-open:rotate-180">
                  <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                </span>
              </summary>
              <div className="pb-5 text-gray-600 text-sm leading-relaxed">
                <ul className="list-disc pl-4 space-y-2 mt-2">
                  <li>Kiểu dáng: <span className="capitalize">{product.style}</span></li>
                  <li>Giới tính: <span className="capitalize">{product.gender}</span></li>
                  <li>Chất liệu: Cotton & Spandex</li>
                  <li>Mã sản phẩm: SKU-{product._id.slice(-6).toUpperCase()}</li>
                </ul>
              </div>
            </details>
            <details className="group">
              <summary className="py-5 font-bold text-xs uppercase tracking-widest cursor-pointer list-none flex justify-between items-center">
                GIAO HÀNG & ĐỔI TRẢ
                <span className="transition group-open:rotate-180">
                  <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                </span>
              </summary>
              <div className="pb-5 text-gray-600 text-sm leading-relaxed mt-2">
                <p className="mb-2"><strong>Giao hàng:</strong> Miễn phí giao hàng toàn quốc cho đơn từ 500.000đ.</p>
                <p><strong>Đổi trả:</strong> Hỗ trợ đổi trả trong vòng 30 ngày kể từ ngày nhận hàng với sản phẩm còn nguyên tem mác.</p>
              </div>
            </details>
          </div>
        </div>
      </div>

      <section className="border-t border-gray-200 pt-16 px-4 lg:px-8">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-2xl font-extrabold tracking-widest text-black uppercase">CÓ THỂ BẠN SẼ THÍCH</h2>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 gap-y-10">
          {relatedProductsWithVariants.map((item) => (
            <ProductCard key={item._id} product={item} />
          ))}
        </div>
      </section>
    </div>
  );
}
