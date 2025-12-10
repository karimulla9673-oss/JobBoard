import { Link } from 'react-router-dom';
import { FiMapPin, FiBriefcase, FiCalendar, FiMail, FiPhone, FiExternalLink, FiShare2 } from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';

const JobCard = ({ job }) => {
  const handleApplyClick = (e) => {
    if (job.applyLink) {
      e.preventDefault();
      window.open(job.applyLink, '_blank', 'noopener,noreferrer');
    }
  };

  const handleShare = (e) => {
    e.preventDefault();
    const jobUrl = `${window.location.origin}/jobs/${job._id}/${job.slug}`;
    if (navigator.share) {
      navigator
        .share({ title: job.title, text: `Check this job: ${job.title} at ${job.company}`, url: jobUrl })
        .catch((err) => console.log('Error sharing:', err));
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(jobUrl).then(() => {
        alert('Job link copied to clipboard!');
      });
    } else {
      window.prompt('Copy this link:', jobUrl);
    }
  };

  return (
    <div className="job-card">
      <Link to={`/jobs/${job._id}/${job.slug}`} className="job-card-link">
        <div className="job-image">
          {job.imageUrl ? (
            <img src={job.imageUrl} alt={`${job.title} at ${job.company}`} loading="lazy" />
          ) : (
            <div style={{ width: '100%', height: '100%', background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-color)', fontWeight: 700 }}>{job.company?.charAt(0) || 'J'}</div>
          )}
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

          <div className="job-engagement">
            <button 
              className="engagement-btn share-btn"
              onClick={handleShare}
              title="Share this job"
            >
              <FiShare2 className="icon" />
              <span>Share</span>
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default JobCard;