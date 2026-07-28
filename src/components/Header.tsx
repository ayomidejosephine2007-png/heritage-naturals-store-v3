import React, { useState } from 'react';
import { ShoppingBag, Menu, X, Settings, Leaf } from 'lucide-react';

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  cartCount: number;
  openCart: () => void;
}

export default function Header({ currentTab, setCurrentTab, cartCount, openCart }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'shop', label: 'Shop Catalog' },
    { id: 'about', label: 'Our Story' },
    { id: 'contact', label: 'Get in Touch' },
    { id: 'admin', label: 'Admin Panel', icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-cream/95 backdrop-blur-md border-b border-gold/20 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo Brand Area */}
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => { setCurrentTab('home'); setMobileMenuOpen(false); }}
            id="header-brand-logo"
          >
            <div className="relative flex items-center justify-center w-11 h-11 rounded-full border border-gold/40 bg-forest text-gold shadow-md group-hover:border-gold transition-colors duration-300">
              <Leaf className="w-5.5 h-5.5 animate-pulse" />
              <div className="absolute inset-0.5 rounded-full border border-dashed border-gold/20"></div>
            </div>
            <div>
              <span className="block font-serif text-2xl font-bold tracking-wider text-forest leading-tight group-hover:text-forest-light transition-colors duration-300">
                HERITAGE NATURALS
              </span>
              <span className="block text-[9px] font-sans uppercase tracking-[0.05em] text-gold font-semibold -mt-1">
                Pure Tradition, Natural Glow
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1 lg:space-x-2" id="desktop-nav">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-forest text-gold-light shadow-sm font-semibold'
                      : 'text-forest/85 hover:text-forest hover:bg-gold/10'
                  }`}
                  id={`nav-link-${item.id}`}
                >
                  {Icon && <Icon className="w-3.5 h-3.5" />}
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-4" id="header-actions">
            {/* Cart Button */}
            <button
              onClick={openCart}
              className="relative p-2.5 rounded-full text-forest hover:bg-gold/15 transition-all duration-300 border border-gold/20 hover:scale-105 active:scale-95"
              aria-label="Open Cart"
              id="header-cart-button"
            >
              <ShoppingBag className="w-5.5 h-5.5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gold text-forest-dark font-sans font-bold text-xs w-5 h-5 rounded-full flex items-center justify-center animate-bounce shadow-md">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-full text-forest hover:bg-gold/15 transition-all duration-300 border border-gold/10"
              aria-label="Toggle menu"
              id="header-mobile-toggle"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-cream border-t border-gold/20 animate-fadeIn" id="mobile-nav">
          <div className="px-2 pt-3 pb-6 space-y-1 sm:px-3">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 flex items-center gap-2 ${
                    isActive
                      ? 'bg-forest text-gold-light font-bold'
                      : 'text-forest/80 hover:text-forest hover:bg-gold/10'
                  }`}
                  id={`mobile-nav-link-${item.id}`}
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
