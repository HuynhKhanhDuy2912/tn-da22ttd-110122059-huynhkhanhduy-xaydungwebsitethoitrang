import { Link } from "react-router-dom";

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
    <article className="bg-white rounded-3xl shadow-brand border border-brand-line overflow-hidden flex flex-col transition-shadow hover:shadow-lg">
      <div className="relative aspect-[3/4] overflow-hidden bg-brand-surface-soft group">
        <Link to={`/products/${product._id}`} className="block w-full h-full">
          <img src={previewImage} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        </Link>
        {product.style && (
          <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full text-[0.68rem] font-bold uppercase tracking-widest text-brand-text shadow-sm border border-black/5">
            {product.style}
          </div>
        )}
      </div>
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start gap-4 mb-3">
          <h3 className="m-0 text-xl font-bold leading-tight">
            <Link to={`/products/${product._id}`} className="hover:text-brand-primary transition-colors">{product.name}</Link>
          </h3>
          <p className="m-0 font-bold text-brand-primary whitespace-nowrap text-lg">{product.price?.toLocaleString("vi-VN")} đ</p>
        </div>
        <p className="text-[0.95rem] text-brand-muted m-0 line-clamp-2 mb-5 leading-relaxed">{product.description}</p>
        
        {product.recommendationReasons?.length ? (
          <ul className="list-none p-0 m-0 mb-5 grid gap-2">
            {product.recommendationReasons.map((reason) => (
              <li key={reason} className="text-xs text-brand-primary-deep bg-brand-primary/10 px-3 py-2 rounded-lg border border-brand-primary/20">
                ✨ {reason}
              </li>
            ))}
          </ul>
        ) : null}
        
        {firstVariant ? (
          <p className="text-sm text-brand-muted m-0 mb-5 pb-5 border-b border-brand-line">
            Variant: {firstVariant.color} / {firstVariant.size}
          </p>
        ) : <div className="mb-5 pb-5 border-b border-brand-line"></div>}
        
        <div className="mt-auto flex gap-3 flex-wrap">
          {onAddToWishlist ? (
            <button className="flex-1 py-3 px-5 rounded-full border border-brand-line bg-transparent text-brand-text hover:bg-brand-primary/10 hover:border-brand-primary/30 transition-all cursor-pointer text-[0.92rem] font-medium text-center" onClick={() => onAddToWishlist(product)}>
              Wishlist
            </button>
          ) : null}
          {onAddToCart && firstVariant ? (
            <button className="flex-1 py-3 px-5 rounded-full bg-brand-primary text-white hover:bg-brand-primary/90 hover:-translate-y-0.5 transition-all cursor-pointer text-[0.92rem] font-medium border-none text-center shadow-[0_8px_16px_rgba(126,90,60,0.2)]" onClick={() => onAddToCart(product, firstVariant)}>{actionLabel}</button>
          ) : null}
        </div>
      </div>
    </article>
  );
}
