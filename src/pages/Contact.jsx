import React, { useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import gsap from 'gsap';

const Contact = () => {
    const containerRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Animate Title
            gsap.from('.contact-title', {
                y: 100,
                opacity: 0,
                duration: 1,
                ease: 'power4.out',
                delay: 0.2
            });

            // Animate Info
            gsap.from('.contact-info-item', {
                y: 50,
                opacity: 0,
                duration: 0.8,
                stagger: 0.15,
                ease: 'power3.out',
                delay: 0.6
            });

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div className="contact-page" style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
            <Navbar />

            <div ref={containerRef} className="contact-container" style={{
                paddingTop: '180px',
                paddingBottom: '100px',
                maxWidth: '1400px',
                margin: '0 auto',
                paddingLeft: '2rem',
                paddingRight: '2rem'
            }}>

                {/* Centered Email Layout */}
                <div className="contact-content" style={{
                    textAlign: 'center',
                    maxWidth: '900px',
                    margin: '0 auto'
                }}>

                    {/* Main Title */}
                    <h1 className="contact-title" style={{
                        fontSize: 'clamp(3rem, 8vw, 6rem)',
                        fontWeight: 600,
                        lineHeight: 1.1,
                        marginBottom: '2rem',
                        color: '#1a1a1a'
                    }}>
                        LET'S CREATE <br />
                        <span style={{ color: '#999' }}>SOMETHING</span> <br />
                        TOGETHER.
                    </h1>

                    {/* Subtitle */}
                    <p style={{
                        fontSize: 'clamp(1.1rem, 2vw, 1.5rem)',
                        color: '#666',
                        marginBottom: '4rem',
                        lineHeight: 1.6
                    }} className="contact-info-item">
                        Have a project in mind or want to collaborate? <br />
                        I'd love to hear from you. Drop me an email and let's bring your vision to life.
                    </p>

                    {/* Email CTA Card */}
                    <div className="contact-info-item" style={{
                        background: 'linear-gradient(135deg, #f8f8f8 0%, #fff 100%)',
                        border: '1px solid #e0e0e0',
                        borderRadius: '24px',
                        padding: 'clamp(2.5rem, 5vw, 4rem)',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.05)',
                        transition: 'all 0.3s ease',
                        marginBottom: '3rem'
                    }}>
                        <h3 style={{
                            fontSize: '1rem',
                            textTransform: 'uppercase',
                            color: '#999',
                            marginBottom: '1.5rem',
                            letterSpacing: '2px',
                            fontWeight: 500
                        }}>
                            Email Me At
                        </h3>

                        <a
                            href="mailto:hello@vicmureithi.com"
                            style={{
                                fontSize: 'clamp(1.5rem, 3.5vw, 2.5rem)',
                                color: '#1a1a1a',
                                fontWeight: 600,
                                textDecoration: 'none',
                                display: 'inline-block',
                                transition: 'all 0.3s ease',
                                borderBottom: '3px solid transparent'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.color = '#ff6b35';
                                e.target.style.borderBottomColor = '#ff6b35';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.color = '#1a1a1a';
                                e.target.style.borderBottomColor = 'transparent';
                            }}
                        >
                            hello@vicmureithi.com
                        </a>

                        <button
                            onClick={() => window.location.href = 'mailto:hello@vicmureithi.com'}
                            style={{
                                marginTop: '2.5rem',
                                padding: '1.25rem 3rem',
                                background: '#1a1a1a',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '999px',
                                fontSize: '1.1rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.transform = 'translateY(-2px)';
                                e.target.style.boxShadow = '0 6px 25px rgba(0,0,0,0.2)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
                            }}
                        >
                            Send Email
                        </button>
                    </div>

                    {/* Social Links */}
                    <div className="contact-info-item" style={{
                        paddingTop: '2rem',
                        borderTop: '1px solid #e0e0e0'
                    }}>
                        <h3 style={{
                            fontSize: '0.9rem',
                            textTransform: 'uppercase',
                            color: '#999',
                            marginBottom: '1.5rem',
                            letterSpacing: '2px'
                        }}>
                            Or Connect With Me
                        </h3>
                        <div style={{
                            display: 'flex',
                            gap: '2rem',
                            justifyContent: 'center',
                            flexWrap: 'wrap'
                        }}>
                            <a
                                href="https://www.instagram.com/mureithiiii"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    fontSize: '1.2rem',
                                    color: '#1a1a1a',
                                    textDecoration: 'none',
                                    padding: '0.5rem 1.5rem',
                                    borderRadius: '999px',
                                    border: '2px solid #e0e0e0',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.borderColor = '#1a1a1a';
                                    e.target.style.transform = 'translateY(-2px)';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.borderColor = '#e0e0e0';
                                    e.target.style.transform = 'translateY(0)';
                                }}
                            >
                                Instagram
                            </a>
                            <a
                                href="https://www.behance.net/passtrinity"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    fontSize: '1.2rem',
                                    color: '#1a1a1a',
                                    textDecoration: 'none',
                                    padding: '0.5rem 1.5rem',
                                    borderRadius: '999px',
                                    border: '2px solid #e0e0e0',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.borderColor = '#1a1a1a';
                                    e.target.style.transform = 'translateY(-2px)';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.borderColor = '#e0e0e0';
                                    e.target.style.transform = 'translateY(0)';
                                }}
                            >
                                Behance
                            </a>
                        </div>
                    </div>

                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Contact;
