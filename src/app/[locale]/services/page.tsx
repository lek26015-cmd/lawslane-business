'use client';
export const runtime = 'edge';

import React from 'react';
import { BusinessHeader } from '@/components/layout/business-header';
import { BusinessFooter } from '@/components/layout/business-footer';
import { FadeIn } from '@/components/fade-in';
import { FileText, Receipt, ShieldCheck, Users, Zap, Search, ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Link } from '@/navigation';

export default function ServicesPage() {
    const t = useTranslations('B2BLanding');

    const services = [
        {
            icon: FileText,
            title: "Contract Lifecycle Management (CLM)",
            desc: "From drafting to e-signatures and post-execution storage. Our intelligent CLM streamlines the entire contract journey.",
            features: ["AI-Powered Drafting", "Secure E-Signatures", "Automated Renewal Alerts", "Centralized Repository"]
        },
        {
            icon: Receipt,
            title: "Digital Tax & Compliance",
            desc: "The only legal platform in Thailand integrated with e-Tax invoice and withholding systems. Stay compliant while saving time.",
            features: ["e-Tax Invoice Generation", "Instant Withholding Tax (WHT)", "Audit-Ready Logs", "Revenue Dept. Compliance"]
        },
        {
            icon: Users,
            title: "Private Corporate Lawyer Team",
            desc: "Get a dedicated team of pro lawyers who understand your business. Fast turnarounds and high-quality advice.",
            features: ["Unlimited Contract Reviews", "Legal Consultations", "Regulatory Guidance", "Corporate Secretariat"]
        },
        {
            icon: ShieldCheck,
            title: "Risk & Compliance Audit",
            desc: "Keep your business safe with periodic audits and real-time monitoring of your legal obligations.",
            features: ["PDPA Compliance", "Vendor Due Diligence", "Legal Spend Analytics", "Audit Trail Tracking"]
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50">
            <BusinessHeader transparent={false} />

            <main className="pt-20">
                {/* Hero Section */}
                <section className="bg-[#002f4b] py-24 text-white">
                    <div className="container mx-auto px-4 text-center">
                        <FadeIn>
                            <h1 className="text-4xl md:text-5xl font-bold mb-6 font-headline">Comprehensive Legal Solutions</h1>
                            <p className="text-blue-100/60 text-lg max-w-2xl mx-auto">
                                We combine professional legal expertise with modern technology to deliver faster, more efficient legal operations for your business.
                            </p>
                        </FadeIn>
                    </div>
                </section>

                {/* Services Detailed Grid */}
                <section className="py-24">
                    <div className="container mx-auto px-4">
                        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                            {services.map((service, i) => (
                                <FadeIn key={i} delay={i * 0.1}>
                                    <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl transition-all h-full flex flex-col group hover:border-blue-500/20">
                                        <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-[#002f4b] mb-8 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                                            <service.icon className="w-8 h-8" />
                                        </div>
                                        <h3 className="text-2xl font-bold mb-4 font-headline text-slate-900">{service.title}</h3>
                                        <p className="text-slate-500 mb-8 leading-relaxed font-light">{service.desc}</p>

                                        <div className="mt-auto space-y-3">
                                            {service.features.map((feature, idx) => (
                                                <div key={idx} className="flex items-center gap-3 text-sm text-slate-700 font-medium">
                                                    <div className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                                                        <Zap className="w-3 h-3 text-blue-600" />
                                                    </div>
                                                    {feature}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </FadeIn>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Integration Section CTA */}
                <section className="py-24 bg-slate-900 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/10 to-transparent"></div>
                    <div className="container mx-auto px-4 relative z-10 text-center">
                        <FadeIn>
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 font-headline">Ready to automate your legal workflow?</h2>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                                <Link href="/contact">
                                    <Button className="bg-blue-600 hover:bg-blue-500 text-white rounded-2xl px-10 h-14 font-bold text-lg shadow-xl shadow-blue-500/20">
                                        Schedule a Demo
                                    </Button>
                                </Link>
                                <Link href="/experts">
                                    <Button variant="ghost" className="text-blue-100 hover:text-white hover:bg-white/10 rounded-2xl px-10 h-14 font-bold text-lg">
                                        Browse Lawyers <ArrowRight className="w-5 h-5 ml-2" />
                                    </Button>
                                </Link>
                            </div>
                        </FadeIn>
                    </div>
                </section>
            </main>

            <BusinessFooter />
        </div>
    );
}
