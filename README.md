# 💪 PH TEAM - Platform de Gestão de Fitness e Consultoria

**Uma plataforma completa de gerenciamento de fitness que conecta clientes com consultores especializados, oferecendo acompanhamento de progresso, planos de treino personalizados e análise de evolução em tempo real.**

---

## 🎯 Visão Geral

PH TEAM é uma aplicação web moderna desenvolvida em **React + TypeScript** que permite:

- 👥 **Clientes** controlarem seu progresso fitness, acompanharem treinos e se comunicarem com consultores
- 🏋️ **Consultores** gerenciarem múltiplos clientes, avaliações, prescrições de treino e análise de dados
- 📊 **Análise de Dados** com gráficos interativos, evolução de peso, medidas corporais e tendências

---

## ✨ Principais Características

### Para Clientes
- 🎯 **Dashboard Personalizada** - Visão geral de metas, progresso e objetivos
- 📈 **Minha Evolução** - Histórico de peso, medidas e análise detalhada com gráficos
- 💪 **Planos de Treino** - Acesso a treinos personalizados com base no objetivo
- 🔗 **Comunicação com Consultor** - Chat direto via WhatsApp
- ⚙️ **Configurações** - Gerenciamento de perfil e preferências

### Para Consultores
- 📋 **Painel de Controle** - Gerenciamento de clientes e avaliações
- 📊 **Histórico de Avaliações** - Rastreamento completo de métricas dos clientes
- 🎯 **Objetivos Definidos** - Categorização: Emagrecimento, Hipertrofia, Recondicionamento, Saúde Geral
- 📁 **Banco de Exercícios** - Biblioteca completa de exercícios disponíveis

### Recursos Gerais
- 🔐 **Autenticação JWT** - Login seguro com controle de acesso por roles
- 📱 **Design Responsivo** - Funciona perfeitamente em desktop, tablet e mobile
- 🎨 **Interface Moderna** - UI/UX profissional com temas consistentes
- 🚀 **Integração com Backend** - API RESTful em Spring Boot

---

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── common/              # Componentes compartilhados
│   │   ├── Header/
│   │   ├── Footer/
│   │   └── SuccessModal/
│   ├── layouts/             # Layouts específicos
│   │   ├── ClientLayout/
│   │   └── ConsultantLayout/
│   ├── sidebars/            # Navegação lateral
│   │   ├── ClientSidebar.jsx
│   │   └── ConsultantSidebar.jsx
│   └── Feedback/            # Componentes de feedback
│
├── pages/
│   ├── Home/                # Página inicial pública
│   ├── Login/               # Autenticação
│   ├── Cadastro/            # Registro de usuários
│   ├── ClienteDashboard/    # Dashboard do cliente
│   ├── ConsultantDashboard/ # Dashboard do consultor
│   ├── Progresso/           # Evolução e análise
│   ├── TrainingCreator/     # Criador de treinos
│   ├── Exercicios/          # Banco de exercícios
│   ├── Dieta/               # Gestão de dieta
│   ├── Profile/             # Perfil do usuário
│   └── ...
│
├── services/
│   ├── apiConfig.js         # Configuração HTTP
│   ├── authService.js       # Autenticação
│   ├── clienteService.js    # Operações de clientes
│   ├── consultorService.js  # Operações de consultores
│   ├── fichaService.js      # Fichas de treino
│   ├── exercicioService.js  # Banco de exercícios
│   └── ...
│
├── public/
│   └── assets/              # Imagens e SVGs
│
├── App.jsx                  # Componente raiz com routing
├── main.jsx                 # Entry point
└── index.css                # Estilos globais
```

---

## 🚀 Como Começar

### Pré-requisitos
- Node.js 16+
- npm ou yarn
- Backend (Spring Boot) rodando em `http://localhost:8080`

### Instalação

```bash
# Clone o repositório
git clone <seu-repositorio>

# Acesse o diretório frontend
cd prg04JoaoAGFront

# Instale dependências
npm install

# Configure a variável de ambiente (se necessário)
# Crie um arquivo .env com:
# VITE_API_BASE_URL=http://localhost:8080
```

### Desenvolvimento

```bash
# Inicie servidor de desenvolvimento
npm run dev

# Aplicação estará disponível em: http://localhost:5173
```

### Build para Produção

```bash
npm run build

# Arquivos compilados estarão em: dist/
```

---

## 🔑 Fluxo de Autenticação

1. Usuário faz login em `/login`
2. Backend retorna JWT token
3. Token é armazenado em `localStorage`
4. Requisições incluem header `Authorization: Bearer {token}`
5. Usuário é redirecionado para dashboard conforme seu role (Cliente/Consultor)

---

## 🛠️ Tecnologias Utilizadas

**Frontend:**
- React 18.2+ - Biblioteca UI
- React Router v6 - Roteamento
- Axios - HTTP client
- CSS3 - Estilização (sem frameworks CSS)
- FontAwesome - Ícones
- Chart.js/Recharts - Gráficos (opcional)

**Build:**
- Vite 5.0+ - Build tool ultrarrápido
- JSX/JavaScript moderno

---

## 📊 Páginas e Funcionalidades

| Página | Descrição | Acesso |
|--------|-----------|--------|
| **Home** | Landing page com informações do projeto | Público |
| **Login** | Autenticação de usuários | Público |
| **Cadastro** | Registro de novos usuários | Público |
| **ClienteDashboard** | Painel principal do cliente | Cliente |
| **ConsultantDashboard** | Painel principal do consultor | Consultor |
| **Progresso** | Evolução com gráficos e análises | Cliente |
| **Configurações** | Perfil e preferências | Cliente |
| **TrainingCreator** | Criação de planos de treino | Consultor |
| **Exercícios** | Banco de exercícios | Consultor |

---

## 🔄 Integração com Backend

A aplicação se comunica com um backend Spring Boot através de requisições HTTP:

```javascript
// Exemplo de chamada de API
const response = await apiGet('/clientes/meu-perfil');
const data = await apiPost('/fichas', fichaData);
```

**Endpoints principais:**
- `GET /clientes/meu-perfil` - Dados do cliente autenticado
- `GET /clientes?size=1000` - Lista de clientes (Consultor)
- `GET /fichas` - Fichas de treino
- `POST /fichas` - Criar nova ficha
- `PUT /fichas/{id}` - Atualizar ficha
- `GET /exercicios` - Banco de exercícios
- `GET /avaliacoes` - Histórico de avaliações

---

## 🎨 Componentes Principais

### ClienteSidebar
Menu de navegação para clientes com links para:
- Visão Geral (Dashboard)
- Meu Treino
- Meu Progresso
- Configurações

**Features:**
- NavLink com detecção de rota ativa (usando `end` para exatidão)
- Menu responsivo que se abre/fecha em mobile
- Logout seguro com limpeza de tokens

### ClienteDashboard
Dashboard principal do cliente com:
- **Métricas Rápidas** - Exibição de objetivo, peso atual, altura e telefone
- **Seletor de Objetivo** - Dropdown para escolher entre: Emagrecimento, Hipertrofia, Recondicionamento, Saúde Geral
- **Módulos de Conteúdo** - Cards para Plano de Treino e Comunicação com Consultor
- **Ações Rápidas** - Botões de acesso direto: Treino, Progresso, Consultor, Configurações, Sair

**Fluxo de Objetivo:**
1. Cliente seleciona objetivo no dropdown
2. Clica "Salvar"
3. Dado é enviado para backend (FichaService)
4. Backend cria/atualiza Ficha e sincroniza com Cliente
5. Cliente vê sucesso e objetivo é persistido

### Progresso (Minha Evolução)
Componente avançado de análise com:
- **Múltiplas Abas:**
  - Histórico de Peso - Gráfico de barras com evolução temporal
  - Minhas Medidas - Medidas corporais com histórico
  - Análise Detalhada - Insights, tendências e cálculos de IMC

- **Filtros de Período:**
  - Tudo (histórico completo)
  - Últimos 30 dias
  - Últimos 90 dias
  - Últimos 6 meses

- **KPIs Calculados:**
  - Mudança de peso (kg e %)
  - IMC e categoria
  - Peso ideal (baseado em IMC 22)
  - Taxa de mudança semanal

- **Visualizações:**
  - Gráficos de barras com tooltips
  - Cards de análise com interpretações
  - Tabelas de dados

### ConsultantDashboard
Dashboard para consultores gerenciarem clientes:
- **Tabela de Clientes** - Lista completa com filtros
- **Colunas:** Nome, Email, Peso, Altura, Objetivo, Ações
- **Histórico de Avaliações** - Rastreamento de medições
- **Adicionar Avaliação** - Botão para registrar nova avaliação

---

## 🔄 Arquitetura Frontend

### Padrão de Dados
```
Cliente (usuário)
  ├── Dados Pessoais (nome, email, CPF, altura, peso)
  ├── Objetivo (EMAGRECIMENTO | HIPERTROFIA | RECONDICIONAMENTO | SAUDE_GERAL)
  └── Fichas (planos de treino)
       └── Avaliações (histórico de medições)
```

### Fluxo de Autenticação
1. **Login** (`Login.jsx`)
   - Usuário insere email e senha
   - Chamada POST `/auth/login`
   - Backend retorna JWT token e role (Cliente/Consultor)

2. **Token Storage**
   - JWT armazenado em `localStorage`
   - Role e email também salvos para verificações rápidas

3. **Proteção de Rotas**
   - Cada página verifica token e role
   - Se inválido, redireciona para login
   - Logout limpa todos os dados locais

### Serviços de API
Todos os serviços utilizam `apiConfig.js` que configura:
- Base URL do backend
- Headers padrão com Authorization
- Interceptadores de erro

**Serviços Principais:**
```javascript
// authService.js - Autenticação
login(email, senha)
logout()

// clienteService.js - Dados de clientes
buscarMeuPerfil()
buscarTodosClientesSemPaginacao()
atualizarPerfil(data)

// fichaService.js - Fichas de treino
buscarTodasFichasSemPaginacao()
criarFicha(data)
atualizarFicha(id, data)
deletarFicha(id)

// avaliacaoService.js - Histórico de avaliações
buscarAvaliacoes(filtros)
criarAvaliacao(data)
atualizarAvaliacao(id, data)

// objetivoService.js - Catálogo de objetivos
buscarTodosObjetivos(page, size)
```

### Gestão de Estado
- **useState** para estado local de componentes
- **useEffect** para chamadas de API e efeitos colaterais
- **useNavigate** (React Router) para roteamento programático
- **localStorage** para persistência de tokens

---

## 🎯 Fluxos de Negócio

### Fluxo 1: Cliente Define Objetivo
```
ClienteDashboard
  ├─ Carrega objetivos disponíveis via objetivoService
  ├─ Usuário seleciona objetivo no dropdown
  ├─ Clica "Salvar"
  └─ atualizarFicha() é chamado
      ├─ Envia {id, nome, objetivo} para backend
      ├─ FichaService atualiza Ficha
      ├─ FichaService sincroniza Cliente.objetivo
      └─ Frontend recebe sucesso e atualiza estado local
```

### Fluxo 2: Cliente Acompanha Evolução
```
ClienteDashboard → Clica em "Meu Progresso"
  └─ Progresso.jsx carregado
      ├─ avaliacaoService busca histórico de avaliações
      ├─ Usuário seleciona período (30, 90, 180 dias)
      ├─ Componente calcula:
      │   ├─ IMC = peso / (altura²)
      │   ├─ Peso ideal = altura² × 22
      │   └─ Taxa de mudança = Δ peso / semanas
      └─ Exibe gráficos e análises
```

### Fluxo 3: Consultor Visualiza Clientes
```
ConsultantDashboard
  └─ consultorService.buscarMeusClientes()
      ├─ Faz GET /clientes?size=1000
      ├─ Backend retorna ClienteResponseDTO[] (com objetivo)
      └─ Tabela é populada com informações
```

---

## 🌐 Integração Backend-Frontend

### Request/Response Pattern

**Request do Cliente:**
```javascript
// Frontend
const response = await atualizarFicha(fichaId, {
  id: fichaId,
  nome: 'Minha Ficha',
  objetivo: 'EMAGRECIMENTO'
});
```

**Backend Processa:**
```java
// FichaService.java
public void update(FichaAtualizarRequestDTO dto) {
  Ficha ficha = fichaRepository.findById(dto.getId());
  ficha.setObjetivo(dto.getObjetivo());
  fichaRepository.save(ficha);
  
  // Sincroniza com Cliente
  Cliente cliente = ficha.getCliente();
  cliente.setObjetivo(ObjetivoCliente.valueOf(dto.getObjetivo()));
  clienteRepository.save(cliente);
}
```

**Response para Frontend:**
```javascript
// Frontend recebe
{
  id: 1,
  nome: 'Minha Ficha',
  objetivo: 'EMAGRECIMENTO',
  clienteId: 123,
  dataCriacao: '2026-02-04'
}
```

### DTOs Utilizados
- **ClienteResponseDTO** - Inclui: id, nome, email, cpf, rg, dataNascimento, telefone, pesoAtual, altura, **objetivo**
- **FichaCriarRequestDTO** - Nome, objetivo, clienteId
- **FichaAtualizarRequestDTO** - Id, nome, objetivo
- **AvaliacaoResponseDTO** - Data, peso, gordura%, medidas

---

## 📦 Dependências Principais

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.x",
    "axios": "^1.x"
  },
  "devDependencies": {
    "vite": "^5.0.0",
    "@vitejs/plugin-react": "^4.x"
  }
}
```

---

## 📊 Resumo de Funcionalidades

| Funcionalidade | Status | Descrição |
|---|---|---|
| Autenticação JWT | ✅ Completo | Login/Logout com tokens seguros |
| Dashboard Cliente | ✅ Completo | Métricas e ações rápidas |
| Seletor de Objetivo | ✅ Completo | Sincroniza com backend |
| Progresso com Gráficos | ✅ Completo | Análise com 3 abas |
| Dashboard Consultor | ✅ Completo | Visualização de clientes |
| Comunicação WhatsApp | ✅ Completo | Link direto via wa.me |
| Banco de Exercícios | ✅ Implementado | Interface ainda em desenvolvimento |
| Criador de Treino | ✅ Implementado | Permite criar planos customizados |

---

## 🔐 Segurança

- **JWT Token** - Armazenado em localStorage, incluído em todas as requisições
- **Role-based Access** - Rotas protegidas verificam role do usuário
- **CORS** - Backend configurado para aceitar requisições do frontend
- **Logout** - Limpa tokens e dados sensíveis do localStorage

---

## 📱 Responsividade

- **Desktop (>768px)** - Sidebar fixo, layout em colunas
- **Tablet (481-768px)** - Sidebar em drawer, conteúdo adaptado
- **Mobile (<480px)** - Menu hamburguês, layout em colunas únicas

---

## 🚧 Funcionalidades Futuras

### Em Desenvolvimento
- 🔄 **Melhorias na Avaliação**
  - Adição de mais métricas (composição corporal, flexibilidade, força)
  - Gráficos comparativos entre avaliações
  - Histórico visual com tendências automáticas
  - Alertas quando métricas saem do intervalo ideal

- 🍽️ **Sistema de Alimentação Avançado**
  - Tabela de alimentos com macronutrientes
  - Criador de planos de dieta personalizados
  - Cálculo automático de calorias e nutrientes
  - Sugestões de refeições baseadas em objetivo
  - Histórico de consumo com gráficos nutricionais
  - Integração com aplicativos de fitness populares

### Possíveis Melhorias
- 📱 **Aplicativo Mobile Nativo** - React Native para iOS/Android
- 🔔 **Notificações em Tempo Real** - Lembretes de treino, avaliações, refeições
- 💬 **Chat Integrado** - Comunicação direta na plataforma (não apenas WhatsApp)
- 📊 **Relatórios Avançados** - PDFs com análise completa do progresso
- 🏪 **E-commerce** - Venda de suplementos e produtos fitness
- 🤝 **Comunidade** - Feed social entre clientes, desafios e competições
- 🌍 **Multilíngue** - Suporte para múltiplos idiomas

### Melhorias de Performance
- ⚡ **Lazy Loading** - Carregamento sob demanda de componentes
- 💾 **Cache Local** - Armazenamento de dados frequentes
- 📦 **Code Splitting** - Otimização de bundle size
- 🖼️ **Otimização de Imagens** - Compressão e WebP

---

**Desenvolvido por Joao Gomes*
