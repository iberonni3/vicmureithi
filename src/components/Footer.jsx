import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Twitter, Linkedin, Mail, ArrowUpRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';


gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
    const footerRef = useRef(null);
    const brandRef = useRef(null);
    const columnsRef = useRef([]);
    const bottomRef = useRef(null);
    const currentYear = new Date().getFullYear();

    const socialLinks = [
        { name: 'Instagram', icon: Instagram, url: 'https://instagram.com/vicmureithi' },
        { name: 'Twitter', icon: Twitter, url: 'https://twitter.com/vicmureithi' },
        { name: 'LinkedIn', icon: Linkedin, url: 'https://linkedin.com/in/vicmureithi' },
        { name: 'Email', icon: Mail, url: 'mailto:hello@vicmureithi.com' }
    ];

    const pageLinks = [
        { name: 'About', url: '/#about' },
        { name: 'Work', url: '/work' },
        { name: 'Contact', url: '/contact' }
    ];

    const serviceLinks = [
        { name: 'Wedding Photography', url: '#weddings' },
        { name: 'Portrait Sessions', url: '#portraits' },
        { name: 'Commercial Work', url: '#commercial' },
        { name: 'Event Coverage', url: '#events' }
    ];

    return (
        <footer className="footer" ref={footerRef}>
            <div className="footer-container">
                {/* Top Section - Main Content */}
                <div className="footer-top">


                    {/* Brand Section */}
                    <div className="footer-brand" ref={brandRef}>
                        <h2 className="footer-logo">VP.</h2>
                        <p className="footer-tagline">
                            Capturing moments that tell your story.
                        </p>
                        <Link to="/contact" className="footer-cta">
                            Book a Session
                            <ArrowUpRight size={18} />
                        </Link>
                    </div>

                    {/* Links Sections */}
                    <div className="footer-links-grid">
                        {/* Pages */}
                        <div className="footer-column" ref={el => columnsRef.current[0] = el}>
                            <h3 className="footer-column-title">Pages</h3>
                            <ul className="footer-list">
                                {pageLinks.map((link) => (
                                    <li key={link.name}>
                                        {link.url.startsWith('#') ? (
                                            <a href={link.url} className="footer-link">
                                                {link.name}
                                            </a>
                                        ) : (
                                            <Link to={link.url} className="footer-link">
                                                {link.name}
                                            </Link>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Services */}
                        <div className="footer-column" ref={el => columnsRef.current[1] = el}>
                            <h3 className="footer-column-title">Services</h3>
                            <ul className="footer-list">
                                {serviceLinks.map((link) => (
                                    <li key={link.name}>
                                        <a href={link.url} className="footer-link">
                                            {link.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Social */}
                        <div className="footer-column" ref={el => columnsRef.current[2] = el}>
                            <h3 className="footer-column-title">Connect</h3>
                            <ul className="footer-list footer-social-list">
                                {socialLinks.map((social) => {
                                    const Icon = social.icon;
                                    return (
                                        <li key={social.name}>
                                            <a
                                                href={social.url}
                                                className="footer-social-link"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <Icon size={18} />
                                                <span>{social.name}</span>
                                            </a>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Bottom Section - Copyright & Legal */}
                <div className="footer-bottom" ref={bottomRef}>
                    <div className="footer-bottom-content">
                        <p className="footer-copyright">
                            © {currentYear} Vic Mureithi. All rights reserved.
                        </p>
                        <div className="footer-legal">
                            <a href="#privacy" className="footer-legal-link">
                                Privacy Policy
                            </a>
                            <span className="footer-divider">•</span>
                            <a href="#terms" className="footer-legal-link">
                                Terms of Service
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
