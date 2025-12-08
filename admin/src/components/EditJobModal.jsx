import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FiX, FiSave } from 'react-icons/fi';
import { jobAPI } from '../utils/api';
import toast from 'react-hot-toast';

const JOB_TYPES = ['Full-time', 'Part-time', 'Internship', 'Remote', 'Hybrid', 'Contract'];

const EditJobModal = ({ job, onClose }) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    title: job.title,
    company: job.company,
    location: job.location,
    jobType: job.jobType,
    email: job.email || '',
    contactNumber: job.contactNumber || '',
    applyLink: job.applyLink || '',
    description: job.description || '',
    postedDate: new Date(job.postedDate).toISOString().split('T')[0],
  });

  const updateMutation = useMutation({
    mutationFn: (data) => jobAPI.updateJob(job._id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-jobs']);
      toast.success('Job updated successfully');
      onClose();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update job');
    },
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Edit Job</h2>
          <button onClick={onClose} className="modal-close">
            <FiX />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="modal-body">
            <div className="form-preview-small">
              <img src={job.imageUrl} alt={job.title} />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="title">Job Title *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="company">Company *</label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
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
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="jobType">Job Type *</label>
                <select
                  id="jobType"
                  name="jobType"
                  value={formData.jobType}
                  onChange={handleChange}
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
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="contactNumber">Contact</label>
                <input
                  type="text"
                  id="contactNumber"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="applyLink">Apply Link</label>
              <input
                type="url"
                id="applyLink"
                name="applyLink"
                value={formData.applyLink}
                onChange={handleChange}
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
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
              />
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updateMutation.isLoading}
              className="btn-primary"
            >
              <FiSave className="icon" />
              {updateMutation.isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditJobModal;