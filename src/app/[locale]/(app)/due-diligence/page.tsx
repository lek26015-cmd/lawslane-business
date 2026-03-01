'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTranslations } from 'next-intl';
import {
    SearchCheck,
    Plus,
    ShieldCheck,
    ShieldAlert,
    AlertTriangle,
    FileSearch,
    Building2,
    Globe,
} from 'lucide-react';

export default function DueDiligencePage() {
    const tSidebar = useTranslations('B2BSidebar');
    const t = useTranslations('B2BDashboard.dueDiligence');

    const vendors = [
        { name: 'บริษัท ABC Technology จำกัด', type: 'IT Vendor', risk: 'low', status: 'approved', score: 92, checks: 5, countryKey: 'th' },
        { name: 'XYZ Consulting Partners', type: 'Consultant', risk: 'medium', status: 'reviewing', score: 68, checks: 3, countryKey: 'sg' },
        { name: 'Global Supply Co., Ltd.', type: 'Supplier', risk: 'high', status: 'flagged', score: 35, checks: 2, countryKey: 'cn' },
        { name: 'DataSoft Solutions', type: 'SaaS Provider', risk: 'low', status: 'approved', score: 88, checks: 4, countryKey: 'th' },
    ];

    const getRiskBadge = (risk: string) => {
        switch (risk) {
            case 'low': return <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20">{t('risk.low')}</Badge>;
            case 'medium': return <Badge className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20">{t('risk.medium')}</Badge>;
            case 'high': return <Badge className="bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20">{t('risk.high')}</Badge>;
            default: return null;
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-emerald-600 dark:text-emerald-400';
        if (score >= 60) return 'text-amber-600 dark:text-amber-400';
        return 'text-red-600 dark:text-red-400';
    };

    const stats = [
        { icon: Building2, label: t('stats.total'), value: '34', bg: '#002f4b' },
        { icon: ShieldCheck, label: t('stats.approved'), value: '28', bg: '#003d5c' },
        { icon: FileSearch, label: t('stats.reviewing'), value: '4', bg: '#004a6f' },
        { icon: ShieldAlert, label: t('stats.actionRequired'), value: '2', bg: '#002742' },
    ];

    return (
        <div className="p-6 md:p-8 space-y-8 max-w-[1400px] mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
                        {tSidebar('dueDiligence')}
                        <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400 text-xs">{t('newItemBadge')}</Badge>
                    </h1>
                    <p className="text-muted-foreground mt-1">{t('pageSubtitle')}</p>
                </div>
                <Button className="text-white rounded-xl gap-2 shadow-lg" style={{ background: 'linear-gradient(135deg, #002f4b, #00466c)' }}>
                    <Plus className="w-4 h-4" /> {t('btnNew')}
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={i} className="rounded-2xl border shadow-sm hover:shadow-md transition-all">
                            <CardContent className="p-5 text-center">
                                <div className="p-2.5 rounded-xl shadow-lg inline-flex mb-3" style={{ background: stat.bg }}>
                                    <Icon className="w-5 h-5 text-white" />
                                </div>
                                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                                <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Vendor List */}
            <Card className="rounded-2xl shadow-sm border">
                <CardHeader>
                    <CardTitle className="text-foreground flex items-center gap-2 text-lg">
                        <SearchCheck className="w-5 h-5" style={{ color: '#002f4b' }} />
                        {t('vendorList')}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    {vendors.map((vendor, i) => (
                        <div key={i} className="flex items-center justify-between p-4 rounded-xl hover:bg-muted/50 transition-colors group cursor-pointer">
                            <div className="flex items-center gap-4">
                                <div className={`p-2 rounded-lg ${vendor.risk === 'high' ? 'bg-red-50 dark:bg-red-500/10' : vendor.risk === 'medium' ? 'bg-amber-50 dark:bg-amber-500/10' : 'bg-emerald-50 dark:bg-emerald-500/10'}`}>
                                    {vendor.risk === 'high' ? <AlertTriangle className="w-4 h-4 text-red-500" /> :
                                        vendor.risk === 'medium' ? <ShieldAlert className="w-4 h-4 text-amber-500" /> :
                                            <ShieldCheck className="w-4 h-4 text-emerald-500" />}
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-foreground">{vendor.name}</p>
                                    <p className="text-xs text-muted-foreground">{vendor.type} · <Globe className="w-3 h-3 inline" /> {t(`country.${vendor.countryKey}`)} · {t('checksCount').replace('{count}', vendor.checks.toString())}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className={`text-lg font-bold ${getScoreColor(vendor.score)}`}>{vendor.score}</span>
                                {getRiskBadge(vendor.risk)}
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}
