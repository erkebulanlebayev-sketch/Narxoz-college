import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Система управления колледжем',
  description: 'Умное расписание и учет оценок',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
