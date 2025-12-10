import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div className="footer-links">
          <Link to="/about">About</Link>
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms & Conditions</Link>
          <Link to="/contact">Contact</Link>
        </div>

        <div className="footer-meta">
          <p>Made with ❤️ by Offcampus Jobs</p>
          <p>Contact: <a href="mailto:offcampusjobs786@gmail.com">offcampusjobs786@gmail.com</a></p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
