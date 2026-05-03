const MapPanel = (() => {
  let m=null, pins=[];

  const mkPin=()=>L.divIcon({
    html:`<div style="width:24px;height:30px;background:linear-gradient(145deg,#E05400,#FFA040);border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:2.5px solid rgba(255,255,255,.88);box-shadow:0 4px 18px rgba(255,102,0,.55)"></div>`,
    iconSize:[24,30],iconAnchor:[12,30],className:'',
  });

  const mkPinBlue=()=>L.divIcon({
    html:`<div style="width:20px;height:26px;background:linear-gradient(145deg,#0838CC,#4585FF);border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:2px solid rgba(255,255,255,.88);box-shadow:0 3px 14px rgba(26,92,255,.55)"></div>`,
    iconSize:[20,26],iconAnchor:[10,26],className:'',
  });

  const pop=(t,b)=>`<b style="font-family:Outfit,sans-serif;font-size:13px;color:var(--tx-1)">${t}</b><br><small style="color:var(--tx-3);line-height:1.6">${b}</small>`;

  return {
    html:()=>`
    <div class="vg-panel" id="pnl-map" style="display:flex;flex-direction:column">
      <div class="map-search">
        <input class="map-inp" id="map-inp" placeholder="Enter your area or constituency…"
               onkeydown="if(event.key==='Enter')MapPanel.search()">
        <button class="map-go" onclick="MapPanel.search()">Find Booth</button>
      </div>
      <div id="vg-map" style="flex:1;min-height:0"></div>
      <div class="map-foot">
        <span class="map-note">📍 Search area · Call 1950 for exact booth number</span>
        <a class="map-eci" href="https://voterportal.eci.gov.in" target="_blank">ECI Portal ↗</a>
      </div>
    </div>`,

    init(){
      if(m) return;
      setTimeout(()=>{
        m=L.map('vg-map',{zoomControl:true}).setView([20.59,78.96],5);
        const dark=document.documentElement.dataset.theme!=='light';
        L.tileLayer(
          dark
            ?'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
            :'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
          {attribution:'© <a href="https://osm.org">OSM</a> © <a href="https://carto.com">CARTO</a>',maxZoom:19}
        ).addTo(m);

        L.marker([20.59,78.96],{icon:mkPin()}).addTo(m)
         .bindPopup(pop('India','Search your area above to find your booth zone')).openPopup();

        // "Locate me" control
        const LocateCtrl=L.Control.extend({
          onAdd(){
            const btn=L.DomUtil.create('button','map-locate-btn');
            btn.innerHTML='📍';
            btn.title='My location';
            Object.assign(btn.style,{
              background:'var(--bg-app)',border:'1px solid var(--bd-1)',borderRadius:'8px',
              width:'34px',height:'34px',cursor:'pointer',fontSize:'16px',
              display:'flex',alignItems:'center',justifyContent:'center',
            });
            L.DomEvent.on(btn,'click',MapPanel.locateMe,this);
            return btn;
          },
        });
        new LocateCtrl({position:'topright'}).addTo(m);
      },150);
    },

    search(){
      const q=document.getElementById('map-inp').value.trim();
      if(!q||!m) return;
      fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q+', India')}&limit=2`)
        .then(r=>r.json()).then(res=>{
          if(!res.length){Toast.show('Location not found — try a specific area');return;}
          pins.forEach(p=>p.remove()); pins=[];
          const{lat,lon}=res[0];
          m.setView([+lat,+lon],13,{animate:true,duration:1.2});
          const mk=L.marker([+lat,+lon],{icon:mkPin()}).addTo(m);
          mk.bindPopup(pop(q,`For exact booth number:<br>📞 Call <b>1950</b> or visit <a href="https://voterportal.eci.gov.in" target="_blank" style="color:var(--s-400)">voterportal.eci.gov.in</a>`)).openPopup();
          pins.push(mk);
        }).catch(()=>Toast.show('Map search failed — check connection'));
    },

    locateMe(){
      if(!navigator.geolocation){Toast.show('Geolocation not available');return;}
      Toast.show('📍 Finding your location…',4000);
      navigator.geolocation.getCurrentPosition(pos=>{
        const{latitude:lat,longitude:lon}=pos.coords;
        m.setView([lat,lon],14,{animate:true,duration:1});
        const mk=L.marker([lat,lon],{icon:mkPinBlue()}).addTo(m);
        mk.bindPopup(pop('Your Location',`Call <b>1950</b> or visit <a href="https://voterportal.eci.gov.in" target="_blank" style="color:var(--s-400)">voterportal.eci.gov.in</a> for your exact booth`)).openPopup();
        pins.push(mk);
        Toast.show('✓ Location found!');
      },()=>Toast.show('Could not get location'));
    },
  };
})();
