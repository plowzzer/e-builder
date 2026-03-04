import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

const labelCls = "block text-xs font-medium text-gray-500 mb-1";

/**
 * @param {{
 *   attrs: Object,
 *   setAttr: (key: string, value: string) => void,
 * }} props
 */
export default function DividerProperties({ attrs, setAttr }) {
  return (
    <div className="space-y-2.5">
      <div>
        <label className={labelCls}>Cor</label>
        <div className="flex gap-1.5 items-center">
          <input
            type="color"
            className="h-9 w-9 cursor-pointer rounded-md border border-input p-1 shrink-0"
            value={attrs["border-color"] || "#cccccc"}
            onChange={(e) => setAttr("border-color", e.target.value)}
          />
          <Input
            type="text"
            value={attrs["border-color"] || "#cccccc"}
            onChange={(e) => setAttr("border-color", e.target.value)}
          />
        </div>
      </div>
      <div>
        <label className={labelCls}>Estilo</label>
        <Select
          value={attrs["border-style"] || "solid"}
          onValueChange={(v) => setAttr("border-style", v)}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="solid">Solid</SelectItem>
            <SelectItem value="dashed">Dashed</SelectItem>
            <SelectItem value="dotted">Dotted</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className={labelCls}>Espessura</label>
        <Input
          value={attrs["border-width"] || "1px"}
          onChange={(e) => setAttr("border-width", e.target.value)}
        />
      </div>
      <div>
        <label className={labelCls}>Padding</label>
        <Input
          value={attrs.padding || "10px 0"}
          onChange={(e) => setAttr("padding", e.target.value)}
        />
      </div>
    </div>
  );
}
