import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTextReveal } from '../hooks/useTextReveal';

gsap.registerPlugin(ScrollTrigger);

const tabs = [
    { id: 'cgt', label: 'CGT', count: 16 },
    { id: 'graduation', label: 'GRADUATION', count: 14 },
    { id: 'belk', label: 'BELK', count: 14 },
    { id: 'kujikubali', label: 'KUJIKUBALI', count: 16 },
];

const WorkImage = ({ src, alt, index }) => {
    const animWrapperRef = useRef(null);
    const imgRef = useRef(null);
    const [isLoaded, setIsLoaded] = useState(false);

    // Eager load first 4 images for better perceived performance
    const isPriority = index < 4;

    React.useLayoutEffect(() => {
        if (!isLoaded) return;

        const ctx = gsap.context(() => {
            if (!animWrapperRef.current || !imgRef.current) return;

            // Set initial states - Reduced scale to prevent "grain" look
            gsap.set(animWrapperRef.current, {
                clipPath: "inset(50% 50% 50% 50%)",
                opacity: 0,
                scale: 0.9,
                rotationY: 10,
            });
            gsap.set(imgRef.current, {
                scale: 1.1,
                filter: "brightness(0.5) blur(4px)",
                willChange: 'transform, filter',
                backfaceVisibility: 'hidden'
            });

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: animWrapperRef.current,
                    start: "top 90%",
                    toggleActions: "play none none reverse"
                }
            });

            tl.to(animWrapperRef.current, {
                clipPath: "inset(0% 0% 0% 0%)",
                opacity: 1,
                scale: 1,
                rotationY: 0,
                duration: 1.2,
                ease: "expo.out",
            })
                .to(imgRef.current, {
                    scale: 1,
                    filter: "brightness(1) blur(0px)",
                    duration: 1.2,
                    ease: "power2.out",
                }, "<0.1");

        }, animWrapperRef);

        return () => ctx.revert();
    }, [src, isLoaded]);

    // Check if image is already loaded (cached)
    useEffect(() => {
        if (imgRef.current && imgRef.current.complete) {
            setIsLoaded(true);
        }
    }, []);

    return (
        <div style={{
            breakInside: 'avoid',
            marginBottom: '4rem',
            display: 'inline-block',
            width: '100%'
        }}>
            <div
                ref={animWrapperRef}
                className="work-image-inner"
                style={{
                    borderRadius: '0px',
                    overflow: 'hidden',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                    transformStyle: 'preserve-3d',
                    perspective: '1000px',
                    opacity: 0 // Prevent FOUC
                }}
            >
                <img
                    ref={imgRef}
                    src={src}
                    alt={alt}
                    style={{ width: '100%', height: 'auto', display: 'block' }}
                    loading={isPriority ? "eager" : "lazy"}
                    fetchPriority={isPriority ? "high" : "auto"}
                    onLoad={() => {
                        setIsLoaded(true);
                        ScrollTrigger.refresh();
                    }}
                />
            </div>
        </div>
    );
};

const Work = () => {
    const [activeTab, setActiveTab] = useState(tabs[0].id);
    const containerRef = useRef(null);

    // Text Reveal Animation for Title
    const titleRef = useTextReveal({
        type: 'chars',
        stagger: 0.05,
        duration: 0.8,
        ease: 'power3.out',
        animateOnMount: true // Animate immediately when page loads
    });

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
                        onClick={() => setActiveTab(tab.id)}
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

            <div className="work-gallery" ref={containerRef} style={{
                columnCount: 2,
                columnGap: '4rem',
                padding: '0 4rem',
                maxWidth: '1800px',
                margin: '0 auto'
            }}>
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
