import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import useBuilderStore from "../../store/builderStore";
import { ColorField } from "../fields/color-field";
import { TextField } from "../fields/text-field";
import { Button } from "../ui/button";
import { Field } from "../ui/field";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

const sectionLabelCls = "text-[10px] font-semibold text-gray-400 uppercase tracking-wide";

export default function GlobalConfigPanel() {
  const globalConfig = useBuilderStore((s) => s.template.globalConfig);
  const updateGlobalConfig = useBuilderStore((s) => s.updateGlobalConfig);

  const [newFontName, setNewFontName] = useState("");
  const [newFontHref, setNewFontHref] = useState("");

  function set(key, value) {
    updateGlobalConfig({ [key]: value });
  }

  const fonts = globalConfig.fonts || [];

  function addFont() {
    if (!newFontName.trim() || !newFontHref.trim()) return;
    updateGlobalConfig({ fonts: [...fonts, { name: newFontName.trim(), href: newFontHref.trim() }] });
    setNewFontName("");
    setNewFontHref("");
  }

  function removeFont(idx) {
    updateGlobalConfig({ fonts: fonts.filter((_, i) => i !== idx) });
  }

  return (
    <div className="space-y-4">
      <p className={sectionLabelCls}>Configuração global</p>
      <ColorField label="Cor de fundo" value={globalConfig.backgroundColor} onChange={(v) => set("backgroundColor", v)} />
      <TextField label="Fonte padrão" value={globalConfig.fontFamily} onChange={(v) => set("fontFamily", v)} placeholder="ex: Arial, sans-serif" />
      <TextField label="Largura do container" value={globalConfig.containerWidth} onChange={(v) => set("containerWidth", v)} placeholder="ex: 600px" />

      <hr className="border-gray-100" />

      {/* Fontes customizadas (mj-font) */}
      <div className="space-y-2.5">
        <p className={sectionLabelCls}>Fontes customizadas</p>

        {fonts.length > 0 && (
          <div className="space-y-1.5">
            {fonts.map((font, idx) => (
              <div key={idx} className="flex items-center gap-1.5 text-xs bg-gray-50 rounded px-2 py-1.5">
                <span className="font-medium flex-1 truncate">{font.name}</span>
                <span className="text-gray-400 flex-1 truncate">{font.href}</span>
                <Button variant="ghost" size="icon" className="h-5 w-5 shrink-0" onClick={() => removeFont(idx)}>
                  <Trash2 size={12} />
                </Button>
              </div>
            ))}
          </div>
        )}

        <div className="mt-2 space-y-1.5">
          <Field>
            <Label>Nome da fonte</Label>
            <Input
              placeholder="Nome (ex: Roboto)"
              value={newFontName}
              onChange={(e) => setNewFontName(e.target.value)}
            />
          </Field>
          <Field>
            <Label>URL da fonte</Label>
            <Input
              placeholder="URL (ex: https://fonts.googleapis.com/...)"
              value={newFontHref}
              onChange={(e) => setNewFontHref(e.target.value)}
            />
          </Field>
          <Button variant="outline" size="sm" className="w-full gap-1" onClick={addFont}>
            <Plus size={14} /> Adicionar fonte
          </Button>
        </div>
      </div>
    </div>
  );
}
