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
import { ArrowDown, ArrowUp, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import useBuilderStore from "../../store/builderStore";
import { ColorField } from "../fields/color-field";
import { SelectField } from "../fields/select-field";
import { TextField } from "../fields/text-field";
import ButtonProperties from "../properties/ButtonProperties";
import DividerProperties from "../properties/DividerProperties";
import ImageProperties from "../properties/ImageProperties";
import TableProperties from "../properties/TableProperties";
import TextProperties from "../properties/TextProperties";
import SocialProperties from "../properties/SocialProperties";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import GlobalConfigPanel from "./GlobalConfigPanel";

const VERTICAL_ALIGN_OPTIONS = [
  { value: "top", label: "Top" },
  { value: "middle", label: "Middle" },
  { value: "bottom", label: "Bottom" },
];

const TYPE_LABELS = {
  "mj-text": "Texto",
  "mj-image": "Imagem",
  "mj-button": "Botão",
  "mj-divider": "Divisor",
  "mj-table": "Tabela",
  "mj-social": "Social",
};

const PANELS = {
  "mj-text": TextProperties,
  "mj-image": ImageProperties,
  "mj-button": ButtonProperties,
  "mj-divider": DividerProperties,
  "mj-table": TableProperties,
  "mj-social": SocialProperties,
};

const sectionLabelCls = "text-[10px] font-semibold text-gray-400 uppercase tracking-wide";

export default function PropertiesPanel() {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [openAccordion, setOpenAccordion] = useState("component");

  const template = useBuilderStore((s) => s.template);
  const selectedSectionId = useBuilderStore((s) => s.selectedSectionId);
  const selectedColumnId = useBuilderStore((s) => s.selectedColumnId);
  const selectedComponentId = useBuilderStore((s) => s.selectedComponentId);

  useEffect(() => {
    if (selectedComponentId) setOpenAccordion("component");
    else if (selectedColumnId) setOpenAccordion("column");
    else if (selectedSectionId) setOpenAccordion("section");
  }, [selectedSectionId, selectedColumnId, selectedComponentId]);
  const removeComponent = useBuilderStore((s) => s.removeComponent);
  const moveComponentUp = useBuilderStore((s) => s.moveComponentUp);
  const moveComponentDown = useBuilderStore((s) => s.moveComponentDown);
  const updateComponent = useBuilderStore((s) => s.updateComponent);
  const updateSectionAttributes = useBuilderStore((s) => s.updateSectionAttributes);
  const updateColumnAttributes = useBuilderStore((s) => s.updateColumnAttributes);

  let component = null;
  let column = null;
  let section = null;
  let isFirst = false;
  let isLast = false;

  if (selectedSectionId) {
    section = template.sections.find((s) => s.id === selectedSectionId) || null;
  }
  if (section && selectedColumnId) {
    column = section.columnList.find((c) => c.id === selectedColumnId) || null;
  }
  if (column && selectedComponentId) {
    const idx = column.components.findIndex((c) => c.id === selectedComponentId);
    if (idx !== -1) {
      component = column.components[idx];
      isFirst = idx === 0;
      isLast = idx === column.components.length - 1;
    }
  }

  function setAttr(key, value) {
    updateComponent(selectedSectionId, selectedColumnId, selectedComponentId, {
      attributes: { ...component.attributes, [key]: value },
    });
  }

  function setContent(value) {
    updateComponent(selectedSectionId, selectedColumnId, selectedComponentId, { content: value });
  }

  function setColAttr(key, value) {
    updateColumnAttributes(selectedSectionId, selectedColumnId, { [key]: value });
  }

  function setSecAttr(key, value) {
    updateSectionAttributes(selectedSectionId, { [key]: value });
  }

  // Nada selecionado → GlobalConfigPanel
  if (!selectedSectionId) {
    return (
      <div className="h-full flex flex-col overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200 shrink-0">
          <span className={sectionLabelCls}>Config global</span>
        </div>
        <div className="flex-1 overflow-auto p-4">
          <GlobalConfigPanel />
        </div>
      </div>
    );
  }

  const Panel = component ? PANELS[component.type] : null;
  const colAttrs = column?.attributes || {};
  const secAttrs = section?.attributes || {};

  let headerLabel = "Seção";
  if (component) headerLabel = TYPE_LABELS[component.type] || component.type;
  else if (column) headerLabel = "Coluna";

  return (
    <>
      <div className="h-full flex flex-col overflow-hidden">
        {/* Header — tipo + ações */}
        <header className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white shrink-0">
          <span className="text-sm font-medium text-gray-700">{headerLabel}</span>

          {component && (
            <div className="flex items-center gap-0.5">
              <Button
                variant="ghost"
                size="icon"
                disabled={isFirst}
                onClick={() => moveComponentUp(selectedSectionId, selectedColumnId, selectedComponentId)}
                className="h-7 w-7 disabled:opacity-30"
                title="Mover para cima"
              >
                <ArrowUp size={14} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                disabled={isLast}
                onClick={() => moveComponentDown(selectedSectionId, selectedColumnId, selectedComponentId)}
                className="h-7 w-7 disabled:opacity-30"
                title="Mover para baixo"
              >
                <ArrowDown size={14} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setConfirmDelete(true)}
                className="h-7 w-7 text-red-400 hover:text-red-600 hover:bg-red-50"
                title="Remover elemento"
              >
                <Trash2 size={14} />
              </Button>
            </div>
          )}
        </header>

        <div className="flex-1 overflow-auto">
          <Accordion type="single" collapsible value={openAccordion} onValueChange={setOpenAccordion}>
            <AccordionItem value="section" className="border-b border-gray-100">
              <AccordionTrigger className="px-4">Seção</AccordionTrigger>
              <AccordionContent>
                {/* Propriedades da seção */}
                <div className="px-4 py-4 space-y-2.5">
                  <p className={sectionLabelCls}>Seção</p>
                  <ColorField label="Cor de fundo" value={secAttrs["background-color"]} onChange={(v) => setSecAttr("background-color", v)} />
                  <TextField label="Padding" value={secAttrs.padding} onChange={(v) => setSecAttr("padding", v)} placeholder="ex: 20px 0" />
                </div>
              </AccordionContent>
            </AccordionItem>

            {column && (
              <AccordionItem value="column" className="border-b border-gray-100">
                <AccordionTrigger className="px-4">Coluna</AccordionTrigger>
                <AccordionContent>
                  {/* Propriedades da coluna */}
                  <div className="px-4 py-4 space-y-2.5">
                    <p className={sectionLabelCls}>Coluna</p>
                    {section && section.columnList.length > 1 && (
                      <TextField label="Largura" value={colAttrs.width} onChange={(v) => setColAttr("width", v)} placeholder="ex: 200px ou 30%" />
                    )}
                    <SelectField label="Alinhamento vertical" value={colAttrs["vertical-align"] || "top"} onChange={(v) => setColAttr("vertical-align", v)} options={VERTICAL_ALIGN_OPTIONS} />
                    <ColorField label="Cor de fundo" value={colAttrs["background-color"]} onChange={(v) => setColAttr("background-color", v)} />
                    <TextField label="Padding" value={colAttrs.padding} onChange={(v) => setColAttr("padding", v)} placeholder="ex: 20px" />
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}

            {component && (
              <AccordionItem value="component" className="border-b border-gray-100">
                <AccordionTrigger className="px-4">Elemento</AccordionTrigger>
                <AccordionContent>
                  <div className="px-4 pb-4 pt-4 space-y-2.5">
                    {Panel && (
                      <Panel
                        attrs={component.attributes}
                        content={component.content}
                        setAttr={setAttr}
                        setContent={setContent}
                      />
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}
          </Accordion>
        </div>
      </div>

      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover elemento?</AlertDialogTitle>
            <AlertDialogDescription>
              Este elemento será removido permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => removeComponent(selectedSectionId, selectedColumnId, selectedComponentId)}
            >
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
