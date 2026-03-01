'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Settings, Building, Bell, Shield, Globe, Palette, ChevronRight, CreditCard, Package } from 'lucide-react';

export default function SettingsPage() {
    const t = useTranslations('B2BSidebar');

    const groups = [
        {
            title: 'องค์กรและแผนการใช้งาน',
            items: [
                { icon: Building, label: 'ข้อมูลบริษัท', desc: 'อัปเดตชื่อบริษัท ที่อยู่ และเลขประจำตัวผู้เสียภาษี', bg: '#002f4b', href: '/settings/profile' },
                { icon: Package, label: 'จัดการแพ็คเกจ', desc: 'ดูรายละเอียดแพ็คเกจการใช้งาน และอัปเกรด', bg: '#002f4b', href: '/settings/billing' },
                { icon: CreditCard, label: 'จัดการบัตรเครดิต', desc: 'วิธีการชำระเงิน และประวัติการเงิน', bg: '#002f4b', href: '/settings/payment' },
            ]
        },
        {
            title: 'ระบบและการแสดงผล',
            items: [
                { icon: Bell, label: 'การแจ้งเตือน', desc: 'ตั้งค่าการแจ้งเตือนทางอีเมลและในแอป', bg: '#002f4b', href: '/settings/notifications' },
                { icon: Globe, label: 'ภาษาและภูมิภาค', desc: 'ตั้งค่าภาษาและเขตเวลาที่ต้องการ', bg: '#002f4b', href: '/settings/language' },
                { icon: Palette, label: 'ธีมและการแสดงผล', desc: 'ปรับแต่งธีมและรูปแบบการแสดงผล', bg: '#002f4b', href: '/settings/appearance' },
            ]
        },
        {
            title: 'ความปลอดภัยและบัญชี',
            items: [
                { icon: Shield, label: 'ความปลอดภัย', desc: 'ยืนยันตัวตนสองชั้นและการจัดการเซสชัน', bg: '#002f4b', href: '/settings/security' },
                { icon: Settings, label: 'การตั้งค่าขั้นสูง', desc: 'จัดการสิทธิ์การเข้าถึงและ API', bg: '#002f4b', href: '/settings/advanced' },
            ]
        }
    ];

    return (
        <div className="p-6 md:p-8 space-y-8 max-w-[1200px] mx-auto">
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-extrabold tracking-tight text-foreground">{t('settings')}</h1>
                <p className="text-muted-foreground">บริหารจัดการพื้นที่ทำงาน ข้อมูลบริษัท และความปลอดภัย</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {groups.map((group, idx) => (
                    <div key={idx} className="space-y-4">
                        <div className="flex items-center gap-2 px-1">
                            <h2 className="text-[11px] font-extrabold text-foreground uppercase tracking-[0.2em]">{group.title}</h2>
                            <div className="h-[1px] flex-1 bg-border" />
                        </div>

                        <div className="space-y-3">
                            {group.items.map((item, i) => {
                                const Icon = item.icon;
                                return (
                                    <Link key={i} href={item.href}>
                                        <Card className="rounded-2xl border bg-card/50 backdrop-blur-sm shadow-sm hover:shadow-md hover:border-primary/30 transition-all cursor-pointer group overflow-hidden">
                                            <CardContent className="p-4 flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="p-2.5 rounded-xl shadow-md text-white transition-transform group-hover:scale-110" style={{ background: item.bg }}>
                                                        <Icon className="w-5 h-5 shadow-sm" />
                                                    </div>
                                                    <div className="space-y-0.5">
                                                        <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{item.label}</p>
                                                        <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium line-clamp-1">{item.desc}</p>
                                                    </div>
                                                </div>
                                                <div className="p-1.5 rounded-full bg-muted group-hover:bg-primary/10 transition-colors">
                                                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
