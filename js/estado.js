// Conexão com o Supabase, estado do app e carregamento de dados
const $=s=>document.querySelector(s), PAGE=20;
const sb=SUPABASE_URL.includes('COLE')?null:supabase.createClient(SUPABASE_URL,SUPABASE_KEY);
let U=null,PF=null,MT=[],CT={},PG={},R={},FV={},S={v:'home'},ready=false;
const toast=m=>{const t=$('#toast');t.textContent=m;t.hidden=false;clearTimeout(toast.t);toast.t=setTimeout(()=>t.hidden=true,4000)};
const run=async p=>{const{data,error}=await p;if(error){toast(error.message);throw error}return data};
const AN=id=>{for(const m of MT)for(const a of m.assuntos)if(a.id==id)return a.nome;return''};
const st=as=>{let n=0,r=0,c=0;as.forEach(a=>{n+=CT[a.id]||0;r+=PG[a.id]?.r||0;c+=PG[a.id]?.c||0});return{n,r,c,pct:r?Math.round(c/r*100):0,prog:n?Math.round(r/n*100):0}};
const L=q=>q.alternativas.find(a=>a.id==q.gabarito).letra;
const wrongIds=()=>Object.keys(R).filter(k=>R[k]===false);

async function carregar(){
 const[m,a,c,p,r,f]=await Promise.all([run(sb.from('materias').select('*').order('ordem')),run(sb.from('assuntos').select('*').order('nome')),run(sb.from('contagem').select('*')),run(sb.from('meu_progresso').select('*')),run(sb.from('respostas').select('questao_id,ok')),run(sb.from('favoritos').select('questao_id'))]);
 MT=m.map(x=>({...x,assuntos:a.filter(y=>y.materia_id==x.id)}));
 CT={};c.forEach(x=>CT[x.assunto_id]=+x.n);PG={};p.forEach(x=>PG[x.assunto_id]={r:+x.respondidas,c:+x.acertos});
 R={};r.forEach(x=>R[x.questao_id]=x.ok);FV={};f.forEach(x=>FV[x.questao_id]=1)}
async function migrar(){try{const l=JSON.parse(localStorage.getItem('eear_v2')),k='eear_mig_'+U.id;if(!l||!l.h||localStorage.getItem(k))return;
 const rows=Object.entries(l.h).map(([id,h])=>({user_id:U.id,questao_id:id,alt:h.alt,ok:h.ok}));
 if(rows.length){const{error}=await sb.from('respostas').upsert(rows,{ignoreDuplicates:true});if(!error)toast(rows.length+' respostas antigas importadas para sua conta')}
 localStorage.setItem(k,1)}catch(e){}}
async function init(){document.body.classList.toggle('out',!U);
 if(!U){PF=null;document.body.classList.remove('adm');S={v:'landing'};return render()}
 PF=await run(sb.from('perfis').select('*').eq('id',U.id).single());
 document.body.classList.toggle('adm',!!PF.is_admin);
 await migrar();await carregar();S={v:'home'};render()}
async function need(i){const ids=S.ids.slice(i,i+PAGE).filter(id=>!S.qs[id]);if(ids.length)(await run(sb.from('questoes').select('*').in('id',ids))).forEach(q=>S.qs[q.id]=q)}
async function begin(ids,title,from){if(!ids.length)return toast('Nenhuma questão neste filtro');S={v:'sessao',ids,qs:{},i:0,ans:{},t0:Date.now(),title,m:S.m,from};await need(0);render()}
async function go(i){if(i<0||i>=S.ids.length)return;S.i=i;await need(i);render()}
