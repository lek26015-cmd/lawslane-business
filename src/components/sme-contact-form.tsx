
'use client';

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { initializeFirebase } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Loader2, CheckCircle2, AlertCircle, Upload, FileText, X } from 'lucide-react';
import { uploadToR2 } from '@/app/actions/upload-r2';
import { useToast } from '@/hooks/use-toast';

export function SmeContactForm() {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        serviceType: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSelectChange = (value: string) => {
        setFormData(prev => ({ ...prev, serviceType: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const removeFile = () => {
        setFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            let fileUrl = '';
            if (file) {
                const data = new FormData();
                data.set('file', file);
                fileUrl = await uploadToR2(data, 'sme-requests');
            }

            const { firestore: db } = initializeFirebase();
            await addDoc(collection(db, 'smeRequests'), {
                ...formData,
                fileUrl,
                fileName: file ? file.name : '',
                status: 'new',
                createdAt: serverTimestamp(),
            });

            setIsSuccess(true);
            toast({
                title: "ส่งข้อมูลเรียบร้อยแล้ว",
                description: "เจ้าหน้าที่จะติดต่อกลับโดยเร็วที่สุด",
            });
        } catch (error) {
            console.error("Error submitting form:", error);
            toast({
                title: "เกิดข้อผิดพลาด",
                description: "ไม่สามารถส่งข้อมูลได้ กรุณาลองใหม่อีกครั้ง",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <Card className="shadow-xl border-none h-full flex items-center justify-center bg-green-50 rounded-3xl">
                <CardContent className="text-center py-12 space-y-4">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle2 className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-green-800">ส่งข้อมูลสำเร็จ!</h3>
                    <p className="text-green-700 max-w-xs mx-auto">
                        ขอบคุณที่สนใจบริการของเรา ทีมงาน Lawslane จะติดต่อกลับไปยังคุณ {formData.name} โดยเร็วที่สุดครับ
                    </p>
                    <Button variant="outline" onClick={() => {
                        setIsSuccess(false);
                        setFormData({ name: '', phone: '', email: '', serviceType: '' });
                        setFile(null);
                    }} className="mt-4">
                        ส่งข้อความเพิ่ม
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="shadow-xl border-none rounded-3xl">
            <CardHeader className="pb-2">
                <CardTitle className="text-2xl flex items-center gap-2 text-[#0B3979]">
                    <FileText className="w-6 h-6" />
                    แบบฟอร์มขอรับบริการ
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-base font-medium">ชื่อ-นามสกุล / ชื่อบริษัท</Label>
                            <Input
                                id="name"
                                placeholder="ระบุชื่อของคุณ"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                className="h-12"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone" className="text-base font-medium">เบอร์โทรศัพท์</Label>
                            <Input
                                id="phone"
                                placeholder="08x-xxx-xxxx"
                                required
                                value={formData.phone}
                                onChange={handleChange}
                                className="h-12"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-base font-medium">อีเมล (สำหรับรับใบเสนอราคา)</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="name@example.com"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className="h-12"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="serviceType" className="text-base font-medium">ประเภทบริการที่ต้องการ</Label>
                        <Select onValueChange={handleSelectChange} value={formData.serviceType}>
                            <SelectTrigger className="h-12">
                                <SelectValue placeholder="เลือกประเภทบริการ" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="contract">ร่างและตรวจสัญญาธุรกิจ</SelectItem>
                                <SelectItem value="advisor">ที่ปรึกษากฎหมายประจำบริษัท</SelectItem>
                                <SelectItem value="registration">จดทะเบียนและใบอนุญาต</SelectItem>
                                <SelectItem value="dispute">ระงับข้อพิพาททางธุรกิจ</SelectItem>
                                <SelectItem value="other">อื่นๆ</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-base font-medium">อัปโหลดเอกสาร (ถ้ามี)</Label>
                        <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                            <input
                                type="file"
                                className="hidden"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept=".pdf,.doc,.docx,.jpg,.png"
                            />
                            {file ? (
                                <div className="flex items-center justify-center gap-2 text-primary font-medium">
                                    <FileText className="w-5 h-5" />
                                    {file.name}
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6 ml-2 hover:bg-red-100 hover:text-red-600 rounded-full"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeFile();
                                        }}
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-2 text-slate-500">
                                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mb-1">
                                        <Upload className="w-5 h-5" />
                                    </div>
                                    <p>คลิกเพื่ออัปโหลดเอกสาร</p>
                                    <p className="text-xs text-slate-400">รองรับ PDF, Word, JPG, PNG (ไม่เกิน 10MB)</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <Button type="submit" className="w-full text-lg h-12 rounded-xl" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" /> กำลังส่งข้อมูล...
                            </>
                        ) : (
                            'ส่งข้อมูล'
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
