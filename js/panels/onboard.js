const Onboard = {
  ST:['West Bengal','Maharashtra','Tamil Nadu','Uttar Pradesh','Karnataka','Delhi','Gujarat','Rajasthan','Kerala','Punjab','Bihar','Other'],
  VO:[
    {id:'first-time',i:'🌱',n:'First-time voter', d:'Voting for the first time'},
    {id:'regular',   i:'✅',n:'Regular voter',    d:'Have voted before'},
    {id:'nri',       i:'✈️',n:'NRI voter',         d:'Indian citizen abroad'},
    {id:'pwd',       i:'♿',n:'PwD voter',         d:'Need accessible options'},
  ],

  spokes(n,r1,r2,c,sw=1.1){
    return Array.from({length:n},(_,i)=>{
      const a=i*(360/n)*Math.PI/180;
      const x1=(50+r1*Math.sin(a)).toFixed(1), y1=(50-r1*Math.cos(a)).toFixed(1);
      const x2=(50+r2*Math.sin(a)).toFixed(1), y2=(50-r2*Math.cos(a)).toFixed(1);
      return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="${sw}"/>`;
    }).join('');
  },

  html(){
    return `
    <div class="vg-panel" id="pnl-ob"
         style="overflow-y:auto;transform:none!important;opacity:1!important;pointer-events:all!important">
      <div class="ob-wrap">

        <div class="ob-hero">
          <div class="ob-mandala">
            <div class="ob-m-glow"></div>
            <div class="ob-m-outer">
              <svg viewBox="0 0 100 100" width="108" height="108">
                ${this.spokes(24,22,46,'rgba(255,102,0,.38)')}
                <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(255,102,0,.18)" stroke-width=".8"/>
                <circle cx="50" cy="50" r="22" fill="none" stroke="rgba(255,102,0,.25)" stroke-width=".8"/>
                ${Array.from({length:8},(_,i)=>{const a=i*45*Math.PI/180;const x=(50+34*Math.sin(a)).toFixed(1),y=(50-34*Math.cos(a)).toFixed(1);return `<circle cx="${x}" cy="${y}" r="2.2" fill="rgba(255,102,0,.45)"/>`;}).join('')}
              </svg>
            </div>
            <div class="ob-m-inner">
              <svg viewBox="0 0 100 100" width="70" height="70">
                ${this.spokes(12,18,32,'rgba(26,92,255,.3)',.9)}
                <circle cx="50" cy="50" r="32" fill="none" stroke="rgba(26,92,255,.18)" stroke-width=".8"/>
              </svg>
            </div>
            <div class="ob-m-face">🗳️</div>
          </div>

          <div class="ob-badge"><div class="ob-badge-dot"></div>🇮🇳 India's Election Guide</div>
          <div class="ob-h1">
            <span class="l1">Vote Smart.</span>
            <span class="l2" data-t="Vote Right.">Vote Right.</span>
          </div>
          <div class="ob-desc">Personalised AI guidance through every step of India's democratic process — free, accurate, official.</div>
          <div class="ob-tags">
            <span class="ob-tag">🆓 Gemini Free</span>
            <span class="ob-tag">🗺️ OSM Maps</span>
            <span class="ob-tag">☀️🌙 Light+Dark</span>
            <span class="ob-tag">🎤 Voice Input</span>
            <span class="ob-tag">🌐 4 Languages</span>
          </div>
        </div>

        <div>
          <div class="ob-section-head"><div class="ob-step-num">1</div>Your State</div>
          <div style="height:10px"></div>
          <div class="state-grid">
            ${this.ST.map(s=>`<button class="s-btn" onclick="Onboard.ps(this,'${s}')">${s}</button>`).join('')}
          </div>
        </div>

        <div>
          <div class="ob-section-head"><div class="ob-step-num">2</div>I am a</div>
          <div style="height:10px"></div>
          <div class="voter-grid">
            ${this.VO.map(v=>`
              <div class="v-card" onclick="Onboard.pv(this,'${v.id}')">
                <div class="v-sel">✓</div>
                <span class="v-ico">${v.i}</span>
                <div class="v-nm">${v.n}</div>
                <div class="v-ds">${v.d}</div>
              </div>`).join('')}
          </div>
        </div>

        <button class="ob-cta" id="ob-cta" onclick="Onboard.go()">
          <div class="cta-shine"></div>
          Begin your voter journey →
        </button>

      </div>
    </div>`;
  },

  ps(el,s){ document.querySelectorAll('.s-btn').forEach(b=>b.classList.remove('on')); el.classList.add('on'); S.s('state',s); S.sk('state',s); },
  pv(el,v){ document.querySelectorAll('.v-card').forEach(c=>c.classList.remove('on')); el.classList.add('on'); S.s('voter',v); S.sk('voter',v); },

  go(){
    if(!S.g('state')||!S.g('voter')){
      const b=document.getElementById('ob-cta'); b.classList.add('shaking'); setTimeout(()=>b.classList.remove('shaking'),520); return;
    }
    if(!S.g('serverReady')){ Modal.open(); return; }
    this.launch();
  },

  launch(){
    if(S.g('live')) return;
    S.s('live',true);
    const ob=document.getElementById('pnl-ob');
    ob.style.transition='opacity .44s ease, transform .44s ease';
    ob.style.opacity='0'; ob.style.transform='scale(.95) translateY(-20px)';
    setTimeout(()=>ob.style.display='none',450);
    Header.show(S.g('state'),S.g('voter'));
    Navbar.show();
    const chat=document.getElementById('pnl-chat');
    chat.classList.add('from-r');
    requestAnimationFrame(()=>requestAnimationFrame(()=>{ chat.classList.remove('from-r'); chat.classList.add('active'); }));
    Router.init('chat');
    Timeline.build(); 
    Checklist.build(); 
    Myths.build(); 
    Features.build();
  },
};
