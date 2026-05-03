const Checklist = (() => {
  const D=[
    {s:'Before Election',items:[
      {id:'a1',l:'Check name on voter list',        h:'voterportal.eci.gov.in  ·  Call 1950'},
      {id:'a2',l:'Save your EPIC Voter ID number',  h:'Printed on your voter ID card'},
      {id:'a3',l:'Find your assigned polling booth',h:'ECI Voter Helpline App  ·  SMS "ECI" to 1950'},
      {id:'a4',l:'Note booth timings',              h:'Usually 7:00 AM – 6:00 PM on election day'},
    ]},
    {s:'Documents to Carry',items:[
      {id:'b1',l:'Voter ID (EPIC) — bring original',  h:'Primary accepted document at booth'},
      {id:'b2',l:'Backup photo ID ready',             h:'Aadhaar / PAN / Passport accepted'},
      {id:'b3',l:'Voter information slip (if received)',h:'Sent by BLO before election day'},
    ]},
    {s:'On Voting Day',items:[
      {id:'c1',l:'Arrive early — beat the queue',    h:'Peak crowd: 9–11 AM and 4–6 PM'},
      {id:'c2',l:'Leave phone outside polling booth',h:'Photography inside booth is a legal offence'},
    ]},
  ];
  const ALL=D.reduce((a,s)=>a+s.items.length,0);

  function load(){
    const c={};
    D.forEach(s=>s.items.forEach(i=>{c[i.id]=localStorage.getItem('vg6_'+i.id)==='1';}));
    S.s('checks',c);
  }

  function draw(){
    const c=S.g('checks');
    const done=Object.values(c).filter(Boolean).length;
    const pct=Math.round(done/ALL*100);
    const off=Math.round(214*(1-pct/100));
    const note=pct===100?'🎉 Fully prepared to vote!':pct>=60?'Almost ready — keep going!':'Tap each task to mark it done';

    document.getElementById('cl-inner').innerHTML=`
      <svg style="position:absolute;width:0;height:0">
        <defs>
          <linearGradient id="clg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#E05400"/>
            <stop offset="100%" stop-color="#FFA040"/>
          </linearGradient>
        </defs>
      </svg>
      <div class="cl-hero">
        <div class="cl-ring">
          <svg width="76" height="76" viewBox="0 0 76 76">
            <circle class="rtrack" cx="38" cy="38" r="34"/>
            <circle class="rarc"   cx="38" cy="38" r="34" style="stroke-dashoffset:${off}"/>
            <text x="38" y="34" text-anchor="middle" class="rpct">${pct}%</text>
            <text x="38" y="45" text-anchor="middle" class="rsub">READY</text>
          </svg>
        </div>
        <div class="cl-info">
          <div class="cl-info-h">Voter<br>Readiness</div>
          <div class="cl-info-s">${done} of ${ALL} done</div>
          <div class="cl-info-n">${note}</div>
        </div>
      </div>

      <button class="cl-share-btn" style="display:flex;align-items:center;justify-content:center;gap:7px;margin-bottom:4px" onclick="Checklist.share()">
        📤 Share my readiness — ${pct}% ready
      </button>

      ${D.map(sec=>`
        <div class="cl-sec-lbl">${sec.s}</div>
        ${sec.items.map(it=>`
          <div class="cl-item${c[it.id]?' chkd':''}" onclick="Checklist.toggle('${it.id}')">
            <div class="cl-box${c[it.id]?' on':''}">${c[it.id]?'✓':''}</div>
            <div>
              <div class="cl-lbl${c[it.id]?' done':''}">${it.l}</div>
              <div class="cl-hint">${it.h}</div>
            </div>
          </div>`).join('')}
      `).join('')}`;
  }

  return {
    html:()=>`<div class="vg-panel" id="pnl-checklist"><div class="vg-scroll"><div id="cl-inner" style="padding-bottom:24px"></div></div></div>`,
    build(){ load(); draw(); },
    toggle(id){
      const c=S.g('checks'); c[id]=!c[id];
      localStorage.setItem('vg6_'+id,c[id]?'1':'0');
      S.s('checks',c); draw();
    },
    share(){
      const c=S.g('checks');
      const done=Object.values(c).filter(Boolean).length;
      const pct=Math.round(done/ALL*100);
      const txt=`🗳️ I'm ${pct}% ready to vote!\n\nChecked ${done}/${ALL} tasks on VoteGuide AI.\n\nAre you ready? → voterportal.eci.gov.in\nHelpline: 1950`;
      if(navigator.share){ navigator.share({text:txt}).catch(()=>{}); }
      else if(navigator.clipboard){ navigator.clipboard.writeText(txt); Toast.show('📋 Copied to clipboard!'); }
      else { Toast.show('📋 Share not available'); }
    },
  };
})();
