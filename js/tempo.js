// Cronômetro por questão, estatísticas (taxa de acerto, tempos, sequência) e gravação da resposta
const TL={facil:120,medio:150,dificil:210};
const fmt=s=>{s=Math.max(0,Math.round(s));return String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0')};
const TIMER={id:null,ac:0,last:0,on:false,hid:false,limit:150,iv:0};
const elapsed=()=>TIMER.ac+(TIMER.on?(Date.now()-TIMER.last)/1000:0);
function tpaint(){const el=$('#tmr');if(!el)return;const r=TIMER.limit-elapsed();el.textContent=(r<0?'+':'')+fmt(Math.abs(r));el.classList.toggle('late',r<0);const b=$('#tbar i');if(b)b.style.width=Math.max(0,r/TIMER.limit*100)+'%'}
function tpause(){if(!TIMER.on)return;TIMER.ac+=(Date.now()-TIMER.last)/1000;TIMER.on=false;TIMER.last=0;clearInterval(TIMER.iv)}
function tresume(l){TIMER.limit=l;if(!TIMER.on){TIMER.on=true;TIMER.last=Date.now();TIMER.iv=setInterval(tpaint,250)}tpaint()}
function tstart(id,l){tpause();TIMER.id=id;TIMER.ac=0;tresume(l)}
function tstop(){const e=Math.min(Math.round(elapsed()),3599);tpause();return e}
document.addEventListener('visibilitychange',()=>{if(document.hidden){TIMER.hid=TIMER.on;tpause()}else if(TIMER.hid){TIMER.hid=false;tresume(TIMER.limit)}});
// liga o cronômetro à questão que está na tela (pausa quando não há questão a responder)
function timerSync(){const q=S.v=='home'?(FA?null:FQ):S.v=='sessao'?(S.ans[S.ids[S.i]]?null:S.qs[S.ids[S.i]]):null;
 if(!q){tpause();return}const l=TL[q.dificuldade]||150;TIMER.id==q.id?tresume(l):tstart(q.id,l)}

const ST=()=>{const ids=Object.keys(R),c=ids.filter(i=>R[i]).length,ts=ids.map(i=>TM[i]).filter(x=>x>0),tc=ids.filter(i=>R[i]&&TM[i]>0).map(i=>TM[i]);
 return{n:ids.length,c,pct:ids.length?Math.round(c/ids.length*100):0,med:ts.length?Math.round(ts.reduce((a,b)=>a+b,0)/ts.length):0,best:tc.length?Math.min(...tc):0,total:Object.values(CT).reduce((a,b)=>a+b,0)}};
const dia=d=>{const x=new Date(d);return x.getFullYear()*372+x.getMonth()*31+x.getDate()};
function streak(){const s=new Set(Object.values(RD).filter(Boolean).map(dia)),d=new Date();let n=0;if(!s.has(dia(d)))d.setDate(d.getDate()-1);while(s.has(dia(d))){n++;d.setDate(d.getDate()-1)}return n}
// tempos ficam no banco (coluna tempo_s); sem a coluna, ficam salvos neste aparelho
const tKey=()=>'bq_tm_'+(U?.id||'');
function tLoad(){try{return JSON.parse(localStorage.getItem(tKey())||'{}')}catch(e){return{}}}
function tSave(){try{localStorage.setItem(tKey(),JSON.stringify(TM))}catch(e){}}
async function gravar(q,a,ok,t){const id=q.id,row={user_id:U.id,questao_id:id,alt:a,ok,criada_em:new Date().toISOString()};if(TEMPO_DB)row.tempo_s=t;
 const p=PG[q.assunto_id]||(PG[q.assunto_id]={r:0,c:0}),prev=R[id];if(prev===undefined){p.r++;if(ok)p.c++}else if(prev!==ok)p.c+=ok?1:-1;
 R[id]=ok;RD[id]=row.criada_em;TM[id]=t;if(!TEMPO_DB)tSave();
 await run(sb.from('respostas').upsert(row))}
