# CBT Habit Breaker AI - Getting Started Guide

## � Deployment Options

### Option 1: Deploy to GitHub Pages (Recommended)

GitHub Pages provides **free, instant deployment** of static websites.

#### Steps:

1. **Create GitHub Account** (if you don't have one)
   - Go to https://github.com
   - Sign up for free

2. **Fork This Repository**
   - Click "Fork" button on this repository
   - Select where to fork (your personal account)

3. **Enable GitHub Pages**
   - Go to your forked repo Settings
   - Navigate to "Pages" section
   - Select "Deploy from a branch"
   - Choose branch: `gh-pages`
   - Click "Save"

4. **Wait for Deployment**
   - Check the "Actions" tab
   - Wait for green checkmark next to workflow
   - Usually takes 1-2 minutes

5. **Access Your App**
   - Visit: `https://yourusername.github.io/cbt-habit-breaker-ai`
   - Or check Settings → Pages for your deployment URL

6. **Add Your OpenAI API Key**
   - Open your deployed app
   - When prompted, paste your OpenAI API key
   - App will store it locally in your browser

---

### Option 2: Run Locally

#### Requirements:
- Python 3+ OR Node.js

#### Using Python:
```bash
cd CBT-HabitBreaker-AI
python -m http.server 3000
```

#### Using Node.js:
```bash
cd CBT-HabitBreaker-AI
npm install
npm start
```

Then open: `http://localhost:3000`

---

## 🔑 Getting Your OpenAI API Key

**Required for the app to work!**

1. Go to https://platform.openai.com/account/api-keys
2. Sign in with your OpenAI account (create one if needed)
3. Click "Create new secret key"
4. Copy the key (you won't see it again!)
5. When the app prompts you, paste it there
6. Your key stays in your browser only

**Cost**: You only pay for API usage (text generation)

---

## 📁 File Structure

```
CBT-HabitBreaker-AI/
├── frontend/           # All HTML, CSS, JavaScript
│   ├── index.html      # Main page
│   ├── styles.css      # Styling
│   └── app.js          # Application logic
│
├── README.md           # Project overview
├── GETTING_STARTED.md  # This file
├── ARCHITECTURE.md     # Technical details
└── package.json        # Dependencies
```

---

## 🎯 First Use

1. **Open the app** (GitHub Pages URL or localhost)
2. **Enter your OpenAI API key** when prompted
3. **Start chatting!**
   - Tell the AI about your habit
   - Get CBT-based strategies
   - Track your progress

Example topics:
- "I can't stop checking my phone"
- "I want to quit smoking"
- "I eat too much junk food"
- "I can't sleep at night"

---

## 🔧 Customization

### Change the Title/Description
Edit `frontend/index.html`:
```html
<title>CBT Habit Breaker - Your custom title</title>
```

### Update Deployment URL
Edit `package.json`:
```json
"homepage": "https://yourusername.github.io/your-repo-name"
```

### Modify Styling
Edit `frontend/styles.css` to customize colors, fonts, layout

### Change AI Behavior
Edit `frontend/app.js`:
- Look for `systemPrompt` variable
- Modify the instructions sent to OpenAI

---

## 💾 Local Data

Your conversations are saved in browser's local storage:
- 🔒 **Private**: Never sent to any server except OpenAI
- 📱 **Offline**: Works even if offline (until API call)
- 🔄 **Persistent**: Automatically saved between sessions

To clear your data:
1. Open browser DevTools (F12)
2. Go to Application tab
3. Find "Local Storage"
4. Delete entries starting with "cbt_"

---

## 🆘 Troubleshooting

### "API key is required"
- You haven't entered your OpenAI API key
- Reload the page and try again
- Make sure you have a valid key from openai.com

### "API request failed"
- Check your API key is correct
- Verify you have API credits in OpenAI account
- Check your internet connection
- Try again in a few moments

### "No responses from AI"
- Your API key might be expired/invalid
- You might be out of API credits
- OpenAI API might be down (check status.openai.com)

### Conversations not saving
- Check if browser allows local storage
- Try incognito/private mode
- Check browser storage limits

---

## 📊 Checking Deployment Status

1. Go to your repository
2. Click "Actions" tab
3. Look for the latest workflow run
4. Green checkmark = deployment successful
5. Red X = deployment failed (check logs)

---

## 🌐 Custom Domain (Optional)

Want to use your own domain instead of github.io?

1. Buy a domain (godaddy.com, namecheap.com, etc.)
2. Edit your DNS settings to point to GitHub Pages
3. In repo Settings → Pages, enter your custom domain
4. GitHub will verify and set up SSL automatically

[Full GitHub Pages Custom Domain Guide](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)

---

## 🔐 Security Notes

✅ Your API key is stored **locally only** in your browser
✅ Messages go **directly to OpenAI**, not through any other server  
✅ No tracking or analytics
✅ Open source - code is transparent

**But remember:**
- Don't share your API key with anyone
- Don't commit your API key to GitHub
- Monitor your OpenAI usage to avoid surprise bills

---

## 📞 Getting Help

- Check [README.md](README.md) for overview
- See [ARCHITECTURE.md](ARCHITECTURE.md) for technical details
- Search GitHub Issues for similar problems
- Create a new Issue describing your problem
- Check OpenAI API documentation

---

## 🎉 You're Ready!

Your CBT Habit Breaker app is now live! Share it with friends or keep it private - it's entirely up to you.

Remember:
- This is a support tool, not a replacement for professional therapy
- If in crisis, call 1-800-273-8255 (US)
- Be kind to yourself while making changes

**Good luck with your habit-breaking journey! 💪**

---

**Version**: 1.0.0  
**Last Updated**: 2026-07-18
