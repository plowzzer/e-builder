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
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowDown, ArrowUp, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import useBuilderStore from "../../store/builderStore";
import ButtonProperties from "../properties/ButtonProperties";
import DividerProperties from "../properties/DividerProperties";
import ImageProperties from "../properties/ImageProperties";
import TableProperties from "../properties/TableProperties";
import TextProperties from "../properties/TextProperties";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { Field, FieldLabel } from "../ui/field";
import GlobalConfigPanel from "./GlobalConfigPanel";

const TYPE_LABELS = {
  "mj-text": "Texto",
  "mj-image": "Imagem",
  "mj-button": "Botão",
  "mj-divider": "Divisor",
  "mj-table": "Tabela",
};

const PANELS = {
  "mj-text": TextProperties,
  "mj-image": ImageProperties,
  "mj-button": ButtonProperties,
  "mj-divider": DividerProperties,
  "mj-table": TableProperties,
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
  }, [selectedComponentId]);
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

  if (selectedSectionId && selectedColumnId && selectedComponentId) {
    section = template.sections.find((s) => s.id === selectedSectionId) || null;
    column = section?.columnList.find((c) => c.id === selectedColumnId) || null;
    if (column) {
      const idx = column.components.findIndex((c) => c.id === selectedComponentId);
      if (idx !== -1) {
        component = column.components[idx];
        isFirst = idx === 0;
        isLast = idx === column.components.length - 1;
      }
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
  if (!component) {
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

  const Panel = PANELS[component.type];
  const colAttrs = column?.attributes || {};
  const secAttrs = section?.attributes || {};

  return (
    <>
      <div className="h-full flex flex-col overflow-hidden">
        {/* Header — tipo + ações */}
        <header className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white shrink-0">
          <span className="text-sm font-medium text-gray-700">
            {TYPE_LABELS[component.type] || component.type}
          </span>

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
        </header>

        <div className="flex-1 overflow-auto">
          <Accordion type="single" collapsible value={openAccordion} onValueChange={setOpenAccordion}>
            <AccordionItem value="section" className="border-b border-gray-100">
              <AccordionTrigger className="px-4">Seção</AccordionTrigger>
              <AccordionContent>
                {/* Propriedades da seção */}
                <div className="px-4 py-4 space-y-2.5">
                  <p className={sectionLabelCls}>Seção</p>
                  <Field>
                    <FieldLabel>Cor de fundo</FieldLabel>
                    <div className="flex gap-1.5 items-center">
                      <Input
                        type="color"
                        className="h-9 w-9 cursor-pointer rounded-md border border-input p-1 shrink-0"
                        value={secAttrs["background-color"] || "#ffffff"}
                        onChange={(e) => setSecAttr("background-color", e.target.value)}
                      />
                      <Input
                        value={secAttrs["background-color"] || ""}
                        placeholder="ex: #ffffff"
                        onChange={(e) => setSecAttr("background-color", e.target.value)}
                      />
                    </div>
                  </Field>
                  <Field>
                    <FieldLabel>Padding</FieldLabel>
                    <Input
                      value={secAttrs.padding || ""}
                      placeholder="ex: 20px 0"
                      onChange={(e) => setSecAttr("padding", e.target.value)}
                    />
                  </Field>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="column" className="border-b border-gray-100">
              <AccordionTrigger className="px-4">Coluna</AccordionTrigger>
              <AccordionContent>
                {/* Propriedades da coluna */}
                <div className="px-4 py-4 space-y-2.5">
                  <p className={sectionLabelCls}>Coluna</p>
                  <Field>
                    <FieldLabel>Alinhamento vertical</FieldLabel>
                    <Select
                      value={colAttrs["vertical-align"] || "top"}
                      onValueChange={(v) => setColAttr("vertical-align", v)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="top">Top</SelectItem>
                        <SelectItem value="middle">Middle</SelectItem>
                        <SelectItem value="bottom">Bottom</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field>
                    <FieldLabel>Cor de fundo</FieldLabel>
                    <div className="flex gap-1.5 items-center">
                      <Input
                        type="color"
                        className="h-9 w-9 cursor-pointer rounded-md border border-input p-1 shrink-0"
                        value={colAttrs["background-color"] || "#ffffff"}
                        onChange={(e) => setColAttr("background-color", e.target.value)}
                      />
                      <Input
                        value={colAttrs["background-color"] || ""}
                        placeholder="ex: #ffffff"
                        onChange={(e) => setColAttr("background-color", e.target.value)}
                      />
                    </div>
                  </Field>
                  <Field>
                    <FieldLabel>Padding</FieldLabel>
                    <Input
                      value={colAttrs.padding || ""}
                      placeholder="ex: 20px"
                      onChange={(e) => setColAttr("padding", e.target.value)}
                    />
                  </Field>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="component" className="border-b border-gray-100">
              <AccordionTrigger className="px-4">Elemento</AccordionTrigger>
              <AccordionContent>
                <div className="px-4 pb-4pt-4 space-y-2.5">
                  {/* Propriedades do elemento */}
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
