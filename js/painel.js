// Painel: central de comando (banco de questões, questão em destaque, visão geral, salvas, busca)
const ls=k=>{try{return localStorage.getItem(k)}catch(e){return null}};
const MN=aid=>MT.find(m=>m.assuntos.some(a=>a.id==aid));
const curId=()=>S.v=='home'?FQ?.id:S.ids?.[S.i];
const n2=n=>(+n||0).toLocaleString('pt-BR');
const norm=s=>String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();

// barra lateral e superior: contadores, sequência, missão, usuário
function chrome(){const s=ST(),sq=streak(),n=PF?.nome||'',ini=n.split(/\s+/).filter(Boolean).map(x=>x[0]).slice(0,2).join('').toUpperCase()||'?',pr=s.total?Math.round(s.n/s.total*100):0,er=wrongIds().length;
 const t=(q,v)=>document.querySelectorAll(q).forEach(e=>e.textContent=v);
 t('#nerr',er||'');t('#nbanco',s.total>999?(s.total/1000).toFixed(1).replace('.0','')+'K':s.total||'');t('#seq',sq+(sq==1?' dia':' dias'));
 t('#mnome',ls('bq_missao')||'Concurso militar');t('#mpct',pr+'%');$('#mbar').style.width=pr+'%';
 t('#usrn',n);t('#usrl','Cadete · Nível '+(Math.floor(s.c/10)+1));t('.avt',ini);t('#nivel','Nível de acesso: '+(PF?.is_admin?'ADMIN':'ALUNO'));$('#bdot').hidden=!er}
function navMark(){document.querySelectorAll('.sn').forEach(b=>b.classList.toggle('on',(b.dataset.v||'').split(' ').includes(S.v)))}

const KP=(l,v,i)=>`<div class="kp"><span class="pi">${svg(P[i],20)}</span><div><p class="lab">${l}</p><b>${v}</b></div></div>`;
const KPS=()=>{const s=ST(),q=streak();return`<div class="kps">${KP('RESPONDIDAS',n2(s.n),'target')}${KP('TAXA DE ACERTO',s.n?s.pct+'%':'—','chart')}${KP('TEMPO MÉDIO',s.med?fmt(s.med):'—','clock')}${KP('MELHOR TEMPO',s.best?fmt(s.best):'—','clock')}${KP('SEQUÊNCIA',q+(q==1?' dia':' dias'),'alert')}</div>`};

// painel "Dados da missão": tempo da questão, taxa de acerto geral, respondidas e melhor tempo
const PAN=(q,fin)=>{const s=ST(),lim=TL[q.dificuldade]||150,rest=lim-(TIMER.id==q.id?elapsed():0);
return`<aside class="qp"><p class="lab">DADOS DA MISSÃO</p><div class="pr"><span class="pi">${svg(P.clock,20)}</span><div><p class="lab">${fin?'TEMPO GASTO':'TEMPO RESTANTE'}</p>${fin?`<b class="tv">${fmt(TM[q.id]||0)}</b>`:`<b class="tv" id="tmr">${fmt(rest)}</b>`}</div></div>${fin?'':'<div class="tb" id="tbar"><i></i></div>'}<div class="pr"><span class="ring" style="--p:${s.pct}"><b>${s.pct}</b></span><div><p class="lab">TAXA DE ACERTO</p><b class="tv sm">${s.n?'Geral · '+s.pct+'%':'Sem respostas'}</b></div></div><hr class="hr"><div class="kv"><span>RESPONDIDAS</span><b>${n2(s.n)}</b></div><div class="kv"><span>SEU MELHOR TEMPO</span><b>${s.best?fmt(s.best):'—'}</b></div><button class="rp" data-do="rel">${svg(P.shield,14)}Relatar problema</button></aside>`};

// cartão da questão (usado na home e nas sessões): escolher, confirmar, gabarito e tempo
const QC=(q,ans,sel,nx)=>{const fin=!!ans,m=MN(q.assunto_id),ok=ans==q.gabarito;
return`<article class="qc"><div class="qb"><div class="meta"><span class="tag" style="--c:${COR[m?.id]||'#4ade80'}">${esc(m?.nome||'')}</span><span>${esc(q.prova||'')}${q.ano?' · '+q.ano:''}</span><span class="lv ${esc(q.dificuldade)}">${DIF[q.dificuldade]||''}</span></div><h3>${esc(AN(q.assunto_id))}</h3><p class="enun">${esc(q.enunciado)}</p>`
+q.alternativas.map(x=>{const c=fin?(x.id==q.gabarito?' ok':x.id==ans?' no':''):(x.id==sel?' sel':'');return`<button class="alt${c}" data-do="alt" data-arg="${x.id}" ${fin?'disabled':''}><b>${x.letra}</b><span>${esc(x.texto)}</span>${c==' ok'?svg(P.check,18):c==' no'?svg(P.x,18):''}</button>`}).join('')
+(fin?`<div class="fb ${ok?'ok':'no'}" role="status"><b>${ok?'Correto!':'Incorreto.'}</b> Resposta correta: alternativa ${L(q)}. Tempo: ${fmt(TM[q.id]||0)}.${q.comentario?'<br>'+esc(q.comentario):''}</div>`:'')
+`<div class="qa"><button class="sv ${FV[q.id]?'on':''}" data-do="fav" aria-pressed="${!!FV[q.id]}">${svg(P.bookmark,16)}Salvar questão</button>`
+(fin?`<button class="cf" data-do="${nx[0]}">${nx[1]} →</button>`:`<button class="cf" data-do="confirm" ${sel?'':'disabled'}>Confirmar resposta →</button>`)+`</div></div>${PAN(q,fin)}</article>`};

// escolhe a questão em destaque: nova, preferindo o assunto da última resposta
async function pickFq(){const ids=await run(sb.from('questoes').select('id,assunto_id').eq('ativa',true).order('id').limit(1000));
 const last=Object.entries(RD).sort((a,b)=>a[1]<b[1]?1:-1)[0],la=last&&ids.find(x=>x.id==last[0])?.assunto_id,
 nova=ids.filter(x=>!(x.id in R)),p=nova.find(x=>x.assunto_id==la)||nova[0]||ids.find(x=>R[x.id]===false)||ids[0];
 return p?await run(sb.from('questoes').select('*').eq('id',p.id).single()):null}

Object.assign(V,{
home(){const s=ST(),tot=s.total;
 const cards=MT.map((m,i)=>{const t=st(m.assuntos);return`<button class="mc" style="--c:${COR[m.id]||'#4ade80'}" data-do="mat" data-arg="${m.id}" ${t.n?'':'disabled'}><span class="cd">${m.id.slice(0,3).toUpperCase()}-0${i+1}</span><span class="ico">${svg(P[m.id]||P.book,22)}</span><h2>${esc(m.nome)}</h2><span class="mu sm">${n2(t.n)} ${t.n==1?"questão":"questões"}</span><div class="dm"><span>DOMÍNIO</span><b>${t.r?t.pct+'%':'—'}</b></div><div class="bar"><i style="width:${t.pct}%"></i></div><span class="go">${t.n?'ACESSAR SETOR →':'EM BREVE'}</span></button>`}).join('');
 return`<div class="pg"><p class="crumb">COMANDO &nbsp;/&nbsp; <b>BANCO DE QUESTÕES</b></p><div class="ph"><div><p class="tag2">CENTRAL DE TREINAMENTO</p><h1>Banco de <em>Questões</em></h1><p class="mu">Escolha uma área de conhecimento e avance na sua preparação para a missão.</p></div><div class="avl"><span class="pi">${svg(P.target,22)}</span><div><p class="lab">QUESTÕES DISPONÍVEIS</p><b>${n2(tot)}</b></div><u class="live">AO VIVO</u></div></div>
<div class="sh"><span class="nb2">01</span><div><b>SELECIONE A MATÉRIA</b><small>Áreas operacionais disponíveis</small></div><span class="lab">${String(MT.length).padStart(2,'0')} SETORES</span></div><div class="mg">${cards}</div>
<div class="sh"><span class="nb2">02</span><div><b>QUESTÃO EM DESTAQUE</b><small>Baseada no seu último treinamento</small></div><span class="lab">QUESTÃO ${n2(Math.min(s.n+(FA?0:1),tot))} / ${n2(tot)}<span class="mb"><i style="width:${tot?s.n/tot*100:0}%"></i></span></span></div>
${FQ?QC(FQ,FA,S.sel,['nextFq','Próxima questão']):'<div class="empty">Nenhuma questão disponível ainda.</div>'}</div>`},
visao(){return`<div class="pg"><p class="crumb">COMANDO &nbsp;/&nbsp; <b>VISÃO GERAL</b></p><p class="tag2">PAINEL DO CADETE</p><h1>Olá, <em>${esc(PF.nome)}</em></h1><p class="mu">Seu resumo de treinamento.</p>${KPS()}<h2 style="margin:26px 0 10px">Domínio por matéria</h2>${MT.map(m=>{const s=st(m.assuntos);return`<div class="row"><div>${esc(m.nome)}<div class="mu sm">${n2(s.n)} questões · ${n2(s.r)} respondidas</div><div class="bar" style="--c:${COR[m.id]||'#4ade80'}"><i style="width:${s.prog}%"></i></div></div><span class="pc">${s.r?s.pct+'%':'—'}</span></div>`}).join('')}<div class="nav" style="justify-content:flex-start"><button class="btn" data-do="home">Ir para o banco de questões</button></div></div>`},
salvas(){return`<div class="pg"><p class="crumb">COMANDO &nbsp;/&nbsp; <b>QUESTÕES SALVAS</b></p><h1>Questões <em>salvas</em></h1><p class="mu">Questões que você marcou para rever.</p>${S.l.length?`<div class="nav" style="justify-content:flex-start"><button class="btn" data-do="refazSalvas">Praticar todas (${S.ids.length})</button></div>`+S.l.map(q=>`<div class="row"><div><div class="mu sm">${esc(AN(q.assunto_id))} · ${esc(q.prova||'')}</div><div>${esc(q.enunciado.length>140?q.enunciado.slice(0,140)+'…':q.enunciado)}</div></div><button class="btn g" data-do="um2" data-arg="${esc(q.id)}">Praticar</button></div>`).join(''):'<div class="empty">Nenhuma questão salva. Use "Salvar questão" enquanto treina.</div>'}</div>`},
sessao(){const id=S.ids[S.i],q=S.qs[id],a=S.ans[id],n=S.ids.length,done=Object.keys(S.ans).length,b=Math.floor(S.i/PAGE)*PAGE;
 if(!q)return'<div class="empty">Carregando…</div>';
 const cm=S.cm&&S.cm.id==id?`<div class="cm"><b>Comentários</b>${S.cm.l.map(c=>`<p class="sm"><b>${esc(c.perfis?.nome||'Aluno')}</b>: ${esc(c.texto)}</p>`).join('')||'<p class="mu sm">Seja o primeiro a comentar.</p>'}<textarea id="ct" placeholder="Escreva um comentário" maxlength="1000"></textarea><div class="nav"><button class="btn" data-do="cmsend">Enviar</button></div></div>`:'';
 return`<div class="meta"><button class="lk" data-do="sair">← Sair</button><span class="lab" style="margin-left:auto">${esc(S.title||'')} · QUESTÃO ${S.i+1} / ${n} · ${done} RESPONDIDAS</span></div><div class="bar fly"><i style="width:${done/n*100}%"></i></div>
${QC(q,a,S.sel,S.i<n-1?['next','Próxima questão']:['fin','Finalizar'])}
<div class="meta" style="margin:12px 0 0"><button class="lk" data-do="cm">Comentários</button></div>${cm}
<div class="nav"><button class="btn g" data-do="prev" ${S.i?'':'disabled'}>← Anterior</button>${S.i<n-1?`<button class="btn g" data-do="next">Pular →</button>`:`<button class="btn" data-do="fin">Finalizar</button>`}</div>
<div class="grid" role="group" aria-label="Questões">${S.ids.slice(b,b+PAGE).map((x,j)=>{const r=S.ans[x],g=S.qs[x]?.gabarito;return`<button class="gn ${b+j==S.i?'cur':''} ${r?(r==g?'ok':'no'):''}" data-do="go" data-arg="${b+j}" aria-label="Questão ${b+j+1}, ${r?(r==g?'correta':'errada'):'pendente'}">${b+j+1}</button>`}).join('')}</div>`}
});

Object.assign(A,{
async home(){if(!U){S={v:'landing'};return render()}S={v:'home'};if(FA){FQ=null;FA=null}if(!FQ)FQ=await pickFq();render()},
visao(){S={v:'visao'};render()},
async nextFq(){FQ=await pickFq();FA=null;S.sel=null;render(1)},
alt(a){const h=S.v=='home',id=curId();if(!id||(h?FA:S.ans[id]))return;S.sel=a;render(1)},
async confirm(){const h=S.v=='home',q=h?FQ:S.qs[S.ids[S.i]],a=S.sel;if(!q||!a||(h?FA:S.ans[q.id]))return;
 const t=tstop(),p=gravar(q,a,a==q.gabarito,t);if(h)FA=a;else S.ans[q.id]=a;S.sel=null;render(1);await p},
async salvas(){const ids=Object.keys(FV);S={v:'salvas',ids,l:ids.length?await run(sb.from('questoes').select('id,assunto_id,prova,enunciado').in('id',ids.slice(0,60))):[]};render()},
refazSalvas(){return begin(S.ids,'Questões salvas','salvas')},
um2(a){return begin([a],'Questões salvas','salvas')},
busca(a){const[k,id]=a.split(':');$('#res').hidden=true;$('#busca').value='';
 if(k=='m'){S={v:'mat',m:id,f:'todas'};return render()}S={v:'mat',m:MN(id).id,f:'todas'};return A.start(id)},
missao(){const v=prompt('Nome da sua missão (ex.: concurso e ano)',ls('bq_missao')||'');if(v==null)return;try{localStorage.setItem('bq_missao',v.trim().slice(0,30))}catch(e){}chrome()}
});

// busca por matéria ou assunto
document.addEventListener('input',e=>{if(e.target.id!='busca')return;const q=norm(e.target.value.trim()),r=$('#res');if(!q){r.hidden=true;return}
 const L=[];MT.forEach(m=>{if(norm(m.nome).includes(q))L.push(['m:'+m.id,m.nome,'Matéria']);m.assuntos.forEach(a=>{if(norm(a.nome).includes(q))L.push(['a:'+a.id,a.nome,m.nome])})});
 r.innerHTML=L.slice(0,8).map(([k,t,s])=>`<button data-do="busca" data-arg="${esc(k)}"><b>${esc(t)}</b><small>${esc(s)}</small></button>`).join('')||'<p class="mu sm">Nada encontrado</p>';r.hidden=false});
document.addEventListener('click',e=>{if(!e.target.closest('.srch'))$('#res').hidden=true},true);
