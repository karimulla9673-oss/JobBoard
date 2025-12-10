import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import {
  apiLimiter,
  sanitizeData,
  securityHeaders,
  errorHandler
} from './middleware/security.js';

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Initialize express app
const app = express();

// When running behind a proxy (Render, Heroku, etc.) enable trust proxy
// so express-rate-limit can use the correct IP from X-Forwarded-For
app.set('trust proxy', 1);

// Security middleware
app.use(securityHeaders);
app.use(sanitizeData);

// CORS configuration
const corsOptions = {
  origin: [
    process.env.CLIENT_URL,
    process.env.ADMIN_URL,
    'https://jobboard-client-7n25.onrender.com',
    'https://jobboardowner.onrender.com'
  ],
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Apply rate limiting to all routes
app.use('/api/', apiLimiter);

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/contact', contactRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handler (must be last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Environment: ${process.env.NODE_ENV}`);
  console.log(`🌐 Client URL: ${process.env.CLIENT_URL}`);
  console.log(`👤 Admin URL: ${process.env.ADMIN_URL}`);
});