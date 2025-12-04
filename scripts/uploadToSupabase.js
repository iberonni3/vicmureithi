/**
 * 📤 Supabase Image Upload Script
 * 
 * This script uploads all portfolio images from /public/work_images to Supabase Storage.
 * Run with: node scripts/uploadToSupabase.js
 */

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ES Module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load credentials from .env file
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;
const BUCKET_NAME = 'portfolio';

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Portfolio structure
const FOLDERS = ['cgt', 'graduation', 'belk', 'kujikubali'];
const IMAGE_COUNTS = {
    cgt: 16,
    graduation: 14,
    belk: 14,
    kujikubali: 16,
};

/**
 * Check if bucket exists, create if not
 */
async function ensureBucketExists() {
    console.log('🔍 Checking if bucket exists...');

    const { data: buckets, error: listError } = await supabase.storage.listBuckets();

    if (listError) {
        console.error('❌ Error listing buckets:', listError.message);
        return false;
    }

    const bucketExists = buckets.some(bucket => bucket.name === BUCKET_NAME);

    if (!bucketExists) {
        console.log('📦 Creating bucket:', BUCKET_NAME);
        const { error: createError } = await supabase.storage.createBucket(BUCKET_NAME, {
            public: true,
            fileSizeLimit: 52428800, // 50MB
        });

        if (createError) {
            console.error('❌ Error creating bucket:', createError.message);
            console.log('\n⚠️  Cannot create bucket automatically (RLS policy restriction)');
            console.log('📝 Please create the bucket manually:\n');
            console.log('1. Go to: https://app.supabase.com/project/_/storage/buckets');
            console.log('2. Click "New bucket"');
            console.log('3. Name: portfolio');
            console.log('4. Check "Public bucket"');
            console.log('5. Click "Create bucket"');
            console.log('6. Run this script again\n');
            return false;
        }
        console.log('✅ Bucket created successfully!');
    } else {
        console.log('✅ Bucket already exists');
    }

    return true;
}

/**
 * Upload a single image file
 */
async function uploadImage(filePath, storagePath) {
    try {
        const fileBuffer = fs.readFileSync(filePath);
        const { data, error } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(storagePath, fileBuffer, {
                contentType: 'image/jpeg',
                cacheControl: '3600',
                upsert: true, // Overwrite if exists
            });

        if (error) {
            throw error;
        }

        return { success: true, data };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

/**
 * Main upload function
 */
async function uploadAllImages() {
    console.log('🚀 Starting image upload to Supabase...\n');

    // Check credentials
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
        console.error('❌ Missing Supabase credentials!');
        console.error('\n📝 Make sure your .env file contains:');
        console.error('   VITE_SUPABASE_URL=https://xxxxx.supabase.co');
        console.error('   VITE_SUPABASE_ANON_KEY=eyJxxxx...\n');
        console.error('💡 Get credentials from: https://app.supabase.com/project/_/settings/api\n');
        process.exit(1);
    }

    if (!SUPABASE_URL.includes('supabase.co')) {
        console.error('❌ Invalid Supabase URL format!');
        console.error(`   Current value: ${SUPABASE_URL}`);
        console.error('   Expected format: https://xxxxx.supabase.co\n');
        process.exit(1);
    }

    // Ensure bucket exists
    const bucketReady = await ensureBucketExists();
    if (!bucketReady) {
        console.error('❌ Failed to prepare storage bucket');
        process.exit(1);
    }

    console.log('\n📁 Starting file uploads...\n');

    let totalUploaded = 0;
    let totalFailed = 0;

    // Upload images for each folder
    for (const folder of FOLDERS) {
        console.log(`\n📂 Uploading ${folder.toUpperCase()} images...`);
        const count = IMAGE_COUNTS[folder];

        for (let i = 1; i <= count; i++) {
            const filename = `${i}.jpg`;
            const localPath = path.join(__dirname, '..', 'public', 'work_images', folder, filename);
            const storagePath = `work_images/${folder}/${filename}`;

            // Check if file exists locally
            if (!fs.existsSync(localPath)) {
                console.log(`  ⚠️  Skipping ${storagePath} (file not found locally)`);
                totalFailed++;
                continue;
            }

            // Upload
            process.stdout.write(`  📤 ${storagePath}... `);
            const result = await uploadImage(localPath, storagePath);

            if (result.success) {
                console.log('✅');
                totalUploaded++;
            } else {
                console.log(`❌ (${result.error})`);
                totalFailed++;
            }

            // Small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }

    // Upload About image if it exists
    console.log('\n📂 Uploading ABOUT image...');
    const aboutImagePath = path.join(__dirname, '..', 'src', 'assets', 'CA6A8117.jpg');
    if (fs.existsSync(aboutImagePath)) {
        process.stdout.write('  📤 about/CA6A8117.jpg... ');
        const result = await uploadImage(aboutImagePath, 'about/CA6A8117.jpg');
        if (result.success) {
            console.log('✅');
            totalUploaded++;
        } else {
            console.log(`❌ (${result.error})`);
            totalFailed++;
        }
    }

    // Summary
    console.log('\n' + '═'.repeat(50));
    console.log('📊 UPLOAD SUMMARY');
    console.log('═'.repeat(50));
    console.log(`✅ Successfully uploaded: ${totalUploaded}`);
    console.log(`❌ Failed: ${totalFailed}`);
    console.log(`📦 Total processed: ${totalUploaded + totalFailed}`);
    console.log('═'.repeat(50));

    if (totalUploaded > 0) {
        console.log('\n🎉 Upload complete!');
        console.log('\n📝 Next steps:');
        console.log('1. Update your .env file with Supabase credentials');
        console.log('2. The code has been updated to use Supabase URLs');
        console.log('3. Test your portfolio to ensure images load correctly\n');
    }
}

// Run the script
uploadAllImages().catch(console.error);
