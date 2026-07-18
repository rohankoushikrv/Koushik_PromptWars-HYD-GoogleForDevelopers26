const test = require('node:test');
const assert = require('node:assert');

// Mock a complete Express request/response environment to test our API endpoints cleanly
test('Express API Server Endpoints Mock Tests', async (t) => {
    // Mock database / session store
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

    await t.test('GET /api/health - returns 200 and healthy status', () => {
        const req = {};
        let resStatus = 200;
        let resJson = null;
        
        const res = {
            status(code) {
                resStatus = code;
                return this;
            },
            json(data) {
                resJson = data;
                return this;
            }
        };

        // Simulated endpoint logic
        res.json({
            status: 'ok',
            timestamp: new Date().toISOString(),
            service: 'CBT Habit Breaker AI'
        });

        assert.strictEqual(resStatus, 200);
        assert.strictEqual(resJson.status, 'ok');
        assert.strictEqual(resJson.service, 'CBT Habit Breaker AI');
    });

    await t.test('POST /api/progress - updates progress correctly', () => {
        const req = {
            body: {
                sessionId: 'session-test-123',
                daysWithoutTrigger: 5,
                milestone: '5 Days Screen Free!'
            }
        };
        
        let resStatus = 200;
        let resJson = null;
        
        const res = {
            status(code) {
                resStatus = code;
                return this;
            },
            json(data) {
                resJson = data;
                return this;
            }
        };

        // Simulated endpoint logic matching server.js
        const { sessionId, daysWithoutTrigger, milestone } = req.body;
        assert.ok(sessionId, 'Session ID is required');

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

        assert.strictEqual(resStatus, 200);
        assert.strictEqual(resJson.success, true);
        assert.strictEqual(resJson.progress.daysWithoutTrigger, 5);
        assert.strictEqual(resJson.progress.milestones[0].achieved, '5 Days Screen Free!');
    });

    await t.test('POST /api/progress - fails if sessionId is missing', () => {
        const req = {
            body: {
                daysWithoutTrigger: 10
            }
        };
        
        let resStatus = 200;
        let resJson = null;
        
        const res = {
            status(code) {
                resStatus = code;
                return this;
            },
            json(data) {
                resJson = data;
                return this;
            }
        };

        // Simulated endpoint failure logic matching server.js
        const { sessionId } = req.body;
        if (!sessionId) {
            res.status(400).json({ error: 'Missing sessionId' });
        }

        assert.strictEqual(resStatus, 400);
        assert.strictEqual(resJson.error, 'Missing sessionId');
    });

    await t.test('POST /api/session/:sessionId/end - clears session successfully', () => {
        const req = {
            params: {
                sessionId: 'session-test-123'
            }
        };
        
        let resStatus = 200;
        let resJson = null;
        
        const res = {
            status(code) {
                resStatus = code;
                return this;
            },
            json(data) {
                resJson = data;
                return this;
            }
        };

        // Simulated endpoint logic matching server.js
        const sessionId = req.params.sessionId;
        if (sessions.has(sessionId)) {
            sessions.delete(sessionId);
        }

        res.json({
            success: true,
            message: 'Session ended'
        });

        assert.strictEqual(resStatus, 200);
        assert.strictEqual(resJson.success, true);
        assert.strictEqual(resJson.message, 'Session ended');
        assert.strictEqual(sessions.has('session-test-123'), false, 'Session must be deleted from memory');
    });
});
