import Link from "next/link";
import { ArrowRight, Code, Shield, Zap } from "lucide-react";

export default function HomePage() {
  return (
    <div className="space-y-12">
      <section className="space-y-6">
        <h1 className="text-5xl font-black tracking-tight lg:text-7xl text-white">
          Liquid <br /><span className="text-oxalix">Intelligence.</span>
        </h1>
        <p className="max-w-2xl text-xl text-gray-400">The definitive protocol for automated capital deployment.</p>
        <div className="flex flex-wrap gap-4">
          <Link href="/getting-started" className="rounded-lg bg-white px-6 py-3 text-sm font-bold text-black hover:bg-gray-200">GET STARTED</Link>
          <Link href="/instructions/createPresale" className="rounded-lg border border-oxalix-border bg-oxalix-card px-6 py-3 text-sm font-bold text-white hover:bg-oxalix-border">API REFERENCE</Link>
        </div>
      </section>
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-xl border border-oxalix-border bg-oxalix-card p-6 text-white"><Code className="text-oxalix mb-4" /><h3>Typed SDK</h3><p className="text-sm text-gray-400">Fully typed TypeScript client library.</p></div>
        <div className="rounded-xl border border-oxalix-border bg-oxalix-card p-6 text-white"><Shield className="text-oxalix mb-4" /><h3>Secure</h3><p className="text-sm text-gray-400">Built-in validation.</p></div>
        <div className="rounded-xl border border-oxalix-border bg-oxalix-card p-6 text-white"><Zap className="text-oxalix mb-4" /><h3>Fast</h3><p className="text-sm text-gray-400">Optimized for performance.</p></div>
      </div>
    </div>
  );
}
