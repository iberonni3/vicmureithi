import { Cloudinary } from '@cloudinary/url-gen';
import { auto } from '@cloudinary/url-gen/actions/resize';
import { autoGravity } from '@cloudinary/url-gen/qualifiers/gravity';
import { format, quality } from '@cloudinary/url-gen/actions/delivery';

// Initialize Cloudinary instance
const cld = new Cloudinary({
    cloud: {
        cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
    },
});

/**
 * Generate an optimized Cloudinary URL for a portfolio image
 * @param {string} folder - The category folder (e.g., 'cgt', 'graduation')
 * @param {string|number} index - The image index/name (e.g., 1, 2)
 * @param {object} options - Optimization options
 * @param {number} options.width - Target width (default: 1200)
 * @returns {string} The optimized image URL
 */
export const getCloudinaryImageUrl = (folder, index, { width = 1200 } = {}) => {
    if (!import.meta.env.VITE_CLOUDINARY_CLOUD_NAME) {
        console.warn('⚠️ Cloudinary Cloud Name not found in environment variables');
        return '';
    }

    // Construct the public ID matching the upload script structure
    // Example: portfolio/cgt/1
    const publicId = `portfolio/${folder}/${index}`;

    const myImage = cld.image(publicId);

    // Apply optimizations
    myImage
        .resize(auto().width(width).gravity(autoGravity()))
        .delivery(format('auto')) // WebP/AVIF automatically
        .delivery(quality('auto')); // Smart compression

    return myImage.toURL();
};
