const test = require('node:test');
const assert = require('node:assert');
const {
    generateSessionId,
    hashData,
    checkRateLimit,
    encryptData,
    decryptData
} = require('../backend/utils/security');

test('Security - generateSessionId', (t) => {
    const id1 = generateSessionId();
    const id2 = generateSessionId();
    assert.strictEqual(typeof id1, 'string');
    assert.strictEqual(id1.length, 32); // 16 bytes in hex is 32 chars
    assert.notStrictEqual(id1, id2, 'Session IDs must be unique');
});

test('Security - hashData', (t) => {
    const data = 'my-sensitive-data';
    const hash1 = hashData(data);
    const hash2 = hashData(data);
    const hash3 = hashData('other-data');

    assert.strictEqual(hash1, hash2, 'Hash must be deterministic');
    assert.notStrictEqual(hash1, hash3, 'Different data must produce different hashes');
});

test('Security - checkRateLimit', (t) => {
    const user = 'user-ip-address-123';
    
    // Perform 3 requests with limit 5, window 10000ms
    assert.strictEqual(checkRateLimit(user, 5, 10000), true);
    assert.strictEqual(checkRateLimit(user, 5, 10000), true);
    assert.strictEqual(checkRateLimit(user, 5, 10000), true);
    assert.strictEqual(checkRateLimit(user, 5, 10000), true);
    assert.strictEqual(checkRateLimit(user, 5, 10000), true);
    
    // 6th request should fail
    assert.strictEqual(checkRateLimit(user, 5, 10000), false, 'Should trigger rate limit');
});

test('Security - Encryption and Decryption', (t) => {
    // Standard AES key must be 32 bytes (64 hex characters)
    const secureKey = '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
    const secretText = 'This is a premium safe text for CBT therapy logs';
    
    const encrypted = encryptData(secretText, secureKey);
    assert.notStrictEqual(encrypted, secretText);
    assert.ok(encrypted.includes(':'), 'Encrypted output should format as iv:encryptedData');
    
    const decrypted = decryptData(encrypted, secureKey);
    assert.strictEqual(decrypted, secretText, 'Decrypted text must match the original input');

    // Test decryption failure
    assert.throws(() => {
        decryptData(encrypted, 'wrongkeyabcdef0123456789abcdef0123456789abcdef0123456789abcdef');
    }, /Decryption failed/, 'Wrong key should throw decryption error');
});
