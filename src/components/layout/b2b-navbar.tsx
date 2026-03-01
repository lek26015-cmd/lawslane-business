'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import { useUser, useFirebase } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { Building2, Settings, Moon, Sun, LogOut, ChevronDown, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useB2BProfile } from '@/context/b2b-profile-context';
import { NotificationBell } from '@/components/admin/notification-bell';
import Link from 'next/link';

export default function B2BNavbar() {
    const t = useTranslations('B2BSidebar'); // Reuse sidebar translations
    const { user } = useUser();
    const { auth } = useFirebase();
    const { profile, isLoading: isProfileLoading } = useB2BProfile();
    const { toast } = useToast();
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => { setMounted(true); }, []);

    const handleLogout = async () => {
        if (!auth) return;
        try {
            await fetch('/api/auth/session', { method: 'DELETE' });
            await signOut(auth);
            window.location.href = '/';
        } catch {
            toast({ title: 'Error', description: 'Logout failed', variant: 'destructive' });
        }
    };

    const isDark = mounted && theme === 'dark';

    return (
        <header className="h-16 border-b bg-background sticky top-0 z-40 flex items-center justify-between px-6 shadow-sm">
            {/* Left side: Workspace / Company Switcher (simplified for now) */}
            <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center shadow-sm border bg-[#002f4b]/5 text-[#002f4b] dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20">
                    <Building2 className="w-5 h-5" />
                </div>
                <div className="flex flex-col justify-center">
                    {mounted && !isProfileLoading ? (
                        <>
                            <p className="text-sm font-bold truncate text-foreground flex items-center gap-1 cursor-pointer hover:text-[#002f4b] transition-colors">
                                {profile?.companyName || 'Lawslane Legal OS'}
                                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                            </p>
                            <div className="flex items-center gap-2">
                                <p className="text-[10px] font-black tracking-tight text-blue-600 uppercase bg-blue-50 px-1.5 py-0.5 rounded-md border border-blue-100/50">{profile?.plan}</p>
                                <Link href="/subscribe?plan=Professional">
                                    <Button
                                        size="sm"
                                        className="h-5 px-2 py-0 text-[9px] font-bold rounded-full bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white border-none shadow-sm transition-all hover:scale-105"
                                    >
                                        Upgrade
                                    </Button>
                                </Link>
                            </div>
                        </>
                    ) : (
                        <div className="space-y-1.5">
                            <div className="h-4 w-32 bg-muted animate-pulse rounded"></div>
                            <div className="h-3 w-20 bg-muted/60 animate-pulse rounded"></div>
                        </div>
                    )}
                </div>
            </div>

            {/* Right side: Notifications & Profile */}
            <div className="flex items-center gap-2 md:gap-4">
                {/* Notification Bell */}
                {user && (
                    <div className="mr-2">
                        <NotificationBell recipientId={user.uid} />
                    </div>
                )}

                {/* User Dropdown */}
                {user && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative flex items-center gap-2.5 h-auto py-2 px-3 rounded-full hover:bg-muted/60 transition-colors focus:ring-0 focus-visible:ring-0">
                                <Avatar className="w-8 h-8 ring-1 ring-border shadow-sm">
                                    <AvatarImage src={user.photoURL || ''} />
                                    <AvatarFallback className="bg-[#002f4b] text-white text-xs font-bold">
                                        {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="hidden md:flex flex-col items-start overflow-hidden">
                                    <p className="text-sm font-semibold truncate text-foreground max-w-[120px]">{user.displayName || 'User'}</p>
                                    <p className="text-[10px] truncate text-muted-foreground max-w-[120px]">{user.email}</p>
                                </div>
                                <ChevronDown className="w-4 h-4 text-muted-foreground ml-1" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 rounded-xl shadow-lg mt-1 p-2">
                            <DropdownMenuLabel className="font-normal mb-1">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none text-foreground">{user.displayName || 'User'}</p>
                                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />

                            <DropdownMenuItem asChild className="cursor-pointer rounded-lg py-2">
                                <Link href="/settings" className="flex items-center">
                                    <Settings className="mr-2.5 w-4 h-4 text-muted-foreground" />
                                    <span>{t('settings')}</span>
                                </Link>
                            </DropdownMenuItem>

                            {mounted && (
                                <DropdownMenuItem onClick={() => setTheme(isDark ? 'light' : 'dark')} className="cursor-pointer rounded-lg py-2">
                                    {isDark ? (
                                        <Sun className="mr-2.5 w-4 h-4 text-muted-foreground" />
                                    ) : (
                                        <Moon className="mr-2.5 w-4 h-4 text-muted-foreground" />
                                    )}
                                    <span>{t('displayMode')}</span>
                                </DropdownMenuItem>
                            )}

                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50 focus:text-red-700 focus:bg-red-50 dark:hover:bg-red-950/30 dark:focus:bg-red-950/30 rounded-lg py-2">
                                <LogOut className="mr-2.5 w-4 h-4" />
                                <span className="font-medium">{t('logout')}</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>
        </header>
    );
}
