import { Link, useNavigate } from 'react-router-dom';
import { FiLogOut, FiHome } from 'react-icons/fi';
import { authAPI } from '../utils/api';
import { removeAuthToken, getUser } from '../utils/auth';
import toast from 'react-hot-toast';

const Navbar = () => {
  const navigate = useNavigate();
  const user = getUser();

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      removeAuthToken();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      removeAuthToken();
      navigate('/login');
    }
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/dashboard" className="navbar-brand">
            <FiHome className="icon" />
            Admin Panel
          </Link>

          <div className="navbar-right">
            <span className="user-email">{user?.email}</span>
            <button onClick={handleLogout} className="logout-btn">
              <FiLogOut className="icon" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;