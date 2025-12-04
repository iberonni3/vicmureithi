/**
 * 🔍 Debug Script - Check Supabase Connection
 * 
 * This script tests your Supabase connection and lists all buckets
 */

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

console.log('🔍 Testing Supabase Connection...\n');
console.log('URL:', SUPABASE_URL);
console.log('Key:', SUPABASE_ANON_KEY ? `${SUPABASE_ANON_KEY.substring(0, 20)}...` : 'NOT SET');
console.log('');

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testConnection() {
    console.log('📋 Listing all buckets...\n');

    const { data: buckets, error } = await supabase.storage.listBuckets();

    if (error) {
        console.error('❌ Error:', error.message);
        console.error('Full error:', error);
        return;
    }

    if (buckets && buckets.length > 0) {
        console.log(`✅ Found ${buckets.length} bucket(s):\n`);
        buckets.forEach(bucket => {
            console.log(`  📦 ${bucket.name}`);
            console.log(`     Public: ${bucket.public}`);
            console.log(`     Created: ${bucket.created_at}`);
            console.log('');
        });
    } else {
        console.log('⚠️  No buckets found');
        console.log('\nThis means you need to create a bucket named "portfolio" in your Supabase dashboard.');
    }
}

testConnection().catch(console.error);
