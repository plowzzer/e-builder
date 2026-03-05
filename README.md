# Email Builder

Builder visual de emails responsivos com suporte a MJML. Permite criar, editar, importar e exportar templates de email com preview em tempo real.

---

## Stack

| Camada        | Tecnologia                       |
| ------------- | -------------------------------- |
| Framework     | Next.js (Page Router)            |
| Linguagem     | JavaScript puro (sem TypeScript) |
| Estilo        | Tailwind CSS + shadcn/ui         |
| Estado global | Zustand                          |
| Banco         | MongoDB + Mongoose               |
| Transpilação  | MJML (server-side apenas)        |

---

## Requisitos

- Node.js 18+
- MongoDB (local ou Atlas)

---

## Instalação

```bash
npm install
```

Crie um arquivo `.env.local` na raiz:

```env
MONGODB_URI=mongodb://localhost:27017/email-builder
```

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

Acesse `http://localhost:3000`.

---

## Funcionalidades

### Editor visual

- Adicionar seções com 1, 2 ou 3 colunas
- Reordenar e remover seções
- Adicionar componentes por coluna: Texto, Imagem, Botão, Divisor, Tabela
- Reordenar e remover componentes
- Canvas centralizado com largura configurável

### Propriedades

Ao selecionar um componente, o painel direito exibe um accordion com:

1. **Elemento** — propriedades específicas do tipo
2. **Coluna** — alinhamento vertical, cor de fundo, padding
3. **Seção** — cor de fundo, padding

Sem seleção, exibe as **configurações globais** (fonte, cor de fundo, largura do container).

### Viewport toggle

Botão Desktop / Mobile disponível nas abas Editor, Preview Rápido e Preview Final. No modo mobile o canvas e os iframes ficam com 375px de largura.

### Previews

| Aba            | Descrição                                                                 |
| -------------- | ------------------------------------------------------------------------- |
| Editor         | Edição WYSIWYG direta                                                     |
| Preview Rápido | Renderização HTML/CSS simples no cliente, atualiza instantaneamente       |
| Preview Final  | Compilação via MJML no servidor, sob demanda. Exibe iframe + HTML lado a lado |
| JSON           | Estado bruto do template em tempo real                                    |

### Importar / Exportar

- **Importar .mjml** — carrega um arquivo `.mjml` existente no builder via `parseMjml` (client-side, sem dependências extras)
- **Exportar .mjml** — gera download do arquivo `.mjml` a partir do estado atual

### Persistência

Templates são salvos no MongoDB. A URL do builder usa o ID do documento: `/builder/[id]`. Use `/builder/new` para criar um novo template.

---

## Estrutura de Pastas

```
├── pages/
│   ├── index.jsx                  # Lista de templates
│   ├── builder/[id].jsx           # Editor principal
│   └── api/
│       ├── templates/index.js     # GET (listar) | POST (criar)
│       ├── templates/[id].js      # GET | PUT | DELETE
│       └── preview/index.js       # POST → retorna HTML via MJML
├── components/
│   ├── builder/                   # Componentes do editor
│   └── properties/                # Painéis de propriedades por tipo
├── store/
│   └── builderStore.js            # Estado global (Zustand)
├── lib/
│   ├── templateToMjml.js          # JSON → string MJML
│   ├── parseMjml.js               # .mjml → JSON do builder
│   ├── mjml.js                    # Wrapper mjml.render() (server-side)
│   └── mongodb.js                 # Conexão MongoDB
└── models/
    └── Template.js                # Schema Mongoose
```

---

## Componentes suportados

| Tipo          | Atributos principais                                              |
| ------------- | ----------------------------------------------------------------- |
| `mj-text`     | font-size, color, font-family, font-weight, line-height, padding, align |
| `mj-image`    | src, alt, width, href, padding, align, border-radius              |
| `mj-button`   | background-color, color, font-size, border-radius, padding, href  |
| `mj-divider`  | border-color, border-style, border-width, padding                 |
| `mj-table`    | border, cellpadding, cellspacing, font-size, color, padding       |

---

## API

| Método | Rota                  | Descrição                          |
| ------ | --------------------- | ---------------------------------- |
| GET    | `/api/templates`      | Lista todos os templates           |
| POST   | `/api/templates`      | Cria novo template                 |
| GET    | `/api/templates/[id]` | Retorna um template                |
| PUT    | `/api/templates/[id]` | Atualiza template                  |
| DELETE | `/api/templates/[id]` | Remove template                    |
| POST   | `/api/preview`        | Recebe JSON, retorna HTML via MJML |
