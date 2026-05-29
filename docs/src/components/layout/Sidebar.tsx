"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import metadata from "@/data/metadata.json";
import { BookOpen, Terminal, Database, Layers, ChevronRight } from "lucide-react";
export function Sidebar() {
  const pathname = usePathname();
  const sections = [
    { title: "Introduction", icon: <BookOpen size={18} />, items: [{ name: "Overview", href: "/" }, { name: "Getting Started", href: "/getting-started" }] },
    { title: "Instructions", icon: <Terminal size={18} />, items: metadata.instructions.map(i => ({ name: i.name, href: `/instructions/${i.name}` })) },
    { title: "Accounts", icon: <Database size={18} />, items: metadata.accounts.map(a => ({ name: a.name, href: `/accounts/${a.name}` })) },
    { title: "Types", icon: <Layers size={18} />, items: [{ name: "All Types", href: "/types" }] }
  ];
  return (
    <aside className="fixed left-0 top-16 z-30 hidden h-[calc(100vh-4rem)] w-64 overflow-y-auto border-r border-oxalix-border px-4 py-8 md:block text-white">
      <div className="space-y-8">
        {sections.map((section) => (
          <div key={section.title}>
            <h4 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-oxalix">
              {section.icon} {section.title}
            </h4>
            <ul className="space-y-1 border-l border-oxalix-border ml-2">
              {section.items.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={cn("group flex items-center justify-between py-2 pl-4 pr-2 text-sm transition-all hover:text-white", pathname === item.href ? "border-l-2 border-oxalix -ml-[2px] bg-oxalix/5 text-oxalix font-medium" : "text-gray-400")}>
                    {item.name}
                    <ChevronRight size={14} className={cn("opacity-0 transition-all group-hover:opacity-100", pathname === item.href && "opacity-100 text-oxalix")} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </aside>
  );
}
