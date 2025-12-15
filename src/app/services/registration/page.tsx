
'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FadeIn } from '@/components/fade-in';
import { Building2, Users2, Copyright, ArrowLeft, FileText, Phone, CreditCard, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function RegistrationServicePage() {
    const services = [
        {
            icon: <Building2 className="w-10 h-10 text-slate-600" />,
            title: "จดทะเบียนบริษัทจำกัด",
            description: "เหมาะสำหรับธุรกิจทั่วไปที่ต้องการความน่าเชื่อถือ",
            bg: "bg-yellow-50",
            border: "border-yellow-100"
        },
        {
            icon: <Users2 className="w-10 h-10 text-amber-500" />,
            title: "จดทะเบียนห้างหุ้นส่วน",
            description: "สำหรับธุรกิจขนาดเล็กที่มีผู้ร่วมก่อตั้ง 2 คนขึ้นไป",
            bg: "bg-yellow-50",
            border: "border-yellow-100"
        },
        {
            icon: <Copyright className="w-10 h-10 text-slate-600" />,
            title: "จดเครื่องหมายการค้า",
            description: "ปกป้องแบรนด์และโลโก้ของคุณ",
            bg: "bg-yellow-50",
            border: "border-yellow-100"
        }
    ];

    const steps = [
        {
            step: "1",
            title: "กรอกข้อมูล",
            description: "กรอกแบบฟอร์มข้อมูลธุรกิจเบื้องต้น",
            icon: <FileText className="w-6 h-6 text-white" />
        },
        {
            step: "2",
            title: "ทนายติดต่อกลับ",
            description: "ทนายตรวจสอบข้อมูลและติดต่อกลับเพื่อยืนยัน",
            icon: <Phone className="w-6 h-6 text-white" />
        },
        {
            step: "3",
            title: "ชำระค่าบริการ",
            description: "ชำระค่าธรรมเนียมและค่าบริการ",
            icon: <CreditCard className="w-6 h-6 text-white" />
        },
        {
            step: "4",
            title: "รอรับเอกสาร",
            description: "ทนายดำเนินการจดทะเบียนและส่งมอบเอกสาร",
            icon: <CheckCircle className="w-6 h-6 text-white" />
        }
    ];

    return (
        <div className="flex flex-col min-h-screen bg-white">
            <div className="container mx-auto px-4 md:px-6 py-16 md:py-24">

                {/* Header */}
                <FadeIn direction="up">
                    <div className="text-center mb-16 space-y-4">
                        <h1 className="text-4xl md:text-5xl font-bold font-headline text-[#8B5E00]">
                            บริการจดทะเบียนธุรกิจ
                        </h1>
                        <p className="text-xl text-slate-600">
                            เริ่มต้นธุรกิจของคุณอย่างถูกต้องและรวดเร็วกับเรา
                        </p>
                    </div>
                </FadeIn>

                {/* Services Cards */}
                <div className="mb-20">
                    <FadeIn direction="up">
                        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 font-headline text-slate-900">
                            บริการของเราครอบคลุม
                        </h2>
                    </FadeIn>
                    <div className="grid md:grid-cols-3 gap-8">
                        {services.map((service, index) => (
                            <FadeIn key={index} delay={index * 100} direction="up">
                                <Card className={`${service.bg} border ${service.border} shadow-sm hover:shadow-md transition-all h-full rounded-3xl`}>
                                    <CardContent className="flex flex-col items-center text-center p-8 gap-4">
                                        <div className="p-3 bg-white rounded-xl shadow-sm">
                                            {service.icon}
                                        </div>
                                        <h3 className="font-bold text-xl text-slate-900">
                                            {service.title}
                                        </h3>
                                        <p className="text-slate-600">
                                            {service.description}
                                        </p>
                                    </CardContent>
                                </Card>
                            </FadeIn>
                        ))}
                    </div>
                </div>

                {/* Steps Section */}
                <FadeIn direction="up" delay={200}>
                    <div className="bg-slate-50 rounded-[3rem] p-8 md:p-12 mb-20 border border-slate-100">
                        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 font-headline text-slate-900">
                            ขั้นตอนการรับบริการ
                        </h2>
                        <div className="grid md:grid-cols-4 gap-8 relative">
                            {steps.map((item, index) => (
                                <div key={index} className="flex flex-col items-center text-center space-y-4 relative z-10">
                                    <div className="w-16 h-16 rounded-full bg-[#D97706] text-white flex items-center justify-center text-2xl font-bold shadow-lg mb-2 ring-4 ring-white">
                                        {item.step}
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900">{item.title}</h3>
                                    <p className="text-slate-600 leading-relaxed text-sm">
                                        {item.description}
                                    </p>
                                </div>
                            ))}
                            {/* Connector Line (Desktop only) */}
                            <div className="hidden md:block absolute top-8 left-[12%] right-[12%] h-0.5 bg-slate-200 -z-0" />
                        </div>
                    </div>
                </FadeIn>

                {/* Pricing & CTA */}
                <FadeIn direction="up">
                    <div className="text-center space-y-8">
                        <div className="space-y-2">
                            <h2 className="text-3xl md:text-4xl font-bold font-headline text-[#8B5E00]">
                                อัตราค่าบริการเริ่มต้น 3,500 บาท
                            </h2>
                            <p className="text-slate-500">
                                (ไม่รวมค่าธรรมเนียมกรมพัฒนาธุรกิจการค้า)
                            </p>
                        </div>

                        <div className="pt-4 space-y-6">
                            <Link href="/services/registration/request">
                                <Button size="lg" className="bg-[#D97706] hover:bg-[#B45309] text-white rounded-full px-10 h-14 text-lg font-semibold shadow-xl shadow-amber-900/20">
                                    เริ่มดำเนินการจดทะเบียน
                                </Button>
                            </Link>

                            <div>
                                <Link href="/sme" className="inline-flex items-center text-slate-500 hover:text-slate-800 transition-colors">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    กลับไปหน้าบริการทั้งหมด
                                </Link>
                            </div>
                        </div>
                    </div>
                </FadeIn>

            </div>
        </div>
    );
}
