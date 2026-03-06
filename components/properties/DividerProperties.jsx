import { ColorField } from "../fields/color-field";
import { SelectField } from "../fields/select-field";
import { TextField } from "../fields/text-field";

const BORDER_STYLE_OPTIONS = [
  { value: "solid", label: "Solid" },
  { value: "dashed", label: "Dashed" },
  { value: "dotted", label: "Dotted" },
];

/**
 * @param {{
 *   attrs: Object,
 *   setAttr: (key: string, value: string) => void,
 * }} props
 */
export default function DividerProperties({ attrs, setAttr }) {
  return (
    <div className="space-y-2.5">
      <ColorField label="Cor" value={attrs["border-color"]} onChange={(v) => setAttr("border-color", v)} placeholder="ex: #cccccc" />
      <SelectField label="Estilo" value={attrs["border-style"] || "solid"} onChange={(v) => setAttr("border-style", v)} options={BORDER_STYLE_OPTIONS} />
      <TextField label="Espessura" value={attrs["border-width"]} onChange={(v) => setAttr("border-width", v)} placeholder="ex: 1px" />
      <TextField label="Padding" value={attrs.padding} onChange={(v) => setAttr("padding", v)} placeholder="ex: 10px 0" />
    </div>
  );
}
