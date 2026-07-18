/* ========================================
   Validation & Sanitization Utilities
   ======================================== */

/**
 * Validate user input
 */
function validateInput(input) {
    if (!input) return false;
    if (typeof input !== 'string') return false;
    if (input.trim().length === 0) return false;
    if (input.length > 5000) return false;

    return true;
}

/**
 * Sanitize input to prevent injection
 */
function sanitizeInput(input) {
    return input
        .trim()
        .replace(/<script[^>]*>.*?<\/script>/gi, '')
        .replace(/on\w+\s*=\s*['"]/gi, '')
        .slice(0, 5000);
}

/**
 * Extract habit information from user message
 */
function extractHabitInfo(userMessage, existingContext) {
    // Look for habit keywords
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
    let detectedHabit = null;
    for (const [habitType, keywords] of Object.entries(habitKeywords)) {
        if (keywords.some(keyword => lowerMessage.includes(keyword))) {
            detectedHabit = habitType;
            break;
        }
    }

    // Extract or build habit context
    if (existingContext) {
        return existingContext;
    }

    if (detectedHabit) {
        // Extract the actual habit description
        const habitMatch = userMessage.match(/^[^.!?]*[.!?]/);
        const description = habitMatch
            ? habitMatch[0].trim()
            : userMessage.slice(0, 100);

        return {
            type: detectedHabit,
            name: detectedHabit.replace(/_/g, ' '),
            description: description,
            detectedAt: new Date()
        };
    }

    return null;
}

/**
 * Analyze patterns in messages
 */
function analyzePatterns(messages) {
    if (!messages || messages.length === 0) return null;

    const analysis = {
        messageCount: messages.length,
        averageLength: messages.reduce((sum, msg) => sum + msg.length, 0) / messages.length,
        emotionalKeywords: [],
        triggerWords: [],
        copingAttempts: []
    };

    const emotionalWords = {
        negative: ['frustrated', 'angry', 'sad', 'depressed', 'anxious', 'stressed'],
        positive: ['hopeful', 'motivated', 'strong', 'resilient', 'proud'],
        craving: ['craving', 'want', 'urge', 'tempted', 'triggered']
    };

    const copingKeywords = ['tried', 'did', 'managed', 'resisted', 'avoided'];

    messages.forEach(msg => {
        const lowerMsg = msg.toLowerCase();

        // Find emotional keywords
        Object.values(emotionalWords).forEach(keywordList => {
            keywordList.forEach(keyword => {
                if (lowerMsg.includes(keyword)) {
                    analysis.emotionalKeywords.push(keyword);
                }
            });
        });

        // Find coping attempts
        copingKeywords.forEach(keyword => {
            if (lowerMsg.includes(keyword)) {
                analysis.copingAttempts.push(msg.slice(0, 50));
            }
        });
    });

    return analysis;
}

/**
 * Check for concerning content
 */
function checkForConcerningContent(message) {
    const crisisIndicators = [
        'suicide',
        'kill myself',
        'no point',
        'worthless',
        'can\'t take it',
        'want to die',
        'harm myself',
        'self-harm',
        'overdose'
    ];

    const lowerMessage = message.toLowerCase();

    return crisisIndicators.some(indicator =>
        lowerMessage.includes(indicator)
    );
}

/**
 * Validate API request structure
 */
function validateChatRequest(body) {
    const { sessionId, message } = body;

    if (!sessionId || typeof sessionId !== 'string') {
        return { valid: false, error: 'Invalid or missing sessionId' };
    }

    if (!message || typeof message !== 'string') {
        return { valid: false, error: 'Invalid or missing message' };
    }

    if (!validateInput(message)) {
        return { valid: false, error: 'Message validation failed' };
    }

    return { valid: true };
}

module.exports = {
    validateInput,
    sanitizeInput,
    extractHabitInfo,
    analyzePatterns,
    checkForConcerningContent,
    validateChatRequest
};
