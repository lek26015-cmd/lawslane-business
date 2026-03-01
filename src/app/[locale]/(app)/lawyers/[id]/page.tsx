'use client';
export const runtime = 'edge';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useFirebase } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';
import type { LawyerProfile } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Star, MessageSquare, Briefcase, MapPin, CheckCircle2, GraduationCap, Scale, Phone, Mail, Clock } from 'lucide-react';
import logoColor from '@/pic/logo-lawslane-transparent-color.png';

export default function B2BLawyerProfilePage() {
    const t = useTranslations('LawyerProfile');
    const params = useParams();
    const { firestore } = useFirebase();
    const [lawyer, setLawyer] = useState<LawyerProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!firestore || !params.id) return;

        const fetchLawyer = async () => {
            try {
                const docRef = doc(firestore, 'lawyerProfiles', params.id as string);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setLawyer({ id: docSnap.id, ...docSnap.data() } as LawyerProfile);
                }
            } catch (error) {
                console.error("Error fetching lawyer:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLawyer();
    }, [firestore, params.id]);

    if (isLoading) {
        return (
            <div className="flex-1 p-8 bg-muted/10 min-h-[calc(100vh-64px)]">
                <div className="max-w-4xl mx-auto space-y-6">
                    <div className="h-10 w-40 bg-muted animate-pulse rounded-lg"></div>
                    <div className="h-64 bg-muted animate-pulse rounded-2xl"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="h-48 bg-muted animate-pulse rounded-2xl"></div>
                        <div className="h-48 bg-muted animate-pulse rounded-2xl"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!lawyer) {
        return (
            <div className="flex-1 p-8 bg-muted/10 min-h-[calc(100vh-64px)] flex items-center justify-center">
                <div className="text-center space-y-4">
                    <h2 className="text-2xl font-bold">ไม่พบข้อมูลทนาย</h2>
                    <p className="text-muted-foreground">ทนายที่คุณค้นหาอาจถูกลบออกจากระบบแล้ว</p>
                    <Button asChild variant="outline">
                        <Link href="/lawyers">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            กลับไปหน้าค้นหาทนาย
                        </Link>
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 p-6 md:p-8 bg-muted/10 min-h-[calc(100vh-64px)]">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Back */}
                <Button asChild variant="ghost" className="text-muted-foreground hover:text-foreground gap-2 -ml-2">
                    <Link href="/lawyers">
                        <ArrowLeft className="w-4 h-4" />
                        {t('backToList')}
                    </Link>
                </Button>

                {/* Hero Card */}
                <Card className="rounded-2xl overflow-hidden border shadow-sm">
                    <div className="h-32 md:h-40 bg-gradient-to-r from-[#002f4b] to-[#00466c] dark:from-slate-800 dark:to-slate-900 relative">
                        <Badge className="absolute top-4 right-4 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-500/20 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-none backdrop-blur-md text-sm">
                            <CheckCircle2 className="w-4 h-4" />
                            Verified
                        </Badge>
                    </div>
                    <CardContent className="relative pt-0 pb-8 px-6 md:px-8">
                        <div className="flex flex-col md:flex-row gap-6 items-start">
                            {/* Avatar */}
                            <div className="-mt-16 md:-mt-20 shrink-0">
                                <div className="w-28 h-28 md:w-32 md:h-32 rounded-2xl overflow-hidden border-4 border-card shadow-md relative bg-card">
                                    <Image
                                        src={lawyer.imageUrl || logoColor}
                                        alt={lawyer.name}
                                        fill
                                        className="object-cover"
                                        sizes="128px"
                                    />
                                </div>
                            </div>

                            {/* Info */}
                            <div className="flex-1 pt-2 md:pt-4">
                                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                    <div>
                                        <h1 className="text-2xl md:text-3xl font-bold text-foreground">{lawyer.name}</h1>
                                        <p className="text-muted-foreground flex items-center gap-2 mt-1">
                                            <Briefcase className="w-4 h-4 shrink-0" />
                                            {t('licenseNumber')}: {lawyer.licenseNumber}
                                        </p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <div className="flex items-center gap-1 bg-amber-500/10 text-amber-600 px-2.5 py-1 rounded-lg text-sm font-bold border border-amber-500/20">
                                                <Star className="w-4 h-4 fill-amber-500 stroke-none" />
                                                {lawyer.averageRating?.toFixed(1) || '5.0'}
                                            </div>
                                            <span className="text-sm text-muted-foreground">
                                                ({lawyer.reviewCount || 0} {t('reviews')})
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex gap-3 shrink-0">
                                        <Button asChild variant="outline" className="gap-2 border-muted-foreground/20">
                                            <Link href={`/lawyers/${params.id}/chat`}>
                                                <MessageSquare className="w-4 h-4" />
                                                {t('sendMessage')}
                                            </Link>
                                        </Button>
                                        <Button asChild className="gap-2 bg-[#002f4b] hover:bg-[#001f35] text-white dark:bg-blue-600 dark:hover:bg-blue-700">
                                            <Link href={`/lawyers/${params.id}/chat`}>
                                                <Phone className="w-4 h-4" />
                                                {t('bookConsultation')}
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* About */}
                    <Card className="rounded-2xl border shadow-sm">
                        <CardContent className="p-6 space-y-4">
                            <h2 className="text-lg font-bold flex items-center gap-2">
                                <Scale className="w-5 h-5 text-blue-500" />
                                {t('about')}
                            </h2>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                {lawyer.description || 'ไม่มีคำอธิบาย'}
                            </p>

                            <div className="pt-2">
                                <h3 className="text-sm font-semibold mb-3">ความเชี่ยวชาญ</h3>
                                <div className="flex flex-wrap gap-2">
                                    {lawyer.specialty?.map((spec, i) => (
                                        <Badge key={i} variant="secondary" className="bg-blue-500/5 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300 border-blue-500/10 rounded-full px-3 py-1 text-xs font-medium">
                                            {spec}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Education & Experience */}
                    <Card className="rounded-2xl border shadow-sm">
                        <CardContent className="p-6 space-y-5">
                            <div>
                                <h2 className="text-lg font-bold flex items-center gap-2 mb-3">
                                    <GraduationCap className="w-5 h-5 text-blue-500" />
                                    {t('educationLicense')}
                                </h2>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {lawyer.education || t('noEducation')}
                                </p>
                            </div>

                            <div className="h-px bg-border" />

                            <div>
                                <h2 className="text-lg font-bold flex items-center gap-2 mb-3">
                                    <Clock className="w-5 h-5 text-blue-500" />
                                    {t('experience')}
                                </h2>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {lawyer.experience || t('noExperience')}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Service Area */}
                    <Card className="rounded-2xl border shadow-sm">
                        <CardContent className="p-6 space-y-4">
                            <h2 className="text-lg font-bold flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-blue-500" />
                                พื้นที่ให้บริการ
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                {lawyer.serviceProvinces?.map((prov, i) => (
                                    <Badge key={i} variant="outline" className="rounded-full px-3 py-1 text-xs font-medium">
                                        {prov}
                                    </Badge>
                                )) || <p className="text-sm text-muted-foreground">ไม่ได้ระบุ</p>}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Contact Info */}
                    <Card className="rounded-2xl border shadow-sm">
                        <CardContent className="p-6 space-y-4">
                            <h2 className="text-lg font-bold flex items-center gap-2">
                                <Phone className="w-5 h-5 text-blue-500" />
                                ข้อมูลติดต่อ
                            </h2>
                            <div className="space-y-3">
                                {lawyer.phone && (
                                    <div className="flex items-center gap-3 text-sm">
                                        <Phone className="w-4 h-4 text-muted-foreground" />
                                        <span>{lawyer.phone}</span>
                                    </div>
                                )}
                                {lawyer.email && (
                                    <div className="flex items-center gap-3 text-sm">
                                        <Mail className="w-4 h-4 text-muted-foreground" />
                                        <span>{lawyer.email}</span>
                                    </div>
                                )}
                                {lawyer.lineId && (
                                    <div className="flex items-center gap-3 text-sm">
                                        <MessageSquare className="w-4 h-4 text-muted-foreground" />
                                        <span>LINE: {lawyer.lineId}</span>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
