import useBuilderStore from "../../store/builderStore";
import { ColorField } from "../fields/color-field";
import { TextField } from "../fields/text-field";

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
      <ColorField label="Cor de fundo" value={globalConfig.backgroundColor} onChange={(v) => set("backgroundColor", v)} />
      <TextField label="Fonte padrão" value={globalConfig.fontFamily} onChange={(v) => set("fontFamily", v)} placeholder="ex: Arial, sans-serif" />
      <TextField label="Largura do container" value={globalConfig.containerWidth} onChange={(v) => set("containerWidth", v)} placeholder="ex: 600px" />
    </div>
  );
}
