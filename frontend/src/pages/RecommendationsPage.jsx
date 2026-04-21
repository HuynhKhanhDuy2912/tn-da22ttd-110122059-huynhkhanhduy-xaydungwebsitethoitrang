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
          source: "recommendation"
        }
      });

      setMessage(`Added ${product.name} to cart`);
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  return (
    <section>
      <PageHeader
        title="Recommendations"
        description="These products are scored from your profile, wishlist, search history, and tracked behavior."
        aside={<button onClick={loadRecommendations}>Refresh list</button>}
      />
      <div className="insight-banner">
        <div>
          <strong>How this list is built</strong>
          <p>
            The backend combines your favorite styles, colors, wishlist signals, behavior
            events, and available variants in stock.
          </p>
        </div>
      </div>
      {message ? <p className="success-text">{message}</p> : null}
      {error ? <p className="error-text">{error}</p> : null}
      <div className="grid">
        {items.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            onAddToWishlist={handleWishlist}
            onAddToCart={handleAddToCart}
            actionLabel="Add recommended item"
          />
        ))}
      </div>
    </section>
  );
}
