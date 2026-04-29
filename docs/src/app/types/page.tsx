import { Layers } from "lucide-react";
export default function TypesPage() {
  return (
    <div className="space-y-12 text-white">
      <header className="space-y-4">
        <div className="flex items-center gap-3 text-oxalix"><Layers size={24} /><span className="text-sm font-bold uppercase tracking-widest text-white">Types & Enums</span></div>
        <h1 className="text-4xl font-bold tracking-tight">Program Types</h1>
      </header>
      <section className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-oxalix-border bg-oxalix-card p-6">
          <h3 className="font-bold text-white text-lg">VerificationLevel</h3>
          <p className="text-sm text-gray-400">Enum for price updates.</p>
        </div>
        <div className="rounded-xl border border-oxalix-border bg-oxalix-card p-6">
          <h3 className="font-bold text-white text-lg">PriceFeedMessage</h3>
          <p className="text-sm text-gray-400">Pyth price update structure.</p>
        </div>
      </section>
    </div>
  );
}
