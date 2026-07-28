import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { INITIAL_PRODUCTS } from './src/productsData';
import { Product, Order } from './src/types';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // In-memory storage
  let products: Product[] = [...INITIAL_PRODUCTS];
  let orders: Order[] = [];

  // API Endpoints
  // Get all products
  app.get('/api/products', (req, res) => {
    res.json(products);
  });

  // Add a new product (Admin)
  app.post('/api/products', (req, res) => {
    const newProduct: Product = {
      ...req.body,
      id: req.body.id || `custom-${Date.now()}`,
      rating: req.body.rating || 5.0,
      reviewsCount: req.body.reviewsCount || 0,
    };
    products.push(newProduct);
    res.status(201).json(newProduct);
  });

  // Edit an existing product (Admin)
  app.put('/api/products/:id', (req, res) => {
    const { id } = req.params;
    const index = products.findIndex((p) => p.id === id);
    if (index !== -1) {
      products[index] = { ...products[index], ...req.body };
      res.json(products[index]);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  });

  // Delete a product (Admin)
  app.delete('/api/products/:id', (req, res) => {
    const { id } = req.params;
    const index = products.findIndex((p) => p.id === id);
    if (index !== -1) {
      const deleted = products.splice(index, 1);
      res.json(deleted[0]);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  });

  // Place a new order
  app.post('/api/orders', (req, res) => {
    const { items, subtotal, shippingFee, total, shippingDetails, paymentMethod } = req.body;
    
    if (!items || items.length === 0 || !shippingDetails) {
      return res.status(400).json({ error: 'Invalid order request. Missing items or shipping details.' });
    }

    const newOrder: Order = {
      id: `HN-${Math.floor(100000 + Math.random() * 900000)}`,
      items,
      subtotal,
      shippingFee,
      total,
      shippingDetails,
      status: 'pending',
      paymentMethod,
      paymentReference: `REF-${Math.floor(100000000 + Math.random() * 900000000)}`,
      createdAt: new Date().toISOString(),
    };

    // Update stock levels for purchased items
    items.forEach((item: any) => {
      const prod = products.find(p => p.id === item.product.id);
      if (prod) {
        // Simple stock simulation (if they buy we just mock decrease or flag)
        if (prod.stockStatus === 'in_stock' && Math.random() > 0.7) {
          prod.stockStatus = 'low_stock';
        } else if (prod.stockStatus === 'low_stock') {
          prod.stockStatus = 'out_of_stock';
        }
      }
    });

    orders.unshift(newOrder); // Keep recent orders first
    res.status(201).json(newOrder);
  });

  // Get all orders (Admin)
  app.get('/api/orders', (req, res) => {
    res.json(orders);
  });

  // Update order status (Admin)
  app.put('/api/orders/:id/status', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const order = orders.find(o => o.id === id);
    if (order) {
      order.status = status;
      res.json(order);
    } else {
      res.status(404).json({ error: 'Order not found' });
    }
  });

  // Reset demo store back to original data
  app.post('/api/admin/reset', (req, res) => {
    products = [...INITIAL_PRODUCTS];
    orders = [];
    res.json({ message: 'Store reset successful' });
  });

  // Serve static assets or set up Vite Dev Server
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Heritage Naturals server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
