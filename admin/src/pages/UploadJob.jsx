import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUpload, FiX, FiSave } from 'react-icons/fi';
import { jobAPI } from '../utils/api';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';

const JOB_TYPES = ['Full-time', 'Part-time', 'Internship', 'Remote', 'Hybrid', 'Contract'];

const UploadJob = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [imageData, setImageData] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    jobType: 'Full-time',
    email: '',
    contactNumber: '',
    applyLink: '',
    description: '',
    rolesResponsibilities: '',
    eligibility: '',
    postedDate: new Date().toISOString().split('T')[0],
  });

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }

      setSelectedFile(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleExtract = async () => {
    if (!selectedFile) {
      toast.error('Please select an image first');
      return;
    }

    setExtracting(true);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);

      const response = await jobAPI.extractDetails(formData);

      if (response.data.success) {
        const { imageUrl, imagePublicId, extractedDetails, confidence } = response.data.data;
        
        setImageData({ imageUrl, imagePublicId });
        
        // Pre-fill form with extracted details
        setFormData(prev => ({
          ...prev,
          title: extractedDetails.title || '',
          company: extractedDetails.company || '',
          location: extractedDetails.location || '',
          jobType: extractedDetails.jobType || 'Full-time',
          email: extractedDetails.email || '',
          contactNumber: extractedDetails.contactNumber || '',
          applyLink: extractedDetails.applyLink || '',
          description: extractedDetails.description || '',
          rolesResponsibilities: extractedDetails.rolesResponsibilities || '',
          eligibility: extractedDetails.eligibility || '',
        }));

        setShowForm(true);
        
        if (confidence < 70) {
          toast.success(
            `Image uploaded! AI extracted some details (${confidence}% confidence). Please review and fill missing fields.`,
            { duration: 5000 }
          );
        } else {
          toast.success(
            `Image uploaded! AI extracted details with ${confidence}% confidence. Please review before saving.`,
            { duration: 4000 }
          );
        }
      }
    } catch (error) {
      console.error('Extract error:', error);
      toast.error(error.response?.data?.message || 'Failed to process image. Please try again.');
    } finally {
      setExtracting(false);
      setUploading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.company || !formData.location) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSaving(true);

    try {
      const jobData = {
        ...formData,
        imageUrl: imageData.imageUrl,
        imagePublicId: imageData.imagePublicId,
      };

      const response = await jobAPI.createJob(jobData);

      if (response.data.success) {
        toast.success('Job posted successfully!');
        navigate('/manage-jobs');
      }
    } catch (error) {
      console.error('Create job error:', error);
      toast.error(error.response?.data?.message || 'Failed to create job. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreview(null);
    setShowForm(false);
    setImageData(null);
    setFormData({
      title: '',
      company: '',
      location: '',
      jobType: 'Full-time',
      email: '',
      contactNumber: '',
      applyLink: '',
      description: '',
      rolesResponsibilities: '',
      eligibility: '',
      postedDate: new Date().toISOString().split('T')[0],
    });
  };

  return (
    <div className="upload-page">
      <Navbar />
      
      <div className="container">
        <div className="upload-content">
          <h1 className="page-title">Upload New Job</h1>
          
          {!showForm ? (
            <div className="upload-section">
              <div className="upload-card">
                <div className="upload-area">
                  {preview ? (
                    <div className="preview-container">
                      <img src={preview} alt="Preview" className="preview-image" />
                      <button 
                        className="remove-btn"
                        onClick={handleReset}
                        type="button"
                      >
                        <FiX />
                      </button>
                    </div>
                  ) : (
                    <label htmlFor="file-upload" className="upload-label">
                      <FiUpload className="upload-icon" />
                      <p>Click to upload job poster image</p>
                      <span>PNG, JPG up to 10MB</span>
                    </label>
                  )}
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                  />
                </div>

                {selectedFile && (
                  <button
                    onClick={handleExtract}
                    disabled={uploading || extracting}
                    className="extract-btn"
                  >
                    {extracting ? 'Processing...' : 'Extract Details with AI'}
                  </button>
                )}
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="job-form">
              <div className="form-preview">
                <img src={preview} alt="Job poster" />
              </div>

              <div className="form-section">
                <h2>Job Details</h2>
                <p className="section-note">Review and edit the extracted information</p>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="title">Job Title *</label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="company">Company Name *</label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="location">Location *</label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="jobType">Job Type *</label>
                    <select
                      id="jobType"
                      name="jobType"
                      value={formData.jobType}
                      onChange={handleInputChange}
                      required
                    >
                      {JOB_TYPES.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="contactNumber">Contact Number</label>
                    <input
                      type="text"
                      id="contactNumber"
                      name="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="applyLink">Apply Link / Company Website</label>
                    <input
                      type="url"
                      id="applyLink"
                      name="applyLink"
                      value={formData.applyLink}
                      onChange={handleInputChange}
                      placeholder="https://"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="postedDate">Posted Date</label>
                    <input
                      type="date"
                      id="postedDate"
                      name="postedDate"
                      value={formData.postedDate}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="4"
                    placeholder="Brief job description..."
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="rolesResponsibilities">Roles & Responsibilities</label>
                  <textarea
                    id="rolesResponsibilities"
                    name="rolesResponsibilities"
                    value={formData.rolesResponsibilities}
                    onChange={handleInputChange}
                    rows="4"
                    placeholder="List the key responsibilities..."
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="eligibility">Eligibility</label>
                  <textarea
                    id="eligibility"
                    name="eligibility"
                    value={formData.eligibility}
                    onChange={handleInputChange}
                    rows="4"
                    placeholder="Required qualifications and skills..."
                  />
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="btn-primary"
                  >
                    <FiSave className="icon" />
                    {saving ? 'Saving...' : 'Save Job'}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadJob;