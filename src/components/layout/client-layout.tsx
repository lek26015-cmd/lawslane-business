
'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import FloatingChatButton from '@/components/chat/floating-chat-button';
import ChatModal from '@/components/chat/chat-modal';
import CookieBanner from '@/components/cookie-banner';

export default function ClientLayout({
  children,
  domainType = 'main',
}: {
  children: React.ReactNode;
  domainType?: string;
}) {
  const pathname = usePathname();
  const [userRole, setUserRole] = useState<string | null>(null);

  // Hide header/footer ONLY for admin pages (lawyer pages should show header now)
  const isAdminPage = pathname.startsWith('/admin') || domainType === 'admin';

  if (isAdminPage) {
    return <>{children}</>;
  }


  return (
    <>
      <div className="flex min-h-screen flex-col">
        <Header setUserRole={setUserRole} domainType={domainType} />
        <main className="flex-1 bg-gray-50/50">{children}</main>
        <Footer userRole={userRole} />
      </div>
      <FloatingChatButton />
      <ChatModal />
      <CookieBanner />
    </>
  );
}
