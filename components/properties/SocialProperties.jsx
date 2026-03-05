import { AlignCenter, AlignLeft, AlignRight, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { ButtonGroup } from "../ui/button-group";
import { Field, FieldLabel } from "../ui/field";
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
        <Field>
          <FieldLabel>Modo</FieldLabel>
          <Select
            value={attrs.mode || "horizontal"}
            onValueChange={(v) => setAttr("mode", v)}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="horizontal">Horizontal</SelectItem>
              <SelectItem value="vertical">Vertical</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field>
          <FieldLabel>Alinhamento</FieldLabel>
          <ButtonGroup>
            {[
              { v: "left", icon: <AlignLeft size={16} /> },
              { v: "center", icon: <AlignCenter size={16} /> },
              { v: "right", icon: <AlignRight size={16} /> },
            ].map(({ v, icon }) => (
              <Button
                key={v}
                variant={(attrs.align || "center") === v ? "default" : "outline"}
                size="icon"
                onClick={() => setAttr("align", v)}
              >
                {icon}
              </Button>
            ))}
          </ButtonGroup>
        </Field>
        <div className="grid grid-cols-2 gap-2">
          <Field>
            <FieldLabel>Tamanho icone</FieldLabel>
            <Input
              value={attrs["icon-size"] || ""}
              placeholder="ex: 30px"
              onChange={(e) => setAttr("icon-size", e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel>Tamanho fonte</FieldLabel>
            <Input
              value={attrs["font-size"] || ""}
              placeholder="ex: 13px"
              onChange={(e) => setAttr("font-size", e.target.value)}
            />
          </Field>
        </div>
        <Field>
          <FieldLabel>Padding</FieldLabel>
          <Input
            value={attrs.padding || ""}
            placeholder="ex: 10px 25px"
            onChange={(e) => setAttr("padding", e.target.value)}
          />
        </Field>
      </div>
    </div>
  );
}
