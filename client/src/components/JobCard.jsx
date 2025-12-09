import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { FiMapPin, FiBriefcase, FiCalendar, FiMail, FiPhone, FiExternalLink, FiThumbsUp, FiThumbsDown, FiMessageCircle, FiShare2 } from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';

const JobCard = ({ job }) => {
  const navigate = useNavigate();
  const [engagement, setEngagement] = useState({
    likes: job.likes?.length || 0,
    dislikes: job.dislikes?.length || 0,
    comments: job.comments?.length || 0,
  });
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);

  const handleApplyClick = (e) => {
    if (job.applyLink) {
      e.preventDefault();
      window.open(job.applyLink, '_blank', 'noopener,noreferrer');
    }
  };

  const handleLike = (e) => {
    e.preventDefault();
    if (!liked) {
      setEngagement(prev => ({
        ...prev,
        likes: prev.likes + 1,
        dislikes: disliked ? prev.dislikes - 1 : prev.dislikes
      }));
      setLiked(true);
      setDisliked(false);
    } else {
      setEngagement(prev => ({ ...prev, likes: prev.likes - 1 }));
      setLiked(false);
    }
  };

  const handleDislike = (e) => {
    e.preventDefault();
    if (!disliked) {
      setEngagement(prev => ({
        ...prev,
        dislikes: prev.dislikes + 1,
        likes: liked ? prev.likes - 1 : prev.likes
      }));
      setDisliked(true);
      setLiked(false);
    } else {
      setEngagement(prev => ({ ...prev, dislikes: prev.dislikes - 1 }));
      setDisliked(false);
    }
  };

  const handleShare = (e) => {
    e.preventDefault();
    if (navigator.share) {
      navigator.share({
        title: job.title,
        text: `Check out this job: ${job.title} at ${job.company}`,
        url: window.location.href,
      }).catch((err) => console.log('Error sharing:', err));
    } else {
      // Fallback: copy link to clipboard
      const jobUrl = `${window.location.origin}/jobs/${job._id}/${job.slug}`;
      navigator.clipboard.writeText(jobUrl);
      alert('Job link copied to clipboard!');
    }
  };

  const handleComments = (e) => {
    e.preventDefault();
    navigate(`/jobs/${job._id}/${job.slug}`);
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

          {/* Engagement Actions */}
          <div className="job-engagement">
            <button 
              className={`engagement-btn like-btn ${liked ? 'active' : ''}`}
              onClick={handleLike}
              title="Like this job"
            >
              <FiThumbsUp className="icon" />
              <span>{engagement.likes}</span>
            </button>
            
            <button 
              className={`engagement-btn dislike-btn ${disliked ? 'active' : ''}`}
              onClick={handleDislike}
              title="Dislike this job"
            >
              <FiThumbsDown className="icon" />
              <span>{engagement.dislikes}</span>
            </button>
            
            <button 
              className="engagement-btn comment-btn"
              onClick={handleComments}
              title="View comments"
            >
              <FiMessageCircle className="icon" />
              <span>{engagement.comments}</span>
            </button>
            
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