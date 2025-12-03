import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

/**
 * Custom hook for SplitText hover animations
 * Splits text into characters and animates them on hover
 */
export const useSplitTextHover = () => {
    const textRef = useRef(null);
    const [chars, setChars] = useState([]);
    const isHovering = useRef(false);

    useEffect(() => {
        if (!textRef.current) return;

        // Split text into individual characters
        const text = textRef.current.textContent;
        const characters = text.split('').map((char, index) => ({
            char: char === ' ' ? '\u00A0' : char, // Use non-breaking space
            index
        }));

        setChars(characters);

        // Clear original text and replace with spans
        textRef.current.innerHTML = '';
        characters.forEach((item, index) => {
            const span = document.createElement('span');
            span.textContent = item.char;
            span.className = 'char';
            span.style.display = 'inline-block';
            span.style.willChange = 'transform';
            span.style.transition = 'color 0.3s ease';

            textRef.current.appendChild(span);
        });

        // Get all character spans
        const charSpans = textRef.current.querySelectorAll('.char');

        // Hover enter animation
        const handleMouseEnter = () => {
            isHovering.current = true;

            // Animate each character with stagger
            gsap.to(charSpans, {
                y: -20,
                rotationX: 15,
                scale: 1.1,
                color: '#FF6B35', // Vibrant orange
                duration: 0.6,
                stagger: {
                    each: 0.03,
                    from: 'start',
                    ease: 'power2.out'
                },
                ease: 'back.out(2)',
            });

            // Add individual character bounce
            charSpans.forEach((char, index) => {
                gsap.to(char, {
                    y: Math.sin(index * 0.5) * -10,
                    rotation: Math.sin(index) * 5,
                    duration: 0.8,
                    ease: 'elastic.out(1, 0.5)',
                    delay: index * 0.03
                });
            });
        };

        // Hover leave animation
        const handleMouseLeave = () => {
            isHovering.current = false;

            gsap.to(charSpans, {
                y: 0,
                rotationX: 0,
                rotation: 0,
                scale: 1,
                color: '#222222', // Back to original
                duration: 0.5,
                stagger: {
                    each: 0.02,
                    from: 'end',
                    ease: 'power2.inOut'
                },
                ease: 'power3.out',
            });
        };

        // Add event listeners
        textRef.current.addEventListener('mouseenter', handleMouseEnter);
        textRef.current.addEventListener('mouseleave', handleMouseLeave);

        const currentRef = textRef.current;

        return () => {
            if (currentRef) {
                currentRef.removeEventListener('mouseenter', handleMouseEnter);
                currentRef.removeEventListener('mouseleave', handleMouseLeave);
            }
        };
    }, []);

    return textRef;
};
