export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock';

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number; // in NGN (Nigerian Naira)
  description: string;
  ingredients: string[];
  skinTypes: string[];
  image: string;
  stockStatus: StockStatus;
  featured?: boolean;
  rating?: number;
  reviewsCount?: number;
  usage?: string;
  size?: string; // e.g., "150g", "50ml"
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface ShippingDetails {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  shippingDetails: ShippingDetails;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  createdAt: string;
  paymentMethod: string;
  paymentReference: string;
}

export function formatPrice(price: number): string {
  return `₦${Math.round(price).toLocaleString('en-NG')}`;
}

