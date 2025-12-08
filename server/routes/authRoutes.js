import express from 'express';
import { body } from 'express-validator';
import {
  registerAdmin,
  loginAdmin,
  getMe,
  logoutAdmin
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { authLimiter } from '../middleware/security.js';

const router = express.Router();

// Validation middleware
const registerValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Please enter a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
];

const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Please enter a valid email'),
  body('password').notEmpty().withMessage('Password is required')
];

// Apply rate limiter only in production (dev = faster testing)
const loginLimiter = process.env.NODE_ENV === 'production' ? authLimiter : (req, res, next) => next();

// Routes
router.post('/register', registerValidation, registerAdmin);
router.post('/login', loginLimiter, loginValidation, loginAdmin);
router.get('/me', protect, getMe);
router.post('/logout', protect, logoutAdmin);

export default router;