import BuilderLayout from "@/components/builder/BuilderLayout";
import { Button } from "@/components/ui/button";
import { Mail, Save } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useBuilderStore from "../../store/builderStore";

export default function BuilderPage() {
  const router = useRouter();
  const { id } = router.query;
  const [templateName, setTemplateName] = useState("Sem título");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const isDirty = useBuilderStore((s) => s.isDirty);
  const loadTemplate = useBuilderStore((s) => s.loadTemplate);
  const markSaved = useBuilderStore((s) => s.markSaved);
  const template = useBuilderStore((s) => s.template);

  useEffect(() => {
    if (!id) return;

    if (id === "new") {
      loadTemplate({
        globalConfig: {
          backgroundColor: "#ffffff",
          fontFamily: "Arial, sans-serif",
          containerWidth: "600px",
        },
        sections: [],
      });
      setTemplateName("Novo template");
      setLoading(false);
      return;
    }

    fetch(`/api/templates/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setTemplateName(data.name || "Sem título");
        loadTemplate(data.data);
      })
      .catch((err) => console.error("Erro ao carregar template:", err))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSave() {
    setSaving(true);
    try {
      const body = { name: templateName, data: template };

      if (id === "new") {
        const res = await fetch("/api/templates", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const created = await res.json();
        markSaved();
        router.replace(`/builder/${created._id}`);
      } else {
        await fetch(`/api/templates/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        markSaved();
      }
    } catch (err) {
      console.error("Erro ao salvar:", err);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <span className="text-sm text-gray-400">Carregando...</span>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-black overflow-hidden p-2">
      <div className="flex-1 flex flex-col bg-white rounded-md overflow-hidden">
        <header className="flex shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 py-2.5 bg-red-800 ">
          <div className="flex items-center gap-2">
            <Mail size={16} className="text-gray-500" />
            <input
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              className="rounded border border-transparent px-2 py-0.5 text-sm font-medium text-gray-800 hover:border-gray-300 focus:border-blue-400 focus:outline-none"
            />
            {isDirty && (
              <div className="flex gap-1 items-center">
                <span className="rounded-full h-2 w-2 bg-red-400" />
                <span className="text-xs text-gray-400 italic">não salvo</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button onClick={handleSave}
              disabled={saving}>
              <Save size={14} /> {saving ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </header>
        <div className="flex-1 overflow-hidden">
          <BuilderLayout />
        </div>
      </div>
    </div>
  );
}
