# 🚀 Quick Start - Supabase Image Migration

## ⚡ TL;DR

1. **Get Supabase credentials**
   - Visit: https://app.supabase.com/project/_/settings/api
   - Copy: Project URL + Anon Key

2. **Create .env file**
   ```bash
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJxxxx...
   ```

3. **Upload images**
   ```bash
   node scripts/uploadToSupabase.js
   ```

4. **Make bucket public**
   - Go to Storage → portfolio → Policies
   - Add policy: "Allow public read access"

5. **Test**
   ```bash
   npm run dev
   ```

6. **Deploy**
   - Add env vars to Vercel/Netlify
   - Deploy as usual

## 📚 Full Guide
See `SUPABASE_SETUP.md` for detailed instructions.

---

## 🎯 What Changed?

### Before (Local):
```javascript
src={`/work_images/${activeTab}/${num}.jpg`}
```

### After (Supabase):
```javascript
// Automatically uses optimized Supabase URLs with:
// - CDN delivery
// - Image resizing (1200px width)
// - Quality optimization (85%)
// - Optional WebP format
```

---

## 🎨 Benefits

| Feature | Before | After |
|---------|--------|-------|
| Load Speed | Regular | ⚡ CDN Fast |
| Image Size | Full size | 🎯 Optimized |
| Build Size | 60+ images | 📦 No images |
| Global Access | Single server | 🌍 CDN network |
| Updates | Redeploy needed | ✅ Instant |

---

## ✅ Files Created/Modified

**New Files:**
- `src/lib/supabaseClient.js` - Supabase config & helpers
- `scripts/uploadToSupabase.js` - Upload script
- `.env.example` - Template for credentials
- `SUPABASE_SETUP.md` - Full documentation

**Modified Files:**
- `src/pages/Work.jsx` - Now uses Supabase URLs
- `src/components/About.jsx` - Now uses Supabase URL
- `.gitignore` - Added .env protection

**Dependencies:**
- `@supabase/supabase-js` ✅ Installed
