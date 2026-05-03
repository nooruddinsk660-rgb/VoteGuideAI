const Router = (() => {
  const ORD = ['chat','timeline','checklist','map','myths','features'];
  let cur = 'chat';
  let initialized = {};

  function initPanel(id) {
    if(initialized[id]) return;
    initialized[id] = true;
    
    switch(id) {
      case 'timeline': Timeline.build(); break;
      case 'checklist': Checklist.build(); break;
      case 'map': MapPanel.init(); break;
      case 'myths': Myths.build(); break;
      case 'features': Features.build(); break;
      case 'chat': Chat.build(); break;
    }
  }

  function go(nxt) {
    if (nxt===cur) return;
    const ri = ORD.indexOf(nxt) > ORD.indexOf(cur);
    const from = document.getElementById('pnl-'+cur);
    const to   = document.getElementById('pnl-'+nxt);
    if (!from||!to) return;
    from.classList.remove('active');
    from.classList.add(ri?'to-l':'to-r');
    setTimeout(()=>from.classList.remove('to-l','to-r'),320);
    to.classList.remove('from-r','from-l','active');
    to.classList.add(ri?'from-r':'from-l');
    requestAnimationFrame(()=>requestAnimationFrame(()=>{
      to.classList.remove('from-r','from-l'); to.classList.add('active');
      initPanel(nxt);
    }));
    cur=nxt; S.s('tab',nxt);
    document.querySelectorAll('.nav-btn').forEach(b=>b.classList.toggle('on',b.dataset.tab===nxt));
  }

  return { go, cur:()=>cur, init:initPanel };
})();
