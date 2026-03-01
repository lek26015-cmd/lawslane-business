'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Logo from '@/components/logo';
import logoColor from '@/pic/logo-lawslane-transparent-color.png';
import logoWhite from '@/pic/logo-lawslane-transparent-white.png';
import { cn } from '@/lib/utils';
import { useUser, useFirebase } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from 'next-themes';
import {
    LayoutDashboard,
    CreditCard,
    FileText,
    FolderLock,
    CalendarDays,
    Users,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight,
    Moon,
    Sun,
    Workflow,
    SearchCheck,
    PiggyBank,
    Blocks,
    ClipboardList,
    Sparkles,
    Bot,
    BarChart3,
    Building2,
    MessageSquare,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

type NavGroup = {
    titleKey: string;
    items: {
        key: string;
        icon: React.ElementType;
        href: string;
        badge?: { label: string; color: string };
    }[];
};

const navGroups: NavGroup[] = [
    {
        titleKey: 'coreTitle',
        items: [
            { key: 'overview', icon: LayoutDashboard, href: '/overview' },
            { key: 'clm', icon: FileText, href: '/clm' },
            { key: 'vault', icon: FolderLock, href: '/vault' },
            { key: 'billing', icon: CreditCard, href: '/billing' },
            { key: 'calendar', icon: CalendarDays, href: '/calendar' },
            { key: 'team', icon: Users, href: '/team' },
            { key: 'messages', icon: MessageSquare, href: '/messages' },
        ],
    },
    {
        titleKey: 'automationTitle',
        items: [
            { key: 'workflow', icon: Workflow, href: '/workflow', badge: { label: 'AI', color: 'violet' } },
            { key: 'workflowFeatured', icon: Sparkles, href: '/workflow/featured', badge: { label: 'HOT', color: 'amber' } },
            { key: 'dueDiligence', icon: SearchCheck, href: '/due-diligence', badge: { label: 'NEW', color: 'emerald' } },
        ],
    },
    {
        titleKey: 'intelligenceTitle',
        items: [
            { key: 'legalSpend', icon: PiggyBank, href: '/legal-spend', badge: { label: 'PRO', color: 'amber' } },
            { key: 'findLawyer', icon: SearchCheck, href: '/lawyers' },
            { key: 'integrations', icon: Blocks, href: '/integrations' },
            { key: 'auditTrail', icon: ClipboardList, href: '/audit-trail' },
        ],
    },
];

export default function B2BSidebar() {
    const t = useTranslations('B2BSidebar');
    const pathname = usePathname();
    const { user } = useUser();
    const { auth, firestore } = useFirebase();
    const { toast } = useToast();
    const { theme, setTheme } = useTheme();
    const [collapsed, setCollapsed] = useState(false);
    const [mounted, setMounted] = useState(false);

    const [companyName, setCompanyName] = useState<string | null>(null);
    const [isCompanyLoading, setIsCompanyLoading] = useState(true);

    useEffect(() => { setMounted(true); }, []);

    useEffect(() => {
        if (!user || !firestore) {
            setIsCompanyLoading(false);
            return;
        }

        const fetchCompany = async () => {
            try {
                const userDoc = await getDoc(doc(firestore, 'users', user.uid));
                if (userDoc.exists()) {
                    const data = userDoc.data();
                    let name = data.companyName || 'Lawslane Legal OS';
                    if (name.includes('Workspace')) {
                        name = name.replace('Workspace', 'Legal OS');
                    }
                    setCompanyName(name);
                } else {
                    setCompanyName('Lawslane Legal OS');
                }
            } catch (error) {
                console.error("Error fetching company:", error);
                setCompanyName('Lawslane Legal OS');
            } finally {
                setIsCompanyLoading(false);
            }
        };

        fetchCompany();
    }, [user, firestore]);

    const handleLogout = async () => {
        if (!auth) return;
        try {
            await signOut(auth);
            await fetch('/api/auth/session', { method: 'DELETE' });
            window.location.href = '/';
        } catch {
            toast({ title: 'Error', description: 'Logout failed', variant: 'destructive' });
        }
    };

    const isActive = (href: string) => {
        let p = pathname.replace(/^\/(th|en|zh)/, '');
        if (p === '' || p === '/') p = '/overview';
        if (p === '') p = '/overview';
        return p === href || p.startsWith(href + '/');
    };

    const isDark = mounted && theme === 'dark';

    const getBadgeClasses = (color: string) => {
        const map: Record<string, string> = {
            violet: 'bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-400',
            emerald: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400',
            amber: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400',
        };
        return map[color] || '';
    };

    return (
        <aside className={cn(
            "flex flex-col h-screen border-r transition-all duration-300 sticky top-0 shrink-0",
            "border-[#001f35]",
            collapsed ? "w-[72px]" : "w-[270px]"
        )} style={{ backgroundColor: '#002f4b' }}>
            {/* Header (Logo + Collapse Toggle) */}
            <div className={cn(
                "flex items-center border-b shrink-0 px-4 py-4 relative h-20",
                "border-white/10",
                collapsed ? "justify-center px-0" : "justify-between"
            )}>
                {!collapsed ? (
                    <div className="origin-left scale-[0.85]">
                        <Logo href="/overview" variant="white" subtitle="legal os" />
                    </div>
                ) : (
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/10">
                        <Image src={logoWhite} alt="Lawslane" width={20} height={20} className="object-contain" />
                    </div>
                )}

                {/* Collapse Toggle */}
                <Button
                    variant="ghost" size="icon"
                    className={cn(
                        "rounded-lg shrink-0 h-7 w-7",
                        "text-white/40 hover:text-white hover:bg-white/10",
                        collapsed && "absolute -right-3.5 top-1/2 -translate-y-1/2 bg-[#002f4b] border border-white/10 border-l-0 rounded-l-none"
                    )}
                    onClick={() => setCollapsed(!collapsed)}
                >
                    {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
                </Button>
            </div>

            {/* Navigation Groups */}
            <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-5 scrollbar-hide">
                {mounted && navGroups.map((group) => (
                    <div key={group.titleKey}>
                        {/* Group Label */}
                        {!collapsed && (
                            <p className={cn(
                                "text-[10px] font-bold uppercase tracking-[0.15em] mb-2 px-3",
                                "text-white"
                            )}>
                                {t(group.titleKey)}
                            </p>
                        )}
                        {collapsed && (
                            <div className="w-6 h-px mx-auto mb-2 bg-white/10" />
                        )}

                        <div className="space-y-0.5">
                            {group.items.map(({ key, icon: Icon, href, badge }) => {
                                const active = isActive(href);
                                return (
                                    <Link
                                        key={key}
                                        href={href}
                                        title={collapsed ? t(key) : undefined}
                                        className={cn(
                                            "flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-150 group relative",
                                            active
                                                ? "bg-white/15 text-white"
                                                : "text-white hover:bg-white/[0.07] hover:text-white",
                                            collapsed && "justify-center px-2"
                                        )}
                                    >
                                        {active && (
                                            <div className={cn(
                                                "absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 rounded-r-full",
                                                "bg-blue-400"
                                            )} />
                                        )}
                                        <Icon className={cn(
                                            "w-[17px] h-[17px] shrink-0",
                                            active
                                                ? "text-blue-300"
                                                : "text-white/90 group-hover:text-white"
                                        )} />
                                        {!collapsed && (
                                            <>
                                                <span className="flex-1">{t(key)}</span>
                                                {badge && (
                                                    <span className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded-md leading-none", getBadgeClasses(badge.color))}>
                                                        {badge.label}
                                                    </span>
                                                )}
                                            </>
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </nav>

            {/* Bottom */}
            <div className="px-3 py-4 border-t flex justify-center shrink-0 border-white/10">
                {mounted && (
                    !collapsed ? (
                        <p className="text-[10px] text-center font-medium leading-relaxed text-white/50">
                            Lawslane Legal OS &middot; &copy; {new Date().getFullYear()}
                        </p>
                    ) : (
                        <p className="text-[8px] text-center font-medium text-white/30">
                            &copy;
                        </p>
                    )
                )}
            </div>
        </aside>
    );
}
