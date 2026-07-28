import React, { useState, useEffect } from 'react';
import { ArrowLeft, Star, Leaf, ShoppingBag, Check, Award, ShieldAlert, Sparkles, MessageSquare } from 'lucide-react';
import { Product, formatPrice } from '../types';

interface ProductDetailsProps {
  product: Product;
  allProducts: Product[];
  onBack: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onViewProduct: (product: Product) => void;
}

export default function ProductDetails({ product, allProducts, onBack, onAddToCart, onViewProduct }: ProductDetailsProps) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    // Reset quantity when looking at a new product
    setQuantity(1);
    setAdded(false);
  }, [product]);

  const relatedProducts = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  // If we don't have enough from the same category, grab other categories to make 3 related items
  if (relatedProducts.length < 3) {
    const extra = allProducts
      .filter((p) => p.category !== product.category && p.id !== product.id)
      .slice(0, 3 - relatedProducts.length);
    relatedProducts.push(...extra);
  }

  const handleAdd = () => {
    onAddToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const isOutOfStock = product.stockStatus === 'out_of_stock';
  const isLowStock = product.stockStatus === 'low_stock';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" id="product-detail-view">
      
      {/* Back button */}
      <button 
        onClick={onBack}
        className="inline-flex items-center gap-2 px-4 py-2 border border-gold/25 rounded-full text-forest hover:bg-gold/15 text-sm font-medium transition-all duration-300 mb-8"
        id="detail-back-button"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Shop Catalog</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start bg-cream-light border border-gold/15 p-6 sm:p-10 rounded-3xl shadow-sm">
        
        {/* Left Side: Product Image Display */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-cream-dark border border-gold/20 glow-gold">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {isOutOfStock && (
              <div className="absolute inset-0 bg-forest-dark/70 backdrop-blur-[2.5px] flex items-center justify-center">
                <span className="bg-cream/95 text-forest font-sans font-bold text-sm uppercase tracking-widest px-6 py-3 rounded-full border border-gold/40 shadow-xl">
                  Sold Out
                </span>
              </div>
            )}
          </div>

          {/* Sourcing Badge */}
          <div className="bg-forest text-cream p-4 rounded-xl border border-gold/30 flex items-start gap-3">
            <Award className="w-5 h-5 text-gold shrink-0 mt-0.5 animate-bounce" />
            <div>
              <p className="text-sm font-serif font-bold text-gold-light">Ethically Harvested in Africa</p>
              <p className="text-xs text-cream-light/80 leading-relaxed mt-0.5">
                We work directly with rural female farming collectives, providing living wages and organic sustainability training.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Product Details */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-2">
            {/* Category tag */}
            <span className="inline-block bg-gold/15 border border-gold/30 text-gold-dark text-[11px] font-sans font-bold tracking-widest uppercase px-3.5 py-1 rounded-full">
              {product.category}
            </span>

            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-forest leading-tight">
              {product.name}
            </h1>

            {/* Sub-header: rating, size & stock */}
            <div className="flex flex-wrap items-center gap-6 pt-1 text-sm">
              <div className="flex items-center gap-1.5 text-gold">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating || 5.0) ? 'fill-gold' : 'text-gray-300'
                      }`} 
                    />
                  ))}
                </div>
                <span className="font-sans font-bold text-forest-dark">{product.rating || 5.0}</span>
                <span className="text-forest/60">({product.reviewsCount || 10} reviews)</span>
              </div>

              <span className="h-4 w-px bg-gold/35"></span>

              <span className="font-sans text-forest/75 font-semibold">
                Size: <span className="text-gold-dark font-serif italic font-bold">{product.size || 'Standard Size'}</span>
              </span>

              <span className="h-4 w-px bg-gold/35"></span>

              {isOutOfStock ? (
                <span className="text-red-600 font-sans font-bold flex items-center gap-1">
                  <ShieldAlert className="w-4 h-4" /> Temporarily Out of Stock
                </span>
              ) : isLowStock ? (
                <span className="text-amber-600 font-sans font-bold flex items-center gap-1">
                  <ShieldAlert className="w-4 h-4" /> Low Stock ({Math.floor(Math.random() * 5) + 2} left)
                </span>
              ) : (
                <span className="text-emerald-700 font-sans font-bold flex items-center gap-1">
                  <Check className="w-4 h-4" /> Fully In Stock
                </span>
              )}
            </div>
          </div>

          {/* Pricing Box */}
          <div className="bg-gold/10 p-4 rounded-xl border border-gold/15 flex items-center justify-between">
            <div>
              <span className="block text-xs text-forest/60 uppercase tracking-widest font-sans font-medium">Price per unit</span>
              <span className="text-2xl sm:text-3xl font-serif font-bold text-forest-dark">{formatPrice(product.price)}</span>
            </div>
            
            {/* Paystack exchange reference (Nigeria currency) */}
            <div className="text-right border-l border-gold/25 pl-4">
              <span className="block text-[10px] text-forest/60 uppercase tracking-wider font-sans font-medium">Payment Secure</span>
              <span className="text-sm font-sans font-bold text-gold-dark">Paystack / Card</span>
              <span className="block text-[8px] text-forest/50">Processed in local NGN currency</span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-base font-sans font-bold tracking-widest text-forest uppercase">Product Profile</h3>
            <p className="text-forest/85 leading-relaxed text-base">
              {product.description}
            </p>
          </div>

          {/* Ingredients list */}
          <div className="bg-cream p-5 rounded-2xl border border-gold/15 space-y-3">
            <div className="flex items-center gap-1.5 text-forest font-sans font-bold text-sm tracking-widest uppercase">
              <Sparkles className="w-4 h-4 text-gold" />
              <span>Full Raw Ingredients</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.ingredients.map((ingredient) => (
                <span 
                  key={ingredient}
                  className="bg-forest-dark/5 text-forest text-xs px-3 py-1.5 rounded-full border border-gold/10 font-sans"
                >
                  {ingredient}
                </span>
              ))}
            </div>
          </div>

          {/* Usage Instructions */}
          {product.usage && (
            <div className="space-y-2">
              <h3 className="text-base font-sans font-bold tracking-widest text-forest uppercase">Ritual & Usage Guide</h3>
              <p className="text-forest/80 text-sm leading-relaxed border-l-2 border-gold pl-4 italic">
                {product.usage}
              </p>
            </div>
          )}

          {/* Skin Type Suitability */}
          <div className="space-y-2">
            <h4 className="text-xs font-sans font-bold tracking-wider text-forest/60 uppercase">Ideal Skin Suitability</h4>
            <div className="flex gap-2">
              {product.skinTypes.map((type) => (
                <span 
                  key={type} 
                  className="bg-forest/10 text-forest-dark font-sans font-semibold text-xs px-3 py-1 rounded"
                >
                  {type}
                </span>
              ))}
            </div>
          </div>

          {/* Interactive Buy Section */}
          {!isOutOfStock && (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4 border-t border-gold/10">
              <div className="flex items-center justify-between border border-gold/30 rounded-full h-14 px-4 bg-cream">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-forest font-bold hover:bg-gold/20 transition-colors"
                  id="detail-qty-minus"
                >
                  -
                </button>
                <span className="font-sans font-bold text-lg text-forest-dark px-4">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-forest font-bold hover:bg-gold/20 transition-colors"
                  id="detail-qty-plus"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAdd}
                className="flex-grow h-14 bg-forest hover:bg-forest-light text-gold-light rounded-full font-sans font-bold text-base shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-3 cursor-pointer"
                id="detail-add-to-cart"
              >
                {added ? (
                  <>
                    <Check className="w-5.5 h-5.5 animate-bounce text-gold" />
                    <span>Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5.5 h-5.5" />
                    <span>Add to Shopping Bag • {formatPrice(product.price * quantity)}</span>
                  </>
                )}
              </button>
            </div>
          )}

          <div className="pt-4 mt-2">
            <a
              href={`https://wa.me/2349167592135?text=${encodeURIComponent(`Hi Heritage Naturals, I'd like to order ${product.name} - ${formatPrice(product.price)}`)}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-sans font-bold text-sm shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer animate-pulse"
              id="detail-whatsapp-order"
            >
              <MessageSquare className="w-5 h-5" />
              <span>Order on WhatsApp</span>
            </a>
          </div>

        </div>
      </div>

      {/* Related Products Section */}
      <div className="mt-16 space-y-6" id="related-products-section">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-forest">You May Also Appreciate</h2>
          <span className="h-px bg-gold/25 flex-grow"></span>
          <Leaf className="w-5 h-5 text-gold shrink-0" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {relatedProducts.map((p) => (
            <div 
              key={p.id}
              onClick={() => {
                onViewProduct(p);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="bg-cream-light border border-gold/10 p-4 rounded-xl cursor-pointer hover:border-gold/40 hover:shadow-md transition-all duration-300"
              id={`related-product-${p.id}`}
            >
              <img 
                src={p.image} 
                alt={p.name} 
                className="w-full aspect-[4/3] object-cover rounded-lg bg-cream"
                referrerPolicy="no-referrer"
              />
              <div className="mt-3 space-y-1">
                <span className="text-[9px] font-sans text-gold-dark uppercase tracking-widest block">{p.category}</span>
                <h4 className="font-serif font-bold text-base text-forest line-clamp-1">{p.name}</h4>
                <p className="font-sans font-bold text-sm text-forest-dark">{formatPrice(p.price)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
