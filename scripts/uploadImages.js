/**
 * 📤 Supabase Image Upload Script (Direct Upload Version)
 * 
 * This version skips bucket detection and uploads directly
 * Run with: node scripts/uploadImages.js
 */

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;
const BUCKET_NAME = 'portfolio';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const FOLDERS = ['cgt', 'graduation', 'belk', 'kujikubali'];
const IMAGE_COUNTS = {
    cgt: 16,
    graduation: 14,
    belk: 14,
    kujikubali: 16,
};

async function uploadImage(filePath, storagePath) {
    try {
        const fileBuffer = fs.readFileSync(filePath);
        const { data, error } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(storagePath, fileBuffer, {
                contentType: 'image/jpeg',
                cacheControl: '3600',
                upsert: true,
            });

        if (error) {
            throw error;
        }

        return { success: true, data };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function uploadAllImages() {
    console.log('🚀 Starting direct upload to Supabase Storage...\n');
    console.log(`📦 Bucket: ${BUCKET_NAME}`);
    console.log(`🌐 Project: ${SUPABASE_URL}\n`);

    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
        console.error('❌ Missing credentials in .env file!');
        process.exit(1);
    }

    console.log('📁 Starting file uploads...\n');

    let totalUploaded = 0;
    let totalFailed = 0;
    const errors = [];

    // Upload work images
    for (const folder of FOLDERS) {
        console.log(`📂 Uploading ${folder.toUpperCase()} images...`);
        const count = IMAGE_COUNTS[folder];

        for (let i = 1; i <= count; i++) {
            const filename = `${i}.jpg`;
            const localPath = path.join(__dirname, '..', 'public', 'work_images', folder, filename);
            const storagePath = `work_images/${folder}/${filename}`;

            if (!fs.existsSync(localPath)) {
                console.log(`  ⚠️  ${storagePath} - File not found locally`);
                totalFailed++;
                continue;
            }

            process.stdout.write(`  📤 ${storagePath}... `);
            const result = await uploadImage(localPath, storagePath);

            if (result.success) {
                console.log('✅');
                totalUploaded++;
            } else {
                console.log(`❌`);
                errors.push({ path: storagePath, error: result.error });
                totalFailed++;
            }

            await new Promise(resolve => setTimeout(resolve, 100));
        }
        console.log('');
    }

    // Upload About image
    console.log('📂 Uploading ABOUT image...');
    const aboutImagePath = path.join(__dirname, '..', 'src', 'assets', 'CA6A8117.jpg');
    if (fs.existsSync(aboutImagePath)) {
        process.stdout.write('  📤 about/CA6A8117.jpg... ');
        const result = await uploadImage(aboutImagePath, 'about/CA6A8117.jpg');
        if (result.success) {
            console.log('✅');
            totalUploaded++;
        } else {
            console.log('❌');
            errors.push({ path: 'about/CA6A8117.jpg', error: result.error });
            totalFailed++;
        }
    }

    // Summary
    console.log('\n' + '═'.repeat(60));
    console.log('📊 UPLOAD SUMMARY');
    console.log('═'.repeat(60));
    console.log(`✅ Successfully uploaded: ${totalUploaded}`);
    console.log(`❌ Failed: ${totalFailed}`);
    console.log(`📦 Total processed: ${totalUploaded + totalFailed}`);
    console.log('═'.repeat(60));

    if (errors.length > 0) {
        console.log('\n⚠️  ERRORS:');
        errors.forEach(({ path, error }) => {
            console.log(`  • ${path}: ${error}`);
        });
    }

    if (totalUploaded > 0) {
        console.log('\n🎉 Upload complete!');
        console.log('\n📝 Next steps:');
        console.log('1. Verify bucket "portfolio" is set to PUBLIC in Supabase');
        console.log('2. Test locally: npm run dev');
        console.log('3. Check if images load on Work and About pages\n');
    } else if (totalFailed > 0 && errors.length > 0) {
        console.log('\n❌ All uploads failed!');
        console.log('\n🔧 Troubleshooting:');
        console.log('1. Check bucket name is exactly "portfolio"');
        console.log('2. Make sure bucket is set to PUBLIC');
        console.log('3. Check Storage policies allow INSERT operations');
        console.log('4. Visit: https://app.supabase.com/project/_/storage/buckets\n');
    }
}

uploadAllImages().catch(console.error);
