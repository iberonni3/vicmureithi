import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';


gsap.registerPlugin(ScrollTrigger);

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getLink = (hash) => {
    return isHome ? hash : `/${hash}`;
  };

  return (
    <>
      {/* Top Navbar - Absolute/Static */}
      <nav className={`navbar-top ${isScrolled ? 'hidden' : ''}`}>
        <div className="nav-container">


          <Link to="/" className="logo">VP.</Link>
          <ul className="nav-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/work">Work</Link></li>
            <li><a href={getLink("#about")}>About</a></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>
      </nav>

      {/* Bottom Navbar - Fixed/Floating Pill */}
      <nav className={`navbar-bottom ${isScrolled ? 'visible' : ''}`}>
        <div className="nav-pill-container">
          <Link to="/" className="nav-logo-box">VP.</Link>

          <ul className="nav-links-box">
            <li><Link to="/work">Work</Link></li>
            <li><a href={getLink("#about")}>About</a></li>
            <li><Link to="/">Home</Link></li>
          </ul>

          <div className="nav-cta-box">
            <Link to="/contact">Book Now</Link>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
