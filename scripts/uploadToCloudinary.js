import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Load environment variables
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

const IMAGES_DIR = path.join(__dirname, '../public/work_images');

async function uploadImages() {
    if (!process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
        console.error('❌ Missing Cloudinary credentials. Please check your .env file.');
        process.exit(1);
    }

    console.log('🚀 Starting upload to Cloudinary...');

    // Get all subdirectories (categories)
    const categories = fs.readdirSync(IMAGES_DIR).filter(file => {
        return fs.statSync(path.join(IMAGES_DIR, file)).isDirectory();
    });

    for (const category of categories) {
        const categoryPath = path.join(IMAGES_DIR, category);
        const files = fs.readdirSync(categoryPath).filter(file =>
            /\.(jpg|jpeg|png|webp)$/i.test(file)
        );

        console.log(`\n📂 Processing category: ${category} (${files.length} images)`);

        for (const file of files) {
            const filePath = path.join(categoryPath, file);
            const fileName = path.parse(file).name; // e.g., "1" from "1.jpg"

            // Create a structured public ID: portfolio/category/filename
            // Example: portfolio/cgt/1
            const publicId = `portfolio/${category}/${fileName}`;

            try {
                // Check if image already exists to avoid re-uploading
                // (Optional: remove this check if you want to overwrite)
                try {
                    await cloudinary.api.resource(publicId);
                    console.log(`  ✅ Skipped (already exists): ${publicId}`);
                    continue;
                } catch (err) {
                    // Resource not found, proceed to upload
                }

                console.log(`  ⬆️ Uploading: ${file}...`);

                const result = await cloudinary.uploader.upload(filePath, {
                    public_id: publicId,
                    folder: `portfolio/${category}`, // This organizes them in the dashboard
                    overwrite: true,
                    resource_type: 'image',
                });

                console.log(`     ✨ Done! URL: ${result.secure_url}`);
            } catch (error) {
                console.error(`  ❌ Failed to upload ${file}:`, error.message);
            }
        }
    }

    console.log('\n🎉 All uploads finished!');
}

uploadImages().catch(console.error);
