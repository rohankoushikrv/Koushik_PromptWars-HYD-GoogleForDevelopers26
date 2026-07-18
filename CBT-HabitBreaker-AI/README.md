# AI Agent Specialized in Behavioral Psychology and CBT for Breaking Bad Habits

A highly secure, empathetic AI Agent specialized in Behavioral Psychology and Cognitive Behavioral Therapy (CBT). This web application helps users break bad habits and overcome addictions such as excessive screen time, substance cravings, and negative routines.

**🚀 Deployed on GitHub Pages - Fully Static & Serverless**

## 🎯 Features

- **CBT-Specialized AI Agent**: Leverages principles of Cognitive Behavioral Therapy to guide users
- **Behavioral Psychology Framework**: Evidence-based techniques for habit modification
- **Secure & Empathetic**: Prioritizes user privacy and emotional support
- **Addiction Recovery Support**: Specializes in various addictions and negative routines
- **Real-time Guidance**: Interactive sessions with personalized interventions
- **Local Session Storage**: Conversations saved locally in your browser
- **Crisis Support**: Identifies crisis indicators with emergency resources
- **100% Client-Side**: Runs entirely in your browser - no backend server needed!

## 🏗️ Project Structure

```
CBT-HabitBreaker-AI/
├── frontend/                 # Client-side application
│   ├── index.html           # Main UI
│   ├── styles.css           # Modern, responsive styles
│   ├── app.js               # Application logic
│
├── .github/
│   └── workflows/
│       └── deploy.yml       # GitHub Pages deployment
│
├── package.json             # Dependencies for deployment
├── .env.example             # Environment configuration
├── README.md                # This file
├── GETTING_STARTED.md       # Quick start guide
└── ARCHITECTURE.md          # Technical details
```

## 🚀 Quick Start

### Option 1: Deploy to GitHub Pages (Recommended)

1. **Fork this repository** to your GitHub account
2. **Enable GitHub Pages**:
   - Go to Settings → Pages
   - Select "Deploy from a branch"
   - Choose `gh-pages` branch
3. **Wait for deployment** (check Actions tab)
4. **Access your app**: `https://yourusername.github.io/cbt-habit-breaker-ai`

### Option 2: Run Locally

```bash
# Clone the repository
git clone https://github.com/yourusername/cbt-habit-breaker-ai
cd cbt-habit-breaker-ai

# Start a local server (requires Python)
python -m http.server 3000

# Or with Node.js
npm install
npm start

# Open in browser
http://localhost:3000
```

## 🔑 Getting Your API Key

This app requires an OpenAI API key to function:

1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign in or create an account
3. Click "Create new secret key"
4. Copy your API key
5. When you first load the app, paste your API key when prompted
6. Your key is stored **locally only** in your browser (localStorage)

**Security Note**: Your API key is never sent anywhere except to OpenAI's servers for processing messages.

## 💡 How It Works

1. **User enters a message** about their habit or struggle
2. **AI analyzes** the message using CBT principles
3. **Responses include**:
   - Empathetic validation
   - CBT techniques and strategies
   - Actionable steps
   - Crisis resources (if needed)
4. **Conversation history** is saved locally in your browser
5. **Sessions persist** so you can continue later

## 🧠 CBT Framework

The AI Agent implements key CBT concepts:

- **Cognitive Restructuring**: Identifying and challenging unhelpful thought patterns
- **Behavioral Activation**: Encouraging engagement in positive behaviors
- **Habit Loop Analysis**: Understanding cue → routine → reward cycles
- **Coping Strategies**: Building personalized coping mechanisms
- **Exposure & Response Prevention**: Gradual exposure with healthy responses
- **Progress Monitoring**: Tracking improvements and setbacks

## 📱 Supported Issues

- Excessive screen time/social media addiction
- Substance abuse recovery support
- Smoking/nicotine addiction
- Alcohol abuse
- Compulsive eating
- Sleep disruption
- Gambling addiction
- Negative thought patterns
- Procrastination and avoidance
- And more...

## 🔒 Security & Privacy

✅ **100% Client-Side**: No data sent to our servers
✅ **Browser Storage**: Conversations saved locally only
✅ **API Key Protection**: Direct communication with OpenAI only
✅ **No Tracking**: No analytics or tracking code
✅ **Open Source**: Code is transparent and auditable
✅ **Encryption Ready**: Data can be encrypted before storage

## 📡 API Usage

The app communicates directly with OpenAI's API:
- Model: GPT-4 (configurable)
- Max tokens: 2,000 per response
- Cost: As per your OpenAI plan

## 🛠️ Development

### Installation
```bash
npm install
```

### Local Development
```bash
npm run dev
```

### Build for Deployment
```bash
npm run build
```

## 📊 Deployment Status

- **Platform**: GitHub Pages
- **Build Status**: Automatic via GitHub Actions
- **Deployment**: On every push to main branch
- **Availability**: 24/7 (GitHub's uptime)

## ⚠️ Important Disclaimer

This application is designed to support users but is **NOT a replacement for professional mental health services**. 

**If you're experiencing:**
- Suicidal thoughts
- Severe depression or anxiety
- Active substance withdrawal
- Self-harm urges
- Any mental health crisis

**Please contact:**

🆘 **National Suicide Prevention Lifeline**
- Phone: 1-800-273-8255
- Chat: https://suicidepreventionlifeline.org/chat
- Available 24/7

💬 **Crisis Text Line**
- Text HOME to 741741
- Available 24/7

🏥 **SAMHSA National Helpline**
- Phone: 1-800-662-4357
- Free, confidential, 24/7

🚑 **Emergency**: Call 911 or go to nearest ER

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

MIT License - Feel free to use and modify as needed

## 🙏 Acknowledgments

- Built with OpenAI's GPT-4 API
- CBT principles from cognitive psychology research
- Inspired by evidence-based mental health practices
- Special thanks to the open-source community

## 📞 Support

For issues, questions, or suggestions:
- Open an [Issue](https://github.com/yourusername/cbt-habit-breaker-ai/issues)
- Check [Discussions](https://github.com/yourusername/cbt-habit-breaker-ai/discussions)
- See [GETTING_STARTED.md](GETTING_STARTED.md) for setup help

---

**Version**: 1.0.0  
**Type**: Static Web App (GitHub Pages)  
**Last Updated**: 2026-07-18  
**Status**: ✅ Production Ready
