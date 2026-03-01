'use client';
export const runtime = 'edge';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Shield, Lock, Fingerprint, Eye, Key, Save, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';

export default function SecurityPage() {
    const { toast } = useToast();
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            toast({ title: 'บันทึกการตั้งค่าความปลอดภัยแล้ว' });
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
                    <h1 className="text-2xl font-bold">ความปลอดภัย</h1>
                    <p className="text-slate-500 text-sm font-medium">ปกป้องบัญชีและข้อมูลบริษัทของคุณ</p>
                </div>
            </div>

            <Card className="rounded-3xl border shadow-xl shadow-blue-900/5 overflow-hidden bg-white">
                <CardHeader className="p-8 border-b border-slate-50">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-[#002f4b] text-white shadow-lg">
                            <Shield className="w-6 h-6" />
                        </div>
                        <div>
                            <CardTitle className="text-xl font-bold">การยืนยันตัวตน</CardTitle>
                            <CardDescription>เพิ่มความปลอดภัยอีกขั้นให้กับบัญชีของคุณ</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-8 space-y-8 bg-white">
                    <div className="space-y-6">
                        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                            <div className="flex gap-4">
                                <div className="p-2.5 rounded-xl bg-white shadow-sm border border-slate-100">
                                    <Smartphone className="w-5 h-5 text-blue-600" />
                                </div>
                                <div className="space-y-0.5">
                                    <Label className="text-sm font-bold text-slate-800">ยืนยันตัวตนสองชั้น (2FA)</Label>
                                    <p className="text-xs text-slate-500 font-medium font-headline">ส่งรหัสยืนยันไปยังมือถือเมื่อมีการเข้าสู่ระบบ</p>
                                </div>
                            </div>
                            <Switch className="data-[state=checked]:bg-[#002f4b]" />
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                            <div className="flex gap-4">
                                <div className="p-2.5 rounded-xl bg-white shadow-sm border border-slate-100">
                                    <Lock className="w-5 h-5 text-indigo-500" />
                                </div>
                                <div className="space-y-0.5">
                                    <Label className="text-sm font-bold text-slate-800">เปลี่ยนรหัสผ่าน (Password)</Label>
                                    <p className="text-xs text-slate-500 font-medium italic">อัปเดตรหัสผ่านของคุณอย่างสม่ำเสมอ</p>
                                </div>
                            </div>
                            <Button variant="outline" size="sm" className="rounded-xl font-bold border-slate-200">แก้ไข</Button>
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 opacity-50">
                            <div className="flex gap-4">
                                <div className="p-2.5 rounded-xl bg-white shadow-sm border border-slate-100">
                                    <Fingerprint className="w-5 h-5 text-slate-400" />
                                </div>
                                <div className="space-y-0.5">
                                    <Label className="text-sm font-bold text-slate-800">Passkeys (Biometric)</Label>
                                    <p className="text-xs text-slate-500 font-medium italic">เข้าสู่ระบบด้วยลายนิ้วมือหรือใบหน้า (เร็วๆ นี้)</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

// Minimal placeholder for Smartphone icon since it's not dynamic in this file
function Smartphone({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
            <path d="M12 18h.01" />
        </svg>
    );
}
