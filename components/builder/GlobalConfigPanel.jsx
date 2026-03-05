import { Input } from "../ui/input";
import useBuilderStore from "../../store/builderStore";

const labelCls = "block text-xs font-medium text-gray-500 mb-1";
const sectionLabelCls = "text-[10px] font-semibold text-gray-400 uppercase tracking-wide";

export default function GlobalConfigPanel() {
  const globalConfig = useBuilderStore((s) => s.template.globalConfig);
  const updateGlobalConfig = useBuilderStore((s) => s.updateGlobalConfig);

  function set(key, value) {
    updateGlobalConfig({ [key]: value });
  }

  return (
    <div className="space-y-4">
      <p className={sectionLabelCls}>Configuração global</p>

      <div>
        <label className={labelCls}>Cor de fundo</label>
        <div className="flex gap-1.5 items-center">
          <input
            type="color"
            className="h-9 w-9 cursor-pointer rounded-md border border-input p-1 shrink-0"
            value={globalConfig.backgroundColor || "#ffffff"}
            onChange={(e) => set("backgroundColor", e.target.value)}
          />
          <Input
            type="text"
            value={globalConfig.backgroundColor || "#ffffff"}
            onChange={(e) => set("backgroundColor", e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className={labelCls}>Fonte padrão</label>
        <Input
          value={globalConfig.fontFamily || ""}
          placeholder="ex: Arial, sans-serif"
          onChange={(e) => set("fontFamily", e.target.value)}
        />
      </div>

      <div>
        <label className={labelCls}>Largura do container</label>
        <Input
          value={globalConfig.containerWidth || ""}
          placeholder="ex: 600px"
          onChange={(e) => set("containerWidth", e.target.value)}
        />
      </div>
    </div>
  );
}
