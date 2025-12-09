import React, { useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import gsap from 'gsap';

const Contact = () => {
    const containerRef = useRef(null);
    const formRef = useRef(null);

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
                stagger: 0.1,
                ease: 'power3.out',
                delay: 0.6
            });

            // Animate Form
            gsap.from(formRef.current, {
                y: 50,
                opacity: 0,
                duration: 0.8,
                ease: 'power3.out',
                delay: 0.8
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

                <div className="contact-grid" style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '6rem',
                    alignItems: 'start'
                }}>

                    {/* Left Column: Text & Info */}
                    <div className="contact-left">
                        <h1 className="contact-title" style={{
                            fontSize: '5vw',
                            fontWeight: 600,
                            lineHeight: 1.1,
                            marginBottom: '3rem',
                            color: '#1a1a1a'
                        }}>
                            LET'S CREATE <br />
                            <span style={{ color: '#999' }}>SOMETHING</span> <br />
                            TOGETHER.
                        </h1>

                        <div className="contact-details" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            <div className="contact-info-item">
                                <h3 style={{ fontSize: '0.9rem', textTransform: 'uppercase', color: '#999', marginBottom: '0.5rem', letterSpacing: '1px' }}>Email</h3>
                                <a href="mailto:hello@vicmureithi.com" style={{ fontSize: '1.5rem', color: '#1a1a1a', fontWeight: 500 }}>hello@vicmureithi.com</a>
                            </div>

                            <div className="contact-info-item">
                                <h3 style={{ fontSize: '0.9rem', textTransform: 'uppercase', color: '#999', marginBottom: '0.5rem', letterSpacing: '1px' }}>Socials</h3>
                                <div style={{ display: 'flex', gap: '1.5rem' }}>
                                    <a href="#" style={{ fontSize: '1.1rem', color: '#1a1a1a', borderBottom: '1px solid #ccc' }}>Instagram</a>
                                    <a href="#" style={{ fontSize: '1.1rem', color: '#1a1a1a', borderBottom: '1px solid #ccc' }}>Twitter</a>
                                    <a href="#" style={{ fontSize: '1.1rem', color: '#1a1a1a', borderBottom: '1px solid #ccc' }}>LinkedIn</a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Form */}
                    <div className="contact-right">
                        <form ref={formRef} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            <div className="form-group">
                                <label style={{ display: 'block', fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>Name</label>
                                <input type="text" placeholder="Your Name" style={{
                                    width: '100%',
                                    padding: '1rem 0',
                                    background: 'transparent',
                                    border: 'none',
                                    borderBottom: '1px solid #ccc',
                                    fontSize: '1.2rem',
                                    color: '#1a1a1a',
                                    outline: 'none',
                                    transition: 'border-color 0.3s'
                                }}
                                    onFocus={(e) => e.target.style.borderColor = '#1a1a1a'}
                                    onBlur={(e) => e.target.style.borderColor = '#ccc'}
                                />
                            </div>

                            <div className="form-group">
                                <label style={{ display: 'block', fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>Email</label>
                                <input type="email" placeholder="Your Email" style={{
                                    width: '100%',
                                    padding: '1rem 0',
                                    background: 'transparent',
                                    border: 'none',
                                    borderBottom: '1px solid #ccc',
                                    fontSize: '1.2rem',
                                    color: '#1a1a1a',
                                    outline: 'none',
                                    transition: 'border-color 0.3s'
                                }}
                                    onFocus={(e) => e.target.style.borderColor = '#1a1a1a'}
                                    onBlur={(e) => e.target.style.borderColor = '#ccc'}
                                />
                            </div>

                            <div className="form-group">
                                <label style={{ display: 'block', fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>Message</label>
                                <textarea placeholder="Tell me about your project..." rows="4" style={{
                                    width: '100%',
                                    padding: '1rem 0',
                                    background: 'transparent',
                                    border: 'none',
                                    borderBottom: '1px solid #ccc',
                                    fontSize: '1.2rem',
                                    color: '#1a1a1a',
                                    outline: 'none',
                                    resize: 'none',
                                    transition: 'border-color 0.3s',
                                    fontFamily: 'inherit'
                                }}
                                    onFocus={(e) => e.target.style.borderColor = '#1a1a1a'}
                                    onBlur={(e) => e.target.style.borderColor = '#ccc'}
                                ></textarea>
                            </div>

                            <button type="submit" style={{
                                marginTop: '2rem',
                                padding: '1rem 3rem',
                                background: '#1a1a1a',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '999px',
                                fontSize: '1rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                alignSelf: 'flex-start',
                                transition: 'transform 0.2s'
                            }}
                                onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                                onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                            >
                                Send Message
                            </button>
                        </form>
                    </div>

                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Contact;
