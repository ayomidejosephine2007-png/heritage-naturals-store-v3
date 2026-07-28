import React from 'react';
import { Star, Leaf, AlertCircle, ShoppingBag, MessageSquare } from 'lucide-react';
import { Product, formatPrice } from '../types';

interface ProductCardProps {
  key?: string;
  product: Product;
  onViewDetails: (product: Product) => void;
  onAddToCart: (product: Product, e: React.MouseEvent) => void;
}

export default function ProductCard({ product, onViewDetails, onAddToCart }: ProductCardProps) {
  const isOutOfStock = product.stockStatus === 'out_of_stock';
  const isLowStock = product.stockStatus === 'low_stock';

  return (
    <div 
      className="group bg-cream-light border border-gold/15 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer"
      onClick={() => onViewDetails(product)}
      id={`product-card-${product.id}`}
    >
      
      {/* Product Image Wrapper */}
      <div className="relative aspect-[4/3] bg-cream-dark overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
        
        {/* Absolute overlays: Category tag */}
        <div className="absolute top-3 left-3 bg-forest/90 text-gold-light text-[10px] font-sans font-bold tracking-widest uppercase px-3 py-1 rounded-full shadow-sm">
          {product.category}
        </div>

        {/* Stock Badges */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-forest-dark/70 backdrop-blur-[2px] flex items-center justify-center p-3">
            <div className="bg-cream/95 text-forest font-sans font-bold text-xs uppercase tracking-wider px-4 py-2 rounded-full border border-gold/40 shadow-md flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Sold Out</span>
            </div>
          </div>
        )}

        {isLowStock && !isOutOfStock && (
          <div className="absolute top-3 right-3 bg-red-600/95 text-white text-[9px] font-sans font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
            Low Stock
          </div>
        )}

        {/* Quick hover add-to-cart button for desktops */}
        {!isOutOfStock && (
          <button
            onClick={(e) => onAddToCart(product, e)}
            className="absolute bottom-3 right-3 p-3 bg-gold hover:bg-gold-light text-forest-dark rounded-full shadow-lg transform translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300"
            title="Quick Add to Cart"
            id={`quick-add-${product.id}`}
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Product Information */}
      <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
        
        {/* Title and Rating */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-sans tracking-wide text-gold-dark font-medium flex items-center gap-1">
              <Leaf className="w-3 h-3 text-gold" /> {product.size || 'Standard Size'}
            </span>
            <div className="flex items-center gap-0.5 text-gold text-xs">
              <Star className="w-3.5 h-3.5 fill-gold" />
              <span className="font-sans font-semibold text-forest-dark">{product.rating || 5.0}</span>
              <span className="text-gray-400">({product.reviewsCount || 10})</span>
            </div>
          </div>

          <h3 className="font-serif text-xl font-bold text-forest group-hover:text-gold-dark transition-colors duration-200 line-clamp-1">
            {product.name}
          </h3>

          <p className="text-sm text-forest/75 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Skin Type tags & Price Action bar */}
        <div className="space-y-3 pt-3 border-t border-gold/10">
          <div className="flex flex-wrap gap-1.5">
            {product.skinTypes.slice(0, 3).map((type) => (
              <span 
                key={type} 
                className="bg-gold/10 text-forest-dark text-[9px] font-sans font-medium px-2 py-0.5 rounded"
              >
                {type}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex flex-col">
              <span className="text-xs text-forest/60 uppercase tracking-widest font-sans font-medium">Price</span>
              <span className="text-lg font-serif font-bold text-forest-dark">{formatPrice(product.price)}</span>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                if (!isOutOfStock) {
                  onAddToCart(product, e);
                } else {
                  onViewDetails(product);
                }
              }}
              className={`px-4 py-2 rounded-full font-sans text-xs font-bold transition-all duration-300 ${
                isOutOfStock
                  ? 'bg-transparent text-forest/50 border border-forest/20 hover:bg-forest/5 cursor-pointer'
                  : 'bg-forest hover:bg-forest-light text-gold-light shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 cursor-pointer'
              }`}
              id={`card-action-btn-${product.id}`}
            >
              {isOutOfStock ? 'View Profile' : 'Add to Bag'}
            </button>
          </div>

          <div className="pt-2 mt-2 border-t border-dashed border-gold/15">
            <a
              href={`https://wa.me/2349167592135?text=${encodeURIComponent(`Hi Heritage Naturals, I'd like to order ${product.name} - ${formatPrice(product.price)}`)}`}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center justify-center gap-1.5 w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-sans text-[11px] font-bold transition-all hover:scale-[1.02] active:scale-95 shadow-sm"
              id={`whatsapp-order-${product.id}`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Order on WhatsApp</span>
            </a>
          </div>
        </div>

      </div>

    </div>
  );
}
