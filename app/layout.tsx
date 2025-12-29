import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Helios - AI Web Briefing Agent',
  description: 'Governed planning tool for website creation',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}