import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useTextReveal } from '../hooks/useTextReveal';
import { getOptimizedImageUrl } from '../lib/supabaseClient';

const tabs = [
    { id: 'cgt', label: 'CGT', count: 16 },
    { id: 'graduation', label: 'GRADUATION', count: 14 },
    { id: 'belk', label: 'BELK', count: 14 },
    { id: 'kujikubali', label: 'KUJIKUBALI', count: 16 },
];

const WorkImage = ({ src, alt, index, folder }) => {
    const [hasError, setHasError] = useState(false);

    // Generate optimized Supabase URL
    const imageNum = index + 1;
    const supabasePath = `work_images/${folder}/${imageNum}.jpg`;

    // Get optimized URL
    const optimizedUrl = getOptimizedImageUrl(supabasePath, {
        width: 1200,
        quality: 85,
        format: 'origin',
    });

    const handleImageError = (e) => {
        console.warn('Image failed to load:', optimizedUrl);
        setHasError(true);
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
                        src={optimizedUrl}
                        alt={alt}
                        style={{
                            width: '100%',
                            height: 'auto',
                            display: 'block',
                        }}
                        loading="eager"
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
    const [isLoading, setIsLoading] = useState(true);

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

    // Preload images when tab changes
    useEffect(() => {
        setIsLoading(true);

        const preloadImage = (num) => {
            return new Promise((resolve) => {
                const img = new Image();
                const supabasePath = `work_images/${activeTab}/${num}.jpg`;
                const url = getOptimizedImageUrl(supabasePath, {
                    width: 1200,
                    quality: 85,
                    format: 'origin',
                });

                img.onload = () => resolve();
                img.onerror = () => resolve(); // Resolve even on error to avoid blocking
                img.src = url;
            });
        };

        Promise.all(images.map(num => preloadImage(num)))
            .then(() => {
                // Small delay to ensure smooth transition
                setTimeout(() => setIsLoading(false), 100);
            });
    }, [activeTab]);

    return (
        <div className="work-page" style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
            <Navbar />
            <div className="work-header" style={{ paddingTop: '140px', paddingBottom: '60px', textAlign: 'center' }}>
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

            {isLoading ? (
                <div style={{
                    height: '50vh',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                    gap: '1rem'
                }}>
                    <div className="loading-spinner" style={{
                        width: '40px',
                        height: '40px',
                        border: '3px solid #eee',
                        borderTop: '3px solid #1a1a1a',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                    }} />
                    <span style={{ fontSize: '0.9rem', color: '#666', letterSpacing: '0.05em' }}>LOADING GALLERY...</span>
                    <style>{`
                        @keyframes spin {
                            0% { transform: rotate(0deg); }
                            100% { transform: rotate(360deg); }
                        }
                    `}</style>
                </div>
            ) : (
                <div
                    key={activeTab}
                    className="work-gallery"
                    style={{
                        columnCount: 2,
                        columnGap: '4rem',
                        padding: '0 4rem',
                        maxWidth: '1800px',
                        margin: '0 auto',
                        opacity: 0,
                        animation: 'fadeIn 0.5s ease forwards'
                    }}
                >
                    <style>{`
                        @keyframes fadeIn {
                            from { opacity: 0; transform: translateY(20px); }
                            to { opacity: 1; transform: translateY(0); }
                        }
                    `}</style>
                    {images.map((num, index) => (
                        <WorkImage
                            key={`${activeTab}-${num}`}
                            folder={activeTab}
                            alt={`${activeTab} ${num}`}
                            index={index}
                        />
                    ))}
                </div>
            )}

            <Footer />
        </div>
    );
};

export default Work;
