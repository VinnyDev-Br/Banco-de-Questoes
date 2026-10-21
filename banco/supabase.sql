-- Banco de Questões · esquema Supabase
-- Cole tudo no SQL Editor do Supabase e clique em Run.

create table materias(id text primary key, nome text not null, ordem int default 0);
create table assuntos(id text primary key, materia_id text not null references materias(id) on delete cascade, nome text not null);
create table questoes(id text primary key, assunto_id text not null references assuntos(id), ano int, prova text,
  dificuldade text default 'medio', enunciado text not null, alternativas jsonb not null, gabarito text not null,
  comentario text, ativa boolean default true, criada_em timestamptz default now());
create table perfis(id uuid primary key references auth.users(id) on delete cascade, nome text not null default 'Aluno', is_admin boolean not null default false);
create table respostas(user_id uuid not null default auth.uid() references perfis(id) on delete cascade,
  questao_id text not null references questoes(id) on delete cascade, alt text not null, ok boolean not null,
  criada_em timestamptz default now(), tempo_s int check(tempo_s between 0 and 3600), primary key(user_id, questao_id));
create table favoritos(user_id uuid not null default auth.uid() references perfis(id) on delete cascade,
  questao_id text not null references questoes(id) on delete cascade, primary key(user_id, questao_id));
create table comentarios(id bigint generated always as identity primary key, questao_id text not null references questoes(id) on delete cascade,
  user_id uuid not null default auth.uid() references perfis(id) on delete cascade,
  texto text not null check(char_length(texto) between 1 and 1000), criado_em timestamptz default now());
create table relatos(id bigint generated always as identity primary key, questao_id text not null references questoes(id) on delete cascade,
  user_id uuid not null default auth.uid() references perfis(id) on delete cascade,
  texto text not null check(char_length(texto) between 1 and 1000), criado_em timestamptz default now());

create function novo_perfil() returns trigger language plpgsql security definer set search_path=public as $$
begin insert into perfis(id,nome) values(new.id, coalesce(nullif(new.raw_user_meta_data->>'nome',''), split_part(new.email,'@',1))); return new; end $$;
create trigger ao_criar_usuario after insert on auth.users for each row execute function novo_perfil();

create function is_admin() returns boolean language sql security definer stable set search_path=public as $$
select coalesce((select p.is_admin from perfis p where p.id = auth.uid()), false) $$;

create view contagem as select assunto_id, count(*) n from questoes where ativa group by assunto_id;
create view meu_progresso with (security_invoker=true) as
  select q.assunto_id, count(*) respondidas, count(*) filter (where r.ok) acertos
  from respostas r join questoes q on q.id = r.questao_id where r.user_id = auth.uid() group by q.assunto_id;
create view ranking as
  select p.nome, count(*) filter (where r.ok) acertos, count(*) respondidas
  from respostas r join perfis p on p.id = r.user_id group by p.id, p.nome order by acertos desc, respondidas asc limit 50;

alter table materias enable row level security; alter table assuntos enable row level security;
alter table questoes enable row level security; alter table perfis enable row level security;
alter table respostas enable row level security; alter table favoritos enable row level security;
alter table comentarios enable row level security; alter table relatos enable row level security;

create policy leitura on materias for select using(true);
create policy leitura on assuntos for select using(true);
create policy leitura on questoes for select using(ativa or is_admin());
create policy admin_escreve on materias for all using(is_admin()) with check(is_admin());
create policy admin_escreve on assuntos for all using(is_admin()) with check(is_admin());
create policy admin_escreve on questoes for all using(is_admin()) with check(is_admin());
create policy ver on perfis for select using(true);
create policy editar_meu on perfis for update using(id = auth.uid());
revoke update on perfis from anon, authenticated;
grant update(nome) on perfis to authenticated;
create policy minhas on respostas for all using(user_id = auth.uid()) with check(user_id = auth.uid());
create policy meus on favoritos for all using(user_id = auth.uid()) with check(user_id = auth.uid());
create policy ler on comentarios for select using(true);
create policy criar on comentarios for insert with check(user_id = auth.uid());
create policy apagar on comentarios for delete using(user_id = auth.uid() or is_admin());
create policy criar on relatos for insert with check(user_id = auth.uid());
create policy ver on relatos for select using(user_id = auth.uid() or is_admin());
create policy resolver on relatos for delete using(is_admin());
grant select on contagem, ranking to anon, authenticated;
grant select on meu_progresso to authenticated;

-- Depois de criar sua conta no site, torne-se administrador (troque o e-mail):
-- update perfis set is_admin = true where id = (select id from auth.users where email = 'SEU@EMAIL.COM');

-- ===== Conteúdo inicial (matérias, assuntos e questões do protótipo) =====

insert into materias(id,nome,ordem) values
('portugues','Língua Portuguesa',0),
('matematica','Matemática',1),
('fisica','Física',2),
('ingles','Língua Inglesa',3);
insert into assuntos(id,materia_id,nome) values
('fonetica','portugues','Fonética e Fonologia'),
('morfologia','portugues','Morfologia'),
('sintaxe','portugues','Sintaxe'),
('pontuacao','portugues','Pontuação'),
('ortografia','portugues','Ortografia e Acentuação'),
('trigonometria','matematica','Trigonometria'),
('geometria_plana','matematica','Geometria Plana'),
('geometria_espacial','matematica','Geometria Espacial'),
('funcoes','matematica','Conjuntos e Funções'),
('probabilidade','matematica','Análise Combinatória'),
('cinematica','fisica','Cinemática'),
('dinamica','fisica','Dinâmica & Leis de Newton'),
('eletricidade','fisica','Eletricidade e Magnetismo'),
('optica','fisica','Óptica Geométrica'),
('termologia','fisica','Termologia'),
('verb_tenses','ingles','Grammar & Verb Tenses'),
('vocabulario','ingles','Vocabulary & Reading'),
('modals','ingles','Modal Verbs'),
('pronouns','ingles','Pronouns & Prepositions');
insert into questoes(id,assunto_id,ano,prova,dificuldade,enunciado,alternativas,gabarito,comentario) values
('por-fon-1','fonetica',2024,'Prova 1/2024','facil','Assinale a alternativa que apresenta uma palavra com ditongo decrescente e outra com tritongo, respectivamente:','[{"id":"a","letra":"A","texto":"Pai, iguais"},{"id":"b","letra":"B","texto":"Saguão, muito"},{"id":"c","letra":"C","texto":"Heroico, cooperação"},{"id":"d","letra":"D","texto":"Língua, quão"}]'::jsonb,'a','Em "Pai", temos a vogal (a) + semivogal (i) formando ditongo decrescente. Em "iguais", temos semivogal (u) + vogal (a) + semivogal (i) na mesma sílaba (tritongo).'),
('por-fon-2','fonetica',2023,'Prova 2/2023','medio','Assinale a opção em que todas as palavras possuem dígrafo:','[{"id":"a","letra":"A","texto":"Chave, gaita, bloco"},{"id":"b","letra":"B","texto":"Nascimento, quilo, folha"},{"id":"c","letra":"C","texto":"Guerra, pedra, ritmo"},{"id":"d","letra":"D","texto":"Crescer, exato, drama"}]'::jsonb,'b','Nascimento (sc = dígrafo), Quilo (qu = dígrafo antes de i), Folha (lh = dígrafo). Ambas representam um único fonema.'),
('por-mor-1','morfologia',2023,'Prova 1/2023','facil','Na frase "O militar agiu corajosamente diante do perigo", a palavra destacada classifica-se como:','[{"id":"a","letra":"A","texto":"Adjetivo qualificativo"},{"id":"b","letra":"B","texto":"Advérbio de modo"},{"id":"c","letra":"C","texto":"Substantivo abstrato"},{"id":"d","letra":"D","texto":"Pronome demonstrativo"}]'::jsonb,'b','"Corajosamente" modifica o verbo "agiu", indicando o modo como a ação foi executada.'),
('mat-tri-1','trigonometria',2024,'Prova 1/2024','medio','Se sin(x) = 3/5 com x no primeiro quadrante (0 < x < π/2), qual é o valor exato de cos(x)?','[{"id":"a","letra":"A","texto":"4/5"},{"id":"b","letra":"B","texto":"2/5"},{"id":"c","letra":"C","texto":"1/2"},{"id":"d","letra":"D","texto":"3/4"}]'::jsonb,'a','Pela Relação Fundamental da Trigonometria: sin²(x) + cos²(x) = 1 ⇒ (3/5)² + cos²(x) = 1 ⇒ 9/25 + cos²(x) = 1 ⇒ cos²(x) = 16/25 ⇒ cos(x) = 4/5.'),
('mat-geo-1','geometria_plana',2023,'Prova 2/2023','facil','Um triângulo equilátero possui lado de medida l = 6 cm. A área desse triângulo é igual a:','[{"id":"a","letra":"A","texto":"9√3 cm²"},{"id":"b","letra":"B","texto":"18√3 cm²"},{"id":"c","letra":"C","texto":"36√3 cm²"},{"id":"d","letra":"D","texto":"12 cm²"}]'::jsonb,'a','A área do triângulo equilátero é A = (l²√3)/4 = (6²√3)/4 = 36√3 / 4 = 9√3 cm².'),
('fis-cin-1','cinematica',2024,'Prova 1/2024','medio','Uma aeronave militar parte do repouso (v₀ = 0) com aceleração constante de a = 4 m/s². Qual será sua velocidade após percorrer uma pista de 800 metros?','[{"id":"a","letra":"A","texto":"80 m/s"},{"id":"b","letra":"B","texto":"100 m/s"},{"id":"c","letra":"C","texto":"64 m/s"},{"id":"d","letra":"D","texto":"40 m/s"}]'::jsonb,'a','Equação de Torricelli: v² = v₀² + 2aΔs ⇒ v² = 0 + 2(4)(800) = 6400 ⇒ v = √6400 = 80 m/s.'),
('fis-ele-1','eletricidade',2023,'Prova 1/2023','facil','Um resistor de resistência R = 10 Ω é submetido a uma d.d.p de U = 120 V. A corrente elétrica que atravessa o resistor é de:','[{"id":"a","letra":"A","texto":"12 A"},{"id":"b","letra":"B","texto":"1200 A"},{"id":"c","letra":"C","texto":"0,083 A"},{"id":"d","letra":"D","texto":"10 A"}]'::jsonb,'a','1ª Lei de Ohm: U = R · I ⇒ 120 = 10 · I ⇒ I = 12 A.'),
('ing-ver-1','verb_tenses',2024,'Prova 1/2024','medio','Choose the correct verb form to complete the sentence:

"The air traffic controllers __________ the radar system since 06:00 AM without any technical failures."','[{"id":"a","letra":"A","texto":"have been monitoring"},{"id":"b","letra":"B","texto":"monitored"},{"id":"c","letra":"C","texto":"will monitor"},{"id":"d","letra":"D","texto":"monitored had"}]'::jsonb,'a','O uso de "since 06:00 AM" indica ação iniciada no passado e contínua no presente, exigindo o Present Perfect Continuous ("have been monitoring").'),
('ing-voc-1','vocabulario',2023,'Prova 2/2023','facil','In aviation terminology, the word "Altimeter" refers to an instrument used to measure:','[{"id":"a","letra":"A","texto":"Altitude above a fixed level"},{"id":"b","letra":"B","texto":"Wind speed and direction"},{"id":"c","letra":"C","texto":"Fuel consumption rate"},{"id":"d","letra":"D","texto":"Engine temperature"}]'::jsonb,'a','An altimeter is an aircraft instrument that measures altitude above sea level or ground level.');
