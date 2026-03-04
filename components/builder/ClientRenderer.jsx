import { useRef, useEffect } from "react";
import useBuilderStore from "../../store/builderStore";

/**
 * Preview rápido — renderiza o template no cliente sem chamar o servidor.
 * Usa HTML/CSS simples dentro de um iframe.
 */
export default function ClientRenderer() {
  const template = useBuilderStore((s) => s.template);
  const iframeRef = useRef(null);

  useEffect(() => {
    const { globalConfig, sections } = template;

    const sectionsHtml = sections
      .map((section) => {
        const colWidth = Math.floor(100 / section.columnList.length);
        const columnsHtml = section.columnList
          .map((col) => {
            const compsHtml = col.components
              .map((comp) => {
                if (comp.type === "mj-text") {
                  return `<div style="padding:${comp.attributes.padding||'10px'};color:${comp.attributes.color||'#000'};font-size:${comp.attributes['font-size']||'14px'}">${comp.content || ""}</div>`;
                }
                if (comp.type === "mj-image") {
                  return `<div style="padding:${comp.attributes.padding||'10px'};text-align:${comp.attributes.align||'center'}"><img src="${comp.attributes.src||''}" alt="${comp.attributes.alt||''}" style="max-width:100%;width:${comp.attributes.width||'100%'}" /></div>`;
                }
                if (comp.type === "mj-button") {
                  return `<div style="padding:${comp.attributes.padding||'10px'};text-align:${comp.attributes.align||'center'}"><a href="${comp.attributes.href||'#'}" style="display:inline-block;background:${comp.attributes['background-color']||'#4A90E2'};color:${comp.attributes.color||'#fff'};padding:${comp.attributes['inner-padding']||'10px 25px'};border-radius:${comp.attributes['border-radius']||'4px'};text-decoration:none;font-size:${comp.attributes['font-size']||'14px'}">${comp.content||'Botão'}</a></div>`;
                }
                if (comp.type === "mj-divider") {
                  return `<div style="padding:${comp.attributes.padding||'10px 0'}"><hr style="border:none;border-top:${comp.attributes['border-width']||'1px'} ${comp.attributes['border-style']||'solid'} ${comp.attributes['border-color']||'#ccc'}" /></div>`;
                }
                return "";
              })
              .join("");
            return `<div style="display:inline-block;width:${colWidth}%;vertical-align:top;box-sizing:border-box">${compsHtml}</div>`;
          })
          .join("");

        return `<div style="background:${section.attributes['background-color']||'transparent'};padding:${section.attributes.padding||'0'}">${columnsHtml}</div>`;
      })
      .join("");

    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"/><style>body{margin:0;font-family:${globalConfig.fontFamily};background:${globalConfig.backgroundColor}}</style></head><body><div style="max-width:${globalConfig.containerWidth};margin:0 auto;background:#fff">${sectionsHtml}</div></body></html>`;

    if (iframeRef.current) {
      const doc = iframeRef.current.contentDocument;
      doc.open();
      doc.write(html);
      doc.close();
    }
  }, [template]);

  return (
    <iframe
      ref={iframeRef}
      title="Preview rápido"
      className="w-full h-full border-0"
    />
  );
}
