import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { getProductPath } from "../lib/slug.js";

export default function ProductCard({
  product,
  onAddToWishlist,
  onAddToCart,
  actionLabel = "MUA NGAY"
}) {
  const firstVariant = product.availableVariants?.[0];
  const previewImage = product.images?.[0] || firstVariant?.image || "https://placehold.co/600x760/f3eadf/7d624c?text=Fashion";
  const hoverImage = product.images?.[1] || previewImage;
  const productPath = getProductPath(product);

  return (
    <article className="group flex flex-col relative bg-white">
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
        <Link to={productPath} className="block w-full h-full relative">
          <img src={previewImage} alt={product.name} className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 opacity-100 group-hover:opacity-0" />
          <img src={hoverImage} alt={product.name} className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 opacity-0 group-hover:opacity-100" />
        </Link>
        {product.style && (
          <div className="absolute top-2 left-2 bg-black text-white px-2 py-1 text-[0.65rem] font-bold uppercase tracking-widest">
            {product.style}
          </div>
        )}
        
        {/* Quick actions on hover */}
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 flex gap-2">
           {onAddToCart && firstVariant && (
             <>
               <Link to={productPath} className="flex-1 bg-black text-white py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors cursor-pointer flex items-center justify-center text-center">{actionLabel}</Link>
               <button className="w-10 h-10 bg-white text-black flex items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer shrink-0" onClick={() => onAddToCart(product, firstVariant)} aria-label="Thêm vào giỏ hàng">
                 <ShoppingCart className="w-4 h-4" />
               </button>
             </>
           )}
        </div>
      </div>
      
      <div className="pt-4 pb-2 flex-1 flex flex-col">
        {product.recommendationReasons?.length ? (
          <span className="text-[0.65rem] font-bold text-gray-500 uppercase tracking-widest mb-1">
            {product.recommendationReasons[0]}
          </span>
        ) : null}
        <h3 className="m-0 text-sm font-bold uppercase tracking-wide line-clamp-1 mb-1">
          <Link to={productPath} className="hover:text-gray-500 transition-colors">{product.name}</Link>
        </h3>
        <p className="m-0 font-bold text-black text-sm mb-2">{product.price?.toLocaleString("vi-VN")} ₫</p>
        
        {firstVariant && (
           <p className="text-xs text-gray-500 m-0 uppercase tracking-wider">
             {firstVariant.color}
           </p>
        )}
      </div>
    </article>
  );
}
