import { AlignField } from "../fields/align-field";
import { ColorField } from "../fields/color-field";
import { SelectField } from "../fields/select-field";
import { TextField } from "../fields/text-field";
import { Field, FieldLabel } from "../ui/field";
import { Textarea } from "../ui/textarea";

const sectionLabelCls = "text-[10px] font-semibold text-gray-400 uppercase tracking-wide";

const FONT_WEIGHT_OPTIONS = [
  { value: "normal", label: "Normal" },
  { value: "300", label: "Light 300" },
  { value: "500", label: "Medium 500" },
  { value: "bold", label: "Bold" },
  { value: "700", label: "Bold 700" },
];

const TEXT_DECORATION_OPTIONS = [
  { value: "none", label: "None" },
  { value: "underline", label: "Underline" },
  { value: "overline", label: "Overline" },
  { value: "line-through", label: "Line-through" },
];

const TEXT_TRANSFORM_OPTIONS = [
  { value: "none", label: "None" },
  { value: "capitalize", label: "Capitalize" },
  { value: "uppercase", label: "Uppercase" },
  { value: "lowercase", label: "Lowercase" },
];

/**
 * @param {{
 *   attrs: Object,
 *   content: string,
 *   setAttr: (key: string, value: string) => void,
 *   setContent: (value: string) => void,
 * }} props
 */
export default function TextProperties({ attrs, content, setAttr, setContent }) {
  return (
    <div className="space-y-4">
      {/* Conteúdo */}
      <Field>
        <FieldLabel>Conteúdo (HTML)</FieldLabel>
        <Textarea
          className="min-h-20 resize-y font-mono text-xs"
          value={content || ""}
          onChange={(e) => setContent(e.target.value)}
        />
      </Field>

      <hr className="border-gray-100" />

      {/* Tipografia */}
      <div className="space-y-2.5">
        <p className={sectionLabelCls}>Tipografia</p>
        <div className="grid grid-cols-2 gap-2">
          <TextField label="Tamanho" value={attrs["font-size"]} onChange={(v) => setAttr("font-size", v)} placeholder="ex: 14px" />
          <SelectField label="Peso" value={attrs["font-weight"] || "normal"} onChange={(v) => setAttr("font-weight", v)} options={FONT_WEIGHT_OPTIONS} />
          <TextField label="Line height" value={attrs["line-height"]} onChange={(v) => setAttr("line-height", v)} placeholder="ex: 1.5" />
        </div>
        <ColorField label="Cor" value={attrs.color} onChange={(v) => setAttr("color", v)} placeholder="ex: #000000" />
        <TextField label="Fonte" value={attrs["font-family"]} onChange={(v) => setAttr("font-family", v)} placeholder="ex: Arial, sans-serif" />
      </div>

      <hr className="border-gray-100" />

      {/* Decoração */}
      <div className="space-y-2.5">
        <p className={sectionLabelCls}>Decoração</p>
        <div className="grid grid-cols-2 gap-2">
          <SelectField label="Text decoration" value={attrs["text-decoration"] || "none"} onChange={(v) => setAttr("text-decoration", v)} options={TEXT_DECORATION_OPTIONS} />
          <SelectField label="Text transform" value={attrs["text-transform"] || "none"} onChange={(v) => setAttr("text-transform", v)} options={TEXT_TRANSFORM_OPTIONS} />
        </div>
      </div>

      <hr className="border-gray-100" />

      {/* Layout */}
      <div className="space-y-2.5">
        <p className={sectionLabelCls}>Layout</p>
        <TextField
          label="Padding"
          value={attrs.padding}
          onChange={(v) => setAttr("padding", v)}
          placeholder="ex: 16px"
          description="Ex: 10px, 10px 5px, 10px 5px 15px, 10px 5px 15px 20px"
        />
        <AlignField label="Alinhamento" value={attrs.align} onChange={(v) => setAttr("align", v)} defaultValue="left" />
      </div>
    </div>
  );
}
