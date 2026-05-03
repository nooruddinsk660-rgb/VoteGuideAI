# VoteGuide Backend Setup

## Quick Start

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Configure API Key
Copy `.env.example` to `.env` and add your Gemini API key:
```bash
cp .env.example .env
# Edit .env and paste your API key
GEMINI_API_KEY=AIzaSy...
```

**⚠️ IMPORTANT: Never commit `.env` to git**

### 3. Run Server
```bash
npm start          # Production
npm run dev        # Development (with auto-reload)
```

Server will run on `http://localhost:3000`

## Get a Free Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click **"Get API Key"** → **"Create API key in new project"**
3. Copy your key and paste into `.env`

**Free tier:** 15 requests/min, 1M tokens/day

## API Endpoints

### Health Check
```bash
GET http://localhost:3000/health
```

### Ask VoteGuide AI
```bash
POST http://localhost:3000/api/ask
Content-Type: application/json

{
  "system_instruction": { "parts": [{ "text": "..." }] },
  "contents": [ ... ],
  "generationConfig": { "temperature": 0.3, "maxOutputTokens": 450 }
}
```

## Security Benefits

✅ API key never exposed in browser  
✅ Network logs don't contain credentials  
✅ Can rotate key server-side only  
✅ Rate limiting can be added server-side  
✅ Request logging and monitoring possible  

## Development vs Production

**Development:** Uses direct API fallback if backend unavailable  
**Production:** Should require backend only

To enforce backend-only mode, remove the fallback code in `voteguide/js/core/api.js`

## Deployment

When deploying to production:
1. Set environment variable `GEMINI_API_KEY` on your hosting platform
2. Set `NODE_ENV=production`
3. Update frontend to use production server URL instead of `localhost:3000`
4. Remove fallback to direct API calls (optional for security)

## Troubleshooting

**"Backend unavailable" warning**
- Check if server is running on port 3000
- Check CORS settings if frontend is on different domain

**"API key invalid"**
- Verify key in `.env` file is correct
- Check key hasn't been revoked in Google Console

**"Model not found (404)"**
- Verify API is enabled in Google Cloud Console
- Check model name is correct (gemini-1.5-flash)
