export default function ProductCard({
  product,
  onAddToWishlist,
  onAddToCart,
  actionLabel = "Add to cart"
}) {
  const firstVariant = product.availableVariants?.[0];
  const previewImage =
    firstVariant?.image || product.images?.[0] || "https://placehold.co/600x760/f3eadf/7d624c?text=Fashion";

  return (
    <article className="card product-card">
      <div className="product-image-frame">
        <img src={previewImage} alt={product.name} className="product-image" />
        <div className="card-chip">{product.style}</div>
      </div>
      <div className="product-copy">
        <div className="product-heading">
          <h3>{product.name}</h3>
          <p className="price">{product.price?.toLocaleString("vi-VN")} VND</p>
        </div>
        <p>{product.description}</p>
      </div>
      {product.recommendationReasons?.length ? (
        <ul className="reason-list">
          {product.recommendationReasons.map((reason) => (
            <li key={reason}>{reason}</li>
          ))}
        </ul>
      ) : null}
      {firstVariant ? (
        <p className="muted">
          Variant: {firstVariant.color} / {firstVariant.size}
        </p>
      ) : null}
      <div className="actions product-actions">
        {onAddToWishlist ? (
          <button className="secondary-button" onClick={() => onAddToWishlist(product)}>
            Wishlist
          </button>
        ) : null}
        {onAddToCart && firstVariant ? (
          <button onClick={() => onAddToCart(product, firstVariant)}>{actionLabel}</button>
        ) : null}
      </div>
    </article>
  );
}
