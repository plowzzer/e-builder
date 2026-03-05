import { AlignCenter, AlignLeft, AlignRight } from "lucide-react";
import { Button } from "../ui/button";
import { ButtonGroup } from "../ui/button-group";
import { Field, FieldDescription, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";

const sectionLabelCls = "text-[10px] font-semibold text-gray-400 uppercase tracking-wide";

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
        <Field>
          <FieldLabel>Border</FieldLabel>
          <Input
            value={attrs.border || ""}
            placeholder="ex: 1px solid #cccccc"
            onChange={(e) => setAttr("border", e.target.value)}
          />
          <FieldDescription>Atalho completo: espessura, estilo e cor.</FieldDescription>
        </Field>
        <div className="grid grid-cols-2 gap-2">
          <Field>
            <FieldLabel>Cell padding</FieldLabel>
            <Input
              value={attrs.cellpadding || ""}
              placeholder="ex: 4"
              onChange={(e) => setAttr("cellpadding", e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel>Cell spacing</FieldLabel>
            <Input
              value={attrs.cellspacing || ""}
              placeholder="ex: 0"
              onChange={(e) => setAttr("cellspacing", e.target.value)}
            />
          </Field>
        </div>
      </div>

      <hr className="border-gray-100" />

      {/* Tipografia */}
      <div className="space-y-2.5">
        <p className={sectionLabelCls}>Tipografia</p>
        <div className="grid grid-cols-2 gap-2">
          <Field>
            <FieldLabel>Tamanho</FieldLabel>
            <Input
              value={attrs["font-size"] || ""}
              placeholder="ex: 14px"
              onChange={(e) => setAttr("font-size", e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel>Line height</FieldLabel>
            <Input
              value={attrs["line-height"] || ""}
              placeholder="ex: 1.5"
              onChange={(e) => setAttr("line-height", e.target.value)}
            />
          </Field>
        </div>
        <Field>
          <FieldLabel>Cor do texto</FieldLabel>
          <div className="flex gap-1.5 items-center">
            <input
              type="color"
              className="h-9 w-9 cursor-pointer rounded-md border border-input p-1 shrink-0"
              value={attrs.color || "#000000"}
              onChange={(e) => setAttr("color", e.target.value)}
            />
            <Input
              value={attrs.color || ""}
              placeholder="ex: #000000"
              onChange={(e) => setAttr("color", e.target.value)}
            />
          </div>
        </Field>
        <Field>
          <FieldLabel>Fonte</FieldLabel>
          <Input
            value={attrs["font-family"] || ""}
            placeholder="ex: Arial, sans-serif"
            onChange={(e) => setAttr("font-family", e.target.value)}
          />
        </Field>
      </div>

      <hr className="border-gray-100" />

      {/* Layout */}
      <div className="space-y-2.5">
        <p className={sectionLabelCls}>Layout</p>
        <Field>
          <FieldLabel>Table layout</FieldLabel>
          <Select
            value={attrs["table-layout"] || "auto"}
            onValueChange={(v) => setAttr("table-layout", v)}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="auto">Auto</SelectItem>
              <SelectItem value="fixed">Fixed</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field>
          <FieldLabel>Padding</FieldLabel>
          <Input
            value={attrs.padding || ""}
            placeholder="ex: 10px"
            onChange={(e) => setAttr("padding", e.target.value)}
          />
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
                variant={(attrs.align || "left") === v ? "default" : "outline"}
                size="icon"
                onClick={() => setAttr("align", v)}
              >
                {icon}
              </Button>
            ))}
          </ButtonGroup>
        </Field>
      </div>
    </div>
  );
}
