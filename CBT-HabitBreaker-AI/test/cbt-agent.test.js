const test = require('node:test');
const assert = require('node:assert');
const cbtAgent = require('../backend/agents/cbt-agent');

test('CBTAgent - detectCrisisIndicators', (t) => {
    assert.strictEqual(cbtAgent.detectCrisisIndicators('I want to commit suicide'), true);
    assert.strictEqual(cbtAgent.detectCrisisIndicators('I am thinking of self-harm'), true);
    assert.strictEqual(cbtAgent.detectCrisisIndicators('I feel like there is no point anymore'), true);
    assert.strictEqual(cbtAgent.detectCrisisIndicators('I had a good cup of tea today'), false);
});

test('CBTAgent - generateCrisisResponse', (t) => {
    const response = cbtAgent.generateCrisisResponse();
    assert.ok(response.includes('1-800-273-8255'));
    assert.ok(response.includes('741741'));
    assert.ok(response.includes('Emergency'));
});

test('CBTAgent - buildConversationContext', (t) => {
    const history = [
        { role: 'user', content: 'Hello' },
        { role: 'assistant', content: 'Hi there' }
    ];
    const context = cbtAgent.buildConversationContext('I want to break smoking', history, { name: 'smoking' });
    
    assert.ok(context.length >= 3);
    assert.strictEqual(context[0].role, 'system');
    assert.ok(context[0].content.includes('CBT and Behavioral Psychology'));
    
    // Check that context contains history
    assert.strictEqual(context[1].content, 'Hello');
    assert.strictEqual(context[2].content, 'Hi there');
    
    // Last element should be contextual user prompt containing habitContext
    const lastElement = context[context.length - 1];
    assert.strictEqual(lastElement.role, 'user');
    assert.ok(lastElement.content.includes('smoking'));
});

test('CBTAgent - parseResponse', (t) => {
    const rawResponse = `
[THOUGHT RECORD]
Situation: craving screen time
Automatic Thoughts: I must scroll
[/THOUGHT RECORD]

[STRATEGIES]
[
  {"title": "10-minute Rule", "description": "Delay action by 10 mins"}
]
[/STRATEGIES]

[PROGRESS]
{"daysWithoutTrigger": 3}
[/PROGRESS]

I think you are doing really well. Keep going!
`;

    const parsed = cbtAgent.parseResponse(rawResponse);
    
    assert.ok(parsed.message.includes('I think you are doing really well.'));
    assert.ok(!parsed.message.includes('[THOUGHT RECORD]'));
    assert.ok(!parsed.message.includes('[PROGRESS]'));
    
    assert.strictEqual(parsed.thoughtRecord.trim(), 'Situation: craving screen time\nAutomatic Thoughts: I must scroll');
    assert.strictEqual(parsed.strategies.length, 1);
    assert.strictEqual(parsed.strategies[0].title, '10-minute Rule');
    assert.strictEqual(parsed.progress.daysWithoutTrigger, 3);
});

test('CBTAgent - analyzeUserPatterns', (t) => {
    const history = [
        { role: 'user', content: 'I am so frustrated with this' },
        { role: 'assistant', content: 'I hear you.' },
        { role: 'user', content: 'I managed to resist the trigger though!' }
    ];
    
    const analysis = cbtAgent.analyzeUserPatterns(history);
    assert.ok(analysis);
    assert.strictEqual(analysis.messageCount, 2);
    assert.ok(analysis.emotionalKeywords.includes('frustrated'));
    assert.strictEqual(analysis.copingAttempts.length, 1);
    assert.ok(analysis.copingAttempts[0].includes('managed'));
});
