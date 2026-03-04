import { AlignCenter, AlignLeft, AlignRight } from "lucide-react";
import { Button } from "../ui/button";
import { ButtonGroup } from "../ui/button-group";
import { Field, FieldDescription, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";

const labelCls = "block text-xs font-medium text-gray-500 mb-1";
const sectionLabelCls = "text-[10px] font-semibold text-gray-400 uppercase tracking-wide";

function ColorField({ label, value, onChange }) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      <div className="flex gap-1.5 items-center">
        <input
          type="color"
          className="h-9 w-9 cursor-pointer rounded-md border border-input p-1 shrink-0"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
}

function AlignButtons({ value, onChange }) {
  return (
    <ButtonGroup>
      {[
        { v: "left", title: "Alinhar à esquerda", icon: <AlignLeft size={16} /> },
        { v: "center", title: "Alinhar ao centro", icon: <AlignCenter size={16} /> },
        { v: "right", title: "Alinhar à direita", icon: <AlignRight size={16} /> },
      ].map(({ v, title, icon }) => (
        <Button
          key={v}
          variant={value === v ? "default" : "outline"}
          size="icon"
          onClick={() => onChange(v)}
          aria-label={title}
        >
          {icon}
        </Button>
      ))}
    </ButtonGroup>
  );
}

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
          <Field>
            <FieldLabel>Tamanho</FieldLabel>
            <Input
              value={attrs["font-size"] || "14px"}
              onChange={(e) => setAttr("font-size", e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel>Peso</FieldLabel>
            <Select
              value={attrs["font-weight"] || "normal"}
              onValueChange={(v) => setAttr("font-weight", v)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="300">Light 300</SelectItem>
                <SelectItem value="500">Medium 500</SelectItem>
                <SelectItem value="bold">Bold</SelectItem>
                <SelectItem value="700">Bold 700</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel>Line height</FieldLabel>
            <Input
              value={attrs["line-height"] || "1.5"}
              onChange={(e) => setAttr("line-height", e.target.value)}
            />
          </Field>
        </div>
        <ColorField
          label="Cor"
          value={attrs.color || "#000000"}
          onChange={(v) => setAttr("color", v)}
        />
        <Field>
          <FieldLabel>Fonte</FieldLabel>
          <Input
            value={attrs["font-family"] || "Arial, sans-serif"}
            onChange={(e) => setAttr("font-family", e.target.value)}
          />
        </Field>
      </div>

      <hr className="border-gray-100" />

      {/* Decoração */}
      <div className="space-y-2.5">
        <p className={sectionLabelCls}>Decoração</p>
        <div className="grid grid-cols-2 gap-2">
          <Field>
            <FieldLabel>Text decoration</FieldLabel>
            <Select
              value={attrs["text-decoration"] || "none"}
              onValueChange={(v) => setAttr("text-decoration", v)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="underline">Underline</SelectItem>
                <SelectItem value="overline">Overline</SelectItem>
                <SelectItem value="line-through">Line-through</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel>Text transform</FieldLabel>
            <Select
              value={attrs["text-transform"] || "none"}
              onValueChange={(v) => setAttr("text-transform", v)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="capitalize">Capitalize</SelectItem>
                <SelectItem value="uppercase">Uppercase</SelectItem>
                <SelectItem value="lowercase">Lowercase</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </div>
      </div>

      <hr className="border-gray-100" />

      {/* Layout */}
      <div className="space-y-2.5">
        <p className={sectionLabelCls}>Layout</p>
        <Field>
          <FieldLabel>Padding</FieldLabel>
          <Input
            value={attrs.padding || "16px 16px 16px 16px"}
            onChange={(e) => setAttr("padding", e.target.value)}
          />
          <FieldDescription>Ex: 10px, 10px 5px, 10px 5px 15px, 10px 5px 15px 20px</FieldDescription>
        </Field>
        <Field>
          <FieldLabel>Alinhamento</FieldLabel>
          <AlignButtons
            value={attrs.align || "left"}
            onChange={(v) => setAttr("align", v)}
          />
        </Field>
      </div>
    </div>
  );
}
