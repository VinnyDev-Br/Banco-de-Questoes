# Militares Questões

> Projeto pessoal em desenvolvimento.

Banco de questões para concursos. A ideia é treinar por matéria e por assunto, ver o gabarito na hora e acompanhar a própria evolução, no celular ou no computador.

## Funcionalidades

**Treino**
- Matérias: Português, Matemática, Física e Inglês, cada uma dividida em assuntos
- Filtros por matéria e assunto: todas, não respondidas, erradas e favoritas
- Escolher a alternativa e **confirmar a resposta**, com gabarito imediato e comentário quando houver
- **Cronômetro por questão**: tempo restante conforme a dificuldade (2:00 fácil, 2:30 médio, 3:30 difícil); pausa ao trocar de aba e passa a contar em vermelho quando estoura
- Questão em destaque na tela inicial, escolhida a partir do último assunto praticado

**Acompanhamento**
- Taxa de acerto geral e por assunto ("domínio" de cada matéria)
- Respondidas, melhor tempo, tempo médio e **sequência de dias** estudando
- Caderno de erros: a questão errada vai para o caderno e sai quando é acertada de novo
- Questões salvas (favoritas) e ranking com os candidatos que mais acertam
- Missão atual com progresso geral (o nome é editável) e nível do cadete

**Plataforma**
- Painel em estilo "central de comando": barra lateral, barra superior e busca por matéria ou assunto
- Conta com login; o progresso fica salvo e acompanha o aluno entre aparelhos
- Comentários nas questões e relato de problemas
- Painel de administrador: cadastrar questões uma a uma ou importar várias em JSON
- Tela de abertura animada (terminal com chuva de código e radar) e página inicial pública
- Layout responsivo: no celular a barra lateral vira uma barra de ícones

**Atalhos de teclado**

| Tecla | Ação |
| --- | --- |
| `Ctrl` + `K` | Focar a busca |
| `1`–`5` ou `A`–`E` | Escolher a alternativa |
| `Enter` | Confirmar a resposta |
| `←` / `→` | Questão anterior / próxima (nas sessões de treino) |

## Tecnologias

- HTML, CSS e JavaScript puro, sem etapa de build
- [Supabase](https://supabase.com) para banco de dados (PostgreSQL), autenticação e permissões (RLS)
- Fontes: Rajdhani, JetBrains Mono e Inter (Google Fonts)

## Como rodar

1. **Crie um projeto no Supabase** e, no *SQL Editor*, cole e execute o conteúdo de `banco/supabase.sql`. Ele cria as tabelas, as permissões e as questões iniciais.
   - Se você já tinha o banco criado antes, rode também `banco/migracao-tempo.sql` para guardar o tempo das questões no banco. Sem isso, o site funciona igual, mas os tempos ficam salvos só no aparelho.
2. **Configure a conexão** em `js/config.js`, com a URL e a chave `anon` do projeto (*Project Settings → API*). A chave `anon` é pública por natureza; quem protege os dados são as regras de acesso (RLS) criadas pelo SQL.
3. **Abra o site**. Como é só HTML/CSS/JS, basta servir a pasta com qualquer servidor estático, por exemplo:

   ```bash
   npx serve .
   ```

4. **Crie sua conta** no site e torne-se administrador no SQL Editor (troque o e-mail):

   ```sql
   update perfis set is_admin = true
   where id = (select id from auth.users where email = 'SEU@EMAIL.COM');
   ```

### Cadastrar questões

No painel **Admin** há o formulário de nova questão e a importação em lote. O JSON é uma lista de objetos neste formato:

```json
[
  {
    "assunto_id": "trigonometria",
    "ano": 2024,
    "prova": "Prova 1/2024",
    "dificuldade": "medio",
    "enunciado": "Se sin(x) = 3/5 no primeiro quadrante, qual é o valor de cos(x)?",
    "alternativas": [
      { "id": "a", "letra": "A", "texto": "4/5" },
      { "id": "b", "letra": "B", "texto": "3/5" },
      { "id": "c", "letra": "C", "texto": "5/4" },
      { "id": "d", "letra": "D", "texto": "1/2" }
    ],
    "gabarito": "a",
    "comentario": "Pelo triângulo 3-4-5, cos(x) = 4/5."
  }
]
```

`dificuldade` aceita `facil`, `medio` ou `dificil`. Os valores de `assunto_id` são os ids da tabela `assuntos`.

### Publicar

Por ser estático, o site pode ser publicado de graça em serviços como GitHub Pages, Netlify ou Cloudflare Pages. Basta publicar a pasta do projeto.

## Organização

```
index.html        página única (abertura, barra lateral e área principal)
css/
  base.css        cores, layout, botões, cartões e questões
  tema.css        fontes, cabeçalho e animações
  landing.css     página inicial pública e visual tático das telas
  abertura.css    tela de abertura (terminal e radar)
  painel.css      barra lateral, busca, banco de questões e cartão de questão
js/
  config.js       URL e chave do Supabase
  estado.js       conexão, estado do app e carregamento de dados
  tempo.js        cronômetro, estatísticas, sequência e gravação da resposta
  icones.js       ícones, logo e cores das matérias
  telas.js        telas (HTML) e render()
  acoes.js        ações dos botões (data-do)
  painel.js       painel: banco, questão em destaque, visão geral, salvas e busca
  abertura.js     chuva de código da abertura
  main.js         eventos globais, atalhos e inicialização
banco/
  supabase.sql        esquema, permissões e questões iniciais
  migracao-tempo.sql  coluna de tempo por questão (bancos já existentes)
img/              logo (capacete militar verde, em SVG e PNG)
```

## Status

O projeto está em desenvolvimento: o banco de questões ainda está sendo montado e o visual e as funções mudam com frequência.

Ideias para as próximas versões:

- Ampliar o banco com mais provas anteriores
- Revisar assuntos e níveis de dificuldade das questões
- Permitir editar e excluir questões pelo painel de administrador

## Autor

Vinicius Macedo
