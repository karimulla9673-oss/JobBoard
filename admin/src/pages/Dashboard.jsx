import { Link } from 'react-router-dom';
import { FiUpload, FiList } from 'react-icons/fi';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  return (
    <div className="dashboard-page">
      <Navbar />
      
      <div className="container">
        <div className="dashboard-content">
          <h1 className="dashboard-title">Welcome to Admin Dashboard</h1>
          <p className="dashboard-subtitle">Manage your job postings</p>

          <div className="dashboard-cards">
            <Link to="/upload-job" className="dashboard-card">
              <div className="card-icon upload">
                <FiUpload />
              </div>
              <h2>Upload New Job</h2>
              <p>Upload a job poster image and extract details using AI</p>
            </Link>

            <Link to="/manage-jobs" className="dashboard-card">
              <div className="card-icon manage">
                <FiList />
              </div>
              <h2>Manage Jobs</h2>
              <p>View, edit, and delete existing job postings</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;