/**
 * Custom Text Splitter - Alternative to GSAP SplitText
 * Splits text into characters or words wrapped in spans for animation
 */

export const splitTextIntoChars = (element) => {
    if (!element) return;
    
    const text = element.textContent;
    const chars = text.split('');
    
    element.innerHTML = chars
        .map((char, index) => {
            if (char === ' ') {
                return `<span class=\"char\" style=\"display: inline-block; white-space: pre; will-change: transform, opacity, filter; backface-visibility: hidden; transform: translateZ(0);\">&nbsp;</span>`;
            }
            return `<span class=\"char\" style=\"display: inline-block; will-change: transform, opacity, filter; backface-visibility: hidden; transform: translateZ(0);\">${char}</span>`;
        })
        .join('');
    
    return element.querySelectorAll('.char');
};

export const splitTextIntoWords = (element) => {
    if (!element) return;
    
    const text = element.textContent;
    const words = text.split(' ');
    
    element.innerHTML = words
        .map((word, index) => {
            return `<span class=\"word\" style=\"display: inline-block; will-change: transform, opacity, filter; backface-visibility: hidden; transform: translateZ(0);\">${word}</span>${index < words.length - 1 ? ' ' : ''}`;
        })
        .join('');
    
    return element.querySelectorAll('.word');
};

export const splitTextIntoLines = (element) => {
    if (!element) return;
    
    const text = element.textContent;
    const words = text.split(' ');
    
    element.innerHTML = words
        .map((word) => {
            return `<span class=\"line-wrapper\" style=\"display: inline-block; overflow: hidden; vertical-align: top; will-change: transform, opacity, filter; backface-visibility: hidden; transform: translateZ(0);\"><span class=\"word\" style=\"display: inline-block; will-change: transform, opacity, filter; backface-visibility: hidden; transform: translateZ(0);\">${word}</span></span> `;
        })
        .join('');
    
    return element.querySelectorAll('.word');
};
