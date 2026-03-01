'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTranslations } from 'next-intl';
import {
    PiggyBank,
    TrendingUp,
    TrendingDown,
    BarChart3,
    ArrowUpRight,
    Filter,
    Download,
    DollarSign,
    Building2,
    Briefcase,
} from 'lucide-react';

export default function LegalSpendPage() {
    const tSidebar = useTranslations('B2BSidebar');
    const t = useTranslations('B2BDashboard.legalSpend');

    const spendByCategory = [
        { categoryKey: 'lawyerFee', amount: '฿245,000', percent: 40, color: 'bg-blue-500' },
        { categoryKey: 'filingFee', amount: '฿89,000', percent: 15, color: 'bg-emerald-500' },
        { categoryKey: 'courtFee', amount: '฿120,000', percent: 20, color: 'bg-violet-500' },
        { categoryKey: 'consultingFee', amount: '฿78,000', percent: 13, color: 'bg-amber-500' },
        { categoryKey: 'otherFee', amount: '฿68,000', percent: 12, color: 'bg-slate-400' },
    ];

    const monthlyTrend = [
        { monthKey: 'Sep', amount: '฿85,000', budget: '฿100,000', status: 'under' },
        { monthKey: 'Oct', amount: '฿92,000', budget: '฿100,000', status: 'under' },
        { monthKey: 'Nov', amount: '฿110,000', budget: '฿100,000', status: 'over' },
        { monthKey: 'Dec', amount: '฿78,000', budget: '฿100,000', status: 'under' },
        { monthKey: 'Jan', amount: '฿95,000', budget: '฿100,000', status: 'under' },
        { monthKey: 'Feb', amount: '฿105,000', budget: '฿100,000', status: 'over' },
    ];

    return (
        <div className="p-6 md:p-8 space-y-8 max-w-[1400px] mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
                        {tSidebar('legalSpend')}
                        <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400 text-xs">{t('proBadge')}</Badge>
                    </h1>
                    <p className="text-muted-foreground mt-1">{t('pageSubtitle')}</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="rounded-xl gap-2">
                        <Filter className="w-4 h-4" /> {t('btnFilter')}
                    </Button>
                    <Button variant="outline" className="rounded-xl gap-2">
                        <Download className="w-4 h-4" /> {t('btnExport')}
                    </Button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="rounded-2xl border shadow-sm hover:shadow-md transition-all">
                    <CardContent className="p-5 flex items-center gap-4">
                        <div className="p-3 rounded-xl shadow-lg" style={{ background: 'linear-gradient(135deg, #002f4b, #00466c)' }}>
                            <DollarSign className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                            <p className="text-2xl font-bold text-foreground">฿600,000</p>
                            <p className="text-sm text-muted-foreground">{t('cards.totalSpend')}</p>
                        </div>
                        <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                            <TrendingDown className="w-3.5 h-3.5" />-8%
                        </div>
                    </CardContent>
                </Card>
                <Card className="rounded-2xl border shadow-sm hover:shadow-md transition-all">
                    <CardContent className="p-5 flex items-center gap-4">
                        <div className="p-3 rounded-xl shadow-lg" style={{ background: 'linear-gradient(135deg, #003d5c, #00567a)' }}>
                            <PiggyBank className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                            <p className="text-2xl font-bold text-foreground">฿400,000</p>
                            <p className="text-sm text-muted-foreground">{t('cards.remainingBudget')}</p>
                        </div>
                        <div className="flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
                            <TrendingUp className="w-3.5 h-3.5" />40%
                        </div>
                    </CardContent>
                </Card>
                <Card className="rounded-2xl border shadow-sm hover:shadow-md transition-all">
                    <CardContent className="p-5 flex items-center gap-4">
                        <div className="p-3 rounded-xl shadow-lg" style={{ background: 'linear-gradient(135deg, #004a6f, #00678d)' }}>
                            <BarChart3 className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                            <p className="text-2xl font-bold text-foreground">฿94,167</p>
                            <p className="text-sm text-muted-foreground">{t('cards.avgSpend')}</p>
                        </div>
                        <div className="flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
                            <TrendingUp className="w-3.5 h-3.5" />+12%
                        </div>
                    </CardContent>
                </Card>
            </div>


            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Spend by Category */}
                <Card className="rounded-2xl shadow-sm border">
                    <CardHeader>
                        <CardTitle className="text-foreground flex items-center gap-2 text-base">
                            <Briefcase className="w-5 h-5" style={{ color: '#002f4b' }} />
                            {t('category.title')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {spendByCategory.map((item, i) => (
                            <div key={i}>
                                <div className="flex items-center justify-between mb-1.5">
                                    <span className="text-sm text-foreground font-medium">{t(`category.${item.categoryKey}`)}</span>
                                    <span className="text-sm font-bold text-foreground">{item.amount}</span>
                                </div>
                                <div className="h-2 bg-muted/50 rounded-full overflow-hidden">
                                    <div className={`h-full ${item.color} rounded-full transition-all duration-500`} style={{ width: `${item.percent}%` }} />
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Monthly Trend */}
                <Card className="rounded-2xl shadow-sm border">
                    <CardHeader>
                        <CardTitle className="text-foreground flex items-center gap-2 text-base">
                            <BarChart3 className="w-5 h-5" style={{ color: '#002f4b' }} />
                            {t('trend.title')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {monthlyTrend.map((month, i) => (
                            <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors">
                                <span className="text-sm font-medium text-foreground w-12">{t(`trend.months.${month.monthKey}`)}</span>
                                <div className="flex-1 mx-4">
                                    <div className="h-2 bg-muted/50 rounded-full overflow-hidden">
                                        <div className={`h-full rounded-full ${month.status === 'over' ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: `${parseInt(month.amount.replace(/[^0-9]/g, '')) / 1200}%` }} />
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-bold text-foreground">{month.amount}</span>
                                    {month.status === 'over' ? (
                                        <Badge className="bg-red-50 text-red-600 border-red-200 dark:bg-red-500/10 dark:text-red-400 text-[10px]">{t('trend.status.overBudget')}</Badge>
                                    ) : (
                                        <Badge className="bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 text-[10px]">{t('trend.status.underBudget')}</Badge>
                                    )}
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
