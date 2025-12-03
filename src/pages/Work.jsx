import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useTextReveal } from '../hooks/useTextReveal';

const tabs = [
    { id: 'cgt', label: 'CGT', count: 16 },
    { id: 'graduation', label: 'GRADUATION', count: 14 },
    { id: 'belk', label: 'BELK', count: 14 },
    { id: 'kujikubali', label: 'KUJIKUBALI', count: 16 },
];

const WorkImage = ({ src, alt, index, animationKey, shouldAnimate }) => {
    const imgRef = useRef(null);
    const wrapperRef = useRef(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [shouldStartAnimation, setShouldStartAnimation] = useState(false);
    const animationTriggerRef = useRef(null);
    const timeoutRef = useRef(null);

    // Eager load first 4 images for better perceived performance
    const isPriority = index < 4;

    // Check if image is already loaded (cached)
    useEffect(() => {
        if (imgRef.current && imgRef.current.complete && imgRef.current.naturalHeight !== 0) {
            setIsLoaded(true);
            if (shouldAnimate) {
                // Small delay to ensure DOM is ready
                timeoutRef.current = setTimeout(() => setShouldStartAnimation(true), 50);
            }
        }
    }, [src, shouldAnimate]);

    // Handle image load
    const handleImageLoad = () => {
        setIsLoaded(true);
        setHasError(false);
        if (shouldAnimate) {
            // Start animation after image is loaded
            timeoutRef.current = setTimeout(() => setShouldStartAnimation(true), 50);
        }
    };

    // Handle image error with retry
    const handleImageError = (e) => {
        console.warn('Image failed to load:', src);
        setHasError(true);
        // Retry loading after 1 second
        setTimeout(() => {
            if (imgRef.current && !imgRef.current.complete) {
                imgRef.current.src = src + '?t=' + Date.now(); // Add cache bust
            }
        }, 1000);
    };

    // Fallback: Show images after timeout even if animations don't start
    useEffect(() => {
        if (!isLoaded) return;
        
        const fallbackTimeout = setTimeout(() => {
            // If image is loaded but animation hasn't started after 2 seconds, show it anyway
            if (wrapperRef.current && imgRef.current && !shouldStartAnimation) {
                gsap.set(wrapperRef.current, { opacity: 1, scale: 1, y: 0 });
                gsap.set(imgRef.current, { opacity: 1 });
                setShouldStartAnimation(true); // Mark as shown to prevent animation
            }
        }, 2000);

        return () => clearTimeout(fallbackTimeout);
    }, [isLoaded, shouldStartAnimation]);

    // Animate only when image is loaded and should animate
    useEffect(() => {
        if (!shouldStartAnimation || !isLoaded || !wrapperRef.current || !imgRef.current) {
            return;
        }

        const imgElement = imgRef.current;
        const wrapperElement = wrapperRef.current;

        // Kill any existing animations
        if (animationTriggerRef.current) {
            animationTriggerRef.current.kill();
        }

        // Set initial states for dramatic entrance (simplified for performance)
        gsap.set(wrapperElement, {
            opacity: 0,
            scale: 0.9,
            y: 20,
        });
        gsap.set(imgElement, {
            opacity: 0,
        });

        // Create animation timeline with stagger based on index
        const delay = index * 0.04; // Reduced stagger for faster appearance

        const tl = gsap.timeline({ 
            delay,
            onComplete: () => {
                // Clean up will-change after animation
                gsap.set(wrapperElement, { willChange: 'auto' });
                gsap.set(imgElement, { willChange: 'auto' });
            }
        });
        
        tl
            // Simple fade and scale up
            .to(wrapperElement, {
                opacity: 1,
                scale: 1,
                y: 0,
                duration: 0.6,
                ease: "power2.out",
            })
            .to(imgElement, {
                opacity: 1,
                duration: 0.4,
                ease: "power2.out",
            }, "<");

        animationTriggerRef.current = tl;

        return () => {
            if (animationTriggerRef.current) {
                animationTriggerRef.current.kill();
            }
        };
    }, [shouldStartAnimation, isLoaded, index, animationKey]);

    // Cleanup
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            if (animationTriggerRef.current) {
                animationTriggerRef.current.kill();
            }
        };
    }, []);

    // Reset animation state when animationKey changes
    useEffect(() => {
        setShouldStartAnimation(false);
    }, [animationKey]);

    return (
        <div 
            ref={wrapperRef}
            style={{
                breakInside: 'avoid',
                marginBottom: '4rem',
                display: 'inline-block',
                width: '100%',
                opacity: hasError ? 0.3 : 1,
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
                        ref={imgRef}
                        src={src}
                        alt={alt}
                        style={{
                            width: '100%',
                            height: 'auto',
                            display: 'block',
                            opacity: isLoaded ? (shouldStartAnimation ? 0 : 1) : 0.2,
                            transition: 'opacity 0.2s ease',
                        }}
                        loading={isPriority ? "eager" : "lazy"}
                        fetchPriority={isPriority ? "high" : "auto"}
                        decoding="async"
                        onLoad={handleImageLoad}
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
    const [animationKey, setAnimationKey] = useState(0);
    const [shouldAnimate, setShouldAnimate] = useState(true);
    const [isLoading, setIsLoading] = useState(true);

    // Text Reveal Animation for Title
    const titleRef = useTextReveal({
        type: 'chars',
        stagger: 0.05,
        duration: 0.8,
        ease: 'power3.out',
        animateOnMount: true
    });

    // Optimized image preloading with progress tracking
    useEffect(() => {
        setIsLoading(true);
        const preloadImages = (tabId, count) => {
            let loadedCount = 0;
            const toLoad = Math.min(4, count); // Only preload first 4

            if (toLoad === 0) {
                setIsLoading(false);
                return;
            }

            const checkComplete = () => {
                loadedCount++;
                if (loadedCount >= toLoad) {
                    setIsLoading(false);
                }
            };

            // Preload first few images
            for (let i = 1; i <= toLoad; i++) {
                const img = new Image();
                img.onload = checkComplete;
                img.onerror = checkComplete; // Count errors too to not block
                img.src = `/work_images/${tabId}/${i}.jpg`;
            }

            // Fallback timeout
            setTimeout(() => setIsLoading(false), 2000);
        };
        
        // Preload first tab images
        preloadImages(tabs[0].id, tabs[0].count);
    }, []);

    // Handle tab change and trigger animations
    const handleTabChange = (tabId) => {
        if (tabId === activeTab) return;
        
        setIsLoading(true);
        setShouldAnimate(false);
        
        // Preload images for the new tab
        const newTab = tabs.find(t => t.id === tabId);
        if (newTab) {
            let loadedCount = 0;
            const toLoad = Math.min(4, newTab.count);

            const checkComplete = () => {
                loadedCount++;
                if (loadedCount >= toLoad) {
                    setIsLoading(false);
                    setShouldAnimate(true);
                }
            };

            // Preload first few images
            for (let i = 1; i <= toLoad; i++) {
                const img = new Image();
                img.onload = checkComplete;
                img.onerror = checkComplete;
                img.src = `/work_images/${tabId}/${i}.jpg`;
            }

            // Fallback timeout
            setTimeout(() => {
                setIsLoading(false);
                setShouldAnimate(true);
            }, 2000);
        }
        
        // Change tab
        setActiveTab(tabId);
        
        // Increment animation key to trigger animations
        setAnimationKey(prev => prev + 1);
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
                        disabled={isLoading && tab.id !== activeTab}
                        style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '1.1rem',
                            fontWeight: 600,
                            cursor: isLoading && tab.id !== activeTab ? 'wait' : 'pointer',
                            color: activeTab === tab.id ? '#1a1a1a' : '#999',
                            borderBottom: activeTab === tab.id ? '2px solid #1a1a1a' : '2px solid transparent',
                            paddingBottom: '0.5rem',
                            transition: 'all 0.3s ease',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            opacity: isLoading && tab.id !== activeTab ? 0.5 : 1,
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
                    opacity: isLoading ? 0.5 : 1,
                    transition: 'opacity 0.3s ease',
                }}
            >
                {images.map((num, index) => (
                    <WorkImage
                        key={`${activeTab}-${num}`}
                        src={`/work_images/${activeTab}/${num}.jpg`}
                        alt={`${activeTab} ${num}`}
                        index={index}
                        animationKey={animationKey}
                        shouldAnimate={shouldAnimate}
                    />
                ))}
            </div>

            <Footer />
        </div>
    );
};

export default Work;
