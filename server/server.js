import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const NODE_ENV = process.env.NODE_ENV || 'development';
const GEMINI_EP = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

// ── CORS ──────────────────────────────────────────────────────────────────────
// FIX: Previously app.use(cors()) allowed ALL origins — a serious security risk.
// Now only the specific frontend origin(s) are whitelisted.
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || 'http://127.0.0.1:5500,http://localhost:5500,http://localhost:5173,null')
  .split(',')
  .map(o => o.trim());

app.use(cors({
  origin(origin, cb) {
    // Allow requests with no origin (e.g. same-origin file:// in dev) or whitelisted origins
    if (!origin || ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
    cb(new Error(`CORS: origin "${origin}" not allowed`));
  },
  methods: ['POST', 'GET'],
  allowedHeaders: ['Content-Type'],
}));

// ── Body size limit ────────────────────────────────────────────────────────────
// FIX: Without this, attackers can send multi-MB payloads to exhaust memory/API quota.
app.use(express.json({ limit: '16kb' }));

// ── Simple in-memory rate limiter ─────────────────────────────────────────────
// FIX: Without rate limiting the /api/ask endpoint can be abused to drain the API key quota.
const RATE_WINDOW_MS  = 60_000; // 1 minute
const RATE_MAX_REQ    = 20;     // max 20 requests per IP per minute
const ratemap = new Map();

function rateLimit(req, res, next) {
  const ip  = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  let entry = ratemap.get(ip);

  if (!entry || now - entry.windowStart > RATE_WINDOW_MS) {
    entry = { windowStart: now, count: 0 };
  }

  entry.count++;
  ratemap.set(ip, entry);

  if (entry.count > RATE_MAX_REQ) {
    return res.status(429).json({ error: 'Too many requests. Please wait a minute and try again.' });
  }
  next();
}

// ── Security headers ──────────────────────────────────────────────────────────
app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  next();
});

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── Whitelist of valid voter/state values ──────────────────────────────────────
const VALID_VOTER_TYPES = new Set(['first-time','regular','nri','pwd']);
const VALID_LANGS       = new Set(['en','hi','bn','ta']);

// ── Secure AI endpoint ────────────────────────────────────────────────────────
app.post('/api/ask', rateLimit, async (req, res) => {
  try {
    if (!GEMINI_API_KEY) {
      return res.status(500).json({ error: 'Server not configured.' });
    }

    const { contents, voterType, state, lang } = req.body;

    // Validate required fields
    if (!contents || !Array.isArray(contents) || contents.length === 0) {
      return res.status(400).json({ error: 'Missing or invalid field: contents' });
    }

    // FIX: Validate user-controlled fields used in the system prompt to prevent prompt injection.
    const safeVoterType = VALID_VOTER_TYPES.has(voterType) ? voterType : 'regular';
    const safeLang      = VALID_LANGS.has(lang) ? lang : 'en';
    // Strip any characters outside letters/spaces/hyphens from state name
    const safeState     = typeof state === 'string'
      ? state.replace(/[^a-zA-Z\s\-]/g, '').slice(0, 60).trim() || 'India'
      : 'India';

    // FIX: Validate that contents array items are well-formed and cap conversation length.
    if (contents.length > 40) {
      return res.status(400).json({ error: 'Conversation too long.' });
    }
    for (const turn of contents) {
      if (!turn || typeof turn !== 'object') {
        return res.status(400).json({ error: 'Malformed contents array.' });
      }
      if (!['user','model'].includes(turn.role)) {
        return res.status(400).json({ error: 'Invalid role in contents.' });
      }
      if (!Array.isArray(turn.parts) || !turn.parts[0]?.text) {
        return res.status(400).json({ error: 'Malformed parts in contents.' });
      }
      // Cap individual message length
      if (typeof turn.parts[0].text === 'string' && turn.parts[0].text.length > 2000) {
        return res.status(400).json({ error: 'Message too long (max 2000 chars).' });
      }
    }

    // System prompt is now built server-side with sanitized values
    const systemInstruction = {
      parts: [{
        text: `You are VoteGuide AI — India's most trusted, precise, and warm election assistant.
VOTER: ${safeVoterType} from ${safeState}. Language preference: ${safeLang}.
RULES:
1. Non-partisan always. Never mention, favor, or criticize parties or candidates.
2. Always cite: ECI, voterportal.eci.gov.in, Helpline 1950.
3. Step-by-step: use "→" prefix per step.
4. Bold key terms/forms/numbers: **text**.
5. Max 155 words. Crisp and authoritative.
6. End with one clear next action or official resource.
7. NRI → Form 6A specifically.
8. PwD → accessible booth facilities, Form 14A, companion rights.
9. First-timer → step-by-step, extra gentle.
10. If asked in Hindi/Bengali/Tamil, respond in that language.`,
      }],
    };

    const response = await fetch(`${GEMINI_EP}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: systemInstruction,
        contents,
        generationConfig: { temperature: 0.3, maxOutputTokens: 450, topP: 0.88 },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      // FIX: Do NOT proxy raw upstream error messages to the client in production.
      if (NODE_ENV !== 'production') {
        console.error(`Gemini API error (${response.status}):`, errorData);
      }
      if (response.status === 404) return res.status(502).json({ error: 'AI service unavailable.' });
      if (response.status === 401 || response.status === 403) return res.status(502).json({ error: 'AI service authentication error.' });
      if (response.status === 429) return res.status(429).json({ error: 'AI service quota reached. Try again shortly.' });
      return res.status(502).json({ error: 'AI service error. Please try again.' });
    }

    const data = await response.json();
    const result = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Please try again.';

    res.json({ result });
  } catch (error) {
    // FIX: Never expose raw error.message in production — it can leak internal details.
    if (NODE_ENV !== 'production') {
      console.error('Server error:', error);
    }
    res.status(500).json({ error: 'Internal server error. Please try again.' });
  }
});

// ── 404 handler ───────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ VoteGuide backend running on http://localhost:${PORT}`);
  console.log(`📡 API endpoint: http://localhost:${PORT}/api/ask`);
  if (!GEMINI_API_KEY) {
    console.error('⚠️  WARNING: GEMINI_API_KEY not set. Set it in .env file.');
  }
});
