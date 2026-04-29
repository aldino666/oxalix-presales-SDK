"use client";
import { useState } from "react";
import { Copy, Check, Play } from "lucide-react";
export function InstructionPlayground({ instructionName, fields }: { instructionName: string, fields: any[] }) {
  const [copied, setCopied] = useState(false);
  const [values, setValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    fields.forEach(f => { if (!f.optional) initial[f.name] = f.type.includes('Address') ? "'7Emv...KPBG'" : "0"; });
    return initial;
  });
  const code = `import { get${instructionName.charAt(0).toUpperCase() + instructionName.slice(1)}InstructionAsync } from '@oxalix/js-client';\n\nconst ix = await get${instructionName.charAt(0).toUpperCase() + instructionName.slice(1)}InstructionAsync({\n${fields.map(f => `  ${f.name}: ${values[f.name] || (f.optional ? "undefined" : "...")},`).join('\n')}\n});`;
  const handleCopy = () => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <div className="rounded-xl border border-oxalix-border bg-oxalix-card overflow-hidden my-8">
      <div className="flex items-center justify-between bg-white/5 border-b border-oxalix-border px-6 py-3">
        <div className="flex items-center gap-2"><Play size={16} className="text-oxalix" /><span className="text-sm font-bold uppercase tracking-wider">Playground</span></div>
        <button onClick={handleCopy} className="flex items-center gap-2 text-xs font-medium text-gray-400 hover:text-white">
          {copied ? <Check size={14} className="text-oxalix" /> : <Copy size={14} />}{copied ? "COPIED" : "COPY CODE"}
        </button>
      </div>
      <div className="grid md:grid-cols-2 divide-x divide-oxalix-border">
        <div className="p-6 space-y-4 max-h-[400px] overflow-y-auto">
          {fields.map(field => (
            <div key={field.name} className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase">{field.name} ({field.type})</label>
              <input type="text" value={values[field.name] || ""} onChange={(e) => setValues(prev => ({ ...prev, [field.name]: e.target.value }))} className="w-full bg-black border border-oxalix-border rounded px-3 py-1 text-sm text-oxalix-light outline-none focus:border-oxalix" />
            </div>
          ))}
        </div>
        <div className="bg-black/50 p-6 overflow-x-auto"><pre className="text-[10px] font-mono text-gray-400"><code>{code}</code></pre></div>
      </div>
    </div>
  );
}
