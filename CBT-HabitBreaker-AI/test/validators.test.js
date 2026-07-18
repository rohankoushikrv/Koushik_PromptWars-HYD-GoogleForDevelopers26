const test = require('node:test');
const assert = require('node:assert');
const {
    validateInput,
    sanitizeInput,
    extractHabitInfo,
    analyzePatterns,
    checkForConcerningContent,
    validateChatRequest
} = require('../backend/utils/validators');

test('Validators - validateInput', (t) => {
    assert.strictEqual(validateInput(''), false, 'Empty string should be invalid');
    assert.strictEqual(validateInput(null), false, 'Null should be invalid');
    assert.strictEqual(validateInput(undefined), false, 'Undefined should be invalid');
    assert.strictEqual(validateInput('   '), false, 'Whitespace-only string should be invalid');
    assert.strictEqual(validateInput('A valid habit description'), true, 'Normal text should be valid');
    assert.strictEqual(validateInput('a'.repeat(5001)), false, 'Input longer than 5000 characters should be invalid');
});

test('Validators - sanitizeInput', (t) => {
    const maliciousInput = '<script>alert("hack")</script>Hello! <img src="x" onerror="alert(1)">';
    const sanitized = sanitizeInput(maliciousInput);
    assert.ok(!sanitized.includes('<script>'), 'Should strip script tags');
    assert.ok(!sanitized.includes('onerror'), 'Should strip inline handlers');
    assert.strictEqual(sanitizeInput('  clean text  '), 'clean text', 'Should trim whitespace');
});

test('Validators - extractHabitInfo', (t) => {
    const smokingMsg = 'I want to quit smoking cigarettes today.';
    const screenMsg = 'I spend too much time on my phone and scrolling on Instagram.';
    const unrecognizedMsg = 'I am trying to learn a new language.';

    const smokingContext = extractHabitInfo(smokingMsg);
    assert.strictEqual(smokingContext.type, 'smoking');
    assert.strictEqual(smokingContext.name, 'smoking');
    assert.ok(smokingContext.description);

    const screenContext = extractHabitInfo(screenMsg);
    assert.strictEqual(screenContext.type, 'screen_time');
    assert.strictEqual(screenContext.name, 'screen time');

    const noContext = extractHabitInfo(unrecognizedMsg);
    assert.strictEqual(noContext, null);

    // Context preservation if existing
    const existing = { type: 'custom', name: 'Custom' };
    const preserved = extractHabitInfo(smokingMsg, existing);
    assert.deepStrictEqual(preserved, existing);
});

test('Validators - analyzePatterns', (t) => {
    const messages = [
        'I am feeling very frustrated and anxious about my habits.',
        'But I managed to resist the craving today!'
    ];

    const analysis = analyzePatterns(messages);
    assert.ok(analysis);
    assert.strictEqual(analysis.messageCount, 2);
    assert.ok(analysis.emotionalKeywords.includes('frustrated'));
    assert.ok(analysis.emotionalKeywords.includes('anxious'));
    assert.ok(analysis.emotionalKeywords.includes('craving'));
    assert.strictEqual(analysis.copingAttempts.length, 1);
    assert.ok(analysis.copingAttempts[0].includes('managed'));
});

test('Validators - checkForConcerningContent', (t) => {
    assert.strictEqual(checkForConcerningContent('I feel like I want to self-harm.'), true);
    assert.strictEqual(checkForConcerningContent('I am thinking about suicide.'), true);
    assert.strictEqual(checkForConcerningContent('I am having a regular day.'), false);
});

test('Validators - validateChatRequest', (t) => {
    const validBody = { sessionId: '12345', message: 'Hello AI' };
    assert.deepStrictEqual(validateChatRequest(validBody), { valid: true });

    const missingSession = { message: 'Hello AI' };
    assert.strictEqual(validateChatRequest(missingSession).valid, false);

    const emptyMessage = { sessionId: '12345', message: ' ' };
    assert.strictEqual(validateChatRequest(emptyMessage).valid, false);
});
