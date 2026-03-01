'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    ArrowLeft,
    Search,
    Link2,
    MessageCircle,
    Database,
    Cloud,
    Blocks,
    CheckCircle2
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useUser } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { integrationService } from '@/services/integrationService';

export default function NewIntegrationPage() {
    const tSidebar = useTranslations('B2BSidebar');
    const t = useTranslations('B2BDashboard.integrations');
    const tNew = useTranslations('B2BDashboard.integrations.newConnection');
    const router = useRouter();
    const { user } = useUser();
    const { toast } = useToast();

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    // Slack Connection State
    const [isSlackDialogOpen, setIsSlackDialogOpen] = useState(false);
    const [slackWebhookInput, setSlackWebhookInput] = useState('');
    const [isSlackConnected, setIsSlackConnected] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

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
            // Redirect back to integrations page on success
            setTimeout(() => router.push('/integrations'), 1500);
        } catch (error) {
            toast({ title: t('messages.error'), description: t('messages.saveError'), variant: 'destructive' });
        } finally {
            setIsSaving(false);
        }
    };

    const categories = [
        { id: 'all', name: tNew('category.all') },
        { id: 'sales', name: tNew('category.salesCRM') },
        { id: 'finance', name: tNew('category.financeERP') },
        { id: 'hr', name: tNew('category.hrHRIS') },
        { id: 'notify', name: tNew('category.notify') },
        { id: 'esign', name: tNew('category.esign') }
    ];

    const integrations = [
        {
            id: 'salesforce',
            name: tNew('apps.salesforce.name'),
            desc: tNew('apps.salesforce.desc'),
            category: 'sales',
            logo: '🔵',
            available: false
        },
        {
            id: 'hubspot',
            name: tNew('apps.hubspot.name'),
            desc: tNew('apps.hubspot.desc'),
            category: 'sales',
            logo: '🟧',
            available: false
        },
        {
            id: 'sap',
            name: tNew('apps.sap.name'),
            desc: tNew('apps.sap.desc'),
            category: 'finance',
            logo: '🟢',
            available: false
        },
        {
            id: 'bamboohr',
            name: tNew('apps.bamboohr.name'),
            desc: tNew('apps.bamboohr.desc'),
            category: 'hr',
            logo: '🟡',
            available: false
        },
        {
            id: 'slack',
            name: tNew('apps.slack.name'),
            desc: tNew('apps.slack.desc'),
            category: 'notify',
            logo: '🟣',
            available: true,
            status: isSlackConnected ? 'connected' : 'disconnected'
        },
        {
            id: 'line',
            name: tNew('apps.line.name'),
            desc: tNew('apps.line.desc'),
            category: 'notify',
            logo: '🟢',
            available: false // Currently unavailable as requested
        },
        {
            id: 'docusign',
            name: tNew('apps.docusign.name'),
            desc: tNew('apps.docusign.desc'),
            category: 'esign',
            logo: '🔶',
            available: false
        },
    ];

    const filteredIntegrations = integrations.filter(app => {
        const matchesCategory = selectedCategory === 'all' || app.category === selectedCategory;
        const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            app.desc.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="p-6 md:p-8 space-y-8 max-w-[1200px] mx-auto min-h-screen">
            {/* Header & Navigation */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.back()}
                        className="mb-4 text-muted-foreground hover:text-foreground -ml-2"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        {tNew('backToIntegrations')}
                    </Button>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-[#002f4b] dark:text-blue-400 tracking-tight">{tNew('marketplace')}</h1>
                    <p className="text-muted-foreground mt-2 text-base md:text-lg">{tNew('marketplaceSubtitle')}</p>
                </div>

                <div className="relative w-full md:w-80 shrink-0">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                    <Input
                        placeholder={tNew('searchPlaceholder')}
                        className="pl-10 rounded-xl bg-background border-slate-200 shadow-sm focus-visible:ring-[#002f4b] h-12 text-base"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                {categories.map((cat) => (
                    <Button
                        key={cat.id}
                        variant={selectedCategory === cat.id ? 'default' : 'outline'}
                        className={`rounded-full shrink-0 ${selectedCategory === cat.id ? 'bg-[#002f4b] hover:bg-[#00466c] text-white' : 'bg-background hover:bg-slate-100'}`}
                        onClick={() => setSelectedCategory(cat.id)}
                    >
                        {cat.name}
                    </Button>
                ))}
            </div>

            {/* App Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredIntegrations.map((app) => (
                    <Card
                        key={app.id}
                        className={`rounded-2xl border shadow-sm transition-all duration-300 relative overflow-hidden group 
                            ${app.available ? 'hover:shadow-lg hover:border-[#002f4b]/50 cursor-pointer hover:-translate-y-1' : 'opacity-70 grayscale-[50%] bg-slate-50 dark:bg-slate-900/50 cursor-not-allowed'}
                        `}
                        onClick={() => {
                            if (app.available) {
                                if (app.id === 'slack') {
                                    if (isSlackConnected) {
                                        toast({ title: tNew('alreadyConnected'), description: tNew('slackAlreadyConnected') });
                                    } else {
                                        setIsSlackDialogOpen(true);
                                    }
                                }
                            } else {
                                toast({
                                    title: tNew('comingSoonTitle'),
                                    description: tNew('comingSoonDesc'),
                                    variant: 'default'
                                });
                            }
                        }}
                    >
                        {!app.available && (
                            <div className="absolute top-4 right-4 z-10">
                                <Badge variant="secondary" className="bg-slate-200/50 text-slate-500 font-medium">{tNew('comingSoonBadge')}</Badge>
                            </div>
                        )}
                        {app.status === 'connected' && (
                            <div className="absolute top-4 right-4 z-10">
                                <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"><CheckCircle2 className="w-3 h-3 mr-1" /> {t('status.connected')}</Badge>
                            </div>
                        )}
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4 mb-4">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-sm border ${app.available ? 'bg-white' : 'bg-transparent'}`}>
                                    {app.logo}
                                </div>
                                <h3 className="font-bold text-lg text-foreground group-hover:text-[#002f4b] transition-colors">{app.name}</h3>
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed h-10 line-clamp-2">
                                {app.desc}
                            </p>

                            <div className="mt-6 pt-4 border-t border-border flex justify-end">
                                {app.available ? (
                                    <Button variant={isSlackConnected ? "secondary" : "default"} className={`w-full rounded-xl ${!isSlackConnected ? "bg-[#002f4b] hover:bg-[#00466c] text-white" : ""}`}>
                                        {isSlackConnected ? tNew('manageConnection') : tNew('connectApp')}
                                    </Button>
                                ) : (
                                    <Button variant="outline" className="w-full rounded-xl" disabled>{tNew('comingSoonBadge')}</Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Empty State */}
            {filteredIntegrations.length === 0 && (
                <div className="py-20 text-center flex flex-col items-center justify-center bg-muted/20 rounded-3xl border border-dashed">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                        <Search className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">{tNew('empty.title')}</h3>
                    <p className="text-muted-foreground">{tNew('empty.desc')}</p>
                    <Button variant="outline" className="mt-6 rounded-xl" onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}>{tNew('empty.clearSearch')}</Button>
                </div>
            )}

            {/* Slack Connection Dialog */}
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
