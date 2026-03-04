import mjml2html from "mjml";

/**
 * Converte string MJML em HTML
 * @param {string} mjmlString
 * @returns {{ html: string, errors: Array }}
 */
export function renderMjml(mjmlString) {
  const result = mjml2html(mjmlString, { validationLevel: "soft" });
  return { html: result.html, errors: result.errors };
}
