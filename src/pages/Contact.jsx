import React, { useEffect, useRef, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import gsap from 'gsap';

const Contact = () => {
    const containerRef = useRef(null);
    const formRef = useRef(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null); // 'success' or 'error'


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

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus(null);

        try {
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    access_key: import.meta.env.VITE_WEB3FORMS_ACCESS_KEY,
                    name: formData.name,
                    email: formData.email,
                    message: formData.message,
                    subject: `New Portfolio Contact from ${formData.name}`,
                    from_name: 'Portfolio Contact Form'
                })
            });

            const result = await response.json();

            if (result.success) {
                setSubmitStatus('success');
                setFormData({ name: '', email: '', message: '' });
            } else {
                throw new Error('Form submission failed');
            }
        } catch (error) {
            console.error('Form submit error:', error);
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };


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
                                <a href="mailto:victorpassiany@gmail.com" style={{ fontSize: '1.5rem', color: '#1a1a1a', fontWeight: 500 }}>victorpassiany@gmail.com</a>
                            </div>

                            <div className="contact-info-item">
                                <h3 style={{ fontSize: '0.9rem', textTransform: 'uppercase', color: '#999', marginBottom: '0.5rem', letterSpacing: '1px' }}>Socials</h3>
                                <div style={{ display: 'flex', gap: '1.5rem' }}>
                                    <a href="https://www.instagram.com/mureithiiii" target="_blank" rel="noopener noreferrer" style={{ fontSize: '1.1rem', color: '#1a1a1a', borderBottom: '1px solid #ccc', textDecoration: 'none' }}>Instagram</a>
                                    <a href="https://www.behance.net/passtrinity" target="_blank" rel="noopener noreferrer" style={{ fontSize: '1.1rem', color: '#1a1a1a', borderBottom: '1px solid #ccc', textDecoration: 'none' }}>Behance</a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Form */}
                    <div className="contact-right">
                        <form ref={formRef} onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            <div className="form-group">
                                <label style={{ display: 'block', fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Your Name"
                                    required
                                    style={{
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
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Your Email"
                                    required
                                    style={{
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
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder="Tell me about your project..."
                                    rows="4"
                                    required
                                    style={{
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

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                style={{
                                    marginTop: '2rem',
                                    padding: '1rem 3rem',
                                    background: isSubmitting ? '#999' : '#1a1a1a',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '999px',
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                                    alignSelf: 'flex-start',
                                    transition: 'transform 0.2s',
                                    opacity: isSubmitting ? 0.7 : 1
                                }}
                                onMouseEnter={(e) => !isSubmitting && (e.target.style.transform = 'scale(1.05)')}
                                onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                            >
                                {isSubmitting ? 'Sending...' : 'Send Message'}
                            </button>

                            {/* Status Messages */}
                            {submitStatus === 'success' && (
                                <div style={{
                                    marginTop: '1.5rem',
                                    padding: '1rem',
                                    background: '#d4edda',
                                    border: '1px solid #c3e6cb',
                                    borderRadius: '8px',
                                    color: '#155724',
                                    fontSize: '0.95rem'
                                }}>
                                    ✓ Message sent successfully! I'll get back to you soon.
                                </div>
                            )}

                            {submitStatus === 'error' && (
                                <div style={{
                                    marginTop: '1.5rem',
                                    padding: '1rem',
                                    background: '#f8d7da',
                                    border: '1px solid #f5c6cb',
                                    borderRadius: '8px',
                                    color: '#721c24',
                                    fontSize: '0.95rem'
                                }}>
                                    ✗ Something went wrong. Please try again or email me directly at victorpassiany@gmail.com
                                </div>
                            )}
                        </form>
                    </div>

                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Contact;
