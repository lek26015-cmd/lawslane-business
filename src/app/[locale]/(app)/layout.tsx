'use client';
export const runtime = 'edge';

import React, { useEffect, useState } from 'react';
import { B2BProfileProvider, useB2BProfile } from '@/context/b2b-profile-context';
import B2BSidebar from '@/components/layout/b2b-sidebar';
import B2BNavbar from '@/components/layout/b2b-navbar';
import { AnimatedPage } from '@/components/animated-page';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

function B2BAuthGuardian({ children }: { children: React.ReactNode }) {
    const { user, isUserLoading } = useUser();
    const { profile, isLoading: isProfileLoading } = useB2BProfile();
    const router = useRouter();
    const [isVerifying, setIsVerifying] = useState(true);

    useEffect(() => {
        if (isUserLoading || isProfileLoading) return;

        if (!user) {
            router.push('/login');
            return;
        }

        const isSubscribed = profile?.subscriptionStatus === 'active' || profile?.subscriptionStatus === 'trialing';
        const isSuperAdmin = profile?.superAdmin === true;

        if (!isSubscribed && !isSuperAdmin) {
            router.push('/subscribe?plan=Starter');
        } else {
            setIsVerifying(false);
        }
    }, [user, isUserLoading, profile, isProfileLoading, router]);

    if (isUserLoading || isProfileLoading || (isVerifying && user)) {
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-900 gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
                <p className="text-slate-400 font-medium animate-pulse">กำลังตรวจสอบสิทธิ์การใช้งาน...</p>
            </div>
        );
    }

    return <>{children}</>;
}

export default function B2BDashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <B2BProfileProvider>
            <B2BAuthGuardian>
                <div className="flex h-screen overflow-hidden bg-background">
                    <B2BSidebar />
                    <div className="flex flex-col flex-1 overflow-hidden relative">
                        <B2BNavbar />
                        <main className="flex-1 overflow-y-auto">
                            <AnimatedPage>
                                {children}
                            </AnimatedPage>
                        </main>
                    </div>
                </div>
            </B2BAuthGuardian>
        </B2BProfileProvider>
    );
}
