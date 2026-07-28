import React from 'react';
import { Leaf, Award, Sparkles, Star, Users } from 'lucide-react';

export default function About() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16" id="about-us-page">
      
      {/* Intro Section with decorative leaf */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold/15 border border-gold/30 text-gold-dark text-xs font-semibold tracking-wider uppercase">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Our Sacred Lineage</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-forest leading-tight">
          Crafting Botanical Luxury Since 2024
        </h1>
        <div className="flex items-center justify-center gap-2 text-gold">
          <span className="h-px w-10 bg-gold/30"></span>
          <Leaf className="w-4 h-4" />
          <span className="font-serif italic text-sm font-semibold tracking-wider">Traditional African Apothecary</span>
          <Leaf className="w-4 h-4 transform scale-x-[-1]" />
          <span className="h-px w-10 bg-gold/30"></span>
        </div>
        <p className="text-lg text-forest/80 font-light leading-relaxed">
          At Heritage Naturals, we preserve the traditional skincare rituals passed down through generations of West African artisans. Our formulas represent the pinnacle of organic biological performance, utilizing wild-harvested raw ingredients.
        </p>
      </div>

      {/* Two column Brand Legacy and Sourcing */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left column Illustration */}
        <div className="lg:col-span-5 relative flex justify-center">
          <div className="relative w-80 sm:w-96 aspect-[3/4] rounded-3xl border-2 border-gold/30 p-4 shadow-xl overflow-hidden glow-gold bg-forest-dark/10">
            <img 
              src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=600" 
              alt="Traditional Shea Butter sourcing" 
              className="w-full h-full object-cover rounded-2xl filter brightness-95"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-forest/80 via-transparent to-transparent"></div>
            
            {/* Overlay Quote */}
            <div className="absolute bottom-6 left-6 right-6 text-cream-light text-center">
              <span className="block text-xl sm:text-2xl font-serif text-gold-light italic">"Pure Tradition, Natural Glow"</span>
              <span className="block text-[10px] font-sans uppercase tracking-widest mt-1">Pure. Natural. Radiant.</span>
            </div>
          </div>
        </div>

        {/* Right column Story */}
        <div className="lg:col-span-7 space-y-6">
          <h2 className="text-3xl font-serif font-bold text-forest">The Heritage Sourcing Ritual</h2>
          
          <p className="text-forest/85 leading-relaxed font-light">
            Before modern laboratories, African skincare relied on the sacred wisdom of indigenous apothecaries. For centuries, ingredients like <strong>Ori</strong> (unrefined shea butter), <strong>Osun</strong> (camwood powder), and saponified cocoa pods were meticulously combined to protect, hydrate, and cleanse the skin against environmental stressors.
          </p>

          <p className="text-forest/85 leading-relaxed font-light">
            Established in 2024, Heritage Naturals was born from a desire to bridge the gap between this ancient botanical lineage and contemporary luxury skincare. We believe your skin deserves nutrients in their most biochemically bio-available forms — meaning no synthetic fillers, no artificial fragrances, and no parabens.
          </p>

          {/* Sourcing pillars list */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <div className="bg-cream-light border border-gold/15 p-4 rounded-xl flex gap-3">
              <Users className="w-5 h-5 text-gold shrink-0 mt-0.5" />
              <div>
                <h4 className="font-serif font-bold text-forest text-sm">Women's Co-operatives</h4>
                <p className="text-xs text-forest/75 mt-0.5">We source raw shea butter directly from cooperatives in Northern Nigeria, paying three times the local wage market.</p>
              </div>
            </div>

            <div className="bg-cream-light border border-gold/15 p-4 rounded-xl flex gap-3">
              <Leaf className="w-5 h-5 text-gold shrink-0 mt-0.5" />
              <div>
                <h4 className="font-serif font-bold text-forest text-sm">Biodynamic Harvesting</h4>
                <p className="text-xs text-forest/75 mt-0.5">We harvest cocoa pods, wild plantain, and marula kernels only during their natural peak cycles to guarantee high potency.</p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Testimonials Banner Grid */}
      <div className="bg-forest text-cream rounded-3xl p-8 sm:p-12 relative overflow-hidden" id="about-testimonials">
        <div className="absolute inset-0 opacity-10 pointer-events-none botanical-pattern"></div>
        
        <div className="relative z-10 space-y-8 text-center">
          <div className="max-w-2xl mx-auto space-y-2">
            <span className="text-xs uppercase tracking-widest text-gold font-sans font-bold">Community Affirmations</span>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold">Resonating With Radiant Skin</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            
            {/* Testimonial 1 */}
            <div className="bg-forest-dark/40 border border-gold/20 p-6 rounded-2xl space-y-4">
              <div className="flex text-gold">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-gold text-gold" />)}
              </div>
              <p className="text-xs sm:text-sm text-cream-light/80 italic font-light leading-relaxed">
                "The whipped shea butter is unlike anything else. It melts into my skin and doesn't feel heavy. My dry eczema patches on my knees are completely gone!"
              </p>
              <div>
                <span className="block font-serif text-sm text-gold-light">Nneka A.</span>
                <span className="block text-[10px] text-cream/50 uppercase tracking-widest">Verified Customer — Lagos</span>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-forest-dark/40 border border-gold/20 p-6 rounded-2xl space-y-4">
              <div className="flex text-gold">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-gold text-gold" />)}
              </div>
              <p className="text-xs sm:text-sm text-cream-light/80 italic font-light leading-relaxed">
                "I've struggled with adult acne and oily skin for years. The Gentle Liquid Black Soap combined with the Turmeric Soap has completely balanced my skin tone and reduced my breakouts."
              </p>
              <div>
                <span className="block font-serif text-sm text-gold-light">Kofi B.</span>
                <span className="block text-[10px] text-cream/50 uppercase tracking-widest">Verified Customer — Accra</span>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-forest-dark/40 border border-gold/20 p-6 rounded-2xl space-y-4">
              <div className="flex text-gold">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-gold text-gold" />)}
              </div>
              <p className="text-xs sm:text-sm text-cream-light/80 italic font-light leading-relaxed">
                "Marula oil is my ultimate holy grail. I use two drops every evening, and wake up with the most radiant, hydrated, and plump skin. Unbelievable natural quality."
              </p>
              <div>
                <span className="block font-serif text-sm text-gold-light">Seyi O.</span>
                <span className="block text-[10px] text-cream/50 uppercase tracking-widest">Verified Customer — London</span>
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}
