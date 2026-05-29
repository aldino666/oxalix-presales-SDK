"use client";
import Link from "next/link";
import { Search, Menu, ExternalLink } from "lucide-react";
export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-oxalix-border bg-oxalix-bg/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-oxalix">
              <span className="text-xl font-bold text-black">☘</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              OXALIX <span className="text-oxalix text-sm font-medium">PRIME LAYER</span>
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-gray-400">
            <Link href="#" className="px-3 py-2 hover:text-white transition-colors">PROTOCOL</Link>
            <Link href="#" className="px-3 py-2 hover:text-white transition-colors">SECURITY</Link>
            <Link href="#" className="px-3 py-2 hover:text-white transition-colors">GOVERNANCE</Link>
            <Link href="/" className="px-3 py-2 text-oxalix border-b-2 border-oxalix">DOCS</Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <input type="text" placeholder="Search documentation..." className="h-9 w-64 rounded-full border border-oxalix-border bg-oxalix-card pl-10 pr-4 text-sm text-white focus:border-oxalix focus:outline-none" />
          </div>
          <button className="hidden md:flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-bold text-black hover:bg-gray-200">
            LAUNCH APP <ExternalLink size={14} />
          </button>
        </div>
      </div>
    </header>
  );
}
