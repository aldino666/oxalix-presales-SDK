import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
export const metadata: Metadata = { title: "Oxalix Docs", description: "Oxalix Prime Layer Documentation" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased bg-oxalix-bg text-white">
        <Header />
        <div className="container mx-auto flex">
          <Sidebar />
          <main className="flex-1 px-4 py-12 md:pl-72 max-w-4xl">{children}</main>
        </div>
      </body>
    </html>
  );
}
