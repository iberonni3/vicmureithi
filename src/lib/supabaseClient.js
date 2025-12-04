import { createClient } from '@supabase/supabase-js';

// These will be set in your .env file
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if credentials are available
const hasCredentials = supabaseUrl && supabaseAnonKey;

if (!hasCredentials) {
    console.warn('⚠️ Supabase credentials not found. Please add them to your .env file.');
}

// Only create client if credentials exist
export const supabase = hasCredentials
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

/**
 * Get optimized image URL from Supabase Storage
 * @param {string} path - Path to image in storage (e.g., 'work_images/cgt/1.jpg')
 * @param {object} options - Transformation options
 * @returns {string} Optimized image URL
 */
export function getOptimizedImageUrl(path, options = {}) {
    // Fallback to local images if Supabase not configured
    if (!supabase) {
        console.warn('Supabase not configured, using local images');
        return `/work_images/${path.replace('work_images/', '')}`;
    }

    // Get the standard public URL without transformations
    // Image transformations require Supabase Pro plan
    const { data } = supabase.storage
        .from('portfolio')
        .getPublicUrl(path);

    return data.publicUrl;
}

/**
 * Upload image to Supabase Storage
 * @param {File|Blob} file - File to upload
 * @param {string} path - Destination path in storage
 * @returns {Promise} Upload result
 */
export async function uploadImage(file, path) {
    const { data, error } = await supabase.storage
        .from('portfolio')
        .upload(path, file, {
            cacheControl: '3600',
            upsert: true, // Overwrite if exists
        });

    if (error) {
        throw error;
    }

    return data;
}
