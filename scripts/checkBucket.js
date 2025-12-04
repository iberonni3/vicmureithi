
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkBucket() {
    console.log('🔍 Checking bucket "portfolio"...');

    const { data: buckets, error } = await supabase.storage.listBuckets();

    if (error) {
        console.error('❌ Error listing buckets:', error.message);
        return;
    }

    const bucket = buckets.find(b => b.name === 'portfolio');

    if (!bucket) {
        console.error('❌ Bucket "portfolio" DOES NOT EXIST.');
        console.log('Available buckets:', buckets.map(b => b.name).join(', '));
    } else {
        console.log('✅ Bucket "portfolio" exists.');
        console.log(`🔒 Public Status: ${bucket.public ? '✅ PUBLIC' : '❌ PRIVATE'}`);

        if (!bucket.public) {
            console.log('\n⚠️  PROBLEM FOUND: The bucket is set to PRIVATE.');
            console.log('   Public URLs will NOT work until you make it public.');
        } else {
            console.log('\n✅ Bucket configuration looks correct.');
        }
    }
}

checkBucket();
