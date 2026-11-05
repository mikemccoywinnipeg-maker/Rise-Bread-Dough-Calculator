const CACHE='rise-v2';
const ASSETS=["./", "index.html", "manifest.webmanifest", "img/bagels-t.jpg", "img/bagels.jpg", "img/baguette-t.jpg", "img/baguette.jpg", "img/brioche-t.jpg", "img/brioche.jpg", "img/buns-t.jpg", "img/buns.jpg", "img/ciabatta-t.jpg", "img/ciabatta.jpg", "img/cinnamon-t.jpg", "img/cinnamon.jpg", "img/detroit-t.jpg", "img/detroit.jpg", "img/focaccia-t.jpg", "img/focaccia.jpg", "img/french-t.jpg", "img/french.jpg", "img/naan-t.jpg", "img/naan.jpg", "img/neapolitan-t.jpg", "img/neapolitan.jpg", "img/ny-t.jpg", "img/ny.jpg", "img/overnight-t.jpg", "img/overnight.jpg", "img/pan-t.jpg", "img/pan.jpg", "img/pita-t.jpg", "img/pita.jpg", "img/sandwich-t.jpg", "img/sandwich.jpg", "img/sourdough-t.jpg", "img/sourdough.jpg", "icons/apple-touch-icon.png", "icons/icon-192.png", "icons/icon-512.png", "icons/icon-maskable-512.png"];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  const req=e.request; if(req.method!=='GET') return;
  const url=new URL(req.url);
  if(url.origin===location.origin && (req.mode==='navigate' || url.pathname.endsWith('/index.html'))){
    // network first for the page so updates show up; fall back to cache offline
    e.respondWith(fetch(req).then(r=>{const cp=r.clone(); caches.open(CACHE).then(c=>c.put('index.html',cp)); return r;}).catch(()=>caches.match('index.html')));
    return;
  }
  // cache first for photos, icons and Google Fonts
  e.respondWith(caches.match(req).then(hit=>hit||fetch(req).then(r=>{ if(r.ok||r.type==='opaque'){const cp=r.clone(); caches.open(CACHE).then(c=>c.put(req,cp));} return r; })));
});
