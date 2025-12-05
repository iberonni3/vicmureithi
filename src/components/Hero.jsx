import React, { useEffect, useRef, Suspense, useState } from 'react';
import gsap from 'gsap';
import SplitText from 'gsap/SplitText';

// Lazy load the 3D scene to reduce initial bundle size
const PolaroidScene = React.lazy(() => import('./PolaroidScene'));

gsap.registerPlugin(SplitText);

const Hero = () => {
    const containerRef = useRef(null);
    const titleRef = useRef(null);
    const subtitleRef = useRef(null);

    // Mobile detection - don't load 3D on mobile devices
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        // Check on mount
        checkMobile();

        // Check on resize
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        if (!titleRef.current || !subtitleRef.current) return;

        let ctx;

        // Wait for fonts to load before splitting text to avoid layout shifts
        document.fonts.ready.then(() => {
            ctx = gsap.context(() => {
                // Split title into characters using GSAP SplitText
                const split = new SplitText(titleRef.current, { type: 'chars' });
                const chars = split.chars;

                // Wrap each char in a container for masking effect
                const wrappedChars = [];
                chars.forEach((char) => {
                    const wrapper = document.createElement('span');
                    wrapper.style.cssText = 'position: relative; display: inline-block; overflow: hidden; padding: 0.018em 0.02em;';

                    // Clone the character for the reveal effect
                    const clone = char.cloneNode(true);
                    clone.style.cssText = 'position: absolute; top: 0; left: 0; color: #FF6B35; transform: translateY(100%);';

                    char.parentNode.insertBefore(wrapper, char);
                    wrapper.appendChild(char);
                    wrapper.appendChild(clone);

                    wrappedChars.push({ original: char, clone: clone, wrapper: wrapper });
                });

                // Performance hints
                gsap.set(chars, { willChange: 'transform, opacity', transformOrigin: '50% 50% -20px', force3D: true, backfaceVisibility: 'hidden' });
                gsap.set(titleRef.current, { perspective: 1000 });

                // Initial Entry Animation - staged character reveal (more dramatic)
                const tl = gsap.timeline({ delay: 0.4 });
                tl.from(chars, {
                    y: 120,
                    rotationX: 90,
                    opacity: 0,
                    scale: 0.3,
                    duration: 1.4,
                    ease: 'back.out(1.4)',
                    stagger: { each: 0.04, from: 'start' }
                })
                    .fromTo(subtitleRef.current,
                        { y: 20, opacity: 0 },
                        { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out' },
                        '-=0.8'
                    );

                // Masking hover animation
                const onEnter = () => {
                    wrappedChars.forEach((item, i) => {
                        // Original slides up and out
                        gsap.to(item.original, {
                            y: -100,
                            opacity: 0,
                            duration: 0.6,
                            ease: 'power3.in',
                            delay: i * 0.03
                        });
                        // Clone slides up and in
                        gsap.to(item.clone, {
                            y: 0,
                            duration: 0.6,
                            ease: 'power3.out',
                            delay: i * 0.03
                        });
                    });
                };

                const onLeave = () => {
                    wrappedChars.forEach((item, i) => {
                        // Clone slides down and out completely (translateY(100%))
                        gsap.to(item.clone, {
                            y: '100%',
                            duration: 0.6,
                            ease: 'power3.in',
                            delay: i * 0.02
                        });
                        // Original slides back in
                        gsap.to(item.original, {
                            y: 0,
                            opacity: 1,
                            duration: 0.6,
                            ease: 'power3.out',
                            delay: i * 0.02
                        });
                    });
                };

                titleRef.current.addEventListener('mouseenter', onEnter);
                titleRef.current.addEventListener('mouseleave', onLeave);

                // Cleanup logic for listeners is handled by GSAP context revert, 
                // but we need to revert SplitText manually if needed, or rely on context.
                // Since we modify DOM, context.revert() should handle most GSAP tweaks,
                // but DOM structure changes (wrapping) persist unless we manually revert SplitText.
                // However, SplitText.revert() restores original HTML.

                return () => {
                    titleRef.current?.removeEventListener('mouseenter', onEnter);
                    titleRef.current?.removeEventListener('mouseleave', onLeave);
                    split.revert();
                };

            }, containerRef);
        });

        return () => {
            if (ctx) ctx.revert();
        };
    }, []);

    return (
        <section className="hero" ref={containerRef}>
            {!isMobile && (
                <Suspense fallback={<div style={{ position: 'absolute', width: '100%', height: '100%', background: 'var(--color-bg)' }} />}>
                    <PolaroidScene />
                </Suspense>
            )}

            <h1
                ref={titleRef}
                className="hero-title"
                style={{
                    fontFamily: 'Inter Tight',
                    fontWeight: 600,
                    fontSize: '10rem',
                    cursor: 'pointer',
                    perspective: '1000px',
                    transformStyle: 'preserve-3d'
                }}
            >
                VIC MUREITHI
            </h1>

            <div className="hero-subtitle" ref={subtitleRef}>
                <div className="hero-pill">
                    Professional Photographer <span className="pro">PRO</span>
                </div>
            </div>
        </section >
    );
};

export default Hero;
