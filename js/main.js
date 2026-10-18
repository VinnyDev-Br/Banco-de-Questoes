// Eventos globais (clique, teclado), tema e inicialização
document.addEventListener('click',async e=>{const b=e.target.closest('[data-do]');if(!b||b.disabled)return;try{await A[b.dataset.do](b.dataset.arg)}catch(x){console.error(x)}});
document.addEventListener('submit',async e=>{e.preventDefault();if(S.mode=='criar')return A.signup();const{error}=await sb.auth.signInWithPassword({email:$('#em').value,password:$('#pw').value});if(error)toast(error.message=='Invalid login credentials'?'E-mail ou senha incorretos':error.message)});
document.addEventListener('keydown',e=>{if(S.v!='sessao'||e.ctrlKey||e.metaKey||e.altKey||/INPUT|TEXTAREA|SELECT/.test(e.target.tagName))return;const q=S.qs[S.ids[S.i]],k=e.key;
 if(k=='ArrowRight')go(S.i+1);else if(k=='ArrowLeft')go(S.i-1);else if(q&&k.length==1){const i='1234'.indexOf(k),j='abcd'.indexOf(k.toLowerCase()),x=q.alternativas[i>=0?i:j];if(x)A.alt(x.id)}});
try{if(sessionStorage.getItem('bq_splash'))$('#splash').remove();else setTimeout(()=>{const b=$('#splash button');b&&b.focus()},3500)}catch(e){}
let T;try{T=localStorage.getItem('bq_t')}catch(e){}
document.documentElement.dataset.t='dark';
if(!sb)$('#app').innerHTML='<h1>Falta conectar o banco de dados</h1><p class="mu">Abra o <b>index.html</b> em um editor e preencha <b>SUPABASE_URL</b> e <b>SUPABASE_KEY</b> no topo do arquivo.</p>';
else sb.auth.onAuthStateChange((_e,s)=>{const id=s?.user?.id||null;if(!ready||id!==(U?.id||null)){ready=true;U=s?.user||null;setTimeout(init,0)}});
