const Bg = (() => {
  let cv, cx, W, H, t = 0, raf;

  const DARK = [
    {px:.08,py:.10,w:340,rgb:'255,102,0',  dur:17,ax:0,  ay:0,  amp:[55,-65,30]},
    {px:.88,py:.82,w:300,rgb:'26,92,255',  dur:21,ax:1.2,ay:.8, amp:[-45,40,-30]},
    {px:.50,py:.50,w:260,rgb:'19,136,8',   dur:25,ax:.6, ay:.4, amp:[35,-30,45]},
    {px:.82,py:.12,w:200,rgb:'212,160,23', dur:19,ax:1,  ay:.2, amp:[-30,25,-20]},
    {px:.14,py:.88,w:180,rgb:'255,45,85',  dur:23,ax:.3, ay:1.1,amp:[25,-20,30]},
  ];
  const LIGHT = [
    {px:.08,py:.10,w:380,rgb:'255,102,0',  dur:17,ax:0,  ay:0,  amp:[55,-65,30]},
    {px:.88,py:.82,w:320,rgb:'26,92,255',  dur:21,ax:1.2,ay:.8, amp:[-45,40,-30]},
    {px:.50,py:.50,w:280,rgb:'0,180,80',   dur:25,ax:.6, ay:.4, amp:[35,-30,45]},
    {px:.82,py:.12,w:220,rgb:'212,160,23', dur:19,ax:1,  ay:.2, amp:[-30,25,-20]},
  ];

  function draw() {
    if (!cx) return;
    cx.clearRect(0,0,W,H);
    t++;
    const dark = document.documentElement.dataset.theme !== 'light';
    const orbs = dark ? DARK : LIGHT;
    const alpha = dark ? 0.13 : 0.07;
    orbs.forEach(o => {
      const phase = t * 0.001;
      const x = o.px*W + Math.sin(phase*o.dur+o.ax)*o.amp[0];
      const y = o.py*H + Math.cos(phase*o.dur+o.ay)*o.amp[1];
      const g = cx.createRadialGradient(x,y,0,x,y,o.w);
      g.addColorStop(0,   `rgba(${o.rgb},${alpha})`);
      g.addColorStop(.55, `rgba(${o.rgb},${alpha*.45})`);
      g.addColorStop(1,   `rgba(${o.rgb},0)`);
      cx.fillStyle=g; cx.beginPath(); cx.arc(x,y,o.w,0,Math.PI*2); cx.fill();
    });
    raf = requestAnimationFrame(draw);
  }

  function resize() { W=cv.width=window.innerWidth; H=cv.height=window.innerHeight; }

  function init() {
    cv=document.getElementById('vg-bg'); cx=cv.getContext('2d');
    resize(); window.addEventListener('resize',resize); draw();
  }

  return { init };
})();
