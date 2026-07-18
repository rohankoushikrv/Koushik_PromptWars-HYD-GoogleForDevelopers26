/* ========================================
   CBT AI Agent - Core Engine
   Specialized in Behavioral Psychology & CBT
   ======================================== */

const axios = require('axios');
const { cbtSystemPrompt, habitAnalysisPrompt, strategiesPrompt } = require('../utils/prompts');
const { extractHabitInfo, analyzePatterns } = require('../utils/validators');

class CBTAgent {
    constructor() {
        this.apiKey = process.env.OPENAI_API_KEY;
        this.model = process.env.AI_MODEL || 'gpt-4';
        this.temperature = parseFloat(process.env.AI_TEMPERATURE) || 0.7;
        this.maxTokens = parseInt(process.env.MAX_TOKENS) || 2000;
        this.baseUrl = 'https://api.openai.com/v1';
    }

    /**
     * Process user message and generate CBT-informed response
     */
    async processMessage(userMessage, conversationHistory, habitContext) {
        try {
            // Build conversation context
            const messages = this.buildConversationContext(
                userMessage,
                conversationHistory,
                habitContext
            );

            // Call LLM with CBT system prompt
            const response = await this.callLLM(messages);

            // Parse and structure response
            const parsedResponse = this.parseResponse(response);

            // Extract habit information
            const habitInfo = extractHabitInfo(userMessage, habitContext);

            return {
                message: parsedResponse.message,
                habit: habitInfo,
                strategies: parsedResponse.strategies || [],
                progress: parsedResponse.progress || {},
                thoughtRecord: parsedResponse.thoughtRecord || null
            };

        } catch (error) {
            console.error('CBT Agent error:', error);
            throw error;
        }
    }

    /**
     * Build conversation context with CBT awareness
     */
    buildConversationContext(userMessage, history, habitContext) {
        const messages = [
            {
                role: 'system',
                content: cbtSystemPrompt
            }
        ];

        // Add conversation history (last 10 messages)
        const relevantHistory = history.slice(-10);
        messages.push(...relevantHistory);

        // Add current message with context
        const contextualMessage = habitContext
            ? `[Habit Context: ${JSON.stringify(habitContext)}]\n\nUser: ${userMessage}`
            : userMessage;

        messages.push({
            role: 'user',
            content: contextualMessage
        });

        return messages;
    }

    /**
     * Call OpenAI API or other LLM
     */
    async callLLM(messages) {
        try {
            const response = await axios.post(
                `${this.baseUrl}/chat/completions`,
                {
                    model: this.model,
                    messages: messages,
                    temperature: this.temperature,
                    max_tokens: this.maxTokens,
                    top_p: 0.95,
                    frequency_penalty: 0,
                    presence_penalty: 0
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            return response.data.choices[0].message.content;

        } catch (error) {
            console.error('LLM API error:', error.response?.data || error.message);
            throw new Error('Failed to get AI response');
        }
    }

    /**
     * Parse LLM response and extract structured data
     */
    parseResponse(responseText) {
        // Extract thought record if present
        const thoughtRecordMatch = responseText.match(
            /\[THOUGHT RECORD\]([\s\S]*?)\[\/THOUGHT RECORD\]/
        );

        // Extract strategies if present
        const strategiesMatch = responseText.match(
            /\[STRATEGIES\]([\s\S]*?)\[\/STRATEGIES\]/
        );

        let strategies = [];
        if (strategiesMatch) {
            try {
                strategies = JSON.parse(strategiesMatch[1]);
            } catch (e) {
                // Fallback: split by bullet points
                strategies = strategiesMatch[1]
                    .split('\n')
                    .filter(line => line.trim())
                    .map(line => ({
                        title: line.replace(/^[-•*]\s*/, ''),
                        description: 'CBT-based coping strategy'
                    }));
            }
        }

        // Extract progress markers
        const progressMatch = responseText.match(
            /\[PROGRESS\]([\s\S]*?)\[\/PROGRESS\]/
        );

        let progress = {};
        if (progressMatch) {
            try {
                progress = JSON.parse(progressMatch[1]);
            } catch (e) {
                console.log('Could not parse progress data');
            }
        }

        // Clean message: remove tags
        let message = responseText
            .replace(/\[THOUGHT RECORD\][\s\S]*?\[\/THOUGHT RECORD\]/g, '')
            .replace(/\[STRATEGIES\][\s\S]*?\[\/STRATEGIES\]/g, '')
            .replace(/\[PROGRESS\][\s\S]*?\[\/PROGRESS\]/g, '')
            .trim();

        return {
            message,
            strategies,
            progress,
            thoughtRecord: thoughtRecordMatch ? thoughtRecordMatch[1] : null
        };
    }

    /**
     * Generate personalized coping strategies
     */
    async generateStrategies(habitContext, conversationHistory) {
        try {
            if (!habitContext) {
                return [];
            }

            const messages = [
                {
                    role: 'system',
                    content: strategiesPrompt
                },
                {
                    role: 'user',
                    content: `Generate CBT-based coping strategies for: ${habitContext.name || habitContext}`
                }
            ];

            const response = await this.callLLM(messages);

            // Parse strategies from response
            const strategies = response
                .split('\n')
                .filter(line => line.trim() && (line.includes('-') || line.includes('•')))
                .map(line => ({
                    title: line.replace(/^[-•*]\s*/, '').split(':')[0],
                    description: line.replace(/^[-•*]\s*/, '').split(':')[1] || 'Coping strategy'
                }));

            return strategies;

        } catch (error) {
            console.error('Strategy generation error:', error);
            return [];
        }
    }

    /**
     * Analyze patterns in user's messages
     */
    analyzeUserPatterns(conversationHistory) {
        if (!conversationHistory || conversationHistory.length === 0) {
            return null;
        }

        const userMessages = conversationHistory
            .filter(msg => msg.role === 'user')
            .map(msg => msg.content);

        return analyzePatterns(userMessages);
    }

    /**
     * Detect crisis indicators
     */
    detectCrisisIndicators(userMessage) {
        const crisisKeywords = [
            'suicide',
            'kill myself',
            'no point',
            'give up',
            'can\'t take it',
            'want to die',
            'harm myself',
            'self-harm',
            'overdose'
        ];

        const lowerMessage = userMessage.toLowerCase();

        const hasCrisisIndicator = crisisKeywords.some(keyword =>
            lowerMessage.includes(keyword)
        );

        return hasCrisisIndicator;
    }

    /**
     * Generate crisis response
     */
    generateCrisisResponse() {
        return `⚠️ **I'm concerned about what you've shared.**

I'm an AI assistant and cannot provide emergency mental health support. If you're experiencing thoughts of self-harm or suicide, please reach out immediately:

🆘 **National Suicide Prevention Lifeline**: 1-800-273-8255 (24/7)
💬 **Crisis Text Line**: Text HOME to 741741
🏥 **Emergency**: Call 911 or go to your nearest emergency room

You matter, and help is available right now. Please reach out to someone you trust or a professional.`;
    }
}

// Singleton instance
const cbtAgent = new CBTAgent();

module.exports = cbtAgent;
