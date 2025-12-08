import { Link } from 'react-router-dom';
import { FiMapPin, FiBriefcase, FiCalendar, FiMail, FiPhone, FiExternalLink } from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';

const JobCard = ({ job }) => {
  const handleApplyClick = (e) => {
    if (job.applyLink) {
      e.preventDefault();
      window.open(job.applyLink, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="job-card">
      <Link to={`/jobs/${job._id}/${job.slug}`} className="job-card-link">
        <div className="job-image">
          <img 
            src={job.imageUrl} 
            alt={`${job.title} at ${job.company}`}
            loading="lazy"
          />
        </div>
        
        <div className="job-content">
          <h3 className="job-title">{job.title}</h3>
          <p className="job-company">{job.company}</p>
          
          <div className="job-details">
            <div className="job-detail-item">
              <FiMapPin className="icon" />
              <span>{job.location}</span>
            </div>
            
            <div className="job-detail-item">
              <FiBriefcase className="icon" />
              <span>{job.jobType}</span>
            </div>
            
            <div className="job-detail-item">
              <FiCalendar className="icon" />
              <span>{formatDistanceToNow(new Date(job.postedDate), { addSuffix: true })}</span>
            </div>
          </div>

          {(job.email || job.contactNumber) && (
            <div className="job-contact">
              {job.email && (
                <div className="contact-item">
                  <FiMail className="icon" />
                  <span>{job.email}</span>
                </div>
              )}
              {job.contactNumber && (
                <div className="contact-item">
                  <FiPhone className="icon" />
                  <span>{job.contactNumber}</span>
                </div>
              )}
            </div>
          )}

          {job.applyLink && (
            <button 
              className="apply-btn"
              onClick={handleApplyClick}
            >
              <span>Apply Now</span>
              <FiExternalLink className="icon" />
            </button>
          )}
        </div>
      </Link>
    </div>
  );
};

export default JobCard;