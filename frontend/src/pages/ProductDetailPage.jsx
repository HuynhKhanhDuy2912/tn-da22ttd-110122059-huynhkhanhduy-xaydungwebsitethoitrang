import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ProductCard from "../components/ProductCard.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { apiRequest } from "../lib/api.js";
import { attachVariantsToProducts } from "../lib/catalog.js";

export default function ProductDetailPage() {
  const { productId } = useParams();
  const { token } = useAuth();
  const [product, setProduct] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [allVariants, setAllVariants] = useState([]);
  const [variants, setVariants] = useState([]);
  const [selectedVariantId, setSelectedVariantId] = useState("");
  const [selectedImage, setSelectedImage] = useState("");
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
        setSelectedVariantId(currentVariants[0]?._id || "");
        setSelectedImage(
          currentVariants[0]?.image ||
            currentProduct.images?.[0] ||
            "https://placehold.co/720x900/f1e8db/6e5b49?text=Product+Detail"
        );
      } catch (loadError) {
        setError(loadError.message);
      }
    };

    loadProduct();
  }, [productId]);

  const selectedVariant = useMemo(
    () => variants.find((variant) => variant._id === selectedVariantId) || variants[0],
    [selectedVariantId, variants]
  );

  useEffect(() => {
    if (selectedVariant?.image) {
      setSelectedImage(selectedVariant.image);
    }
  }, [selectedVariant]);

  const currentImage =
    selectedImage ||
    selectedVariant?.image ||
    product?.images?.[0] ||
    "https://placehold.co/720x900/f1e8db/6e5b49?text=Product+Detail";

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

  const handleWishlist = async () => {
    try {
      await apiRequest("/wishlists/me", {
        method: "POST",
        token,
        body: {
          productId: product._id,
          addedFrom: "product_page"
        }
      });

      setMessage("Đã thêm vào danh sách yêu thích");
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const handleAddToCart = async () => {
    if (!selectedVariant) {
      return;
    }

    try {
      await apiRequest("/carts/me/items", {
        method: "POST",
        token,
        body: {
          productId: product._id,
          variantId: selectedVariant._id,
          quantity: 1,
          source: "product_page"
        }
      });

      setMessage("Đã thêm vào giỏ hàng");
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  if (!product) {
    return (
      <section className="min-h-[50vh] flex items-center justify-center">
        <p className="text-slate-500 font-medium">{error || "Đang tải dữ liệu sản phẩm..."}</p>
      </section>
    );
  }

  return (
    <div className="px-4 md:px-8 py-8 md:py-12 max-w-7xl mx-auto">
      <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8 font-medium">
        <Link to="/" className="hover:text-slate-900 transition-colors">Trang chủ</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-slate-900 transition-colors">Sản phẩm</Link>
        <span>/</span>
        <span className="text-slate-900 line-clamp-1">{product.name}</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 mb-20">
        <div className="flex-1 lg:max-w-2xl">
          <div className="flex flex-col md:flex-row-reverse gap-4">
            <div className="flex-1 rounded-[24px] overflow-hidden bg-slate-50 aspect-[3/4] md:aspect-auto border border-slate-100">
              <img src={currentImage} alt={product.name} className="w-full h-full object-cover object-center" />
            </div>
            <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto pb-2 md:pb-0 md:pr-2 scrollbar-hide md:w-24 shrink-0">
              {galleryImages.slice(0, 5).map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  className={`w-20 md:w-full aspect-[3/4] shrink-0 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${image === currentImage ? 'border-brand-primary shadow-md' : 'border-transparent opacity-60 hover:opacity-100 hover:border-slate-300'}`}
                  onClick={() => setSelectedImage(image)}
                >
                  <img src={image} alt={`${product.name}-${index}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 lg:max-w-xl flex flex-col pt-4">
          <span className="uppercase tracking-[0.2em] text-xs font-bold text-slate-400 mb-3 block">Chi tiết sản phẩm</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 mb-4 leading-tight tracking-tight">{product.name}</h2>
          <p className="text-2xl font-bold text-brand-primary mb-6">{product.price?.toLocaleString("vi-VN")} ₫</p>
          <p className="text-slate-600 leading-relaxed mb-8 text-lg font-light">{product.description}</p>

          <div className="grid grid-cols-2 gap-4 mb-10 bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <div>
              <span className="block text-xs uppercase tracking-wider text-slate-500 font-bold mb-1">Kiểu dáng</span>
              <span className="font-medium text-slate-900 capitalize">{product.style}</span>
            </div>
            <div>
              <span className="block text-xs uppercase tracking-wider text-slate-500 font-bold mb-1">Giới tính</span>
              <span className="font-medium text-slate-900 capitalize">{product.gender}</span>
            </div>
            <div>
              <span className="block text-xs uppercase tracking-wider text-slate-500 font-bold mb-1">Đánh giá</span>
              <span className="font-medium text-slate-900">{product.averageRating} ★</span>
            </div>
            <div>
              <span className="block text-xs uppercase tracking-wider text-slate-500 font-bold mb-1">Lượt nhận xét</span>
              <span className="font-medium text-slate-900">{product.totalReviews}</span>
            </div>
          </div>

          <div className="mb-10">
            <div className="flex justify-between items-end mb-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Chọn phiên bản</h3>
            </div>
            <div className="flex flex-wrap gap-3">
              {variants.map((variant) => (
                <button
                  key={variant._id}
                  className={`px-5 py-3 rounded-xl border-2 font-medium text-sm transition-all flex flex-col items-start gap-1 cursor-pointer ${
                    variant._id === selectedVariantId
                      ? "border-brand-primary bg-brand-primary/5 text-brand-primary shadow-sm"
                      : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                  onClick={() => {
                    setSelectedVariantId(variant._id);
                    if (variant.image) {
                      setSelectedImage(variant.image);
                    }
                  }}
                >
                  <span className="font-bold">{variant.color}</span>
                  <span className="text-xs opacity-70">Size: {variant.size}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            {token ? (
              <>
                <button className="flex-1 px-8 py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-black transition-all shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] hover:-translate-y-0.5 cursor-pointer" onClick={handleAddToCart}>
                  Thêm vào giỏ hàng
                </button>
                <button className="px-8 py-4 bg-white text-slate-900 border border-slate-200 rounded-xl font-bold hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer whitespace-nowrap" onClick={handleWishlist}>
                  Yêu thích
                </button>
              </>
            ) : (
              <Link className="flex-1 px-8 py-4 bg-brand-primary text-white text-center rounded-xl font-bold hover:opacity-90 transition-all shadow-[0_4px_14px_0_rgba(59,130,246,0.3)] hover:shadow-[0_6px_20px_rgba(59,130,246,0.4)] hover:-translate-y-0.5" to="/login">
                Đăng nhập để mua hàng
              </Link>
            )}
          </div>

          {message ? <p className="text-green-600 bg-green-50 px-6 py-4 rounded-xl border border-green-100 font-medium mb-6">{message}</p> : null}
          {error ? <p className="text-red-500 bg-red-50 px-6 py-4 rounded-xl border border-red-100 font-medium mb-6">{error}</p> : null}

          <div className="space-y-6 divide-y divide-slate-100 mt-auto">
            <div className="pt-6">
              <h3 className="text-base font-bold text-slate-900 mb-3">Thông tin sản phẩm</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Được thiết kế cho tủ đồ hiện đại với trọng tâm là sự nhất quán trong phong cách, linh hoạt trong cách phối đồ và chất liệu cao cấp bền bỉ với thời gian.
              </p>
            </div>
            <div className="pt-6">
              <h3 className="text-base font-bold text-slate-900 mb-3">Giao hàng & Bảo quản</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Miễn phí vận chuyển cho đơn hàng trên 500k. Đổi trả trong vòng 30 ngày. Giặt máy ở chế độ nhẹ nhàng, không dùng chất tẩy mạnh.
              </p>
            </div>
          </div>
        </div>
      </div>

      <section>
        <div className="flex justify-between items-end mb-8">
          <div>
            <span className="uppercase tracking-[0.2em] text-xs font-bold text-brand-primary mb-2 block">Gợi ý thêm</span>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Sản phẩm liên quan</h2>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {relatedProductsWithVariants.map((item) => (
            <ProductCard key={item._id} product={item} />
          ))}
        </div>
      </section>
    </div>
  );
}
