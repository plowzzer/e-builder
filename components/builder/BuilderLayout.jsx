import { useState } from "react";
import useBuilderStore from "../../store/builderStore";
import { Button } from "../ui/button";
import { ButtonGroup } from "../ui/button-group";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "../ui/resizable";
import ClientRenderer from "./ClientRenderer";
import FinalPreview from "./FinalPreview";
import PropertiesPanel from "./PropertiesPanel";
import SectionList from "./SectionList";

export default function BuilderLayout() {
  const [activeTab, setActiveTab] = useState("editor");
  const template = useBuilderStore((s) => s.template);

  const Menu = [
    { key: "editor", label: "Editor" },
    { key: "quick", label: "Preview Rápido" },
    { key: "final", label: "Preview Final" },
    { key: "json", label: "JSON" },
  ];

  return (

    <ResizablePanelGroup
      orientation="horizontal"
      className="flex h-full w-full"
    >
      {/* Painel esquerdo */}
      <ResizablePanel defaultSize="75%">
        <div className="flex flex-col h-full flex-1 min-w-0 border-r border-gray-200 p-4 bg-gray-200">
          {/* Tabs */}
          <ButtonGroup className="mx-auto mb-4">
            {Menu.map(({ key, label }) => (
              <Button
                key={key}
                onClick={() => setActiveTab(key)}
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

            {activeTab === "final" && <FinalPreview />}
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
