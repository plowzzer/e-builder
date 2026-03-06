import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Image, Minus, Plus, Share2, SquarePlus, Table, TextCursor } from "lucide-react";
import { useState } from "react";
import useBuilderStore from "../../store/builderStore";
import ComponentItem from "./ComponentItem";

const COMPONENT_TYPES = [
  { type: "mj-text", label: "Texto", icon: <TextCursor size={16} /> },
  { type: "mj-image", label: "Imagem", icon: <Image size={16} /> },
  { type: "mj-button", label: "Botão", icon: <SquarePlus size={16} /> },
  { type: "mj-divider", label: "Divisor", icon: <Minus size={16} /> },
  { type: "mj-table", label: "Tabela", icon: <Table size={16} /> },
  { type: "mj-social", label: "Social", icon: <Share2 size={16} /> },
];

/**
 * @param {{ section: import("../../types/builder").Section, isFirst: boolean, isLast: boolean }} props
 */
export default function SectionItem({ section, isFirst, isLast }) {
  const [hoveredColumnId, setHoveredColumnId] = useState(null);
  const [isSectionHovered, setIsSectionHovered] = useState(false);

  const addComponent = useBuilderStore((s) => s.addComponent);
  const selectedSectionId = useBuilderStore((s) => s.selectedSectionId);
  const selectedColumnId = useBuilderStore((s) => s.selectedColumnId);
  const selectedComponentId = useBuilderStore((s) => s.selectedComponentId);
  const selectSection = useBuilderStore((s) => s.selectSection);
  const selectColumn = useBuilderStore((s) => s.selectColumn);

  const isSelected = selectedSectionId === section.id;
  const attrs = section.attributes || {};

  const showSectionHover = isSectionHovered && !hoveredColumnId && !isSelected;

  return (
    <div
      className="group relative"
      onClick={() => selectSection(section.id)}
      onMouseEnter={() => setIsSectionHovered(true)}
      onMouseLeave={() => { setIsSectionHovered(false); setHoveredColumnId(null); }}
    >
      {/* Highlight de seleção / hover da seção */}
      <div className={cn("absolute inset-0 pointer-events-none transition-all z-10", {
        "ring-2 ring-blue-500": isSelected,
        "ring-1 ring-blue-300": showSectionHover,
      })}>
        {showSectionHover && (
          <span className="absolute top-0 left-0 bg-blue-400 text-white text-[9px] px-1 py-0.5 leading-none select-none">
            Seção
          </span>
        )}
      </div>

      {/* Corpo da seção */}
      <div
        style={{
          backgroundColor: attrs["background-color"] || "transparent",
          padding: attrs.padding || "0",
        }}
      >
        <div
          style={{ display: "grid", gridTemplateColumns: section.columnList.map((col) => col.attributes?.width || "1fr").join(" ") }}
        >
          {section.columnList.map((col) => {
            const colAttrs = col.attributes || {};
            const justifyContent =
              colAttrs["vertical-align"] === "middle" ? "center" :
                colAttrs["vertical-align"] === "bottom" ? "flex-end" :
                  "flex-start";
            const isColSelected = selectedColumnId === col.id && !selectedComponentId;
            const isColHovered = hoveredColumnId === col.id && !isColSelected;
            return (
              <div
                key={col.id}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent,
                  backgroundColor: colAttrs["background-color"] || "transparent",
                  padding: colAttrs.padding || undefined,
                }}
                className="relative"
                onClick={(e) => { e.stopPropagation(); selectColumn(section.id, col.id); }}
                onMouseEnter={() => setHoveredColumnId(col.id)}
                onMouseLeave={() => setHoveredColumnId(null)}
              >
                {/* Highlight de seleção / hover da coluna */}
                <div className={cn("absolute inset-0 pointer-events-none z-10", {
                  "ring-2 ring-inset ring-teal-500": isColSelected,
                  "ring-1 ring-inset ring-teal-300": isColHovered,
                })}>
                  {isColHovered && (
                    <span className="absolute top-0 left-0 bg-teal-400 text-white text-[9px] px-1 py-0.5 leading-none select-none">
                      Coluna
                    </span>
                  )}
                </div>
                {/* Componentes da coluna */}
                {col.components.map((comp, idx) => (
                  <ComponentItem
                    key={comp.id}
                    sectionId={section.id}
                    columnId={col.id}
                    component={comp}
                    isFirst={idx === 0}
                    isLast={idx === col.components.length - 1}
                    sectionIsFirst={isFirst}
                    sectionIsLast={isLast}
                  />
                ))}

                {/* Botão de adicionar componente */}
                {isSelected && (
                  <div
                    className="absolute bottom-[-35px] left-1/2 -translate-x-1/2 z-20"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6 rounded-full"
                          title="Adicionar componente"
                        >
                          <Plus size={12} />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className='w-[400px]'>
                        <div className="grid grid-cols-3 gap-2">
                          {COMPONENT_TYPES.map(({ type, label, icon }) => (
                            <Button
                              key={type}
                              variant="ghost"
                              className="flex flex-col items-center gap-1"
                              onClick={() => addComponent(section.id, col.id, type)}
                              title={label}
                            >
                              {icon}
                              <span className="text-xs text-gray-500">{label}</span>
                            </Button>
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                )}

              </div>
            );
          })}
        </div>
      </div>
    </div>

  );
}
