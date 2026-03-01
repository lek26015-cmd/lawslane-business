'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Bell, Mail, Smartphone, Save, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export default function NotificationsPage() {
    const { toast } = useToast();
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            toast({ title: 'บันทึกการตั้งค่าแล้ว' });
        }, 1000);
    };

    return (
        <div className="p-6 md:p-8 space-y-6 max-w-[800px] mx-auto animate-in fade-in duration-500 text-slate-900">
            <div className="flex items-center gap-4">
                <Link href="/settings">
                    <Button variant="ghost" size="icon" className="rounded-xl shadow-none">
                        <ChevronLeft className="w-5 h-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold">การแจ้งเตือน</h1>
                    <p className="text-slate-500 text-sm font-medium">ตั้งค่าช่องทางและรูปแบบการรับข้อมูลข่าวสาร</p>
                </div>
            </div>

            <Card className="rounded-3xl border shadow-xl shadow-blue-900/5 overflow-hidden bg-white">
                <CardHeader className="p-8 border-b border-slate-50">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-[#002f4b] text-white shadow-lg">
                            <Bell className="w-6 h-6" />
                        </div>
                        <div>
                            <CardTitle className="text-xl font-bold">ช่องทางการรับข่าวสาร</CardTitle>
                            <CardDescription>เลือกวิธีที่คุณต้องการรับการแจ้งเตือนจากระบบ</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-8 space-y-8 bg-white">
                    <div className="space-y-6">
                        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                            <div className="flex gap-4">
                                <div className="p-2.5 rounded-xl bg-white shadow-sm border border-slate-100">
                                    <Mail className="w-5 h-5 text-blue-600" />
                                </div>
                                <div className="space-y-0.5">
                                    <Label className="text-sm font-bold text-slate-800">อีเมล (Email Notification)</Label>
                                    <p className="text-xs text-slate-500 font-medium italic">รับสรุปรายวันและข่าวสารสำคัญทางอีเมล</p>
                                </div>
                            </div>
                            <Switch defaultChecked className="data-[state=checked]:bg-[#002f4b]" />
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                            <div className="flex gap-4">
                                <div className="p-2.5 rounded-xl bg-white shadow-sm border border-slate-100">
                                    <Smartphone className="w-5 h-5 text-indigo-500" />
                                </div>
                                <div className="space-y-0.5">
                                    <Label className="text-sm font-bold text-slate-800">แอปพลิเคชัน (Push Notification)</Label>
                                    <p className="text-xs text-slate-500 font-medium italic">รับการแจ้งเตือนทันทีบนเบราว์เซอร์และมือถือ</p>
                                </div>
                            </div>
                            <Switch defaultChecked className="data-[state=checked]:bg-[#002f4b]" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">ประเภทการแจ้งเตือน</p>
                        <div className="space-y-4 px-2">
                            {[
                                { label: 'สถานะสัญญา', desc: 'เมื่อมีการเซ็นสัญญาหรือแก้ไขเอกสาร' },
                                { label: 'การเงินและบิล', desc: 'เมื่อใบแจ้งหนี้ถูกชำระหรือใกล้กำหนด' },
                                { label: 'ความปลอดภัย', desc: 'เมื่อมีการเข้าสู่ระบบจากอุปกรณ์ใหม่' }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <p className="text-sm font-bold text-slate-700">{item.label}</p>
                                        <p className="text-xs text-slate-400 font-medium">{item.desc}</p>
                                    </div>
                                    <Switch defaultChecked className="data-[state=checked]:bg-[#002f4b]" />
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
                <div className="p-8 border-t border-slate-50 flex justify-end">
                    <Button
                        onClick={handleSave}
                        className="rounded-2xl bg-[#002f4b] hover:bg-[#003f66] text-white px-8 h-12 font-bold shadow-lg shadow-blue-900/10"
                    >
                        {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                        บันทึกการตั้งค่า
                    </Button>
                </div>
            </Card>
        </div>
    );
}
