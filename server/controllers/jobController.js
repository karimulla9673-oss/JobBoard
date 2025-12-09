import Job from '../models/Job.js';
import { compressImage, uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudUpload.js';
import { extractJobDetailsFromImage } from '../services/geminiService.js';

// @desc    Extract job details from uploaded image using Gemini
// @route   POST /api/jobs/extract
// @access  Private (Admin)
export const extractJobDetails = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image'
      });
    }

    // Compress image
    const compressedBuffer = await compressImage(req.file.buffer);

    // Upload to Cloudinary
    const { url, publicId } = await uploadToCloudinary(compressedBuffer);

    // Try extracting details using Gemini Vision. If Gemini fails, don't return 500 — return upload info and indicate extraction failed.
    let extractionResult = { success: false, data: null, confidence: 0 };
    try {
      extractionResult = await extractJobDetailsFromImage(compressedBuffer);
    } catch (err) {
      console.error('Gemini extraction failed:', err?.message || err);
      extractionResult = { success: false, data: null, confidence: 0 };
    }

    res.status(200).json({
      success: true,
      message: extractionResult.success
        ? 'Job details extracted successfully'
        : 'Image uploaded but extraction failed. Please fill details manually.',
      data: {
        imageUrl: url,
        imagePublicId: publicId,
        extractedDetails: extractionResult.data,
        confidence: extractionResult.confidence || 0,
        extractionSuccess: extractionResult.success
      }
    });
  } catch (error) {
    console.error('Extract Job Details Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process image',
      error: error.message
    });
  }
};

// @desc    Create new job
// @route   POST /api/jobs
// @access  Private (Admin)
export const createJob = async (req, res) => {
  try {
    const jobData = {
      title: req.body.title,
      company: req.body.company,
      location: req.body.location,
      jobType: req.body.jobType,
      email: req.body.email,
      contactNumber: req.body.contactNumber,
      applyLink: req.body.applyLink,
      imageUrl: req.body.imageUrl,
      imagePublicId: req.body.imagePublicId,
      description: req.body.description,
      postedDate: req.body.postedDate || new Date()
    };

    const job = await Job.create(jobData);

    res.status(201).json({
      success: true,
      message: 'Job created successfully',
      data: job
    });
  } catch (error) {
    console.error('Create Job Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create job',
      error: error.message
    });
  }
};

// @desc    Get all jobs with filters and pagination
// @route   GET /api/jobs
// @access  Public
export const getAllJobs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = { isActive: true };

    // Search by title or company
    if (req.query.search) {
      filter.$text = { $search: req.query.search };
    }

    // Filter by job type
    if (req.query.jobType && req.query.jobType !== 'All') {
      filter.jobType = req.query.jobType;
    }

    // Filter by location
    if (req.query.location && req.query.location !== 'All') {
      filter.location = { $regex: req.query.location, $options: 'i' };
    }

    // Get total count
    const total = await Job.countDocuments(filter);

    // Get jobs
    const jobs = await Job.find(filter)
      .sort({ postedDate: -1 })
      .skip(skip)
      .limit(limit)
      .select('-imagePublicId')
      .lean();

    res.status(200).json({
      success: true,
      data: jobs,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalJobs: total,
        limit
      }
    });
  } catch (error) {
    console.error('Get All Jobs Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch jobs',
      error: error.message
    });
  }
};

// @desc    Get single job by ID and slug
// @route   GET /api/jobs/:id/:slug
// @access  Public
export const getJobById = async (req, res) => {
  try {
    // Increment views atomically to avoid triggering validation on save
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    ).select('-imagePublicId').lean();

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    res.status(200).json({
      success: true,
      data: job
    });
  } catch (error) {
    console.error('Get Job By ID Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch job',
      error: error.message
    });
  }
};

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private (Admin)
export const updateJob = async (req, res) => {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Prepare update data and avoid setting empty imageUrl which would fail validation
    const updateData = { ...req.body };
    if (updateData.imageUrl !== undefined && updateData.imageUrl !== null) {
      if (typeof updateData.imageUrl === 'string' && updateData.imageUrl.trim() === '') {
        delete updateData.imageUrl; // keep existing image
      }
    }

    job = await Job.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      message: 'Job updated successfully',
      data: job
    });
  } catch (error) {
    console.error('Update Job Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update job',
      error: error.message
    });
  }
};

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private (Admin)
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Delete image from Cloudinary
    if (job.imagePublicId) {
      await deleteFromCloudinary(job.imagePublicId);
    }

    await job.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Job deleted successfully'
    });
  } catch (error) {
    console.error('Delete Job Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete job',
      error: error.message
    });
  }
};

// @desc    Get all jobs for admin (including inactive)
// @route   GET /api/jobs/admin/all
// @access  Private (Admin)
export const getAdminJobs = async (req, res) => {
  try {
    const jobs = await Job.find()
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      data: jobs
    });
  } catch (error) {
    console.error('Get Admin Jobs Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch jobs',
      error: error.message
    });
  }
};

// @desc    Get unique locations
// @route   GET /api/jobs/filters/locations
// @access  Public
export const getLocations = async (req, res) => {
  try {
    const locations = await Job.distinct('location', { isActive: true });
    
    res.status(200).json({
      success: true,
      data: locations.sort()
    });
  } catch (error) {
    console.error('Get Locations Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch locations',
      error: error.message
    });
  }
};