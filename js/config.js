// ESTE É O ARQUIVO PARA COLAR A URL E A CHAVE ANON DO SUPABASE (Project Settings → API)

const SUPABASE_URL='https://vecrrpuslriqhrmencpc.supabase.co', SUPABASE_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZlY3JycHVzbHJpcWhybWVuY3BjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIzNDQxODQsImV4cCI6MjEwNzkyMDE4NH0.lA9-WyIrcwcLoTeDvKPx2ei_Y80mrNfqqT7l3NO5NhE';

const CONFIG_MILITAR = {
  INSTITUICOES: [
    { id: 'ESPCEX', nome: 'EsPCEx - Escola Preparatória de Cadetes do Exército', cor: 'badge-espcex' },
    { id: 'EEAR', nome: 'EEAR - Escola de Especialistas da Aeronáutica', cor: 'badge-eear' },
    { id: 'AFA', nome: 'AFA - Academia da Força Aérea', cor: 'badge-afa' },
    { id: 'EFOMM', nome: 'EFOMM - Escola de Formação de Oficial da Marinha Mercante', cor: 'badge-efomm' },
    { id: 'ESA', nome: 'ESA - Escola de Sargentos das Armas', cor: 'badge-esa' }
  ],
  MATERIAS: [
    { id: 'Fisica', nome: 'Física', topicos: ['Vetores', 'Cinemática', 'Leis de Newton', 'Termodinâmica', 'Óptica', 'Eletromagnetismo'] },
    { id: 'Matematica', nome: 'Matemática', topicos: ['Álgebra', 'Geometria Plana', 'Trigonometria', 'Funções', 'Geometria Analítica'] },
    { id: 'Portugues', nome: 'Língua Portuguesa', topicos: ['Sintaxe', 'Gramática', 'Interpretação de Texto', 'Sintaxe de Regência'] },
    { id: 'Ingles', nome: 'Língua Inglesa', topicos: ['Grammar', 'Text Comprehension', 'Vocabulary'] }
  ]
};