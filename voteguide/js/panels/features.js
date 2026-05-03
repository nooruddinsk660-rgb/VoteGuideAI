const Features = {
  html:()=>`
  <div class="vg-panel" id="pnl-features">
    <div class="feat-scroll vg-scroll">
      <div class="feat-head">
        <div class="pnl-eyebrow">⚡ Tools</div>
        <div class="pnl-title">Power Tools</div>
        <div class="pnl-sub">Essential voter features</div>
      </div>
      <div class="feat-grid">
        <div class="feat-card" onclick="Features.open('quiz')">
          <span class="feat-ico">✅</span>
          <div class="feat-nm">Eligibility Quiz</div>
          <div class="feat-ds">Check if you can vote in 60 seconds</div>
          <span class="feat-tag">Interactive</span>
        </div>
        <div class="feat-card" onclick="Features.open('docs')">
          <span class="feat-ico">📄</span>
          <div class="feat-nm">Document Guide</div>
          <div class="feat-ds">All 12 accepted IDs explained</div>
          <span class="feat-tag">Official</span>
        </div>
        <div class="feat-card" onclick="Features.open('reminder')">
          <span class="feat-ico">🔔</span>
          <div class="feat-nm">Vote Reminder</div>
          <div class="feat-ds">Get notified on election day</div>
          <span class="feat-tag">Notifications</span>
        </div>
        <div class="feat-card" onclick="Features.open('share')">
          <span class="feat-ico">📤</span>
          <div class="feat-nm">Share Card</div>
          <div class="feat-ds">Encourage friends to vote</div>
          <span class="feat-tag">Social</span>
        </div>
        <div class="feat-card" onclick="Features.open('news')">
          <span class="feat-ico">📰</span>
          <div class="feat-nm">Election News</div>
          <div class="feat-ds">Key ECI announcements</div>
          <span class="feat-tag">Live</span>
        </div>
        <div class="feat-card" onclick="Features.open('helpline')">
          <span class="feat-ico">📞</span>
          <div class="feat-nm">Quick Helpline</div>
          <div class="feat-ds">All official contacts in one place</div>
          <span class="feat-tag">Emergency</span>
        </div>
      </div>
    </div>
  </div>`,

  build(){},

  open(id){
    const CONTENT={
      quiz:   this._quiz(),
      docs:   this._docs(),
      reminder:this._reminder(),
      share:  this._share(),
      news:   this._news(),
      helpline:this._helpline(),
    };
    this._showModal(CONTENT[id]||'');
  },

  _showModal(html){
    let ov=document.getElementById('feat-modal');
    if(!ov){
      ov=document.createElement('div'); ov.id='feat-modal'; ov.className='vg-overlay';
      ov.innerHTML=`<div class="vg-modal"><button onclick="Features._close()" style="position:absolute;top:14px;right:16px;background:none;border:none;color:var(--tx-2);font-size:18px;cursor:pointer;font-family:var(--f-b)">✕</button><div id="feat-modal-body" style="padding-top:4px"></div></div>`;
      document.getElementById('vg-app').appendChild(ov);
    }
    document.getElementById('feat-modal-body').innerHTML=html;
    ov.classList.add('show');
  },
  _close(){ document.getElementById('feat-modal')?.classList.remove('show'); },

  /* ── Eligibility Quiz ── */
  _quiz(){
    return `
    <div class="feat-content">
      <div class="feat-content-title">✅ Am I Eligible to Vote?</div>
      <div id="quiz-body">
        ${this._quizStep(0)}
      </div>
    </div>`;
  },

  QUIZ:[
    {q:'Are you a citizen of India?',opts:['Yes, I am an Indian citizen','No, I am a foreign national'],go:[1,99]},
    {q:'Are you 18 years of age or older on January 1st of the qualifying year?',opts:['Yes, I am 18 or older','No, I am under 18'],go:[2,98]},
    {q:'Are you of sound mind (not disqualified by a court order)?',opts:['Yes, fully sound mind','No, disqualified by court'],go:[3,99]},
    {q:'Have you been convicted and sentenced to imprisonment for 2+ years for certain offences?',opts:['No, no such conviction','Yes, I have such conviction'],go:[4,99]},
    {q:'Have you registered by submitting Form 6 at voterportal.eci.gov.in?',opts:['Yes, I am registered','No, I haven\'t registered yet'],go:[100,101]},
  ],

  _quizStep(idx){
    if(idx===98) return `<div class="quiz-result ineligible">❌ <b>Not yet eligible.</b> You must be 18 or older on Jan 1st of the qualifying year. You can register in advance and become eligible in the next enrollment cycle.</div><button class="feat-action-btn" style="margin-top:12px" onclick="Features._quizReset()">Try again</button>`;
    if(idx===99) return `<div class="quiz-result ineligible">❌ <b>Not eligible</b> based on your answer. Please consult the official ECI guidelines or call 1950 for clarification.</div><button class="feat-action-btn" style="margin-top:12px" onclick="Features._quizReset()">Try again</button>`;
    if(idx===100) return `<div class="quiz-result eligible">✅ <b>You are eligible and registered to vote!</b> Make sure to check your booth at voterportal.eci.gov.in and carry your EPIC card on election day.</div><button class="feat-action-btn" style="margin-top:12px" onclick="Features._quizReset()">Start over</button>`;
    if(idx===101) return `<div class="quiz-result partial">⚠️ <b>You are eligible but not yet registered.</b> Register now at <a href="https://voterportal.eci.gov.in" target="_blank" style="color:var(--s-400);font-weight:600">voterportal.eci.gov.in</a> by submitting Form 6. Do this before the registration cutoff!</div><button class="feat-action-btn" style="margin-top:12px" onclick="Features._quizReset()">Start over</button>`;
    const q=this.QUIZ[idx];
    return `<div class="quiz-step"><div class="feat-content-sub" style="font-size:11px;margin-bottom:6px">Question ${idx+1} of ${this.QUIZ.length}</div><div class="quiz-q">${q.q}</div><div class="quiz-opts">${q.opts.map((o,i)=>`<button class="quiz-opt" onclick="Features._quizAns(${q.go[i]})">${o}</button>`).join('')}</div></div>`;
  },
  _quizAns(next){ document.getElementById('quiz-body').innerHTML=this._quizStep(next); },
  _quizReset(){ document.getElementById('quiz-body').innerHTML=this._quizStep(0); },

  /* ── Document Guide ── */
  _docs(){
    const IDS=[
      {n:'EPIC Card',d:'Your Voter ID — the primary document',i:'🪪'},
      {n:'Aadhaar Card',d:'UIDAI-issued biometric ID',i:'📇'},
      {n:'Indian Passport',d:'Valid Indian passport',i:'📕'},
      {n:'Driving Licence',d:'Motor vehicles licence',i:'🚗'},
      {n:'PAN Card',d:'Income Tax department card',i:'💳'},
      {n:'MNREGA Job Card',d:'Employment guarantee card',i:'🏗️'},
      {n:'Pension Document',d:'With photograph, from government',i:'📋'},
      {n:'NPR Smart Card',d:'National Population Register',i:'📲'},
      {n:'Health Insurance Card',d:'Ministry of Labour issued',i:'🏥'},
      {n:'MP/MLA/MLC ID',d:'Photo identity card of officials',i:'🏛️'},
      {n:'Service ID (Central/State)',d:'Photo ID issued by government',i:'🏢'},
      {n:'Passbook (Post Office/Bank)',d:'With photograph',i:'📒'},
    ];
    return `
    <div class="feat-content">
      <div class="feat-content-title">📄 Accepted Voter IDs</div>
      <div class="feat-content-sub">Any ONE of these 12 documents is accepted at the booth if your name is on the voter roll.</div>
      <div style="display:flex;flex-direction:column;gap:7px;margin-top:4px">
        ${IDS.map((d,i)=>`
          <div style="display:flex;align-items:center;gap:10px;padding:9px 12px;border-radius:var(--r2);background:var(--bg-2);border:1px solid var(--bd-0)">
            <span style="font-size:18px;flex-shrink:0">${d.i}</span>
            <div><div style="font-size:12px;font-weight:600;color:var(--tx-1)">${i+1}. ${d.n}</div><div style="font-size:10px;color:var(--tx-3);margin-top:1px">${d.d}</div></div>
          </div>`).join('')}
      </div>
    </div>`;
  },

  /* ── Vote Reminder ── */
  _reminder(){
    return `
    <div class="feat-content">
      <div class="feat-content-title">🔔 Vote Day Reminder</div>
      <div class="feat-content-sub">Set a browser notification reminder for election day. You'll need to allow notifications when prompted.</div>
      <div style="display:flex;flex-direction:column;gap:10px;margin-top:4px">
        <div style="padding:12px;background:var(--bg-2);border:1px solid var(--bd-0);border-radius:var(--r3);font-size:12px;color:var(--tx-2);line-height:1.6">
          📅 <b style="color:var(--tx-1)">How it works:</b><br>
          Click the button below. Your browser will ask for notification permission. Once granted, you'll get a reminder on election morning.
        </div>
        <button class="feat-action-btn" onclick="Features._setReminder()">🔔 Enable Voting Reminder</button>
        <div style="font-size:10px;color:var(--tx-3);line-height:1.55">You can also set a calendar reminder: Add "VOTING DAY — 7AM" to your Google or iOS Calendar. Polling hours are 7:00 AM to 6:00 PM.</div>
      </div>
    </div>`;
  },

  _setReminder(){
    if(!('Notification' in window)){Toast.show('Notifications not supported');return;}
    Notification.requestPermission().then(p=>{
      if(p==='granted'){
        new Notification('🗳️ VoteGuide AI Reminder',{
          body:`Today is election day in ${S.g('state')}! Polling is open 7AM–6PM. Carry your EPIC card. Call 1950 if you need help.`,
          icon:'https://voterportal.eci.gov.in/favicon.ico',
        });
        Toast.show('✓ Reminder set! (test notification sent)');
      } else {
        Toast.show('Permission denied — enable in browser settings');
      }
    });
  },

  /* ── Share Card ── */
  _share(){
    const state=S.g('state');
    const vl={'first-time':'a first-time voter',regular:'a regular voter',nri:'an NRI voter',pwd:'a differently-abled voter'};
    const msg=`🗳️ I'm ready to vote in ${state}!\n\nI'm ${vl[S.g('voter')]} and I'm prepared.\n\nAre you? Check voterportal.eci.gov.in\nor call 1950 for any election help.\n\n#VoteIndia #ECI #IndianElections`;
    return `
    <div class="feat-content">
      <div class="feat-content-title">📤 Share & Inspire</div>
      <div class="feat-content-sub">Encourage your friends and family to vote. Every vote matters.</div>
      <div style="padding:16px;background:linear-gradient(145deg,var(--sa-08),var(--ba-10));border:1px solid var(--bd-s);border-radius:var(--r3);font-size:13px;color:var(--tx-1);line-height:1.65;white-space:pre-line;font-weight:500;margin-top:4px">${msg}</div>
      <button class="feat-action-btn" onclick="Features._doShare(${JSON.stringify(msg).replace(/</g,'&lt;')})">📤 Share this message</button>
      <button onclick="Features._copyShare(${JSON.stringify(msg).replace(/</g,'&lt;')})" style="width:100%;padding:11px;border-radius:var(--r3);background:var(--bg-2);border:1px solid var(--bd-1);color:var(--tx-2);font-size:13px;font-family:var(--f-b);cursor:pointer;transition:all .2s">📋 Copy to clipboard</button>
    </div>`;
  },
  _doShare(msg){ if(navigator.share){navigator.share({text:msg}).catch(()=>{});}else{this._copyShare(msg);} },
  _copyShare(msg){ navigator.clipboard?.writeText(msg); Toast.show('📋 Copied to clipboard!'); },

  /* ── Election News ── */
  _news(){
    const items=[
      {t:'ECI announces Voter Helpline 1950 is 24/7 active',d:'Voters can now call at any hour for registration, booth location, and election day queries.',dt:'Official ECI'},
      {t:'New: Vote from home option for PwD and senior voters',d:'Voters aged 85+ and differently-abled voters can now apply to vote from home via postal ballot.',dt:'ECI Circular'},
      {t:'Form 6 online registration portal updated',d:'The voter registration portal now supports Aadhaar-based e-KYC for faster enrollment.',dt:'voterportal.eci.gov.in'},
      {t:'Model Code of Conduct: What candidates cannot do',d:'MCC bars distribution of gifts, use of government resources, and hate speech during election period.',dt:'ECI MCC Guidelines'},
      {t:'EVMs certified by IIT and STQC — tamper-proof',d:'Election Commission confirms EVMs undergo rigorous technical testing. VVPAT slips allow independent verification.',dt:'ECI Technology Division'},
    ];
    return `
    <div class="feat-content">
      <div class="feat-content-title">📰 ECI Updates</div>
      <div class="feat-content-sub">Key announcements from the Election Commission of India.</div>
      <div style="display:flex;flex-direction:column;gap:8px;margin-top:4px">
        ${items.map(n=>`
          <div class="news-card">
            <div class="news-dot"></div>
            <div>
              <div class="news-title">${n.t}</div>
              <div style="font-size:11.5px;color:var(--tx-2);margin-top:4px;line-height:1.55">${n.d}</div>
              <div class="news-meta">${n.dt}</div>
            </div>
          </div>`).join('')}
      </div>
    </div>`;
  },

  /* ── Helpline ── */
  _helpline(){
    const lines=[
      {n:'National Voter Helpline',num:'1950',d:'Registration, booth, complaints — 24/7',i:'📞'},
      {n:'ECI Main Website',num:'eci.gov.in',d:'Official Election Commission site',i:'🌐',link:'https://www.eci.gov.in'},
      {n:'Voter Portal',num:'voterportal.eci.gov.in',d:'Register, check status, corrections',i:'🖥️',link:'https://voterportal.eci.gov.in'},
      {n:'cVIGIL App',num:'Report Violations',d:'Report election code violations with photo/video',i:'📸',link:'https://cvigil.eci.gov.in'},
      {n:'Voter Helpline App',num:'Play Store / App Store',d:'Booth finder, voter slip, status',i:'📱'},
      {n:'NVSP Portal',num:'nvsp.in',d:'National Voters Service Portal',i:'🗂️',link:'https://www.nvsp.in'},
    ];
    return `
    <div class="feat-content">
      <div class="feat-content-title">📞 Official Helplines</div>
      <div class="feat-content-sub">All official ECI contacts in one place.</div>
      <div style="display:flex;flex-direction:column;gap:7px;margin-top:4px">
        ${lines.map(l=>`
          <div style="display:flex;align-items:center;gap:12px;padding:11px 13px;border-radius:var(--r3);background:var(--bg-2);border:1px solid var(--bd-0);${l.link?'cursor:pointer':''}">
            <span style="font-size:20px;flex-shrink:0">${l.i}</span>
            <div style="flex:1">
              <div style="font-size:12px;font-weight:700;color:var(--tx-1)">${l.n}</div>
              <div style="font-size:11px;color:var(--s-400);font-weight:600;margin-top:2px">${l.link?`<a href="${l.link}" target="_blank" style="color:var(--s-400);text-decoration:none">${l.num}</a>`:l.num}</div>
              <div style="font-size:10px;color:var(--tx-3);margin-top:1px">${l.d}</div>
            </div>
            ${l.link?`<span style="color:var(--tx-3);font-size:12px">↗</span>`:''}
          </div>`).join('')}
      </div>
    </div>`;
  },
};
