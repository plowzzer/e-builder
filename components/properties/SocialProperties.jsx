import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { AlignField } from "../fields/align-field";
import { ColorField } from "../fields/color-field";
import { SelectField } from "../fields/select-field";
import { TextField } from "../fields/text-field";
import { Button } from "../ui/button";

const sectionLabelCls = "text-[10px] font-semibold text-gray-400 uppercase tracking-wide";

const EMPTY_ELEMENT = { name: "", href: "", label: "", src: "", backgroundColor: "", iconColor: "" };

/**
 * @param {{
 *   attrs: Object,
 *   content: string,
 *   setAttr: (key: string, value: string) => void,
 *   setContent: (value: string) => void,
 * }} props
 */
export default function SocialProperties({ attrs, content, setAttr, setContent }) {
  const [newEl, setNewEl] = useState(EMPTY_ELEMENT);

  let elements = [];
  try {
    elements = content ? JSON.parse(content) : [];
  } catch {
    elements = [];
  }

  function save(updated) {
    setContent(JSON.stringify(updated));
  }

  function addElement() {
    if (!newEl.name.trim()) return;
    save([...elements, { ...newEl, name: newEl.name.trim() }]);
    setNewEl(EMPTY_ELEMENT);
  }

  function removeElement(idx) {
    save(elements.filter((_, i) => i !== idx));
  }

  function updateElement(idx, key, value) {
    save(elements.map((el, i) => i === idx ? { ...el, [key]: value } : el));
  }

  return (
    <div className="space-y-4">
      {/* Elementos */}
      <div className="space-y-2.5">
        <p className={sectionLabelCls}>Redes sociais</p>

        {elements.length === 0 && (
          <p className="text-xs text-gray-400 italic">Nenhuma rede adicionada.</p>
        )}

        {elements.map((el, idx) => (
          <div key={idx} className="rounded-md border border-gray-200 p-2.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-600">{el.name || "Sem nome"}</span>
              <button onClick={() => removeElement(idx)} className="text-red-400 hover:text-red-600">
                <Trash2 size={13} />
              </button>
            </div>
            <ElementFields el={el} onChange={(key, value) => updateElement(idx, key, value)} />
          </div>
        ))}

        {/* Adicionar nova rede */}
        <div className="rounded-md border border-dashed border-gray-300 p-2.5 space-y-2">
          <p className={sectionLabelCls}>Adicionar</p>
          <ElementFields el={newEl} onChange={(key, value) => setNewEl((prev) => ({ ...prev, [key]: value }))} />
          <Button variant="outline" size="sm" className="w-full gap-1" onClick={addElement}>
            <Plus size={14} /> Adicionar rede
          </Button>
        </div>
      </div>

      <hr className="border-gray-100" />

      {/* Layout */}
      <div className="space-y-2.5">
        <p className={sectionLabelCls}>Layout</p>
        <SelectField
          label="Modo"
          value={attrs.mode || "horizontal"}
          onChange={(v) => setAttr("mode", v)}
          options={[
            { value: "horizontal", label: "Horizontal" },
            { value: "vertical", label: "Vertical" },
          ]}
        />
        <AlignField label="Alinhamento" value={attrs.align} onChange={(v) => setAttr("align", v)} defaultValue="center" />
        <div className="grid grid-cols-2 gap-2">
          <TextField label="Tamanho ícone" value={attrs["icon-size"]} onChange={(v) => setAttr("icon-size", v)} placeholder="ex: 30px" />
          <TextField label="Tamanho fonte" value={attrs["font-size"]} onChange={(v) => setAttr("font-size", v)} placeholder="ex: 13px" />
        </div>
        <TextField label="Padding" value={attrs.padding} onChange={(v) => setAttr("padding", v)} placeholder="ex: 10px 25px" />
      </div>
    </div>
  );
}

/** Campos individuais de um elemento social */
function ElementFields({ el, onChange }) {
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <TextField label="Nome" value={el.name} onChange={(v) => onChange("name", v)} placeholder="ex: facebook" />
        <TextField label="Label" value={el.label} onChange={(v) => onChange("label", v)} placeholder="ex: Facebook" />
      </div>
      <TextField label="Link (href)" value={el.href} onChange={(v) => onChange("href", v)} placeholder="https://..." />
      <TextField label="Ícone (src)" value={el.src} onChange={(v) => onChange("src", v)} placeholder="https://...imagem.png" />
      <div className="grid grid-cols-2 gap-2">
        <ColorField label="Cor de fundo" value={el.backgroundColor} onChange={(v) => onChange("backgroundColor", v)} />
        <ColorField label="Cor do ícone" value={el.iconColor} onChange={(v) => onChange("iconColor", v)} />
      </div>
    </div>
  );
}
