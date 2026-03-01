'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { useFirebase } from '@/firebase';
import { getApprovedLawyers } from '@/lib/data';
import type { LawyerProfile } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Star, MessageSquare, Briefcase, MapPin, CheckCircle2, SlidersHorizontal } from 'lucide-react';
import logoColor from '@/pic/logo-lawslane-transparent-color.png';

export default function B2BLawyersDirectory() {
    const t = useTranslations('Lawyers');
    const { firestore } = useFirebase();
    const [lawyers, setLawyers] = useState<LawyerProfile[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSpecialty, setSelectedSpecialty] = useState('all');
    const [selectedProvince, setSelectedProvince] = useState('all');

    const B2B_SPECIALTIES = [
        t('specialties.business'),
        t('specialties.intellectualProperty'),
        t('specialties.labor'),
        t('specialties.contractBreach'),
        t('specialties.realEstate'),
        t('specialties.civilCommercial'),
        t('specialties.smeFraud')
    ];

    const PROVINCES = [
        'กรุงเทพมหานคร',
        'เชียงใหม่',
        'ชลบุรี',
        'ภูเก็ต',
        'ขอนแก่น',
        'ระยอง',
        'นนทบุรี',
        'สมุทรปราการ',
        'นทบุรี'
    ];

    useEffect(() => {
        let isMounted = true;

        async function fetchLawyers() {
            if (!firestore) {
                if (isMounted) setIsLoading(false);
                return;
            }
            try {
                const data = await getApprovedLawyers(firestore);
                if (isMounted) {
                    setLawyers(data);
                    setIsLoading(false);
                }
            } catch (error) {
                console.error("Error fetching lawyers:", error);
                if (isMounted) setIsLoading(false);
            }
        }

        fetchLawyers();
        return () => { isMounted = false; };
    }, [firestore]);

    const filteredLawyers = useMemo(() => {
        return lawyers.filter(lawyer => {
            const matchesSearch = lawyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (lawyer.specialty && lawyer.specialty.join(', ').toLowerCase().includes(searchTerm.toLowerCase()));
            const matchesSpecialty = selectedSpecialty === 'all' ||
                (lawyer.specialty && lawyer.specialty.includes(selectedSpecialty));
            const matchesProvince = selectedProvince === 'all' ||
                (lawyer.serviceProvinces && lawyer.serviceProvinces.includes(selectedProvince));

            return matchesSearch && matchesSpecialty && matchesProvince;
        });
    }, [lawyers, searchTerm, selectedSpecialty, selectedProvince]);

    if (isLoading) {
        return (
            <div className="flex-1 p-8 bg-muted/20 min-h-screen">
                <div className="max-w-6xl mx-auto space-y-6">
                    <div className="h-20 bg-muted animate-pulse rounded-xl"></div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="h-[350px] bg-muted animate-pulse rounded-xl"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 p-6 md:p-8 space-y-8 bg-muted/10 min-h-[calc(100vh-64px)]">
            {/* Header & Search */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-card border rounded-2xl p-6 shadow-sm">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold tracking-tight text-[#002f4b] dark:text-blue-100 flex items-center gap-2">
                        <Briefcase className="w-6 h-6 text-blue-500" />
                        Lawslane Legal Experts
                    </h1>
                    <p className="text-muted-foreground text-sm">
                        Find verified corporate lawyers and legal specialists for your business needs.
                    </p>
                </div>

                <div className="w-full md:w-auto flex-1 md:max-w-md relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                        placeholder={t('filter.expertise') + ", Name..."}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-full bg-background rounded-full border-muted-foreground/20 focus-visible:ring-blue-500"
                    />
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 hide-scrollbar mask-gradient-right">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-background border rounded-full text-sm font-medium shrink-0 shadow-sm">
                        <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
                        Filters
                    </div>

                    <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                        <SelectTrigger className="w-[180px] rounded-full h-9 bg-background shrink-0">
                            <SelectValue placeholder={t('filter.expertise')} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">{t('filter.all')}</SelectItem>
                            {B2B_SPECIALTIES.map(spec => (
                                <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={selectedProvince} onValueChange={setSelectedProvince}>
                        <SelectTrigger className="w-[160px] rounded-full h-9 bg-background shrink-0">
                            <SelectValue placeholder={t('filter.province')} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">{t('filter.allProvinces')}</SelectItem>
                            {PROVINCES.map(prov => (
                                <SelectItem key={prov} value={prov}>{prov}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="text-sm font-medium text-muted-foreground shrink-0 w-full sm:w-auto text-right">
                    {filteredLawyers.length} lawyers found
                </div>
            </div>

            {/* Lawyer Grid */}
            {filteredLawyers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredLawyers.map((lawyer) => {
                        return (
                            <div key={lawyer.id} className="group bg-card border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 flex flex-col h-full hover:border-blue-500/30">
                                {/* Top Banner/Profile */}
                                <div className="h-20 bg-gradient-to-r from-[#002f4b] to-[#00466c] dark:from-slate-800 dark:to-slate-900 relative mb-12">
                                    <div className="absolute -bottom-10 left-6">
                                        <div className="w-20 h-20 rounded-xl overflow-hidden border-4 border-card outline outline-1 outline-black/5 dark:outline-white/10 shadow-sm relative bg-card">
                                            <Image
                                                src={lawyer.imageUrl || logoColor}
                                                alt={lawyer.name}
                                                fill
                                                className="object-cover"
                                                sizes="80px"
                                            />
                                        </div>
                                    </div>
                                    <Badge className="absolute top-4 right-4 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1 shadow-none backdrop-blur-md">
                                        <CheckCircle2 className="w-3 h-3" />
                                        Verified
                                    </Badge>
                                </div>

                                {/* Content */}
                                <div className="p-6 pt-0 flex flex-col flex-1">
                                    <div className="flex items-start justify-between mb-2 gap-2">
                                        <div>
                                            <h3 className="font-bold text-lg text-foreground line-clamp-1 group-hover:text-blue-600 transition-colors">
                                                {lawyer.name}
                                            </h3>
                                            <p className="text-xs text-muted-foreground font-medium flex items-center gap-1 truncate">
                                                <Briefcase className="w-3 h-3 shrink-0" />
                                                License: {lawyer.licenseNumber || "12345/2560"}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-1 bg-amber-500/10 text-amber-600 px-2 py-1 rounded-md text-xs font-bold leading-none shrink-0 border border-amber-500/20">
                                            <Star className="w-3 h-3 fill-amber-500 stroke-none" />
                                            {lawyer.averageRating?.toFixed(1) || '5.0'}
                                        </div>
                                    </div>

                                    {/* Specialties Map */}
                                    <div className="flex flex-wrap gap-1.5 mt-4 mb-5 flex-1 content-start">
                                        {lawyer.specialty?.slice(0, 3).map((spec, i) => (
                                            <Badge key={i} variant="secondary" className="bg-blue-500/5 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300 hover:bg-blue-500/10 border-blue-500/10 text-[10px] px-2 py-0.5 rounded-full font-medium">
                                                {spec}
                                            </Badge>
                                        ))}
                                        {lawyer.specialty && lawyer.specialty.length > 3 && (
                                            <Badge variant="secondary" className="bg-muted text-muted-foreground text-[10px] px-2 py-0.5 rounded-full opacity-70">
                                                +{lawyer.specialty.length - 3}
                                            </Badge>
                                        )}
                                    </div>

                                    <div className="w-full h-px bg-border/60 my-4" />

                                    <div className="flex items-center gap-2 mb-5">
                                        <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
                                        <p className="text-xs text-muted-foreground truncate">
                                            {lawyer.serviceProvinces?.slice(0, 2).join(', ') || 'Bangkok'}
                                            {lawyer.serviceProvinces && lawyer.serviceProvinces.length > 2 ? ` +${lawyer.serviceProvinces.length - 2}` : ''}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 mt-auto">
                                        {/* TODO: Implement real chat link if applicable, routing to the chat system */}
                                        <Button asChild variant="outline" className="w-full bg-background border-muted-foreground/20 hover:bg-muted font-semibold text-xs h-9">
                                            <Link href={`/lawyers/${lawyer.id}/chat`}>
                                                <MessageSquare className="w-3.5 h-3.5 mr-1.5" />
                                                Contact
                                            </Link>
                                        </Button>
                                        <Button asChild className="w-full bg-[#002f4b] hover:bg-[#001f35] text-white font-semibold shadow-sm text-xs h-9 dark:bg-blue-600 dark:hover:bg-blue-700">
                                            <Link href={`/lawyers/${lawyer.id}`}>
                                                Profile
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center p-12 bg-card border border-dashed rounded-2xl text-center min-h-[300px]">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4 text-muted-foreground/50">
                        <Search className="w-8 h-8" />
                    </div>
                    <h2 className="text-xl font-bold text-foreground mb-2">No lawyers found</h2>
                    <p className="text-muted-foreground mb-6 max-w-sm text-sm">
                        {"We couldn't find any lawyers matching your current filters. Try changing or clearing them."}
                    </p>
                    <Button
                        variant="outline"
                        onClick={() => {
                            setSearchTerm('');
                            setSelectedSpecialty('all');
                            setSelectedProvince('all');
                        }}
                    >
                        Clear all filters
                    </Button>
                </div>
            )}
        </div>
    );
}
