# Email Builder — CLAUDE.md

Esse arquivo serve como guia de contexto e decisões do projeto para o Claude Code.

---

## Visão Geral

Email builder visual com suporte a drag-and-drop simplificado (botões de adicionar, mover e remover seções). O motor de transpilação é o **MJML**, que converte o template em HTML compatível com clientes de email.

---

## Stack Técnica

| Camada         | Tecnologia                       |
| -------------- | -------------------------------- |
| Framework      | Next.js (Page Router)            |
| Linguagem      | JavaScript puro (sem TypeScript) |
| Estilo         | Tailwind CSS + shadcnUi          |
| Estado global  | Zustand                          |
| Banco de dados | MongoDB + Mongoose               |
| Transpilação   | MJML (server-side apenas)        |

---

## Estrutura de Pastas

```
email-builder/
├── pages/
│   ├── index.jsx                        # Lista de templates
│   ├── builder/[id].jsx                 # Editor principal
│   ├── admin/
│   │   └── index.jsx                    # Administrativo (futuro)
│   └── api/
│       ├── templates/
│       │   ├── index.js                 # GET (listar) | POST (criar)
│       │   └── [id].js                  # GET | PUT | DELETE
│       └── preview/
│           └── index.js                 # POST → retorna HTML via MJML
├── components/
│   ├── builder/
│   │   ├── BuilderLayout.jsx            # Estrutura esquerda/direita + tabs
│   │   ├── SectionList.jsx              # Lista de seções com controles
│   │   ├── SectionItem.jsx              # Uma seção com seus componentes
│   │   ├── ComponentItem.jsx            # Um componente dentro da seção (renderContent WYSIWYG)
│   │   ├── ClientRenderer.jsx           # Preview rápido (cliente, sem servidor)
│   │   ├── PropertiesPanel.jsx          # Painel direito — elemento + coluna + seção (accordion)
│   │   └── GlobalConfigPanel.jsx        # Configurações globais (mj-head) — default quando nada selecionado
│   └── properties/
│       ├── TextProperties.jsx           # Props do mj-text
│       ├── ImageProperties.jsx          # Props do mj-image
│       ├── ButtonProperties.jsx         # Props do mj-button
│       └── DividerProperties.jsx        # Props do mj-divider
├── store/
│   └── builderStore.js                  # Zustand — estado central do builder
├── lib/
│   ├── mjml.js                          # Wrapper do mjml.render() (server-side)
│   ├── mongodb.js                       # Conexão com MongoDB
│   └── templateToMjml.js               # Converte JSON do estado em string MJML
├── models/
│   └── Template.js                      # Schema Mongoose
└── types/
    └── builder.js                       # JSDoc com as estruturas de dados
```

---

## Modelo de Dados

### Template (MongoDB)

```js
// models/Template.js
{
  name: String,
  createdAt: Date,
  updatedAt: Date,
  data: {
    globalConfig: {
      backgroundColor: String,   // ex: "#ffffff"
      fontFamily: String,        // ex: "Arial, sans-serif"
      containerWidth: String,    // ex: "600px"
      // mapeia para mj-attributes e mj-font no mj-head
    },
    sections: [
      {
        id: String,              // uuid gerado no cliente
        columns: Number,         // 1, 2 ou 3
        attributes: Object,      // ex: { "background-color": "#f4f4f4", "padding": "20px 0" }
        columnList: [
          {
            id: String,
            attributes: Object,  // ex: { "vertical-align": "top", "background-color": "#fff" }
            components: [
              {
                id: String,
                type: String,    // "mj-text" | "mj-image" | "mj-button" | "mj-divider"
                attributes: Object,
                content: String  // HTML interno — usado em mj-text e mj-button
              }
            ]
          }
        ]
      }
    ]
  }
}
```

---

## Estado Zustand (builderStore.js)

```js
// store/builderStore.js
{
  // --- Estado ---
  template: {
    globalConfig: { ... },
    sections: [ ... ]
  },
  selectedSectionId: null,
  selectedColumnId: null,
  selectedComponentId: null,
  isDirty: false,              // true quando há mudanças não salvas
  previewOutdated: false,      // true quando o Preview Final está desatualizado

  // --- Actions de seção ---
  addSection(columns),         // cria nova seção com 1, 2 ou 3 colunas
  removeSection(sectionId),
  moveSectionUp(sectionId),
  moveSectionDown(sectionId),
  updateSectionAttributes(sectionId, attrs),

  // --- Actions de coluna ---
  updateColumnAttributes(sectionId, columnId, attrs),

  // --- Actions de componente ---
  addComponent(sectionId, columnId, type),
  removeComponent(sectionId, columnId, componentId),
  moveComponentUp(sectionId, columnId, componentId),
  moveComponentDown(sectionId, columnId, componentId),
  updateComponent(sectionId, columnId, componentId, patch),

  // --- Actions de seleção ---
  selectSection(sectionId),
  selectComponent(sectionId, columnId, componentId),
  clearSelection(),

  // --- Actions globais ---
  updateGlobalConfig(patch),
  loadTemplate(templateData),  // carrega template do banco
  markSaved(),                 // isDirty = false
}
```

---

## Sistema de Preview

### Preview Rápido (ClientRenderer.jsx)

- Roda **100% no cliente**, sem chamada ao servidor
- Lê o estado do Zustand e renderiza HTML/CSS simples em um `<iframe>`
- Atualiza instantaneamente a cada mudança

### Preview Final (aba separada)

- Só é acionado quando o usuário **clica na aba "Preview Final"**
- Faz `POST /api/preview` com o JSON do template
- O servidor converte via `templateToMjml.js` + `mjml.render()`
- Retorna HTML compilado e injeta em um `<iframe>`

### Aba JSON

- Exibe `JSON.stringify(template, null, 2)` em tempo real
- Útil para depuração e verificar o que será enviado ao MJML

---

## Transpilação MJML

### Hierarquia MJML que o builder gera

```
mj-mjml
  └── mj-head
  │     ├── mj-font             ← globalConfig.fontFamily
  │     └── mj-attributes       ← globalConfig (estilos padrão globais)
  └── mj-body
        └── mj-section          ← cada section do estado
              └── mj-column     ← cada coluna da section
                    └── mj-text / mj-image / mj-button / mj-divider
```

### Atributos por componente

**mj-text**

- `font-size`, `color`, `font-family`, `font-weight`, `line-height`
- `padding`, `padding-top`, `padding-bottom`, `padding-left`, `padding-right`
- `align`, `text-decoration`, `text-transform`
- `content` → HTML interno (ex: `<p>Texto</p>`)

**mj-image**

- `src`, `alt`, `width`, `href`, `padding`, `align`, `border-radius`

**mj-button**

- `background-color`, `color`, `font-size`, `font-weight`
- `border-radius`, `padding`, `inner-padding`, `href`, `align`
- `content` → texto do botão

**mj-divider**

- `border-color`, `border-style`, `border-width`, `padding`

**mj-column** (editável via PropertiesPanel ao selecionar elemento)

- `vertical-align`, `background-color`

**mj-section** (editável via PropertiesPanel ao selecionar elemento)

- `background-color`, `padding`

---

## PropertiesPanel — estrutura em accordion

Ao selecionar um elemento, o painel direito exibe 3 seções em accordion:

1. **Elemento** — propriedades específicas do tipo (TextProperties, ImageProperties, etc.)
2. **Coluna** — `vertical-align`, `background-color`
3. **Seção** — `background-color`, `padding`

Quando nada está selecionado → exibe **GlobalConfigPanel** por padrão.

---

## API Routes

| Método | Rota                  | Descrição                          |
| ------ | --------------------- | ---------------------------------- |
| GET    | `/api/templates`      | Lista todos os templates           |
| POST   | `/api/templates`      | Cria novo template                 |
| GET    | `/api/templates/[id]` | Retorna um template                |
| PUT    | `/api/templates/[id]` | Atualiza template                  |
| DELETE | `/api/templates/[id]` | Remove template                    |
| POST   | `/api/preview`        | Recebe JSON, retorna HTML via MJML |

---

## Layout do Builder

```
┌──────────────────────────────────────────────────────────────────┐
│  📧 Nome do template                          [💾 Salvar]        │
├──────────────────────────────────────────────────────────────────┤
│  [Editor] [Preview Rápido] [Preview Final] [JSON]                │
├─────────────────────────────────┬────────────────────────────────┤
│                                 │  PropertiesPanel (accordion)   │
│   ┌─────────────────────────┐   │                                │
│   │[↑][↓][🗑️] Seção 1       │   │  Sem seleção → GlobalConfig   │
│   │  col1  | col2           │   │                                │
│   │  [comp🟠] [comp]        │   │  Com elemento selecionado:     │
│   │  [+ componente]         │   │  ▼ Elemento (props do tipo)    │
│   └─────────────────────────┘   │  ▶ Coluna (vertical-align…)   │
│                                 │  ▶ Seção (bg, padding…)       │
│   [+ Adicionar seção]           │                                │
└─────────────────────────────────┴────────────────────────────────┘
```

---

## Regras Gerais de Desenvolvimento

- **Sem TypeScript** — usar JSDoc para documentar estruturas quando necessário
- **Page Router** — não usar App Router
- **MJML roda apenas no servidor** — nunca importar `mjml` em arquivos do cliente
- **Zustand** — usar subscriptions seletivas para evitar re-renders desnecessários
- **IDs** — gerar com `crypto.randomUUID()` no cliente
- **Preview Final** — nunca chamar automaticamente, sempre sob demanda do usuário
- **Seleção** — clicar em um componente usa `e.stopPropagation()` para não propagar ao `SectionItem`
- **PropertiesPanel** — ao selecionar elemento: mostra props do elemento + coluna + seção via accordion; sem seleção: mostra GlobalConfigPanel
- **Deleção com confirmação** — `SectionItem` e `PropertiesPanel` usam `AlertDialog` antes de remover
- **Highlight de seleção** — seção: `ring-2 ring-blue-500`; componente: `ring-2 ring-inset ring-orange-400`

---

## Fases de Desenvolvimento

- [x] **Fase 1** — Fundação: types (JSDoc), builderStore, templateToMjml, /api/preview, ClientRenderer
- [x] **Fase 2** — Builder UI: SectionList, SectionItem, ComponentItem, seleção, PropertiesPanel base
- [x] **Fase 3** — Painéis de propriedades: TextProperties, ImageProperties, ButtonProperties, DividerProperties, GlobalConfigPanel
- [ ] **Fase 4** — Persistência: CRUD MongoDB, página de listagem, exportar HTML/MJML
- [ ] **Fase 5** — Administrativo: pages/admin com gestão de templates

---

## Dependências Necessárias

```bash
npm install mjml zustand mongoose
```

> **Atenção:** `mjml` deve ser usado apenas em API routes (server-side). Nunca importar no browser.
