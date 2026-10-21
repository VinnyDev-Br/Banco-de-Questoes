# Militares Questões

Plataforma web de banco de questões focada em concursos militares. Treine por matéria e assunto, veja o gabarito instantaneamente e acompanhe sua evolução em qualquer dispositivo.

---

## 🎯 Funcionalidades

- **Treino Inteligente:** Questões de Português, Matemática, Física e Inglês com filtros por assuntos, status e favoritos.
- **Feedback Imediato:** Confirmação de respostas com gabarito, comentários explicativos e cronômetro integrado por nível de dificuldade.
- **Acompanhamento de Desempenho:** Estatísticas detalhadas de taxa de acerto, tempo médio, sequência de estudos (*streak*) e caderno de erros automático.
- **Sincronização:** Sistema de autenticação que mantém seu progresso salvo e sincronizado entre celular e computador.
- **Painel Administrativo:** Interface dedicada para cadastro manual e importação de questões em lote.
- **Atalhos de Teclado:** Navegação rápida e seleção de alternativas para otimizar a rotina de estudos.

---

## 🛠️ Tecnologias

- **Frontend:** HTML5, CSS3 e JavaScript puro (sem etapa de build)
- **Backend & Banco de Dados:** [Supabase](https://supabase.com) (PostgreSQL, Autenticação e RLS)
- **Tipografia:** Google Fonts (Rajdhani, JetBrains Mono, Inter)

---

## 🚀 Como Executar

1. **Configuração do Supabase:**
   - Crie um projeto no Supabase e execute os scripts de criação da estrutura localizados na pasta `banco/`.

2. **Credenciais:**
   - Insira a URL e a chave pública (`anon key`) do seu projeto no arquivo `js/config.js`.

3. **Execução Local:**
   - Por ser uma aplicação estática, basta servir a pasta raiz com qualquer servidor local, por exemplo:
     ```bash
     npx serve .
     ```

4. **Acesso Admin:**
   - Para liberar o painel de administrador para seu e-mail, execute no *SQL Editor* do Supabase:
     ```sql
     update perfis set is_admin = true
     where id = (select id from auth.users where email = 'seu-email@exemplo.com');
     ```

---

## 📄 Autor

Desenvolvido por **Vinícius Macedo**.