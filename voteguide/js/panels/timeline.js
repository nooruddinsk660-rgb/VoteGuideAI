const Timeline = {
  D:[
    {w:'Months before',        e:'Voter Registration Opens',     i:'Submit Form 6 at voterportal.eci.gov.in or at your BLO office. First-time voters must register before the cutoff — usually months before election day.',s:'done'},
    {w:'8–10 weeks before',    e:'Voter List Finalised',         i:'Last date for corrections (Form 8) or address changes (Form 8A). After this deadline, no new names or edits can be processed for the upcoming election.',s:'done'},
    {w:'4–6 weeks before',     e:'Model Code of Conduct',        i:'EC announces the schedule. MCC immediately applies — strict rules on campaigning, expenditure, and conduct for all political parties and candidates.',s:'now'},
    {w:'3 weeks before',       e:'Voter Slips Distributed',      i:'BLOs distribute voter information slips to all registered voters containing your polling booth address, voter serial number, and election date.',s:'now'},
    {w:'48 hours before',      e:'Campaign Silence Period',      i:'All political campaigning must stop 48 hours before polling. No material can be displayed within 200 metres of any polling booth.',s:'soon'},
    {w:'Election Day 7AM–6PM', e:'Polling Day',                  i:'Bring your EPIC card or 1 of 12 approved alternative IDs. No phones inside booth. Indelible ink on left index finger after voting.',s:'soon'},
    {w:'Counting Day',         e:'Results Declared',             i:'EVMs opened under observer and party agent watch. Votes tallied. Results announced same day by the Election Commission of India.',s:'soon'},
  ],

  html:()=>`<div class="vg-panel" id="pnl-timeline"><div class="vg-scroll" id="tl-scroll"></div></div>`,

  build(){
    const done=this.D.filter(d=>d.s==='done').length;
    const pct=Math.round(done/this.D.length*100);
    document.getElementById('tl-scroll').innerHTML=`
      <div class="tl-head">
        <div class="pnl-eyebrow">🗳️ ECI Process</div>
        <div class="pnl-title">Election<br>Timeline</div>
        <div class="pnl-sub">${S.g('state')} · General process</div>
      </div>
      <div class="tl-prog">
        <div class="tl-prog-row">
          <span class="tl-prog-l">Overall progress</span>
          <span class="tl-prog-r">${pct}%</span>
        </div>
        <div class="tl-track"><div class="tl-fill" id="tl-fill" style="width:0%"></div></div>
      </div>
      <div class="tl-list">
        ${this.D.map((d,i)=>`
          <div class="tl-item">
            <div class="tl-spine">
              <div class="tl-dot ${d.s}"></div>
              ${i<this.D.length-1?`<div class="tl-line ${d.s}"></div>`:''}
            </div>
            <div class="tl-body">
              <div class="tl-when">${d.w}</div>
              <div class="tl-evt">${d.e}</div>
              <div class="tl-info">${d.i}</div>
              <span class="tl-tag ${d.s}">${d.s==='done'?'✓ Complete':d.s==='now'?'⟳ In Progress':'○ Upcoming'}</span>
            </div>
          </div>`).join('')}
      </div>`;
    setTimeout(()=>{const f=document.getElementById('tl-fill');if(f)f.style.width=pct+'%';},220);
  },
};
