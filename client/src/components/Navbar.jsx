import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="site-nav">
      <div className="container nav-inner">
        <Link to="/" className="logo">
          <span className="logo-icon" aria-hidden>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="6" width="20" height="14" rx="2" fill="#ffffff" opacity="0.06" />
              <path d="M8 6V5a2 2 0 012-2h4a2 2 0 012 2v1" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              <rect x="3" y="6" width="18" height="12" rx="2" stroke="#fff" strokeWidth="1" opacity="0.9" />
              <path d="M9.5 12.5l1.5 1.5L14.5 10" stroke="#FF7A2D" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>

          <span className="logo-text">Offcampus Jobs</span>
        </Link>

        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
