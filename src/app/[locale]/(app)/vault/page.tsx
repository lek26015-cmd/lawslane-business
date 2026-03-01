'use client';
export const runtime = 'edge';
// Force reload after icon cleanup

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTranslations } from 'next-intl';
import {
    FolderLock,
    Upload,
    FileText,
    Download,
    Search,
    Filter,
    File,
    FileSpreadsheet,
    Users,
    HardDrive,
    ShieldCheck,
    Share2,
    Link as LinkIcon,
    Globe,
    Lock,
    Copy,
    Check,
    UserPlus,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';

export default function VaultPage() {
    const t = useTranslations('B2BSidebar');
    const tVault = useTranslations('B2BDashboard.vaultV2');
    const { toast } = useToast();

    // Simulated package data
    const storageUsed = 2.4; // GB
    const storageLimit = 10; // GB
    const usagePercent = (storageUsed / storageLimit) * 100;

    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [selectedDoc, setSelectedDoc] = useState<any>(null);
    const [isExternalEnabled, setIsExternalEnabled] = useState(false);
    const [isPasswordEnabled, setIsPasswordEnabled] = useState(false);
    const [password, setPassword] = useState('');
    const [isCopied, setIsCopied] = useState(false);

    const documents = [
        { id: 1, name: 'NDA - บริษัท ABC Corporation.pdf', type: 'pdf', size: '245 KB', date: '20 ก.พ. 2568', category: 'NDA', shared: true },
        { id: 2, name: 'เทมเพลตสัญญาจ้างงาน.docx', type: 'doc', size: '128 KB', date: '18 ก.พ. 2568', category: 'Employment', shared: false },
        { id: 3, name: 'SLA - ข้อตกลงระดับบริการ.pdf', type: 'pdf', size: '512 KB', date: '15 ก.พ. 2568', category: 'SLA', shared: true },
        { id: 4, name: 'มติบอร์ด - Q1 2568.pdf', type: 'pdf', size: '89 KB', date: '10 ก.พ. 2568', category: 'Corporate', shared: false },
        { id: 5, name: 'สัญญา Vendor - XYZ Ltd.pdf', type: 'pdf', size: '367 KB', date: '5 ก.พ. 2568', category: 'Vendor', shared: false },
    ];

    const teamMembers = [
        { name: 'Tawan BerkFah', role: 'Owner', avatar: 'TB' },
        { name: 'สมชาย กฎหมาย', role: 'Admin', avatar: 'SK' },
        { name: 'ณัฐยา สัญญา', role: 'Editor', avatar: 'NS' },
    ];

    const handleShare = (doc: any) => {
        setSelectedDoc(doc);
        setIsShareModalOpen(true);
        setIsExternalEnabled(doc.shared);
    };

    const copyLink = () => {
        const link = `https://lawslane.com/s/vault/${selectedDoc?.id || 'doc'}`;
        navigator.clipboard.writeText(link);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
        toast({
            title: tVault('toastCopyTitle'),
            description: tVault('toastCopyDesc'),
        });
    };

    const getFileIcon = (type: string) => {
        switch (type) {
            case 'pdf': return <FileText className="w-4 h-4 text-red-500" />;
            case 'doc': return <File className="w-4 h-4 text-blue-500" />;
            case 'xls': return <FileSpreadsheet className="w-4 h-4 text-emerald-500" />;
            default: return <FileText className="w-4 h-4 text-slate-400" />;
        }
    };

    return (
        <div className="p-6 md:p-8 space-y-8 max-w-[1400px] mx-auto animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight flex items-center gap-2">
                        {t('vault')}
                        <Badge variant="outline" className="text-[10px] uppercase font-bold bg-blue-50 text-blue-600 border-blue-100">SafeVault&trade;</Badge>
                    </h1>
                    <p className="text-muted-foreground mt-1">{tVault('subtitle')}</p>
                </div>
                <Button className="text-white rounded-2xl px-6 h-12 gap-2 shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all" style={{ background: 'linear-gradient(135deg, #002f4b, #005a8d)' }}>
                    <Upload className="w-5 h-5" /> {tVault('uploadBtn')}
                </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Total Docs Card */}
                <Card className="rounded-3xl border-none shadow-sm bg-card/50 backdrop-blur-sm group cursor-pointer overflow-hidden border border-white/10">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3.5 rounded-2xl bg-blue-500/10 text-blue-600 shadow-inner group-hover:scale-110 transition-transform">
                                <FolderLock className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-2xl font-black text-foreground">156</p>
                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{tVault('stats.totalDocs')}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Storage Usage Card */}
                <Card className="rounded-3xl border-none shadow-sm bg-card transition-all overflow-hidden border border-white/5 relative">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4 mb-5">
                            <div className="p-3.5 rounded-2xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/20">
                                <HardDrive className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-2xl font-black text-foreground">{storageUsed} GB</p>
                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{tVault('stats.storage', { limit: storageLimit })}</p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Progress value={usagePercent} className="h-2 bg-emerald-50 dark:bg-emerald-950/30" indicatorClassName="bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                            <div className="flex justify-between text-[11px] font-bold">
                                <span className="text-emerald-600 dark:text-emerald-400">{tVault('stats.used', { percent: usagePercent.toFixed(1) })}</span>
                                <span className="text-muted-foreground">{tVault('stats.left', { gb: (storageLimit - storageUsed).toFixed(1) })}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Team Access Card */}
                <Card className="rounded-3xl border-none shadow-sm bg-card/50 backdrop-blur-sm group cursor-pointer overflow-hidden border border-white/10">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3.5 rounded-2xl bg-violet-500/10 text-violet-600 shadow-inner group-hover:scale-110 transition-transform">
                                <Users className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-2xl font-black text-foreground">23</p>
                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{tVault('stats.shared')}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Search & Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input className="pl-12 rounded-2xl h-14 border-none bg-card shadow-sm text-sm focus-visible:ring-blue-500/20" placeholder={tVault('search')} />
                </div>
                <Button variant="outline" className="rounded-2xl gap-2 h-14 px-6 border-slate-200 bg-card hover:bg-slate-50 transition-colors">
                    <Filter className="w-4 h-4" />
                    <span className="font-bold text-sm">{tVault('filter')}</span>
                </Button>
            </div>

            {/* Document List */}
            <Card className="rounded-3xl shadow-sm border overflow-hidden bg-white/40 dark:bg-white/5 backdrop-blur-sm">
                <CardHeader className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-row items-center justify-between space-y-0">
                    <CardTitle className="text-foreground flex items-center gap-3 text-lg font-bold">
                        <FolderLock className="w-6 h-6 text-blue-600" />
                        {tVault('allDocs')}
                    </CardTitle>
                    <Badge variant="secondary" className="bg-slate-100 dark:bg-slate-800 font-bold px-3 py-1 rounded-lg">{tVault('filesCount', { count: 5 })}</Badge>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                        {documents.map((doc, i) => (
                            <div key={i} className="flex items-center justify-between p-5 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-all group">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 shadow-sm group-hover:scale-105 transition-transform">
                                        {getFileIcon(doc.type)}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-bold text-foreground">{doc.name}</p>
                                            {doc.shared && (
                                                <Badge variant="outline" className="text-[9px] h-4 py-0 uppercase bg-emerald-500/5 text-emerald-600 border-emerald-500/20">{tVault('sharedBadge')}</Badge>
                                            )}
                                        </div>
                                        <p className="text-xs text-muted-foreground">{doc.size} · {doc.date}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge variant="outline" className="text-xs font-bold text-slate-500 bg-slate-50 rounded-lg hidden sm:block">{doc.category}</Badge>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-9 w-9 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                        onClick={() => handleShare(doc)}
                                    >
                                        <Share2 className="w-4 h-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-slate-100 transition-colors">
                                        <Download className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Share Modal */}
            <Dialog open={isShareModalOpen} onOpenChange={setIsShareModalOpen}>
                <DialogContent className="sm:max-w-[500px] overflow-hidden p-0 rounded-3xl border-none shadow-2xl bg-white dark:bg-slate-950">
                    <DialogHeader className="p-6 pb-0">
                        <DialogTitle className="flex items-center gap-3 text-xl font-bold">
                            <div className="p-2 rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-500/20">
                                <Share2 className="w-5 h-5" />
                            </div>
                            {tVault('shareModal.title')}
                        </DialogTitle>
                        <DialogDescription className="text-xs mt-1">
                            {tVault('shareModal.desc')}
                            <br />
                            <span className="font-bold text-foreground mt-1 inline-block">{selectedDoc?.name}</span>
                        </DialogDescription>
                    </DialogHeader>

                    <Tabs defaultValue="team" className="w-full mt-4">
                        <TabsList className="grid w-full grid-cols-2 bg-slate-100 dark:bg-slate-900 p-1.5 rounded-none h-12">
                            <TabsTrigger value="team" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 h-9 font-bold text-xs">
                                <Users className="w-3.5 h-3.5 mr-2" /> {tVault('shareModal.tabTeam')}
                            </TabsTrigger>
                            <TabsTrigger value="external" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 h-9 font-bold text-xs">
                                <Globe className="w-3.5 h-3.5 mr-2" /> {tVault('shareModal.tabExternal')}
                            </TabsTrigger>
                        </TabsList>

                        <div className="p-6">
                            <TabsContent value="team" className="space-y-4 outline-none">
                                <div className="space-y-4">
                                    <div className="relative">
                                        <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <Input placeholder={tVault('shareModal.searchTeam')} className="pl-10 h-10 rounded-xl" />
                                    </div>
                                    <ScrollArea className="h-[200px] -mr-2 pr-4">
                                        <div className="space-y-3">
                                            {[
                                                { name: 'สมชาย กฎหมาย', role: 'Admin', avatar: 'SK', access: true },
                                                { name: 'ณัฐยา สัญญา', role: 'Editor', avatar: 'NS', access: true },
                                                { name: 'ประวิทย์ รีวิว', role: 'Viewer', avatar: 'PR', access: false },
                                            ].map((member, i) => (
                                                <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                                                            {member.avatar}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-foreground">{member.name}</p>
                                                            <p className="text-[10px] text-muted-foreground uppercase font-black tracking-tighter">{member.role}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        {member.access ? (
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-8 rounded-lg text-[10px] font-black uppercase text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                                                                onClick={() => {
                                                                    toast({
                                                                        title: tVault('shareModal.revokeTitle'),
                                                                        description: tVault('shareModal.revokeDesc', { name: member.name }),
                                                                    });
                                                                }}
                                                            >
                                                                {tVault('shareModal.revokeBtn')}
                                                            </Button>
                                                        ) : (
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-8 rounded-lg text-[10px] font-black uppercase text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                                                                onClick={() => {
                                                                    toast({
                                                                        title: tVault('shareModal.grantTitle'),
                                                                        description: tVault('shareModal.grantDesc', { name: member.name }),
                                                                    });
                                                                }}
                                                            >
                                                                {tVault('shareModal.grantBtn')}
                                                            </Button>
                                                        )}
                                                        <Badge variant="outline" className={`text-[9px] h-6 px-2 border-none ${member.access ? 'bg-emerald-500/10 text-emerald-600' : 'bg-slate-500/10 text-slate-400'}`}>
                                                            {member.access ? tVault('shareModal.fullAccess') : tVault('shareModal.noAccess')}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </ScrollArea>
                                </div>
                            </TabsContent>

                            <TabsContent value="external" className="space-y-6 outline-none">
                                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                                    <div className="space-y-0.5">
                                        <p className="text-sm font-bold flex items-center gap-2">
                                            <Globe className="w-3.5 h-3.5 text-blue-500" />
                                            {tVault('shareModal.enableExternal')}
                                        </p>
                                        <p className="text-[10px] text-muted-foreground">{tVault('shareModal.externalHint')}</p>
                                    </div>
                                    <Switch checked={isExternalEnabled} onCheckedChange={setIsExternalEnabled} />
                                </div>

                                {isExternalEnabled && (
                                    <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                        <div className="p-4 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 space-y-3">
                                            <div className="flex items-center justify-between">
                                                <Label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                                                    <LinkIcon className="w-3 h-3" /> {tVault('shareModal.sharingLink')}
                                                </Label>
                                                <Badge variant="secondary" className="text-[9px] bg-emerald-500/10 text-emerald-600 border-none">{tVault('shareModal.active')}</Badge>
                                            </div>
                                            <div className="flex gap-2">
                                                <Input
                                                    readOnly
                                                    value={`https://lawslane.com/s/vault/${selectedDoc?.id || '...'}`}
                                                    className="h-10 text-xs bg-slate-50 dark:bg-slate-900 font-mono border-none"
                                                />
                                                <Button
                                                    size="icon"
                                                    className="shrink-0 h-10 w-10 bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20"
                                                    onClick={copyLink}
                                                >
                                                    {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="space-y-3 pt-2">
                                            <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">{tVault('shareModal.securitySettings')}</p>
                                            <div className="flex items-center justify-between p-3 rounded-xl border hover:border-blue-500/30 transition-all cursor-pointer">
                                                <div className="flex items-center gap-3">
                                                    <Lock className="w-4 h-4 text-slate-400" />
                                                    <span className="text-xs font-bold text-foreground">{tVault('shareModal.passwordProtection')}</span>
                                                </div>
                                                <Switch checked={isPasswordEnabled} onCheckedChange={setIsPasswordEnabled} />
                                            </div>

                                            {isPasswordEnabled && (
                                                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200 space-y-3">
                                                    <Label className="text-[10px] font-bold text-muted-foreground uppercase">{tVault('shareModal.setPassword')}</Label>
                                                    <div className="flex gap-2">
                                                        <Input
                                                            type="text"
                                                            placeholder={tVault('shareModal.enterPassword')}
                                                            value={password}
                                                            onChange={(e) => setPassword(e.target.value)}
                                                            className="h-9 text-xs bg-white dark:bg-slate-950 border-slate-200"
                                                        />
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="h-9 px-3 text-[10px] font-bold border-slate-200"
                                                            onClick={() => {
                                                                const gen = Math.random().toString(36).slice(-8).toUpperCase();
                                                                setPassword(gen);
                                                            }}
                                                        >
                                                            {tVault('shareModal.generate')}
                                                        </Button>
                                                    </div>
                                                    <p className="text-[9px] text-muted-foreground italic">{tVault('shareModal.passwordHint')}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </TabsContent>
                        </div>
                    </Tabs>

                    <DialogFooter className="p-6 pt-0 bg-slate-50/50 dark:bg-white/5 border-t border-slate-100 dark:border-slate-800">
                        <Button className="w-full h-11 rounded-xl bg-slate-900 border-none hover:bg-slate-800 text-xs font-bold transition-all" onClick={() => setIsShareModalOpen(false)}>
                            {tVault('shareModal.doneBtn')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
