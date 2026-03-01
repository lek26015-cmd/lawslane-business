'use client';

import React from 'react';
import { Link } from '@/navigation';
import Logo from '@/components/logo';
import { Mail, Phone, MessageSquare, Linkedin, Twitter, Facebook } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function BusinessFooter() {
    const t = useTranslations('B2BLanding');
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-slate-900 text-slate-300 py-16">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
                    <div className="space-y-6">
                        <Logo href="/" variant="white" className="scale-125 mb-4" subtitle="legal os" />
                        <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
                            {t('hero.badge') || "Lawslane for Business"} -
                            Empowering modern enterprises with proactive legal solutions and seamless contract management.
                        </p>
                        <div className="flex items-center gap-4">
                            <Link href="#" className="hover:text-blue-400 transition-colors"><Facebook className="w-5 h-5" /></Link>
                            <Link href="#" className="hover:text-blue-400 transition-colors"><Twitter className="w-5 h-5" /></Link>
                            <Link href="#" className="hover:text-blue-400 transition-colors"><Linkedin className="w-5 h-5" /></Link>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6">{t('footer.company.title')}</h4>
                        <ul className="space-y-4 text-sm">
                            <li><Link href="/about" className="hover:text-white transition-colors">{t('footer.company.about')}</Link></li>
                            <li><Link href="/services" className="hover:text-white transition-colors">{t('footer.company.services')}</Link></li>
                            <li><Link href="/experts" className="hover:text-white transition-colors">{t('footer.company.lawyers')}</Link></li>
                            <li><Link href="/contact" className="hover:text-white transition-colors">{t('footer.company.contact')}</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6">Contact</h4>
                        <ul className="space-y-4 text-sm">
                            <li className="flex items-center gap-3">
                                <Mail className="w-4 h-4 text-blue-400" />
                                <span>noreply@lawslane.com</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="w-4 h-4 text-blue-400" />
                                <span>097-227-5494</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <MessageSquare className="w-4 h-4 text-blue-400" />
                                <span>@lawslane_biz</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
                    <p>© {currentYear} Lawslane (Thailand) Co., Ltd. All rights reserved.</p>
                    <div className="flex items-center gap-6">
                        <Link href="/privacy" className="hover:text-slate-300">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-slate-300">Terms of Service</Link>
                        <Link href="/cookies" className="hover:text-slate-300">Cookie Policy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
