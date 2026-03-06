import { AlignField } from "../fields/align-field";
import { TextField } from "../fields/text-field";

const sectionLabelCls = "text-[10px] font-semibold text-gray-400 uppercase tracking-wide";

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
        <TextField label="URL (src)" value={attrs.src} onChange={(v) => setAttr("src", v)} placeholder="https://..." />
        <TextField label="Texto alternativo (alt)" value={attrs.alt} onChange={(v) => setAttr("alt", v)} />
        <TextField label="Largura" value={attrs.width} onChange={(v) => setAttr("width", v)} placeholder="ex: 100%" />
      </div>

      <hr className="border-gray-100" />

      {/* Link */}
      <div className="space-y-2.5">
        <p className={sectionLabelCls}>Link</p>
        <TextField label="href" value={attrs.href} onChange={(v) => setAttr("href", v)} placeholder="https://..." />
      </div>

      <hr className="border-gray-100" />

      {/* Layout */}
      <div className="space-y-2.5">
        <p className={sectionLabelCls}>Layout</p>
        <TextField label="Padding" value={attrs.padding} onChange={(v) => setAttr("padding", v)} placeholder="ex: 10px" />
        <TextField label="Border radius" value={attrs["border-radius"]} onChange={(v) => setAttr("border-radius", v)} placeholder="ex: 4px" />
        <AlignField label="Alinhamento" value={attrs.align} onChange={(v) => setAttr("align", v)} defaultValue="center" />
      </div>
    </div>
  );
}
