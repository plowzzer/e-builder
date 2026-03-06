import { Monitor, Smartphone } from "lucide-react";
import { useState } from "react";
import useBuilderStore from "../../store/builderStore";
import { Button } from "../ui/button";
import { ButtonGroup } from "../ui/button-group";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "../ui/resizable";
import ClientRenderer from "./ClientRenderer";
import CodePreview from "./CodePreview";
import FinalPreview from "./FinalPreview";
import PropertiesPanel from "./PropertiesPanel";
import SectionList from "./SectionList";

export default function BuilderLayout() {
  const [activeTab, setActiveTab] = useState("editor");
  const [viewport, setViewport] = useState("desktop");
  const template = useBuilderStore((s) => s.template);

  const Menu = [
    { key: "editor", label: "Editor" },
    // { key: "quick", label: "Preview Rápido" },
    { key: "final", label: "Preview Final" },
    { key: "json", label: "JSON" },
  ];

  const showViewportToggle = activeTab === "editor" || activeTab === "quick" || activeTab === "final";

  return (

    <ResizablePanelGroup
      orientation="horizontal"
      className="flex h-full w-full"
    >
      {/* Painel esquerdo */}
      <ResizablePanel defaultSize="75%">
        <div className="flex flex-col h-full flex-1 min-w-0 border-r p-4">
          {/* Tabs + toggle viewport */}
          <div className="flex items-center justify-center mb-4 gap-3">
            <ButtonGroup>
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

            {showViewportToggle && (
              <ButtonGroup>
                <Button
                  onClick={() => setViewport("desktop")}
                  title="Desktop"
                  variant={viewport === 'desktop' ? "default" : "outline"}
                  size="lg"
                >
                  <Monitor size={16} />
                </Button>
                <Button
                  onClick={() => setViewport("mobile")}
                  title="Mobile"
                  variant={viewport === 'mobile' ? "default" : "outline"}
                  size="lg"
                >
                  <Smartphone size={16} />
                </Button>
              </ButtonGroup>
            )}
          </div>

          <div className="flex-1 overflow-auto">
            {activeTab === "editor" && <SectionList viewport={viewport} />}

            {activeTab === "quick" && (
              <ClientRenderer viewport={viewport} />
            )}

            {activeTab === "final" && <FinalPreview viewport={viewport} />}

            {activeTab === "json" && (
              <CodePreview code={JSON.stringify(template, null, 2)} />
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
