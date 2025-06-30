import React from 'react';
import { Link } from 'react-router-dom';
import '../assets/css/footer.css'; 

const Footer = () => {
  return (
    <footer className="footer-custom text-light pt-5 pb-4 mt-auto">
      <div className="container">
        <div className="row">
          <div className="col-lg-4 col-md-12 mb-4 text-center text-lg-start">
            <h5 className="fw-bold f-title mb-3">
              <i className="fa-regular fa-compass"></i> WanderLust
            </h5>
            <p className="small text-muted-custom">
              Explore the world with ease — find unique stays, plan perfect trips, and make memories.
            </p>
          </div>
          <div className="col-lg-2 col-md-4 col-sm-6 col-12 mb-4 text-center text-lg-start">
            <h6 className="text-uppercase fw-semibold mb-3">Quick Links</h6>
            <ul className="list-unstyled">
              <li className="mb-2"><Link to="/listings" className="footer-link">Home</Link></li>
              <li className="mb-2"><Link to="/listings" className="footer-link">Listings</Link></li>
              <li className="mb-2"><Link to="/dashboard" className="footer-link">Bookings</Link></li>
              <li><Link to="/support" className="footer-link">Support</Link></li>
            </ul>
          </div>
          <div className="col-lg-3 col-md-4 col-sm-6 col-12 mb-4 text-center text-lg-start">
            <h6 className="text-uppercase fw-semibold mb-3">Legal</h6>
            <ul className="list-unstyled">
              <li className="mb-2"><Link to="/privacy" className="footer-link">Privacy Policy</Link></li>
              <li className="mb-2"><Link to="/terms" className="footer-link">Terms of Service</Link></li>
              <li><Link to="/refunds" className="footer-link">Refund Policy</Link></li>
            </ul>
          </div>
          <div className="col-lg-3 col-md-4 col-12 mb-4 text-center text-lg-start">
            <h6 className="text-uppercase fw-semibold mb-3">Follow Us</h6>
            <div className="d-flex gap-3 fs-4 justify-content-center justify-content-lg-start">
              <a href="#" className="footer-icon"><i className="fa-brands fa-square-facebook"></i></a>
              <a href="https://www.instagram.com/g.vamshi_yadav?igsh=MXk5dmFyZ2ttcmQw&utm_source=ig_contact_invite" className="footer-icon"><i className="fa-brands fa-square-instagram"></i></a>
              <a href="https://www.linkedin.com/in/vamshi-yadav-gundelly-674023283/" className="footer-icon"><i className="fa-brands fa-linkedin"></i></a>
              <a href="https://github.com/gundellyvamshiyadav" className="footer-icon"><i className="fa-brands fa-square-github"></i></a>
            </div>
          </div>
        </div>
        <div className="text-center border-top border-secondary pt-3 mt-3 text-muted-custom small">
          © {new Date().getFullYear()} <strong>Gundelly Vamshi Yadav</strong> • Made with <span className="text-danger-custom">❤️</span> for WanderLust Explorers
        </div>
      </div>
    </footer>
  );
};

export default Footer;