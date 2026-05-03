const Myths = {
  D:[
    {q:'I can use Aadhaar to vote even without a Voter ID card',ok:true,
     a:'Correct. If your name is on the Electoral Roll, you can vote using any of 12 approved alternative photo IDs — Aadhaar, PAN, Passport, Driving Licence, MNREGA Job Card, Pension document with photo, and more. Your name must still be in the voter roll.',
     src:'ECI: Alternative Photo Identity Documents (2019 Order)'},
    {q:'Voting is compulsory in India — not voting means a fine',ok:false,
     a:'False. Voting is entirely voluntary at the national level. You have a constitutional right to abstain. Gujarat alone mandates it for local body elections, but national enforcement is zero.',
     src:'Constitution of India, Article 326'},
    {q:'I can vote at any polling booth in India on election day',ok:false,
     a:'False. You must vote only at your specifically assigned booth (shown on your voter slip). If you have moved, update via Form 8A at voterportal.eci.gov.in before the voter list deadline.',
     src:'Representation of the People Act, 1951 — Section 19'},
    {q:'Turning 18 automatically registers me to vote',ok:false,
     a:'False. Turning 18 does NOT auto-enrol you. Submit Form 6 online at voterportal.eci.gov.in or offline at your BLO office before the registration cutoff — usually months before the election.',
     src:'ECI Voter Registration Guidelines'},
    {q:'NOTA is a wasted vote and cannot change anything',ok:false,
     a:'False. NOTA is officially counted, publicly reported, and a Supreme Court-protected democratic right. It formally registers voter dissatisfaction and appears in official ECI results for all to see.',
     src:'PUCL v Union of India — Supreme Court, 2013'},
    {q:'A spelling mistake in the voter list stops me from voting',ok:false,
     a:'False. A minor error does not bar you from voting. The presiding officer can verify identity with other documents. However, do correct it via Form 8 at voterportal.eci.gov.in to avoid friction.',
     src:'ECI Handbook for Presiding Officers'},
    {q:'NRI Indians cannot vote in Indian elections at all',ok:false,
     a:'False. NRI voters can register under Section 20A using Form 6A (overseas electors). They must physically appear at their assigned polling station in India to cast their vote.',
     src:'Representation of the People (Amendment) Act, 2010 — Section 20A'},
  ],

  html:()=>`
  <div class="vg-panel" id="pnl-myths">
    <div class="vg-scroll">
      <div class="myth-hd">
        <div class="pnl-eyebrow">🔍 Verify</div>
        <div class="pnl-title">Myth vs Fact</div>
        <div class="pnl-sub">7 common myths — tap to reveal the truth</div>
      </div>
      <div class="myth-list" id="myth-list"></div>
    </div>
  </div>`,

  build(){
    document.getElementById('myth-list').innerHTML=this.D.map((m,i)=>`
      <div class="myth-card">
        <div class="myth-trig" onclick="Myths.toggle(${i})">
          <div class="myth-pip ${m.ok?'pip-t':'pip-f'}">${m.ok?'T':'F'}</div>
          <div class="myth-q">${m.q}</div>
          <div class="myth-chev" id="mc${i}">▾</div>
        </div>
        <div class="myth-ans" id="ma${i}">
          <div class="myth-ans-in">
            <div class="myth-v ${m.ok?'vt':'vf'}">${m.ok?'✓ TRUE':'✗ FALSE'}</div>
            ${m.a}
            <div class="myth-src">Source: ${m.src}</div>
          </div>
        </div>
      </div>`).join('');
  },

  toggle(i){
    const b=document.getElementById('ma'+i),c=document.getElementById('mc'+i);
    const open=b.classList.contains('open');
    document.querySelectorAll('.myth-ans').forEach(x=>x.classList.remove('open'));
    document.querySelectorAll('.myth-chev').forEach(x=>x.classList.remove('open'));
    if(!open){b.classList.add('open');c.classList.add('open');}
  },
};
