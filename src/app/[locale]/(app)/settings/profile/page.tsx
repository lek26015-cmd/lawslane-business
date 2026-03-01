'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirebase } from '@/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { Building2, Save, ChevronLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function CompanyProfilePage() {
    const { user } = useUser();
    const { firestore } = useFirebase();
    const { toast } = useToast();
    const [isSaving, setIsSaving] = useState(false);

    // Form states
    const [companyName, setCompanyName] = useState('');
    const [taxId, setTaxId] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [website, setWebsite] = useState('');

    useEffect(() => {
        if (!user || !firestore) {
            return;
        }

        const fetchCompanyData = async () => {
            try {
                const userDoc = await getDoc(doc(firestore, 'users', user.uid));
                if (userDoc.exists()) {
                    const data = userDoc.data();
                    setCompanyName(data.companyName || '');
                    setTaxId(data.taxId || '');
                    setAddress(data.address || '');
                    setPhone(data.phone || '');
                    setWebsite(data.website || '');
                }
            } catch (error) {
                console.error("Error fetching company data:", error);
                toast({ variant: 'destructive', title: 'ไม่สามารถโหลดข้อมูลได้' });
            }
        };

        fetchCompanyData();
    }, [user, firestore, toast]);

    const handleSave = async () => {
        if (!user || !firestore) return;
        if (!companyName) {
            toast({ variant: 'destructive', title: 'กรุณากรอกชื่อบริษัท' });
            return;
        }

        setIsSaving(true);
        try {
            await updateDoc(doc(firestore, 'users', user.uid), {
                companyName,
                taxId,
                address,
                phone,
                website,
                updatedAt: new Date()
            });
            toast({ title: 'บันทึกข้อมูลสำเร็จ', className: "bg-emerald-50 border-emerald-200 text-emerald-900" });
        } catch (error: any) {
            console.error("Error saving company data:", error);
            toast({ variant: 'destructive', title: 'เกิดข้อผิดพลาด', description: error.message });
        } finally {
            setIsSaving(false);
        }
    };




    return (
        <div className="p-6 md:p-8 space-y-6 max-w-[800px] mx-auto animate-in fade-in duration-500">
            <div className="flex items-center gap-4">
                <Link href="/settings">
                    <Button variant="ghost" size="icon" className="rounded-xl">
                        <ChevronLeft className="w-5 h-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-foreground">ข้อมูลบริษัท</h1>
                    <p className="text-muted-foreground text-sm">จัดการข้อมูลพื้นฐานและการออกใบกำกับภาษี</p>
                </div>
            </div>

            <Card className="rounded-3xl border shadow-xl shadow-blue-900/5 overflow-hidden bg-card/50 backdrop-blur-sm">
                <CardHeader className="p-8 border-b border-border/50 bg-muted/30">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-[#002f4b] text-white shadow-lg">
                            <Building2 className="w-6 h-6" />
                        </div>
                        <div>
                            <CardTitle className="text-xl font-bold">ข้อมูลพื้นฐาน</CardTitle>
                            <CardDescription>ข้อมูลที่จะแสดงในเอกสารและใบกำกับภาษี</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="companyName" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">ชื่อบริษัท / นิติบุคคล</Label>
                            <Input
                                id="companyName"
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                                className="rounded-xl border-slate-200 focus:ring-primary focus:border-primary px-4 py-6"
                                placeholder="ระบุชื่อบริษัทของคุณ"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="taxId" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">เลขประจำตัวผู้เสียภาษี</Label>
                            <Input
                                id="taxId"
                                value={taxId}
                                onChange={(e) => setTaxId(e.target.value)}
                                className="rounded-xl border-slate-200 focus:ring-primary focus:border-primary px-4 py-6"
                                placeholder="13 หลัก"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="address" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">ที่อยู่สำนักงาน</Label>
                        <textarea
                            id="address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="w-full min-h-[100px] rounded-xl border border-slate-200 bg-transparent px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            placeholder="ระบุที่อยู่สำหรับการออกเอกสาร"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="phone" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">เบอร์โทรศัพท์ติดต่อ</Label>
                            <Input
                                id="phone"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="rounded-xl border-slate-200 focus:ring-primary focus:border-primary px-4 py-6"
                                placeholder="0x-xxxx-xxxx"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="website" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">เว็บไซต์ (ถ้ามี)</Label>
                            <Input
                                id="website"
                                value={website}
                                onChange={(e) => setWebsite(e.target.value)}
                                className="rounded-xl border-slate-200 focus:ring-primary focus:border-primary px-4 py-6"
                                placeholder="https://example.com"
                            />
                        </div>
                    </div>
                </CardContent>
                <div className="p-8 border-t border-border/50 bg-muted/30 flex justify-end">
                    <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="rounded-2xl bg-[#002f4b] hover:bg-[#003f66] text-white px-8 h-12 font-bold shadow-lg shadow-blue-900/10"
                    >
                        {isSaving ? (
                            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> กำลังบันทึก...</>
                        ) : (
                            <><Save className="w-4 h-4 mr-2" /> บันทึกข้อมูล</>
                        )}
                    </Button>
                </div>
            </Card>
        </div>
    );
}
