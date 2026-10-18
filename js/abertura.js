// Abertura: estrelas em "dobra de velocidade" que desaceleram até uma deriva calma
(function(){
 const sp=document.getElementById('splash');if(!sp)return;
 const cv=sp.querySelector('.ab-stars'),cx=cv.getContext('2d'),calmo=matchMedia('(prefers-reduced-motion:reduce)').matches;
 let W,H,D,t0=performance.now();
 const est=Array.from({length:230},()=>({a:Math.random()*6.283,r:Math.random(),k:.4+Math.random()*1.2,c:Math.random()}));
 function medir(){D=Math.min(devicePixelRatio||1,2);W=cv.width=sp.clientWidth*D;H=cv.height=sp.clientHeight*D;est.forEach(s=>s.r=Math.random()*Math.hypot(W,H)/2)}
 medir();addEventListener('resize',medir);
 cx.lineCap='round';
 function quadro(now){
  if(!sp.isConnected)return;
  const t=(now-t0)/1000,e=calmo?1:Math.max(0,Math.min(1,(t-.6)/2.8)),vel=calmo?.3:1.2+32.8*(1-e)*(1-e);
  const ox=W/2,oy=H*.44,md=Math.hypot(W,H)/2+40;
  cx.clearRect(0,0,W,H);
  for(const s of est){
   const v=vel*s.k*D*(.15+s.r/(md*.35));
   s.r+=v;
   if(s.r>md){s.r=Math.random()*30*D;s.a=Math.random()*6.283}
   const l=Math.min(v*2.2,s.r),c=Math.cos(s.a),n=Math.sin(s.a),al=Math.min(1,s.r/(md*.5))*(.35+.65*s.c);
   cx.strokeStyle=`rgba(${s.c>.8?'255,226,150':s.c<.25?'160,190,255':'255,255,255'},${al})`;
   cx.lineWidth=(.6+s.k*.8)*D;
   cx.beginPath();cx.moveTo(ox+c*(s.r-l),oy+n*(s.r-l));cx.lineTo(ox+c*s.r,oy+n*s.r);cx.stroke();
  }
  requestAnimationFrame(quadro);
 }
 requestAnimationFrame(quadro);
})();
