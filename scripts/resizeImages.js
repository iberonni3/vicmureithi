import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const IMAGES_DIR = path.join(__dirname, '../public/work_images');
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB threshold
const MAX_WIDTH = 2500; // Resize to this width if too large

async function resizeLargeImages() {
    console.log('🔍 Scanning for large images (> 5MB)...');

    const categories = fs.readdirSync(IMAGES_DIR).filter(file => {
        return fs.statSync(path.join(IMAGES_DIR, file)).isDirectory();
    });

    for (const category of categories) {
        const categoryPath = path.join(IMAGES_DIR, category);
        const files = fs.readdirSync(categoryPath).filter(file =>
            /\.(jpg|jpeg|png|webp)$/i.test(file)
        );

        for (const file of files) {
            const filePath = path.join(categoryPath, file);
            const stats = fs.statSync(filePath);

            if (stats.size > MAX_SIZE_BYTES) {
                console.log(`\n⚠️  Found large file: ${category}/${file} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);

                const tempPath = filePath + '.temp';

                try {
                    await sharp(filePath)
                        .resize({ width: MAX_WIDTH, withoutEnlargement: true })
                        .jpeg({ quality: 85 }) // Compress slightly
                        .toFile(tempPath);

                    // Replace original with resized version
                    fs.unlinkSync(filePath);
                    fs.renameSync(tempPath, filePath);

                    const newStats = fs.statSync(filePath);
                    console.log(`   ✅ Resized to: ${(newStats.size / 1024 / 1024).toFixed(2)} MB`);
                } catch (err) {
                    console.error(`   ❌ Failed to resize ${file}:`, err.message);
                    if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
                }
            }
        }
    }
    console.log('\n✨ Resize check complete.');
}

resizeLargeImages().catch(console.error);
