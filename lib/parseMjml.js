/**
 * Converte uma string MJML para o formato JSON do builder.
 * Usa DOMParser nativo do browser (client-side only).
 *
 * @param {string} mjmlString
 * @returns {{ globalConfig: Object, sections: Array }}
 */
export function parseMjml(mjmlString) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(mjmlString, "text/xml");

  const parseError = doc.querySelector("parsererror");
  if (parseError) {
    throw new Error("MJML inválido: " + parseError.textContent);
  }

  // --- globalConfig ---
  const globalConfig = {
    backgroundColor: "#ffffff",
    fontFamily: "Arial, sans-serif",
    containerWidth: "600px",
  };

  const mjBody = doc.querySelector("mj-body");
  if (mjBody) {
    if (mjBody.getAttribute("background-color"))
      globalConfig.backgroundColor = mjBody.getAttribute("background-color");
    if (mjBody.getAttribute("width"))
      globalConfig.containerWidth = mjBody.getAttribute("width");
  }

  const mjAll = doc.querySelector("mj-attributes mj-all");
  if (mjAll && mjAll.getAttribute("font-family")) {
    globalConfig.fontFamily = mjAll.getAttribute("font-family");
  }

  // --- sections ---
  const COMPONENT_TYPES = ["mj-text", "mj-image", "mj-button", "mj-divider"];

  const sections = Array.from(doc.querySelectorAll("mj-body > mj-section")).map(
    (sectionEl) => {
      const sectionAttrs = getAttributes(sectionEl);
      const columns = Array.from(sectionEl.querySelectorAll("mj-column")).map(
        (colEl) => {
          const colAttrs = getAttributes(colEl);
          const components = Array.from(colEl.children)
            .filter((el) => COMPONENT_TYPES.includes(el.tagName))
            .map((compEl) => ({
              id: crypto.randomUUID(),
              type: compEl.tagName,
              attributes: getAttributes(compEl),
              content: ["mj-text", "mj-button"].includes(compEl.tagName)
                ? compEl.innerHTML
                : "",
            }));

          return {
            id: crypto.randomUUID(),
            attributes: colAttrs,
            components,
          };
        }
      );

      return {
        id: crypto.randomUUID(),
        columns: columns.length || 1,
        attributes: sectionAttrs,
        columnList: columns,
      };
    }
  );

  return { globalConfig, sections };
}

/**
 * Extrai todos os atributos de um elemento como objeto.
 * @param {Element} el
 * @returns {Object}
 */
function getAttributes(el) {
  const attrs = {};
  for (const attr of el.attributes) {
    attrs[attr.name] = attr.value;
  }
  return attrs;
}
