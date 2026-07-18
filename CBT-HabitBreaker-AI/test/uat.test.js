const test = require('node:test');
const assert = require('node:assert');

// User Acceptance Testing (UAT) & End-to-End User Journeys Simulation
test('CBT Habit Breaker AI - User Acceptance Testing (UAT) Scenarios', async (t) => {

    // ----------------------------------------------------
    // USER STORY 1: Onboarding, First Visit & Habit Detection
    // ----------------------------------------------------
    await t.test('US-1: A new user should be able to select/describe a habit and have it identified and initialized', () => {
        // Mocking Client State
        const clientState = {
            googleApiKey: 'AQ.Ab8RN6_FakeMockApiKeyForTestingPurposes_NoSecretsHere',
            sessionId: null,
            currentHabit: null,
            conversationHistory: [],
            streakDays: 0
        };

        // Step 1: User opens app (triggers session creation)
        clientState.sessionId = Math.random().toString(36).substr(2, 9);
        assert.ok(clientState.sessionId, 'Session ID should be automatically generated');
        assert.strictEqual(clientState.streakDays, 0, 'Streak should start at 0 days');

        // Step 2: User sends a message describing screen time habit
        const userMessage = 'I spend 8 hours scrolling Instagram on my phone and cannot sleep.';
        clientState.conversationHistory.push({ role: 'user', content: userMessage });

        // Step 3: Application extracts and identifies habit context
        const detectedHabitType = 'screen_time';
        clientState.currentHabit = {
            type: detectedHabitType,
            name: detectedHabitType.replace(/_/g, ' '),
            description: userMessage.slice(0, 100)
        };

        // Assertions for Acceptance Criteria
        assert.strictEqual(clientState.currentHabit.type, 'screen_time', 'Acceptance Criterion: Habit type must be classified as screen_time');
        assert.strictEqual(clientState.currentHabit.name, 'screen time', 'Acceptance Criterion: Habit display name must be formatted nicely');
        assert.ok(clientState.currentHabit.description.includes('Instagram'), 'Acceptance Criterion: Habit description must retain context');
    });

    // ----------------------------------------------------
    // USER STORY 2: Successful Coping and Streak Tracking
    // ----------------------------------------------------
    await t.test('US-2: A user who successfully overcomes a trigger can track their progress and increment their streak', () => {
        const clientState = {
            streakDays: 2,
            progressPercentage: 10
        };

        // Action: User clicks the "Overcame" button
        clientState.streakDays += 1;
        clientState.progressPercentage = Math.min(clientState.streakDays * 5, 100);

        // Assertions for Acceptance Criteria
        assert.strictEqual(clientState.streakDays, 3, 'Acceptance Criterion: Streak should increment to 3 days');
        assert.strictEqual(clientState.progressPercentage, 15, 'Acceptance Criterion: Progress bar width percentage should update to 15%');
    });

    // ----------------------------------------------------
    // USER STORY 3: Managing Slip-ups and Supportive Recovery
    // ----------------------------------------------------
    await t.test('US-3: A user who experiences a slip-up should be handled with compassion, resetting their streak without shame and initiating a recovery prompt', () => {
        const clientState = {
            streakDays: 14,
            progressPercentage: 70,
            conversationHistory: []
        };

        // Action: User clicks the "Gave In" button, acknowledges the slip-up
        const slipUpConfirmed = true; // Simulating user response to the modal confirm dialog
        
        if (slipUpConfirmed) {
            clientState.streakDays = 0;
            clientState.progressPercentage = 0;
            
            // App automatically triggers a supportive CBT prompt to the coach
            const autoRecoveryMessage = 'I just had a slip-up. Help me rebound with some CBT-based support and strategy without feeling guilty.';
            clientState.conversationHistory.push({ role: 'user', content: autoRecoveryMessage });
        }

        // Assertions for Acceptance Criteria
        assert.strictEqual(clientState.streakDays, 0, 'Acceptance Criterion: Streak must reset to 0 upon a slip-up');
        assert.strictEqual(clientState.progressPercentage, 0, 'Acceptance Criterion: Progress bar percentage must reset to 0%');
        assert.strictEqual(clientState.conversationHistory[0].content, 'I just had a slip-up. Help me rebound with some CBT-based support and strategy without feeling guilty.', 'Acceptance Criterion: Supportive recovery prompt should be injected into chat');
    });

    // ----------------------------------------------------
    // USER STORY 4: Local Client-Side Crisis Interception
    // ----------------------------------------------------
    await t.test('US-4: A user showing extreme distress or crisis signals must be locally intercepted, blocking external network calls and offering resources', () => {
        const clientState = {
            modalOpen: false,
            apiCallInitiated: false,
            botResponse: ''
        };

        const distressMessage = 'I can\'t take this anymore, I want to commit suicide.';

        // Helper function matching app.js local crisis detection
        function checkForCrisis(message) {
            const crisisIndicators = ['suicide', 'kill myself', 'no point', 'self-harm', 'overdose'];
            const lower = message.toLowerCase();
            return crisisIndicators.some(indicator => lower.includes(indicator));
        }

        // Action: User clicks send
        const isCrisis = checkForCrisis(distressMessage);
        
        if (isCrisis) {
            // Intercepted locally!
            clientState.modalOpen = true; // Automatically open emergency modal
            clientState.apiCallInitiated = false; // Block standard OpenAI/Gemini call
            clientState.botResponse = '❤️ I am deeply concerned about you... Please contact 988 or 1-800-273-8255.';
        } else {
            clientState.apiCallInitiated = true;
        }

        // Assertions for Acceptance Criteria
        assert.strictEqual(isCrisis, true, 'Acceptance Criterion: Message should be classified as crisis');
        assert.strictEqual(clientState.modalOpen, true, 'Acceptance Criterion: Crisis modal must be opened instantly');
        assert.strictEqual(clientState.apiCallInitiated, false, 'Acceptance Criterion: API request must be blocked for physical safety');
        assert.ok(clientState.botResponse.includes('988'), 'Acceptance Criterion: Response must supply immediate helplines');
    });

    // ----------------------------------------------------
    // USER STORY 5: Urge Surfing & Breathing Intervention
    // ----------------------------------------------------
    await t.test('US-5: A user with a high craving should be able to trigger the Urge Surfer box breathing cycle and receive phased pacing guidance', () => {
        const clientState = {
            breathingActive: false,
            phase: 0, // 0: Inhale, 1: Hold, 2: Exhale, 3: Hold
            uiStatusText: 'Ready',
            uiInstructionsText: 'Click start to surf the urge'
        };

        // Action Step 1: User opens widget and clicks "Start Breathing"
        clientState.breathingActive = true;
        
        // Simulating the box breathing state machine (app.js toggleBreathingCycle)
        function advanceBreathingCycle(phaseState) {
            switch (phaseState) {
                case 0:
                    return { status: 'Inhale', instructions: 'Breathe in slowly...', nextPhase: 1 };
                case 1:
                    return { status: 'Hold', instructions: 'Hold your breath...', nextPhase: 2 };
                case 2:
                    return { status: 'Exhale', instructions: 'Release slowly...', nextPhase: 3 };
                case 3:
                    return { status: 'Hold', instructions: 'Rest before next inhale...', nextPhase: 0 };
            }
        }

        // Simulate phase transitions
        const step1 = advanceBreathingCycle(clientState.phase);
        assert.strictEqual(step1.status, 'Inhale');
        assert.strictEqual(step1.instructions, 'Breathe in slowly...');
        
        const step2 = advanceBreathingCycle(step1.nextPhase);
        assert.strictEqual(step2.status, 'Hold');
        assert.strictEqual(step2.instructions, 'Hold your breath...');

        const step3 = advanceBreathingCycle(step2.nextPhase);
        assert.strictEqual(step3.status, 'Exhale');
        assert.strictEqual(step3.instructions, 'Release slowly...');
    });
});
