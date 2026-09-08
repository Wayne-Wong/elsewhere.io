import type { Metadata } from 'next';
import './globals.css';
import './refinements.css';
import '@fontsource/nunito/latin-400.css';
import '@fontsource/nunito/latin-600.css';
import '@fontsource/nunito/latin-700.css';
export const metadata: Metadata = {
  title: 'Elsewhere — Still becoming.',
  description:
    'Explore the lives waiting in your choices. A playable constellation of chance, connection, and possibility.',
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  );
}
