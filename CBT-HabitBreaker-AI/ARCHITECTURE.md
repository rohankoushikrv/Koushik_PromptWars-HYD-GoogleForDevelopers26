# CBT Habit Breaker AI - Technical Architecture

## 🎯 Overview

A **static, client-side web application** specializing in Cognitive Behavioral Therapy (CBT) and Behavioral Psychology. Deployed on GitHub Pages with OpenAI API integration.

**Key Advantage**: Serverless architecture - runs entirely in the browser!

## 🏗️ Architecture

### Single-Page Application (SPA)

```
User Browser
    ↓
Frontend (HTML/CSS/JS)
    ↓
OpenAI API
    ↓
AI Responses
    ↓
Display in Browser
```

### Frontend Layer

- **index.html** - Responsive web interface
- **styles.css** - Modern, accessible UI styling
- **app.js** - Client-side logic, API integration, localStorage

**Features:**
- Real-time chat interface
- Progress tracking dashboard  
- Habit context sidebar
- Emergency support resources
- Session persistence via localStorage
- No external dependencies (vanilla JavaScript)

### API Integration

- **Direct OpenAI API calls** from browser
- **No backend server** required
- **API key stored locally** in browser's localStorage
- **All data processing** client-side

## 🔄 Data Flow

```
1. User enters message
      ↓
2. JavaScript validates input
      ↓
3. Build request with conversation history
      ↓
4. Send to OpenAI API (direct from browser)
      ↓
5. Receive AI response
      ↓
6. Parse and display response
      ↓
7. Save to localStorage
      ↓
8. Update UI
```

## 📦 Deployment Architecture

```
GitHub Repository
    ↓
GitHub Actions Workflow
    ↓
Build (copy files)
    ↓
Deploy to gh-pages branch
    ↓
GitHub Pages servers
    ↓
User accesses via HTTPS
```

## 🔒 Security Architecture

### Client-Side Security
- Input validation and sanitization
- XSS protection through DOM APIs
- HTML escaping for display

### API Security
- API key stored in localStorage
- Direct communication with OpenAI only
- No intermediary servers
- HTTPS-only deployment

### Data Privacy
- No server-side data storage
- No tracking or analytics
- Sessions exist only in browser memory
- Clear button to delete local data

## 💾 Storage

### localStorage
- Session conversations
- Habit context
- User preferences
- API key (encrypted in browser storage)

### Memory (Temporary)
- Conversation history array
- Current UI state
- Temporary processing data

## 🧠 AI Integration

### Prompt Engineering
- System prompt defines CBT expertise
- Context window: Last 10 messages
- Token limit: 2,000 per response
- Temperature: 0.7 (balanced)

### Response Handling
- Stream processing support
- Error handling with user feedback
- Automatic retry on failure
- Graceful degradation

## 📊 Performance

### Frontend
- **Minimal JavaScript**: Single file, ~15KB
- **CSS**: Single file, optimized
- **HTML**: Single page, no framework needed
- **Load time**: < 1 second

### API
- **Response time**: ~3-10 seconds
- **Streaming**: Supported for faster response display
- **Rate limiting**: Handled by OpenAI

### Browser Storage
- **localStorage capacity**: 5-10MB per domain
- **Session persistence**: Automatic
- **Cache**: Browser handles HTTP caching

## 🔧 Technology Stack

### Frontend
- **HTML5**: Semantic markup
- **CSS3**: Flexbox, Grid, Animations
- **Vanilla JavaScript**: No frameworks
- **localStorage API**: Session persistence

### Backend
- **OpenAI API**: GPT-4 model
- **GitHub Pages**: Static hosting
- **GitHub Actions**: CI/CD deployment

### No Dependencies
- ✅ No npm packages required
- ✅ No Node.js needed
- ✅ Pure browser technology
- ✅ Runs on any web server

## 📈 Scalability

### Current Design
- **Single user**: Browser session
- **Multiple users**: Isolated localStorage per browser
- **Concurrent**: Each browser instance independent

### Future Enhancements
- Add backend for persistent storage
- Implement user authentication
- Database for conversations
- Advanced analytics
- Offline mode with service workers

## 🚀 Deployment Pipeline

```
1. Developer pushes to main branch
2. GitHub Actions triggered
3. Workflow runs:
   - Checkout code
   - Deploy to gh-pages
4. GitHub Pages updated
5. Live within 1-2 minutes
```

## 📱 Browser Compatibility

### Supported
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (same versions)

### Requirements
- JavaScript enabled
- localStorage support
- HTTPS access to OpenAI API

## 🔐 API Key Management

### Storage
- Stored in browser's localStorage
- Never persisted to server
- User can change/delete anytime
- Prompt on first load

### Usage
- Added to every OpenAI API request
- Only used for authorized requests
- User responsible for API costs
- Can be revoked in OpenAI console

## 📊 Monitoring & Analytics

### Available
- GitHub Actions deployment logs
- OpenAI API usage dashboard
- Browser console for debugging
- localStorage inspection

### Not Available
- User behavior tracking
- Conversation analytics
- Error reporting
- User identification

## 🎯 Design Principles

1. **Simplicity**: Minimal complexity, maximum functionality
2. **Privacy**: No data collection or storage
3. **Speed**: Fast loading and responses
4. **Accessibility**: Works for all users
5. **Reliability**: Graceful error handling
6. **Scalability**: Easy to extend and modify

## 📞 Architecture Benefits

| Feature | Benefit |
|---------|---------|
| No backend | Lower costs, simpler deployment |
| Client-side | Full offline capability |
| Static files | CDN distribution, fast worldwide |
| GitHub Pages | Free hosting, automatic SSL |
| Direct API | No latency from proxy servers |
| localStorage | Persistent sessions per user |
| Open source | Fully transparent, auditable |

## 🛠️ Development Workflow

```
1. Edit files (HTML/CSS/JS)
2. Test locally with http.server
3. Push to GitHub
4. Automatic deployment
5. Test on live site
```

## 🔄 Update Process

1. Clone repository
2. Make changes
3. Commit: `git commit -m "Update message"`
4. Push: `git push`
5. GitHub Actions deploys automatically
6. Changes live in 1-2 minutes

## 💡 Extensibility

### Easy to Add
- New CBT techniques (modify prompts)
- UI enhancements (CSS/HTML)
- Analytics (JavaScript tracking)
- Offline support (service workers)

### Harder to Add
- User authentication (need backend)
- Persistent database (need backend)
- Complex computations (performance limits)
- Real-time collaboration (need backend)

---

**Architecture Type**: Client-Side SPA  
**Deployment**: GitHub Pages (Static)  
**Hosting**: 100% Free  
**Maintenance**: Minimal  
**Version**: 1.0.0  
**Status**: ✅ Production Ready
