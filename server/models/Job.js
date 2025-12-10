import mongoose from 'mongoose';
import slugify from 'slugify';

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  slug: {
    type: String,
    unique: true
  },
  company: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
    maxlength: [150, 'Company name cannot exceed 150 characters']
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true,
    maxlength: [100, 'Location cannot exceed 100 characters']
  },
  jobType: {
    type: String,
    required: [true, 'Job type is required'],
    enum: ['Full-time', 'Part-time', 'Internship', 'Remote', 'Hybrid', 'Contract'],
    default: 'Full-time'
  },
  postedDate: {
    type: Date,
    default: Date.now
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  contactNumber: {
    type: String,
    trim: true
  },
  applyLink: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        if (!v) return true;
        return /^https?:\/\/.+/.test(v);
      },
      message: 'Please enter a valid URL'
    }
  },
  imageUrl: {
    type: String,
    required: [true, 'Job image is required']
  },
  imagePublicId: {
    type: String
  },
  description: {
    type: String,
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  rolesResponsibilities: {
    type: String,
    trim: true,
    maxlength: [2000, 'Roles & Responsibilities cannot exceed 2000 characters']
  },
  eligibility: {
    type: String,
    trim: true,
    maxlength: [2000, 'Eligibility cannot exceed 2000 characters']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  views: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Create slug before saving
jobSchema.pre('save', function(next) {
  if (!this.isModified('title')) {
    return next();
  }
  
  this.slug = slugify(this.title, {
    lower: true,
    strict: true,
    remove: /[*+~.()'"!:@]/g
  });
  
  next();
});

// Indexes for performance
jobSchema.index({ title: 'text', company: 'text', location: 'text' });
jobSchema.index({ jobType: 1 });
jobSchema.index({ location: 1 });
jobSchema.index({ postedDate: -1 });
jobSchema.index({ slug: 1 });

const Job = mongoose.model('Job', jobSchema);

export default Job;