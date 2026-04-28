'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
    Database, 
    Zap, 
    FileJson, 
    CheckCircle2, 
    Clock, 
    RefreshCcw, 
    Activity,
    Search,
    AlertCircle
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { retrieveDocuments } from '@/lib/rag';

export default function RAGStatusPage() {
    const t = useTranslations('B2BSidebar');
    const locale = useLocale();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [searching, setSearching] = useState(false);

    const stats = [
        { label: 'Total Vectors', value: '1,240', icon: Database, color: 'text-blue-500' },
        { label: 'Latency', value: '45ms', icon: Zap, color: 'text-amber-500' },
        { label: 'Indexing Status', value: 'Healthy', icon: CheckCircle2, color: 'text-emerald-500' },
        { label: 'Last Update', value: '10m ago', icon: Clock, color: 'text-slate-500' },
    ];

    const handleDebugSearch = async () => {
        if (!searchQuery.trim()) return;
        setSearching(true);
        try {
            const docs = await retrieveDocuments(searchQuery);
            setSearchResults(docs);
        } catch (error) {
            console.error(error);
        } finally {
            setSearching(false);
        }
    };

    return (
        <div className="p-6 md:p-8 space-y-8 max-w-[1400px] mx-auto min-h-screen">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                        <Activity className="w-8 h-8 text-blue-600" />
                        {t('ragStatus')}
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        System health and document indexing status for Legal RAG.
                    </p>
                </div>
                <Badge variant="outline" className="px-3 py-1 bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400">
                    System Operational
                </Badge>
            </div>

            {/* Stats Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                    <Card key={i} className="rounded-2xl border shadow-sm">
                        <CardContent className="p-6 flex items-center gap-4">
                            <div className={`${stat.color} bg-background p-3 rounded-xl ring-1 ring-slate-100 dark:ring-slate-800`}>
                                <stat.icon className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                                <p className="text-xl font-bold">{stat.value}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* RAG Explorer (Debug View) */}
                <Card className="lg:col-span-2 rounded-2xl shadow-sm border overflow-hidden">
                    <CardHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b">
                        <CardTitle className="text-lg flex items-center gap-2">
                             <Search className="w-4 h-4" />
                             RAG Index Explorer
                        </CardTitle>
                        <CardDescription>Search directly into the vector database to see raw matches.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                        <div className="flex gap-2">
                            <Input 
                                placeholder="Enter technical query or keywords..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="rounded-xl"
                                onKeyDown={(e) => e.key === 'Enter' && handleDebugSearch()}
                            />
                            <Button className="rounded-xl bg-[#002f4b]" onClick={handleDebugSearch} disabled={searching}>
                                {searching ? <RefreshCcw className="w-4 h-4 animate-spin" /> : "Verify Index"}
                            </Button>
                        </div>

                        <div className="space-y-3">
                            {searchResults.length > 0 ? (
                                searchResults.map((res, idx) => (
                                    <div key={idx} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border text-xs font-mono space-y-2">
                                        <div className="flex justify-between items-center text-blue-600 dark:text-blue-400">
                                            <span>Source: {res.source}</span>
                                            <Badge variant="secondary" className="text-[9px]">Score: {res.score.toFixed(4)}</Badge>
                                        </div>
                                        <p className="line-clamp-3 text-slate-600 dark:text-slate-300">
                                            {res.content}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <div className="py-12 text-center text-muted-foreground text-sm border-2 border-dashed rounded-2xl">
                                    No queries executed yet. Search above to verify vector retrieval.
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* System Info */}
                <div className="space-y-6">
                    <Card className="rounded-2xl border shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-sm flex items-center gap-2">
                                <FileJson className="w-4 h-4 text-orange-500" />
                                Model Pipeline
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm">
                            <div className="flex justify-between items-center pb-2 border-b">
                                <span className="text-muted-foreground">Embedding</span>
                                <span className="font-medium">text-embedding-004</span>
                            </div>
                            <div className="flex justify-between items-center pb-2 border-b">
                                <span className="text-muted-foreground">Vector Store</span>
                                <span className="font-medium">Cloudflare Vectorize</span>
                            </div>
                            <div className="flex justify-between items-center pb-2 border-b">
                                <span className="text-muted-foreground">LLM</span>
                                <span className="font-medium">Gemini 1.5 Flash</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Reranker</span>
                                <span className="font-medium">Disabled</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-2xl border shadow-sm bg-blue-50/30 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/20">
                        <CardHeader>
                            <CardTitle className="text-sm flex items-center gap-2 text-blue-700 dark:text-blue-400">
                                <AlertCircle className="w-4 h-4" />
                                Administrator Note
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-xs text-blue-600 dark:text-blue-300 leading-relaxed">
                            This RAG status page is for internal monitoring and transparency. Document ingestion is handled via the Lawslane Ingestion Pipeline. If you see high latency, please check the Cloudflare Worker logs.
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
