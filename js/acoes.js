// Ações dos botões (data-do): iniciar sessão, responder, admin, login...
const A={
landing(){S={v:'landing'};render()},
auth(a){S={v:'auth',mode:a=='criar'?'criar':'entrar'};render()},
modo(a){const v=['nm','em','pw'].map(i=>$('#'+i)?.value||'');S.mode=a;render(1);['nm','em','pw'].forEach((i,k)=>{const e=$('#'+i);if(e)e.value=v[k]})},
demo(a){const c=$('.lp-q');if(!c||c.dataset.d)return;c.dataset.d=1;c.querySelectorAll('.lp-alt').forEach(b=>{b.classList.toggle('ok',b.dataset.arg=='b');if(b.dataset.arg==a&&a!='b')b.classList.add('no')});const f=c.querySelector('.lp-fb');f.textContent=(a=='b'?'Correto! ':'Incorreto. ')+'a₁₀ = 3 + 9·4 = 39, alternativa B.';f.hidden=false},
entrar(){const s=$('#splash');s.classList.add('out');try{sessionStorage.setItem('bq_splash',1)}catch(e){}setTimeout(()=>s.remove(),700)},
mat(a){S={v:'mat',m:a,f:'todas'};render()},
filt(a){S.f=a;render(1)},
async start(a){const m=MT.find(x=>x.id==S.m),as=a=='*'?m.assuntos.map(x=>x.id):[a],f=S.f;
 const ids=(await run(sb.from('questoes').select('id').eq('ativa',true).in('assunto_id',as).order('id').limit(1000))).map(x=>x.id).filter(id=>f=='novas'?!(id in R):f=='erradas'?R[id]===false:f=='favs'?FV[id]:1);
 await begin(ids,m.nome+(a=='*'?'':' · '+AN(a)),'mat')},
next(){return go(S.i+1)},prev(){return go(S.i-1)},go(a){return go(+a)},
fin(){S.v='res';render()},
sair(){return S.from=='salvas'?A.salvas():S.from=='erros'?A.erros():S.from=='mat'?A.mat(S.m):A.home()},
async fav(){const id=curId();if(FV[id]){delete FV[id];render(1);await run(sb.from('favoritos').delete().eq('questao_id',id).eq('user_id',U.id))}else{FV[id]=1;render(1);await run(sb.from('favoritos').upsert({user_id:U.id,questao_id:id}))}},
async cm(){const id=S.ids[S.i];S.cm={id,l:await run(sb.from('comentarios').select('texto,perfis(nome)').eq('questao_id',id).order('criado_em',{ascending:false}).limit(50))};render(1)},
async cmsend(){const t=$('#ct').value.trim();if(!t)return;await run(sb.from('comentarios').insert({questao_id:S.ids[S.i],user_id:U.id,texto:t}));toast('Comentário enviado');await A.cm()},
async rel(){const t=prompt('Descreva o problema nesta questão (enunciado, gabarito, anulada...)');if(!t)return;await run(sb.from('relatos').insert({questao_id:curId(),user_id:U.id,texto:t.slice(0,1000)}));toast('Obrigado! Relato enviado para revisão.')},
redo(){return begin(S.ids,S.title,S.from)},
rever(){return begin(S.ids.filter(i=>S.ans[i]&&S.ans[i]!=S.qs[i].gabarito),'Revisão de erros',S.from)},
async erros(){const ids=wrongIds();S={v:'erros',ids,l:ids.length?await run(sb.from('questoes').select('id,assunto_id,prova,enunciado').in('id',ids.slice(0,60))):[]};render()},
refazErros(){return begin(S.ids,'Caderno de erros','erros')},
um(a){return begin([a],'Caderno de erros','erros')},
async rank(){S={v:'rank',l:await run(sb.from('ranking').select('*'))};render()},
desemp(){S={v:'desemp'};render()},
async admin(){S={v:'admin',rel:await run(sb.from('relatos').select('id,questao_id,texto').order('criado_em',{ascending:false}).limit(30))};render()},
async addq(){const v=i=>$('#'+i).value.trim(),alts=['a','b','c','d'].map(x=>({id:x,letra:x.toUpperCase(),texto:v('ad_'+x)}));
 if(!v('ad_en')||alts.some(a=>!a.texto))return toast('Preencha o enunciado e as 4 alternativas');
 await run(sb.from('questoes').insert({id:'q-'+Date.now(),assunto_id:v('ad_as'),ano:+v('ad_ano')||null,prova:v('ad_pr'),dificuldade:v('ad_df'),enunciado:v('ad_en'),alternativas:alts,gabarito:v('ad_gb'),comentario:v('ad_co')||null}));
 toast('Questão salva');await carregar();render(1)},
async importar(){let l;try{l=JSON.parse($('#ad_json').value)}catch(e){return toast('JSON inválido')}if(!Array.isArray(l))return toast('Use uma lista [ ... ]');
 l=l.map((q,i)=>({id:'q-'+Date.now()+'-'+i,ativa:true,...q}));
 for(let i=0;i<l.length;i+=100)await run(sb.from('questoes').upsert(l.slice(i,i+100)));
 toast(l.length+' questões importadas');await carregar();render(1)},
async resolver(a){await run(sb.from('relatos').delete().eq('id',a));await A.admin()},
async signup(){const email=$('#em').value,password=$('#pw').value;if(!email||password.length<6)return toast('Informe e-mail e uma senha de 6+ caracteres');
 const{data,error}=await sb.auth.signUp({email,password,options:{data:{nome:$('#nm').value.trim()}}});if(error)return toast(error.message);if(!data.session)toast('Conta criada! Confirme seu e-mail para entrar.')},
logout(){return sb.auth.signOut()},
theme(){const t=document.documentElement.dataset.t=='dark'?'light':'dark';document.documentElement.dataset.t=t;try{localStorage.setItem('bq_t',t)}catch(e){}}
};
