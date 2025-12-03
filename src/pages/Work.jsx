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

const WorkImage = ({ src, alt, index, animationKey }) => {
    const imgRef = useRef(null);
    const wrapperRef = useRef(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const animationTriggerRef = useRef(null);

    // Eager load first 6 images for better perceived performance
    const isPriority = index < 6;

    // Check if image is already loaded (cached)
    useEffect(() => {
        if (imgRef.current && imgRef.current.complete) {
            setIsLoaded(true);
        }
    }, [src]);

    // Animate immediately when component mounts or animationKey changes
    useEffect(() => {
        // Use requestAnimationFrame to ensure DOM is ready
        const rafId = requestAnimationFrame(() => {
            if (!wrapperRef.current || !imgRef.current) return;

            const imgElement = imgRef.current;
            const wrapperElement = wrapperRef.current;

            // Kill any existing animations
            if (animationTriggerRef.current) {
                animationTriggerRef.current.kill();
            }

            // Set initial states for dramatic entrance (similar to about section)
            gsap.set(wrapperElement, {
                clipPath: "inset(30% 30% 30% 30%)",
                opacity: 0,
                scale: 0.85,
                rotationY: 8,
            });
            gsap.set(imgElement, {
                scale: 1.2,
                filter: "brightness(0.5) blur(8px)",
                willChange: 'transform, filter',
                backfaceVisibility: 'hidden'
            });

            // Create animation timeline with stagger based on index
            const delay = index * 0.06; // Stagger each image (reduced for faster appearance)

            const tl = gsap.timeline({ 
                delay,
                onComplete: () => {
                    // Clean up will-change after animation
                    gsap.set(imgElement, { willChange: 'auto' });
                }
            });
            
            tl
                // Stage 1: Explosive reveal from center
                .to(wrapperElement, {
                    clipPath: "inset(0% 0% 0% 0%)",
                    opacity: 1,
                    scale: 1.02,
                    rotationY: 0,
                    duration: 0.8,
                    ease: "expo.out",
                })
                // Stage 2: Image sharpens and brightens
                .to(imgElement, {
                    scale: 1,
                    filter: "brightness(1) blur(0px)",
                    duration: 0.7,
                    ease: "power3.out",
                }, "<0.15")
                // Stage 3: Settle to final position
                .to(wrapperElement, {
                    scale: 1,
                    duration: 0.3,
                    ease: "power2.inOut",
                }, "-=0.5");

            animationTriggerRef.current = tl;
        });

        return () => {
            cancelAnimationFrame(rafId);
            if (animationTriggerRef.current) {
                animationTriggerRef.current.kill();
            }
        };
    }, [index, animationKey]); // Trigger when animationKey changes (tab changes)

    return (
        <div 
            ref={wrapperRef}
            style={{
                breakInside: 'avoid',
                marginBottom: '4rem',
                display: 'inline-block',
                width: '100%'
            }}
        >
            <div
                className="work-image-inner"
                style={{
                    borderRadius: '0px',
                    overflow: 'hidden',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                    willChange: 'transform',
                    transformStyle: 'preserve-3d',
                    backfaceVisibility: 'hidden'
                }}
            >
                <img
                    ref={imgRef}
                    src={src}
                    alt={alt}
                    style={{
                        width: '100%',
                        height: 'auto',
                        display: 'block',
                        opacity: isLoaded ? 1 : 0.2,
                        transition: 'opacity 0.3s ease'
                    }}
                    loading={isPriority ? "eager" : "lazy"}
                    fetchPriority={isPriority ? "high" : "auto"}
                    onLoad={() => {
                        setIsLoaded(true);
                    }}
                    onError={(e) => {
                        console.error('Image failed to load:', src);
                        e.target.style.display = 'none';
                    }}
                />
            </div>
        </div>
    );
};

const Work = () => {
    const [activeTab, setActiveTab] = useState(tabs[0].id);
    const [animationKey, setAnimationKey] = useState(0); // Key to trigger animations

    // Text Reveal Animation for Title
    const titleRef = useTextReveal({
        type: 'chars',
        stagger: 0.05,
        duration: 0.8,
        ease: 'power3.out',
        animateOnMount: true
    });

    // Preload images for the first tab on mount
    useEffect(() => {
        const preloadImages = (tabId, count) => {
            // Preload first 8 images for immediate display
            for (let i = 1; i <= Math.min(8, count); i++) {
                const img = new Image();
                img.src = `/work_images/${tabId}/${i}.jpg`;
            }
        };
        
        // Preload first tab images
        preloadImages(tabs[0].id, tabs[0].count);
    }, []);

    // Handle tab change and trigger animations
    const handleTabChange = (tabId) => {
        if (tabId === activeTab) return;
        
        // Preload images for the new tab
        const newTab = tabs.find(t => t.id === tabId);
        if (newTab) {
            // Preload first 8 images in the background
            for (let i = 1; i <= Math.min(8, newTab.count); i++) {
                const img = new Image();
                img.src = `/work_images/${tabId}/${i}.jpg`;
            }
        }
        
        // Change tab - this will remount the gallery with new key
        setActiveTab(tabId);
        
        // Increment animation key to trigger animations in new components
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
                            letterSpacing: '0.05em'
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
                    margin: '0 auto'
                }}
            >
                {images.map((num, index) => (
                    <WorkImage
                        key={`${activeTab}-${num}`}
                        src={`/work_images/${activeTab}/${num}.jpg`}
                        alt={`${activeTab} ${num}`}
                        index={index}
                        animationKey={animationKey}
                    />
                ))}
            </div>

            <Footer />
        </div>
    );
};

export default Work;
