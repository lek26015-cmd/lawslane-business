'use client';

import React, { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Loader2, BookOpen, ExternalLink, Scale, Gavel, FileText } from 'lucide-react';
import { searchLaws } from '@/ai/flows/law-search-flow';
import ReactMarkdown from 'react-markdown';

export default function LawSearchPage() {
    const t = useTranslations('B2BSidebar');
    const locale = useLocale();
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<{ answer: string; sources: any[] } | null>(null);

    const handleSearch = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        try {
            const data = await searchLaws(query, locale);
            setResult(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const suggestions = [
        locale === 'th' ? "การจดทะเบียนบริษัทต้องใช้ทุนเท่าไหร่" : "Minimum capital for company registration",
        locale === 'th' ? "ข้อปฏิบัติของนายจ้างเมื่อเลิกจ้างพนักงาน" : "Employer obligations upon termination",
        locale === 'th' ? "การทำสัญญาเช่าอสังหาริมทรัพย์เกิน 3 ปี" : "Lease agreement for more than 3 years",
    ];

    return (
        <div className="p-6 md:p-8 space-y-8 max-w-[1200px] mx-auto min-h-screen">
            <div className="text-center space-y-4 py-10">
                <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-violet-100 dark:bg-violet-500/15 text-violet-600 dark:text-violet-400 mb-2">
                    <Scale className="w-8 h-8" />
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400">
                    {t('lawSearch')}
                </h1>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    {locale === 'th' 
                        ? "สืบค้นข้อกฎหมายและระเบียบปฏิบัติอย่างแม่นยำด้วยระบบ Semantic Search อ้างอิงแหล่งข้อมูลจริง" 
                        : "Accurately search for laws and regulations using Semantic Search with real source citations."}
                </p>
                
                <form onSubmit={handleSearch} className="relative max-w-3xl mx-auto mt-8 flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                            className="w-full pl-12 pr-4 h-14 text-lg rounded-2xl border-2 focus-visible:ring-violet-500 transition-all shadow-sm"
                            placeholder={locale === 'th' ? "ลองพิมพ์: สิทธิหน้าที่ของผู้เช่า..." : "Search e.g. Tenant rights..."}
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </div>
                    <Button 
                        disabled={loading || !query.trim()}
                        className="h-14 px-8 rounded-2xl text-white font-bold text-lg transition-transform active:scale-95 shadow-lg bg-[#002f4b] hover:bg-[#00466c]"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : locale === 'th' ? "ค้นหา" : "Search"}
                    </Button>
                </form>

                <div className="flex flex-wrap justify-center gap-2 mt-4">
                    {suggestions.map((s, i) => (
                        <Button 
                            key={i} 
                            variant="outline" 
                            size="sm" 
                            className="rounded-full text-xs bg-slate-50 dark:bg-slate-900 border-slate-200"
                            onClick={() => { setQuery(s); handleSearch(); }}
                        >
                            {s}
                        </Button>
                    ))}
                </div>
            </div>

            {loading && (
                <div className="flex flex-col items-center justify-center space-y-4 py-20">
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin"></div>
                        <Bot className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-violet-600" />
                    </div>
                    <p className="text-lg font-medium animate-pulse text-violet-600">
                        {locale === 'th' ? "กำลังค้นหาและสรุปข้อมูลให้คุณ..." : "Searching and summarizing for you..."}
                    </p>
                </div>
            )}

            {result && !loading && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-5 duration-500">
                    {/* Main Summary */}
                    <Card className="lg:col-span-2 rounded-3xl overflow-hidden border-none shadow-xl bg-white dark:bg-slate-900">
                        <CardHeader className="bg-slate-50 dark:bg-slate-800/50 border-b">
                            <CardTitle className="flex items-center gap-2 text-xl">
                                <Gavel className="w-5 h-5 text-violet-600" />
                                {locale === 'th' ? "สรุปผลการสืบค้น" : "Search Summary"}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 prose dark:prose-invert max-w-none">
                            <ReactMarkdown>{result.answer}</ReactMarkdown>
                        </CardContent>
                    </Card>

                    {/* Sources */}
                    <div className="space-y-4">
                        <h3 className="font-bold text-lg flex items-center gap-2 px-2">
                             <BookOpen className="w-5 h-5 text-blue-500" />
                             {locale === 'th' ? "แหล่งข้อมูลที่เกี่ยวข้อง" : "Related Sources"}
                        </h3>
                        {result.sources.length > 0 ? (
                            result.sources.map((source, idx) => (
                                <Card key={idx} className="rounded-2xl hover:border-blue-400 transition-colors cursor-pointer group shadow-sm">
                                    <CardContent className="p-4 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-xl text-blue-600">
                                                <FileText className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold truncate max-w-[180px]">{source.source}</p>
                                                <p className="text-[10px] text-muted-foreground">Confidence: {(source.score * 100).toFixed(1)}%</p>
                                            </div>
                                        </div>
                                        <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-blue-500 transition-colors" />
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            <p className="text-sm text-muted-foreground px-2">
                                {locale === 'th' ? "ไม่มีข้อมูลอ้างอิง" : "No citation sources found."}
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
