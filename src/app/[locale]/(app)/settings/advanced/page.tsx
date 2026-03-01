'use client';
export const runtime = 'edge';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Settings, Database, Terminal, Zap, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

export default function AdvancedSettingsPage() {
    return (
        <div className="p-6 md:p-8 space-y-6 max-w-[800px] mx-auto animate-in fade-in duration-500 text-slate-900">
            <div className="flex items-center gap-4">
                <Link href="/settings">
                    <Button variant="ghost" size="icon" className="rounded-xl shadow-none font-bold">
                        <ChevronLeft className="w-5 h-5 border-none" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold">การตั้งค่าขั้นสูง</h1>
                    <p className="text-slate-500 text-sm font-medium font-headline uppercase tracking-tight">การจัดการสิทธิ์ API และข้อมูลเชิงลึก</p>
                </div>
            </div>

            <Card className="rounded-3xl border shadow-xl shadow-blue-900/5 overflow-hidden bg-white">
                <CardHeader className="p-8 border-b border-slate-50">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-[#002f4b] text-white shadow-lg">
                            <Settings className="w-6 h-6" />
                        </div>
                        <div>
                            <CardTitle className="text-xl font-bold">API & Integrations</CardTitle>
                            <CardDescription>เชื่อมต่อระบบของคุณกับเครื่องมือภายนอก</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-8 space-y-6 bg-white">
                    <div className="flex flex-col items-center text-center p-12 border-2 border-dashed border-slate-100 rounded-[32px] bg-slate-50/50">
                        <div className="w-16 h-16 rounded-3xl bg-white shadow-sm flex items-center justify-center mb-4">
                            <Zap className="w-8 h-8 text-amber-500" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800">COMING SOON</h3>
                        <p className="text-sm text-slate-500 font-medium max-w-[300px] mt-2 leading-relaxed italic">
                            ฟีเจอร์การเชื่อมต่อ API และ Webhooks กำลังอยู่ในระหว่างการพัฒนา เตรียมพบกับระบบที่ยืดหยุ่นกว่าเดิมในเร็วๆ นี้
                        </p>
                    </div>

                    <div className="space-y-4">
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">พื้นที่จัดการข้อมูล</p>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-100 group cursor-pointer hover:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <Database className="w-5 h-5 text-slate-400" />
                                    <span className="text-sm font-bold text-slate-700">ส่งออกข้อมูลทั้งหมด (.JSON, .CSV)</span>
                                </div>
                                <Terminal className="w-4 h-4 text-slate-300" />
                            </div>
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-100 group cursor-pointer hover:bg-rose-50/50 hover:border-rose-200 transition-colors">
                                <div className="flex items-center gap-3">
                                    <ShieldAlert className="w-5 h-5 text-rose-500" />
                                    <span className="text-sm font-bold text-rose-600">ลบพื้นที่ทำงานถาวร</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
