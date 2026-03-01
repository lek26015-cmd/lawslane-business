'use client';
export const runtime = 'edge';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useTranslations } from 'next-intl';
import {
    Users,
    Plus,
    MoreHorizontal,
    Search,
    Filter,
    ShieldCheck,
    History,
    UserPlus,
    UserCheck,
    Mail,
    Lock,
    ArrowUpRight,
    Activity,
    CheckCircle2,
    Calendar
} from 'lucide-react';
import Link from 'next/link';

export default function TeamPage() {
    const t = useTranslations('B2BSidebar');
    const tTeam = useTranslations('B2BDashboard.teamV2');
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('members');

    const members = [
        { name: 'Tawan BerkFah', email: 'lek.2601@gmail.com', role: 'Owner', status: 'active', lastActive: '2 mins ago', initials: 'TB' },
        { name: 'สมชาย กฎหมาย', email: 'somchai@company.com', role: 'Admin', status: 'active', lastActive: '1 hour ago', initials: 'SK' },
        { name: 'ณัฐยา สัญญา', email: 'nattaya@company.com', role: 'Editor', status: 'active', lastActive: '3 hours ago', initials: 'NS' },
        { name: 'ประวิทย์ รีวิว', email: 'prawit@company.com', role: 'Viewer', status: 'invited', lastActive: 'Pending', initials: 'PR' },
    ];

    const activities = [
        { user: 'Tawan BerkFah', action: 'invited ประวิทย์ รีวิว', time: '2 hours ago', icon: UserPlus },
        { user: 'สมชาย กฎหมาย', action: 'updated storage permissions', time: '5 hours ago', icon: Lock },
        { user: 'ณัฐยา สัญญา', action: 'logged in from new device', time: 'Yesterday', icon: Activity },
        { user: 'System', action: 'Security scan completed', time: 'Yesterday', icon: ShieldCheck },
    ];

    const rolesInfo = [
        { role: 'Owner', displayRole: tTeam('roles.owner'), desc: tTeam('roles.ownerDesc'), color: 'amber' },
        { role: 'Admin', displayRole: tTeam('roles.admin'), desc: tTeam('roles.adminDesc'), color: 'blue' },
        { role: 'Editor', displayRole: tTeam('roles.editor'), desc: tTeam('roles.editorDesc'), color: 'emerald' },
        { role: 'Viewer', displayRole: tTeam('roles.viewer'), desc: tTeam('roles.viewerDesc'), color: 'slate' },
    ];

    const filteredMembers = members.filter(m =>
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getRoleBadge = (role: string) => {
        const translatedRole = role === 'Owner' ? tTeam('roles.owner') :
            role === 'Admin' ? tTeam('roles.admin') :
                role === 'Editor' ? tTeam('roles.editor') :
                    role === 'Viewer' ? tTeam('roles.viewer') : role;
        switch (role) {
            case 'Owner': return <Badge className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20">{translatedRole}</Badge>;
            case 'Admin': return <Badge className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20">{translatedRole}</Badge>;
            case 'Editor': return <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20">{translatedRole}</Badge>;
            default: return <Badge className="bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-500/20">{translatedRole}</Badge>;
        }
    };

    return (
        <div className="p-6 md:p-8 space-y-8 max-w-[1400px] mx-auto animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold text-foreground tracking-tight flex items-center gap-3">
                        {t('team')}
                        <Badge variant="outline" className="text-[10px] uppercase tracking-widest bg-blue-500/5 text-blue-500 border-blue-500/20 font-bold">{tTeam('enterprise')}</Badge>
                    </h1>
                    <p className="text-muted-foreground">{tTeam('subtitle')}</p>
                </div>
                <Link href="/team/invite">
                    <Button
                        className="text-white rounded-2xl px-6 py-6 h-auto gap-3 shadow-xl transition-transform hover:scale-[1.02] active:scale-[0.98]"
                        style={{ background: 'linear-gradient(135deg, #002f4b, #005a8d)' }}
                    >
                        <Plus className="w-5 h-5" />
                        <span className="font-bold">{tTeam('addMemberBtn')}</span>
                    </Button>
                </Link>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: tTeam('stats.totalMembers'), value: members.length, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                    { label: tTeam('stats.activeNow'), value: '3', icon: UserCheck, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                    { label: tTeam('stats.pendingInvites'), value: '1', icon: Mail, color: 'text-amber-500', bg: 'bg-amber-500/10' },
                    { label: tTeam('stats.twoFaCoverage'), value: '100%', icon: ShieldCheck, color: 'text-violet-500', bg: 'bg-violet-500/10' },
                ].map((stat, i) => (
                    <Card key={i} className="rounded-2xl border-none shadow-sm bg-card/50 backdrop-blur-sm overflow-hidden group">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</p>
                                    <h3 className="text-2xl font-black mt-2 text-foreground">{stat.value}</h3>
                                </div>
                                <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} transition-transform group-hover:scale-110`}>
                                    <stat.icon className="w-6 h-6" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content Area */}
                <div className="lg:col-span-2 space-y-6">
                    <Tabs defaultValue="members" className="w-full" onValueChange={setActiveTab}>
                        <div className="flex items-center justify-between mb-4">
                            <TabsList className="bg-muted/50 p-1 rounded-xl h-11">
                                <TabsTrigger value="members" className="rounded-lg px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all font-bold text-xs uppercase tracking-wider">
                                    {tTeam('tabs.memberDir')}
                                </TabsTrigger>
                                <TabsTrigger value="roles" className="rounded-lg px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all font-bold text-xs uppercase tracking-wider">
                                    {tTeam('tabs.roleMatrix')}
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        <TabsContent value="members" className="space-y-4 outline-none">
                            <Card className="rounded-3xl border shadow-sm border-slate-200 dark:border-slate-800 overflow-hidden bg-card/30">
                                <CardHeader className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-row items-center justify-between space-y-0 bg-white/40 dark:bg-white/5">
                                    <div className="relative w-full max-w-sm">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <Input
                                            placeholder={tTeam('search')}
                                            className="pl-10 h-10 bg-white/50 dark:bg-slate-900/50 border-none rounded-xl text-sm focus-visible:ring-blue-500/20"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                    </div>
                                    <Button variant="outline" size="sm" className="rounded-xl h-10 border-slate-200 gap-2 text-xs font-bold px-4">
                                        <Filter className="w-3.5 h-3.5" />
                                        {tTeam('filter')}
                                    </Button>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {filteredMembers.map((member, i) => (
                                            <div key={i} className="flex items-center justify-between p-5 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-all group">
                                                <div className="flex items-center gap-4">
                                                    <Avatar className="w-12 h-12 ring-2 ring-white dark:ring-slate-900 shadow-sm">
                                                        <AvatarFallback
                                                            className="text-white text-base font-black"
                                                            style={{ background: 'linear-gradient(135deg, #002f4b, #005a8d)' }}
                                                        >
                                                            {member.initials}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <p className="text-sm font-bold text-foreground">{member.name}</p>
                                                            {member.status === 'invited' ? (
                                                                <Badge variant="outline" className="text-[9px] py-0 h-4 uppercase tracking-tighter bg-amber-500/5 text-amber-500 border-amber-500/20">{tTeam('status.invited')}</Badge>
                                                            ) : (
                                                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Online" />
                                                            )}
                                                        </div>
                                                        <p className="text-xs text-muted-foreground">{member.email}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-6">
                                                    <div className="text-right hidden sm:block">
                                                        <p className="text-[10px] uppercase font-black text-muted-foreground/50 tracking-widest">{tTeam('status.lastActivity')}</p>
                                                        <p className="text-xs font-medium text-foreground">{member.lastActive}</p>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        {getRoleBadge(member.role)}
                                                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <MoreHorizontal className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {filteredMembers.length === 0 && (
                                        <div className="p-12 text-center space-y-3">
                                            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground/30">
                                                <Search className="w-6 h-6" />
                                            </div>
                                            <p className="text-sm text-muted-foreground font-medium">{tTeam('noMembers', { query: searchQuery })}</p>
                                        </div>
                                    )}
                                </CardContent>
                                <div className="p-4 bg-slate-50/50 dark:bg-white/5 border-t border-slate-100 dark:border-slate-800 text-center">
                                    <p className="text-[10px] text-muted-foreground flex items-center justify-center gap-2">
                                        <ShieldCheck className="w-3 h-3 text-emerald-500" />
                                        {tTeam('encryptionSecure')}
                                    </p>
                                </div>
                            </Card>
                        </TabsContent>

                        <TabsContent value="roles" className="outline-none">
                            <Card className="rounded-3xl border shadow-sm overflow-hidden bg-card/30 p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {rolesInfo.map((roleInfo, i) => (
                                        <div key={i} className="p-5 rounded-2xl border bg-white dark:bg-slate-900/50 hover:border-blue-500/30 transition-all group">
                                            <div className="flex items-center justify-between mb-3">
                                                <h4 className="font-black text-sm uppercase tracking-wider">{roleInfo.displayRole}</h4>
                                                <ArrowUpRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-blue-500 transition-colors" />
                                            </div>
                                            <p className="text-xs text-muted-foreground leading-relaxed">{roleInfo.desc}</p>
                                            <div className="mt-4 pt-4 border-t flex flex-wrap gap-2">
                                                {roleInfo.role === 'Owner' && <Badge variant="secondary" className="text-[9px] bg-amber-500/5 text-amber-600 border-none">{tTeam('roleTags.billing')}</Badge>}
                                                {(roleInfo.role === 'Owner' || roleInfo.role === 'Admin') && <Badge variant="secondary" className="text-[9px] bg-blue-500/5 text-blue-600 border-none">{tTeam('roleTags.teamMgmt')}</Badge>}
                                                {roleInfo.role !== 'Viewer' && <Badge variant="secondary" className="text-[9px] bg-emerald-500/5 text-emerald-600 border-none">{tTeam('roleTags.editing')}</Badge>}
                                                <Badge variant="secondary" className="text-[9px] bg-slate-500/5 text-slate-600 border-none">{tTeam('roleTags.reporting')}</Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Sidebar Column */}
                <div className="space-y-6">
                    {/* Activity Log */}
                    <Card className="rounded-3xl border shadow-sm overflow-hidden bg-white/40 dark:bg-white/5 backdrop-blur-md border-slate-200 dark:border-slate-800">
                        <CardHeader className="p-6 pb-0">
                            <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                                <History className="w-4 h-4 text-blue-500" />
                                {tTeam('activity.title')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <ScrollArea className="h-[400px] pr-4">
                                <div className="space-y-6">
                                    {activities.map((activity, i) => (
                                        <div key={i} className="flex gap-4 relative">
                                            {i !== activities.length - 1 && (
                                                <div className="absolute left-[18px] top-10 w-[2px] h-6 bg-slate-100 dark:bg-slate-800" />
                                            )}
                                            <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                                                <activity.icon className="w-4 h-4 text-blue-500" />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[13px] text-foreground font-medium leading-tight">
                                                    <span className="font-black">{activity.user}</span> {activity.action}
                                                </p>
                                                <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {activity.time}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                            <Button variant="ghost" className="w-full mt-6 text-xs font-bold text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl py-5">
                                {tTeam('activity.viewFullLog')}
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Pro Tip Card */}
                    <div className="p-6 rounded-3xl bg-gradient-to-br from-[#002f4b] to-[#005a8d] text-white shadow-2xl space-y-4 relative overflow-hidden group">
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                        <CheckCircle2 className="w-8 h-8 text-blue-300" />
                        <h4 className="font-black text-sm tracking-wide">{tTeam('proTip.title')}</h4>
                        <p className="text-xs text-blue-100/70 leading-relaxed">
                            {tTeam.rich('proTip.desc', {
                                b: (chunks) => <strong>{chunks}</strong>
                            })}
                        </p>
                        <Button variant="outline" className="w-full bg-white/10 border-white/20 text-white rounded-xl hover:bg-white/20 transition-colors text-xs font-bold h-10">
                            {tTeam('proTip.configureMfa')}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
