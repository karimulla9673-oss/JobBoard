import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import { format } from 'date-fns';
import { jobAPI } from '../utils/api';
import Navbar from '../components/Navbar';
import EditJobModal from '../components/EditJobModal';
import toast from 'react-hot-toast';

const ManageJobs = () => {
  const queryClient = useQueryClient();
  const [editingJob, setEditingJob] = useState(null);

  const { data: jobs, isLoading } = useQuery({
    queryKey: ['admin-jobs'],
    queryFn: async () => {
      const response = await jobAPI.getAllJobs();
      return response.data.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => jobAPI.deleteJob(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-jobs']);
      toast.success('Job deleted successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete job');
    },
  });

  const handleDelete = (job) => {
    if (window.confirm(`Are you sure you want to delete "${job.title}"?`)) {
      deleteMutation.mutate(job._id);
    }
  };

  return (
    <div className="manage-page">
      <Navbar />
      
      <div className="container">
        <div className="manage-header">
          <h1 className="page-title">Manage Jobs</h1>
          <Link to="/upload-job" className="btn-primary">
            <FiPlus className="icon" />
            Add New Job
          </Link>
        </div>

        {isLoading ? (
          <div className="loading-container">
            <div className="loader"></div>
            <p>Loading jobs...</p>
          </div>
        ) : jobs?.length === 0 ? (
          <div className="empty-state">
            <p>No jobs found</p>
            <Link to="/upload-job" className="btn-primary">
              <FiPlus className="icon" />
              Upload Your First Job
            </Link>
          </div>
        ) : (
          <div className="jobs-table-container">
            <table className="jobs-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Title</th>
                  <th>Company</th>
                  <th>Location</th>
                  <th>Type</th>
                  <th>Posted</th>
                  <th>Views</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs?.map((job) => (
                  <tr key={job._id}>
                    <td>
                      <img 
                        src={job.imageUrl} 
                        alt={job.title}
                        className="table-image"
                      />
                    </td>
                    <td className="job-title-cell">{job.title}</td>
                    <td>{job.company}</td>
                    <td>{job.location}</td>
                    <td>
                      <span className="job-type-badge">{job.jobType}</span>
                    </td>
                    <td>{format(new Date(job.postedDate), 'MMM dd, yyyy')}</td>
                    <td>{job.views}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          onClick={() => setEditingJob(job)}
                          className="btn-icon edit"
                          title="Edit"
                        >
                          <FiEdit2 />
                        </button>
                        <button
                          onClick={() => handleDelete(job)}
                          className="btn-icon delete"
                          title="Delete"
                          disabled={deleteMutation.isLoading}
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {editingJob && (
        <EditJobModal
          job={editingJob}
          onClose={() => setEditingJob(null)}
        />
      )}
    </div>
  );
};

export default ManageJobs;