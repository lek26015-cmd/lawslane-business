'use client';
export const runtime = 'edge';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useUser, useFirebase } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Package, Check, ArrowRight, Loader2, ChevronLeft, CreditCard, CalendarDays } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export default function BillingPage() {
    const { user } = useUser();
    const { firestore } = useFirebase();
    const [companyData, setCompanyData] = useState<any>(null);

    useEffect(() => {
        if (!user || !firestore) return;

        const fetchBillingData = async () => {
            try {
                const userDoc = await getDoc(doc(firestore, 'users', user.uid));
                if (userDoc.exists()) {
                    setCompanyData(userDoc.data());
                }
            } catch (error) {
                console.error("Error fetching billing data:", error);
            }
        };

        fetchBillingData();
    }, [user, firestore]);

    const planName = companyData?.plan || 'Starter Plan';
    const isPro = planName.toLowerCase().includes('pro');

    return (
        <div className="p-6 md:p-8 space-y-6 max-w-[1000px] mx-auto animate-in fade-in duration-500 text-slate-900">
            <div className="flex items-center gap-4">
                <Link href="/settings">
                    <Button variant="ghost" size="icon" className="rounded-xl shadow-none">
                        <ChevronLeft className="w-5 h-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold">จัดการแพ็คเกจ</h1>
                    <p className="text-slate-500 text-sm font-medium">ดูรายละเอียดแผนการใช้งาน และการเรียกเก็บเงิน</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Current Plan Card */}
                <Card className="md:col-span-2 rounded-3xl border shadow-xl shadow-blue-900/5 overflow-hidden bg-white">
                    <CardHeader className="p-8 border-b border-slate-100 bg-[#002f4b] text-white">
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <p className="text-blue-200 text-[10px] font-bold uppercase tracking-widest">แผนปัจจุปันของคุณ</p>
                                <CardTitle className="text-2xl font-bold flex items-center gap-2">
                                    {planName}
                                    <Badge className="bg-emerald-500 text-white border-none text-[10px] font-bold px-2 py-0.5 rounded-md">ACTIVE</Badge>
                                </CardTitle>
                            </div>
                            <Package className="w-8 h-8 text-blue-300/50" />
                        </div>
                    </CardHeader>
                    <CardContent className="p-8 space-y-8 bg-white">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">รายละเอียดการใช้งาน</p>
                                <div className="space-y-5">
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs font-bold">
                                            <span className="text-slate-600">สัญญา (Contracts)</span>
                                            <span className="text-blue-600">8 / 10 ชุด</span>
                                        </div>
                                        <Progress value={80} className="h-2 bg-slate-100 [&>div]:bg-blue-600" />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs font-bold">
                                            <span className="text-slate-600">พื้นที่เก็บข้อมูล (Storage)</span>
                                            <span className="text-blue-600">1.2 / 5 GB</span>
                                        </div>
                                        <Progress value={24} className="h-2 bg-slate-100 [&>div]:bg-indigo-500" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">ฟีเจอร์หลักในแผนนี้</p>
                                <ul className="space-y-3">
                                    {['Contract Builder', 'Templates Access', 'Standard E-Signature', 'Email Notifications'].map((f, i) => (
                                        <li key={i} className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                                            <div className="w-4 h-4 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                                                <Check className="w-2.5 h-2.5" />
                                            </div>
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {!isPro && (
                            <div className="p-6 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-between gap-4 group cursor-pointer hover:bg-blue-100/50 transition-colors">
                                <div className="space-y-1">
                                    <h4 className="text-sm font-bold text-blue-900 flex items-center gap-2">
                                        อัปเกรดเป็น Pro Plan
                                        <Badge className="bg-amber-400 text-amber-900 border-none text-[9px] font-black">RECOMMENDED</Badge>
                                    </h4>
                                    <p className="text-xs text-blue-700 font-medium">ปลดล็อกการสร้างสัญญาไม่จำกัด และฟีเจอร์ AI Legal Advisor</p>
                                </div>
                                <Button size="sm" className="rounded-xl bg-[#002f4b] hover:bg-[#003f66] text-white h-9 shadow-lg shadow-blue-900/10">
                                    อัปเกรดเลย <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Billing Summary Side Card */}
                <Card className="rounded-3xl border shadow-xl shadow-blue-900/5 overflow-hidden bg-white border-slate-100">
                    <CardHeader className="p-6 border-b border-slate-50">
                        <CardTitle className="text-lg font-bold">ข้อมูลการชำระเงิน</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6 bg-white">
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="p-2 rounded-lg bg-slate-50 text-slate-400">
                                    <CalendarDays className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">รอบบิลถัดไป</p>
                                    <p className="text-sm font-bold text-slate-800">15 มีนาคม 2026</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="p-2 rounded-lg bg-slate-50 text-slate-400">
                                    <CreditCard className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">บัตรที่ผูกไว้</p>
                                    <p className="text-sm font-bold text-slate-800">Visa •••• 4242</p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-slate-50">
                            <Link href="/settings/payment">
                                <Button variant="outline" className="w-full rounded-2xl border-slate-200 text-slate-600 font-bold hover:bg-slate-50 h-11 text-xs">
                                    จัดการวิธีการชำระเงิน
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
