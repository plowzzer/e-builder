# Changelog

Todas as mudanças notáveis do projeto são documentadas aqui.

---

## [Unreleased]

### Planejado
- Fase 5: página de listagem de templates, exportar HTML compilado
- Fase 6: área administrativa

---

## [0.4.5] — 2026-03-05

### Adicionado
- Toggle de viewport Desktop / Mobile nas abas Editor, Preview Rápido e Preview Final
  - Mobile: canvas/iframe com 375px de largura, centralizado
  - Desktop: largura total (`containerWidth`)
- Padding em `mj-column` editável no PropertiesPanel (geral + top/bottom/left/right)
- Botão "Exportar .mjml" no header — gera download do arquivo a partir do estado atual

### Corrigido
- Accordion do PropertiesPanel agora abre a aba "Elemento" automaticamente ao selecionar um componente
- Inputs de propriedades não voltam mais para o valor padrão ao serem limpos — usam `placeholder` em vez de fallback no `value`
- `mj-image` no editor agora respeita o atributo `width` configurado; sem `width`, usa tamanho natural da imagem limitado por `maxWidth: 100%`
- Colunas no editor agora têm altura equalizada (CSS Grid); `vertical-align` da coluna funciona corretamente via `flexbox` (`flex-start` / `center` / `flex-end`)

---

## [0.4.0] — Fase 4

### Adicionado
- Importador de `.mjml`: `lib/parseMjml.js` (client-side, `DOMParser`) + botão "Importar .mjml" no header
- Componente `mj-table` com editor de HTML interno (`<tr>`, `<th>`, `<td>`)
- `FinalPreview` extraído como componente separado com layout iframe + bloco de código lado a lado
- Badge "Template alterado" no Preview Final com botão "Atualizar" quando o estado muda após a geração

---

## [0.3.0] — Fase 3

### Adicionado
- `TextProperties` — font-size, color, font-family, font-weight, line-height, padding, align, text-decoration, text-transform
- `ImageProperties` — src, alt, width, href, padding, align, border-radius
- `ButtonProperties` — background-color, color, font-size, font-weight, border-radius, padding, inner-padding, href, align
- `DividerProperties` — border-color, border-style, border-width, padding
- `TableProperties` — border, cellpadding, cellspacing, font-size, color, font-family, line-height, padding, align, table-layout
- `GlobalConfigPanel` — backgroundColor, fontFamily, containerWidth

---

## [0.2.0] — Fase 2

### Adicionado
- `BuilderLayout` com painel esquerdo (editor + tabs) e painel direito (PropertiesPanel) redimensionáveis
- `SectionList` com canvas centralizado e largura configurável
- `SectionItem` com toolbar de mover/remover, destaque de seleção (`ring-2 ring-blue-500`) e popover para adicionar componentes
- `ComponentItem` com renderização WYSIWYG por tipo e destaque de seleção (`ring-2 ring-inset ring-orange-400`)
- `PropertiesPanel` em accordion: Elemento / Coluna / Seção; GlobalConfigPanel quando nada selecionado
- Confirmação via `AlertDialog` para exclusão de seções e componentes

---

## [0.1.0] — Fase 1

### Adicionado
- `builderStore.js` — estado global com Zustand (template, seleção, isDirty, previewOutdated)
- `templateToMjml.js` — converte JSON do estado em string MJML
- `lib/mjml.js` — wrapper server-side do `mjml.render()`
- `lib/mongodb.js` — conexão com MongoDB via Mongoose
- `models/Template.js` — schema Mongoose
- `/api/preview` — recebe JSON, retorna HTML compilado via MJML
- `/api/templates` — CRUD de templates
- `ClientRenderer` — preview rápido no cliente via `<iframe>` + HTML/CSS simples
- `pages/builder/[id].jsx` — página principal do editor com save/load via API
