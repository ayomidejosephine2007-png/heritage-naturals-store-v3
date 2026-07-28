import React, { useState } from 'react';
import { CreditCard, ShieldCheck, MapPin, Phone, Mail, User, Check, ArrowLeft, ArrowRight, Shield, Sparkles, Award, MessageSquare } from 'lucide-react';
import { CartItem, ShippingDetails, formatPrice } from '../types';

interface CheckoutProps {
  cartItems: CartItem[];
  onBackToShop: () => void;
  onPlaceOrder: (details: ShippingDetails, paymentMethod: string) => Promise<any>;
}

export default function Checkout({ cartItems, onBackToShop, onPlaceOrder }: CheckoutProps) {
  const [formData, setFormData] = useState<ShippingDetails>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    country: 'Nigeria',
    zipCode: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<string>('paystack');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingStep, setProcessingStep] = useState<string>('');
  const [completedOrder, setCompletedOrder] = useState<any | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const shippingFee = formData.country === 'Nigeria' ? 1500 : 15000; // ₦1,500 for local, ₦15,000 global shipping
  const total = subtotal + shippingFee;

  const generateWhatsAppMessage = () => {
    let message = "Hi Heritage Naturals, I'd like to place an order:\n\n";
    cartItems.forEach(item => {
      message += `- ${item.quantity}x ${item.product.name} (${formatPrice(item.product.price * item.quantity)})\n`;
    });
    message += `\nSubtotal: ${formatPrice(subtotal)}`;
    message += `\nCourier Delivery: ${formatPrice(shippingFee)}`;
    message += `\nTotal: ${formatPrice(total)}\n\n`;
    
    if (formData.fullName || formData.address) {
      message += `Delivery Information:\n`;
      if (formData.fullName) message += `- Name: ${formData.fullName}\n`;
      if (formData.phone) message += `- Phone: ${formData.phone}\n`;
      if (formData.address) message += `- Address: ${formData.address}, ${formData.city}, ${formData.state}, ${formData.country}\n`;
    }
    
    return encodeURIComponent(message);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Valid email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.address.trim()) newErrors.address = 'Street address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State or Province is required';
    if (!formData.zipCode.trim()) newErrors.zipCode = 'ZIP / Postal code is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsProcessing(true);
    setProcessingStep('Initializing secure connection to gatekeeper...');
    
    // Step 1: Simulated Secure connection
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (paymentMethod === 'paystack') {
      setProcessingStep('Connecting to Paystack Nigerian API Gateways...');
      await new Promise(resolve => setTimeout(resolve, 1800));
      setProcessingStep('Authorizing secure local currency debit card channels...');
    } else if (paymentMethod === 'flutterwave') {
      setProcessingStep('Routing checkout invoice to Flutterwave API endpoints...');
      await new Promise(resolve => setTimeout(resolve, 1800));
      setProcessingStep('Verifying mobile money & card accounts authorization...');
    } else {
      setProcessingStep('Authorizing credit card via secondary Stripe portal...');
      await new Promise(resolve => setTimeout(resolve, 1800));
      setProcessingStep('Processing secure card authentication...');
    }
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    setProcessingStep('Synchronizing order payloads on Heritage Naturals servers...');
    
    try {
      const order = await onPlaceOrder(formData, paymentMethod);
      setProcessingStep('Finalizing your purchase details...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCompletedOrder(order);
    } catch (err) {
      console.error(err);
      alert('Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (completedOrder) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-8" id="checkout-receipt-view">
        
        {/* Success Header Icon */}
        <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-full border-2 border-gold bg-forest text-gold animate-bounce">
          <Check className="w-10 h-10" />
          <div className="absolute inset-0.5 rounded-full border border-dashed border-gold/40"></div>
        </div>

        <div className="space-y-3">
          <span className="text-xs uppercase tracking-[0.25em] font-sans text-gold-dark font-bold">Purchase Victorious</span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-forest">Thank You For Your Order!</h1>
          <p className="text-base text-forest/80 max-w-lg mx-auto leading-relaxed">
            Your order has been secured and dispatched to the botanical packaging atelier. A verification receipt and shipping tracker details have been sent to <span className="font-bold text-forest-dark">{completedOrder.shippingDetails.email}</span>.
          </p>
        </div>

        {/* Invoice Receipt Container */}
        <div className="bg-cream-light border border-gold/25 rounded-2xl p-6 sm:p-8 text-left shadow-lg space-y-6">
          <div className="flex justify-between items-center border-b border-gold/15 pb-4">
            <div>
              <p className="text-xs uppercase tracking-wider text-forest/55 font-sans font-medium">Order Identifier</p>
              <h3 className="text-lg font-serif font-bold text-forest-dark">{completedOrder.id}</h3>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase tracking-wider text-forest/55 font-sans font-medium">Payment Channel</p>
              <span className="inline-block bg-forest/10 border border-gold/30 text-forest-dark text-[10px] font-sans font-bold uppercase px-3 py-0.5 rounded">
                {completedOrder.paymentMethod.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Items bought summary */}
          <div className="space-y-3">
            <h4 className="text-xs font-sans font-bold uppercase tracking-widest text-gold-dark">Items Ordered</h4>
            <div className="divide-y divide-gold/10">
              {completedOrder.items.map((item: any) => (
                <div key={item.product.id} className="flex justify-between items-center py-2.5">
                  <div className="flex items-center gap-2">
                    <span className="font-sans font-bold text-xs bg-forest text-gold w-5 h-5 rounded-full flex items-center justify-center">{item.quantity}</span>
                    <span className="text-sm font-sans font-medium text-forest-dark">{item.product.name}</span>
                  </div>
                  <span className="text-sm font-sans font-semibold text-forest-dark">{formatPrice(item.product.price * item.quantity)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping To info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-gold/15 pt-4 text-sm">
            <div>
              <h5 className="font-sans font-bold text-xs uppercase tracking-wider text-gold-dark mb-1">Delivering To</h5>
              <p className="font-sans text-forest-dark font-medium">{completedOrder.shippingDetails.fullName}</p>
              <p className="text-forest/75 mt-0.5">{completedOrder.shippingDetails.address}</p>
              <p className="text-forest/75">{completedOrder.shippingDetails.city}, {completedOrder.shippingDetails.state}, {completedOrder.shippingDetails.country}</p>
              <p className="text-forest/60 mt-1">{completedOrder.shippingDetails.phone}</p>
            </div>
            <div>
              <h5 className="font-sans font-bold text-xs uppercase tracking-wider text-gold-dark mb-1">Receipt Financials</h5>
              <div className="space-y-1 font-sans text-xs">
                <div className="flex justify-between text-forest/70">
                  <span>Subtotal</span>
                  <span>{formatPrice(completedOrder.subtotal)}</span>
                </div>
                <div className="flex justify-between text-forest/70">
                  <span>Botanical Courier Fee</span>
                  <span>{formatPrice(completedOrder.shippingFee)}</span>
                </div>
                <div className="flex justify-between font-serif font-bold text-sm text-forest-dark pt-1 border-t border-dashed border-gold/20">
                  <span>Invoice Total Paid</span>
                  <span>{formatPrice(completedOrder.total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment gateway specific references */}
          <div className="bg-cream border border-gold/15 rounded-xl p-3 flex justify-between items-center text-xs">
            <span className="font-sans font-medium text-forest/75">Gatekeeper Transaction ID:</span>
            <span className="font-mono text-gold-dark font-semibold">{completedOrder.paymentReference}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onBackToShop}
            className="px-8 py-3 bg-forest hover:bg-forest-light text-gold-light rounded-full font-sans font-bold text-sm shadow-md transition-all cursor-pointer"
          >
            Continue Sourcing Organic Glow
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" id="checkout-form-view">
      
      {/* Title */}
      <div className="space-y-2 mb-10 text-center lg:text-left">
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-forest">Atelier Checkout</h1>
        <p className="text-sm text-forest/70">Secure botanical logistics and custom African payments</p>
      </div>

      {isProcessing ? (
        <div className="max-w-md mx-auto text-center py-20 space-y-6" id="checkout-processing-view">
          <div className="relative inline-block w-16 h-16 border-4 border-gold/30 border-t-gold rounded-full animate-spin"></div>
          <div className="space-y-2">
            <h3 className="font-serif text-xl font-bold text-forest">Securing Transaction</h3>
            <p className="text-sm text-forest/75 italic animate-pulse">{processingStep}</p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Side: Shipping Forms & Gateways */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Form Box */}
            <div className="bg-cream-light border border-gold/15 p-6 sm:p-8 rounded-2xl shadow-sm space-y-6">
              <div className="flex items-center gap-2 border-b border-gold/15 pb-4 text-forest font-serif text-lg font-bold">
                <MapPin className="w-5 h-5 text-gold" />
                <h2>Shipping & Delivery Coordinates</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Full Name */}
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-sans font-bold uppercase tracking-wider text-forest/70 block flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-gold" /> Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="e.g. Ayomide Josephine"
                    className={`w-full h-11 px-4 bg-cream border rounded-lg focus:outline-none focus:ring-1 focus:ring-gold text-sm ${
                      errors.fullName ? 'border-red-500' : 'border-gold/25'
                    }`}
                  />
                  {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                </div>

                {/* Email Address */}
                <div className="space-y-1.5">
                  <label className="text-xs font-sans font-bold uppercase tracking-wider text-forest/70 block flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-gold" /> Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="e.g. ayomide@gmail.com"
                    className={`w-full h-11 px-4 bg-cream border rounded-lg focus:outline-none focus:ring-1 focus:ring-gold text-sm ${
                      errors.email ? 'border-red-500' : 'border-gold/25'
                    }`}
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>

                {/* Phone Number */}
                <div className="space-y-1.5">
                  <label className="text-xs font-sans font-bold uppercase tracking-wider text-forest/70 block flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-gold" /> Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="e.g. 09167592135"
                    className={`w-full h-11 px-4 bg-cream border rounded-lg focus:outline-none focus:ring-1 focus:ring-gold text-sm ${
                      errors.phone ? 'border-red-500' : 'border-gold/25'
                    }`}
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>

                {/* Street Address */}
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-sans font-bold uppercase tracking-wider text-forest/70 block">Street Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="e.g. 15 Ikoyi Road, near Kings Court"
                    className={`w-full h-11 px-4 bg-cream border rounded-lg focus:outline-none focus:ring-1 focus:ring-gold text-sm ${
                      errors.address ? 'border-red-500' : 'border-gold/25'
                    }`}
                  />
                  {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                </div>

                {/* Country */}
                <div className="space-y-1.5">
                  <label className="text-xs font-sans font-bold uppercase tracking-wider text-forest/70 block">Country</label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full h-11 px-4 bg-cream border border-gold/25 rounded-lg focus:outline-none focus:ring-1 focus:ring-gold text-sm"
                  >
                    <option value="Nigeria">Nigeria</option>
                    <option value="Ghana">Ghana</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                  </select>
                </div>

                {/* State */}
                <div className="space-y-1.5">
                  <label className="text-xs font-sans font-bold uppercase tracking-wider text-forest/70 block">State / Region</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="e.g. Lagos State"
                    className={`w-full h-11 px-4 bg-cream border rounded-lg focus:outline-none focus:ring-1 focus:ring-gold text-sm ${
                      errors.state ? 'border-red-500' : 'border-gold/25'
                    }`}
                  />
                  {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
                </div>

                {/* City */}
                <div className="space-y-1.5">
                  <label className="text-xs font-sans font-bold uppercase tracking-wider text-forest/70 block">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="e.g. Victoria Island"
                    className={`w-full h-11 px-4 bg-cream border rounded-lg focus:outline-none focus:ring-1 focus:ring-gold text-sm ${
                      errors.city ? 'border-red-500' : 'border-gold/25'
                    }`}
                  />
                  {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                </div>

                {/* ZIP / Postal code */}
                <div className="space-y-1.5">
                  <label className="text-xs font-sans font-bold uppercase tracking-wider text-forest/70 block">ZIP / Postal Code</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    placeholder="e.g. 101233"
                    className={`w-full h-11 px-4 bg-cream border rounded-lg focus:outline-none focus:ring-1 focus:ring-gold text-sm ${
                      errors.zipCode ? 'border-red-500' : 'border-gold/25'
                    }`}
                  />
                  {errors.zipCode && <p className="text-red-500 text-xs mt-1">{errors.zipCode}</p>}
                </div>

              </div>
            </div>

            {/* Payment Integrations */}
            <div className="bg-cream-light border border-gold/15 p-6 sm:p-8 rounded-2xl shadow-sm space-y-6">
              <div className="flex items-center gap-2 border-b border-gold/15 pb-4 text-forest font-serif text-lg font-bold">
                <CreditCard className="w-5 h-5 text-gold" />
                <h2>Atelier Secure Payment Sourcing</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Paystack Channel */}
                <div 
                  onClick={() => setPaymentMethod('paystack')}
                  className={`border p-4 rounded-xl cursor-pointer transition-all flex flex-col justify-between h-28 ${
                    paymentMethod === 'paystack'
                      ? 'border-gold bg-forest text-gold-light'
                      : 'border-gold/20 hover:border-gold/50 bg-cream'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="font-sans font-bold text-xs uppercase tracking-widest">Paystack</span>
                    {paymentMethod === 'paystack' && <Check className="w-4 h-4 text-gold" />}
                  </div>
                  <div>
                    <span className="block text-[10px] font-sans opacity-70">Nigeria & West Africa Portal</span>
                    <span className="text-[9px] font-mono opacity-80">Debit Cards, Bank Transfer, USSD</span>
                  </div>
                </div>

                {/* Flutterwave Channel */}
                <div 
                  onClick={() => setPaymentMethod('flutterwave')}
                  className={`border p-4 rounded-xl cursor-pointer transition-all flex flex-col justify-between h-28 ${
                    paymentMethod === 'flutterwave'
                      ? 'border-gold bg-forest text-gold-light'
                      : 'border-gold/20 hover:border-gold/50 bg-cream'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="font-sans font-bold text-xs uppercase tracking-widest">Flutterwave</span>
                    {paymentMethod === 'flutterwave' && <Check className="w-4 h-4 text-gold" />}
                  </div>
                  <div>
                    <span className="block text-[10px] font-sans opacity-70">Pan-African Gateway</span>
                    <span className="text-[9px] font-mono opacity-80">Mobile Money, Cards, Barter</span>
                  </div>
                </div>

                {/* Global Card Credit card */}
                <div 
                  onClick={() => setPaymentMethod('card')}
                  className={`border p-4 rounded-xl cursor-pointer transition-all flex flex-col justify-between h-28 ${
                    paymentMethod === 'card'
                      ? 'border-gold bg-forest text-gold-light'
                      : 'border-gold/20 hover:border-gold/50 bg-cream'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="font-sans font-bold text-xs uppercase tracking-widest">Credit Card</span>
                    {paymentMethod === 'card' && <Check className="w-4 h-4 text-gold" />}
                  </div>
                  <div>
                    <span className="block text-[10px] font-sans opacity-70">Stripe Global Processing</span>
                    <span className="text-[9px] font-mono opacity-80">Visa, Mastercard, Amex</span>
                  </div>
                </div>

              </div>

              <div className="flex items-center gap-2 bg-cream border border-gold/15 p-3 rounded-xl text-xs text-forest/70 font-sans">
                <ShieldCheck className="w-4 h-4 text-gold shrink-0" />
                <p>Heritage Naturals utilizes 256-bit bank-grade encryption to protect checkout parameters. No card credentials are ever cached on our servers.</p>
              </div>
            </div>

          </div>

          {/* Right Side: Order Summary sticky */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
            <div className="bg-cream-light border border-gold/15 p-6 rounded-2xl shadow-md space-y-5">
              <h3 className="font-serif text-lg font-bold text-forest border-b border-gold/15 pb-3">Sourced Bag Contents</h3>
              
              {/* Items grid */}
              <div className="max-h-56 overflow-y-auto space-y-3 pr-2 divide-y divide-gold/10">
                {cartItems.map((item) => (
                  <div key={item.product.id} className="flex gap-3 py-2.5 items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="bg-forest text-gold text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shrink-0">
                        {item.quantity}
                      </span>
                      <span className="text-xs font-sans font-semibold text-forest-dark truncate max-w-[150px]">{item.product.name}</span>
                    </div>
                    <span className="text-xs font-sans font-bold text-forest-dark">{formatPrice(item.product.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              {/* Pricing Math */}
              <div className="space-y-2 pt-3 border-t border-gold/15 text-sm font-sans">
                <div className="flex justify-between text-forest/70">
                  <span>Botanical Subtotal</span>
                  <span className="text-forest-dark font-medium">{formatPrice(subtotal)}</span>
                </div>
                
                <div className="flex justify-between text-forest/70">
                  <span>Custom Courier Delivery Fee</span>
                  <span className="text-forest-dark font-medium">{formatPrice(shippingFee)}</span>
                </div>

                <div className="flex justify-between text-xs text-gold-dark italic pl-2 border-l border-gold/30">
                  <span>Logistics context:</span>
                  <span>{formData.country === 'Nigeria' ? 'Local Courier (Nigeria)' : 'Global Tracked Shipping'}</span>
                </div>

                <div className="flex justify-between font-serif font-bold text-base text-forest pt-3 border-t border-dashed border-gold/20">
                  <span>Secured Invoice Total</span>
                  <span className="text-forest-dark text-lg">{formatPrice(total)}</span>
                </div>

                {/* Local Currency Confirmation */}
                <div className="bg-cream border border-gold/15 p-3 rounded-lg text-center space-y-1">
                  <span className="block text-[10px] uppercase tracking-wider text-forest/65 font-medium">Direct Local Processing</span>
                  <span className="text-sm font-sans font-extrabold text-forest-dark">{formatPrice(total)} NGN</span>
                  <span className="block text-[9px] text-forest/50">Processed securely via Paystack in Nigerian Naira</span>
                </div>
              </div>

              {/* Secure Checkout Form Submission CTA */}
              <button
                type="submit"
                className="w-full h-12 bg-forest hover:bg-forest-light text-gold-light rounded-full font-sans font-bold text-sm shadow-lg flex items-center justify-center gap-2 transform hover:-translate-y-0.5 transition-all cursor-pointer"
                id="submit-payment-cta"
              >
                <span>Authorize & Lock Order</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href={`https://wa.me/2349167592135?text=${generateWhatsAppMessage()}`}
                target="_blank"
                rel="noreferrer"
                className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-sans font-bold text-sm shadow-lg flex items-center justify-center gap-2 transform hover:-translate-y-0.5 transition-all cursor-pointer"
                id="checkout-whatsapp-cta"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Complete Order via WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={onBackToShop}
                className="w-full text-center text-xs font-sans text-forest/60 hover:text-forest underline"
              >
                Go back to shop catalog
              </button>
            </div>
            
            {/* Trust Badges */}
            <div className="border border-gold/15 rounded-xl p-4 bg-cream flex justify-between items-center text-center">
              <div className="space-y-1">
                <Shield className="w-5 h-5 text-gold mx-auto" />
                <span className="block text-[9px] uppercase tracking-wider font-sans font-bold text-forest">Secure TLS</span>
              </div>
              <div className="space-y-1">
                <Award className="w-5 h-5 text-gold mx-auto" />
                <span className="block text-[9px] uppercase tracking-wider font-sans font-bold text-forest">Authentic Co-ops</span>
              </div>
              <div className="space-y-1">
                <Sparkles className="w-5 h-5 text-gold mx-auto" />
                <span className="block text-[9px] uppercase tracking-wider font-sans font-bold text-forest">100% Organic</span>
              </div>
            </div>
          </div>

        </form>
      )}

    </div>
  );
}
