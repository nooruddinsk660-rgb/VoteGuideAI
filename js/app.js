const App = {
  boot(){
    // FIX: Purge any API key that may have been stored in localStorage by an older
    // version of the app. The key must only live in the server's .env file.
    localStorage.removeItem('vg6k');

    Theme.init();

    // Build Ashoka Chakra loader
    const spokes = Array.from({length:24},(_,i)=>{
      const a=i*15*Math.PI/180;
      const x1=(30+12*Math.sin(a)).toFixed(2), y1=(30-12*Math.cos(a)).toFixed(2);
      const x2=(30+24*Math.sin(a)).toFixed(2), y2=(30-24*Math.cos(a)).toFixed(2);
      const op=(0.28+0.55*(i/23)).toFixed(2);
      return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="rgba(255,102,0,${op})" stroke-width="1.2"/>`;
    }).join('');
    const dots = Array.from({length:8},(_,i)=>{
      const a=i*45*Math.PI/180;
      const x=(30+18*Math.sin(a)).toFixed(2), y=(30-18*Math.cos(a)).toFixed(2);
      return `<circle cx="${x}" cy="${y}" r="2" fill="rgba(255,102,0,.55)"/>`;
    }).join('');

    document.getElementById('ldr-chakra').innerHTML=`
      <svg width="60" height="60" viewBox="0 0 60 60"
           style="animation:chakraSpin 2s linear infinite">
        <style>@keyframes chakraSpin{to{transform:rotate(360deg)}}</style>
        ${spokes}
        <circle cx="30" cy="30" r="24" fill="none" stroke="rgba(255,102,0,.18)" stroke-width="1.1"/>
        <circle cx="30" cy="30" r="12" fill="none" stroke="rgba(255,102,0,.28)" stroke-width="1.1"/>
        <circle cx="30" cy="30" r="3.5" fill="var(--s-500)"/>
        ${dots}
      </svg>`;

    // Mount app HTML
    document.getElementById('vg-app').innerHTML =
      Header.html() +
      Navbar.html() +
      Modal.html() +
      `<div class="vg-panels">
        ${Onboard.html()}
        ${Chat.html()}
        ${Timeline.html()}
        ${Checklist.html()}
        ${MapPanel.html()}
        ${Myths.html()}
        ${Features.html()}
      </div>`;

    Bg.init();
    
    // Restore user context from localStorage (non-sensitive: state & voter type only)
    const savedState = localStorage.getItem('vg6_state');
    const savedVoter = localStorage.getItem('vg6_voter');
    
    if(savedState) S.s('state', savedState);
    if(savedVoter) S.s('voter', savedVoter);
    
    // FIX: API key is now backend-only; check server health instead of reading a key from localStorage.
    Modal.silentCheck().then(ready => {
      if(ready && S.g('state') && S.g('voter') && !S.g('live')) {
        setTimeout(() => {
          Onboard.launch();
          Router.init('chat');
        }, 1800);
      }
    });

    // Dismiss loader
    setTimeout(()=>{
      document.getElementById('vg-loader').classList.add('out');
      setTimeout(()=>document.getElementById('vg-loader')?.remove(),720);
    },1750);
  },
};

document.addEventListener('DOMContentLoaded', App.boot);
