'use client';
export const runtime = 'edge';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Globe, Save, Loader2, Languages, Clock } from 'lucide-react';
import Link from 'next/link';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function LanguageRegionPage() {
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
                    <Button variant="ghost" size="icon" className="rounded-xl shadow-none font-bold">
                        <ChevronLeft className="w-5 h-5 border-none" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold">ภาษาและภูมิภาค</h1>
                    <p className="text-slate-500 text-sm font-medium">ตั้งค่าภาษาที่ใช้ในระบบและเขตเวลาของคุณ</p>
                </div>
            </div>

            <Card className="rounded-3xl border shadow-xl shadow-blue-900/5 overflow-hidden bg-white">
                <CardHeader className="p-8 border-b border-slate-50">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-[#002f4b] text-white shadow-lg">
                            <Globe className="w-6 h-6" />
                        </div>
                        <div>
                            <CardTitle className="text-xl font-bold">การแสดงผล</CardTitle>
                            <CardDescription>ปรับแต่งการแสดงผลตามความต้องการของคุณ</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-8 space-y-8 bg-white">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Languages className="w-4 h-4 text-blue-500" />
                                <Label className="text-sm font-bold text-slate-700">ภาษาหลักของระบบ</Label>
                            </div>
                            <Select defaultValue="th">
                                <SelectTrigger className="rounded-2xl border-slate-200 h-12 font-medium">
                                    <SelectValue placeholder="เลือกภาษา" />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl border-slate-100">
                                    <SelectItem value="th" className="rounded-xl font-medium">ภาษาไทย (Thai)</SelectItem>
                                    <SelectItem value="en" className="rounded-xl font-medium">English (US)</SelectItem>
                                    <SelectItem value="zh" className="rounded-xl font-medium">中文 (Chinese)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Clock className="w-4 h-4 text-indigo-500" />
                                <Label className="text-sm font-bold text-slate-700">เขตเวลา (Timezone)</Label>
                            </div>
                            <Select defaultValue="bangkok">
                                <SelectTrigger className="rounded-2xl border-slate-200 h-12 font-medium">
                                    <SelectValue placeholder="เลือกเขตเวลา" />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl border-slate-100">
                                    <SelectItem value="bangkok" className="rounded-xl font-medium">(GMT+07:00) Bangkok</SelectItem>
                                    <SelectItem value="singapore" className="rounded-xl font-medium">(GMT+08:00) Singapore</SelectItem>
                                    <SelectItem value="london" className="rounded-xl font-medium">(GMT+00:00) London</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100">
                        <p className="text-xs text-blue-700 leading-relaxed font-bold italic">
                            * การเปลี่ยนภาษาจะมีผลกับหน้าจอผู้ใช้และเมนูต่างๆ สำหรับเอกสารทางกฎหมาย คุณยังคงสามารถเลือกภาษาของเอกสารได้ในขั้นตอนการสร้างสัญญา
                        </p>
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
