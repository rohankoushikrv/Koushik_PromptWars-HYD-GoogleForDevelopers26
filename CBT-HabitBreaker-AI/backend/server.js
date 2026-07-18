/* ========================================
   CBT Habit Breaker - Express Server
   ======================================== */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cbtAgent = require('./agents/cbt-agent');
const { validateInput, sanitizeInput } = require('./utils/validators');
const { generateSessionId } = require('./utils/security');

const app = express();
const PORT = process.env.PORT || 3000;

// ========== MIDDLEWARE ==========

app.use(cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    credentials: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});

// ========== SESSION STORE ==========
// In production, use Redis or a database
const sessions = new Map();

function getOrCreateSession(sessionId) {
    if (!sessions.has(sessionId)) {
        sessions.set(sessionId, {
            id: sessionId,
            createdAt: new Date(),
            messages: [],
            habitContext: null,
            progress: {
                daysWithoutTrigger: 0,
                strategies: [],
                milestones: []
            }
        });
    }
    return sessions.get(sessionId);
}

// ========== ROUTES ==========

/**
 * Health Check Endpoint
 */
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        service: 'CBT Habit Breaker AI'
    });
});

/**
 * Chat Endpoint - Main interaction point
 * POST /api/chat
 */
app.post('/api/chat', async (req, res) => {
    try {
        // Validate input
        const { sessionId, message, habitContext, messageCount } = req.body;

        if (!sessionId || !message) {
            return res.status(400).json({
                error: 'Missing required fields: sessionId, message'
            });
        }

        // Validate and sanitize
        if (!validateInput(message)) {
            return res.status(400).json({
                error: 'Invalid input'
            });
        }

        const cleanMessage = sanitizeInput(message);

        // Get or create session
        const session = getOrCreateSession(sessionId);

        // Add user message to session
        session.messages.push({
            role: 'user',
            content: cleanMessage,
            timestamp: new Date()
        });

        // Get AI response from CBT Agent
        const aiResponse = await cbtAgent.processMessage(
            cleanMessage,
            session.messages,
            habitContext
        );

        // Add AI message to session
        session.messages.push({
            role: 'assistant',
            content: aiResponse.message,
            timestamp: new Date()
        });

        // Update session with extracted context
        if (aiResponse.habit) {
            session.habitContext = aiResponse.habit;
        }

        if (aiResponse.progress) {
            session.progress = { ...session.progress, ...aiResponse.progress };
        }

        // Return response
        res.json({
            success: true,
            message: aiResponse.message,
            habit: aiResponse.habit || session.habitContext,
            strategies: aiResponse.strategies || [],
            progress: session.progress,
            messageCount: session.messages.length
        });

    } catch (error) {
        console.error('Chat endpoint error:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

/**
 * Get Session Information
 * GET /api/session/:sessionId
 */
app.get('/api/session/:sessionId', (req, res) => {
    try {
        const session = getOrCreateSession(req.params.sessionId);

        res.json({
            sessionId: session.id,
            createdAt: session.createdAt,
            messageCount: session.messages.length,
            habitContext: session.habitContext,
            progress: session.progress
        });

    } catch (error) {
        console.error('Session endpoint error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * Update Progress
 * POST /api/progress
 */
app.post('/api/progress', (req, res) => {
    try {
        const { sessionId, daysWithoutTrigger, milestone } = req.body;

        if (!sessionId) {
            return res.status(400).json({ error: 'Missing sessionId' });
        }

        const session = getOrCreateSession(sessionId);

        if (daysWithoutTrigger !== undefined) {
            session.progress.daysWithoutTrigger = daysWithoutTrigger;
        }

        if (milestone) {
            session.progress.milestones.push({
                achieved: milestone,
                date: new Date()
            });
        }

        res.json({
            success: true,
            progress: session.progress
        });

    } catch (error) {
        console.error('Progress endpoint error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * Get Personalized Strategies
 * GET /api/strategies/:sessionId
 */
app.get('/api/strategies/:sessionId', async (req, res) => {
    try {
        const session = getOrCreateSession(req.params.sessionId);

        // Generate strategies based on context
        const strategies = await cbtAgent.generateStrategies(
            session.habitContext,
            session.messages
        );

        session.progress.strategies = strategies;

        res.json({
            success: true,
            strategies: strategies
        });

    } catch (error) {
        console.error('Strategies endpoint error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * Clear/End Session
 * POST /api/session/:sessionId/end
 */
app.post('/api/session/:sessionId/end', (req, res) => {
    try {
        const sessionId = req.params.sessionId;

        if (sessions.has(sessionId)) {
            sessions.delete(sessionId);
        }

        res.json({
            success: true,
            message: 'Session ended'
        });

    } catch (error) {
        console.error('End session error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * Error handling middleware
 */
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// ========== SERVER START ==========

app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════════════════╗
║        🧠 CBT Habit Breaker AI Server Started          ║
║                                                        ║
║  Server: http://localhost:${PORT}                          ║
║  Environment: ${process.env.NODE_ENV || 'development'}                       ║
║  Timestamp: ${new Date().toISOString()}        ║
╚════════════════════════════════════════════════════════╝
    `);
});

module.exports = app;
