import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useTextReveal } from '../hooks/useTextReveal';

const tabs = [
    { id: 'cgt', label: 'CGT', count: 16 },
    { id: 'graduation', label: 'GRADUATION', count: 14 },
    { id: 'belk', label: 'BELK', count: 14 },
    { id: 'kujikubali', label: 'KUJIKUBALI', count: 16 },
];

const WorkImage = ({ src, alt, index }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);

    // Eager load first 6 images for better perceived performance
    const isPriority = index < 6;

    // Check if image is already loaded (cached)
    useEffect(() => {
        const img = new Image();
        img.onload = () => setIsLoaded(true);
        img.onerror = () => setHasError(true);
        img.src = src;

        // Check if already cached
        if (img.complete && img.naturalHeight !== 0) {
            setIsLoaded(true);
        }
    }, [src]);

    // Handle image error with retry
    const handleImageError = (e) => {
        console.warn('Image failed to load:', src);
        setHasError(true);
        // Retry loading after 1 second
        setTimeout(() => {
            if (!isLoaded) {
                const retryImg = new Image();
                retryImg.onload = () => {
                    setIsLoaded(true);
                    setHasError(false);
                    if (e.target) {
                        e.target.src = src + '?t=' + Date.now();
                    }
                };
                retryImg.src = src + '?t=' + Date.now();
            }
        }, 1000);
    };

    return (
        <div 
            style={{
                breakInside: 'avoid',
                marginBottom: '4rem',
                display: 'inline-block',
                width: '100%',
            }}
        >
            <div
                className="work-image-inner"
                style={{
                    borderRadius: '0px',
                    overflow: 'hidden',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                    backgroundColor: '#f5f5f5',
                    minHeight: '200px',
                }}
            >
                {!hasError ? (
                    <img
                        src={src}
                        alt={alt}
                        style={{
                            width: '100%',
                            height: 'auto',
                            display: 'block',
                            opacity: isLoaded ? 1 : 0.3,
                            transition: 'opacity 0.3s ease',
                        }}
                        loading={isPriority ? "eager" : "lazy"}
                        fetchPriority={isPriority ? "high" : "auto"}
                        decoding="async"
                        onLoad={() => setIsLoaded(true)}
                        onError={handleImageError}
                    />
                ) : (
                    <div style={{
                        width: '100%',
                        paddingTop: '75%',
                        backgroundColor: '#e0e0e0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#999',
                        fontSize: '0.9rem'
                    }}>
                        Image unavailable
                    </div>
                )}
            </div>
        </div>
    );
};

const Work = () => {
    const [activeTab, setActiveTab] = useState(tabs[0].id);

    // Text Reveal Animation for Title
    const titleRef = useTextReveal({
        type: 'chars',
        stagger: 0.05,
        duration: 0.8,
        ease: 'power3.out',
        animateOnMount: true
    });

    // Handle tab change
    const handleTabChange = (tabId) => {
        if (tabId === activeTab) return;
        setActiveTab(tabId);
    };

    const currentTab = tabs.find(t => t.id === activeTab);
    const images = Array.from({ length: currentTab.count }, (_, i) => i + 1);

    return (
        <div className="work-page" style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
            <Navbar />
            <div className="work-header" style={{ paddingTop: '80px', paddingBottom: '60px', textAlign: 'center' }}>
                <h1 ref={titleRef} className="hero-title" style={{ fontSize: '4vw', fontWeight: 600, margin: 0 }}>PORTFOLIO</h1>
            </div>

            <div className="tabs-container" style={{ display: 'flex', justifyContent: 'center', gap: '3rem', marginBottom: '4rem', flexWrap: 'wrap', padding: '0 2rem' }}>
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => handleTabChange(tab.id)}
                        style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '1.1rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            color: activeTab === tab.id ? '#1a1a1a' : '#999',
                            borderBottom: activeTab === tab.id ? '2px solid #1a1a1a' : '2px solid transparent',
                            paddingBottom: '0.5rem',
                            transition: 'all 0.3s ease',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                        }}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div
                key={activeTab}
                className="work-gallery"
                style={{
                    columnCount: 2,
                    columnGap: '4rem',
                    padding: '0 4rem',
                    maxWidth: '1800px',
                    margin: '0 auto',
                }}
            >
                {images.map((num, index) => (
                    <WorkImage
                        key={`${activeTab}-${num}`}
                        src={`/work_images/${activeTab}/${num}.jpg`}
                        alt={`${activeTab} ${num}`}
                        index={index}
                    />
                ))}
            </div>

            <Footer />
        </div>
    );
};

export default Work;
