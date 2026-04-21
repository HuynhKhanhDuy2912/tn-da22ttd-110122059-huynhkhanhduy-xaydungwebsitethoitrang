import { useEffect, useState } from "react";
import PageHeader from "../components/PageHeader.jsx";
import ProductCard from "../components/ProductCard.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { apiRequest } from "../lib/api.js";

export default function ProductsPage() {
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

  const getProductWithVariants = (product) => ({
    ...product,
    availableVariants: variants.filter((variant) => variant.productId?._id === product._id)
  });

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

      setMessage(`Added ${product.name} to wishlist`);
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

      setMessage(`Added ${product.name} to cart`);
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  return (
    <section>
      <section className="hero-panel">
        <div className="hero-copy">
          <span className="eyebrow">New arrival edit</span>
          <h2>Modern wardrobe essentials with a personalized shopping flow</h2>
          <p>
            Browse products, save favorites, add variants to cart, and let the backend
            recommendation engine adapt to each user interaction.
          </p>
        </div>
        <div className="hero-metrics">
          <div className="metric-card">
            <span>{products.length}</span>
            <p>Seeded products available</p>
          </div>
          <div className="metric-card">
            <span>{variants.length}</span>
            <p>Variants ready for cart and checkout</p>
          </div>
        </div>
      </section>

      <PageHeader
        title="Products"
        description="A clean storefront inspired by contemporary Vietnamese fashion e-commerce."
      />
      {message ? <p className="success-text">{message}</p> : null}
      {error ? <p className="error-text">{error}</p> : null}
      <div className="grid">
        {products.map((product) => (
          <ProductCard
            key={product._id}
            product={getProductWithVariants(product)}
            onAddToWishlist={token ? handleWishlist : null}
            onAddToCart={token ? handleAddToCart : null}
          />
        ))}
      </div>
    </section>
  );
}
