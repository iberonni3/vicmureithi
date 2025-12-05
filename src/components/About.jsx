import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getCloudinaryImageUrl } from '../lib/cloudinaryClient';
import { useTextReveal } from '../hooks/useTextReveal';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
    const sectionRef = useRef(null);
    const imageWrapperRef = useRef(null);
    const imageRef = useRef(null);
    const textRef = useRef(null);

    // Buttery smooth text reveal animations
    const h2Ref = useTextReveal({
        type: 'chars',
        stagger: 0.03,
        duration: 0.6,
        ease: 'power2.out',
        from: { opacity: 0, y: 50, rotationX: 0, filter: 'blur(5px)' },
        to: { opacity: 1, y: 0, rotationX: 0, filter: 'blur(0px)' }
    });

    const p1Ref = useTextReveal({
        type: 'words',
        stagger: 0.015,
        duration: 0.5,
        ease: 'power2.out',
        trigger: 'top 80%',
        from: { opacity: 0, y: 30, filter: 'blur(3px)' },
        to: { opacity: 1, y: 0, filter: 'blur(0px)' }
    });

    const p2Ref = useTextReveal({
        type: 'words',
        stagger: 0.015,
        duration: 0.5,
        ease: 'power2.out',
        trigger: 'top 80%',
        from: { opacity: 0, y: 30, filter: 'blur(3px)' },
        to: { opacity: 1, y: 0, filter: 'blur(0px)' }
    });

    const p3Ref = useTextReveal({
        type: 'words',
        stagger: 0.015,
        duration: 0.5,
        ease: 'power2.out',
        trigger: 'top 80%',
        from: { opacity: 0, y: 30, filter: 'blur(3px)' },
        to: { opacity: 1, y: 0, filter: 'blur(0px)' }
    });

    const aboutImageUrl = getCloudinaryImageUrl('about', 'profile', {
        width: 1200
    });

    console.log('About Image URL:', aboutImageUrl); // Debug log

    useEffect(() => {
        console.log('About component mounted'); // Debug log
        const ctx = gsap.context(() => {
            // Check if refs are ready
            if (!imageWrapperRef.current || !imageRef.current || !textRef.current) {
                console.warn('About refs not ready:', {
                    wrapper: !!imageWrapperRef.current,
                    image: !!imageRef.current,
                    text: !!textRef.current
                });
                return;
            }

            const imgElement = imageRef.current.querySelector('img');
            if (!imgElement) {
                console.warn('About image element not found');
                return;
            }

            console.log('Initializing About animations'); // Debug log

            // CINEMATIC IMAGE ENTRANCE
            const imageTl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 75%",
                    toggleActions: "play none none reverse"
                }
            });

            // Set initial states for dramatic entrance
            gsap.set(imageWrapperRef.current, {
                clipPath: "inset(50% 50% 50% 50%)",
                opacity: 0, // Ensure it starts invisible
                scale: 0.8,
                rotationY: 15,
            });
            gsap.set(imgElement, {
                scale: 1.5,
                filter: "brightness(0.3) blur(12px)",
                willChange: 'transform, filter',
                backfaceVisibility: 'hidden'
            });

            // Dramatic multi-stage reveal
            imageTl
                // Stage 1: Explosive reveal from center
                .to(imageWrapperRef.current, {
                    clipPath: "inset(0% 0% 0% 0%)",
                    opacity: 1,
                    scale: 1.05,
                    rotationY: 0,
                    duration: 1.6,
                    ease: "expo.out",
                })
                // Stage 2: Image sharpens and brightens
                .to(imgElement, {
                    scale: 1,
                    filter: "brightness(1) blur(0px)",
                    duration: 1.4,
                    ease: "power3.out",
                }, "<0.2")
                // Stage 3: Settle to final position
                .to(imageWrapperRef.current, {
                    scale: 1,
                    duration: 0.6,
                    ease: "power2.inOut",
                }, "-=0.8");

            // 2. Parallax Effect for Image (Subtle movement during scroll)
            gsap.to(imageRef.current, {
                y: -40,
                ease: "none",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 0.5
                }
            });

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section className="about" ref={sectionRef} id="about">
            <div className="about-content">
                <div className="about-image-wrapper" ref={imageWrapperRef}>
                    <div className="about-image" ref={imageRef}>
                        <img
                            src={aboutImageUrl || '/profile.jpg'}
                            alt="Vic Passiani"
                            onLoad={() => console.log('About image loaded')}
                            onError={(e) => console.error('About image failed to load', e)}
                        />
                    </div>
                </div>
                <div className="about-text" ref={textRef}>
                    <h2 ref={h2Ref}>About Vic</h2>
                    <p ref={p1Ref}>
                        Photography, for me, is a way of translating emotion into something you can see, feel, and return to. I've always been drawn to the cinematic — the dramatic interplay of shadow and light, the tension of a moment, the mood that lingers long after the shutter closes. Every project is an opportunity to craft images that are not only visually striking but emotionally immersive.
                    </p>
                    <p ref={p2Ref} style={{ marginTop: '1.5rem' }}>
                        I approach each shoot with a storyteller's mindset. I look for the raw, unguarded moments that reveal character — the quick glance, the shifting posture, the unspoken energy between people. Through careful direction, creative lighting, and a deep focus on atmosphere, I shape images that feel alive and intentional.
                    </p>
                    <p ref={p3Ref} style={{ marginTop: '1.5rem' }}>
                        Whether it's a portrait session, editorial series, or branded visual campaign, I aim to create photography that moves people — images that hold emotion, inspire imagination, and elevate the story they're meant to tell.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default About;
