import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp, Image, Minus, Plus, SquarePlus, Table, TextCursor, Trash2 } from "lucide-react";
import { useState } from "react";
import useBuilderStore from "../../store/builderStore";
import ComponentItem from "./ComponentItem";

const COMPONENT_TYPES = [
  { type: "mj-text", label: "Texto", icon: <TextCursor size={16} /> },
  { type: "mj-image", label: "Imagem", icon: <Image size={16} /> },
  { type: "mj-button", label: "Botão", icon: <SquarePlus size={16} /> },
  { type: "mj-divider", label: "Divisor", icon: <Minus size={16} /> },
  { type: "mj-table", label: "Tabela", icon: <Table size={16} /> },
];

/**
 * @param {{ section: import("../../types/builder").Section, isFirst: boolean, isLast: boolean }} props
 */
export default function SectionItem({ section, isFirst, isLast }) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const moveSectionUp = useBuilderStore((s) => s.moveSectionUp);
  const moveSectionDown = useBuilderStore((s) => s.moveSectionDown);
  const removeSection = useBuilderStore((s) => s.removeSection);
  const addComponent = useBuilderStore((s) => s.addComponent);
  const selectedSectionId = useBuilderStore((s) => s.selectedSectionId);
  const selectSection = useBuilderStore((s) => s.selectSection);

  const isSelected = selectedSectionId === section.id;
  const attrs = section.attributes || {};

  return (
    <>
    <div
      className="group relative"
      onClick={() => selectSection(section.id)}
    >
      {/* Highlight de seleção / hover */}
      <div
        className={`absolute inset-0 pointer-events-none transition-all z-10 ${isSelected && "ring-2 ring-blue-500"}`}
      />

      {/* Toolbar da seção — topo direito, visível ao hover */}
      <ButtonGroup className={cn("absolute -left-12 top-[50%] translate-y-[-50%] z-20 border border-gray-200 bg-white rounded-full opacity-0", { "opacity-100": isSelected })} orientation="vertical">
        <span className="text-[8px] uppercase text-gray-500 absolute left-1/2 -translate-x-1/2 -top-4">Sessão</span>
        <Button disabled={isFirst} onClick={() => moveSectionUp(section.id)} variant="icon-sm">
          <ArrowUp size={16} />
        </Button>
        <Button disabled={isLast} onClick={() => moveSectionDown(section.id)} variant="icon-sm">
          <ArrowDown size={16} />
        </Button>
        <Button onClick={(e) => { e.stopPropagation(); setConfirmDelete(true); }} variant="icon-sm">
          <Trash2 size={16} />
        </Button>
      </ButtonGroup>

      {/* Corpo da seção */}
      <div
        style={{
          backgroundColor: attrs["background-color"] || "transparent",
          padding: attrs.padding || "0",
        }}
      >
        <div
          style={{ display: "grid", gridTemplateColumns: `repeat(${section.columnList.length}, 1fr)` }}
        >
          {section.columnList.map((col) => {
            const colAttrs = col.attributes || {};
            const justifyContent =
              colAttrs["vertical-align"] === "middle" ? "center" :
              colAttrs["vertical-align"] === "bottom" ? "flex-end" :
              "flex-start";
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
            >
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
                      <div className="flex justify-between">
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

      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover seção?</AlertDialogTitle>
            <AlertDialogDescription>
              Todos os componentes desta seção serão removidos. Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={() => removeSection(section.id)}>
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
