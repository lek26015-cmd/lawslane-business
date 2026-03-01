'use client';
export const runtime = 'edge';

import React from 'react';
import { BusinessHeader } from '@/components/layout/business-header';
import { BusinessFooter } from '@/components/layout/business-footer';
import { FadeIn } from '@/components/fade-in';
import { useTranslations } from 'next-intl';
import { SmeContactForm } from '@/components/sme-contact-form';
import { Mail, Phone, MessageSquare, MapPin, ShieldCheck, BarChart3, Clock } from 'lucide-react';

export default function ContactSalesPage() {
    const t = useTranslations('B2BLanding');

    return (
        <div className="min-h-screen bg-slate-50">
            <BusinessHeader transparent={false} />

            <main className="pt-20">
                {/* Hero Section */}
                <section className="bg-slate-900 py-24 text-white overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-600/10 blur-3xl rounded-full translate-x-1/2"></div>
                    <div className="container mx-auto px-4 relative z-10">
                        <div className="max-w-3xl">
                            <FadeIn>
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold uppercase tracking-wider mb-6 border border-blue-500/20">
                                    Contact Sales
                                </div>
                                <h1 className="text-4xl md:text-6xl font-bold mb-6 font-headline">
                                    Ready to modernize your <br />
                                    <span className="text-blue-400">Legal Operations?</span>
                                </h1>
                                <p className="text-blue-100/60 text-lg leading-relaxed">
                                    Schedule a personalized demo, ask about our enterprise plans, or discuss how Lawslane can integrate with your existing business systems.
                                </p>
                            </FadeIn>
                        </div>
                    </div>
                </section>

                <section className="py-24 -mt-16 relative z-20">
                    <div className="container mx-auto px-4">
                        <div className="grid lg:grid-cols-12 gap-12 items-start">
                            {/* Contact Info */}
                            <div className="lg:col-span-5 space-y-8">
                                <FadeIn direction="left">
                                    <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm space-y-10">
                                        <div className="space-y-6">
                                            <h2 className="text-2xl font-bold font-headline text-slate-900">Direct Contact</h2>
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-4 text-slate-600 hover:text-blue-600 transition-colors cursor-pointer group">
                                                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-blue-50">
                                                        <Mail className="w-5 h-5 text-slate-400 group-hover:text-blue-600" />
                                                    </div>
                                                    <span className="font-medium">noreply@lawslane.com</span>
                                                </div>
                                                <div className="flex items-center gap-4 text-slate-600 hover:text-blue-600 transition-colors cursor-pointer group">
                                                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-blue-50">
                                                        <Phone className="w-5 h-5 text-slate-400 group-hover:text-blue-600" />
                                                    </div>
                                                    <span className="font-medium">097-227-5494</span>
                                                </div>
                                                <div className="flex items-center gap-4 text-slate-600 hover:text-blue-600 transition-colors cursor-pointer group">
                                                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-blue-50">
                                                        <MessageSquare className="w-5 h-5 text-slate-400 group-hover:text-blue-600" />
                                                    </div>
                                                    <span className="font-medium">@lawslane_biz (Line/WhatsApp)</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <h2 className="text-2xl font-bold font-headline text-slate-900">Why talk to us?</h2>
                                            <div className="space-y-6">
                                                <div className="flex gap-4">
                                                    <ShieldCheck className="w-6 h-6 text-blue-600 shrink-0" />
                                                    <div>
                                                        <h4 className="font-bold text-slate-900">Pdpa & Security Audit</h4>
                                                        <p className="text-slate-500 text-sm leading-relaxed">Ensure your document storage meets international compliance standards.</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-4">
                                                    <BarChart3 className="w-6 h-6 text-emerald-600 shrink-0" />
                                                    <div>
                                                        <h4 className="font-bold text-slate-900">ROI Assessment</h4>
                                                        <p className="text-slate-500 text-sm leading-relaxed">Calculate potential time and cost savings for your specific legal workflows.</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-4">
                                                    <Clock className="w-6 h-6 text-amber-600 shrink-0" />
                                                    <div>
                                                        <h4 className="font-bold text-slate-900">2-Hour Response</h4>
                                                        <p className="text-slate-500 text-sm leading-relaxed">Enterprise inquiries receive priority with a guaranteed response within 2 business hours.</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </FadeIn>
                            </div>

                            {/* Form */}
                            <div className="lg:col-span-7">
                                <FadeIn direction="right">
                                    <div className="bg-white p-8 md:p-12 rounded-[40px] border border-slate-100 shadow-xl relative overflow-hidden">
                                        <div className="absolute -top-12 -right-12 w-48 h-48 bg-blue-500/5 blur-3xl rounded-full"></div>
                                        <div className="relative z-10">
                                            <div className="mb-10 text-center lg:text-left">
                                                <h3 className="text-3xl font-bold font-headline text-slate-900 mb-2">Send us a message</h3>
                                                <p className="text-slate-500 uppercase text-xs font-bold tracking-widest">Our experts will get back to you shortly</p>
                                            </div>
                                            <SmeContactForm />
                                        </div>
                                    </div>
                                </FadeIn>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <BusinessFooter />
        </div>
    );
}
