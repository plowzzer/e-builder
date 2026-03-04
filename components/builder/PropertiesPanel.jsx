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
import { useState } from "react";
import useBuilderStore from "../../store/builderStore";

const TYPE_LABELS = {
  "mj-text": "Texto",
  "mj-image": "Imagem",
  "mj-button": "Botão",
  "mj-divider": "Divisor",
};

export default function PropertiesPanel() {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const template = useBuilderStore((s) => s.template);
  const selectedSectionId = useBuilderStore((s) => s.selectedSectionId);
  const selectedColumnId = useBuilderStore((s) => s.selectedColumnId);
  const selectedComponentId = useBuilderStore((s) => s.selectedComponentId);
  const removeComponent = useBuilderStore((s) => s.removeComponent);
  const moveComponentUp = useBuilderStore((s) => s.moveComponentUp);
  const moveComponentDown = useBuilderStore((s) => s.moveComponentDown);

  let component = null;
  let isFirst = false;
  let isLast = false;

  if (selectedSectionId && selectedColumnId && selectedComponentId) {
    const section = template.sections.find((s) => s.id === selectedSectionId);
    const column = section?.columnList.find((c) => c.id === selectedColumnId);
    if (column) {
      const idx = column.components.findIndex((c) => c.id === selectedComponentId);
      if (idx !== -1) {
        component = column.components[idx];
        isFirst = idx === 0;
        isLast = idx === column.components.length - 1;
      }
    }
  }

  if (!component) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <p className="text-sm text-gray-400 text-center">
          Clique em um elemento para editar suas propriedades.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="h-full flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white shrink-0">
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
        </div>

        <div className="flex-1 overflow-auto p-4">
          <p className="text-sm text-gray-400">
            Propriedades de {TYPE_LABELS[component.type]} — em breve
          </p>
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
