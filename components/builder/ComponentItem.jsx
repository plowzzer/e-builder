import { cn } from "@/lib/utils";
import useBuilderStore from "../../store/builderStore";

/**
 * Renderiza o conteúdo visual do componente conforme o tipo (WYSIWYG)
 * @param {import("../../types/builder").Component} component
 */
function renderContent(component) {
  const a = component.attributes || {};

  switch (component.type) {
    case "mj-text":
      return (
        <div
          style={{
            fontSize: a["font-size"] || "14px",
            color: a.color || "#000000",
            fontFamily: a["font-family"] || "Arial, sans-serif",
            fontWeight: a["font-weight"] || "normal",
            lineHeight: a["line-height"] || "1.5",
            padding: a.padding || "10px",
            textAlign: a.align || "left",
            textDecoration: a["text-decoration"] || undefined,
            textTransform: a["text-transform"] || undefined,
          }}
          dangerouslySetInnerHTML={{ __html: component.content || "<p>Texto aqui</p>" }}
        />
      );

    case "mj-image":
      return (
        <div style={{ padding: a.padding || "10px", textAlign: a.align || "center" }}>
          {a.src ? (
            <img
              src={a.src}
              alt={a.alt || ""}
              style={{
                maxWidth: "100%",
                width: a.width || undefined,
                borderRadius: a["border-radius"] || "0",
                display: "block",
                margin: a.align === "left" ? "0" : a.align === "right" ? "0 0 0 auto" : "0 auto",
              }}
            />
          ) : (
            <div
              style={{
                background: "#f0f0f0",
                height: "120px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#aaa",
                fontSize: "12px",
                borderRadius: "4px",
                border: "1px dashed #ddd",
              }}
            >
              Imagem não definida
            </div>
          )}
        </div>
      );

    case "mj-button":
      return (
        <div style={{ padding: a.padding || "10px", textAlign: a.align || "center" }}>
          <span
            style={{
              display: "inline-block",
              background: a["background-color"] || "#4A90E2",
              color: a.color || "#ffffff",
              fontSize: a["font-size"] || "14px",
              fontWeight: a["font-weight"] || "normal",
              borderRadius: a["border-radius"] || "4px",
              padding: a["inner-padding"] || "10px 25px",
              cursor: "default",
              userSelect: "none",
            }}
          >
            {component.content || "Clique aqui"}
          </span>
        </div>
      );

    case "mj-divider":
      return (
        <div style={{ padding: a.padding || "10px 0" }}>
          <hr
            style={{
              border: "none",
              borderTop: `${a["border-width"] || "1px"} ${a["border-style"] || "solid"} ${a["border-color"] || "#cccccc"}`,
              margin: 0,
            }}
          />
        </div>
      );

    case "mj-table":
      return (
        <div style={{ padding: a.padding || "10px", textAlign: a.align || "left" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: a["font-size"] || "14px",
              color: a.color || "#000000",
              fontFamily: a["font-family"] || "Arial, sans-serif",
              lineHeight: a["line-height"] || "1.5",
              border: a.border || undefined,
              tableLayout: a["table-layout"] || "auto",
            }}
            cellPadding={a.cellpadding || "4"}
            cellSpacing={a.cellspacing || "0"}
            dangerouslySetInnerHTML={{ __html: component.content || "" }}
          />
        </div>
      );

    default:
      return null;
  }
}

/**
 * @param {{
 *   sectionId: string,
 *   columnId: string,
 *   component: import("../../types/builder").Component,
 *   isFirst: boolean,
 *   isLast: boolean,
 *   sectionIsFirst: boolean,
 *   sectionIsLast: boolean,
 * }} props
 */
export default function ComponentItem({ sectionId, columnId, component, isFirst, isLast, sectionIsFirst, sectionIsLast }) {
  const selectedComponentId = useBuilderStore((s) => s.selectedComponentId);
  const selectComponent = useBuilderStore((s) => s.selectComponent);

  const isSelected = selectedComponentId === component.id;

  return (
    <div className={cn("group relative cursor-pointer flex", { "ring-2 ring-inset ring-orange-400": isSelected })}>
      <div className="flex-1" onClick={(e) => { e.stopPropagation(); selectComponent(sectionId, columnId, component.id); }}>
        {renderContent(component)}
      </div>
    </div>
  );
}
