
'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FadeIn } from '@/components/fade-in';
import { Building2, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { initializeFirebase } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

export default function RegistrationRequestPage() {
    const { toast } = useToast();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        contactName: '',
        companyName: '',
        phone: '',
        email: '',
        registrationType: '',
        details: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSelectChange = (value: string) => {
        setFormData(prev => ({ ...prev, registrationType: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!formData.registrationType) {
            toast({
                title: "กรุณาเลือกประเภทการจดทะเบียน",
                variant: "destructive"
            });
            return;
        }

        setIsSubmitting(true);

        try {
            // Save to Firestore
            const { firestore: db } = initializeFirebase();
            await addDoc(collection(db, 'registrationRequests'), {
                ...formData,
                status: 'pending',
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });

            toast({
                title: "ส่งข้อมูลเรียบร้อยแล้ว",
                description: "เจ้าหน้าที่จะติดต่อกลับเพื่อดำเนินการในขั้นตอนต่อไปภายใน 24 ชั่วโมง",
            });

            // Reset form
            setFormData({
                contactName: '',
                companyName: '',
                phone: '',
                email: '',
                registrationType: '',
                details: ''
            });

        } catch (error) {
            console.error("Error submitting request:", error);
            toast({
                title: "เกิดข้อผิดพลาด",
                description: "ไม่สามารถส่งข้อมูลได้ กรุณาลองใหม่อีกครั้ง",
                variant: "destructive"
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-yellow-50/30 py-12 md:py-20">
            <div className="container mx-auto px-4 md:px-6 max-w-3xl">
                <FadeIn direction="up">
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl md:text-4xl font-bold font-headline text-[#8B5E00] mb-4">
                            เริ่มดำเนินการจดทะเบียนธุรกิจ
                        </h1>
                        <p className="text-slate-600 text-lg">
                            กรอกข้อมูลเบื้องต้นเพื่อให้ทนายความเตรียมเอกสารและติดต่อกลับ
                        </p>
                    </div>
                </FadeIn>

                <FadeIn direction="up" delay={100}>
                    <Card className="border-none shadow-xl bg-white rounded-3xl">
                        <CardHeader className="border-b bg-white rounded-t-3xl p-6 md:p-8">
                            <CardTitle className="text-xl font-semibold flex items-center gap-2 text-[#8B5E00]">
                                <Building2 className="w-5 h-5" />
                                แบบฟอร์มข้อมูลธุรกิจ
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 md:p-8">
                            <form onSubmit={handleSubmit} className="space-y-6">

                                <div className="space-y-2">
                                    <Label htmlFor="registrationType">ประเภทการจดทะเบียน <span className="text-red-500">*</span></Label>
                                    <Select onValueChange={handleSelectChange} value={formData.registrationType}>
                                        <SelectTrigger className="h-11 rounded-xl">
                                            <SelectValue placeholder="เลือกประเภทการจดทะเบียน" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="company">จดทะเบียนบริษัทจำกัด</SelectItem>
                                            <SelectItem value="partnership">จดทะเบียนห้างหุ้นส่วน</SelectItem>
                                            <SelectItem value="trademark">จดเครื่องหมายการค้า</SelectItem>
                                            <SelectItem value="other">อื่นๆ</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="companyName">ชื่อธุรกิจที่ต้องการจดทะเบียน (ภาษาไทย/อังกฤษ) <span className="text-red-500">*</span></Label>
                                    <Input
                                        id="companyName"
                                        required
                                        placeholder="เช่น บริษัท ลอว์เลนส์ จำกัด / Lawslane Co., Ltd."
                                        className="h-11 rounded-xl"
                                        value={formData.companyName}
                                        onChange={handleInputChange}
                                    />
                                    <p className="text-xs text-slate-500">หากยังไม่มีชื่อที่แน่นอน สามารถระบุชื่อที่สนใจเบื้องต้นได้</p>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="contactName">ชื่อผู้ติดต่อ <span className="text-red-500">*</span></Label>
                                        <Input
                                            id="contactName"
                                            required
                                            placeholder="ระบุชื่อของคุณ"
                                            className="h-11 rounded-xl"
                                            value={formData.contactName}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">เบอร์โทรศัพท์ <span className="text-red-500">*</span></Label>
                                        <Input
                                            id="phone"
                                            required
                                            type="tel"
                                            placeholder="08x-xxx-xxxx"
                                            className="h-11 rounded-xl"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">อีเมล <span className="text-red-500">*</span></Label>
                                    <Input
                                        id="email"
                                        required
                                        type="email"
                                        placeholder="name@example.com"
                                        className="h-11 rounded-xl"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="details">รายละเอียดเพิ่มเติม (ถ้ามี)</Label>
                                    <Textarea
                                        id="details"
                                        placeholder="เช่น จำนวนผู้ถือหุ้น, ทุนจดทะเบียนที่ต้องการ, หรือข้อสงสัยอื่นๆ"
                                        className="min-h-[100px] resize-none rounded-xl"
                                        value={formData.details}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <div className="pt-4">
                                    <Button
                                        type="submit"
                                        className="w-full h-12 text-lg font-semibold bg-[#D97706] hover:bg-[#B45309] text-white rounded-xl shadow-lg shadow-amber-900/10"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                                กำลังส่งข้อมูล...
                                            </>
                                        ) : (
                                            <>ส่งข้อมูลเพื่อเริ่มดำเนินการ</>
                                        )}
                                    </Button>
                                    <p className="text-center text-sm text-slate-500 mt-4 flex items-center justify-center gap-1">
                                        <AlertCircle className="w-4 h-4" />
                                        ข้อมูลของคุณจะถูกเก็บเป็นความลับและใช้เพื่อการจดทะเบียนเท่านั้น
                                    </p>
                                </div>

                            </form>
                        </CardContent>
                    </Card>
                </FadeIn>
            </div>
        </div>
    );
}
