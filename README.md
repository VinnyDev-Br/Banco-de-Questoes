# Banco de Questões

> Projeto pessoal em desenvolvimento.

Banco de questões de concursos criado por Vinicius Macedo (Macedo Concursos). A ideia é treinar por matéria e por assunto, ver o gabarito na hora e acompanhar a própria evolução, em qualquer aparelho.

## O que já existe

- Treino por matéria e assunto (Português, Matemática, Física e Inglês), com filtros de todas, não respondidas, erradas e favoritas
- Gabarito imediato, com comentário quando houver
- Caderno de erros: a questão errada vai para o caderno e sai quando é acertada de novo
- Desempenho por assunto e ranking com os candidatos que mais acertam
- Favoritas, comentários nas questões e relato de problemas
- Conta com login, e o progresso fica salvo e acompanha o aluno entre aparelhos
- Painel de administrador para cadastrar questões uma a uma ou importar várias de uma vez em JSON
- Visual escuro e estrelado, com página inicial e tela de abertura animada

## Tecnologias

- HTML, CSS e JavaScript puro, sem etapa de build
- Supabase para banco de dados (PostgreSQL), autenticação e permissões

## Organização

- `css/`: estilos da base, do tema, da página inicial e da abertura
- `js/`: telas, ações, estado e inicialização do app
- `banco/`: esquema do banco de dados e questões iniciais
- `img/`: logo

## Status

O projeto está em desenvolvimento: o banco de questões ainda está sendo montado e o visual e as funções mudam com frequência.

Ideias para as próximas versões:

- Ampliar o banco com mais provas anteriores
- Revisar assuntos e níveis de dificuldade das questões
- Permitir editar e excluir questões pelo painel de administrador

## Autor

Vinicius Macedo
