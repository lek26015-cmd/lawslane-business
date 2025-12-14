import type { Metadata } from 'next';
import { headers } from 'next/headers';
import './globals.css';
import React from 'react';
import { ClientProviders } from './client-providers';



export const metadata: Metadata = {
  title: 'Lawslane - ค้นหาทนายมืออาชีพ',
  description: 'ปรึกษาปัญหากฎหมายกับทนายความมืออาชีพ',
  icons: {
    icon: '/icon.jpg',
  },
  openGraph: {
    title: 'Lawslane',
    description: 'ปรึกษาปัญหากฎหมายกับทนายความมืออาชีพ',
    images: [
      {
        url: '/icon.jpg',
        width: 800,
        height: 600,
        alt: 'Lawslane Logo',
      },
    ],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const headersList = await headers();
  const domain = headersList.get('host') || "";
  const isSubdomain = domain.startsWith('admin.') || domain.startsWith('lawyer.');

  return (
    <html lang="th" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Prompt:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <ClientProviders isSubdomain={isSubdomain}>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
