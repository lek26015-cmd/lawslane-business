'use client';
export const runtime = 'edge';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTranslations } from 'next-intl';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/firebase';
import { contractService, type ContractData } from '@/services/contractService';
import Link from 'next/link';
import {
    FileText,
    Plus,
    Search,
    Filter,
    Eye,
    Loader2,
    Inbox,
} from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function CLMPage() {
    const tSidebar = useTranslations('B2BSidebar');
    const t = useTranslations('B2BDashboard.clm');
    const { toast } = useToast();
    const { user } = useUser();

    const [contracts, setContracts] = useState<ContractData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const loadContracts = useCallback(async () => {
        if (!user) return;
        try {
            setLoading(true);
            const data = await contractService.getContractsByOwner(user.uid);
            setContracts(data);
        } catch (error) {
            console.error('Error loading contracts:', error);
            toast({ title: t('messages.error'), description: t('messages.loadError'), variant: 'destructive' });
        } finally {
            setLoading(false);
        }
    }, [user, toast]);

    useEffect(() => {
        loadContracts();
    }, [loadContracts]);

    const filteredContracts = contracts.filter((c) =>
        c.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const stats = {
        active: contracts.filter(c => c.status === 'signed' || c.status === 'completed').length,
        review: contracts.filter(c => c.status === 'pending').length,
        draft: contracts.filter(c => c.status === 'draft').length,
        canceled: contracts.filter(c => c.status === 'canceled').length,
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'signed':
            case 'completed':
                return <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20">{t('status.active')}</Badge>;
            case 'pending':
                return <Badge className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20">{t('status.review')}</Badge>;
            case 'draft':
                return <Badge className="bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-500/20">{t('status.draft')}</Badge>;
            case 'canceled':
                return <Badge className="bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20">{t('status.canceled')}</Badge>;
            default:
                return null;
        }
    };

    const getCategoryLabel = (category?: string) => {
        const map: Record<string, string> = {
            nda: t('category.nda'),
            employment: t('category.employment'),
            service: t('category.service'),
            sales: t('category.sales'),
            vendor: t('category.vendor'),
            lease: t('category.lease'),
            partnership: t('category.partnership'),
            franchise: t('category.franchise'),
            loan: t('category.loan'),
            procurement: t('category.procurement'),
            consulting: t('category.consulting'),
            license: t('category.license'),
            distribution: t('category.distribution'),
            construction: t('category.construction'),
            other: t('category.other'),
        };
        return map[category || ''] || t('category.other');
    };

    const formatDeadline = (deadline?: string) => {
        if (!deadline || deadline === '-') return '-';
        try {
            return new Date(deadline).toLocaleDateString('th-TH', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
            });
        } catch {
            return deadline;
        }
    };

    return (
        <div className="p-6 md:p-8 space-y-8 max-w-[1400px] mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground">{tSidebar('clm')}</h1>
                    <p className="text-muted-foreground mt-1">{t('subtitle')}</p>
                </div>
                <Link href="/clm/new">
                    <Button
                        className="text-white rounded-xl gap-2 shadow-lg hover:shadow-xl transition-all"
                        style={{ background: 'linear-gradient(135deg, #002f4b, #00466c)' }}
                    >
                        <Plus className="w-4 h-4" /> {t('createNew')}
                    </Button>
                </Link>
            </div>

            {/* Search */}
            <div className="flex gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                        className="pl-10 rounded-xl h-11 border"
                        placeholder={t('searchPlaceholder')}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: t('status.active'), value: stats.active, bg: '#002f4b' },
                    { label: t('status.review'), value: stats.review, bg: '#003d5c' },
                    { label: t('status.draft'), value: stats.draft, bg: '#64748b' },
                    { label: t('status.canceled'), value: stats.canceled, bg: '#94a3b8' },
                ].map((stat, i) => (
                    <Card key={i} className="rounded-2xl border shadow-sm hover:shadow-md transition-all group cursor-pointer">
                        <CardContent className="p-5 text-center">
                            <p className="text-3xl font-bold text-foreground mb-1">{stat.value}</p>
                            <p className="text-xs text-muted-foreground font-medium">{stat.label}</p>
                            <div className="h-1 w-12 mx-auto mt-3 rounded-full" style={{ background: stat.bg }} />
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Contract List */}
            <Card className="rounded-2xl shadow-sm border">
                <CardHeader>
                    <CardTitle className="text-foreground flex items-center gap-2 text-lg">
                        <FileText className="w-5 h-5" style={{ color: '#002f4b' }} />
                        {t('allContracts')}
                        {!loading && (
                            <span className="text-sm font-normal text-muted-foreground ml-1">
                                ({filteredContracts.length})
                            </span>
                        )}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-16 gap-3">
                            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                            <p className="text-sm text-muted-foreground">{t('loading')}</p>
                        </div>
                    ) : filteredContracts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 gap-4">
                            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                                <Inbox className="w-10 h-10 text-slate-400" />
                            </div>
                            <div className="text-center">
                                <p className="text-base font-semibold text-foreground">
                                    {searchQuery ? t('empty.titleFound') : t('empty.titleEmpty')}
                                </p>
                                <p className="text-sm text-muted-foreground mt-1">
                                    {searchQuery
                                        ? t('empty.descFound', { searchQuery })
                                        : t('empty.descEmpty')
                                    }
                                </p>
                            </div>
                            {!searchQuery && (
                                <Link href="/clm/new">
                                    <Button
                                        className="text-white rounded-xl gap-2 mt-2"
                                        style={{ background: 'linear-gradient(135deg, #002f4b, #00466c)' }}
                                    >
                                        <Plus className="w-4 h-4" /> {t('createNew')}
                                    </Button>
                                </Link>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {filteredContracts.map((contract) => (
                                <div key={contract.id} className="flex items-center justify-between p-4 rounded-xl hover:bg-muted/50 transition-colors group cursor-pointer">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-500/10">
                                            <FileText className="w-4 h-4 text-[#002f4b] dark:text-blue-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-foreground">{contract.title}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {getCategoryLabel(contract.category)} · {contract.employer?.name || '-'} ↔ {contract.contractor?.name || '-'} · {t('deadline')}: {formatDeadline(contract.deadline)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {getStatusBadge(contract.status)}
                                        <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Eye className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
