import { AlignCenter, AlignLeft, AlignRight } from "lucide-react";
import { Button } from "../ui/button";
import { ButtonGroup } from "../ui/button-group";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

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
export default function ButtonProperties({ attrs, content, setAttr, setContent }) {
  return (
    <div className="space-y-4">
      {/* Conteúdo */}
      <div className="space-y-2.5">
        <p className={sectionLabelCls}>Conteúdo</p>
        <div>
          <label className={labelCls}>Texto do botão</label>
          <Input
            value={content || ""}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <div>
          <label className={labelCls}>Link (href)</label>
          <Input
            placeholder="https://..."
            value={attrs.href || ""}
            onChange={(e) => setAttr("href", e.target.value)}
          />
        </div>
      </div>

      <hr className="border-gray-100" />

      {/* Estilo */}
      <div className="space-y-2.5">
        <p className={sectionLabelCls}>Estilo</p>
        <ColorField
          label="Cor de fundo"
          value={attrs["background-color"] || "#4A90E2"}
          onChange={(v) => setAttr("background-color", v)}
        />
        <ColorField
          label="Cor do texto"
          value={attrs.color || "#ffffff"}
          onChange={(v) => setAttr("color", v)}
        />
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className={labelCls}>Tamanho fonte</label>
            <Input
              value={attrs["font-size"] || "14px"}
              onChange={(e) => setAttr("font-size", e.target.value)}
            />
          </div>
          <div>
            <label className={labelCls}>Peso</label>
            <Select
              value={attrs["font-weight"] || "normal"}
              onValueChange={(v) => setAttr("font-weight", v)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="bold">Bold</SelectItem>
                <SelectItem value="700">Bold 700</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className={labelCls}>Border radius</label>
            <Input
              value={attrs["border-radius"] || "4px"}
              onChange={(e) => setAttr("border-radius", e.target.value)}
            />
          </div>
        </div>
      </div>

      <hr className="border-gray-100" />

      {/* Layout */}
      <div className="space-y-2.5">
        <p className={sectionLabelCls}>Layout</p>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className={labelCls}>Padding externo</label>
            <Input
              value={attrs.padding || "10px 25px"}
              onChange={(e) => setAttr("padding", e.target.value)}
            />
          </div>
          <div>
            <label className={labelCls}>Padding interno</label>
            <Input
              value={attrs["inner-padding"] || "10px 25px"}
              onChange={(e) => setAttr("inner-padding", e.target.value)}
            />
          </div>
        </div>
        <div>
          <label className={labelCls}>Alinhamento</label>
          <AlignButtons
            value={attrs.align || "center"}
            onChange={(v) => setAttr("align", v)}
          />
        </div>
      </div>
    </div>
  );
}
