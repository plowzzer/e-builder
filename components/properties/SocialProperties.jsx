import { Trash2 } from "lucide-react";
import { useState } from "react";
import { AlignField } from "../fields/align-field";
import { SelectField } from "../fields/select-field";
import { TextField } from "../fields/text-field";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

const sectionLabelCls = "text-[10px] font-semibold text-gray-400 uppercase tracking-wide";

const NETWORKS = [
  "facebook", "twitter", "instagram", "linkedin", "youtube",
  "github", "pinterest", "medium", "dribbble", "vimeo",
  "soundcloud", "snapchat", "tumblr", "xing",
];

const NETWORK_LABELS = {
  facebook: "Facebook", twitter: "Twitter", instagram: "Instagram",
  linkedin: "LinkedIn", youtube: "YouTube", github: "GitHub",
  pinterest: "Pinterest", medium: "Medium", dribbble: "Dribbble",
  vimeo: "Vimeo", soundcloud: "SoundCloud", snapchat: "Snapchat",
  tumblr: "Tumblr", xing: "Xing",
};

/**
 * @param {{
 *   attrs: Object,
 *   content: string,
 *   setAttr: (key: string, value: string) => void,
 *   setContent: (value: string) => void,
 * }} props
 */
export default function SocialProperties({ attrs, content, setAttr, setContent }) {
  const [newName, setNewName] = useState("facebook");
  const [newHref, setNewHref] = useState("");
  const [newLabel, setNewLabel] = useState("");

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
    save([...elements, { name: newName, href: newHref, label: newLabel || NETWORK_LABELS[newName] || newName }]);
    setNewHref("");
    setNewLabel("");
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
              <span className="text-xs font-medium text-gray-600 capitalize">{el.name}</span>
              <button
                onClick={() => removeElement(idx)}
                className="text-red-400 hover:text-red-600"
              >
                <Trash2 size={13} />
              </button>
            </div>
            <Input
              value={el.href || ""}
              placeholder="https://..."
              onChange={(e) => updateElement(idx, "href", e.target.value)}
            />
            <Input
              value={el.label || ""}
              placeholder="Label"
              onChange={(e) => updateElement(idx, "label", e.target.value)}
            />
          </div>
        ))}

        {/* Adicionar nova rede */}
        <div className="rounded-md border border-dashed border-gray-300 p-2.5 space-y-2">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Adicionar</p>
          <Select value={newName} onValueChange={setNewName}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {NETWORKS.map((n) => (
                <SelectItem key={n} value={n}>{NETWORK_LABELS[n] || n}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            value={newHref}
            placeholder="https://..."
            onChange={(e) => setNewHref(e.target.value)}
          />
          <Input
            value={newLabel}
            placeholder={`Label (ex: ${NETWORK_LABELS[newName]})`}
            onChange={(e) => setNewLabel(e.target.value)}
          />
          <Button variant="outline" className="w-full" onClick={addElement}>
            + Adicionar rede
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
          <TextField label="Tamanho icone" value={attrs["icon-size"]} onChange={(v) => setAttr("icon-size", v)} placeholder="ex: 30px" />
          <TextField label="Tamanho fonte" value={attrs["font-size"]} onChange={(v) => setAttr("font-size", v)} placeholder="ex: 13px" />
        </div>
        <TextField label="Padding" value={attrs.padding} onChange={(v) => setAttr("padding", v)} placeholder="ex: 10px 25px" />
      </div>
    </div>
  );
}
