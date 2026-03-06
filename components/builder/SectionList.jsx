import { Columns2, Plus, Square } from "lucide-react";
import { useEffect, useState } from "react";
import useBuilderStore from "../../store/builderStore";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import SectionItem from "./SectionItem";

const COLUMN_OPTIONS = [
  { columns: 1, label: "1 coluna", icon: <Square size={16} /> },
  { columns: 2, label: "2 colunas", icon: <Columns2 size={16} /> },
  // { columns: 3, label: "3 colunas", icon: <Columns3 size={16} /> },
];

function InsertSectionButton({ onAdd }) {
  const [open, setOpen] = useState(false);

  return (
    <Popover placement="bottom" open={open}>
      <PopoverTrigger>
        <Button variant="outline" size="icon-lg" onClick={() => setOpen(true)}>
          <Plus size={16} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[300px]'>
        <div className="grid grid-cols-2 gap-2">
          {COLUMN_OPTIONS.map(({ columns, label, icon }) => (
            <Button
              key={columns}
              variant="ghost"
              onClick={() => { onAdd(columns), setOpen(false); }}
              className="flex flex-col items-center gap-1"
              title={label}
            >
              {icon}
              <span className="text-xs text-gray-500">{label}</span>
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default function SectionList({ viewport = "desktop" }) {
  const sections = useBuilderStore((s) => s.template.sections);
  const globalConfig = useBuilderStore((s) => s.template.globalConfig);
  const addSection = useBuilderStore((s) => s.addSection);
  const clearSelection = useBuilderStore((s) => s.clearSelection);

  const canvasWidth = viewport === "mobile" ? "375px" : (globalConfig.containerWidth || "600px");

  // Injeta <link> tags no <head> para que as fontes customizadas renderizem no editor
  useEffect(() => {
    const fonts = globalConfig.fonts || [];
    const ATTR = "data-mj-font";
    // Remove links anteriores
    document.querySelectorAll(`link[${ATTR}]`).forEach((el) => el.remove());
    // Adiciona novos
    fonts.forEach(({ href }) => {
      if (!href) return;
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      link.setAttribute(ATTR, "true");
      document.head.appendChild(link);
    });
  }, [globalConfig.fonts]);

  return (
    <main
      className="flex flex-col items-center min-h-full p-8 gap-4"
      style={{ backgroundColor: globalConfig.backgroundColor || "#ffffff" }}
      onClick={clearSelection}
    >
      {/* Canvas centralizado — largura do email */}
      <div
        style={{
          width: canvasWidth,
          fontFamily: globalConfig.fontFamily || "Arial, sans-serif",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {sections.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <p className="text-sm text-gray-400 italic">Email em branco</p>
          </div>
        ) : (
          <>
            {/* Seções */}
            {sections.map((section, idx) => (
              <div key={section.id}>
                <SectionItem
                  section={section}
                  isFirst={idx === 0}
                  isLast={idx === sections.length - 1}
                />
              </div>
            ))}
          </>
        )}
      </div>
      <div>
        <InsertSectionButton onAdd={addSection} alwaysVisible />
      </div>
    </main>
  );
}
