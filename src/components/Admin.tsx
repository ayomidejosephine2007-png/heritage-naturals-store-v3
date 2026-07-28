import React, { useState, useEffect } from 'react';
import { Settings, Plus, RefreshCw, ShoppingBag, Edit, Trash2, Check, AlertCircle, Sparkles, Database, Save, LogIn } from 'lucide-react';
import { Product, Order, StockStatus, formatPrice } from '../types';

interface AdminProps {
  products: Product[];
  orders: Order[];
  onRefreshData: () => Promise<void>;
  onAddProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  onEditProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  onDeleteProduct: (id: string) => Promise<void>;
  onResetStore: () => Promise<void>;
  onUpdateOrderStatus: (orderId: string, status: string) => Promise<void>;
}

export default function Admin({
  products,
  orders,
  onRefreshData,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
  onResetStore,
  onUpdateOrderStatus
}: AdminProps) {
  const [isAdminAuthorized, setIsAdminAuthorized] = useState<boolean>(true); // For this demo, let's start authorized for user convenience, but with a mock toggle.
  const [activeSubTab, setActiveSubTab] = useState<'products' | 'orders' | 'add_product'>('orders');

  // Add Product Form State
  const [newProd, setNewProd] = useState<Omit<Product, 'id' | 'rating' | 'reviewsCount'>>({
    name: '',
    category: 'Ori (Shea Butter)',
    price: 0,
    description: '',
    ingredients: [''],
    skinTypes: ['All Skin Types'],
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=600',
    stockStatus: 'in_stock',
    size: '150g',
    usage: '',
  });

  // Editing Product state
  const [editingProdId, setEditingProdId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editStock, setEditStock] = useState<StockStatus>('in_stock');

  // Loading/Operation states
  const [isOperating, setIsOperating] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const handleAddIngredient = () => {
    setNewProd({ ...newProd, ingredients: [...newProd.ingredients, ''] });
  };

  const handleRemoveIngredient = (index: number) => {
    const list = [...newProd.ingredients];
    list.splice(index, 1);
    setNewProd({ ...newProd, ingredients: list });
  };

  const handleIngredientChange = (index: number, val: string) => {
    const list = [...newProd.ingredients];
    list[index] = val;
    setNewProd({ ...newProd, ingredients: list });
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProd.name.trim() || newProd.price <= 0 || !newProd.description.trim()) {
      alert('Please fill out all required fields with valid values.');
      return;
    }

    setIsOperating(true);
    setStatusMessage('Broadcasting new skincare item to node registries...');
    try {
      // Filter out empty ingredients
      const cleanIngredients = newProd.ingredients.filter(i => i.trim() !== '');
      await onAddProduct({
        ...newProd,
        ingredients: cleanIngredients.length > 0 ? cleanIngredients : ['Traditional Skincare Botanicals'],
      });
      
      // Reset form
      setNewProd({
        name: '',
        category: 'Ori (Shea Butter)',
        price: 0,
        description: '',
        ingredients: [''],
        skinTypes: ['All Skin Types'],
        image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=600',
        stockStatus: 'in_stock',
        size: '150g',
        usage: '',
      });

      setStatusMessage('Skincare recipe archived successfully!');
      setActiveSubTab('products');
    } catch (err) {
      console.error(err);
      alert('Failed to register product.');
    } finally {
      setIsOperating(false);
      setTimeout(() => setStatusMessage(''), 3000);
    }
  };

  const handleSaveEdit = async (productId: string) => {
    setIsOperating(true);
    setStatusMessage('Syncing modifications to database cluster...');
    try {
      await onEditProduct(productId, { price: editPrice, stockStatus: editStock });
      setEditingProdId(null);
      setStatusMessage('Product parameters synchronized!');
    } catch (err) {
      console.error(err);
      alert('Edit failed.');
    } finally {
      setIsOperating(false);
      setTimeout(() => setStatusMessage(''), 3000);
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you absolutely certain you want to purge this recipe profile from the catalog?')) return;
    setIsOperating(true);
    setStatusMessage('Purging recipe metadata...');
    try {
      await onDeleteProduct(productId);
      setStatusMessage('Recipe profile successfully purged.');
    } catch (err) {
      console.error(err);
      alert('Deletion failed.');
    } finally {
      setIsOperating(false);
      setTimeout(() => setStatusMessage(''), 3000);
    }
  };

  const handleReset = async () => {
    if (!confirm('This will wipe all custom products, purge transaction order logs, and restore the initial 9 botanical remedies. Proceed?')) return;
    setIsOperating(true);
    setStatusMessage('Re-initializing database clusters to primary snapshot...');
    try {
      await onResetStore();
      setStatusMessage('Primary database restored!');
    } catch (err) {
      console.error(err);
      alert('Reset failed.');
    } finally {
      setIsOperating(false);
      setTimeout(() => setStatusMessage(''), 3000);
    }
  };

  const handleStatusChange = async (orderId: string, status: string) => {
    try {
      await onUpdateOrderStatus(orderId, status);
      setStatusMessage(`Order #${orderId} status updated to ${status}`);
      setTimeout(() => setStatusMessage(''), 3000);
    } catch (err) {
      console.error(err);
      alert('Status update failed');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" id="admin-dashboard-view">
      
      {/* Title block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gold/15 pb-6 mb-8">
        <div>
          <span className="text-[10px] uppercase tracking-[0.3em] font-sans font-bold text-gold-dark flex items-center gap-1">
            <Settings className="w-3.5 h-3.5 animate-spin" /> Control Plane Panel
          </span>
          <h1 className="text-3xl font-serif font-bold text-forest">Heritage Naturals Atelier Backend</h1>
          <p className="text-xs text-forest/75 mt-0.5">Manage apothecary products, monitor checkout transactions, and refresh local memory nodes.</p>
        </div>

        {/* Action button cluster */}
        <div className="flex gap-2">
          <button
            onClick={onRefreshData}
            className="px-4 py-2 bg-cream-light hover:bg-gold/15 text-forest border border-gold/25 rounded-full font-sans text-xs font-bold flex items-center gap-1.5 transition-colors"
            title="Force refresh backend datasets"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sync DB</span>
          </button>
          
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-red-600/10 hover:bg-red-600 text-red-600 hover:text-white border border-red-600/35 rounded-full font-sans text-xs font-bold flex items-center gap-1.5 transition-all"
            title="Restore catalog to original state"
          >
            <Database className="w-3.5 h-3.5" />
            <span>Restore Primary DB</span>
          </button>
        </div>
      </div>

      {/* Operation State status bubble */}
      {statusMessage && (
        <div className="bg-forest border border-gold/40 text-gold-light px-4 py-3 rounded-xl mb-6 flex items-center gap-2 text-xs font-sans animate-bounce shadow-md">
          <Sparkles className="w-4 h-4 text-gold animate-spin" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Tab Selectors */}
      <div className="flex border-b border-gold/15 mb-8 overflow-x-auto" id="admin-tabs">
        <button
          onClick={() => setActiveSubTab('orders')}
          className={`px-5 py-3 font-sans text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
            activeSubTab === 'orders'
              ? 'border-forest text-forest font-black'
              : 'border-transparent text-forest/60 hover:text-forest'
          }`}
        >
          Orders Tracker ({orders.length})
        </button>
        <button
          onClick={() => setActiveSubTab('products')}
          className={`px-5 py-3 font-sans text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
            activeSubTab === 'products'
              ? 'border-forest text-forest font-black'
              : 'border-transparent text-forest/60 hover:text-forest'
          }`}
        >
          Product Catalog ({products.length})
        </button>
        <button
          onClick={() => setActiveSubTab('add_product')}
          className={`px-5 py-3 font-sans text-xs font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-1 ${
            activeSubTab === 'add_product'
              ? 'border-forest text-forest font-black'
              : 'border-transparent text-forest/60 hover:text-forest'
          }`}
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Draft New Recipe</span>
        </button>
      </div>

      {/* Content Area */}
      <div>
        
        {/* SUBTAB 1: ORDERS TRACKER */}
        {activeSubTab === 'orders' && (
          <div className="space-y-6 animate-fadeIn" id="admin-orders-tab">
            {orders.length === 0 ? (
              <div className="bg-cream-light border border-dashed border-gold/30 rounded-2xl p-12 text-center text-forest/60 max-w-xl mx-auto space-y-4">
                <ShoppingBag className="w-12 h-12 mx-auto text-gold/60" />
                <div>
                  <h3 className="font-serif text-lg font-bold text-forest">No Orders Logs Exist</h3>
                  <p className="text-xs text-forest/75 mt-1">Initiate checking out in the customer flow to generate live node transaction payloads.</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {orders.map((order) => (
                  <div 
                    key={order.id}
                    className="bg-cream-light border border-gold/15 p-5 sm:p-6 rounded-2xl shadow-sm space-y-4 hover:border-gold/35 transition-all"
                  >
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-gold/10 pb-3">
                      <div>
                        <span className="block text-[9px] uppercase tracking-wider text-forest/50 font-sans">Order Identifier</span>
                        <h4 className="font-serif font-bold text-lg text-forest-dark">{order.id}</h4>
                        <span className="text-[10px] font-mono text-gray-500">Placed: {new Date(order.createdAt).toLocaleString()}</span>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="text-right">
                          <span className="block text-[9px] uppercase tracking-wider text-forest/50 font-sans">Revenue</span>
                          <span className="text-base font-serif font-bold text-forest-dark">{formatPrice(order.total)}</span>
                        </div>
                        
                        {/* Status Select dropdown */}
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-sans font-medium text-forest/70">Transit Node:</span>
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            className="bg-cream border border-gold/25 text-xs font-semibold font-sans rounded px-2.5 py-1 text-forest focus:ring-1 focus:ring-gold focus:outline-none"
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Order Details items / Shipping details split */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                      {/* Products */}
                      <div className="space-y-2">
                        <h5 className="font-sans font-bold text-gold-dark uppercase tracking-wider">Purchased Items</h5>
                        <div className="divide-y divide-gold/10">
                          {order.items.map((item) => (
                            <div key={item.product.id} className="flex justify-between py-1.5">
                              <span className="text-forest-dark font-medium">{item.product.name} (x{item.quantity})</span>
                              <span className="font-mono text-forest">{formatPrice(item.product.price * item.quantity)}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Shipping */}
                      <div className="space-y-1.5 bg-cream/50 p-3 rounded-lg border border-gold/10">
                        <h5 className="font-sans font-bold text-gold-dark uppercase tracking-wider">Consignee Address Coordinates</h5>
                        <p className="font-sans text-forest-dark font-bold">{order.shippingDetails.fullName}</p>
                        <p className="text-forest/75">{order.shippingDetails.address}, {order.shippingDetails.city}, {order.shippingDetails.state}, {order.shippingDetails.country}</p>
                        <p className="text-forest/65">Phone: {order.shippingDetails.phone} | Email: {order.shippingDetails.email}</p>
                        <p className="text-[10px] text-gold-dark font-mono mt-1">Payment: {order.paymentMethod.toUpperCase()} | Ref: {order.paymentReference}</p>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SUBTAB 2: PRODUCT CATALOG MANAGEMENT */}
        {activeSubTab === 'products' && (
          <div className="bg-cream-light border border-gold/15 rounded-2xl shadow-sm overflow-hidden animate-fadeIn" id="admin-products-tab">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm font-sans border-collapse">
                <thead>
                  <tr className="bg-forest text-gold-light text-xs font-bold uppercase tracking-widest border-b border-gold/25">
                    <th className="px-6 py-4">Image/Profile</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Price (₦)</th>
                    <th className="px-6 py-4">Stock Index</th>
                    <th className="px-6 py-4 text-right">Administrative Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gold/10">
                  {products.map((p) => {
                    const isEditing = editingProdId === p.id;
                    return (
                      <tr key={p.id} className="hover:bg-gold/5 transition-colors" id={`admin-product-row-${p.id}`}>
                        {/* Image / Title */}
                        <td className="px-6 py-4 flex items-center gap-3">
                          <img 
                            src={p.image} 
                            alt={p.name} 
                            className="w-10 h-10 object-cover rounded bg-cream border border-gold/10"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <p className="font-serif font-bold text-forest-dark">{p.name}</p>
                            <p className="text-[10px] text-forest/50 font-mono">ID: {p.id} | Size: {p.size || 'N/A'}</p>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="px-6 py-4 text-xs font-medium text-forest/75">{p.category}</td>

                        {/* Price */}
                        <td className="px-6 py-4">
                          {isEditing ? (
                            <input
                              type="number"
                              value={editPrice}
                              onChange={(e) => setEditPrice(Number(e.target.value))}
                              className="w-20 px-2 py-1 bg-cream border border-gold/25 text-xs rounded focus:outline-none"
                            />
                          ) : (
                            <span className="font-mono text-forest-dark font-bold">{formatPrice(p.price)}</span>
                          )}
                        </td>

                        {/* Stock Status */}
                        <td className="px-6 py-4 text-xs">
                          {isEditing ? (
                            <select
                              value={editStock}
                              onChange={(e) => setEditStock(e.target.value as StockStatus)}
                              className="bg-cream border border-gold/25 text-xs rounded px-1.5 py-1 focus:outline-none"
                            >
                              <option value="in_stock">In Stock</option>
                              <option value="low_stock">Low Stock</option>
                              <option value="out_of_stock">Out of Stock</option>
                            </select>
                          ) : (
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                              p.stockStatus === 'in_stock'
                                ? 'bg-emerald-100 text-emerald-800'
                                : p.stockStatus === 'low_stock'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {p.stockStatus.replace('_', ' ')}
                            </span>
                          )}
                        </td>

                        {/* Admin actions */}
                        <td className="px-6 py-4 text-right space-x-2">
                          {isEditing ? (
                            <>
                              <button
                                onClick={() => handleSaveEdit(p.id)}
                                className="p-1.5 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors inline-flex items-center gap-0.5 text-xs font-bold"
                              >
                                <Save className="w-3.5 h-3.5" />
                                <span>Save</span>
                              </button>
                              <button
                                onClick={() => setEditingProdId(null)}
                                className="p-1.5 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors text-xs font-bold"
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => {
                                  setEditingProdId(p.id);
                                  setEditPrice(p.price);
                                  setEditStock(p.stockStatus);
                                }}
                                className="p-1.5 bg-cream hover:bg-gold/25 border border-gold/20 rounded text-forest transition-colors"
                                title="Edit Price and Stock level"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDelete(p.id)}
                                className="p-1.5 bg-red-100 hover:bg-red-600 text-red-600 hover:text-white rounded transition-all"
                                title="Purge recipe"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SUBTAB 3: ADD PRODUCT / RECIPE DRAFT */}
        {activeSubTab === 'add_product' && (
          <div className="bg-cream-light border border-gold/15 p-6 sm:p-8 rounded-2xl shadow-sm max-w-3xl mx-auto animate-fadeIn" id="admin-add-product-tab">
            <div className="flex items-center gap-1.5 border-b border-gold/15 pb-4 mb-6">
              <Sparkles className="w-5 h-5 text-gold animate-bounce" />
              <h3 className="font-serif text-xl font-bold text-forest">Archiving New Botanical Blend</h3>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-5 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div className="space-y-1">
                  <label className="text-xs font-sans font-bold uppercase tracking-wider text-forest/70 block">Blend/Recipe Name *</label>
                  <input
                    type="text"
                    value={newProd.name}
                    onChange={(e) => setNewProd({ ...newProd, name: e.target.value })}
                    placeholder="e.g. Traditional Camwood Polish"
                    className="w-full h-10 px-3 bg-cream border border-gold/25 focus:ring-1 focus:ring-gold rounded focus:outline-none"
                    required
                  />
                </div>

                {/* Category */}
                <div className="space-y-1">
                  <label className="text-xs font-sans font-bold uppercase tracking-wider text-forest/70 block">Botanical Category *</label>
                  <select
                    value={newProd.category}
                    onChange={(e) => setNewProd({ ...newProd, category: e.target.value })}
                    className="w-full h-10 px-3 bg-cream border border-gold/25 focus:ring-1 focus:ring-gold rounded focus:outline-none"
                  >
                    <option value="Ori (Shea Butter)">Ori (Shea Butter)</option>
                    <option value="Black Soap">Black Soap</option>
                    <option value="Herbal Face Masks">Herbal Face Masks</option>
                    <option value="Body Scrub">Body Scrub</option>
                    <option value="Herbal Bath Soak">Herbal Bath Soak</option>
                    <option value="Facial Oils">Facial Oils</option>
                    <option value="Turmeric Soap">Turmeric Soap</option>
                  </select>
                </div>

                {/* Price */}
                <div className="space-y-1">
                  <label className="text-xs font-sans font-bold uppercase tracking-wider text-forest/70 block">Retail Price (₦) *</label>
                  <input
                    type="number"
                    value={newProd.price || ''}
                    onChange={(e) => setNewProd({ ...newProd, price: Number(e.target.value) })}
                    placeholder="e.g. 1200"
                    className="w-full h-10 px-3 bg-cream border border-gold/25 focus:ring-1 focus:ring-gold rounded focus:outline-none"
                    required
                    min={1}
                  />
                </div>

                {/* Size */}
                <div className="space-y-1">
                  <label className="text-xs font-sans font-bold uppercase tracking-wider text-forest/70 block">Volumetric Size</label>
                  <input
                    type="text"
                    value={newProd.size}
                    onChange={(e) => setNewProd({ ...newProd, size: e.target.value })}
                    placeholder="e.g. 150ml, 200g"
                    className="w-full h-10 px-3 bg-cream border border-gold/25 focus:ring-1 focus:ring-gold rounded focus:outline-none"
                  />
                </div>

                {/* Image URL */}
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-sans font-bold uppercase tracking-wider text-forest/70 block">Aesthetic Unsplash Image URL *</label>
                  <input
                    type="text"
                    value={newProd.image}
                    onChange={(e) => setNewProd({ ...newProd, image: e.target.value })}
                    placeholder="Paste high-res organic beauty Unsplash photo link"
                    className="w-full h-10 px-3 bg-cream border border-gold/25 focus:ring-1 focus:ring-gold rounded focus:outline-none"
                    required
                  />
                </div>

                {/* Description */}
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-sans font-bold uppercase tracking-wider text-forest/70 block">Formula Profile Description *</label>
                  <textarea
                    value={newProd.description}
                    onChange={(e) => setNewProd({ ...newProd, description: e.target.value })}
                    rows={4}
                    placeholder="Detail the organic sourcing origins, sensory notes, and benefits of this formula..."
                    className="w-full p-3 bg-cream border border-gold/25 focus:ring-1 focus:ring-gold rounded focus:outline-none"
                    required
                  ></textarea>
                </div>

                {/* Usage Guide */}
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-sans font-bold uppercase tracking-wider text-forest/70 block">Ritual Usage Guide</label>
                  <textarea
                    value={newProd.usage}
                    onChange={(e) => setNewProd({ ...newProd, usage: e.target.value })}
                    rows={2}
                    placeholder="Massage into moist skin, let sit for 20 minutes then rinse..."
                    className="w-full p-3 bg-cream border border-gold/25 focus:ring-1 focus:ring-gold rounded focus:outline-none"
                  ></textarea>
                </div>

                {/* Ingredients Lists */}
                <div className="sm:col-span-2 space-y-2">
                  <label className="text-xs font-sans font-bold uppercase tracking-wider text-forest/70 block">Detailed Botanical Raw Ingredients</label>
                  <div className="space-y-2">
                    {newProd.ingredients.map((ing, idx) => (
                      <div key={idx} className="flex gap-2">
                        <input
                          type="text"
                          value={ing}
                          onChange={(e) => handleIngredientChange(idx, e.target.value)}
                          placeholder="e.g. 100% Unrefined Camwood Powder"
                          className="flex-1 h-9 px-3 bg-cream border border-gold/25 rounded focus:outline-none text-xs"
                        />
                        {newProd.ingredients.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveIngredient(idx)}
                            className="px-2.5 bg-red-100 hover:bg-red-600 text-red-600 hover:text-white rounded transition-colors text-xs font-bold"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={handleAddIngredient}
                      className="px-3 py-1.5 bg-cream border border-dashed border-gold/40 text-forest hover:bg-gold/15 transition-all rounded text-xs font-bold flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Ingredient Element</span>
                    </button>
                  </div>
                </div>

              </div>

              <div className="border-t border-gold/15 pt-4">
                <button
                  type="submit"
                  className="w-full h-11 bg-forest hover:bg-forest-light text-gold-light rounded font-sans font-bold text-xs shadow transition-colors cursor-pointer"
                >
                  Publish to Catalog Registry
                </button>
              </div>

            </form>
          </div>
        )}

      </div>

    </div>
  );
}
