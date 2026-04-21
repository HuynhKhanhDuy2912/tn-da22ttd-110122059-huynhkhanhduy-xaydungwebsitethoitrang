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
    <section>
      <PageHeader
        title="Wishlist"
        description={`Saved products: ${wishlist.totalItems}`}
      />
      {error ? <p className="error-text">{error}</p> : null}
      <div className="stack">
        {wishlist.items.map((item) => (
          <div key={item._id} className="card row-card">
            <div>
              <h3>{item.productId?.name}</h3>
              <p className="muted">{item.productId?.style}</p>
            </div>
            <button className="secondary-button" onClick={() => removeItem(item.productId?._id)}>
              Remove
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
