# Web3Forms Setup Guide

This guide will help you set up Web3Forms to handle contact form submissions. **No client login needed!**

## Why Web3Forms?

✅ **You** control the setup (not the client)  
✅ Emails go to **victorpassiany@gmail.com**  
✅ Free tier: **250 submissions/month**  
✅ Takes **5 minutes** to set up  
✅ Only **1 credential** needed (not 3!)  
✅ No SDK or packages needed  

---

## 🚀 Quick Setup (5 Minutes)

### Step 1: Create Web3Forms Account

1. Go to https://web3forms.com
2. Click **"Get Started Free"** or **"Create Access Key"**
3. Enter your email (use YOUR email, not the client's)
4. Verify your email

### Step 2: Create Access Key

1. Once logged in, you'll see the dashboard
2. Click **"Create New Access Key"**
3. Fill in the form:
   - **Email to receive messages**: `victorpassiany@gmail.com`
   - **Form Name**: Portfolio Contact Form (or any name)
   - **Website URL** (optional): Your portfolio URL
4. Click **"Create Access Key"**
5. You'll get an **Access Key** that looks like: `abc123de-f456-789g-h012-ijk345lmnop6`
6. **COPY THIS KEY!** ✅

### Step 3: Add to Your Project

1. In your project root folder, create a file called `.env` (if it doesn't exist)
2. Add this line with your actual access key:

```bash
VITE_WEB3FORMS_ACCESS_KEY=abc123de-f456-789g-h012-ijk345lmnop6
```

**That's it!** Just one line. 🎉

### Step 4: Test Your Contact Form

1. **Save the `.env` file**
2. **Restart your dev server** (very important!):
   ```bash
   # Press Ctrl+C to stop
   npm run dev
   ```
3. Go to your contact page in the browser
4. Fill out the form with test data
5. Click **"Send Message"**
6. Check **victorpassiany@gmail.com** inbox!

---

## 📊 Web3Forms Dashboard Features

After setup, you can:
- ✅ View all form submissions in your dashboard
- ✅ Download submissions as CSV
- ✅ Set up email notifications
- ✅ Add spam protection (reCAPTCHA)
- ✅ Create multiple access keys for different projects

Dashboard: https://web3forms.com/dashboard

---

## 🎯 Email Settings (Optional Customization)

You can customize how emails look by adding these to the form data (already done in code):

```javascript
{
  access_key: "your_key",
  name: "John Doe",
  email: "john@example.com",
  message: "Hello!",
  subject: "Custom Subject Line",  // ✅ Already set
  from_name: "Contact Form"        // ✅ Already set
}
```

---

## 🔒 Spam Protection (Optional)

Want to add reCAPTCHA?

1. In Web3Forms dashboard, enable reCAPTCHA for your access key
2. Add the reCAPTCHA widget to your form
3. Web3Forms will auto-verify submissions

---

## 💰 Free Tier Limits

- ✅ **250 submissions/month** (more than EmailJS!)
- ✅ Unlimited access keys
- ✅ Unlimited emails per submission
- ✅ Email notifications
- ✅ File attachments support

Perfect for a portfolio website!

---

## ⚠️ Troubleshooting

### Issue: "Emails not received"
- Check spam folder in Gmail (victorpassiany@gmail.com)
- Verify access key is correct in `.env`
- Make sure you **restarted the dev server** after adding `.env`
- Check Web3Forms dashboard to see if submission was logged

### Issue: "Form submission failed"
- Check browser console for error messages
- Verify the access key in `.env` matches dashboard
- Make sure `.env` file is in the project root (next to package.json)

### Issue: "Access key not found"
- You forgot to restart the dev server after creating `.env`
- The `.env` file might be in the wrong location
- Check for typos in the variable name: `VITE_WEB3FORMS_ACCESS_KEY`

---

## 🔐 Security Notes

- ✅ **Never commit `.env` to Git** (already in `.gitignore`)
- ✅ Access key is safe to use in frontend (it's designed for that)
- ✅ Web3Forms validates on their end
- ✅ For production (Vercel), add the env variable in project settings

---

## 📱 For Deployment (Vercel)

When deploying to Vercel:

1. Go to your Vercel project dashboard
2. Click **Settings** → **Environment Variables**
3. Add:
   - **Name**: `VITE_WEB3FORMS_ACCESS_KEY`
   - **Value**: Your access key
4. Redeploy your site

---

## 🆚 Web3Forms vs EmailJS

| Feature | Web3Forms | EmailJS |
|---------|-----------|---------|
| Free emails/month | 250 | 200 |
| Setup credentials | 1 | 3 |
| Client login needed | ❌ No | ✅ Yes |
| Setup time | 5 min | 10 min |
| Package needed | ❌ No | ✅ Yes |

**Winner:** Web3Forms for client projects! 🏆

---

## 📞 Need Help?

- [Web3Forms Documentation](https://docs.web3forms.com/)
- [Web3Forms Dashboard](https://web3forms.com/dashboard)
- [API Documentation](https://docs.web3forms.com/getting-started/api-reference)

---

## ✅ Quick Checklist

- [ ] Created Web3Forms account
- [ ] Created access key with victorpassiany@gmail.com
- [ ] Created `.env` file in project root
- [ ] Added `VITE_WEB3FORMS_ACCESS_KEY=your_key`
- [ ] Restarted dev server
- [ ] Tested form submission
- [ ] Checked client's email inbox

Done! Your contact form is ready. 🎉
