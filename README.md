==================================================
          SISTEMA DE CERTIFICADOS - DOCUMENTAÇÃO
==================================================

📌 DESCRIÇÃO GERAL:
Sistema completo para gerenciamento de eventos e emissão de certificados digitais.
Dividido em frontend (React) e backend (Node.js/Express) com banco SQLite.

🏗️ ARQUITETURA:
- Frontend: Aplicação React
- Backend: API RESTful Node.js/Express
- Banco de Dados: SQLite
- Comunicação: HTTP/JSON

📁 ESTRUTURA DE PASTAS:

SISTEMA_CERTIFICADO/
├── 📁 back/                          # Backend Node.js
│   ├── 📁 node_modules/              # Dependências do backend
│   ├── 📄 server.js                  # Arquivo principal do backend
│   ├── 📄 package.json               # Dependências e scripts do backend
│   ├── 📄 package-lock.json          # Lock das dependências
│   ├── 📄 database.sqlite            # Banco de dados (NÃO VERSIONAR)
│   ├── 📄 .gitignore                 # Arquivos ignorados pelo Git
│   └── 📁 routes/                    # Rotas da API (opcional)
│
└── 📁 front/                         # Frontend React
    ├── 📁 node_modules/              # Dependências do frontend
    ├── 📁 public/                    # Arquivos públicos (HTML, imagens)
    ├── 📁 src/                       # Código-fonte React
    ├── 📄 package.json               # Dependências e scripts do frontend
    ├── 📄 package-lock.json          # Lock das dependências
    ├── 📄 README.md                  # Documentação
    └── 📄 .gitignore                 # Arquivos ignorados pelo Git

🛠️ TECNOLOGIAS UTILIZADAS:

BACKEND:
- Node.js
- Express.js
- SQLite3
- CORS
- Body Parser

FRONTEND:
- React
- HTML5/CSS3/JavaScript
- Axios (para requisições HTTP)

📊 BANCO DE DADOS:

TABELA: eventos
- id (INTEGER, PRIMARY KEY)
- nome (TEXT)
- datas (TEXT)
- carga_horaria (INTEGER)
- dias (INTEGER)
- conteudo (TEXT)
- created_at (DATETIME)

TABELA: participantes
- id (INTEGER, PRIMARY KEY)
- evento_id (INTEGER, FOREIGN KEY)
- nome (TEXT)
- cpf (TEXT)
- email (TEXT)
- frequencia (TEXT - array JSON)
- created_at (DATETIME)

🔌 ENDPOINTS DA API (BACKEND):

GET    /api/health              # Health check
GET    /api/eventos             # Listar eventos
POST   /api/eventos             # Criar evento
DELETE /api/eventos/:id         # Excluir evento

GET    /api/participantes       # Listar participantes
POST   /api/participantes       # Criar participante
PUT    /api/participantes/:id/frequencia  # Atualizar frequência
DELETE /api/participantes/:id   # Excluir participante

GET    /                        # Informações da API

🚀 COMANDOS PARA EXECUTAR:

BACKEND:
cd back
npm start
Servidor roda em: http://localhost:5000

FRONTEND:
cd front
npm start
Aplicação roda em: http://localhost:3000

📦 DEPENDÊNCIAS PRINCIPAIS:

BACKEND (package.json):
- "express": "^4.18.0"
- "sqlite3": "^5.1.0"
- "cors": "^2.8.5"

FRONTEND (package.json):
- Dependências React típicas
- Axios para chamadas API

🔧 FUNCIONALIDADES:

1. Cadastro de eventos com carga horária e datas
2. Cadastro de participantes vinculados a eventos
3. Controle de frequência dos participantes
4. Geração de certificados (a implementar)
5. Interface web responsiva

🎯 STATUS ATUAL:
✅ Backend funcionando com todas as rotas
✅ Frontend básico funcionando
✅ Integração frontend/backend
✅ Banco de dados operacional
✅ Estrutura organizada
🔄 Sistema de certificados (em desenvolvimento)

📝 PRÓXIMAS MELHORIAS:
- Implementar geração de certificados PDF
- Adicionar autenticação de usuários
- Melhorar interface do frontend
- Adicionar validações mais robustas
- Implementar upload de logos para certificados

🔒 CONFIGURAÇÕES IMPORTANTES:
- Backend na porta 5000
- Frontend na porta 3000
- CORS configurado para comunicação entre portas
- Banco SQLite com relações entre eventos/participantes

📋 NOTAS DE DESENVOLVIMENTO:
- Projeto em fase de desenvolvimento
- Estrutura modular planejada (controllers, models, middlewares)
- Versionamento Git configurado
- Pronto para deploy em servidor

👨‍💻 COMANDOS GIT CONFIGURADOS:
git init
git add .
git commit -m "mensagem"
git checkout -b feature/nova-funcionalidade

⚠️ ARQUIVOS IGNORADOS PELO GIT:
- node_modules/
- *.sqlite
- .env
- arquivos de log e temporários

- 

==================================================
         FIM DA DOCUMENTAÇÃO
==================================================


