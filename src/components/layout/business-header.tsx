'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Search, LogIn, LayoutDashboard, LogOut } from 'lucide-react';
import { Link } from '@/navigation';
import { useUser } from '@/firebase';
import Logo from '@/components/logo';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useTranslations } from 'next-intl';
import { signOut } from 'firebase/auth';
import { initializeFirebase } from '@/firebase';
import { getMainLink } from '@/lib/domain-utils';
import { cn } from '@/lib/utils';

interface BusinessHeaderProps {
    transparent?: boolean;
}

export function BusinessHeader({ transparent = true }: BusinessHeaderProps) {
    const { user, isUserLoading } = useUser();
    const t = useTranslations('B2BLanding');

    const handleLogout = async () => {
        const { auth } = initializeFirebase();
        if (auth) {
            try {
                await fetch('/api/auth/session', { method: 'DELETE' });
            } catch (err) {
                console.error("Failed to clear session cookie:", err);
            }
            await signOut(auth);
            window.location.href = '/';
        }
    };

    return (
        <header className={cn(
            "fixed top-0 inset-x-0 z-50 h-20 flex items-center transition-all duration-300",
            transparent ? "bg-transparent" : "bg-[#002f4b] shadow-lg"
        )}>
            <div className="container mx-auto px-4 flex items-center justify-between">
                <Logo href="/" variant="white" className="scale-110" subtitle="legal os" />

                <div className="hidden md:flex items-center gap-8">
                    <nav className="flex items-center gap-6 mr-4">
                        <Link href="/about" className="text-blue-100/70 hover:text-white text-sm font-medium transition-colors">
                            About
                        </Link>
                        <Link href="/services" className="text-blue-100/70 hover:text-white text-sm font-medium transition-colors">
                            Services
                        </Link>
                    </nav>

                    <Link
                        href="/experts"
                        className="text-blue-100/80 hover:text-white text-sm font-medium transition-colors flex items-center gap-2"
                    >
                        <Search className="w-4 h-4" />
                        {t('header.searchLawyer')}
                    </Link>

                    <div className="h-4 w-px bg-white/10" />

                    <LanguageSwitcher
                        className="bg-white/5 border-white/10 text-white hover:bg-white/10"
                    />

                    <div className="h-4 w-px bg-white/10" />

                    {isUserLoading ? (
                        <div className="w-24 h-10 bg-white/5 animate-pulse rounded-xl" />
                    ) : user ? (
                        <div className="flex items-center gap-4">
                            <Link href="/overview">
                                <Button className="bg-blue-500 hover:bg-blue-400 text-white rounded-xl px-6 h-10 gap-2 font-semibold shadow-lg shadow-blue-500/10 transition-all">
                                    <LayoutDashboard className="w-4 h-4" />
                                    {t('header.dashboard')}
                                </Button>
                            </Link>
                            <Button
                                variant="ghost"
                                className="text-white hover:bg-white/10 rounded-xl px-4 h-10 gap-2 border border-white/10"
                                onClick={handleLogout}
                            >
                                <LogOut className="w-4 h-4" />
                                {t('header.logout')}
                            </Button>
                        </div>
                    ) : (
                        <Link href="/login">
                            <Button className="bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm rounded-xl px-6 h-10 gap-2 font-semibold transition-all">
                                <LogIn className="w-4 h-4" />
                                {t('header.login')}
                            </Button>
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}
