'use client';
export const runtime = 'edge';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTranslations, useLocale } from 'next-intl';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import {
    FileText,
    FolderLock,
    CreditCard,
    Users,
    CalendarDays,
    CheckCircle2,
    Clock,
    ArrowUpRight,
    Loader2,
    Plus,
    BarChart3,
    Shield,
    TrendingUp,
    TrendingDown,
    Bell,
    Zap,
    Scale,
    Workflow,
    Bot,
    SearchCheck,
    Blocks,
    PiggyBank,
    ArrowRight,
    AlertTriangle,
    Sparkles,
    Building2,
} from 'lucide-react';
import { useB2BProfile } from '@/context/b2b-profile-context';
import { useNotifications } from '@/hooks/use-notifications';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { NotificationList } from '@/components/admin/notification-list';
import Link from 'next/link';

export default function B2BOverviewPage() {
    const t = useTranslations('B2BSidebar');
    const tOverview = useTranslations('B2BDashboard.dashboardV2');
    const locale = useLocale();
    const { user, isUserLoading } = useUser();
    const { profile, isLoading: isProfileLoading } = useB2BProfile();
    const { unreadCount } = useNotifications(user?.uid);
    const router = useRouter();
    const [isNotifOpen, setIsNotifOpen] = useState(false);

    useEffect(() => {
        if (!isUserLoading && !user) router.push('/login');
    }, [isUserLoading, user, router]);

    if (isUserLoading || isProfileLoading || !user) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="w-8 h-8 animate-spin text-[#002f4b]" />
            </div>
        );
    }

    const firstName = user?.displayName?.split(' ')[0] || tOverview('defaultUser');

    return (
        <div className="p-6 md:p-10 space-y-10 max-w-7xl mx-auto">
            {/* Welcome Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#002f4b] to-[#004a75] p-8 md:p-12 text-white shadow-2xl">
                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />

                <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <Badge className="bg-white/15 border-white/20 backdrop-blur-sm px-3 py-1 text-white"><Shield className="w-3 h-3 mr-1" />{profile?.plan || 'Professional Plan'}</Badge>
                            <Badge className="bg-emerald-500/20 border-emerald-400/20 backdrop-blur-sm px-3 py-1 text-emerald-200"><Zap className="w-3 h-3 mr-1" />Active</Badge>
                        </div>
                        <h1 className="text-2xl md:text-3xl font-bold">{tOverview('greeting', { name: firstName })}</h1>
                        <p className="text-white/70 mt-2 text-sm md:text-base max-w-md">{tOverview('welcomeMsg')}</p>
                    </div>

                    <Popover open={isNotifOpen} onOpenChange={setIsNotifOpen}>
                        <PopoverTrigger asChild>
                            <Button className="bg-white/15 hover:bg-white/25 text-white border border-white/20 backdrop-blur-sm rounded-xl gap-2 h-11 px-5 transition-all">
                                <Bell className="w-4 h-4" />{tOverview('notifications')}
                                {unreadCount > 0 && (
                                    <span className="bg-red-500 text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center font-bold animate-pulse shadow-lg">{unreadCount}</span>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80 p-0 shadow-2xl border-white/10" align="end">
                            <NotificationList recipientId={user.uid} onItemClick={() => setIsNotifOpen(false)} />
                        </PopoverContent>
                    </Popover>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                <Link href="/contracts" className="contents">
                    <Card className="group rounded-2xl border shadow-sm hover:shadow-md transition-all cursor-pointer">
                        <CardContent className="p-5">
                            <div className="flex items-start justify-between mb-3">
                                <div className="p-2.5 rounded-xl shadow-lg bg-gradient-to-br from-[#002f4b] to-[#00466c] dark:from-slate-700 dark:to-slate-800">
                                    <FileText className="w-5 h-5 text-white" />
                                </div>
                                <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <p className="text-3xl font-bold text-foreground">24</p>
                            <p className="text-sm text-muted-foreground font-medium">{tOverview('stats.activeContracts')}</p>
                            <div className="flex items-center gap-1.5 mt-2">
                                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-[#002f4b] dark:bg-slate-800 dark:text-blue-400">+3</span>
                                <span className="text-xs text-muted-foreground">{tOverview('stats.thisMonth')}</span>
                            </div>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/vault" className="contents">
                    <Card className="group rounded-2xl border shadow-sm hover:shadow-md transition-all cursor-pointer">
                        <CardContent className="p-5">
                            <div className="flex items-start justify-between mb-3">
                                <div className="p-2.5 rounded-xl shadow-lg bg-gradient-to-br from-[#004a6f] to-[#00678d] dark:from-slate-700 dark:to-slate-800">
                                    <FolderLock className="w-5 h-5 text-white" />
                                </div>
                                <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <p className="text-3xl font-bold text-foreground">156</p>
                            <p className="text-sm text-muted-foreground font-medium">{tOverview('stats.vaultDocs')}</p>
                            <div className="flex items-center gap-1.5 mt-2">
                                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">12</span>
                                <span className="text-xs text-muted-foreground">{tOverview('stats.pendingReview')}</span>
                            </div>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/billing" className="contents">
                    <Card className="group rounded-2xl border shadow-sm hover:shadow-md transition-all cursor-pointer">
                        <CardContent className="p-5">
                            <div className="flex items-start justify-between mb-3">
                                <div className="p-2.5 rounded-xl shadow-lg bg-gradient-to-br from-[#004060] to-[#006080] dark:from-slate-700 dark:to-slate-800">
                                    <PiggyBank className="w-5 h-5 text-white" />
                                </div>
                                <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <p className="text-3xl font-bold text-foreground">฿600K</p>
                            <p className="text-sm text-muted-foreground font-medium">{tOverview('stats.spendYearly')}</p>
                            <div className="flex items-center gap-1.5 mt-2">
                                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400">-8%</span>
                                <span className="text-xs text-muted-foreground">{tOverview('stats.fromLastYear')}</span>
                            </div>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/calendar" className="contents">
                    <Card className="group rounded-2xl border shadow-sm hover:shadow-md transition-all cursor-pointer">
                        <CardContent className="p-5">
                            <div className="flex items-start justify-between mb-3">
                                <div className="p-2.5 rounded-xl shadow-lg bg-gradient-to-br from-[#002742] to-[#004561] dark:from-slate-700 dark:to-slate-800">
                                    <CalendarDays className="w-5 h-5 text-white" />
                                </div>
                                <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <p className="text-3xl font-bold text-foreground">5</p>
                            <p className="text-sm text-muted-foreground font-medium">{tOverview('stats.deadlines')}</p>
                            <div className="flex items-center gap-1.5 mt-2">
                                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">2</span>
                                <span className="text-xs text-muted-foreground">{tOverview('stats.thisWeek')}</span>
                            </div>
                        </CardContent>
                    </Card>
                </Link>
            </div>

            {/* Active Workflows & AI Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Active Workflows */}
                <Card className="rounded-2xl shadow-sm border">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-foreground flex items-center gap-2 text-base">
                            <Workflow className="w-5 h-5 text-violet-600" />
                            {tOverview('workflows.title')}
                            <Badge className="bg-violet-100 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400 text-[10px] ml-auto">
                                <Bot className="w-3 h-3 mr-1" /> AI
                            </Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {[
                            { name: tOverview('workflows.items.crm'), status: tOverview('workflows.items.crmStatus'), progress: 60, color: 'bg-blue-500' },
                            { name: tOverview('workflows.items.expiry'), status: tOverview('workflows.items.expiryStatus'), progress: 100, color: 'bg-emerald-500' },
                            { name: tOverview('workflows.items.vendor'), status: tOverview('workflows.items.vendorStatus'), progress: 40, color: 'bg-amber-500' },
                        ].map((wf, i) => (
                            <div key={i} className="p-3 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-semibold text-foreground">{wf.name}</span>
                                    <span className="text-[11px] text-muted-foreground">{wf.status}</span>
                                </div>
                                <div className="h-1.5 bg-muted/50 rounded-full overflow-hidden">
                                    <div className={`h-full ${wf.color} rounded-full transition-all`} style={{ width: `${wf.progress}%` }} />
                                </div>
                            </div>
                        ))}
                        <Link href="/workflow">
                            <Button variant="ghost" className="w-full mt-1 text-[#002f4b] dark:text-blue-400 text-xs">{tOverview('workflows.viewAll')}</Button>
                        </Link>
                    </CardContent>
                </Card>

                {/* AI Insights */}
                <Card className="rounded-2xl shadow-sm border">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-foreground flex items-center gap-2 text-base">
                            <Sparkles className="w-5 h-5 text-amber-500" />
                            {tOverview('insights.title')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <Link href="/contracts" className="block">
                            <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors group cursor-pointer">
                                <div className="p-1.5 rounded-lg bg-red-50 dark:bg-red-500/10 shrink-0 mt-0.5">
                                    <AlertTriangle className="w-4 h-4 text-red-500" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-foreground">{tOverview('insights.i1')}</p>
                                </div>
                                <Button variant="ghost" size="sm" className="text-[11px] text-[#002f4b] dark:text-blue-400 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">{tOverview('insights.i1Action')}</Button>
                            </div>
                        </Link>
                        <Link href="/legal-spend" className="block">
                            <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors group cursor-pointer">
                                <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 shrink-0 mt-0.5">
                                    <TrendingDown className="w-4 h-4 text-emerald-500" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-foreground">{tOverview('insights.i2')}</p>
                                </div>
                                <Button variant="ghost" size="sm" className="text-[11px] text-[#002f4b] dark:text-blue-400 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">{tOverview('insights.i2Action')}</Button>
                            </div>
                        </Link>
                        <Link href="/due-diligence" className="block">
                            <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors group cursor-pointer">
                                <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-500/10 shrink-0 mt-0.5">
                                    <SearchCheck className="w-4 h-4 text-amber-500" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-foreground">{tOverview('insights.i3')}</p>
                                </div>
                                <Button variant="ghost" size="sm" className="text-[11px] text-[#002f4b] dark:text-blue-400 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">{tOverview('insights.i3Action')}</Button>
                            </div>
                        </Link>
                        <Link href="/contracts" className="block">
                            <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors group cursor-pointer">
                                <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-500/10 shrink-0 mt-0.5">
                                    <Building2 className="w-4 h-4 text-blue-500" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-foreground">{tOverview('insights.i4')}</p>
                                </div>
                                <Button variant="ghost" size="sm" className="text-[11px] text-[#002f4b] dark:text-blue-400 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">{tOverview('insights.i4Action')}</Button>
                            </div>
                        </Link>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activity + Contract Status + Security */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Activity */}
                <div className="lg:col-span-2">
                    <Card className="rounded-2xl shadow-sm border">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-foreground flex items-center gap-2 text-base">
                                <BarChart3 className="w-5 h-5 text-[#002f4b] dark:text-blue-400" />
                                {tOverview('activity.title')}
                            </CardTitle>
                        </CardHeader>
                        <div className="space-y-1">
                            <Link href="/contracts" className="block">
                                <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer">
                                    <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 shrink-0">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-foreground truncate">{tOverview('activity.items.a1')}</p>
                                        <p className="text-[11px] text-muted-foreground">{tOverview('activity.items.a1Time')}</p>
                                    </div>
                                    <Badge variant="outline" className="text-[10px] shrink-0">CLM</Badge>
                                </div>
                            </Link>
                            <Link href="/vault" className="block">
                                <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer">
                                    <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-500/10 shrink-0">
                                        <FolderLock className="w-4 h-4 text-blue-500" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-foreground truncate">{tOverview('activity.items.a2')}</p>
                                        <p className="text-[11px] text-muted-foreground">{tOverview('activity.items.a2Time')}</p>
                                    </div>
                                    <Badge variant="outline" className="text-[10px] shrink-0">Vault</Badge>
                                </div>
                            </Link>
                            <Link href="/contracts" className="block">
                                <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer">
                                    <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-500/10 shrink-0">
                                        <Clock className="w-4 h-4 text-amber-500" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-foreground truncate">{tOverview('activity.items.a3')}</p>
                                        <p className="text-[11px] text-muted-foreground">{tOverview('activity.items.a3Time')}</p>
                                    </div>
                                    <Badge variant="outline" className="text-[10px] shrink-0">Review</Badge>
                                </div>
                            </Link>
                            <Link href="/billing" className="block">
                                <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer">
                                    <div className="p-1.5 rounded-lg bg-violet-50 dark:bg-violet-500/10 shrink-0">
                                        <CreditCard className="w-4 h-4 text-violet-500" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-foreground truncate">{tOverview('activity.items.a4')}</p>
                                        <p className="text-[11px] text-muted-foreground">{tOverview('activity.items.a4Time')}</p>
                                    </div>
                                    <Badge variant="outline" className="text-[10px] shrink-0">Billing</Badge>
                                </div>
                            </Link>
                            <Link href="/due-diligence" className="block">
                                <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer">
                                    <div className="p-1.5 rounded-lg bg-teal-50 dark:bg-teal-500/10 shrink-0">
                                        <SearchCheck className="w-4 h-4 text-teal-500" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-foreground truncate">{tOverview('activity.items.a5')}</p>
                                        <p className="text-[11px] text-muted-foreground">{tOverview('activity.items.a5Time')}</p>
                                    </div>
                                    <Badge variant="outline" className="text-[10px] shrink-0">DD</Badge>
                                </div>
                            </Link>
                        </div>
                    </Card>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                    {/* Contract Status */}
                    <Card className="rounded-2xl shadow-sm border">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-foreground flex items-center gap-2 text-sm">
                                <Scale className="w-4 h-4 text-[#002f4b] dark:text-blue-400" />
                                {tOverview('contractStatus.title')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {[
                                { label: tOverview('contractStatus.active'), count: 12, total: 24, color: 'bg-emerald-500' },
                                { label: tOverview('contractStatus.review'), count: 5, total: 24, color: 'bg-amber-500' },
                                { label: tOverview('contractStatus.expiring'), count: 3, total: 24, color: 'bg-red-500' },
                                { label: tOverview('contractStatus.draft'), count: 4, total: 24, color: 'bg-slate-400' },
                            ].map((item, i) => (
                                <div key={i}>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs text-muted-foreground">{item.label}</span>
                                        <span className="text-xs font-bold text-foreground">{item.count}</span>
                                    </div>
                                    <div className="h-1.5 bg-muted/50 rounded-full overflow-hidden">
                                        <div className={`h-full ${item.color} rounded-full`} style={{ width: `${(item.count / item.total) * 100}%` }} />
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Security */}
                    <Card className="rounded-2xl shadow-sm border overflow-hidden">
                        <CardContent className="p-0">
                            <div className="p-4 bg-gradient-to-br from-[#002f4b] to-[#00466c] dark:from-slate-800 dark:to-slate-900">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-white/20"><Shield className="w-5 h-5 text-white" /></div>
                                    <div>
                                        <p className="text-sm font-bold text-white">{tOverview('security.title')}</p>
                                        <p className="text-xs text-emerald-100">Compliance: 98/100</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-3 space-y-2">
                                {['PDPA', 'Encryption', '2FA'].map((item, i) => (
                                    <div key={i} className="flex items-center justify-between text-xs">
                                        <span className="text-muted-foreground">{item}</span>
                                        <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1"><CheckCircle2 className="w-3 h-3" />{tOverview('security.passed')}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
