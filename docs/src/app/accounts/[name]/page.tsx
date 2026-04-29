import metadata from "@/data/metadata.json";
import { notFound } from "next/navigation";
import { Database, Layout } from "lucide-react";

export async function generateStaticParams() {
  return metadata.accounts.map((account) => ({ name: account.name }));
}

export default async function AccountPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const account = metadata.accounts.find((a) => a.name === name);
  if (!account) notFound();
  return (
    <div className="space-y-12 text-white">
      <header className="space-y-4">
        <div className="flex items-center gap-3 text-oxalix"><Database size={24} /><span className="text-sm font-bold uppercase tracking-widest text-white">Account Structure</span></div>
        <h1 className="text-4xl font-bold tracking-tight">{account.name}</h1>
      </header>
      <section className="space-y-6">
        <h2 className="flex items-center gap-2 text-2xl font-bold"><Layout size={20} className="text-oxalix" />Fields</h2>
        <div className="overflow-hidden rounded-xl border border-oxalix-border bg-oxalix-card">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 border-b border-oxalix-border text-gray-300">
              <tr><th className="px-6 py-3 font-semibold">Field Name</th><th className="px-6 py-3 font-semibold">Type</th></tr>
            </thead>
            <tbody className="divide-y divide-oxalix-border">
              {account.fields.map((field) => (
                <tr key={field.name} className="hover:bg-white/[0.02]"><td className="px-6 py-4 font-mono text-oxalix-light">{field.name}</td><td className="px-6 py-4 text-gray-400 font-mono text-xs">{field.type}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
