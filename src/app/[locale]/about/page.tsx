'use client';
export const runtime = 'edge';

import React from 'react';
import { BusinessHeader } from '@/components/layout/business-header';
import { BusinessFooter } from '@/components/layout/business-footer';
import { FadeIn } from '@/components/fade-in';
import { ShieldCheck, Target, Users, Award, Rocket, CheckCircle2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function AboutPage() {
    const t = useTranslations('B2BLanding');

    return (
        <div className="min-h-screen bg-slate-50">
            <BusinessHeader transparent={false} />

            <main className="pt-20">
                {/* Hero section */}
                <section className="relative py-24 bg-slate-900 overflow-hidden">
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-600/10 skew-x-12 translate-x-1/2"></div>
                    <div className="container mx-auto px-4 relative z-10 text-center">
                        <FadeIn>
                            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 font-headline">
                                Empowering Business through <br />
                                <span className="text-blue-400">Legal Innovation</span>
                            </h1>
                            <p className="text-blue-100/60 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
                                Lawslane is building the legal operating system for modern enterprises. We bridge the gap between complex legal requirements and efficient business operations.
                            </p>
                        </FadeIn>
                    </div>
                </section>

                {/* Vision & Mission */}
                <section className="py-24 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="grid md:grid-cols-2 gap-12 lg:gap-24">
                            <FadeIn direction="left">
                                <div className="space-y-6">
                                    <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                                        <Rocket className="w-6 h-6" />
                                    </div>
                                    <h2 className="text-3xl font-bold font-headline text-slate-900">Our Vision</h2>
                                    <p className="text-slate-600 leading-relaxed text-lg font-light">
                                        To be the standard infrastructure for legal management in Southeast Asia, where every company can handle legal matters with the same speed and confidence as their sales or tech operations.
                                    </p>
                                </div>
                            </FadeIn>

                            <FadeIn direction="right">
                                <div className="space-y-6">
                                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                                        <Target className="w-6 h-6" />
                                    </div>
                                    <h2 className="text-3xl font-bold font-headline text-slate-900">Our Mission</h2>
                                    <p className="text-slate-600 leading-relaxed text-lg font-light">
                                        To simplify law through technology. We provide accessible, transparent, and proactive legal solutions that protect businesses while accelerating their growth.
                                    </p>
                                </div>
                            </FadeIn>
                        </div>
                    </div>
                </section>

                {/* Core Values */}
                <section className="py-24 bg-slate-50">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold font-headline text-slate-900 mb-4">Our Core Values</h2>
                            <p className="text-slate-500">The principles that guide our product and our team.</p>
                        </div>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[
                                { icon: ShieldCheck, title: "Trust First", desc: "Security and confidentiality are at the core of everything we do." },
                                { icon: Users, title: "Proactive Partnership", desc: "We don't just solve problems; we help you prevent them." },
                                { icon: Award, title: "Legal Excellence", desc: "Combining deep legal expertise with cutting-edge AI." },
                                { icon: CheckCircle2, title: "Radical Simplicity", desc: "Making complex legal processes intuitive and easy." }
                            ].map((value, i) => (
                                <FadeIn key={i} delay={i * 0.1}>
                                    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all h-full">
                                        <value.icon className="w-10 h-10 text-blue-600 mb-6" />
                                        <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                                        <p className="text-slate-500 text-sm leading-relaxed">{value.desc}</p>
                                    </div>
                                </FadeIn>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            <BusinessFooter />
        </div>
    );
}
