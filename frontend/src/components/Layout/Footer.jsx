import React, { useContext } from 'react';
import { Context } from "../../main";
import { Link } from "react-router-dom";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import "./Footer.css";

function Footer() {
  const { isAuthorized } = useContext(Context);

  return (
    <footer className={`custom-footer ${isAuthorized ? "footer-show" : "footer-hide"}`}>
      <div className="footer-content">
        <div className="footer-text">
          <p>&copy; All Rights Reserved by parul.</p>
        </div>
        <div className="footer-links">
          <Link
            to={'https://github.com/anshdeep0504'}
            target='_blank'
            className="social-link"
            aria-label="GitHub"
          >
            <FaGithub />
          </Link>
          <Link
            to={'https://www.linkedin.com/in/anshdeep-singh-a01649231/'}
            target='_blank'
            className="social-link"
            aria-label="LinkedIn"
          >
            <FaLinkedin />
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
