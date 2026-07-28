import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, MessageSquare } from 'lucide-react';
import { CartItem, formatPrice } from '../types';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onCheckout: () => void;
}

export default function Cart({ isOpen, onClose, cartItems, onUpdateQuantity, onRemoveItem, onCheckout }: CartProps) {
  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  const generateWhatsAppMessage = () => {
    let message = "Hi Heritage Naturals, I'd like to place an order:\n\n";
    cartItems.forEach(item => {
      message += `- ${item.quantity}x ${item.product.name} (${formatPrice(item.product.price * item.quantity)})\n`;
    });
    message += `\nTotal: ${formatPrice(subtotal)}`;
    return encodeURIComponent(message);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" id="shopping-cart-drawer">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-forest-dark/50 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      ></div>

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-cream border-l border-gold/25 shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="px-6 py-5 border-b border-gold/20 flex items-center justify-between bg-forest text-cream">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-gold" />
              <h2 className="font-serif text-xl font-bold tracking-wide">Your Botanical Bag</h2>
            </div>
            <button 
              onClick={onClose}
              className="p-1 rounded-full text-cream/70 hover:text-cream hover:bg-white/10 transition-colors"
              id="close-cart-btn"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center text-gold-dark border border-gold/20">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-serif text-lg font-bold text-forest">Your Bag is Empty</h3>
                  <p className="text-sm text-forest/70 max-w-xs">
                    Explore our botanical remedies and add premium traditional items to get started on your glow.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-forest text-gold-light rounded-full font-sans text-xs font-bold shadow-md hover:bg-forest-light transition-all"
                >
                  Explore Shop Catalog
                </button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div 
                  key={item.product.id}
                  className="flex gap-4 p-3 bg-cream-light border border-gold/10 rounded-xl hover:border-gold/20 transition-all"
                  id={`cart-item-${item.product.id}`}
                >
                  <img 
                    src={item.product.image} 
                    alt={item.product.name} 
                    className="w-16 h-16 object-cover rounded-lg bg-cream"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-serif font-bold text-sm text-forest truncate pr-2">{item.product.name}</h4>
                        <button
                          onClick={() => onRemoveItem(item.product.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                          id={`remove-cart-item-${item.product.id}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-[10px] font-sans text-gold-dark uppercase tracking-widest">{item.product.category}</p>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <div className="flex items-center gap-2 border border-gold/30 rounded-full px-2 py-0.5 bg-cream">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                          className="text-forest hover:text-gold-dark text-xs font-bold w-4 h-4"
                          id={`cart-minus-${item.product.id}`}
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-sans font-bold text-xs text-forest-dark min-w-[14px] text-center">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                          className="text-forest hover:text-gold-dark text-xs font-bold w-4 h-4"
                          id={`cart-plus-${item.product.id}`}
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="font-sans font-bold text-sm text-forest-dark">{formatPrice(item.product.price * item.quantity)}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary / Checkout action */}
          {cartItems.length > 0 && (
            <div className="border-t border-gold/20 p-6 bg-cream-light space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between text-sm text-forest/70 font-sans font-medium">
                  <span>Bag Subtotal</span>
                  <span className="text-forest-dark">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-xs text-forest/50 font-sans">
                  <span>Est. Nigeria Delivery Rate</span>
                  <span>Calculated at checkout</span>
                </div>
                <div className="flex justify-between text-sm pt-2 border-t border-dashed border-gold/20 font-serif font-bold text-forest">
                  <span>Est. Subtotal</span>
                  <span className="text-forest-dark text-lg">{formatPrice(subtotal)}</span>
                </div>
                <p className="text-[10px] text-gold-dark italic text-center font-sans pt-1">
                  Processed securely in Nigerian Naira (₦) via Paystack.
                </p>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onCheckout();
                }}
                className="w-full h-12 bg-forest hover:bg-forest-light text-gold-light rounded-full font-sans font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                id="cart-checkout-cta"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href={`https://wa.me/2349167592135?text=${generateWhatsAppMessage()}`}
                target="_blank"
                rel="noreferrer"
                className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-sans font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                id="cart-whatsapp-cta"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Complete Order via WhatsApp</span>
              </a>
              
              <button
                onClick={onClose}
                className="w-full text-center text-xs font-sans text-forest/70 hover:text-forest underline"
              >
                Continue Browsing Catalog
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
