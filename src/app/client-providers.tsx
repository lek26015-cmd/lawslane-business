
'use client';

import React from 'react';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { ChatProvider } from '@/context/chat-context';
import ClientLayout from '@/components/layout/client-layout';
import { Toaster } from '@/components/ui/toaster';

export function ClientProviders({ children, isSubdomain }: { children: React.ReactNode; isSubdomain?: boolean }) {
  return (
    <FirebaseClientProvider>
      <ChatProvider>
        <ClientLayout isSubdomain={isSubdomain}>{children}</ClientLayout>
        <Toaster />
      </ChatProvider>
    </FirebaseClientProvider>
  );
}
