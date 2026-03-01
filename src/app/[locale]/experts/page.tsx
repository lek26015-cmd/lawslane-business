'use client';
export const runtime = 'edge';

import React, { useState, useEffect, useMemo } from 'react';
import { BusinessHeader } from '@/components/layout/business-header';
import { BusinessFooter } from '@/components/layout/business-footer';
import { FadeIn } from '@/components/fade-in';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useFirebase } from '@/firebase';
import { getApprovedLawyers } from '@/lib/data';
import type { LawyerProfile } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Star, MessageSquare, Briefcase, MapPin, CheckCircle2, SlidersHorizontal, ArrowRight } from 'lucide-react';
import { Link } from '@/navigation';
import logoColor from '@/pic/logo-lawslane-transparent-color.png';

export default function PublicLawyersPage() {
    const t = useTranslations('Lawyers');
    const { firestore } = useFirebase();
    const [lawyers, setLawyers] = useState<LawyerProfile[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSpecialty, setSelectedSpecialty] = useState('all');

    const B2B_SPECIALTIES = [
        t('specialties.business'),
        t('specialties.intellectualProperty'),
        t('specialties.labor'),
        t('specialties.contractBreach'),
        t('specialties.realEstate'),
        t('specialties.civilCommercial'),
        t('specialties.smeFraud')
    ];

    useEffect(() => {
        let isMounted = true;
        async function fetchLawyers() {
            if (!firestore) {
                setIsLoading(false);
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
            return matchesSearch && matchesSpecialty;
        });
    }, [lawyers, searchTerm, selectedSpecialty]);

    return (
        <div className="min-h-screen bg-slate-50">
            <BusinessHeader transparent={false} />

            <main className="pt-20">
                {/* Hero Section */}
                <section className="bg-white border-b py-20">
                    <div className="container mx-auto px-4 text-center">
                        <FadeIn>
                            <h1 className="text-4xl md:text-5xl font-bold mb-6 font-headline text-slate-900">Verified Corporate Lawyers</h1>
                            <p className="text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed">
                                Browse our directory of top-tier legal experts specialized in business law, intellectual property, and corporate compliance.
                            </p>
                        </FadeIn>
                    </div>
                </section>

                {/* Filter & Search Bar */}
                <section className="sticky top-20 z-40 bg-white/80 backdrop-blur-md border-b py-4 shadow-sm">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-col md:flex-row gap-4 items-center">
                            <div className="relative flex-1 w-full">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                <Input
                                    placeholder="Search by name or expertise..."
                                    className="pl-12 h-12 rounded-2xl bg-slate-50 border-slate-100 focus-visible:ring-blue-500 w-full"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="w-full md:w-64">
                                <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                                    <SelectTrigger className="h-12 rounded-2xl bg-slate-50 border-slate-100">
                                        <SelectValue placeholder="All Specialities" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Specialities</SelectItem>
                                        {B2B_SPECIALTIES.map(spec => (
                                            <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Lawyer Grid */}
                <section className="py-16">
                    <div className="container mx-auto px-4">
                        {isLoading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {[1, 2, 3, 4, 5, 6].map(i => (
                                    <div key={i} className="h-[400px] bg-white animate-pulse rounded-[32px] border border-slate-100 shadow-sm"></div>
                                ))}
                            </div>
                        ) : filteredLawyers.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {filteredLawyers.map((lawyer, i) => (
                                    <FadeIn key={lawyer.id} delay={i * 0.05}>
                                        <div className="group bg-white border border-slate-100 rounded-[32px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full hover:border-blue-500/20">
                                            <div className="p-8">
                                                <div className="flex items-start justify-between mb-6">
                                                    <div className="relative w-20 h-20 rounded-2xl overflow-hidden border border-slate-100">
                                                        <Image
                                                            src={lawyer.imageUrl || logoColor}
                                                            alt={lawyer.name}
                                                            fill
                                                            className="object-cover"
                                                            sizes="80px"
                                                        />
                                                    </div>
                                                    <div className="flex items-center gap-1 bg-amber-50 text-amber-600 px-3 py-1 rounded-full text-xs font-bold leading-none border border-amber-100">
                                                        <Star className="w-3 h-3 fill-amber-500 stroke-none" />
                                                        {lawyer.averageRating?.toFixed(1) || '5.0'}
                                                    </div>
                                                </div>

                                                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                                                    {lawyer.name}
                                                </h3>

                                                <div className="flex flex-wrap gap-2 mb-6">
                                                    {lawyer.specialty?.slice(0, 3).map((spec, idx) => (
                                                        <Badge key={idx} variant="secondary" className="bg-blue-50 text-blue-600 border-none font-medium px-3 py-1 text-[10px] rounded-full">
                                                            {spec}
                                                        </Badge>
                                                    ))}
                                                </div>

                                                <div className="space-y-3 mb-8">
                                                    <div className="flex items-center gap-3 text-sm text-slate-500">
                                                        <MapPin className="w-4 h-4 text-slate-400" />
                                                        {lawyer.serviceProvinces?.[0] || 'Bangkok, Thailand'}
                                                    </div>
                                                    <div className="flex items-center gap-3 text-sm text-slate-500">
                                                        <Briefcase className="w-4 h-4 text-slate-400" />
                                                        Verified Business Lawyer
                                                    </div>
                                                </div>

                                                <Link href={`#`} className="mt-auto">
                                                    <Button className="w-full h-12 rounded-2xl bg-[#002f4b] hover:bg-blue-600 text-white font-bold transition-all shadow-md group">
                                                        View Profile
                                                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    </FadeIn>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20">
                                <Search className="w-16 h-16 text-slate-200 mx-auto mb-6" />
                                <h3 className="text-2xl font-bold text-slate-900 mb-2">No lawyers found</h3>
                                <p className="text-slate-500">Try adjusting your filters or search keywords.</p>
                            </div>
                        )}
                    </div>
                </section>
            </main>

            <BusinessFooter />
        </div>
    );
}
