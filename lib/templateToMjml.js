/**
 * Converte atributos de objeto para string de atributos HTML
 * @param {Object} attrs
 * @returns {string}
 */
function attrsToString(attrs = {}) {
  return Object.entries(attrs)
    .map(([k, v]) => `${k}="${v}"`)
    .join(" ");
}

/**
 * Converte o JSON do template em string MJML
 * @param {import("../types/builder").Template} template
 * @returns {string}
 */
export function templateToMjml(template) {
  const { globalConfig, sections } = template;

  const sectionsMarkup = sections
    .map((section) => {
      const columnsMarkup = section.columnList
        .map((col) => {
          const componentsMarkup = col.components
            .map((comp) => {
              const attrs = attrsToString(comp.attributes);
              if (comp.type === "mj-text") {
                return `<mj-text ${attrs}>${comp.content || ""}</mj-text>`;
              }
              if (comp.type === "mj-button") {
                return `<mj-button ${attrs}>${comp.content || ""}</mj-button>`;
              }
              if (comp.type === "mj-image") {
                return `<mj-image ${attrs} />`;
              }
              if (comp.type === "mj-divider") {
                return `<mj-divider ${attrs} />`;
              }
              if (comp.type === "mj-table") {
                return `<mj-table ${attrs}>${comp.content || ""}</mj-table>`;
              }
              return "";
            })
            .join("\n");

          return `<mj-column ${attrsToString(col.attributes)}>\n${componentsMarkup}\n</mj-column>`;
        })
        .join("\n");

      return `<mj-section ${attrsToString(section.attributes)}>\n${columnsMarkup}\n</mj-section>`;
    })
    .join("\n");

  return `
<mjml>
  <mj-head>
    <mj-font name="Custom Font" href="https://fonts.googleapis.com/css?family=Roboto" />
    <mj-attributes>
      <mj-all font-family="${globalConfig.fontFamily}" />
      <mj-body background-color="${globalConfig.backgroundColor}" width="${globalConfig.containerWidth}" />
    </mj-attributes>
  </mj-head>
  <mj-body background-color="${globalConfig.backgroundColor}" width="${globalConfig.containerWidth}">
    ${sectionsMarkup}
  </mj-body>
</mjml>
`.trim();
}
