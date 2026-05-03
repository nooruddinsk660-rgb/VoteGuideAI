const Chat = (() => {
  const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  let recog = null;

  function fmt(raw){
    return esc(raw)
      .replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>')
      .replace(/^→ (.+)$/gm,'<div class="step-row"><span class="s-arr">→</span><span>$1</span></div>')
      .replace(/^(\d+)\. (.+)$/gm,(_,n,tx)=>`<div class="step-row"><span class="s-num">${n}</span><span>${tx}</span></div>`)
      .replace(/\n/g,'<br>');
  }

  function scrollEnd(){ const f=document.getElementById('chat-feed'); if(f) f.scrollTop=f.scrollHeight; }

  function botBubble(){
    const feed=document.getElementById('chat-feed');
    const row=document.createElement('div'); row.className='msg';
    const id='b'+Date.now()+Math.random().toString(36).slice(2,4);
    row.innerHTML=`<div class="av bot">🗳️</div><div><div class="bub bot" id="${id}"></div><div class="msg-attr"><div class="attr-dot"></div><span class="attr-t">Official ECI guidelines</span></div></div>`;
    feed.appendChild(row); scrollEnd();
    return document.getElementById(id);
  }

  function stream(text,el){
    const words=text.split(' '); let i=0;
    const tick=()=>{ if(i<words.length){ el.innerHTML=fmt(words.slice(0,++i).join(' ')); scrollEnd(); setTimeout(tick,19); } };
    tick();
  }

  function userMsg(text){
    const feed=document.getElementById('chat-feed');
    const row=document.createElement('div'); row.className='msg user';
    row.innerHTML=`<div class="av usr">You</div><div class="bub usr">${esc(text)}</div>`;
    feed.appendChild(row); scrollEnd();
  }

  function showTyping(){
    const feed=document.getElementById('chat-feed');
    const row=document.createElement('div'); row.id='typing'; row.className='typing-row';
    row.innerHTML=`<div class="av bot">🗳️</div><div class="typing-bub"><div class="td"></div><div class="td"></div><div class="td"></div></div>`;
    feed.appendChild(row); scrollEnd();
  }
  const killTyping=()=>document.getElementById('typing')?.remove();

  async function _send(text){
    userMsg(text);
    const hist=S.g('hist'); hist.push({role:'user',parts:[{text}]}); S.s('hist',hist);
    showTyping();
    try{
      const rep=await API.ask(hist); killTyping();
      hist.push({role:'model',parts:[{text:rep}]}); S.s('hist',hist);
      stream(rep,botBubble());
    }catch(e){
      killTyping();
      const el=botBubble();
      if(e.code==='RATE_LIMITED'){
        el.innerHTML=fmt(`Too many requests — please wait a moment and try again.\n\n→ Or call **ECI Voter Helpline: 1950**`);
      } else if(e.code==='NETWORK_ERROR'){
        el.innerHTML=fmt(`Could not reach the VoteGuide server.\n\n→ Make sure the backend is running (see Setup ⚙️)\n→ Or call **ECI Voter Helpline: 1950**`);
      } else {
        el.innerHTML=fmt(`Connection failed.\n\n→ Call **ECI Voter Helpline: 1950**\n→ Visit **voterportal.eci.gov.in**\n→ Download Voter Helpline App`);
      }
    }
  }

  function initVoice(){
    const SpeechRecog=window.SpeechRecognition||window.webkitSpeechRecognition;
    if(!SpeechRecog) return;
    recog=new SpeechRecog();
    recog.continuous=false; recog.interimResults=true;
    const LANG_MAP={en:'en-IN',hi:'hi-IN',bn:'bn-IN',ta:'ta-IN'};
    recog.onstart=()=>{document.getElementById('voice-btn')?.classList.add('listening');};
    recog.onresult=e=>{
      const t=Array.from(e.results).map(r=>r[0].transcript).join('');
      const inp=document.getElementById('chat-inp'); if(inp) inp.value=t;
    };
    recog.onend=()=>{
      document.getElementById('voice-btn')?.classList.remove('listening');
      const inp=document.getElementById('chat-inp');
      if(inp?.value.trim()){ _send(inp.value.trim()); inp.value=''; }
    };
    recog.onerror=()=>{ document.getElementById('voice-btn')?.classList.remove('listening'); Toast.show('Voice not available'); };
  }

  return {
    html:()=>`
    <div class="vg-panel" id="pnl-chat" style="display:flex;flex-direction:column">
      <div class="chat-feed" id="chat-feed"></div>
      <div class="quick-row">
        <button class="qc" onclick="Chat.q('How do I register to vote in India?')">📝 Register</button>
        <button class="qc" onclick="Chat.q('What documents must I carry on voting day?')">📄 Documents</button>
        <button class="qc" onclick="Chat.q('How do I check my name on the voter list?')">🔎 Voter list</button>
        <button class="qc" onclick="Chat.q('Am I eligible to vote in India?')">✅ Eligibility</button>
        <button class="qc" onclick="Chat.q('What is NOTA and how does it work?')">🗳️ NOTA</button>
        <button class="qc" onclick="Chat.q('How does the EVM voting machine work?')">🖥️ EVM</button>
        <button class="qc" onclick="Chat.q('What are my legal rights at the polling booth?')">⚖️ Rights</button>
        <button class="qc" onclick="Chat.q('How do I file a complaint about election misconduct?')">📋 Complaint</button>
      </div>
      <div class="chat-bar">
        <input class="chat-inp" id="chat-inp" placeholder="Ask anything about elections…"
               onkeydown="if(event.key==='Enter'&&!event.shiftKey){Chat.send();event.preventDefault()}">
        <button class="voice-btn" id="voice-btn" onclick="Chat.voice()" title="Voice input">🎤</button>
        <button class="send-btn" onclick="Chat.send()">
          <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
        </button>
      </div>
    </div>`,

    build(){
      this.greet();
      initVoice();
    },

    greet(){
      const vl={'first-time':'a first-time voter',regular:'a regular voter',nri:'an NRI voter',pwd:'a differently-abled voter'};
      const el=botBubble();
      el.innerHTML=fmt(`Welcome! I know you're **${vl[S.g('voter')]}** from **${S.g('state')}**.\n\nEvery answer is tailored to you and grounded in official ECI data.\n\n→ Ask about registration, eligibility, documents, booth location, or anything election-related.\n→ Use **voice input** by tapping the 🎤 button.\n→ Switch language with 🌐 in the top right.`);
    },

    send(){ const inp=document.getElementById('chat-inp'); const txt=inp.value.trim(); if(!txt)return; inp.value=''; _send(txt); },
    q:txt=>_send(txt),

    voice(){
      if(!recog){ Toast.show('Voice not supported in this browser'); return; }
      const LANG_MAP={en:'en-IN',hi:'hi-IN',bn:'bn-IN',ta:'ta-IN'};
      recog.lang=LANG_MAP[S.g('lang')]||'en-IN';
      try{ recog.start(); }catch(e){ recog.stop(); }
    },
  };
})();
