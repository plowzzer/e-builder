import { AlignField } from "../fields/align-field";
import { ColorField } from "../fields/color-field";
import { SelectField } from "../fields/select-field";
import { TextField } from "../fields/text-field";
import { Field, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";

const sectionLabelCls = "text-[10px] font-semibold text-gray-400 uppercase tracking-wide";

const FONT_WEIGHT_OPTIONS = [
  { value: "normal", label: "Normal" },
  { value: "bold", label: "Bold" },
  { value: "700", label: "Bold 700" },
];

/**
 * @param {{
 *   attrs: Object,
 *   content: string,
 *   setAttr: (key: string, value: string) => void,
 *   setContent: (value: string) => void,
 * }} props
 */
export default function ButtonProperties({ attrs, content, setAttr, setContent }) {
  return (
    <div className="space-y-4">
      {/* Conteúdo */}
      <div className="space-y-2.5">
        <p className={sectionLabelCls}>Conteúdo</p>
        <Field>
          <FieldLabel>Texto do botão</FieldLabel>
          <Input value={content || ""} onChange={(e) => setContent(e.target.value)} />
        </Field>
        <TextField label="Link (href)" value={attrs.href} onChange={(v) => setAttr("href", v)} placeholder="https://..." />
      </div>

      <hr className="border-gray-100" />

      {/* Estilo */}
      <div className="space-y-2.5">
        <p className={sectionLabelCls}>Estilo</p>
        <div className="grid grid-cols-2 gap-2">
          <ColorField label="Cor de fundo" value={attrs["background-color"]} onChange={(v) => setAttr("background-color", v)} placeholder="ex: #4A90E2" />
          <ColorField label="Cor do texto" value={attrs.color} onChange={(v) => setAttr("color", v)} placeholder="ex: #ffffff" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <TextField label="Tamanho fonte" value={attrs["font-size"]} onChange={(v) => setAttr("font-size", v)} placeholder="ex: 14px" />
          <SelectField label="Peso" value={attrs["font-weight"] || "normal"} onChange={(v) => setAttr("font-weight", v)} options={FONT_WEIGHT_OPTIONS} />
        </div>
        <TextField label="Border radius" value={attrs["border-radius"]} onChange={(v) => setAttr("border-radius", v)} placeholder="ex: 4px" />
      </div>

      <hr className="border-gray-100" />

      {/* Layout */}
      <div className="space-y-2.5">
        <p className={sectionLabelCls}>Layout</p>
        <div className="grid grid-cols-2 gap-2">
          <TextField label="Padding externo" value={attrs.padding} onChange={(v) => setAttr("padding", v)} placeholder="ex: 10px 25px" />
          <TextField label="Padding interno" value={attrs["inner-padding"]} onChange={(v) => setAttr("inner-padding", v)} placeholder="ex: 10px 25px" />
        </div>
        <AlignField label="Alinhamento" value={attrs.align} onChange={(v) => setAttr("align", v)} defaultValue="center" />
      </div>
    </div>
  );
}
