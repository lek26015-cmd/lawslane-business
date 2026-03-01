'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useTranslations } from 'next-intl';
import {
    ClipboardList,
    Filter,
    Download,
    Search,
    FileEdit,
    Eye,
    CheckCircle2,
    Send,
    Trash2,
    ShieldCheck,
    Lock,
} from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function AuditTrailPage() {
    const t = useTranslations('B2BSidebar');

    const auditLogs = [
        { action: 'ลงนามสัญญา', doc: 'NDA - บริษัท ABC', user: 'Tawan B.', avatar: 'T', time: '14:32', date: '28 ก.พ. 2568', type: 'sign', ip: '103.86.xx.xx' },
        { action: 'แก้ไขเอกสาร', doc: 'สัญญาจ้างงาน v3.2', user: 'สมชาย ก.', avatar: 'ส', time: '11:15', date: '28 ก.พ. 2568', type: 'edit', ip: '103.86.xx.xx' },
        { action: 'อัปโหลดเอกสาร', doc: 'รายงาน Due Diligence', user: 'ณัฐยา ส.', avatar: 'ณ', time: '09:48', date: '28 ก.พ. 2568', type: 'upload', ip: '119.46.xx.xx' },
        { action: 'อนุมัติสัญญา', doc: 'SLA - Vendor Agreement', user: 'Tawan B.', avatar: 'T', time: '16:22', date: '27 ก.พ. 2568', type: 'approve', ip: '103.86.xx.xx' },
        { action: 'ดูเอกสาร', doc: 'มติบอร์ด Q1/2568', user: 'ประวิทย์ ร.', avatar: 'ป', time: '14:05', date: '27 ก.พ. 2568', type: 'view', ip: '202.29.xx.xx' },
        { action: 'ส่ง e-Signature', doc: 'NDA - XYZ Partners', user: 'สมชาย ก.', avatar: 'ส', time: '10:33', date: '27 ก.พ. 2568', type: 'send', ip: '103.86.xx.xx' },
        { action: 'ลบเอกสาร (ร่าง)', doc: 'Draft - License Agreement', user: 'Tawan B.', avatar: 'T', time: '09:12', date: '26 ก.พ. 2568', type: 'delete', ip: '103.86.xx.xx' },
    ];

    const getActionIcon = (type: string) => {
        const map: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
            sign: { icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
            edit: { icon: FileEdit, color: 'text-blue-500', bg: 'bg-slate-100 dark:bg-slate-500/10' },
            upload: { icon: Send, color: 'text-violet-500', bg: 'bg-violet-50 dark:bg-violet-500/10' },
            approve: { icon: ShieldCheck, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
            view: { icon: Eye, color: 'text-slate-400', bg: 'bg-slate-50 dark:bg-slate-500/10' },
            send: { icon: Send, color: 'text-blue-500', bg: 'bg-slate-100 dark:bg-slate-500/10' },
            delete: { icon: Trash2, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-500/10' },
        };
        return map[type] || map['view'];
    };

    return (
        <div className="p-6 md:p-8 space-y-8 max-w-[1400px] mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground">{t('auditTrail')}</h1>
                    <p className="text-muted-foreground mt-1">บันทึกทุกการเคลื่อนไหว — ใครแก้เอกสาร ใครกดอนุมัติ ตรวจสอบย้อนหลังได้ 100%</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="rounded-xl gap-2">
                        <Filter className="w-4 h-4" /> กรอง
                    </Button>
                    <Button variant="outline" className="rounded-xl gap-2">
                        <Download className="w-4 h-4" /> ส่งออกรายงาน
                    </Button>
                </div>
            </div>

            {/* Compliance Banner */}
            <Card className="rounded-2xl border-0 overflow-hidden">
                <CardContent className="p-0">
                    <div className="p-5 flex items-center justify-between" style={{ background: 'linear-gradient(135deg, #002f4b, #00466c)' }}>
                        <div className="flex items-center gap-4">
                            <div className="p-2.5 rounded-xl bg-white/20 backdrop-blur-sm">
                                <ShieldCheck className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <p className="text-base font-bold text-white">Compliance Score: 98/100</p>
                                <p className="text-sm text-emerald-100">PDPA · ISO 27001 · SOC 2 Type II</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                                <Lock className="w-3 h-3 mr-1" /> Encrypted
                            </Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input className="pl-10 rounded-xl h-11 border" placeholder="ค้นหาบันทึก... (ชื่อเอกสาร, ผู้ใช้, กิจกรรม)" />
            </div>

            {/* Audit Log */}
            <Card className="rounded-2xl shadow-sm border">
                <CardHeader>
                    <CardTitle className="text-foreground flex items-center gap-2 text-lg">
                        <ClipboardList className="w-5 h-5" style={{ color: '#002f4b' }} />
                        บันทึกกิจกรรมล่าสุด
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="relative">
                        {/* Timeline Line */}
                        <div className="absolute left-[27px] top-0 bottom-0 w-px bg-border" />

                        <div className="space-y-1">
                            {auditLogs.map((log, i) => {
                                const { icon: ActionIcon, color, bg } = getActionIcon(log.type);
                                return (
                                    <div key={i} className="flex items-start gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors relative group">
                                        <div className={`p-1.5 rounded-lg ${bg} relative z-10 shrink-0`}>
                                            <ActionIcon className={`w-4 h-4 ${color}`} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-foreground">
                                                <span className="font-semibold">{log.user}</span>
                                                {' '}{log.action}{' '}
                                                <span className="font-medium text-[#002f4b] dark:text-blue-400">{log.doc}</span>
                                            </p>
                                            <p className="text-[11px] text-muted-foreground mt-0.5">
                                                {log.date} · {log.time} · IP: {log.ip}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
