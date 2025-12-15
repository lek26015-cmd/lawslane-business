import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, FileText, Briefcase, Users, ArrowRight, CheckCircle2, Phone, Mail, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { getImageUrl, getImageHint } from '@/lib/data';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { SmeContactForm } from '@/components/sme-contact-form';

import { FadeIn } from '@/components/fade-in';

export default function SMEPage() {
    const services = [
        {
            icon: <FileText className="w-10 h-10 text-primary" />,
            title: "ร่างและตรวจสัญญาธุรกิจ",
            description: "บริการร่าง ตรวจสอบ และแก้ไขสัญญาทางธุรกิจทุกประเภท เพื่อปิดช่องโหว่และรักษาผลประโยชน์สูงสุดของบริษัทคุณ",
            link: "/services/contracts"
        },
        {
            icon: <ShieldCheck className="w-10 h-10 text-primary" />,
            title: "ที่ปรึกษากฎหมายประจำบริษัท",
            description: "มีทนายความส่วนตัวคอยให้คำปรึกษาตลอดเวลา ช่วยตัดสินใจทางธุรกิจบนพื้นฐานความถูกต้องทางกฎหมาย",
            link: "#contact"
        },
        {
            icon: <Briefcase className="w-10 h-10 text-primary" />,
            title: "จดทะเบียนและใบอนุญาต",
            description: "ดูแลเรื่องการจดทะเบียนบริษัท แก้ไขหนังสือบริคณห์สนธิ และขอใบอนุญาตประกอบธุรกิจต่างๆ",
            link: "/services/registration"
        },
        {
            icon: <Users className="w-10 h-10 text-primary" />,
            title: "ระงับข้อพิพาททางธุรกิจ",
            description: "เจรจาไกล่เกลี่ย และว่าความในคดีแพ่งและพาณิชย์ เพื่อปกป้องสิทธิและชื่อเสียงของธุรกิจ",
            link: "#contact"
        }
    ];

    const benefits = [
        "ลดความเสี่ยงทางกฎหมายในการทำธุรกิจ",
        "ประหยัดค่าใช้จ่ายกว่าการจ้างฝ่ายกฎหมายประจำ",
        "เข้าถึงทีมทนายความผู้เชี่ยวชาญเฉพาะด้านจาก Lawslane",
        "จัดการเอกสารและสัญญาได้อย่างมืออาชีพ",
        "มีความลับทางการค้าปลอดภัยสูงสุด"
    ];

    return (
        <div className="flex flex-col min-h-screen">
            {/* ... (Hero Section remains unchanged) */}

            {/* Services Section */}
            <section id="services" className="w-full py-16 md:py-24 bg-background">
                <div className="container mx-auto px-4 md:px-6">
                    <FadeIn direction="up">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold font-headline text-foreground">บริการทางกฎหมายเพื่อธุรกิจ</h2>
                            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                                Lawslane ให้บริการที่ครอบคลุมทุกความต้องการทางกฎหมายของธุรกิจ SME
                            </p>
                        </div>
                    </FadeIn>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {services.map((service, index) => (
                            <FadeIn key={index} delay={index * 100} direction="up" fullWidth>
                                {service.link ? (
                                    <Link href={service.link} className="block h-full">
                                        <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300 h-full cursor-pointer rounded-3xl">
                                            <CardHeader>
                                                <div className="mb-4 p-3 bg-primary/10 w-fit rounded-xl">
                                                    {service.icon}
                                                </div>
                                                <CardTitle className="text-xl font-bold">{service.title}</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-muted-foreground leading-relaxed">
                                                    {service.description}
                                                </p>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                ) : (
                                    <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300 h-full rounded-3xl">
                                        <CardHeader>
                                            <div className="mb-4 p-3 bg-primary/10 w-fit rounded-xl">
                                                {service.icon}
                                            </div>
                                            <CardTitle className="text-xl font-bold">{service.title}</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-muted-foreground leading-relaxed">
                                                {service.description}
                                            </p>
                                        </CardContent>
                                    </Card>
                                )}
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Choose Us / Benefits */}
            <section className="w-full py-16 md:py-24 bg-secondary/30">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <FadeIn direction="right">
                            <div className="relative h-[400px] lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                                <Image
                                    src={getImageUrl('lawyer-team-working') || '/placeholder.jpg'}
                                    alt="Business meeting"
                                    fill
                                    className="object-cover"
                                    data-ai-hint={getImageHint('lawyer-team-working')}
                                />
                            </div>
                        </FadeIn>
                        <div className="space-y-8">
                            <FadeIn direction="left">
                                <h2 className="text-3xl md:text-4xl font-bold font-headline text-foreground">
                                    ทำไมต้องใช้บริการ Lawslane for Business?
                                </h2>
                            </FadeIn>
                            <div className="space-y-4">
                                {benefits.map((benefit, index) => (
                                    <FadeIn key={index} delay={index * 100} direction="left">
                                        <div className="flex items-start gap-3">
                                            <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                                            <p className="text-lg text-foreground/80">{benefit}</p>
                                        </div>
                                    </FadeIn>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Form Section */}
            <section id="contact" className="w-full py-20 bg-gray-50">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid lg:grid-cols-2 gap-12">
                        <FadeIn direction="right">
                            <div>
                                <h2 className="text-3xl font-bold font-headline mb-6">ติดต่อ Lawslane สำหรับธุรกิจ</h2>
                                <p className="text-lg text-muted-foreground mb-8">
                                    สนใจบริการที่ปรึกษากฎหมายสำหรับองค์กร กรอกข้อมูลเพื่อให้เจ้าหน้าที่ติดต่อกลับ หรือติดต่อเราผ่านช่องทางด้านล่าง
                                </p>
                                <div className="space-y-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                            <Phone className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-lg">เบอร์โทรศัพท์</p>
                                            <p className="text-muted-foreground">0972275494</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                            <Mail className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-lg">อีเมล</p>
                                            <p className="text-muted-foreground">admin@lawslane.com</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                            <MessageSquare className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-lg">LINE Official</p>
                                            <p className="text-muted-foreground">@lawslane_biz</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </FadeIn>
                        <FadeIn direction="left">
                            <SmeContactForm />
                        </FadeIn>
                    </div>
                </div>
            </section>
        </div>
    );
}
