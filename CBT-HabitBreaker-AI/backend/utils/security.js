/* ========================================
   Security Utilities
   ======================================== */

const crypto = require('crypto');
const jwt = require('jsonwebtoken');

/**
 * Generate a secure session ID
 */
function generateSessionId() {
    return crypto.randomBytes(16).toString('hex');
}

/**
 * Hash sensitive data
 */
function hashData(data) {
    return crypto
        .createHash('sha256')
        .update(data)
        .digest('hex');
}

/**
 * Rate limiting check
 */
const rateLimitStore = new Map();

function checkRateLimit(identifier, maxRequests = 100, windowMs = 60000) {
    const now = Date.now();
    const key = hashData(identifier);

    if (!rateLimitStore.has(key)) {
        rateLimitStore.set(key, []);
    }

    let requests = rateLimitStore.get(key);

    // Remove old requests outside the window
    requests = requests.filter(time => now - time < windowMs);

    if (requests.length >= maxRequests) {
        return false;
    }

    requests.push(now);
    rateLimitStore.set(key, requests);

    return true;
}

/**
 * Encrypt sensitive data
 */
function encryptData(data, encryptionKey) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(
        'aes-256-cbc',
        Buffer.from(encryptionKey, 'hex'),
        iv
    );

    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return `${iv.toString('hex')}:${encrypted}`;
}

/**
 * Decrypt sensitive data
 */
function decryptData(encryptedData, encryptionKey) {
    try {
        const [iv, encrypted] = encryptedData.split(':');

        const decipher = crypto.createDecipheriv(
            'aes-256-cbc',
            Buffer.from(encryptionKey, 'hex'),
            Buffer.from(iv, 'hex')
        );

        let decrypted = decipher.update(encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');

        return decrypted;
    } catch (error) {
        throw new Error('Decryption failed');
    }
}

/**
 * Validate session token
 */
function validateSessionToken(token) {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return { valid: true, data: decoded };
    } catch (error) {
        return { valid: false, error: error.message };
    }
}

/**
 * Create session token
 */
function createSessionToken(sessionId) {
    return jwt.sign(
        { sessionId, createdAt: new Date() },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );
}

/**
 * CORS middleware
 */
function corsMiddleware(allowedOrigins) {
    return (req, res, next) => {
        const origin = req.headers.origin;

        if (allowedOrigins.includes(origin)) {
            res.header('Access-Control-Allow-Origin', origin);
            res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        }

        if (req.method === 'OPTIONS') {
            return res.sendStatus(200);
        }

        next();
    };
}

/**
 * Sanitize HTML
 */
function sanitizeHtml(html) {
    return html
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
}

module.exports = {
    generateSessionId,
    hashData,
    checkRateLimit,
    encryptData,
    decryptData,
    validateSessionToken,
    createSessionToken,
    corsMiddleware,
    sanitizeHtml
};
