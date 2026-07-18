/* ========================================
   CBT Habit Breaker - Frontend Application
   Static Webapp - GitHub Pages Ready
   Using Google Generative AI (Gemini API)
   ======================================== */

const app = {
    // Google Generative AI Configuration
    googleApiKey: null,
    geminiModel: 'gemini-3.5-flash',
    
    // Local Configuration
    sessionId: null,
    currentHabit: null,
    messageCount: 0,
    conversationHistory: [],

    /* ========== INITIALIZATION ========== */

    async init() {
        console.log('🚀 CBT Habit Breaker initialized');
        
        // Check for API key
        this.googleApiKey = this.getApiKey();
        
        if (!this.googleApiKey) {
            console.log('⚠️ No API key found, showing prompt');
            this.showApiKeyPrompt();
            return;
        }

        console.log('✅ API key found, initializing app');
        this.setupEventListeners();
        this.createNewSession();
        this.loadPreviousSession();
    },

    getApiKey() {
        // Try to get from localStorage first
        const storedKey = localStorage.getItem('cbt_google_api_key');
        console.log('Looking for API key in localStorage:', storedKey ? '✓ Found' : '✗ Not found');
        
        if (storedKey && storedKey.trim()) {
            return storedKey.trim();
        }

        // Try to get from environment variable
        if (typeof process !== 'undefined' && process.env?.VITE_GOOGLE_API_KEY) {
            return process.env.VITE_GOOGLE_API_KEY;
        }

        console.log('⚠️ No API key available');
        return null;
    },

    showApiKeyPrompt() {
        const apiKey = prompt(
            '🔑 REQUIRED: Enter your Google Generative AI API key\n\n' +
            'How to get it:\n' +
            '1. Go to: https://aistudio.google.com/app/apikey\n' +
            '2. Sign in with Google (free account)\n' +
            '3. Click "Create API Key"\n' +
            '4. Copy your key (starts with AQ.)\n' +
            '5. Paste it below:\n\n' +
            'Example: AQ.Ab8RN6Izkgz7sZWa0sh5A...\n\n' +
            'Key will be stored ONLY in your browser.'
        );

        if (!apiKey || !apiKey.trim()) {
            this.showNoKeyError();
            return;
        }

        const trimmedKey = apiKey.trim();
        
        // Validate API key format
        if (!trimmedKey.startsWith('AQ.')) {
            alert('❌ Invalid Format!\n\n' +
                'Google API keys start with "AQ."\n\n' +
                'You entered: ' + trimmedKey.substring(0, 30) + '...\n\n' +
                'Get the correct key from:\n' +
                'https://aistudio.google.com/app/apikey');
            this.showApiKeyPrompt();
            return;
        }
        
        if (trimmedKey.length < 20) {
            alert('❌ Key Too Short!\n\n' +
                'Google API keys are usually 40+ characters.\n\n' +
                'Make sure you copied the entire key.');
            this.showApiKeyPrompt();
            return;
        }
        
        // Save and initialize
        localStorage.setItem('cbt_google_api_key', trimmedKey);
        this.googleApiKey = trimmedKey;
        console.log('✅ API key saved, initializing app');
        this.setupEventListeners();
        this.createNewSession();
        this.loadPreviousSession();
    },

    showNoKeyError() {
        const chatHistory = document.getElementById('chat-history');
        chatHistory.innerHTML = `
            <div class="chat-message bot-message" style="margin: 20px;">
                <div class="message-content">
                    <p style="font-size: 18px; font-weight: bold; color: #e74c3c;">🔑 API Key Required</p>
                    <p style="margin-top: 15px;">To use CBT Habit Breaker, you need a Google Generative AI API key.</p>
                    
                    <h4 style="margin-top: 20px; margin-bottom: 10px;">📋 Quick Setup (2 minutes):</h4>
                    <ol style="margin-left: 20px; line-height: 1.8;">
                        <li>Go to <a href="https://aistudio.google.com/app/apikey" target="_blank" style="color: #4a90e2; text-decoration: underline;">https://aistudio.google.com/app/apikey</a></li>
                        <li>Sign in with your Google account</li>
                        <li>Click <strong>"Create API Key"</strong></li>
                        <li>Select your project (or create new)</li>
                        <li>Copy the key (starts with <code style="background: rgba(0,0,0,0.1); padding: 2px 6px;">AQ.</code>)</li>
                        <li>Click the ⚙️ button at the top right</li>
                        <li>Paste your key</li>
                    </ol>
                    
                    <p style="margin-top: 20px; background: rgba(46, 204, 113, 0.1); padding: 12px; border-radius: 6px; border-left: 4px solid #2ecc71;">
                        <strong>✨ Good news:</strong> Google's Generative AI API is <strong>free to use!</strong>
                    </p>
                    
                    <p style="margin-top: 20px; font-size: 13px; opacity: 0.8;">
                        Your API key stays in your browser only. Never shared with anyone.
                    </p>
                    
                    <p style="margin-top: 15px;">
                        <button onclick="location.reload()" style="background: #4a90e2; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; font-size: 14px; font-weight: bold;">
                            🔄 Refresh & Try Again
                        </button>
                    </p>
                </div>
            </div>
        `;
    },

    setupEventListeners() {
        const messageInput = document.getElementById('message-input');
        const sendBtn = document.getElementById('send-btn');

        if (!messageInput || !sendBtn) {
            console.error('❌ Chat elements not found in DOM');
            return;
        }

        // Send on button click
        sendBtn.addEventListener('click', () => this.sendMessage());

        // Send on Ctrl+Enter or Cmd+Enter
        messageInput.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                this.sendMessage();
            }
        });

        // Auto-resize textarea
        messageInput.addEventListener('input', () => {
            messageInput.style.height = 'auto';
            messageInput.style.height = Math.min(messageInput.scrollHeight, 100) + 'px';
        });

        console.log('✅ Event listeners attached');
    },

    createNewSession() {
        this.sessionId = this.generateId();
        this.currentHabit = null;
        this.messageCount = 0;
        this.conversationHistory = [];
        console.log('✅ New session created:', this.sessionId);
        this.saveSession();
    },

    loadPreviousSession() {
        const savedSession = localStorage.getItem('cbt_session');
        if (savedSession) {
            try {
                const session = JSON.parse(savedSession);
                this.conversationHistory = session.messages || [];
                this.currentHabit = session.habit || null;
                
                // Restore chat history to UI
                const chatHistory = document.getElementById('chat-history');
                chatHistory.innerHTML = '';
                this.conversationHistory.forEach(msg => {
                    this.addMessageToChat(msg.content, msg.role === 'user' ? 'user' : 'bot', false);
                });

                if (this.currentHabit) {
                    this.updateCurrentHabit(this.currentHabit);
                }
            } catch (e) {
                console.log('Could not load previous session');
            }
        }
    },

    saveSession() {
        const session = {
            id: this.sessionId,
            messages: this.conversationHistory,
            habit: this.currentHabit,
            timestamp: new Date().toISOString()
        };
        localStorage.setItem('cbt_session', JSON.stringify(session));
    },

    /* ========== MESSAGE HANDLING ========== */

    async sendMessage() {
        const input = document.getElementById('message-input');
        const message = input.value.trim();

        if (!message) return;
        
        // Safety check: ensure API key exists
        if (!this.googleApiKey) {
            alert('❌ API key not configured!\n\n' +
                'Click the ⚙️ button to set your Google API key.');
            this.showNoKeyError();
            return;
        }

        // Disable input
        input.disabled = true;
        document.getElementById('send-btn').disabled = true;

        try {
            // Add user message to chat
            this.addMessageToChat(message, 'user');
            input.value = '';
            input.style.height = 'auto';

            // Add to conversation history
            this.conversationHistory.push({
                role: 'user',
                content: message
            });

            // Show loading indicator
            this.showLoading(true);

            // Get AI response
            const aiResponse = await this.getAIResponse(message);

            // Hide loading indicator
            this.showLoading(false);

            // Add AI response to chat
            if (aiResponse) {
                this.addMessageToChat(aiResponse, 'bot');

                // Add to conversation history
                this.conversationHistory.push({
                    role: 'assistant',
                    content: aiResponse
                });

                // Extract and update habit info
                const habitInfo = this.extractHabitInfo(message);
                if (habitInfo) {
                    this.currentHabit = habitInfo;
                    this.updateCurrentHabit(habitInfo);
                }

                // Save session
                this.saveSession();
            }

        } catch (error) {
            this.showLoading(false);
            console.error('Error:', error);
            this.addMessageToChat(
                '❌ Error: ' + error.message + '\n\nMake sure your API key is valid.',
                'bot'
            );
        } finally {
            // Re-enable input
            input.disabled = false;
            document.getElementById('send-btn').disabled = false;
            input.focus();
        }
    },

    async getAIResponse(userMessage) {
        const systemPrompt = `You are an empathetic, highly trained AI Agent specialized in Cognitive Behavioral Therapy (CBT) and Behavioral Psychology. Your primary purpose is to help users break bad habits and overcome addictions.

KEY PRINCIPLES:
1. **Empathy First**: Always acknowledge the user's feelings and validate their experience
2. **Non-Judgmental**: Never shame or judge. Focus on understanding and growth
3. **Evidence-Based**: Use CBT techniques grounded in psychology
4. **Safety-Conscious**: Identify crisis indicators and escalate appropriately
5. **Practical**: Provide actionable strategies users can implement immediately

Provide compassionate, practical responses using CBT principles. Keep responses focused and actionable.`;

        try {
            // Build the full conversation history with system prompt
            const messages = [
                systemPrompt,
                ...this.conversationHistory.slice(-10).map(msg => 
                    msg.role === 'user' ? `User: ${msg.content}` : `Assistant: ${msg.content}`
                ),
                `User: ${userMessage}`
            ].join('\n\n');

            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${this.geminiModel}:generateContent`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-goog-api-key': this.googleApiKey
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: messages
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 2000,
                    }
                })
            });

            if (!response.ok) {
                const error = await response.json();
                const errorMessage = error.error?.message || JSON.stringify(error);
                
                // Check for common API errors
                if (errorMessage.includes('API key') || errorMessage.includes('invalid') || errorMessage.includes('401')) {
                    throw new Error(
                        '❌ Invalid API Key!\n\n' +
                        'Your Google API key appears to be incorrect or invalid.\n\n' +
                        'Please check:\n' +
                        '1. The key starts with "AQ."\n' +
                        '2. You copied the entire key\n' +
                        '3. The key is still active\n' +
                        '4. Generative AI API is enabled\n\n' +
                        'Click the ⚙️ button to enter a new API key.\n\n' +
                        'Get a new key at: https://aistudio.google.com/app/apikey'
                    );
                } else if (errorMessage.includes('quota') || errorMessage.includes('429')) {
                    throw new Error(
                        '⏱️ Rate Limited or Quota Exceeded\n\n' +
                        'You have exceeded your API quota.\n\n' +
                        'Please wait a while and try again, or check your quota at:\n' +
                        'https://aistudio.google.com/app/apikey'
                    );
                }
                
                throw new Error(errorMessage);
            }

            const data = await response.json();
            
            // Extract text from Gemini response
            if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0]) {
                return data.candidates[0].content.parts[0].text;
            }
            
            throw new Error('Invalid response format from API');

        } catch (error) {
            console.error('Google Generative AI error:', error);
            throw error;
        }
    },

    extractHabitInfo(userMessage) {
        const habitKeywords = {
            'smoking': ['smoke', 'cigarette', 'nicotine'],
            'alcohol': ['drink', 'alcohol', 'drinking', 'beer', 'wine'],
            'screen_time': ['phone', 'scrolling', 'social media', 'screen', 'gaming'],
            'eating': ['eat', 'eating', 'food', 'sugar', 'junk food'],
            'sleep': ['sleep', 'insomnia', 'staying up'],
            'substance': ['drug', 'cocaine', 'opioid', 'substance'],
            'compulsive': ['checking', 'compulsive', 'obsessive', 'routine']
        };

        const lowerMessage = userMessage.toLowerCase();

        // Detect habit type
        for (const [habitType, keywords] of Object.entries(habitKeywords)) {
            if (keywords.some(keyword => lowerMessage.includes(keyword))) {
                return {
                    type: habitType,
                    name: habitType.replace(/_/g, ' '),
                    description: userMessage.slice(0, 100),
                    detectedAt: new Date().toISOString()
                };
            }
        }

        return null;
    },

    /* ========== UI UPDATES ========== */

    addMessageToChat(text, sender, scroll = true) {
        const chatHistory = document.getElementById('chat-history');
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${sender}-message`;

        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        contentDiv.innerHTML = this.parseMessageContent(text);

        const timeSpan = document.createElement('span');
        timeSpan.className = 'message-time';
        timeSpan.textContent = this.getCurrentTime();

        messageDiv.appendChild(contentDiv);
        messageDiv.appendChild(timeSpan);

        chatHistory.appendChild(messageDiv);

        // Scroll to bottom
        if (scroll) {
            setTimeout(() => {
                chatHistory.scrollTop = chatHistory.scrollHeight;
            }, 0);
        }
    },

    parseMessageContent(text) {
        // Convert markdown-like formatting to HTML
        let html = text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\n/g, '<br>');

        return html;
    },

    updateCurrentHabit(habit) {
        this.currentHabit = habit;
        const habitDisplay = document.getElementById('current-habit');
        habitDisplay.innerHTML = `<strong>${habit.name}</strong><p>${habit.description}</p>`;
    },

    updateStrategies(strategies) {
        const strategiesList = document.getElementById('strategies-list');
        strategiesList.innerHTML = '';

        strategies.forEach(strategy => {
            const card = document.createElement('div');
            card.className = 'strategy-card';
            card.innerHTML = `
                <h4>${strategy.title}</h4>
                <p>${strategy.description}</p>
            `;
            strategiesList.appendChild(card);
        });
    },

    updateProgress(progress) {
        if (progress.daysWithoutTrigger !== undefined) {
            document.getElementById('days-count').textContent = 
                `${progress.daysWithoutTrigger} days`;
            
            const progressFill = document.querySelector('.progress-fill');
            const percentage = Math.min(progress.daysWithoutTrigger * 5, 100);
            progressFill.style.width = percentage + '%';
        }
    },

    showLoading(show) {
        const indicator = document.getElementById('loading-indicator');
        if (show) {
            indicator.classList.remove('hidden');
        } else {
            indicator.classList.add('hidden');
        }
    },

    /* ========== MODAL & RESOURCES ========== */

    showEmergencySupport() {
        document.getElementById('crisis-modal').classList.remove('hidden');
    },

    showResource(type) {
        // Placeholder for resource display
        console.log('Show resource:', type);
    },

    closeModal() {
        document.getElementById('crisis-modal').classList.add('hidden');
    },

    clearSession() {
        if (confirm('Start a new session? Current conversation will be cleared.')) {
            this.createNewSession();
            localStorage.removeItem('cbt_session');
            document.getElementById('chat-history').innerHTML = `
                <div class="chat-message bot-message">
                    <div class="message-content">
                        <p><strong>New session started</strong></p>
                        <p>I'm ready to help you with your habits. What would you like to work on today?</p>
                    </div>
                    <span class="message-time">Now</span>
                </div>
            `;
        }
    },

    changeApiKey() {
        const newKey = prompt(
            '🔑 Enter your new Google Generative AI API key:\n\n' +
            'It must start with "AQ."\n\n' +
            'Get it from: https://aistudio.google.com/app/apikey'
        );
        
        if (newKey && newKey.trim()) {
            const trimmedKey = newKey.trim();
            
            // Validate API key format
            if (!trimmedKey.startsWith('AQ.')) {
                alert('❌ Invalid API Key!\n\n' +
                    'Google API keys must start with "AQ."\n\n' +
                    'You provided: ' + trimmedKey.substring(0, 30) + '...\n\n' +
                    'Please get a valid key from:\n' +
                    'https://aistudio.google.com/app/apikey');
                this.changeApiKey();
                return;
            }
            
            if (trimmedKey.length < 20) {
                alert('❌ API Key Too Short!\n\n' +
                    'Google API keys are usually 40+ characters.\n\n' +
                    'Make sure you copied the entire key.');
                this.changeApiKey();
                return;
            }
            
            localStorage.setItem('cbt_google_api_key', trimmedKey);
            this.googleApiKey = trimmedKey;
            alert('✅ API key updated!\n\nThe app will use your new key for all future requests.');
        }
    },

    /* ========== UTILITIES ========== */

    generateId() {
        return Math.random().toString(36).substr(2, 9);
    },

    getCurrentTime() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => app.init());
