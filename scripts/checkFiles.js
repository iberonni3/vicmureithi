
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function checkFiles() {
    console.log('🔍 Attempting to list files in "portfolio" bucket...');

    // Try to list files in the 'work_images/cgt' folder
    const { data, error } = await supabase.storage
        .from('portfolio')
        .list('work_images/cgt');

    if (error) {
        console.log('❌ Error listing files:', error.message);
        if (error.message.includes('Bucket not found')) {
            console.log('   CONFIRMED: The system cannot find the bucket.');
        }
    } else {
        console.log(`✅ Found ${data.length} files in work_images/cgt`);
        if (data.length > 0) {
            console.log('   First file:', data[0].name);
        }
    }
}

checkFiles();
