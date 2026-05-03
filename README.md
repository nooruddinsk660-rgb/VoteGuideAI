# VoteGuide AI v6

**Challenge 2** — India's Intelligent Election Companion

## What's new in v6 vs previous versions

| Feature | v6 |
|---|---|
| Light / Dark theme | ✅ Full toggle with Indian warm paper tones |
| Language switcher | ✅ EN / हिंदी / বাংলা / தமிழ் |
| Voice input | ✅ Web Speech API, language-aware |
| Eligibility Quiz | ✅ 5-step interactive flow |
| Document Guide | ✅ All 12 accepted voter IDs |
| Vote Reminder | ✅ Browser Notifications API |
| Share Card | ✅ Web Share API + clipboard fallback |
| Election News | ✅ ECI key announcements |
| Helpline Panel | ✅ All official contacts |
| Locate Me | ✅ GPS location on map |
| Toast notifications | ✅ System-wide feedback |
| Canvas BG themes | ✅ Dark orbs / Light pastel orbs |
| CARTO map tiles | ✅ Dark + light tile switching |
| Streaming AI chat | ✅ Word-by-word typewriter |
| SVG Ashoka loader | ✅ 24-spoke animated Chakra |

## Stack — $0/month forever

| Layer | Tech |
|---|---|
| AI | Gemini 1.5 Flash (Google AI Studio) — free |
| Maps | Leaflet + CARTO tiles + Nominatim — free |
| Host | GitHub Pages — free |
| Backend | None — pure static HTML/CSS/JS |
| Storage | localStorage — free |

## File structure

```
index.html
css/
  tokens.css      ← full light+dark token system
  base.css        ← shell, loader, panels
  chrome.css      ← header, nav, modal, toast, lang menu
  onboard.css     ← onboarding page
  chat.css        ← chat + voice input
  panels.css      ← timeline, checklist, map, myths, features
js/
  core/
    state.js      ← reactive state manager
    api.js        ← Gemini 1.5 Flash module
    bg.js         ← canvas animated orbs (light+dark aware)
    router.js     ← directional panel transitions
  ui/
    theme.js      ← light/dark toggle
    chrome.js     ← Header, Navbar, Modal, Toast, LangMenu, i18n
  panels/
    onboard.js    ← SVG mandala + cinematic hero
    chat.js       ← streaming word-by-word, voice input
    timeline.js   ← ECI 7-step process
    checklist.js  ← ring progress, share button
    map.js        ← CARTO tiles, GPS locate me
    myths.js      ← 7 myths with SC/ECI sources
    features.js   ← eligibility quiz, docs, reminder, share, news, helpline
  app.js          ← Ashoka Chakra loader + bootstrap
```

## Deploy

```bash
git init && git add . && git commit -m "VoteGuide AI v6"
git remote add origin https://github.com/USER/voteguide-ai.git
git push -u origin main
# GitHub → Settings → Pages → main → / → Save
```

## API Key (free)

[aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
