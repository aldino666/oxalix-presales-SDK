import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Presale SDK Simulator',
  description: 'Simulation des instructions du SDK Castway',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
