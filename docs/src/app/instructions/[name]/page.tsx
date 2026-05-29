import metadata from "@/data/metadata.json";
import { notFound } from "next/navigation";
import { Terminal, Database, Code, ShieldCheck, User, HardDrive } from "lucide-react";
import { cn } from "@/lib/utils";
import { InstructionPlayground } from "@/components/ui/InstructionPlayground";

export async function generateStaticParams() {
  return metadata.instructions.map((instruction) => ({ name: instruction.name }));
}

export default async function InstructionPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const instruction = metadata.instructions.find((i) => i.name === name);
  if (!instruction) notFound();
  const accounts = instruction.fields.filter(f => f.type.includes('Address') || f.type.includes('Signer'));
  const dataArgs = instruction.fields.filter(f => !f.type.includes('Address') && !f.type.includes('Signer'));
  return (
    <div className="space-y-12">
      <header className="space-y-4">
        <div className="flex items-center gap-3 text-oxalix"><Terminal size={24} /><span className="text-sm font-bold uppercase tracking-widest text-white">Instruction</span></div>
        <h1 className="text-4xl font-bold tracking-tight text-white">{instruction.name}</h1>
      </header>
      <InstructionPlayground instructionName={instruction.name} fields={instruction.fields} />
      <section className="space-y-6">
        <h2 className="flex items-center gap-2 text-2xl font-bold text-white"><Database size={20} className="text-oxalix" />Required Accounts</h2>
        <div className="overflow-hidden rounded-xl border border-oxalix-border bg-oxalix-card">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 border-b border-oxalix-border text-gray-300">
              <tr><th className="px-6 py-3 font-semibold">Account Name</th><th className="px-6 py-3 font-semibold">Type</th><th className="px-6 py-3 font-semibold text-center">Optional</th></tr>
            </thead>
            <tbody className="divide-y divide-oxalix-border">
              {accounts.map((account) => (
                <tr key={account.name} className="hover:bg-white/[0.02]">
                  <td className="px-6 py-4 font-mono text-oxalix-light">{account.name}</td>
                  <td className="px-6 py-4 text-gray-400 text-xs">{account.type}</td>
                  <td className="px-6 py-4 text-center">{account.optional ? <span className="text-gray-500">Yes</span> : <ShieldCheck size={16} className="mx-auto text-oxalix" />}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
