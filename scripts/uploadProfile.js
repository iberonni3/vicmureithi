import { v2 as cloudinary } from 'cloudinary';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.VITE_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

const PROFILE_PATH = path.join(__dirname, '../public/profile.jpg');

async function uploadProfile() {
    if (!fs.existsSync(PROFILE_PATH)) {
        console.error('❌ Profile image not found at:', PROFILE_PATH);
        return;
    }

    console.log('🚀 Processing profile image...');

    // Resize
    const tempPath = PROFILE_PATH + '.temp.jpg';
    await sharp(PROFILE_PATH)
        .resize({ width: 1200, withoutEnlargement: true })
        .jpeg({ quality: 90 })
        .toFile(tempPath);

    console.log('✅ Resized profile image.');

    // Upload
    try {
        const result = await cloudinary.uploader.upload(tempPath, {
            public_id: 'portfolio/about/profile',
            overwrite: true,
            resource_type: 'image',
        });
        console.log(`✨ Uploaded profile image! URL: ${result.secure_url}`);
    } catch (err) {
        console.error('❌ Upload failed:', err.message);
    } finally {
        if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
    }
}

uploadProfile().catch(console.error);
