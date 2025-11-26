const express = require('express');
const errorHandler = require('./middleware/errorHandler');
const app = express();
const cookieParser = require('cookie-parser');
const path = require('path');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();

const userRoutes = require('./routes/user.routes');
const homeProducts = require('./routes/homeProducts.routes');
const orderRoutes = require('./routes/order.routes');

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: true, credentials: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Serve uploads first (no logs)
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), { fallthrough: false }));

// Use morgan but only for /api routes — skip others
app.use(
  morgan('dev', {
    skip: (req) => !req.url.startsWith('/api'),
  })
);

// custom console log for API endpoints only (simpler view)
app.use((req, res, next) => {
  if (req.url.startsWith('/api')) {
    console.log(`${req.method} ${req.originalUrl}`);
  }
  next();
});

// Root route
app.get('/', (req, res) => {
  res.send(
    `<marquee>
      <h1>${process.env.DEV_MODE} server side running properly</h1>
    </marquee>`
  );
});

// Routes
console.log('Registering routes...');
app.use('/api/user', userRoutes);
console.log('User routes registered at /api/user');
app.use('/api/products', homeProducts);
app.use('/api/orders', orderRoutes);

// Debug: Catch-all for unmatched API routes (must be after all routes)
app.use('/api/*', (req, res) => {
  console.log('❌ Unmatched API route:', req.method, req.originalUrl);
  console.log('Available routes: /api/user/*, /api/products/*, /api/orders/*');
  res.status(404).json({
    status: 404,
    success: false,
    error: `Route ${req.method} ${req.originalUrl} not found`
  });
});

app.use(errorHandler);

module.exports = app;
