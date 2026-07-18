# Deploying to GitHub Pages

This is a complete guide for deploying the CBT Habit Breaker AI webapp to GitHub Pages.

## 📋 Prerequisites

- GitHub account (free at github.com)
- Git installed on your computer
- Google Generative AI API key (get from aistudio.google.com/app/apikey)

## 🚀 Quick Deploy (5 minutes)

### Step 1: Fork the Repository

1. Go to https://github.com/yourusername/cbt-habit-breaker-ai (or wherever this repo is)
2. Click the **"Fork"** button (top right)
3. Select your account as the destination
4. GitHub creates a copy in your account

### Step 2: Enable GitHub Pages

1. Go to your forked repository
2. Click **"Settings"** (top menu)
3. Click **"Pages"** (left sidebar)
4. Under "Build and deployment":
   - Source: Select **"Deploy from a branch"**
   - Branch: Select **"gh-pages"**
   - Folder: Select **"/ (root)"**
5. Click **"Save"**

### Step 3: Wait for Deployment

1. Click the **"Actions"** tab
2. Look for the deployment workflow
3. Wait for the green checkmark ✅
4. Usually takes 1-2 minutes

### Step 4: Access Your App

- Visit: `https://yourusername.github.io/cbt-habit-breaker-ai`
- Bookmark this URL!

### Step 5: Add Your Google API Key

1. Open your app URL
2. A prompt will ask for your API key
3. Go to https://aistudio.google.com/app/apikey
4. Click "Create API Key" 
5. Select your project and copy the key
6. Paste into the app (key starts with "AQ.")
7. Done! Your app is ready to use

---

## 📱 Manual Deploy (Using Git)

If you prefer using the command line:

```bash
# 1. Clone your fork
git clone https://github.com/yourusername/cbt-habit-breaker-ai
cd cbt-habit-breaker-ai

# 2. Make sure you're on main branch
git checkout main

# 3. Make changes if needed
# ... edit files ...

# 4. Stage changes
git add .

# 5. Commit
git commit -m "Update: description of changes"

# 6. Push to GitHub
git push origin main

# 7. GitHub Actions will automatically deploy
# Check the Actions tab to confirm
```

---

## 🔄 Update Your Deployment

### Via GitHub Web Interface

1. Go to your repository
2. Click the file you want to edit
3. Click the pencil ✏️ icon
4. Make changes
5. Click "Commit changes"
6. GitHub automatically redeployes

### Via Git Command Line

```bash
git add .
git commit -m "Update: describe changes"
git push origin main
```

---

## 🆘 Troubleshooting

### "GitHub Pages isn't deployed"

**Solution:**
1. Check **Settings → Pages**
2. Ensure source is set to "gh-pages" branch
3. Wait 1-2 minutes for deployment
4. Check **Actions** tab for errors

### "App shows 404 error"

**Solution:**
1. Check your URL: `https://username.github.io/repo-name`
2. Make sure capitalization matches
3. Try hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
4. Clear browser cache

### "API key not working"

**Solution:**
1. Verify your API key from https://aistudio.google.com/app/apikey
2. Make sure it starts with "AQ."
3. Check Generative AI API is enabled for your project
4. Try refreshing the page

### "Changes not showing up"

**Solution:**
1. Hard refresh your browser (Ctrl+Shift+R)
2. Check **Actions** tab - deployment might still be running
3. Wait 2-3 minutes and refresh
4. Try a different browser

---

## 🔐 Protecting Your API Key

### Best Practices

✅ **Do This:**
- Store API key locally in your browser only
- Rotate keys regularly in Google AI Studio
- Monitor API usage on https://aistudio.google.com/app/apikey
- Use free tier while testing

❌ **Don't Do This:**
- Never commit your API key to GitHub
- Never share your API key with others
- Never put it in commit messages
- Never post it in issues or discussions

### If API Key Leaked

1. Go to https://aistudio.google.com/app/apikey
2. Delete the compromised key
3. Create a new key
4. Update it in your app
5. Monitor your API usage

---

## 📊 Monitoring Deployment

### Check Deployment Status

1. Go to your repository
2. Click **"Actions"** tab
3. Look for "Deploy to GitHub Pages"
4. Green ✅ = success
5. Red ❌ = error (click to see details)

### View Site Activity

- Go to **Settings → Pages**
- Scroll to "GitHub Pages" section
- Shows last deployment time and status

### Check Your App

1. Visit your GitHub Pages URL
2. Open browser DevTools (F12)
3. Check Console tab for errors
4. Check Application → Local Storage for saved data

---

## 🛠️ Customization

### Change the App Title

Edit `frontend/index.html`:
```html
<title>Your Custom Title</title>
```

### Change Colors/Styling

Edit `frontend/styles.css`:
```css
--primary-color: #your-color;
```

### Modify AI Behavior

Edit `frontend/app.js`, look for `systemPrompt` variable

---

## 🌐 Use Your Own Domain (Optional)

### For Custom Domain

1. Buy domain (godaddy.com, namecheap.com, etc.)
2. Update DNS settings to point to GitHub Pages
3. In repo **Settings → Pages**, enter your domain
4. GitHub verifies and sets up SSL

[See GitHub Pages Custom Domain Guide](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)

---

## 📞 Getting Help

### Common Issues

- **GitHub Pages not enabled**: Check Settings → Pages
- **Workflow errors**: Check Actions tab for logs
- **App not loading**: Check browser console (F12)
- **API errors**: Verify API key is correct

### Resources

- [GitHub Pages Docs](https://docs.github.com/en/pages)
- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [OpenAI API Docs](https://platform.openai.com/docs)

---

## ✅ Deployment Checklist

- [ ] Repository forked to your account
- [ ] GitHub Pages enabled
- [ ] Deployment completed (green checkmark in Actions)
- [ ] App accessible at your GitHub Pages URL
- [ ] OpenAI API key obtained
- [ ] API key entered in app
- [ ] App responding to messages
- [ ] URL bookmarked or shared

---

## 🎉 You're Done!

Your CBT Habit Breaker AI is now live on the internet! 

### Next Steps

1. Share your app with friends
2. Gather feedback
3. Make improvements
4. Push updates to GitHub (auto-deployment)
5. Help others break their bad habits!

---

**Deployment Time**: 5-10 minutes  
**Monthly Cost**: Free! 🎉  
**Hosting**: GitHub Pages (reliable, fast)  
**Updates**: Automatic  
**Uptime**: 99.9%+  

---

For more help, check [GETTING_STARTED.md](GETTING_STARTED.md) or [README.md](README.md)
