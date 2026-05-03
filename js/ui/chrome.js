/* ── i18n strings ── */
const I18N = {
  en: { ask:'Ask anything about elections…', greet_voter:{'first-time':'a first-time voter',regular:'a regular voter',nri:'an NRI voter',pwd:'a differently-abled voter'}, nav:['Chat','Timeline','Ready','Booth','Facts','Tools'] },
  hi: { ask:'चुनाव के बारे में कुछ भी पूछें…', greet_voter:{'first-time':'पहली बार मतदाता',regular:'नियमित मतदाता',nri:'एनआरआई मतदाता',pwd:'दिव्यांग मतदाता'}, nav:['चैट','समयरेखा','तैयारी','बूथ','तथ्य','टूल्स'] },
  bn: { ask:'নির্বাচন সম্পর্কে কিছু জিজ্ঞেস করুন…', greet_voter:{'first-time':'প্রথমবার ভোটার',regular:'নিয়মিত ভোটার',nri:'প্রবাসী ভোটার',pwd:'প্রতিবন্ধী ভোটার'}, nav:['চ্যাট','সময়রেখা','প্রস্তুতি','বুথ','তথ্য','টুলস'] },
  ta: { ask:'தேர்தல் பற்றி எதுவும் கேளுங்கள்…', greet_voter:{'first-time':'முதல்முறை வாக்காளர்',regular:'வழக்கமான வாக்காளர்',nri:'NRI வாக்காளர்',pwd:'மாற்றுத்திறனாளி வாக்காளர்'}, nav:['சாட்','காலவரிசை','தயார்','பூத்','உண்மை','கருவிகள்'] },
};
const t = k => (I18N[S.g('lang')]||I18N.en)[k] || k;

/* ── Header ── */
const Header = {
  html: () => `
  <header class="vg-hdr" id="vg-hdr">
    <div class="hdr-l">
      <div class="hdr-mark">🗳️</div>
      <div>
        <div class="hdr-title">VoteGuide<em> AI</em></div>
        <div class="hdr-flag">
          <span style="background:#FF9933"></span>
          <span style="background:${document.documentElement.dataset.theme==='light'?'rgba(0,0,0,.1)':'rgba(242,244,255,.12)'}"></span>
          <span style="background:#138808"></span>
        </div>
      </div>
    </div>
    <div class="hdr-r">
      <div class="hdr-ctx" id="hdr-ctx"></div>
      <button class="ico-btn" id="theme-btn" onclick="Theme.toggle()" title="Toggle theme">🌙</button>
      <div class="lang-wrap">
        <button class="ico-btn" id="lang-btn" onclick="LangMenu.toggle()" title="Language">🌐</button>
        <div class="lang-menu" id="lang-menu">
          <button class="lang-opt ${S.g('lang')==='en'?'on':''}" onclick="LangMenu.set('en')">🇬🇧 English</button>
          <button class="lang-opt ${S.g('lang')==='hi'?'on':''}" onclick="LangMenu.set('hi')">🇮🇳 हिंदी</button>
          <button class="lang-opt ${S.g('lang')==='bn'?'on':''}" onclick="LangMenu.set('bn')">🇧🇩 বাংলা</button>
          <button class="lang-opt ${S.g('lang')==='ta'?'on':''}" onclick="LangMenu.set('ta')">🌺 தமிழ்</button>
        </div>
      </div>
      <button class="ico-btn" id="api-btn" onclick="Modal.open()" title="API Key">⚙</button>
    </div>
  </header>`,

  show(state, voter) {
    const el  = document.getElementById('vg-hdr');
    const ctx = document.getElementById('hdr-ctx');
    const MAP = {'first-time':'First-timer',regular:'Regular',nri:'NRI',pwd:'PwD'};
    el.style.display='flex';
    ctx.textContent=`${state} · ${MAP[voter]||voter}`;
    ctx.style.display='inline-flex';
    this.markKey();
    const tb=document.getElementById('theme-btn');
    if(tb) tb.textContent=S.g('theme')==='dark'?'☀️':'🌙';
  },

  markKey() {
    if(!S.g('key')) return;
    const b=document.getElementById('api-btn');
    if(b){b.textContent='✓';b.classList.add('set');}
  },
};

/* ── Language menu ── */
const LangMenu = {
  toggle() {
    document.getElementById('lang-menu').classList.toggle('show');
  },
  set(lang) {
    S.s('lang',lang);
    document.querySelectorAll('.lang-opt').forEach(b=>b.classList.toggle('on',b.textContent.includes(lang==='en'?'English':lang==='hi'?'हिंदी':lang==='bn'?'বাংলা':'தமிழ்')));
    document.getElementById('lang-menu').classList.remove('show');
    const ci=document.getElementById('chat-inp');
    if(ci) ci.placeholder=t('ask');
    Toast.show(lang==='hi'?'भाषा बदली: हिंदी':lang==='bn'?'ভাষা পরিবর্তন: বাংলা':lang==='ta'?'மொழி மாற்றம்: தமிழ்':'Language: English');
  },
};
document.addEventListener('click', e => {
  if (!e.target.closest('.lang-wrap')) document.getElementById('lang-menu')?.classList.remove('show');
});

/* ── Navbar ── */
const Navbar = {
  TABS:[
    {id:'chat',      i:'💬'}, {id:'timeline',  i:'📅'},
    {id:'checklist', i:'✅'}, {id:'map',        i:'📍'},
    {id:'myths',     i:'🔍'}, {id:'features',   i:'⚡'},
  ],
  html() {
    const lbls = (I18N[S.g('lang')]||I18N.en).nav;
    return `<nav class="vg-nav" id="vg-nav">
      ${this.TABS.map((tb,i)=>`
        <button class="nav-btn${tb.id==='chat'?' on':''}" data-tab="${tb.id}" onclick="Router.go('${tb.id}')">
          <span class="nav-ico">${tb.i}</span>
          <span class="nav-lbl">${lbls[i]||tb.id}</span>
          <div class="nav-pip"></div>
        </button>`).join('')}
    </nav>`;
  },
  show(){ const el=document.getElementById('vg-nav'); if(el) el.style.display='flex'; },
};

/* ── Modal ── */
// SECURITY FIX: The API key is now stored exclusively in the backend's .env file.
// The frontend no longer asks for, stores, or transmits the raw API key.
// This modal is repurposed to inform the user about backend connectivity.
const Modal = {
  html:()=>`
  <div class="vg-overlay" id="vg-modal">
    <div class="vg-modal">
      <div class="modal-t">⚙️ Setup</div>
      <div class="modal-p">
        VoteGuide AI uses a <strong>secure backend server</strong> — your API key never
        leaves the server and is never stored in your browser.
        <br><br>
        To get started:
        <ol style="margin:8px 0 0 16px;line-height:1.8;font-size:13px">
          <li>Get a <strong>free</strong> key from <a href="https://aistudio.google.com/app/apikey" target="_blank">Google AI Studio</a></li>
          <li>Add it to <code style="font-size:11px;background:var(--bg-2);padding:1px 5px;border-radius:4px">server/.env</code> as <code style="font-size:11px;background:var(--bg-2);padding:1px 5px;border-radius:4px">GEMINI_API_KEY=…</code></li>
          <li>Run <code style="font-size:11px;background:var(--bg-2);padding:1px 5px;border-radius:4px">npm start</code> in the <code style="font-size:11px;background:var(--bg-2);padding:1px 5px;border-radius:4px">server/</code> folder</li>
        </ol>
      </div>
      <div class="modal-btns">
        <button class="modal-btn" onclick="Modal.close()">Close</button>
        <button class="modal-btn p" onclick="Modal.checkServer()">Check Connection →</button>
      </div>
      <div id="modal-status" class="modal-note" style="min-height:18px"></div>
    </div>
  </div>`,

  open() {
    const el=document.getElementById('vg-modal');
    if(!el) return;
    document.getElementById('modal-status').textContent='';
    el.classList.add('show');
  },
  close(){ document.getElementById('vg-modal')?.classList.remove('show'); },
  async checkServer() {
    const statusEl=document.getElementById('modal-status');
    statusEl.textContent='⏳ Checking…';
    try {
      const r = await fetch('http://localhost:3000/health', { method:'GET' });
      if(r.ok) {
        statusEl.textContent='✓ Backend is running and ready!';
        statusEl.style.color='var(--ok, #22c55e)';
        // Mark as server-confirmed ready — no key stored in browser
        S.s('serverReady', true);
        Header.markKey();
        this.close();
        if(S.g('state')&&S.g('voter')&&!S.g('live')) Onboard.launch();
      } else {
        statusEl.textContent='⚠ Server responded but may not be configured.';
        statusEl.style.color='var(--warn, #f59e0b)';
      }
    } catch(_) {
      statusEl.textContent='✗ Cannot reach server. Is it running on port 3000?';
      statusEl.style.color='var(--ruby, #ef4444)';
    }
  },
  // Called on app boot to silently verify backend availability
  async silentCheck() {
    try {
      const r = await fetch('http://localhost:3000/health', { method:'GET' });
      if(r.ok) { S.s('serverReady', true); Header.markKey(); return true; }
    } catch(_) {}
    return false;
  },
};

/* ── Toast ── */
const Toast = {
  show(msg, dur=2600) {
    let el=document.getElementById('vg-toast');
    if(!el){el=document.createElement('div');el.id='vg-toast';el.className='vg-toast';document.getElementById('vg-app').appendChild(el);}
    el.textContent=msg; el.classList.add('show');
    clearTimeout(this._t);
    this._t=setTimeout(()=>el.classList.remove('show'),dur);
  },
};
