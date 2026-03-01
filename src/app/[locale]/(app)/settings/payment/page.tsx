'use client';
export const runtime = 'edge';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, CreditCard, ChevronLeft, MoreVertical, ShieldCheck, Trash2, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

export default function PaymentMethodsPage() {
    const [isAdding, setIsAdding] = useState(false);

    const cards = [
        { id: 1, type: 'Visa', last4: '4242', exp: '12/26', isDefault: true, brand: 'indigo' },
        { id: 2, type: 'Mastercard', last4: '8888', exp: '08/25', isDefault: false, brand: 'rose' }
    ];

    return (
        <div className="p-6 md:p-8 space-y-6 max-w-[800px] mx-auto animate-in fade-in duration-500 text-slate-900">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/settings">
                        <Button variant="ghost" size="icon" className="rounded-xl shadow-none">
                            <ChevronLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold">จัดการบัตรเครดิต</h1>
                        <p className="text-slate-500 text-sm font-medium">จัดการวิธีการชำระเงินและบัตรหลักของคุณ</p>
                    </div>
                </div>
                <Button
                    onClick={() => setIsAdding(true)}
                    className="rounded-2xl bg-[#002f4b] hover:bg-[#003f66] text-white px-6 h-11 font-bold shadow-lg shadow-blue-900/10"
                >
                    <Plus className="w-4 h-4 mr-2" /> เพิ่มบัตรใหม่
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {cards.map((card) => (
                    <Card key={card.id} className="rounded-3xl border shadow-xl shadow-blue-900/5 overflow-hidden bg-white border-slate-100 group hover:border-[#002f4b]/30 transition-all">
                        <CardContent className="p-6 flex items-center justify-between">
                            <div className="flex items-center gap-6">
                                <div className={`w-14 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-lg`}>
                                    <CreditCard className="w-6 h-6" />
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <p className="font-bold text-slate-800">{card.type} •••• {card.last4}</p>
                                        {card.isDefault && (
                                            <Badge className="bg-blue-50 text-blue-600 border-blue-100 text-[9px] font-black rounded-lg">PRIMARY</Badge>
                                        )}
                                    </div>
                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">หมดอายุ {card.exp}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon" className="rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50">
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="rounded-xl text-slate-400">
                                    <MoreVertical className="w-4 h-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className="rounded-3xl border border-dashed border-slate-200 bg-slate-50/50 p-8">
                <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center border border-slate-100">
                        <ShieldCheck className="w-6 h-6 text-emerald-500" />
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-800">การชำระเงินที่ปลอดภัย</h4>
                        <p className="text-xs text-slate-500 font-medium max-w-[400px] mt-1 leading-relaxed">ข้อมูลบัตรเครดิตของคุณถูกจัดการโดยระบบมาตรฐานสากล PCI-DSS เราไม่ได้เก็บข้อมูลบัตรจริงไว้ในฐานข้อมูลของเราเพื่อความปลอดภัยสูงสุด</p>
                    </div>
                </div>
            </Card>

            {isAdding && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-50 flex items-center justify-center p-4">
                    <Card className="w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden border-none animate-in zoom-in-95 duration-200">
                        <CardHeader className="p-8 border-b border-slate-50 bg-[#002f4b] text-white">
                            <CardTitle className="text-xl font-bold">เพิ่มบัตรเครดิตใหม่</CardTitle>
                            <CardDescription className="text-blue-200">กรอกข้อมูลบัตรของคุณเพื่อเริ่มต้นใช้งานเสถียร</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8 space-y-6 bg-white">
                            <div className="p-12 text-center space-y-4">
                                <div className="w-16 h-16 rounded-3xl bg-slate-50 flex items-center justify-center mx-auto">
                                    <Loader2 className="w-8 h-8 animate-spin text-slate-200" />
                                </div>
                                <p className="text-slate-400 font-bold text-sm tracking-tight italic">ระบบกําลังเชื่อมต่อกับตัวกลางชำระเงิน...</p>
                                <Button
                                    onClick={() => setIsAdding(false)}
                                    variant="ghost"
                                    className="text-slate-400 font-bold hover:bg-transparent"
                                >
                                    ยกเลิก
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
