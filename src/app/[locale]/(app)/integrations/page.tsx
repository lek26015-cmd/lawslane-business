'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import {
    Blocks,
    Plus,
    CheckCircle2,
    AlertCircle,
    RefreshCw,
    ArrowRight,
    Database,
    Cloud,
    Link2,
    ArrowLeftRight,
    TrendingUp,
    CreditCard,
    SearchCheck,
    MessageCircle,
    Sparkles,
} from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUser } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { integrationService } from '@/services/integrationService';

export default function IntegrationsPage() {
    const tSidebar = useTranslations('B2BSidebar');
    const t = useTranslations('B2BDashboard.integrations');
    const { user } = useUser();
    const { toast } = useToast();

    const [isSlackDialogOpen, setIsSlackDialogOpen] = useState(false);
    const [slackWebhookInput, setSlackWebhookInput] = useState('');
    const [isSlackConnected, setIsSlackConnected] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkConnections = async () => {
            if (!user?.uid) return;
            try {
                const webhookUrl = await integrationService.getSlackWebhook(user.uid);
                if (webhookUrl) {
                    setIsSlackConnected(true);
                }
            } catch (error) {
                console.error("Failed to check Slack connection", error);
            } finally {
                setIsLoading(false);
            }
        };

        checkConnections();
    }, [user?.uid]);

    const handleSaveSlackWebhook = async () => {
        if (!user?.uid) return;
        if (!slackWebhookInput.trim()) {
            toast({ title: t('messages.error'), description: t('messages.webhookRequired'), variant: 'destructive' });
            return;
        }

        setIsSaving(true);
        try {
            await integrationService.saveSlackWebhook(user.uid, slackWebhookInput.trim());
            setIsSlackConnected(true);
            setIsSlackDialogOpen(false);
            setSlackWebhookInput('');
            toast({ title: t('messages.success'), description: t('messages.slackConnected') });
        } catch (error) {
            toast({ title: t('messages.error'), description: t('messages.saveError'), variant: 'destructive' });
        } finally {
            setIsSaving(false);
        }
    };

    const handleDisconnectSlack = async () => {
        if (!user?.uid) return;
        setIsSaving(true);
        try {
            await integrationService.disconnectSlack(user.uid);
            setIsSlackConnected(false);
            toast({ title: t('messages.success'), description: t('messages.slackDisconnected') });
        } catch (error) {
            toast({ title: t('messages.error'), description: t('messages.disconnectError'), variant: 'destructive' });
        } finally {
            setIsSaving(false);
        }
    };

    const integrations = [
        {
            id: 'salesforce',
            name: t('apps.salesforce.name'),
            desc: t('apps.salesforce.desc'),
            status: 'connected',
            categoryKey: 'sales',
            lastSync: '5 นาทีที่แล้ว',
            logo: '🔵',
        },
        {
            id: 'sap',
            name: t('apps.sap.name'),
            desc: t('apps.sap.desc'),
            status: 'connected',
            categoryKey: 'finance',
            lastSync: '15 นาทีที่แล้ว',
            logo: '🟢',
        },
        {
            id: 'bamboohr',
            name: t('apps.bamboohr.name'),
            desc: t('apps.bamboohr.desc'),
            status: 'disconnected',
            categoryKey: 'hr',
            lastSync: '-',
            logo: '🟡',
        },
        {
            id: 'slack',
            name: t('apps.slack.name'),
            desc: t('apps.slack.desc'),
            status: isLoading ? 'pending' : (isSlackConnected ? 'connected' : 'disconnected'),
            categoryKey: 'notification',
            lastSync: isSlackConnected ? '1 นาทีที่แล้ว' : '-',
            logo: '🟣',
        },
        {
            id: 'docusign',
            name: t('apps.docusign.name'),
            desc: t('apps.docusign.desc'),
            status: 'pending',
            categoryKey: 'esign',
            lastSync: '-',
            logo: '🔶',
        },
    ];

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'connected': return <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20 text-[10px]"><CheckCircle2 className="w-3 h-3 mr-1" />{t('status.connected')}</Badge>;
            case 'disconnected': return <Badge className="bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-500/20 text-[10px]"><AlertCircle className="w-3 h-3 mr-1" />{t('status.disconnected')}</Badge>;
            case 'pending': return <Badge className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20 text-[10px]"><RefreshCw className="w-3 h-3 h-3 mr-1" />{t('status.pending')}</Badge>;
            default: return null;
        }
    };

    return (
        <div className="p-6 md:p-8 space-y-8 max-w-[1400px] mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground">{tSidebar('integrations')}</h1>
                    <p className="text-muted-foreground mt-1">{t('pageSubtitle')}</p>
                </div>
                <Link href="/integrations/new">
                    <Button
                        className="text-white rounded-xl gap-2 shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
                        style={{ background: 'linear-gradient(135deg, #002f4b, #00466c)' }}
                    >
                        <Plus className="w-4 h-4" /> {t('btnNew')}
                    </Button>
                </Link>
            </div>

            <Card className="rounded-2xl border border-blue-100 bg-blue-50/50 dark:bg-blue-900/10 dark:border-blue-900/30 overflow-hidden">
                <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-600/10 text-blue-600 dark:text-blue-400">
                            <Sparkles className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{t('banner.title')}</p>
                            <p className="text-xs text-muted-foreground">{t('banner.subtitle')}</p>
                        </div>
                    </div>
                    <Link href="/workflow/featured">
                        <Button size="sm" className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white border-none text-xs gap-1.5 shadow-sm">
                            {t('banner.btnNext')} <ArrowRight className="w-3.5 h-3.5" />
                        </Button>
                    </Link>
                </CardContent>
            </Card>

            <div>
                <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                    <ArrowLeftRight className="w-5 h-5 text-[#002f4b] dark:text-blue-400" />
                    {t('diagram.title')}
                </h2>
                <Card className="rounded-2xl border shadow-sm overflow-hidden">
                    <CardContent className="p-8">
                        <div className="flex items-center justify-center gap-6 flex-wrap">
                            <div className="flex flex-col items-center gap-3">
                                <div className="p-4 rounded-xl shadow-lg" style={{ background: 'linear-gradient(135deg, #002f4b, #00466c)' }}>
                                    <Database className="w-8 h-8 text-white" />
                                </div>
                                <span className="text-sm font-bold text-muted-foreground text-center">{t('diagram.clientBackend')}<br /><span className="text-xs font-normal opacity-80">{t('diagram.clientBackendDetail')}</span></span>
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <ArrowRight className="w-8 h-8 text-[#002f4b]/50 dark:text-blue-400/50" />
                                <span className="text-[10px] font-mono text-muted-foreground bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">REST API / Webhook</span>
                            </div>
                            <div className="flex flex-col items-center gap-3 scale-110 relative z-10">
                                <div className="absolute inset-0 bg-[#002f4b]/10 dark:bg-blue-400/10 blur-xl rounded-full"></div>
                                <div className="p-5 rounded-2xl shadow-xl border border-white/10" style={{ background: 'linear-gradient(135deg, #002f4b, #00466c)' }}>
                                    <Blocks className="w-10 h-10 text-white" />
                                </div>
                                <span className="text-sm font-bold text-foreground text-center">{t('diagram.lawslaneApp')}<br /><span className="text-xs font-normal opacity-80 text-muted-foreground">{t('diagram.lawslaneAppDetail')}</span></span>
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <ArrowLeftRight className="w-8 h-8 text-[#002f4b]/50 dark:text-blue-400/50" />
                                <span className="text-[10px] font-mono text-muted-foreground bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">Data Sync</span>
                            </div>
                            <div className="flex flex-col items-center gap-3">
                                <div className="p-4 rounded-xl shadow-lg" style={{ background: 'linear-gradient(135deg, #003d5c, #00567a)' }}>
                                    <Cloud className="w-8 h-8 text-white" />
                                </div>
                                <span className="text-sm font-bold text-muted-foreground text-center">{t('diagram.externalSystem')}<br /><span className="text-xs font-normal opacity-80">{t('diagram.externalSystemDetail')}</span></span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Integration List */}
            <Card id="integration-apps" className="rounded-2xl shadow-sm border scroll-mt-24">
                <CardHeader>
                    <CardTitle className="text-foreground flex items-center gap-2 text-lg">
                        <Link2 className="w-5 h-5 text-[#002f4b]" />
                        {t('catalogTitle')}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    {integrations.map((app) => (
                        <div
                            key={app.id}
                            onClick={() => {
                                if (app.id === 'slack') {
                                    if (isSlackConnected) return; // Prevent opening if already connected
                                    setIsSlackDialogOpen(true);
                                }
                            }}
                            className={`flex items-center justify-between p-4 rounded-xl hover:bg-muted/50 transition-colors group ${app.id === 'slack' ? 'cursor-pointer' : ''}`}
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center text-xl shadow-sm border">{app.logo}</div>
                                <div>
                                    <p className="text-base font-semibold text-foreground">{app.name} <Badge variant="outline" className="ml-2 text-[10px] font-normal">{t(`category.${app.categoryKey}`)}</Badge></p>
                                    <p className="text-sm text-muted-foreground mt-0.5">{app.desc}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 shrink-0">
                                {app.lastSync !== '-' && <span className="text-xs text-muted-foreground font-medium hidden md:inline-block">{t('lastSyncPrefix')} {app.lastSync}</span>}
                                {getStatusBadge(app.status)}
                                {app.id === 'slack' && isSlackConnected && (
                                    <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleDisconnectSlack(); }} disabled={isSaving} className="text-xs text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 h-7 px-2">
                                        {t('btnDisconnect')}
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Slack Webhook Connection Dialog */}
            <Dialog open={isSlackDialogOpen} onOpenChange={setIsSlackDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-[#E01E5A]/10 flex items-center justify-center">
                                <MessageCircle className="w-4 h-4 text-[#E01E5A]" />
                            </div>
                            {t('slackDialog.title')}
                        </DialogTitle>
                        <DialogDescription>
                            {t('slackDialog.desc')}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="webhook" className="text-right">Webhook URL</Label>
                            <Input
                                id="webhook"
                                placeholder="https://hooks.slack.com/services/..."
                                value={slackWebhookInput}
                                onChange={(e) => setSlackWebhookInput(e.target.value)}
                                className="col-span-3"
                            />
                            <p className="text-xs text-muted-foreground">
                                {t('slackDialog.hint')}
                            </p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsSlackDialogOpen(false)} disabled={isSaving}>{t('slackDialog.cancel')}</Button>
                        <Button
                            onClick={handleSaveSlackWebhook}
                            disabled={isSaving || !slackWebhookInput.trim()}
                            className="bg-[#E01E5A] hover:bg-[#C01548] text-white"
                        >
                            {isSaving ? t('slackDialog.saving') : t('slackDialog.connect')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </div>
    );
}
