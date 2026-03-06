import { AlignField } from "../fields/align-field";
import { ColorField } from "../fields/color-field";
import { SelectField } from "../fields/select-field";
import { TextField } from "../fields/text-field";
import { Field, FieldDescription, FieldLabel } from "../ui/field";
import { Textarea } from "../ui/textarea";

const sectionLabelCls = "text-[10px] font-semibold text-gray-400 uppercase tracking-wide";

const TABLE_LAYOUT_OPTIONS = [
  { value: "auto", label: "Auto" },
  { value: "fixed", label: "Fixed" },
];

const DEFAULT_CONTENT = `<tr>
  <th>Coluna 1</th>
  <th>Coluna 2</th>
  <th>Coluna 3</th>
</tr>
<tr>
  <td>Dado 1</td>
  <td>Dado 2</td>
  <td>Dado 3</td>
</tr>`;

/**
 * @param {{
 *   attrs: Object,
 *   content: string,
 *   setAttr: (key: string, value: string) => void,
 *   setContent: (value: string) => void,
 * }} props
 */
export default function TableProperties({ attrs, content, setAttr, setContent }) {
  return (
    <div className="space-y-4">
      {/* Conteúdo */}
      <Field>
        <FieldLabel>Conteúdo (HTML)</FieldLabel>
        <Textarea
          className="min-h-32 resize-y font-mono text-xs"
          value={content || DEFAULT_CONTENT}
          onChange={(e) => setContent(e.target.value)}
        />
        <FieldDescription>Use tags &lt;tr&gt;, &lt;th&gt; e &lt;td&gt; para montar a tabela.</FieldDescription>
      </Field>

      <hr className="border-gray-100" />

      {/* Borda */}
      <div className="space-y-2.5">
        <p className={sectionLabelCls}>Borda</p>
        <TextField label="Border" value={attrs.border} onChange={(v) => setAttr("border", v)} placeholder="ex: 1px solid #cccccc" description="Atalho completo: espessura, estilo e cor." />
        <div className="grid grid-cols-2 gap-2">
          <TextField label="Cell padding" value={attrs.cellpadding} onChange={(v) => setAttr("cellpadding", v)} placeholder="ex: 4" />
          <TextField label="Cell spacing" value={attrs.cellspacing} onChange={(v) => setAttr("cellspacing", v)} placeholder="ex: 0" />
        </div>
      </div>

      <hr className="border-gray-100" />

      {/* Tipografia */}
      <div className="space-y-2.5">
        <p className={sectionLabelCls}>Tipografia</p>
        <div className="grid grid-cols-2 gap-2">
          <TextField label="Tamanho" value={attrs["font-size"]} onChange={(v) => setAttr("font-size", v)} placeholder="ex: 14px" />
          <TextField label="Line height" value={attrs["line-height"]} onChange={(v) => setAttr("line-height", v)} placeholder="ex: 1.5" />
        </div>
        <ColorField label="Cor do texto" value={attrs.color} onChange={(v) => setAttr("color", v)} placeholder="ex: #000000" />
        <TextField label="Fonte" value={attrs["font-family"]} onChange={(v) => setAttr("font-family", v)} placeholder="ex: Arial, sans-serif" />
      </div>

      <hr className="border-gray-100" />

      {/* Layout */}
      <div className="space-y-2.5">
        <p className={sectionLabelCls}>Layout</p>
        <SelectField label="Table layout" value={attrs["table-layout"] || "auto"} onChange={(v) => setAttr("table-layout", v)} options={TABLE_LAYOUT_OPTIONS} />
        <TextField label="Padding" value={attrs.padding} onChange={(v) => setAttr("padding", v)} placeholder="ex: 10px" />
        <AlignField label="Alinhamento" value={attrs.align} onChange={(v) => setAttr("align", v)} defaultValue="left" />
      </div>
    </div>
  );
}
