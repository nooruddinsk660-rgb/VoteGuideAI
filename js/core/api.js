const API = (() => {
  // CONFIG: Replace with your deployed backend URL (e.g., on Render or Railway)
  const PROD_BACKEND = 'https://voteguide-backend.onrender.com/api/ask';
  const DEV_BACKEND  = 'http://localhost:3000/api/ask';

  const BACKEND_EP = (location.hostname === 'localhost' || location.hostname === '127.0.0.1')
    ? DEV_BACKEND
    : PROD_BACKEND;


  // FIX: The system prompt is now built entirely on the server from validated inputs.
  // Previously, the full system prompt was constructed client-side and sent in the request body,
  // which allowed anyone to inspect/manipulate it via DevTools and inject arbitrary instructions.

  // FIX: The dangerous direct-to-Gemini fallback has been REMOVED.
  // Previously, when the backend was unavailable the code fell back to calling the Gemini API
  // directly from the browser with the user's API key appended as a URL query parameter
  // (?key=AIzaSy…). This key was fully visible in browser DevTools → Network tab,
  // meaning any observer could steal it. The API key must ONLY ever leave the server.

  async function ask(hist) {
    // We no longer read or transmit the raw API key from the frontend.
    // Send only conversation history + context metadata; the server builds the system prompt.
    const payload = {
      contents:   hist,
      voterType:  S.g('voter'),
      state:      S.g('state'),
      lang:       S.g('lang'),
    };

    let response;
    try {
      response = await fetch(BACKEND_EP, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
      });
    } catch (networkErr) {
      // Backend is unreachable (server not running, network down, etc.)
      throw Object.assign(
        new Error('Unable to reach the VoteGuide server. Make sure the backend is running on port 3000.'),
        { code: 'NETWORK_ERROR' }
      );
    }

    if (response.status === 429) {
      throw Object.assign(
        new Error('Too many requests. Please wait a moment before asking again.'),
        { code: 'RATE_LIMITED' }
      );
    }

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err?.error || `Server error (${response.status})`);
    }

    const data = await response.json();
    return data.result || 'Please try again.';
  }

  return { ask };
})();
