import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Instagram, Check, Clock, Sparkles } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'product_inquiry',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      alert('Please fill out all fields before submitting.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: 'product_inquiry', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    }, 1200);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" id="contact-us-page">
      
      {/* Page Title */}
      <div className="text-center max-w-2xl mx-auto space-y-4 mb-12">
        <span className="text-xs uppercase tracking-[0.2em] font-sans font-bold text-gold-dark">Initiate Connection</span>
        <h1 className="text-4xl font-serif font-bold text-forest">Connect with Heritage Naturals</h1>
        <p className="text-sm text-forest/75">
          Have an inquiry about skin-type suitabilities, custom orders, or botanical sourcing co-ops? We are here to guide you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left column: Contact info, WhatsApp, Instagram links */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-cream-light border border-gold/15 p-6 rounded-2xl shadow-sm space-y-6">
            <h3 className="font-serif text-xl font-bold text-forest border-b border-gold/15 pb-3">Apothecary Headquarters</h3>

            <div className="space-y-4 font-sans text-sm text-forest-dark">
              
              {/* Address */}
              <div className="flex gap-3">
                <MapPin className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-forest">The Heritage Atelier</p>
                  <p className="text-forest/75 mt-0.5">Mile 6, Agbedejobi Street, Abeokuta, Ogun State, Nigeria</p>
                  <p className="text-[11px] text-gold-dark">Worldwide express logistics available</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex gap-3">
                <Mail className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-forest">E-mail Correspondence</p>
                  <a href="mailto:care@heritagenaturals.com" className="text-gold-dark hover:underline font-medium">care@heritagenaturals.com</a>
                </div>
              </div>

              {/* Phone */}
              <div className="flex gap-3">
                <Phone className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-forest">Apothecary Hotline</p>
                  <p className="text-forest/75 mt-0.5">09167592135</p>
                </div>
              </div>

              {/* Hours */}
              <div className="flex gap-3">
                <Clock className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-forest">Operational Hours</p>
                  <p className="text-forest/75 mt-0.5">Monday – Friday: 9am – 6pm WAT</p>
                  <p className="text-forest/75">Saturday: 10am – 4pm WAT</p>
                </div>
              </div>

            </div>
          </div>

          {/* Social Quick-Connect Actions */}
          <div className="bg-forest text-cream p-6 rounded-2xl border border-gold/20 space-y-4">
            <div>
              <h4 className="font-serif text-lg font-bold text-gold-light">Instant Correspondence</h4>
              <p className="text-xs text-cream-light/70 mt-1">Get immediate answers from our lead skincare specialists via Instagram or WhatsApp.</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              
              {/* WhatsApp CTA */}
              <a 
                href="https://wa.me/2349167592135" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-sans text-xs font-bold transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp Live</span>
              </a>

              {/* Instagram CTA */}
              <a 
                href="https://instagram.com/heritagenaturals_co" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-3 bg-pink-700 hover:bg-pink-800 text-white rounded-xl font-sans text-xs font-bold transition-colors"
              >
                <Instagram className="w-4 h-4" />
                <span>Instagram Profile</span>
              </a>

            </div>
          </div>
        </div>

        {/* Right column: Interactive form */}
        <div className="lg:col-span-7">
          <div className="bg-cream-light border border-gold/15 p-6 sm:p-8 rounded-2xl shadow-sm space-y-6">
            <div className="flex items-center gap-2 border-b border-gold/15 pb-4">
              <Sparkles className="w-5 h-5 text-gold animate-spin" />
              <h3 className="font-serif text-xl font-bold text-forest">Submit an Inquiry</h3>
            </div>

            {submitted ? (
              <div className="py-12 text-center space-y-4 animate-fadeIn" id="contact-success-card">
                <div className="w-12 h-12 rounded-full bg-forest text-gold border border-gold/45 mx-auto flex items-center justify-center">
                  <Check className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-serif text-lg font-bold text-forest">Message Dispatched Successfully</h4>
                  <p className="text-xs text-forest/70 max-w-sm mx-auto">
                    Thank you. Your skincare inquiry is being reviewed by our clinical herbalist. We will correspond with you within 12 hours.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Name */}
                <div className="space-y-1">
                  <label className="text-xs font-sans font-bold uppercase tracking-wider text-forest/70 block">Your Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Ayomide Josephine"
                    className="w-full h-11 px-4 bg-cream border border-gold/25 focus:ring-1 focus:ring-gold rounded-lg focus:outline-none text-sm"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label className="text-xs font-sans font-bold uppercase tracking-wider text-forest/70 block">Your Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="e.g. ayomide@gmail.com"
                    className="w-full h-11 px-4 bg-cream border border-gold/25 focus:ring-1 focus:ring-gold rounded-lg focus:outline-none text-sm"
                  />
                </div>

                {/* Subject */}
                <div className="space-y-1">
                  <label className="text-xs font-sans font-bold uppercase tracking-wider text-forest/70 block">Inquiry Subject</label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full h-11 px-4 bg-cream border border-gold/25 focus:ring-1 focus:ring-gold rounded-lg focus:outline-none text-sm"
                  >
                    <option value="product_inquiry">General Product Inquiry</option>
                    <option value="skin_advice">Personalized Skin Suitability Advice</option>
                    <option value="cooperative_sourcing">Cooperative Sourcing & Wholesale</option>
                    <option value="shipping_logistics">Logistics & Worldwide Delivery</option>
                  </select>
                </div>

                {/* Message */}
                <div className="space-y-1">
                  <label className="text-xs font-sans font-bold uppercase tracking-wider text-forest/70 block">Your Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Describe your skin goals or ask questions about our traditional recipes..."
                    className="w-full p-4 bg-cream border border-gold/25 focus:ring-1 focus:ring-gold rounded-lg focus:outline-none text-sm"
                  ></textarea>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 bg-forest hover:bg-forest-light text-gold-light rounded-full font-sans font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-colors cursor-pointer disabled:opacity-55"
                >
                  {isSubmitting ? (
                    <span>Dispatched...</span>
                  ) : (
                    <>
                      <span>Transmit Message</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>

              </form>
            )}

          </div>
        </div>

      </div>

    </div>
  );
}
