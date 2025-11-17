# PRG04 - Sistema de Gerenciamento de Atividades

Projeto React com TypeScript e Vite para gerenciar atividades de forma eficiente.

## 📁 Estrutura do Projeto

```
src/
├── components/     # Componentes reutilizáveis
│   ├── Header.tsx  # Navegação principal
│   └── Header.css
├── pages/          # Páginas da aplicação
│   ├── Home.tsx    # Página inicial
│   ├── Atividades.tsx # Gerenciador de atividades
│   ├── Login.tsx   # Página de login
│   └── *.css       # Estilos das páginas
├── styles/         # Estilos globais
├── App.tsx         # Componente principal com roteamento
├── main.tsx        # Entry point
└── index.css       # Estilos globais
```

## 🚀 Como Usar

### Instalar dependências
```bash
npm install
```

### Iniciar servidor de desenvolvimento
```bash
npm run dev
```

O servidor iniciará em `http://localhost:5173`

### Build para produção
```bash
npm run build
```

## 📦 Dependências

- **React** 18.2.0 - Biblioteca para construir interfaces
- **React DOM** 18.2.0 - DOM manipulation para React
- **React Router DOM** 6.x - Roteamento de páginas
- **TypeScript** 5.2.2 - Tipagem estática
- **Vite** 5.0.8 - Build tool rápido

## 🎨 Recursos

- ✅ **Header com Navegação** - Menu responsivo com links para as páginas
- ✅ **Página Home** - Interface atrativa com apresentação do projeto
- ✅ **Gerenciador de Atividades** - CRUD completo de atividades com estatísticas
- ✅ **Página de Login** - Formulário de autenticação (ainda sem backend)
- ✅ **Tema Dark Mode** - Interface escura e moderna
- ✅ **Responsivo** - Funciona em desktop, tablet e mobile

## 🔄 Páginas Disponíveis

### Home (/)
Página inicial com informações sobre o projeto e suas funcionalidades.

### Atividades (/atividades)
- Criar novas atividades
- Marcar atividades como concluídas
- Deletar atividades
- Ver estatísticas (total, concluídas, pendentes)

### Login (/login)
Formulário de login com validação básica.

## 🛠️ Desenvolvimento

Para adicionar novas páginas:

1. Crie um arquivo `.tsx` em `src/pages/`
2. Crie um arquivo `.css` correspondente
3. Importe e adicione uma rota em `App.tsx`

Exemplo:
```tsx
import NovaPagina from './pages/NovaPagina'

// Dentro do Routes
<Route path="/nova-pagina" element={<NovaPagina />} />
```

## 📝 Notas

- Os dados de atividades são armazenados em estado local (useState)
- Para persistência, implemente localStorage ou conecte a um backend
- O login é apenas uma interface - sem autenticação real no momento

## 🔗 Links Úteis

- [React Docs](https://react.dev)
- [React Router](https://reactrouter.com)
- [Vite Docs](https://vitejs.dev)
- [TypeScript Docs](https://www.typescriptlang.org)
