/* ========================================
   CBT Habit Breaker - Frontend Application
   Static Webapp - GitHub Pages Ready
   ======================================== */

const app = {
    // OpenAI Configuration
    openaiApiKey: null,
    openaiModel: 'gpt-4',
    
    // Local Configuration
    sessionId: null,
    currentHabit: null,
    messageCount: 0,
    conversationHistory: [],

    /* ========== INITIALIZATION ========== */

    async init() {
        console.log('🚀 CBT Habit Breaker initialized');
        
        // Check for API key
        this.openaiApiKey = this.getApiKey();
        if (!this.openaiApiKey) {
            this.showApiKeyPrompt();
            return;
        }

        this.setupEventListeners();
        this.createNewSession();
        this.loadPreviousSession();
    },

    getApiKey() {
        // Try to get from localStorage first
        let key = localStorage.getItem('cbt_openai_api_key');
        if (key) return key;

        // Try to get from environment variable
        if (typeof process !== 'undefined' && process.env?.VITE_OPENAI_API_KEY) {
            return process.env.VITE_OPENAI_API_KEY;
        }

        return null;
    },

    showApiKeyPrompt() {
        const apiKey = prompt(
            '🔑 Enter your OpenAI API key to get started:\n\n' +
            'Get it from: https://platform.openai.com/api-keys\n\n' +
            'Your key is stored locally and never sent to any server except OpenAI.'
        );

        if (apiKey && apiKey.trim()) {
            localStorage.setItem('cbt_openai_api_key', apiKey.trim());
            this.openaiApiKey = apiKey.trim();
            this.setupEventListeners();
            this.createNewSession();
        } else {
            alert('API key is required to use this application.');
            document.getElementById('chat-history').innerHTML = `
                <div class="chat-message bot-message">
                    <div class="message-content">
                        <p><strong>API Key Required</strong></p>
                        <p>To use CBT Habit Breaker, you need to provide an OpenAI API key.</p>
                        <p><a href="https://platform.openai.com/api-keys" target="_blank">Get your API key here</a></p>
                        <p>Reload the page after obtaining your key.</p>
                    </div>
                </div>
            `;
        }
    },

    setupEventListeners() {
        const messageInput = document.getElementById('message-input');
        const sendBtn = document.getElementById('send-btn');

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
        if (!this.openaiApiKey) {
            alert('API key not configured. Please refresh and enter your API key.');
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
                '❌ Error: ' + error.message + '\n\nMake sure your API key is valid and has available credits.',
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
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.openaiApiKey}`
                },
                body: JSON.stringify({
                    model: this.openaiModel,
                    messages: [
                        { role: 'system', content: systemPrompt },
                        ...this.conversationHistory.slice(-10),
                        { role: 'user', content: userMessage }
                    ],
                    temperature: 0.7,
                    max_tokens: 2000
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error?.message || 'API request failed');
            }

            const data = await response.json();
            return data.choices[0].message.content;

        } catch (error) {
            console.error('OpenAI API error:', error);
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
        const newKey = prompt('Enter your new OpenAI API key:');
        if (newKey && newKey.trim()) {
            localStorage.setItem('cbt_openai_api_key', newKey.trim());
            this.openaiApiKey = newKey.trim();
            alert('API key updated! Reload the page to apply changes.');
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
