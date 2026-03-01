'use client';
export const runtime = 'edge';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Building2, Zap, ShieldCheck, ArrowRight, Sparkles, Boxes, Workflow, Database, Network, BarChart3, Rocket, Calculator, Users, Search, LogIn, LayoutDashboard, Menu, LogOut, X, FileText, CreditCard, CalendarDays, Puzzle, Bot, Banknote } from 'lucide-react';
import { FadeIn } from '@/components/fade-in';
import { SmeContactForm } from '@/components/sme-contact-form';
import { Link } from '@/navigation';
import { useUser } from '@/firebase';
import { usePathname } from 'next/navigation';
import { getMainLink, getBusinessLink } from '@/lib/domain-utils';
import Logo from '@/components/logo';
import { BusinessFooter } from '@/components/layout/business-footer';
import { BusinessHeader } from '@/components/layout/business-header';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useTranslations } from 'next-intl';

export default function B2BLandingPage() {
    const { user, isUserLoading } = useUser();
    const pathname = usePathname();
    const locale = pathname.split('/')[1] || 'th';
    const t = useTranslations('B2BLanding');

    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
    const getPrice = (priceStr: string) => {
        if (!priceStr || priceStr === 'Custom' || priceStr === 'กำหนดเอง') return priceStr;
        const numStr = priceStr.replace(/[^0-9]/g, '');
        if (!numStr) return priceStr;
        const monthly = parseInt(numStr, 10);
        const yearly = Math.round(monthly * 12 * 0.8);
        return billingCycle === 'monthly' ? `฿${monthly.toLocaleString()}` : `฿${yearly.toLocaleString()}`;
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Business Header */}
            <BusinessHeader transparent={true} />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-slate-900">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-500/20 blur-[120px] rounded-full"></div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <FadeIn direction="up">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-500/10 border border-blue-500/20 text-blue-400 text-sm font-semibold mb-8">
                                <Sparkles className="w-4 h-4" />
                                {t('hero.badge')}
                            </div>
                            <h1 className="text-4xl md:text-7xl font-bold text-white mb-6 font-headline tracking-tight leading-tight">
                                {t('hero.title1')} <span className="text-blue-500 block md:inline">{t('hero.title2')}</span>
                            </h1>
                            <p className="text-blue-100/60 text-lg md:text-2xl mb-10 font-light leading-relaxed">
                                {t('hero.subtitle')}
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Link href={user ? "/overview" : "/login"} className="w-full sm:w-auto">
                                    <Button size="lg" className="bg-blue-600 hover:bg-blue-500 text-white rounded-2xl px-10 h-16 text-lg font-bold gap-3 shadow-2xl shadow-blue-500/20 transition-all group w-full">
                                        {t('pricing.starter.btn')}
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                                <Link href="#contact" className="w-full sm:w-auto">
                                    <Button size="lg" variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10 rounded-2xl px-10 h-16 text-lg font-semibold w-full">
                                        {t('cta.btn')}
                                    </Button>
                                </Link>
                            </div>
                        </FadeIn>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl md:text-5xl font-bold mb-6 font-headline">{t('features.title')}</h2>
                        <p className="text-slate-500 text-lg max-w-2xl mx-auto">{t('features.subtitle')}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <Card className="rounded-3xl border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                            <CardContent className="pt-10 p-8">
                                <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-[#002f4b] mb-6 group-hover:scale-110 transition-transform">
                                    <Calculator className="w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-bold mb-4">{t('features.tax.title')}</h3>
                                <p className="text-slate-500 leading-relaxed">{t('features.tax.desc')}</p>
                            </CardContent>
                        </Card>

                        <Card className="rounded-3xl border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                            <CardContent className="pt-10 p-8">
                                <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-6 group-hover:scale-110 transition-transform">
                                    <Database className="w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-bold mb-4">{t('features.templates.title')}</h3>
                                <p className="text-slate-500 leading-relaxed">{t('features.templates.desc')}</p>
                            </CardContent>
                        </Card>

                        <Card className="rounded-3xl border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                            <CardContent className="pt-10 p-8">
                                <div className="w-16 h-16 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 mb-6 group-hover:scale-110 transition-transform">
                                    <Users className="w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-bold mb-4">{t('features.lawyer.title')}</h3>
                                <p className="text-slate-500 leading-relaxed">{t('features.lawyer.desc')}</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Legal OS Modules - Odoo Style */}
            <section className="py-24 bg-slate-900 relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-slate-500/10 blur-[120px] rounded-full"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-500/10 border border-blue-500/20 text-blue-400 text-sm font-semibold mb-6">
                            <Boxes className="w-4 h-4" />
                            {t('modules.badge')}
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 font-headline">
                            {t('modules.title1')}<br /><span className="text-blue-400">{t('modules.title2')}</span>
                        </h2>
                        <p className="text-blue-100/60 text-lg max-w-2xl mx-auto">
                            {t('modules.subtitle')}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                        {[
                            { icon: FileText, name: t('modules.items.clm'), badge: 'Core', color: 'bg-blue-500/20 text-blue-400' },
                            { icon: ShieldCheck, name: t('modules.items.vault'), badge: 'Core', color: 'bg-emerald-500/20 text-emerald-400' },
                            { icon: CreditCard, name: t('modules.items.finance'), badge: 'Core', color: 'bg-blue-500/20 text-blue-400' },
                            { icon: CalendarDays, name: t('modules.items.calendar'), badge: 'Core', color: 'bg-rose-500/20 text-rose-400' },
                            { icon: Bot, name: t('modules.items.workflow'), badge: 'AI', color: 'bg-violet-500/20 text-violet-400' },
                            { icon: Search, name: t('modules.items.dd'), badge: 'NEW', color: 'bg-blue-500/20 text-blue-400' },
                            { icon: Banknote, name: t('modules.items.budget'), badge: 'PRO', color: 'bg-amber-500/20 text-amber-400' },
                            { icon: Puzzle, name: t('modules.items.api'), badge: 'API', color: 'bg-blue-500/20 text-blue-400' },
                        ].map((mod, i) => (
                            <FadeIn key={i} direction="up" delay={i * 50}>
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 hover:border-blue-500/30 transition-all cursor-pointer group flex flex-col items-center">
                                    <div className={`mb-4 flex items-center justify-center w-12 h-12 rounded-xl transition-all group-hover:scale-110 ${mod.color}`}>
                                        <mod.icon className="w-6 h-6 text-white" />
                                    </div>
                                    <p className="text-sm font-medium text-white mb-3">{mod.name}</p>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${mod.badge === 'AI' ? 'bg-violet-500/20 text-violet-400' :
                                        mod.badge === 'NEW' ? 'bg-emerald-500/20 text-emerald-400' :
                                            mod.badge === 'PRO' ? 'bg-amber-500/20 text-amber-400' :
                                                mod.badge === 'API' ? 'bg-blue-500/20 text-blue-400' :
                                                    'bg-white/10 text-white/60'
                                        }`}>{mod.badge}</span>
                                </div>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>

            {/* Cross-Department Integration */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider mb-6">
                            <Network className="w-4 h-4" />
                            {t('integration.badge')}
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold mb-6 font-headline">
                            {t('integration.title1')}<span className="text-[#002f4b]">{t('integration.title2')}</span>{t('integration.title3')}
                        </h2>
                        <p className="text-slate-500 text-lg max-w-2xl mx-auto">
                            {t('integration.subtitle')}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
                        {[
                            { dept: t('integration.departments.sales.dept'), flow: t('integration.departments.sales.flow'), icon: Rocket, color: 'bg-slate-100 text-[#002f4b]' },
                            { dept: t('integration.departments.accounting.dept'), flow: t('integration.departments.accounting.flow'), icon: Calculator, color: 'bg-slate-100 text-[#002f4b]' },
                            { dept: t('integration.departments.hr.dept'), flow: t('integration.departments.hr.flow'), icon: Users, color: 'bg-slate-100 text-[#002f4b]' },
                            { dept: t('integration.departments.executive.dept'), flow: t('integration.departments.executive.flow'), icon: BarChart3, color: 'bg-slate-100 text-[#002f4b]' },
                        ].map((item, i) => (
                            <FadeIn key={i} direction="up" delay={i * 100}>
                                <Card className="rounded-3xl border-slate-100 shadow-sm hover:shadow-xl transition-all h-full">
                                    <CardContent className="pt-8 p-6">
                                        <div className={`w-14 h-14 rounded-2xl ${item.color} flex items-center justify-center mb-5`}>
                                            <item.icon className="w-7 h-7" />
                                        </div>
                                        <h3 className="text-lg font-bold mb-2">{item.dept}</h3>
                                        <p className="text-slate-500 text-sm leading-relaxed">{item.flow}</p>
                                    </CardContent>
                                </Card>
                            </FadeIn>
                        ))}
                    </div>

                    {/* Business Value */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-4xl mx-auto">
                        {[
                            { label: t('integration.values.speed.label'), value: t('integration.values.speed.value'), desc: t('integration.values.speed.desc'), icon: Zap, color: 'text-[#002f4b]' },
                            { label: t('integration.values.accuracy.label'), value: t('integration.values.accuracy.value'), desc: t('integration.values.accuracy.desc'), icon: ShieldCheck, color: 'text-[#002f4b]' },
                            { label: t('integration.values.transparency.label'), value: t('integration.values.transparency.value'), desc: t('integration.values.transparency.desc'), icon: Building2, color: 'text-[#002f4b]' },
                        ].map((val, i) => (
                            <div key={i} className="text-center p-6">
                                <val.icon className={`w-8 h-8 ${val.color} mx-auto mb-3`} />
                                <p className="text-2xl font-bold mb-1">{val.value}</p>
                                <p className="text-sm font-semibold text-slate-800 mb-1">{val.label}</p>
                                <p className="text-xs text-slate-500">{val.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section className="py-24 bg-slate-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold mb-6 font-headline">{t('pricing.title')}</h2>
                        <p className="text-slate-500 text-lg max-w-2xl mx-auto mb-8">{t('pricing.subtitle')}</p>
                        <div className="inline-flex bg-slate-200/50 p-1.5 rounded-2xl">
                            <button
                                onClick={() => setBillingCycle('monthly')}
                                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${billingCycle === 'monthly' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                รายเดือน
                            </button>
                            <button
                                onClick={() => setBillingCycle('yearly')}
                                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${billingCycle === 'yearly' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                รายปี <span className="text-emerald-500 ml-1">ประหยัด 20%</span>
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                        {/* Lite */}
                        <Card className="rounded-3xl border-slate-200 hover:border-blue-200 transition-all hover:shadow-lg">
                            <CardHeader className="p-8 pb-4">
                                <CardTitle className="text-xl font-bold">{t('pricing.lite.title')}</CardTitle>
                                <CardDescription className="text-slate-500 mb-4">{t('pricing.lite.desc')}</CardDescription>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-4xl font-bold">{getPrice(t('pricing.lite.price'))}</span>
                                    {t('pricing.lite.price') !== 'Custom' && t('pricing.lite.price') !== 'กำหนดเอง' && (
                                        <span className="text-slate-400">{billingCycle === 'monthly' ? t('pricing.perMonth') : '/ปี'}</span>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="p-8 pt-4 space-y-4">
                                <div className="h-px bg-slate-100" />
                                <ul className="space-y-4 text-sm text-slate-600">
                                    <li className="flex items-center gap-3"><CheckCircle className="w-4 h-4 text-blue-500" /> {t('pricing.lite.f1')}</li>
                                    <li className="flex items-center gap-3"><CheckCircle className="w-4 h-4 text-blue-500" /> {t('pricing.lite.f2')}</li>
                                    <li className="flex items-center gap-3"><CheckCircle className="w-4 h-4 text-blue-500" /> {t('pricing.lite.f3')}</li>
                                    <li className="flex items-center gap-3"><CheckCircle className="w-4 h-4 text-blue-500" /> {t('pricing.lite.f4')}</li>
                                    <li className="flex items-center gap-3"><CheckCircle className="w-4 h-4 text-blue-500" /> {t('pricing.lite.f5')}</li>
                                </ul>
                                <Link href={`/subscribe?plan=Lite`}>
                                    <Button className="w-full h-12 rounded-xl mt-6 font-bold" variant="outline">{t('pricing.lite.btn')}</Button>
                                </Link>
                            </CardContent>
                        </Card>

                        {/* Starter */}
                        <Card className="rounded-3xl border-slate-200 hover:border-blue-200 transition-all hover:shadow-lg">
                            <CardHeader className="p-8 pb-4">
                                <CardTitle className="text-xl font-bold">{t('pricing.starter.title')}</CardTitle>
                                <CardDescription className="text-slate-500 mb-4">{t('pricing.starter.desc')}</CardDescription>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-4xl font-bold">{getPrice(t('pricing.starter.price'))}</span>
                                    {t('pricing.starter.price') !== 'Custom' && t('pricing.starter.price') !== 'กำหนดเอง' && (
                                        <span className="text-slate-400">{billingCycle === 'monthly' ? t('pricing.perMonth') : '/ปี'}</span>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="p-8 pt-4 space-y-4">
                                <div className="h-px bg-slate-100" />
                                <ul className="space-y-4 text-sm text-slate-600">
                                    <li className="flex items-center gap-3"><CheckCircle className="w-4 h-4 text-blue-500" /> {t('pricing.starter.f1')}</li>
                                    <li className="flex items-center gap-3"><CheckCircle className="w-4 h-4 text-blue-500" /> {t('pricing.starter.f2')}</li>
                                    <li className="flex items-center gap-3"><CheckCircle className="w-4 h-4 text-blue-500" /> {t('pricing.starter.f3')}</li>
                                    <li className="flex items-center gap-3"><CheckCircle className="w-4 h-4 text-blue-500" /> {t('pricing.starter.f4')}</li>
                                    <li className="flex items-center gap-3"><CheckCircle className="w-4 h-4 text-blue-500" /> {t('pricing.starter.f5')}</li>
                                </ul>
                                <Link href={`/subscribe?plan=Starter`}>
                                    <Button className="w-full h-12 rounded-xl mt-6 font-bold" variant="outline">{t('pricing.starter.btn')}</Button>
                                </Link>
                            </CardContent>
                        </Card>

                        {/* Professional */}
                        <Card className="rounded-3xl border-blue-500 shadow-2xl shadow-blue-500/10 relative overflow-hidden transform hover:scale-[1.02] transition-all">
                            <div className="absolute top-0 right-0 bg-blue-500 text-white text-[10px] font-bold px-4 py-1.5 uppercase tracking-widest rounded-bl-xl leading-none">
                                {t('pricing.professional.badge')}
                            </div>
                            <CardHeader className="p-8 pb-4">
                                <CardTitle className="text-xl font-bold">{t('pricing.professional.title')}</CardTitle>
                                <CardDescription className="text-slate-500 mb-4">{t('pricing.professional.desc')}</CardDescription>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-4xl font-bold text-[#002f4b]">{getPrice(t('pricing.professional.price'))}</span>
                                    {t('pricing.professional.price') !== 'Custom' && t('pricing.professional.price') !== 'กำหนดเอง' && (
                                        <span className="text-slate-400">{billingCycle === 'monthly' ? t('pricing.perMonth') : '/ปี'}</span>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="p-8 pt-4 space-y-4">
                                <div className="h-px bg-slate-100" />
                                <ul className="space-y-4 text-sm text-slate-600">
                                    <li className="flex items-center gap-3"><CheckCircle className="w-4 h-4 text-blue-500" /> {t('pricing.professional.f1')}</li>
                                    <li className="flex items-center gap-3"><CheckCircle className="w-4 h-4 text-blue-500" /> {t('pricing.professional.f2')}</li>
                                    <li className="flex items-center gap-3"><CheckCircle className="w-4 h-4 text-blue-500" /> {t('pricing.professional.f3')}</li>
                                    <li className="flex items-center gap-3"><CheckCircle className="w-4 h-4 text-blue-500" /> {t('pricing.professional.f4')}</li>
                                    <li className="flex items-center gap-3"><CheckCircle className="w-4 h-4 text-blue-500" /> {t('pricing.professional.f5')}</li>
                                    <li className="flex items-center gap-3"><CheckCircle className="w-4 h-4 text-blue-500" /> {t('pricing.professional.f6')}</li>
                                </ul>
                                <Link href={`/subscribe?plan=Professional`}>
                                    <Button className="w-full h-12 rounded-xl mt-6 font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20 transition-all">{t('pricing.professional.btn')}</Button>
                                </Link>
                            </CardContent>
                        </Card>

                        {/* Business */}
                        <Card className="rounded-3xl border-slate-200 hover:border-blue-200 transition-all hover:shadow-lg">
                            <CardHeader className="p-8 pb-4">
                                <CardTitle className="text-xl font-bold">{t('pricing.business.title')}</CardTitle>
                                <CardDescription className="text-slate-500 mb-4">{t('pricing.business.desc')}</CardDescription>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-4xl font-bold">{getPrice(t('pricing.business.price'))}</span>
                                    {t('pricing.business.price') !== 'Custom' && t('pricing.business.price') !== 'กำหนดเอง' && (
                                        <span className="text-slate-400">{billingCycle === 'monthly' ? t('pricing.perMonth') : '/ปี'}</span>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="p-8 pt-4 space-y-4">
                                <div className="h-px bg-slate-100" />
                                <ul className="space-y-4 text-sm text-slate-600">
                                    <li className="flex items-center gap-3"><CheckCircle className="w-4 h-4 text-blue-500" /> {t('pricing.business.f1')}</li>
                                    <li className="flex items-center gap-3"><CheckCircle className="w-4 h-4 text-blue-500" /> {t('pricing.business.f2')}</li>
                                    <li className="flex items-center gap-3"><CheckCircle className="w-4 h-4 text-blue-500" /> {t('pricing.business.f3')}</li>
                                    <li className="flex items-center gap-3"><CheckCircle className="w-4 h-4 text-blue-500" /> {t('pricing.business.f4')}</li>
                                    <li className="flex items-center gap-3"><CheckCircle className="w-4 h-4 text-blue-500" /> {t('pricing.business.f5')}</li>
                                    <li className="flex items-center gap-3"><CheckCircle className="w-4 h-4 text-blue-500" /> {t('pricing.business.f6')}</li>
                                </ul>
                                <Link href={`/subscribe?plan=Business`}>
                                    <Button className="w-full h-12 rounded-xl mt-6 font-bold" variant="outline">{t('pricing.business.btn')}</Button>
                                </Link>
                            </CardContent>
                        </Card>

                        {/* Elite */}
                        <Card className="rounded-3xl border-slate-200 hover:border-blue-200 transition-all hover:shadow-lg">
                            <CardHeader className="p-8 pb-4">
                                <CardTitle className="text-xl font-bold">{t('pricing.elite.title')}</CardTitle>
                                <CardDescription className="text-slate-500 mb-4">{t('pricing.elite.desc')}</CardDescription>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-4xl font-bold">{getPrice(t('pricing.elite.price'))}</span>
                                    {t('pricing.elite.price') !== 'Custom' && t('pricing.elite.price') !== 'กำหนดเอง' && (
                                        <span className="text-slate-400">{billingCycle === 'monthly' ? t('pricing.perMonth') : '/ปี'}</span>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="p-8 pt-4 space-y-4">
                                <div className="h-px bg-slate-100" />
                                <ul className="space-y-4 text-sm text-slate-600">
                                    <li className="flex items-center gap-3"><CheckCircle className="w-4 h-4 text-blue-500" /> {t('pricing.elite.f1')}</li>
                                    <li className="flex items-center gap-3"><CheckCircle className="w-4 h-4 text-blue-500" /> {t('pricing.elite.f2')}</li>
                                    <li className="flex items-center gap-3"><CheckCircle className="w-4 h-4 text-blue-500" /> {t('pricing.elite.f3')}</li>
                                    <li className="flex items-center gap-3"><CheckCircle className="w-4 h-4 text-blue-500" /> {t('pricing.elite.f4')}</li>
                                    <li className="flex items-center gap-3"><CheckCircle className="w-4 h-4 text-blue-500" /> {t('pricing.elite.f5')}</li>
                                    <li className="flex items-center gap-3"><CheckCircle className="w-4 h-4 text-blue-500" /> {t('pricing.elite.f6')}</li>
                                </ul>
                                <Link href={`/subscribe?plan=Elite`}>
                                    <Button className="w-full h-12 rounded-xl mt-6 font-bold" variant="outline">{t('pricing.elite.btn')}</Button>
                                </Link>
                            </CardContent>
                        </Card>

                        {/* Enterprise */}
                        <Card className="rounded-3xl border-slate-200 hover:border-blue-200 transition-all hover:shadow-lg">
                            <CardHeader className="p-8 pb-4">
                                <CardTitle className="text-xl font-bold">{t('pricing.enterprise.title')}</CardTitle>
                                <CardDescription className="text-slate-500 mb-4">{t('pricing.enterprise.desc')}</CardDescription>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-4xl font-bold">{t('pricing.enterprise.price')}</span>
                                </div>
                            </CardHeader>
                            <CardContent className="p-8 pt-4 space-y-4">
                                <div className="h-px bg-slate-100" />
                                <ul className="space-y-4 text-sm text-slate-600">
                                    <li className="flex items-center gap-3"><CheckCircle className="w-4 h-4 text-blue-500" /> {t('pricing.enterprise.f1')}</li>
                                    <li className="flex items-center gap-3"><CheckCircle className="w-4 h-4 text-blue-500" /> {t('pricing.enterprise.f2')}</li>
                                    <li className="flex items-center gap-3"><CheckCircle className="w-4 h-4 text-blue-500" /> {t('pricing.enterprise.f3')}</li>
                                    <li className="flex items-center gap-3"><CheckCircle className="w-4 h-4 text-blue-500" /> {t('pricing.enterprise.f4')}</li>
                                    <li className="flex items-center gap-3"><CheckCircle className="w-4 h-4 text-blue-500" /> {t('pricing.enterprise.f5')}</li>
                                    <li className="flex items-center gap-3"><CheckCircle className="w-4 h-4 text-blue-500" /> {t('pricing.enterprise.f6')}</li>
                                </ul>
                                <Link href="#contact">
                                    <Button className="w-full h-12 rounded-xl mt-6 font-bold" variant="outline">{t('pricing.enterprise.btn')}</Button>
                                </Link>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Contact Form Section */}
            <section id="contact" className="py-24 bg-white">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-20 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider mb-6">
                                {t('contact.badge')}
                            </div>
                            <h2 className="text-3xl md:text-5xl font-bold mb-6 font-headline leading-tight">
                                {t('contact.title1')} <span className="text-[#002f4b]">{t('contact.title2')}</span>
                            </h2>
                            <p className="text-slate-500 text-lg mb-10 leading-relaxed font-light">
                                {t('contact.subtitle')}
                            </p>

                            <div className="space-y-8">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-[#002f4b] flex-shrink-0">
                                        <ShieldCheck className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold mb-1">{t('contact.f2.title')}</h4>
                                        <p className="text-slate-500 text-sm leading-relaxed">{t('contact.f2.desc')}</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center text-green-600 flex-shrink-0">
                                        <BarChart3 className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold mb-1">{t('contact.f1.title')}</h4>
                                        <p className="text-slate-500 text-sm leading-relaxed">{t('contact.f1.desc')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-50 p-8 md:p-12 rounded-[40px] border border-slate-100 shadow-sm relative">
                            <div className="absolute -top-6 -right-6 w-24 h-24 bg-slate-500/10 blur-3xl rounded-full"></div>
                            <SmeContactForm />
                        </div>
                    </div>
                </div>
            </section>

            <BusinessFooter />
        </div>
    );
}
