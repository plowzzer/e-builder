import { AlignCenter, AlignLeft, AlignRight } from "lucide-react";
import { Button } from "../ui/button";
import { ButtonGroup } from "../ui/button-group";
import { Input } from "../ui/input";

const labelCls = "block text-xs font-medium text-gray-500 mb-1";
const sectionLabelCls = "text-[10px] font-semibold text-gray-400 uppercase tracking-wide";

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
 *   setAttr: (key: string, value: string) => void,
 * }} props
 */
export default function ImageProperties({ attrs, setAttr }) {
  return (
    <div className="space-y-4">
      {/* Imagem */}
      <div className="space-y-2.5">
        <p className={sectionLabelCls}>Imagem</p>
        <div>
          <label className={labelCls}>URL (src)</label>
          <Input
            placeholder="https://..."
            value={attrs.src || ""}
            onChange={(e) => setAttr("src", e.target.value)}
          />
        </div>
        <div>
          <label className={labelCls}>Texto alternativo (alt)</label>
          <Input
            value={attrs.alt || ""}
            onChange={(e) => setAttr("alt", e.target.value)}
          />
        </div>
        <div>
          <label className={labelCls}>Largura</label>
          <Input
            value={attrs.width || ""}
            placeholder="ex: 100%"
            onChange={(e) => setAttr("width", e.target.value)}
          />
        </div>
      </div>

      <hr className="border-gray-100" />

      {/* Link */}
      <div className="space-y-2.5">
        <p className={sectionLabelCls}>Link</p>
        <div>
          <label className={labelCls}>href</label>
          <Input
            placeholder="https://..."
            value={attrs.href || ""}
            onChange={(e) => setAttr("href", e.target.value)}
          />
        </div>
      </div>

      <hr className="border-gray-100" />

      {/* Layout */}
      <div className="space-y-2.5">
        <p className={sectionLabelCls}>Layout</p>
        <div>
          <label className={labelCls}>Padding</label>
          <Input
            value={attrs.padding || ""}
            placeholder="ex: 10px"
            onChange={(e) => setAttr("padding", e.target.value)}
          />
        </div>
        <div>
          <label className={labelCls}>Border radius</label>
          <Input
            value={attrs["border-radius"] || ""}
            placeholder="ex: 4px"
            onChange={(e) => setAttr("border-radius", e.target.value)}
          />
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
