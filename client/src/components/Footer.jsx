import { assets } from '../assets/assets';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-brand">
          <img
            className="logo"
           src={assets.logo}
            alt="dummyLogoDark"
          />
          <p>
            We are dedicated to delivering innovative solutions that empower businesses
            and individuals in the digital world. Our mission is to provide quality, reliability,
            and exceptional user experiences through every product we create.
          </p>
        </div>
        <div className="footer-links">
          <div>
            <h2>Company</h2>
            <ul>
              <li><a href="#">Home</a></li>
              <li><a href="#">About us</a></li>
              <li><a href="#">Contact us</a></li>
              <li><a href="#">Privacy policy</a></li>
            </ul>
          </div>
          <div>
            <h2>Subscribe to our newsletter</h2>
            <p>Get the latest updates, insights, and tech news delivered straight to your inbox.</p>
            <div className="subscribe-form">
              <input type="email" placeholder="Enter your email" />
              <button>Subscribe</button>
            </div>
          </div>
        </div>
      </div>
      <p className="footer-bottom">
        Copyright 2024 © <a href='/'>Quick.ai</a>. All Right Reserved.
      </p>
    </footer>
  );
};

export default Footer;
