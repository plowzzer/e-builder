import { useState } from "react";
import useBuilderStore from "../../store/builderStore";

export default function FinalPreview() {
  const [finalHtml, setFinalHtml] = useState("");
  const [loading, setLoading] = useState(false);

  const previewOutdated = useBuilderStore((s) => s.previewOutdated);
  const template = useBuilderStore((s) => s.template);

  async function load() {
    setLoading(true);
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
      setLoading(false);
    }
  }

  return (
    <div className="relative h-full">
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80">
          <span className="text-sm text-gray-500">Compilando MJML...</span>
        </div>
      )}

      {finalHtml ? (
        <div className="flex h-full gap-2">
          <iframe
            srcDoc={finalHtml}
            title="Preview Final"
            className="h-full w-1/2 border-0 rounded-md bg-white"
          />
          <pre className="h-full w-1/2 overflow-auto rounded-md bg-gray-900 p-4 text-xs text-green-400 font-mono whitespace-pre">
            {finalHtml}
          </pre>
        </div>
      ) : (
        <div className="flex h-full flex-col items-center justify-center gap-3">
          <p className="text-sm text-gray-400">Preview final ainda não gerado.</p>
          <button
            onClick={load}
            className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
          >
            Gerar preview
          </button>
        </div>
      )}

      {finalHtml && previewOutdated && (
        <div className="absolute bottom-3 right-3 flex items-center gap-2 rounded-md bg-orange-50 border border-orange-200 px-3 py-2">
          <span className="h-2 w-2 rounded-full bg-orange-400" />
          <span className="text-xs text-orange-600">Template alterado.</span>
          <button
            onClick={load}
            className="text-xs font-medium text-orange-700 underline underline-offset-2"
          >
            Atualizar
          </button>
        </div>
      )}
    </div>
  );
}
