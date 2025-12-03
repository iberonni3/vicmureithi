import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { splitTextIntoChars, splitTextIntoWords } from '../utils/textSplitter';

gsap.registerPlugin(ScrollTrigger);

/**
 * Buttery smooth text reveal animation hook
 * @param {Object} options - Animation options
 * @param {string} options.trigger - ScrollTrigger trigger point (e.g., "top 80%")
 * @param {string} options.type - 'chars' or 'words'
 * @param {number} options.stagger - Stagger delay between elements
 * @param {number} options.duration - Animation duration
 * @param {string} options.ease - GSAP ease function
 * @param {boolean} options.animateOnMount - Animate immediately without scroll trigger
 */
export const useTextReveal = (options = {}) => {
    const {
        trigger = 'top 85%',
        type = 'chars',
        stagger = 0.02,
        duration = 0.8,
        ease = 'power3.out',
        animateOnMount = false,
        from = { 
            opacity: 0, 
            y: 100, 
            rotationX: 45,
            filter: 'blur(8px)'
        },
        to = { 
            opacity: 1, 
            y: 0, 
            rotationX: 0,
            filter: 'blur(0px)'
        }
    } = options;

    const elementRef = useRef(null);
    const splitElementsRef = useRef([]);

    useEffect(() => {
        if (!elementRef.current) return;

        // Split the text
        const splitFunction = type === 'chars' ? splitTextIntoChars : splitTextIntoWords;
        splitElementsRef.current = splitFunction(elementRef.current);

        if (!splitElementsRef.current || splitElementsRef.current.length === 0) return;

        // Set initial state with performance hints
        gsap.set(splitElementsRef.current, {
            ...from,
            transformOrigin: '50% 50%',
            willChange: 'transform, opacity, filter',
            force3D: true,
            backfaceVisibility: 'hidden'
        });

        // Create animation
        if (animateOnMount) {
            // Animate immediately on mount
            gsap.to(splitElementsRef.current, {
                ...to,
                duration,
                stagger,
                ease,
            });
        } else {
            // Animate on scroll
            gsap.to(splitElementsRef.current, {
                ...to,
                duration,
                stagger,
                ease,
                scrollTrigger: {
                    trigger: elementRef.current,
                    start: trigger,
                    toggleActions: 'play none none reverse',
                },
            });
        }

        return () => {
            ScrollTrigger.getAll().forEach(st => {
                if (st.trigger === elementRef.current) {
                    st.kill();
                }
            });
        };
    }, [trigger, type, stagger, duration, ease, animateOnMount]);

    return elementRef;
};
