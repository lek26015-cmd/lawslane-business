'use client';

import React, { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Bot, Loader2, AlertTriangle, ShieldCheck, FileSearch, Trash2, ClipboardCopy, Sparkles } from 'lucide-react';
import { reviewContract } from '@/ai/flows/contract-review-flow';
import ReactMarkdown from 'react-markdown';
import { useToast } from '@/hooks/use-toast';

export default function ContractReviewPage() {
    const t = useTranslations('B2BSidebar');
    const locale = useLocale();
    const { toast } = useToast();
    const [contractText, setContractText] = useState('');
    const [loading, setLoading] = useState(false);
    const [analysis, setAnalysis] = useState<string | null>(null);

    const handleReview = async () => {
        if (!contractText.trim()) return;
        setLoading(true);
        try {
            const result = await reviewContract(contractText, locale);
            setAnalysis(result);
        } catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: "Failed to analyze contract. Please try again.",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    const clearText = () => {
        setContractText('');
        setAnalysis(null);
    };

    return (
        <div className="p-6 md:p-8 space-y-6 max-w-[1400px] mx-auto min-h-screen">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight text-[#002f4b] flex items-center gap-3">
                        <Sparkles className="w-8 h-8 text-emerald-500" />
                        {t('contractReview')}
                    </h1>
                    <p className="text-muted-foreground">
                        {locale === 'th' 
                            ? "วิเคราะห์ความเสี่ยง จุดที่ควรแก้ไข และสรุปสาระสำคัญด้วย AI" 
                            : "Analyze risks, highlight clauses to edit, and summarize key points with AI."}
                    </p>
                </div>
                {contractText && (
                    <Button variant="ghost" size="sm" onClick={clearText} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                        <Trash2 className="w-4 h-4 mr-2" />
                        {locale === 'th' ? "ล้างข้อมูล" : "Clear All"}
                    </Button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Input Section */}
                <Card className="rounded-2xl shadow-sm border-none ring-1 ring-slate-200 dark:ring-slate-800 flex flex-col h-[700px]">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 bg-slate-50/50 dark:bg-slate-900/50 rounded-t-2xl">
                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                            <FileSearch className="w-4 h-4 text-blue-500" />
                            {locale === 'th' ? "เนื้อหาสัญญา" : "Contract Content"}
                        </CardTitle>
                        <Button variant="ghost" size="icon" onClick={() => {
                            navigator.clipboard.readText().then(setContractText);
                        }}>
                            <ClipboardCopy className="w-4 h-4" />
                        </Button>
                    </CardHeader>
                    <CardContent className="flex-1 p-0 overflow-hidden">
                        <Textarea 
                            placeholder={locale === 'th' ? "วางเนื้อหาสัญญาที่นี่..." : "Paste contract text here..."}
                            className="w-full h-full p-6 text-base resize-none border-none focus-visible:ring-0 rounded-none bg-transparent"
                            value={contractText}
                            onChange={(e) => setContractText(e.target.value)}
                        />
                    </CardContent>
                    <div className="p-4 border-t bg-slate-50/50 dark:bg-slate-900/50 rounded-b-2xl">
                        <Button 
                            className="w-full h-12 rounded-xl bg-[#002f4b] hover:bg-[#00466c] text-white font-bold"
                            disabled={loading || !contractText.trim()}
                            onClick={handleReview}
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Bot className="w-5 h-5 mr-2" />}
                            {locale === 'th' ? "เริ่มการตรวจสอบด้วย AI" : "Review with AI"}
                        </Button>
                    </div>
                </Card>

                {/* Analysis Section */}
                <Card className="rounded-2xl shadow-xl border-none ring-1 ring-emerald-100 dark:ring-emerald-900/30 flex flex-col h-[700px] overflow-hidden bg-white dark:bg-slate-900">
                    <CardHeader className="bg-emerald-50/50 dark:bg-emerald-900/10 border-b">
                        <CardTitle className="text-base font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5" />
                            {locale === 'th' ? "ผลการวิเคราะห์โดย AI" : "AI Legal Analysis"}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                        {!analysis && !loading && (
                            <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-50">
                                <div className="p-4 rounded-full bg-slate-100 dark:bg-slate-800">
                                    <Bot className="w-12 h-12 text-slate-400" />
                                </div>
                                <p className="text-slate-500 max-w-[250px]">
                                    {locale === 'th' 
                                        ? "วางเนื้อหาสัญญาและกดปุ่มเพื่อเริ่มการวิเคราะห์" 
                                        : "Paste contract text and click the button to start analysis."}
                                </p>
                            </div>
                        )}

                        {loading && (
                            <div className="flex flex-col items-center justify-center h-full space-y-4">
                                <Loader2 className="w-10 h-10 animate-spin text-emerald-500" />
                                <div className="space-y-2 text-center">
                                    <p className="font-semibold text-emerald-600">
                                        {locale === 'th' ? "กำลังประมวลผล..." : "Analyzing contract..."}
                                    </p>
                                    <p className="text-xs text-muted-foreground animate-pulse">
                                        {locale === 'th' ? "อาจใช้เวลา 10-30 วินาที ขึ้นอยู่กับความยาวของสัญญา" : "May take 10-30 seconds depending on text length."}
                                    </p>
                                </div>
                            </div>
                        )}

                        {analysis && !loading && (
                            <div className="prose dark:prose-invert max-w-none animate-in fade-in duration-500">
                                <ReactMarkdown>{analysis}</ReactMarkdown>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
