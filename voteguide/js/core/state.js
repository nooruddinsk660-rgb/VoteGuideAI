const S = (() => {
  const d = {
    // NOTE: 'key' is intentionally absent — the API key lives only in server/.env
    state: '', voter: '', lang: 'en',
    hist:  [], checks: {},
    tab:   'chat', live: false, serverReady: false,
    theme: localStorage.getItem('vg6theme') || 'dark',
  };
  const cbs = {};
  return {
    g:  k     => d[k],
    s:  (k,v) => { d[k]=v; (cbs[k]||[]).forEach(f=>f(v)); },
    on: (k,f) => { cbs[k]=cbs[k]||[]; cbs[k].push(f); },
    sk: (k,v) => { d[k]=v; localStorage.setItem('vg6_'+k, typeof v==='object'?JSON.stringify(v):v); },
    lk: (k,fb)=> { const v=localStorage.getItem('vg6_'+k); if(!v)return fb; try{return JSON.parse(v);}catch{return v;} },
  };
})();
