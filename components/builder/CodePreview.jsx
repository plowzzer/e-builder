import { Check, Copy } from "lucide-react";
import { useCallback, useState } from "react";

import { Button } from "../ui/button";

export default function CodePreview({ code }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [code]);

  const lines = code.split("\n");

  return (
    <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden w-full shadow-sm">

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-zinc-50 border-b border-zinc-200">
        <span className="text-xs text-zinc-400">component.tsx</span>

        <Button
          onClick={handleCopy}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs cursor-pointer transition-all ${copied
            ? "border-green-200 bg-green-50 text-green-600"
            : "border-zinc-200 bg-white text-zinc-500 hover:bg-zinc-50 hover:text-zinc-700"
            }`}
        >
          {copied ? (
            <>
              <Check size={16} />
              Copiado!
            </>
          ) : (
            <>
              <Copy size={16} />
              Copiar
            </>
          )}
        </Button>
      </div>

      {/* Code body */}
      <div className="flex">
        {/* Line numbers */}
        <div className="py-4 bg-zinc-50 border-r border-zinc-200 select-none min-w-10">
          {lines.map((_, i) => (
            <div key={i} className="px-3 text-right text-xs leading-7 text-zinc-300">
              {i + 1}
            </div>
          ))}
        </div>

        {/* Code */}
        <pre className="m-0 px-5 py-4 text-sm leading-7 text-zinc-800 overflow-x-auto flex-1">
          {code}
        </pre>
      </div>

    </div>
  )
}