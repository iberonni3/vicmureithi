import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useTextReveal } from '../hooks/useTextReveal';
import { getCloudinaryImageUrl } from '../lib/cloudinaryClient';
import gsap from 'gsap';

const tabs = [
    { id: 'cgt', label: 'CGT', count: 16 },
    { id: 'graduation', label: 'GRADUATION', count: 14 },
    { id: 'belk', label: 'BELK', count: 14 },
    { id: 'kujikubali', label: 'KUJIKUBALI', count: 16 },
];

const WorkImage = ({ alt, index, folder }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);
    const containerRef = useRef(null);
    const imageRef = useRef(null);

    // Generate Cloudinary URL
    const imageNum = index + 1;
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

    let imageUrl;
    if (cloudName) {
        imageUrl = getCloudinaryImageUrl(folder, imageNum, { width: 1200 });
    } else {
        imageUrl = `/work_images/${folder}/${imageNum}.jpg`;
    }

    const handleImageLoad = () => {
        setIsLoaded(true);
    };

    const handleImageError = () => {
        if (cloudName) {
            console.warn('Cloudinary image failed, falling back to local:', imageUrl);
            setHasError(true);
        }
        setIsLoaded(true);
    };

    // Animation effect when loaded
    useEffect(() => {
        if (isLoaded && containerRef.current && imageRef.current) {
            gsap.fromTo(imageRef.current,
                {
                    opacity: 0,
                    y: 30,
                    scale: 0.95,
                    filter: 'blur(10px)'
                },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    filter: 'blur(0px)',
                    duration: 0.8,
                    ease: "power3.out",
                    delay: index % 3 * 0.1 // Stagger effect based on column position
                }
            );
        }
    }, [isLoaded, index]);

    // Eager load first 4 images, lazy load the rest
    const loadingStrategy = index < 4 ? "eager" : "lazy";

    return (
        <div
            ref={containerRef}
            style={{
                breakInside: 'avoid',
                marginBottom: '4rem',
                display: 'inline-block',
                width: '100%',
                position: 'relative',
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
                    position: 'relative',
                }}
            >
                {/* Loading Skeleton */}
                {!isLoaded && (
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        minHeight: '300px',
                        backgroundColor: '#f0f0f0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1
                    }}>
                        <div className="loading-spinner" style={{
                            width: '30px',
                            height: '30px',
                            border: '2px solid #ddd',
                            borderTop: '2px solid #333',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite'
                        }} />
                    </div>
                )}

                {/* Show image or fallback/error state */}
                <img
                    ref={imageRef}
                    src={hasError ? `/work_images/${folder}/${imageNum}.jpg` : imageUrl}
                    alt={alt}
                    style={{
                        width: '100%',
                        height: 'auto',
                        display: 'block',
                        opacity: 0, // Handled by GSAP
                    }}
                    loading={loadingStrategy}
                    decoding="async"
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                />
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

            <div
                key={activeTab}
                className="work-gallery"
                style={{
                    columnCount: 2,
                    columnGap: '4rem',
                    padding: '0 4rem',
                    maxWidth: '1800px',
                    margin: '0 auto',
                    // Removed CSS animation in favor of per-image GSAP
                }}
            >
                <style>{`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
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

            <Footer />
        </div>
    );
};

export default Work;
