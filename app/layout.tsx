import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Narxoz College - Система управления',
  description: 'Современная система управления учебным процессом',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
