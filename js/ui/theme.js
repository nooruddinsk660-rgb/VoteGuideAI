const Theme = {
  init() {
    const t = S.g('theme') || 'dark';
    this.apply(t);
  },

  apply(t) {
    document.documentElement.dataset.theme = t;
    S.s('theme', t);
    localStorage.setItem('vg6theme', t);
    const btn = document.getElementById('theme-btn');
    if (btn) btn.textContent = t === 'dark' ? '☀️' : '🌙';
    document.querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', t==='dark'?'#060810':'#F5F0E8');
  },

  toggle() { this.apply(S.g('theme')==='dark' ? 'light' : 'dark'); },
};
