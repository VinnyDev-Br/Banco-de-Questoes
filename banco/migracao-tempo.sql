-- Guarda o tempo (em segundos) gasto em cada questão, para o melhor tempo e o tempo médio
-- acompanharem você entre aparelhos. Cole no SQL Editor do Supabase e clique em Run.
-- (Sem isso o site funciona igual, guardando os tempos só neste aparelho.)

alter table respostas add column if not exists tempo_s int check (tempo_s between 0 and 3600);
