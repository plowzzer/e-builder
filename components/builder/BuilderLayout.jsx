import { useState } from "react";
import useBuilderStore from "../../store/builderStore";
import { Button } from "../ui/button";
import { ButtonGroup } from "../ui/button-group";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "../ui/resizable";
import ClientRenderer from "./ClientRenderer";
import PropertiesPanel from "./PropertiesPanel";
import SectionList from "./SectionList";

export default function BuilderLayout() {
  const [activeTab, setActiveTab] = useState("editor");
  const [finalHtml, setFinalHtml] = useState("");
  const [loadingPreview, setLoadingPreview] = useState(false);

  const previewOutdated = useBuilderStore((s) => s.previewOutdated);
  const template = useBuilderStore((s) => s.template);

  const Menu = [
    { key: "editor", label: "Editor" },
    { key: "quick", label: "Preview Rápido" },
    { key: "final", label: "Preview Final" },
    { key: "json", label: "JSON" },
  ];

  async function loadFinalPreview() {
    setLoadingPreview(true);
    try {
      const res = await fetch("/api/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(template),
      });
      const data = await res.json();
      setFinalHtml(data.html || "");
      useBuilderStore.setState({ previewOutdated: false });
    } catch (err) {
      console.error("Erro no preview final:", err);
    } finally {
      setLoadingPreview(false);
    }
  }

  function handleTabClick(tab) {
    setActiveTab(tab);
    if (tab === "final" && previewOutdated) {
      loadFinalPreview();
    }
  }

  return (

    <ResizablePanelGroup
      orientation="horizontal"
      className="flex h-full w-full"
    >
      {/* Painel esquerdo */}
      <ResizablePanel defaultSize="75%">
        <div className="flex flex-col h-full flex-1 min-w-0 border-r border-gray-200 p-4 bg-gray-200">
          {/* Tabs */}
          <ButtonGroup className="mx-auto">
            {Menu.map(({ key, label }) => (
              <Button
                key={key}
                onClick={() => handleTabClick(key)}
                variant={activeTab === key ? "default" : "outline"}
                size="lg"
              >
                {label}
              </Button>
            ))}
          </ButtonGroup>

          <div className="flex-1 overflow-auto">
            {activeTab === "json" && (
              <pre className="h-full overflow-auto rounded-md bg-gray-900 p-4 text-xs text-green-400 font-mono whitespace-pre">
                {JSON.stringify(template, null, 2)}
              </pre>
            )}

            {activeTab === "editor" && <SectionList />}

            {activeTab === "quick" && (
              <ClientRenderer />
            )}

            {activeTab === "final" && (
              <div className="relative h-full">
                {loadingPreview && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80">
                    <span className="text-sm text-gray-500">Compilando MJML...</span>
                  </div>
                )}
                {finalHtml ? (
                  <iframe
                    srcDoc={finalHtml}
                    title="Preview Final"
                    className="h-full w-full border-0"
                  />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-3">
                    <p className="text-sm text-gray-400">Preview final ainda não gerado.</p>
                    <button
                      onClick={loadFinalPreview}
                      className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
                    >
                      Gerar preview
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </ResizablePanel>

      <ResizableHandle withHandle />

      {/* Painel direito — Propriedades */}
      <ResizablePanel defaultSize="25%">
        <PropertiesPanel />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
