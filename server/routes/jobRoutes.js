import express from 'express';
import { body } from 'express-validator';
import {
  extractJobDetails,
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
  getAdminJobs,
  getLocations
} from '../controllers/jobController.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../utils/cloudUpload.js';
import { uploadLimiter } from '../middleware/security.js';

const router = express.Router();

// Validation middleware
const jobValidation = [
  body('title').trim().notEmpty().withMessage('Job title is required'),
  body('company').trim().notEmpty().withMessage('Company name is required'),
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('jobType').isIn(['Full-time', 'Part-time', 'Internship', 'Remote', 'Hybrid', 'Contract'])
    .withMessage('Invalid job type'),
  body('imageUrl').trim().notEmpty().withMessage('Image URL is required'),
  body('email').optional().isEmail().withMessage('Invalid email format'),
  body('applyLink').optional().isURL().withMessage('Invalid URL format')
];

// Public routes
router.get('/', getAllJobs);
router.get('/filters/locations', getLocations);

// Protected routes (Admin only) - MUST come before generic :id routes
router.post('/extract', protect, uploadLimiter, upload.single('image'), extractJobDetails);
router.post('/', protect, jobValidation, createJob);
router.get('/admin/all', protect, getAdminJobs);
router.put('/:id', protect, jobValidation, updateJob);
router.delete('/:id', protect, deleteJob);

// Generic routes - MUST come last
router.get('/:id/:slug?', getJobById);

export default router;