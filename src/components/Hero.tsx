import React from 'react';
import { ArrowRight, Leaf, Sparkles, Star } from 'lucide-react';

interface HeroProps {
  onShopClick: () => void;
  onStoryClick: () => void;
}

export default function Hero({ onShopClick, onStoryClick }: HeroProps) {
  return (
    <div className="relative overflow-hidden bg-forest text-cream py-16 sm:py-24 lg:py-32" id="hero-section">
      
      {/* Decorative Botanical Vines & Gradients */}
      <div className="absolute inset-0 opacity-15 pointer-events-none select-none">
        {/* Top-Right Vine Emblem SVG */}
        <svg className="absolute top-0 right-0 w-80 h-80 text-gold" viewBox="0 0 100 100" fill="currentColor">
          <path d="M50 0 C40 15, 60 30, 50 45 C40 30, 60 15, 50 0 Z M50 45 C40 60, 60 75, 50 90 C40 75, 60 60, 50 45 Z" />
          <path d="M10 20 C20 30, 30 20, 40 40 C30 50, 20 40, 10 20 Z" />
          <path d="M90 20 C80 30, 70 20, 60 40 C70 50, 80 40, 90 20 Z" />
        </svg>
        {/* Bottom-Left Leaf Motif SVG */}
        <svg className="absolute bottom-0 left-0 w-96 h-96 text-gold" viewBox="0 0 100 100" fill="currentColor">
          <circle cx="20" cy="80" r="15" fill="none" stroke="currentColor" strokeWidth="1" />
          <path d="M0 100 Q 30 70 80 80 T 100 0" fill="none" stroke="currentColor" strokeWidth="0.5" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero text */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold/15 border border-gold/30 text-gold-light text-xs font-semibold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Authentic African Apothecary</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold tracking-tight text-cream-light leading-[1.1]">
                Nourish Your Skin with <br />
                <span className="text-gold italic font-normal">Ancient Botanical Secrets</span>
              </h1>
              
              {/* Botanical Divider */}
              <div className="space-y-1">
                <div className="flex items-center justify-center lg:justify-start gap-4 py-1">
                  <span className="h-px w-12 bg-gold/50"></span>
                  <Leaf className="w-4 h-4 text-gold shrink-0" />
                  <span className="text-gold font-serif italic text-lg sm:text-xl tracking-wider">Pure Tradition, Natural Glow</span>
                  <Leaf className="w-4 h-4 text-gold shrink-0 transform scale-x-[-1]" />
                  <span className="h-px w-12 bg-gold/50"></span>
                </div>
                <div className="text-xs uppercase tracking-[0.25em] text-cream-light/60 font-sans font-medium lg:text-left text-center lg:pl-16">
                  Pure. Natural. Radiant.
                </div>
              </div>
            </div>

            <p className="text-cream-light/80 text-lg sm:text-xl font-light leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Heritage Naturals restores your skin’s biological glow. Handcrafted using premium unrefined cold-pressed oils, wild-harvested botanicals, and traditional recipes preserved over generations. Est. 2024.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                onClick={onShopClick}
                className="group flex items-center justify-center gap-2 px-8 py-4 bg-gold hover:bg-gold-light text-forest-dark font-sans font-bold text-base rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
                id="hero-shop-cta"
              >
                <span>Shop the Collection</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button
                onClick={onStoryClick}
                className="flex items-center justify-center px-8 py-4 border border-cream/30 hover:border-gold hover:bg-white/5 text-cream font-sans font-medium text-base rounded-full transition-all duration-300"
                id="hero-story-cta"
              >
                Our Botanical Heritage
              </button>
            </div>

            {/* Micro-Trust Signals */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-cream/10 max-w-md mx-auto lg:mx-0">
              <div className="text-center lg:text-left">
                <span className="block text-xl sm:text-2xl font-serif font-bold text-gold">100%</span>
                <span className="block text-xs text-cream/70 font-sans tracking-wide">Wild-Harvested</span>
              </div>
              <div className="text-center lg:text-left">
                <span className="block text-xl sm:text-2xl font-serif font-bold text-gold">Ethical</span>
                <span className="block text-xs text-cream/70 font-sans tracking-wide">Co-op Sourced</span>
              </div>
              <div className="text-center lg:text-left">
                <span className="block text-xl sm:text-2xl font-serif font-bold text-gold">Cruelty</span>
                <span className="block text-xs text-cream/70 font-sans tracking-wide">Free & Organic</span>
              </div>
            </div>
          </div>

          {/* Hero Product Artwork Display */}
          <div className="lg:col-span-5 relative flex justify-center items-center">
            {/* Elegant outer layout frame */}
            <div className="relative w-72 sm:w-80 md:w-96 aspect-square rounded-[2rem] border-2 border-gold/40 p-4 shadow-2xl bg-forest-dark/30 backdrop-blur-md overflow-hidden glow-gold">
              
              {/* Luxury Image with subtle gold corners */}
              <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-gold m-6"></div>
              <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-gold m-6"></div>
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-gold m-6"></div>
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-gold m-6"></div>

              <img 
                src="/images/shea_butter_jar_1784483461841.jpg" 
                alt="Heritage Naturals Premium Whipped Shea Butter" 
                className="w-full h-full object-cover rounded-[1.5rem] mix-blend-normal opacity-95 filter brightness-105"
                referrerPolicy="no-referrer"
              />
              
              {/* Absolute Badge on hero illustration */}
              <div className="absolute bottom-8 right-8 bg-cream/95 text-forest border border-gold/40 p-3 rounded-xl shadow-lg backdrop-blur-sm max-w-[160px] animate-bounce">
                <div className="flex gap-1 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-gold text-gold" />
                  ))}
                </div>
                <p className="text-[11px] font-sans font-bold leading-tight">"Instantly transformed my dry eczema patches."</p>
                <span className="text-[9px] text-gold-dark font-sans font-medium uppercase tracking-wider block mt-1">— Adebayo O.</span>
              </div>
            </div>
          </div>

        </div>
      </div>
      
      {/* Wave bottom flourish line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold to-transparent"></div>
    </div>
  );
}
