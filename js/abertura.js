// Abertura: chuva de código (binário/hex) em verde, no estilo terminal militar
(function(){
 const sp=document.getElementById('splash');if(!sp)return;
 const cv=sp.querySelector('.ab-chuva'),cx=cv.getContext('2d'),calmo=matchMedia('(prefers-reduced-motion:reduce)').matches;
 const CH='01ABCDEF23456789<>/{}[]#$%';
 let W,H,D,F,col,gota;
 function medir(){D=Math.min(devicePixelRatio||1,2);W=cv.width=sp.clientWidth*D;H=cv.height=sp.clientHeight*D;F=16*D;col=Math.ceil(W/F);gota=Array.from({length:col},()=>Math.random()*H/F)}
 medir();addEventListener('resize',medir);
 function passo(){
  cx.fillStyle='rgba(3,7,4,.14)';cx.fillRect(0,0,W,H);
  cx.font=`${F}px "JetBrains Mono",monospace`;
  for(let i=0;i<col;i++){
   const y=gota[i]*F;
   cx.fillStyle=Math.random()>.96?'#d9ffe4':'#22c55e';
   cx.fillText(CH[Math.random()*CH.length|0],i*F,y);
   if(y>H&&Math.random()>.975)gota[i]=0;
   gota[i]++;
  }
 }
 if(calmo){for(let k=0;k<45;k++)passo();return}
 let ult=0;
 function quadro(now){
  if(!sp.isConnected)return;
  requestAnimationFrame(quadro);
  if(now-ult<55)return;ult=now;passo();
 }
 requestAnimationFrame(quadro);
})();
