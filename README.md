# Banco de Questões EEAr

Site de questões para o CFS da EEAr. Front-end em HTML/CSS/JS puro (sem build) + Supabase (banco, login e permissões).

## Estrutura

| Arquivo | Para que serve |
| --- | --- |
| index.html | Esqueleto da página: cabeçalho, tela de abertura e carregamento dos arquivos |
| css/base.css | Cores, tema claro/escuro, layout, botões, cartões e tela de questão |
| css/tema-eear.css | Identidade visual: fontes, avião da home, animações e home |
| css/abertura.css | Tela de abertura: estrelas, caça, Terra no horizonte e boas-vindas |
| js/abertura.js | Efeito das estrelas da abertura (canvas) |
| css/landing.css | Página inicial pública (antes do login): fundo estrelado, hero, seções |
| js/config.js | **URL e chave anon do Supabase** (único arquivo com dados do seu projeto) |
| js/icones.js | Ícones SVG, logo, cores das matérias |
| js/estado.js | Conexão com o Supabase, estado do app e carregamento de dados |
| js/telas.js | HTML de cada tela (home, matéria, sessão, ranking, admin...) |
| js/acoes.js | O que cada botão faz (responder, favoritar, comentar, importar...) |
| js/main.js | Eventos globais, atalhos de teclado, tema e inicialização |
| banco/supabase.sql | Tabelas, permissões e questões iniciais (rodar no SQL Editor do Supabase) |
| img/ | Coloque aqui o brasão: logo-eear.png |

A ordem dos scripts no index.html importa: config → icones → estado → telas → acoes → main. Os arquivos compartilham as mesmas variáveis, então não use import/export.

## Como testar
Abra o index.html no navegador e atualize (F5) após cada alteração.

## Como publicar (Netlify)
Arraste a **pasta inteira** na aba Deploys do seu site. Depois do deploy, se o navegador mostrar a versão antiga, force a atualização com Ctrl+Shift+R.

## Onde mexer
- Cores e tema: css/base.css (variáveis no topo)
- Abertura, avião e animações: css/tema-eear.css
- Textos e layout das telas: js/telas.js
- Mensagem da abertura: index.html (class="ab-t" e "ab-s")
