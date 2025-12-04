# 🚀 Supabase Image Migration Guide

This guide will help you migrate all portfolio images from local storage to Supabase Storage for better performance and CDN delivery.

## 📋 Prerequisites

- A Supabase account (free tier works great!)
- Your portfolio images in `/public/work_images/`

## 🎯 Benefits of Using Supabase Storage

✅ **CDN Distribution** - Images load from servers closest to your users
✅ **Automatic Optimization** - Resize, compress, and serve optimized formats
✅ **Smaller Deployments** - Images aren't included in your build
✅ **Better Caching** - Improved HTTP caching headers
✅ **Easy Updates** - Change images without redeploying

---

## 🔧 Setup Instructions

### Step 1: Get Your Supabase Credentials

1. Go to [app.supabase.com](https://app.supabase.com)
2. Create a new project (or use existing one)
3. Navigate to **Settings** → **API**
4. Copy:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **Anon (public) key** (starts with `eyJ...`)

### Step 2: Create Environment File

Create a `.env` file in your project root:

```bash
# Copy .env.example to .env
cp .env.example .env
```

Then edit `.env` and add your credentials:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

⚠️ **Important**: Never commit `.env` to git! It's already in `.gitignore`.

### Step 3: Upload Images to Supabase

Run the upload script:

```bash
node scripts/uploadToSupabase.js
```

This will:
- Create a `portfolio` bucket in Supabase Storage
- Upload all 60+ images from `/public/work_images/`
- Upload the about image from `/src/assets/`
- Show progress for each upload

**Expected output:**
```
🚀 Starting image upload to Supabase...
🔍 Checking if bucket exists...
✅ Bucket created successfully!

📂 Uploading CGT images...
  📤 work_images/cgt/1.jpg... ✅
  📤 work_images/cgt/2.jpg... ✅
  ...

📊 UPLOAD SUMMARY
══════════════════════════════════════════════════
✅ Successfully uploaded: 61
❌ Failed: 0
📦 Total processed: 61
══════════════════════════════════════════════════
```

### Step 4: Set Storage Bucket to Public

1. Go to **Storage** in Supabase Dashboard
2. Click on the `portfolio` bucket
3. Click **Policies** → **New Policy**
4. Choose **"For full customization"**
5. Add this policy:

**Policy Name:** `Public Access`
**Allowed Operations:** `SELECT`
**Policy Definition:**
```sql
true
```

Or use the template: **"Allow public read access"**

This makes your images publicly accessible (needed for your portfolio).

### Step 5: Test Locally

```bash
npm run dev
```

Visit your portfolio and check:
- ✅ Work page images load correctly
- ✅ About section image loads
- ✅ Images are optimized (check Network tab in DevTools)

### Step 6: Deploy

Once everything works locally:

```bash
npm run build
```

Deploy to your hosting platform (Vercel, Netlify, etc.) and make sure to add your environment variables:

**Vercel:**
1. Go to Project Settings → Environment Variables
2. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

**Netlify:**
1. Go to Site Settings → Environment Variables
2. Add the same variables

---

## 🎨 Image Optimization Features

The implementation automatically optimizes images using these parameters:

```javascript
getOptimizedImageUrl('work_images/cgt/1.jpg', {
  width: 1200,      // Max width (retina-ready)
  quality: 85,      // Compression (1-100)
  format: 'origin', // 'origin' or 'webp'
})
```

### Adjust Optimization

To change optimization settings, edit `src/pages/Work.jsx`:

```javascript
// For better quality (larger files)
width: 1600,
quality: 95,

// For faster loading (smaller files)
width: 800,
quality: 75,

// For maximum compression
format: 'webp', // Serves WebP format
```

---

## 🔍 Troubleshooting

### Images not loading?

1. **Check .env file** - Make sure credentials are correct
2. **Check bucket name** - Should be exactly `portfolio`
3. **Check bucket policies** - Must allow public read access
4. **Check browser console** - Look for CORS or 404 errors

### Upload script fails?

1. **Check credentials** - Invalid keys will fail immediately
2. **Check file paths** - Images must be in `/public/work_images/`
3. **Check network** - Ensure stable internet connection

### "Context Lost" error?

This is unrelated to images - it's a WebGL issue from the 3D camera model.

---

## 📁 File Structure

```
Victors_portfolio/
├── .env                          # Your credentials (DO NOT COMMIT!)
├── .env.example                  # Template file
├── scripts/
│   └── uploadToSupabase.js      # Upload script
├── src/
│   ├── lib/
│   │   └── supabaseClient.js    # Supabase config & helpers
│   ├── pages/
│   │   └── Work.jsx             # Uses Supabase images
│   └── components/
│       └── About.jsx            # Uses Supabase image
└── public/
    └── work_images/             # Original images (keep as backup)
```

---

## 🎯 Next Steps

After successful migration:

1. **Keep local images as backup** - Don't delete `/public/work_images/` immediately
2. **Monitor performance** - Check loading times in production
3. **Optional**: Enable WebP format for even faster loading
4. **Optional**: Add more image transformations (blur, resize on-the-fly)

---

## 💡 Advanced: Custom Transformations

Supabase supports many transformations:

```javascript
// Create thumbnail
getOptimizedImageUrl('work_images/cgt/1.jpg', {
  width: 300,
  height: 300,
  resize: 'cover', // 'contain', 'cover', 'fill'
})

// Add quality and format
getOptimizedImageUrl('work_images/cgt/1.jpg', {
  width: 1200,
  quality: 80,
  format: 'webp',
})
```

---

## ✅ Checklist

- [ ] Created Supabase project
- [ ] Copied credentials to `.env`
- [ ] Ran upload script successfully
- [ ] Set bucket to public
- [ ] Tested locally
- [ ] Added env vars to hosting platform
- [ ] Deployed and verified in production

---

**Questions?** Check the [Supabase Storage Docs](https://supabase.com/docs/guides/storage)
