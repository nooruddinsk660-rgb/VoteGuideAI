# VoteGuide AI - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Prerequisites
- Node.js 14+ installed
- Free Gemini API key from https://aistudio.google.com/app/apikey
- Browser with JavaScript enabled

---

## Step 1: Get Your Gemini API Key

1. Visit: **https://aistudio.google.com/app/apikey**
2. Click **"Create API Key in new project"**
3. Copy the generated key
4. Keep it safe (you'll enter it in the app)

> **Free Tier**: 15 requests/minute, 1M tokens/day, no credit card needed

---

## Step 2: Start the Backend Server

```bash
# Navigate to server folder
cd server

# Install dependencies (first time only)
npm install

# Create .env file
echo "GEMINI_API_KEY=your_api_key_here" > .env
# On Windows PowerShell:
# @"
# GEMINI_API_KEY=your_api_key_here
# "@ | Out-File -Encoding utf8 .env

# Start the server
npm start

# Expected output:
# ✅ VoteGuide backend running on http://localhost:3000
# 📡 API endpoint: http://localhost:3000/api/ask
```

Server will be running on **http://localhost:3000**

---

## Step 3: Open the App in Browser

### Option A: Using Python (Recommended)
```bash
# Navigate to voteguide folder
cd voteguide

# Start local server on port 5500
python -m http.server 5500

# Open browser to: http://localhost:5500
```

### Option B: Using Node.js
```bash
# Using npx (any directory)
npx http-server voteguide -p 5500

# Open browser to: http://localhost:5500
```

### Option C: Open directly (if no dynamic features needed)
```bash
# Just open the file in browser
# Note: API calls may not work without a local server
file:///path/to/voteguide-v6/voteguide/index.html
```

---

## Step 4: Complete Onboarding

1. **Select Your State** - Click your Indian state (12 options)
2. **Select Voter Type** - Choose: First-time, Regular, NRI, or PwD
3. **Enter API Key** - Click ⚙ button, paste your Gemini key, save
4. **Begin!** - Click "Begin your voter journey →"

---

## Step 5: Explore the App

### Chat Panel 💬
- Ask any election question
- Tap quick buttons for common questions
- Use 🎤 for voice input (Chrome/Edge)

### Timeline Panel 📅
- View election process
- See your progress

### Checklist Panel ✅
- 11 pre-voting tasks
- Track readiness %
- Share your progress

### Map Panel 📍
- Find your polling booth
- Search by area or use geolocation
- Call 1950 for exact booth number

### Myths Panel 🔍
- 7 common myths debunked
- Official ECI sources

### Tools Panel ⚡
- Eligibility quiz
- Document guide
- Vote reminder
- Sharing tools
- Official helplines

---

## Troubleshooting

### "Connection failed" in Chat
```
✓ Check if backend is running on http://localhost:3000
✓ Check browser console (F12) for errors
✓ Verify API key is valid
✓ Check firewall isn't blocking port 3000
```

### "API Key invalid"
```
✓ Get fresh key from https://aistudio.google.com/app/apikey
✓ Make sure you copied the full key (no spaces)
✓ Delete old key and re-enter in app
✓ Check browser console for exact error
```

### Voice Input Not Working
```
✓ Use Chrome, Edge, or Firefox
✓ Check microphone permissions
✓ Make sure you're on http:// (not file://)
✓ Allow browser to access microphone
```

### Map Search Not Working
```
✓ Check internet connection
✓ Try searching for a major city first (e.g., "Delhi")
✓ Use geolocation button (📍) instead
✓ Or call 1950 for booth number
```

---

## Testing the API Connection

### In Browser Console (F12)

```javascript
// Test 1: Health check
await fetch('http://localhost:3000/health')
  .then(r => r.json())
  .then(console.log)
// Should show: { status: "ok", timestamp: "..." }

// Test 2: Full API call (paste your API key in first)
const resp = await fetch('http://localhost:3000/api/ask', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    system_instruction: { parts: [{ text: "You are a helpful assistant." }] },
    contents: [{ role: "user", parts: [{ text: "Hello!" }] }],
    generationConfig: { temperature: 0.3, maxOutputTokens: 450 }
  })
})
const data = await resp.json()
console.log(data)
// Should show: { result: "AI response..." }
```

---

## Environment Variables

### Backend (.env in server/ folder)

```env
# Required
GEMINI_API_KEY=your_api_key_here

# Optional
PORT=3000
NODE_ENV=development
```

### Frontend (No .env needed)

All frontend config is in localStorage:
- `vg6k` - API key
- `vg6_state` - Selected state
- `vg6_voter` - Voter type
- `vg6theme` - Theme preference
- `vg6_lang` - Language preference
- Chat history in memory

---

## Common Commands

```bash
# Backend
cd server
npm install          # Install dependencies
npm start            # Start server
npm run dev          # Start with auto-reload

# Frontend (in voteguide folder)
python -m http.server 5500    # Local server
python -m http.server         # Default port 8000

# Kill processes
kill $(lsof -t -i :3000)      # Kill port 3000
kill $(lsof -t -i :5500)      # Kill port 5500
```

---

## For Windows Users

### Start Backend
```powershell
cd server
npm install
# Create .env file
@"
GEMINI_API_KEY=your_key_here
"@ | Out-File -Encoding utf8 .env

npm start
```

### Start Frontend (PowerShell)
```powershell
cd voteguide
python -m http.server 5500
# Open http://localhost:5500 in browser
```

---

## For Mac Users

### Start Backend
```bash
cd server
npm install
echo "GEMINI_API_KEY=your_key_here" > .env
npm start
```

### Start Frontend
```bash
cd voteguide
python3 -m http.server 5500
# Open http://localhost:5500 in browser
```

---

## Production Deployment

### Backend (Heroku/Railway/Vercel)

1. **Create .env.production**
   ```
   GEMINI_API_KEY=your_production_key
   NODE_ENV=production
   PORT=3000
   ```

2. **Deploy**
   ```bash
   # Heroku
   heroku login
   heroku create voteguide-api
   git push heroku main
   
   # Or use Railway/Vercel directly
   ```

3. **Update Frontend**
   - Change `BACKEND_EP` in `js/core/api.js`
   - From: `http://localhost:3000/api/ask`
   - To: `https://your-deployed-api.com/api/ask`

### Frontend (GitHub Pages/Vercel/Netlify)

1. **Build** (no build step needed, pure HTML/JS)
2. **Deploy voteguide/ folder**
3. **Point domain** to deployment

---

## Getting Help

1. **Chat with VoteGuide AI** - Ask the app itself!
2. **Official ECI Helpline** - Call **1950** (24/7)
3. **Voter Portal** - https://voterportal.eci.gov.in
4. **Browser Console** - F12 for error messages

---

## Important Notes

⚠️ **API Key Safety**
- Never commit `.env` to GitHub
- Never share your API key publicly
- Key stays in browser localStorage only
- Backend has separate secure key

✅ **Best Practices**
- Use free tier first (plenty for testing)
- Check API usage in Google AI Studio
- Clear localStorage if debugging state issues
- Keep browser console open for errors

🎯 **Performance Tips**
- Use Chrome for best compatibility
- Clear browser cache if styles don't update
- Restart backend if API becomes unresponsive
- Check internet for map and API features

---

**Ready to vote smart? Start the app now!** 🗳️

For detailed technical docs, see: `INTEGRATION_GUIDE.md`
