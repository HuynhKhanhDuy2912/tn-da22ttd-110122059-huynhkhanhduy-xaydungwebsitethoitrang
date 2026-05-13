import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Filter, Grid2X2, Grid3X3, Rows3 } from "lucide-react";
import ProductCard from "../components/ProductCard.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { apiRequest } from "../lib/api.js";
import { attachVariantsToProducts } from "../lib/catalog.js";

export default function CollectionDetailPage() {
  const { collectionId } = useParams();
  const { token } = useAuth();

  const [collection, setCollection] = useState(null);
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        let colRes;
        try {
          colRes = await apiRequest(`/collections/slug/${collectionId}`);
        } catch {
          colRes = await apiRequest(`/collections/${collectionId}`);
        }

        const col = colRes.data;
        setCollection(col);

        if (col.products?.length > 0) {
          const productIds = col.products.map((product) => product._id || product);
          const varRes = await apiRequest("/product-variants?limit=500");
          const allVariants = varRes.data || [];
          setVariants(
            allVariants.filter((variant) => productIds.includes(variant.productId?._id || variant.productId))
          );
        }
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    load();
    window.scrollTo(0, 0);
  }, [collectionId]);

  const productsWithVariants = useMemo(() => {
    if (!collection?.products) return [];
    return attachVariantsToProducts(collection.products, variants);
  }, [collection, variants]);

  const handleAddToCart = async (product, variant) => {
    try {
      await apiRequest("/carts/me/items", {
        method: "POST",
        token,
        body: {
          productId: product._id,
          variantId: variant._id,
          quantity: 1,
          source: "collection"
        }
      });
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-black border-t-transparent" />
          <p className="text-sm text-gray-500">{error || "Đang tải..."}</p>
        </div>
      </section>
    );
  }

  if (!collection) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <h2 className="mb-2 text-xl font-bold">Không tìm thấy</h2>
          <p className="mb-6 text-sm text-gray-500">
            Bộ sưu tập này không tồn tại hoặc đã bị xóa.
          </p>
          <Link
            to="/collections"
            className="bg-black px-6 py-3 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-gray-800"
          >
            Xem tất cả bộ sưu tập
          </Link>
        </div>
      </section>
    );
  }

  const bannerImage = collection.bannerImage || collection.coverImage;

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-8 lg:px-8">
      <section className="mb-10 border border-gray-200 bg-white px-5 py-5">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <span className="font-bold text-black">{productsWithVariants.length} sản phẩm</span>
            <span className="text-gray-300">/</span>
            <Link to="/" className="text-gray-500 transition hover:text-black">
              Trang chủ
            </Link>
            <span className="text-gray-300">&gt;</span>
            <Link to="/collections" className="text-gray-500 transition hover:text-black">
              Bộ sưu tập
            </Link>
            <span className="text-gray-300">&gt;</span>
            <span className="font-bold text-black">{collection.name}</span>
          </div>

          <div className="flex items-center gap-4 text-black">
            <button type="button" className="grid h-9 w-9 place-items-center transition hover:bg-gray-50" aria-label="Lọc">
              <Filter className="h-5 w-5" strokeWidth={1.7} />
            </button>
            <button type="button" className="grid h-9 w-9 place-items-center transition hover:bg-gray-50" aria-label="Sắp xếp">
              <Rows3 className="h-5 w-5" strokeWidth={1.7} />
            </button>
            <button type="button" className="grid h-9 w-9 place-items-center transition hover:bg-gray-50" aria-label="Lưới 2 cột">
              <Grid2X2 className="h-5 w-5" strokeWidth={1.7} />
            </button>
            <button type="button" className="grid h-9 w-9 place-items-center transition hover:bg-gray-50" aria-label="Lưới 3 cột">
              <Grid3X3 className="h-5 w-5 text-gray-500" strokeWidth={1.7} />
            </button>
          </div>
        </div>
      </section>

      <section className="mb-6 overflow-hidden bg-gray-100">
        {bannerImage ? (
          <img src={bannerImage} alt={collection.name} className="h-auto w-full object-cover" />
        ) : (
          <div className="grid aspect-[16/5] place-items-center bg-gray-100 px-6 text-center">
            <div>
              <h1 className="mb-2 text-3xl font-extrabold uppercase tracking-wide text-black md:text-5xl">
                {collection.name}
              </h1>
              {collection.description ? (
                <p className="mx-auto max-w-2xl text-sm leading-6 text-gray-500">{collection.description}</p>
              ) : null}
            </div>
          </div>
        )}
      </section>

      {collection.description ? (
        <section className="mb-10 max-w-3xl">
          <h1 className="mb-3 text-2xl font-extrabold uppercase tracking-wide text-black md:text-3xl">
            {collection.name}
          </h1>
          <p className="m-0 text-sm leading-7 text-gray-500">{collection.description}</p>
        </section>
      ) : null}

      <section className="py-4">
        {productsWithVariants.length === 0 ? (
          <div className="border border-gray-200 py-16 text-center">
            <p className="m-0 text-sm text-gray-400">Bộ sưu tập chưa có sản phẩm nào</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
            {productsWithVariants.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onAddToCart={token ? handleAddToCart : null}
              />
            ))}
          </div>
        )}
      </section>

      <section className="border-t border-gray-200 py-12 text-center">
        <Link
          to="/collections"
          className="inline-block bg-black px-10 py-4 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-gray-800"
        >
          Xem tất cả bộ sưu tập
        </Link>
      </section>
    </div>
  );
}
