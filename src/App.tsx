import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import ProductDetails from './components/ProductDetails';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import About from './components/About';
import Contact from './components/Contact';
import Admin from './components/Admin';
import { Product, CartItem, ShippingDetails, Order } from './types';
import { INITIAL_PRODUCTS } from './productsData';
import { Leaf, Search, Star, MessageSquare, ArrowRight, Check, Sparkles } from 'lucide-react';

export default function App() {
  // Navigation & Page state
  const [currentTab, setCurrentTab] = useState<string>('home'); // 'home', 'shop', 'about', 'contact', 'admin', 'checkout'
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // App static product & order data state (defaults to hardcoded INITIAL_PRODUCTS)
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('hn_products');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error reading hn_products from localStorage', e);
    }
    return INITIAL_PRODUCTS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('hn_orders');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error reading hn_orders from localStorage', e);
    }
    return [];
  });

  const [loading, setLoading] = useState<boolean>(false);

  // Cart state (persisted in session)
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = sessionStorage.getItem('hn_cart_items');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [cartOpen, setCartOpen] = useState<boolean>(false);

  // Shop Page Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedSkinType, setSelectedSkinType] = useState<string>('All');

  // Sync products and orders to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('hn_products', JSON.stringify(products));
    } catch (e) {
      console.error('Failed to save products to localStorage', e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem('hn_orders', JSON.stringify(orders));
    } catch (e) {
      console.error('Failed to save orders to localStorage', e);
    }
  }, [orders]);

  // Optional server sync when API endpoint is available
  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setProducts(data);
        }
      }
    } catch (err) {
      // Static mode on Vercel or local preview without backend API
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setOrders(data);
        }
      }
    } catch (err) {
      // Static mode on Vercel or local preview without backend API
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  // Sync cart items to session storage on update
  useEffect(() => {
    sessionStorage.setItem('hn_cart_items', JSON.stringify(cartItems));
  }, [cartItems]);

  // Cart actions
  const handleAddToCart = (product: Product, quantity: number = 1) => {
    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => item.product.id === product.id);
      if (existing) {
        return prevItems.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevItems, { product, quantity }];
    });
    setCartOpen(true); // Open cart immediately for beautiful instant checkout feedback
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.product.id !== productId));
  };

  // Place Order API Integration with fallback to local client state
  const handlePlaceOrder = async (details: ShippingDetails, paymentMethod: string) => {
    const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    const shippingFee = details.country === 'Nigeria' ? 1500 : 15000;
    const total = subtotal + shippingFee;

    const newOrder: Order = {
      id: `HN-${Math.floor(100000 + Math.random() * 900000)}`,
      items: [...cartItems],
      subtotal,
      shippingFee,
      total,
      shippingDetails: details,
      paymentMethod,
      paymentReference: `PAY-${Math.floor(100000 + Math.random() * 900000)}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    // Save order locally first
    setOrders((prev) => [newOrder, ...prev]);
    setCartItems([]); // Clear cart

    // Try posting to API if available
    try {
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cartItems,
          subtotal,
          shippingFee,
          total,
          shippingDetails: details,
          paymentMethod,
        }),
      });
    } catch (err) {
      console.log('Background order sync skipped in static deployment mode:', err);
    }

    return newOrder;
  };

  // Admin APIs with fallback to local state
  const handleAddProduct = async (prod: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...prod,
      id: `custom-${Date.now()}`,
      rating: 5.0,
      reviewsCount: 0,
    };
    setProducts((prev) => [...prev, newProduct]);

    try {
      await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prod),
      });
    } catch (err) {
      console.log('Static mode add product');
    }
  };

  const handleEditProduct = async (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );

    try {
      await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
    } catch (err) {
      console.log('Static mode edit product');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));

    try {
      await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });
    } catch (err) {
      console.log('Static mode delete product');
    }
  };

  const handleUpdateOrderStatus = async (id: string, status: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: status as Order['status'] } : o))
    );

    try {
      await fetch(`/api/orders/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
    } catch (err) {
      console.log('Static mode update order status');
    }
  };

  const handleResetStore = async () => {
    setProducts(INITIAL_PRODUCTS);
    setOrders([]);
    try {
      localStorage.removeItem('hn_products');
      localStorage.removeItem('hn_orders');
    } catch (e) {
      console.error(e);
    }

    try {
      await fetch('/api/admin/reset', { method: 'POST' });
    } catch (err) {
      console.log('Static mode reset store');
    }
  };

  // Categories list based on specs
  const categories = [
    'All',
    'Ori (Shea Butter)',
    'Black Soap',
    'Herbal Face Masks',
    'Body Scrub',
    'Herbal Bath Soak',
    'Facial Oils',
    'Turmeric Soap',
  ];

  // Skin types for filtering
  const skinTypes = [
    'All',
    'Dry',
    'Oily',
    'Combination',
    'Sensitive',
    'Mature',
    'Eczema-Prone',
    'Acne-Prone',
  ];

  // Shop Filter Logic
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;

    const matchesSkinType =
      selectedSkinType === 'All' ||
      product.skinTypes.some((t) => t.toLowerCase() === selectedSkinType.toLowerCase()) ||
      product.skinTypes.some((t) => t.toLowerCase() === 'all skin types');

    return matchesSearch && matchesCategory && matchesSkinType;
  });

  const featuredProducts = products.filter((p) => p.featured);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-cream flex flex-col justify-between" id="app-root-layout">
      
      {/* HEADER COMPONENT */}
      <Header
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          setCurrentTab(tab);
          setSelectedProduct(null); // Clear selected product when navigating tabs
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        cartCount={cartCount}
        openCart={() => setCartOpen(true)}
      />

      {/* MAIN VIEW CONTENT CONTAINER */}
      <main className="flex-grow">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="w-12 h-12 border-4 border-gold/30 border-t-forest rounded-full animate-spin"></div>
            <p className="font-serif italic text-forest text-base">Summoning Traditional Apothecary...</p>
          </div>
        ) : selectedProduct ? (
          /* PRODUCT DETAILS SUBPAGE */
          <ProductDetails
            product={selectedProduct}
            allProducts={products}
            onBack={() => setSelectedProduct(null)}
            onAddToCart={(prod, qty) => handleAddToCart(prod, qty)}
            onViewProduct={(prod) => setSelectedProduct(prod)}
          />
        ) : (
          /* PRIMARY CORE TABVIEWS */
          <div className="animate-fadeIn">
            
            {/* 1. HOMEPAGE VIEW */}
            {currentTab === 'home' && (
              <div className="space-y-16 pb-16">
                <Hero
                  onShopClick={() => {
                    setCurrentTab('shop');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  onStoryClick={() => {
                    setCurrentTab('about');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />

                {/* Featured Products */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8" id="featured-homepage-section">
                  <div className="text-center space-y-2">
                    <span className="text-xs uppercase tracking-[0.2em] font-sans font-bold text-gold-dark">Sourced Ingredients</span>
                    <h2 className="text-3xl sm:text-4xl font-serif font-bold text-forest">The Curated Featured Remedies</h2>
                    <div className="h-px bg-gold/30 max-w-[200px] mx-auto"></div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {featuredProducts.slice(0, 4).map((p) => (
                      <ProductCard
                        key={p.id}
                        product={p}
                        onViewDetails={(prod) => setSelectedProduct(prod)}
                        onAddToCart={(prod, e) => {
                          e.stopPropagation();
                          handleAddToCart(prod, 1);
                        }}
                      />
                    ))}
                  </div>

                  <div className="text-center pt-4">
                    <button
                      onClick={() => {
                        setCurrentTab('shop');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="inline-flex items-center gap-2 px-8 py-3.5 border border-forest hover:bg-forest hover:text-gold-light text-forest font-sans font-bold text-sm rounded-full transition-all duration-300"
                    >
                      <span>Explore Full Apothecary Catalog</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Sourcing/Co-op brand teaser section */}
                <div className="bg-forest-dark text-cream-light py-16 relative overflow-hidden" id="homepage-coop-teaser">
                  <div className="absolute inset-0 opacity-10 pointer-events-none botanical-pattern"></div>
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    
                    <div className="lg:col-span-6 space-y-6">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/15 border border-gold/35 text-gold-light text-xs font-semibold uppercase tracking-wider">
                        <Sparkles className="w-3 h-3" />
                        <span>Empowered Botanicals</span>
                      </div>
                      <h3 className="text-3xl sm:text-4xl font-serif font-bold text-cream-light">
                        Ethically Sourced. Purely Wild-Harvested.
                      </h3>
                      <p className="text-cream-light/80 leading-relaxed font-light">
                        Every container of whipped Ori, black soap, and facial nectar carries the stories of women cooperatives across West Africa. We preserve biological integrity by choosing cold-pressed unrefined extraction methods that retain full active vitamins.
                      </p>
                      
                      <div className="grid grid-cols-2 gap-4 text-xs font-sans">
                        <div className="flex gap-2">
                          <Check className="w-4.5 h-4.5 text-gold shrink-0" />
                          <span>No Parabens or Sulfates</span>
                        </div>
                        <div className="flex gap-2">
                          <Check className="w-4.5 h-4.5 text-gold shrink-0" />
                          <span>Fair Wage Sourcing Guaranteed</span>
                        </div>
                        <div className="flex gap-2">
                          <Check className="w-4.5 h-4.5 text-gold shrink-0" />
                          <span>Pure Cold-Pressed Oils</span>
                        </div>
                        <div className="flex gap-2">
                          <Check className="w-4.5 h-4.5 text-gold shrink-0" />
                          <span>Eco-Friendly Biodegradable Glass</span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setCurrentTab('about');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="px-6 py-3 bg-gold hover:bg-gold-light text-forest-dark font-sans font-bold text-xs rounded-full shadow transition-all duration-300"
                      >
                        Read Our Full Story
                      </button>
                    </div>

                    <div className="lg:col-span-6 flex justify-center">
                      <div className="relative p-2 border border-gold/25 rounded-2xl overflow-hidden bg-forest/40 max-w-sm">
                        <img 
                          src="https://images.unsplash.com/photo-1601049676099-e7ed07d825b0?auto=format&fit=crop&q=80&w=600" 
                          alt="Authentic botanical raw ingredients" 
                          className="rounded-xl w-full h-80 object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    </div>

                  </div>
                </div>

                {/* Quick interactive Consultation banner */}
                <div className="max-w-4xl mx-auto px-4 text-center space-y-6" id="homepage-consultation-banner">
                  <div className="bg-cream-dark p-8 sm:p-12 rounded-3xl border border-gold/30 shadow-md space-y-4">
                    <Leaf className="w-8 h-8 text-gold mx-auto" />
                    <h3 className="text-2xl sm:text-3xl font-serif font-bold text-forest">Not sure which organic remedy matches your skin profile?</h3>
                    <p className="text-sm text-forest/75 max-w-lg mx-auto font-light">
                      Submit a direct consultation inquiry to our lead herbalist. Get a personalized routine matching your skin suitability context.
                    </p>
                    <button
                      onClick={() => {
                        setCurrentTab('contact');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="px-6 py-3 bg-forest hover:bg-forest-light text-gold-light font-sans font-bold text-xs rounded-full shadow transition-all"
                    >
                      Connect for Free Advice
                    </button>
                  </div>
                </div>

              </div>
            )}

            {/* 2. SHOP CATALOGUE VIEW */}
            {currentTab === 'shop' && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10" id="shop-page-view">
                
                {/* Headers block */}
                <div className="text-center max-w-2xl mx-auto space-y-3">
                  <h1 className="text-4xl font-serif font-bold text-forest">The Botanical Apothecary</h1>
                  <p className="text-sm text-forest/70">
                    Handcrafted traditional remedies formulated using pure, bio-active Nigerian botanical oils and mineral-rich clays.
                  </p>
                </div>

                {/* Filters sidebar / panels control */}
                <div className="bg-cream-light border border-gold/20 p-6 rounded-2xl shadow-sm space-y-6">
                  
                  {/* Search and Skin Type selectors row */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    
                    {/* Search Input bar */}
                    <div className="md:col-span-7 relative">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-dark" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search for whipped Ori, liquid black soap, ingredients..."
                        className="w-full h-11 pl-10 pr-4 bg-cream border border-gold/25 rounded-lg focus:outline-none focus:ring-1 focus:ring-gold text-sm text-forest-dark"
                        id="shop-search-input"
                      />
                    </div>

                    {/* Skin type dropdown */}
                    <div className="md:col-span-5 flex items-center gap-2">
                      <span className="text-xs font-sans font-bold uppercase tracking-wider text-forest/65 shrink-0">Skin Suitability:</span>
                      <select
                        value={selectedSkinType}
                        onChange={(e) => setSelectedSkinType(e.target.value)}
                        className="flex-grow h-11 px-3 bg-cream border border-gold/25 rounded-lg focus:outline-none focus:ring-1 focus:ring-gold text-sm text-forest-dark"
                        id="shop-skintype-select"
                      >
                        {skinTypes.map((type) => (
                          <option key={type} value={type}>
                            {type === 'All' ? 'All Skin Types' : `${type} Skin`}
                          </option>
                        ))}
                      </select>
                    </div>

                  </div>

                  {/* Categories Pills selector row */}
                  <div className="space-y-2 border-t border-gold/10 pt-4">
                    <span className="text-xs font-sans font-bold uppercase tracking-wider text-forest/65 block">Category Filter:</span>
                    <div className="flex flex-wrap gap-2" id="shop-category-pills">
                      {categories.map((cat) => {
                        const isActive = selectedCategory === cat;
                        return (
                          <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                              isActive
                                ? 'bg-forest text-gold-light font-bold shadow-sm'
                                : 'bg-cream text-forest/80 border border-gold/15 hover:border-gold/45 hover:bg-gold/5'
                            }`}
                            id={`category-pill-${cat.replace(/\s+/g, '-').toLowerCase()}`}
                          >
                            {cat}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                </div>

                {/* Grid result info counter */}
                <div className="flex justify-between items-center text-sm font-sans text-forest/70 border-b border-gold/10 pb-3">
                  <span>Showing <span className="font-bold text-forest-dark">{filteredProducts.length}</span> botanicals matching filters</span>
                  {(searchQuery || selectedCategory !== 'All' || selectedSkinType !== 'All') && (
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategory('All');
                        setSelectedSkinType('All');
                      }}
                      className="text-gold-dark hover:text-forest underline text-xs font-semibold"
                    >
                      Clear All Filters
                    </button>
                  )}
                </div>

                {/* Product Catalogue Grid */}
                {filteredProducts.length === 0 ? (
                  <div className="py-20 text-center space-y-4 max-w-md mx-auto" id="shop-empty-results">
                    <Leaf className="w-12 h-12 text-gold mx-auto animate-spin" />
                    <div>
                      <h3 className="font-serif text-lg font-bold text-forest">No Remedies Found</h3>
                      <p className="text-xs text-forest/75 mt-1">Adjust search metrics or categories filters to locate desired skin solutions.</p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredProducts.map((p) => (
                      <ProductCard
                        key={p.id}
                        product={p}
                        onViewDetails={(prod) => setSelectedProduct(prod)}
                        onAddToCart={(prod, e) => {
                          e.stopPropagation();
                          handleAddToCart(prod, 1);
                        }}
                      />
                    ))}
                  </div>
                )}

              </div>
            )}

            {/* 3. ABOUT US VIEW */}
            {currentTab === 'about' && <About />}

            {/* 4. CONTACT CORRESPONDENCE VIEW */}
            {currentTab === 'contact' && <Contact />}

            {/* 5. BACKEND CONTROL PLANE VIEW */}
            {currentTab === 'admin' && (
              <Admin
                products={products}
                orders={orders}
                onRefreshData={async () => {
                  await Promise.all([fetchProducts(), fetchOrders()]);
                }}
                onAddProduct={handleAddProduct}
                onEditProduct={handleEditProduct}
                onDeleteProduct={handleDeleteProduct}
                onResetStore={handleResetStore}
                onUpdateOrderStatus={handleUpdateOrderStatus}
              />
            )}

            {/* 6. SECURE CHECKOUT SUBPAGE */}
            {currentTab === 'checkout' && (
              <Checkout
                cartItems={cartItems}
                onBackToShop={() => setCurrentTab('shop')}
                onPlaceOrder={handlePlaceOrder}
              />
            )}

          </div>
        )}
      </main>

      {/* FOOTER AREA */}
      <footer className="bg-forest-dark text-cream border-t border-gold/20 py-12" id="app-footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Logo Brand summary block */}
          <div className="space-y-4 col-span-1 md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gold flex items-center justify-center text-forest shadow">
                <Leaf className="w-5 h-5" />
              </div>
              <div>
                <span className="block font-serif text-xl font-bold tracking-wider text-cream-light leading-none">HERITAGE NATURALS</span>
                <span className="block text-[8px] font-sans uppercase tracking-widest text-gold mt-1">Pure Tradition, Natural Glow • Est. 2024</span>
              </div>
            </div>
            <p className="text-xs text-cream-light/70 max-w-md font-light leading-relaxed">
              Formulated to preserve traditional skincare heritages from West Africa. Sourcing unrefined shea, camwood, cocoa, and botanicals ethically to bring out your skin's biological glow.
            </p>
          </div>

          {/* Quick links list */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-gold text-sm tracking-widest uppercase">Navigation Slices</h4>
            <div className="flex flex-col space-y-2 text-xs text-cream-light/80 font-sans">
              <button onClick={() => { setCurrentTab('home'); setSelectedProduct(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-left hover:text-gold transition-colors">Home</button>
              <button onClick={() => { setCurrentTab('shop'); setSelectedProduct(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-left hover:text-gold transition-colors">Shop Catalog</button>
              <button onClick={() => { setCurrentTab('about'); setSelectedProduct(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-left hover:text-gold transition-colors">Our Story</button>
              <button onClick={() => { setCurrentTab('contact'); setSelectedProduct(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-left hover:text-gold transition-colors">Get in Touch</button>
              <button onClick={() => { setCurrentTab('admin'); setSelectedProduct(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-left hover:text-gold transition-colors">Admin Backend</button>
            </div>
          </div>

          {/* Contact Details footer list */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-gold text-sm tracking-widest uppercase">Correspondence</h4>
            <div className="space-y-2 text-xs text-cream-light/80 font-sans">
              <p>Mile 6, Agbedejobi Street, Abeokuta, Ogun State, Nigeria</p>
              <p>Hotline: 09167592135</p>
              <p>Email: <a href="mailto:care@heritagenaturals.com" className="hover:underline text-gold-light">care@heritagenaturals.com</a></p>
            </div>
          </div>

        </div>

        {/* Bottom credits and copyright */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-cream/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-cream-light/50 font-sans">
          <p>© {new Date().getFullYear()} Heritage Naturals. Preserving Organic Lineages. All rights reserved.</p>
          <div className="flex gap-4">
            <span>Paystack Protected</span>
            <span>Flutterwave Integration Point</span>
            <span>Worldwide Logistics</span>
          </div>
        </div>
      </footer>

      {/* DRAWER SLIDEOUT CART TRIGGER */}
      <Cart
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={() => setCurrentTab('checkout')}
      />

    </div>
  );
}
