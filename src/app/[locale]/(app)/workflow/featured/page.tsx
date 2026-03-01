'use client';
export const runtime = 'edge';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    Blocks,
    ArrowRight,
    ArrowLeft,
    TrendingUp,
    CreditCard,
    SearchCheck,
    CheckCircle2,
    Bot,
    Sparkles,
    Zap,
    Settings2,
    Layers,
    ShieldCheck,
} from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

export default function FeaturedWorkflowsPage() {
    const t = useTranslations('B2BSidebar');
    const { toast } = useToast();
    const router = useRouter();
    const [selectedWf, setSelectedWf] = useState<any>(null);
    const [isConfiguring, setIsConfiguring] = useState(false);

    const featuredWorkflows = [
        {
            id: 'sales-contract',
            title: 'ฝ่ายขาย → สัญญา',
            desc: 'เชื่อมระบบ CRM เพื่อดึงข้อมูลลูกค้าและปิดดีล นำมาร่างสัญญาอัตโนมัติโดยที่เซลส์ไม่ต้องคีย์ซ้ำ',
            icon: TrendingUp,
            color: 'linear-gradient(135deg, #002f4b, #00466c)',
            stats: '47 สัญญา/เดือน',
            steps: ['ดึงข้อมูลจาก CRM', 'AI วิเคราะห์ข้อมูล', 'ร่างสัญญาอัตโนมัติ', 'ส่ง e-Sign'],
            requirements: ['เชื่อมต่อ Salesforce หรือ HubSpot', 'เทมเพลตสัญญา NDA/Sales'],
        },
        {
            id: 'finance-invoice',
            title: 'การเงิน → Invoice',
            desc: 'เชื่อมระบบ ERP หรือโปรแกรมบัญชี ทันทีที่สัญญาถูกเซ็นครบ ระบบจะแจ้งเตือนให้ออกใบแจ้งหนี้อัตโนมัติ',
            icon: CreditCard,
            color: 'linear-gradient(135deg, #003d5c, #00567a)',
            stats: '฿2.4M/เดือน',
            steps: ['ตรวจสวิตาสการเซ็น', 'ดึงข้อมูลการเงิน', 'เจนเนอเรท Invoice', 'ส่งไปยังระบบบัญชี'],
            requirements: ['เชื่อมต่อ SAP หรือ QuickBooks', 'ตั้งค่าเลขที่เอกสาร'],
        },
        {
            id: 'hr-vc',
            title: 'HR/จัดซื้อ → ตรวจสอบคู่ค้า',
            desc: 'เชื่อมระบบ Vendor Management เพื่อตรวจสอบประวัติบริษัท รับรายงานความเสี่ยงก่อนเซ็นสัญญาจ้าง',
            icon: SearchCheck,
            color: 'linear-gradient(135deg, #004a6f, #00678d)',
            stats: '34 คู่ค้า',
            steps: ['รับข้อมูล Vendor', 'ตรวจเช็ค Blacklist', 'ประเมินความเสี่ยง AI', 'ส่งผลให้ผู้บริหาร'],
            requirements: ['เชื่อมต่อระบบจัดซื้อ', 'ตั้งค่าเกณฑ์ความเสี่ยง'],
        },
    ];

    const handleConnect = () => {
        setIsConfiguring(true);
        // Simulate connection
        setTimeout(() => {
            const saved = localStorage.getItem('lawslane_workflows');
            const workflows = saved ? JSON.parse(saved) : [];

            // Add the new workflow if it doesn't exist
            if (!workflows.find((w: any) => w.id === selectedWf.id)) {
                workflows.push({
                    id: selectedWf.id,
                    name: selectedWf.title,
                    desc: selectedWf.desc,
                    status: 'active',
                    steps: selectedWf.steps,
                    currentStep: 0,
                    runs: 0
                });
                localStorage.setItem('lawslane_workflows', JSON.stringify(workflows));
            }

            setIsConfiguring(false);
            setSelectedWf(null);
            toast({
                title: 'เริ่มต้นติดตั้งสำเร็จ!',
                description: `Workflow "${selectedWf.title}" ถูกเพิ่มไปยังรายการของคุณแล้ว`,
            });
            router.push('/workflow');
        }, 1500);
    };

    return (
        <div className="p-6 md:p-8 space-y-8 max-w-[1400px] mx-auto">
            {/* Header */}
            <div className="flex flex-col gap-4">
                <Link href="/workflow">
                    <Button variant="ghost" className="w-fit p-0 hover:bg-transparent text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="w-4 h-4 mr-2" /> กลับไปหน้า Workflow
                    </Button>
                </Link>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
                            แม่แบบ Workflow แนะนำ
                            <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400 text-xs">
                                <Sparkles className="w-3 h-3 mr-1" /> Featured Templates
                            </Badge>
                        </h1>
                        <p className="text-muted-foreground mt-1">เริ่มต้นใช้งานอย่างรวดเร็วด้วยแม่แบบที่ออกแบบมาเพื่อธุรกิจแต่ละแผนก</p>
                    </div>
                </div>
            </div>

            {/* Featured Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {featuredWorkflows.map((wf, i) => (
                    <div key={i} onClick={() => setSelectedWf(wf)}>
                        <Card className="rounded-2xl border shadow-sm hover:shadow-xl transition-all cursor-pointer group h-full hover:-translate-y-1 duration-300">
                            <CardContent className="p-6 flex flex-col h-full">
                                <div className="p-3 rounded-xl shadow-lg inline-flex mb-4 w-fit" style={{ background: wf.color }}>
                                    <wf.icon className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-[#002f4b] dark:group-hover:text-blue-400 transition-colors">{wf.title}</h3>
                                <p className="text-sm text-muted-foreground mb-6 flex-grow">{wf.desc}</p>
                                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                                    <span className="text-sm font-semibold text-[#002f4b] dark:text-blue-400">{wf.stats}</span>
                                    <div className="flex items-center text-xs font-bold text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                                        ตั้งค่าแม่แบบ <ArrowRight className="w-4 h-4 ml-1" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                ))}
            </div>

            {/* Why use templates section */}
            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-3xl p-8 border border-slate-200/60 dark:border-slate-800/60 mt-8">
                <div className="max-w-3xl">
                    <h2 className="text-xl font-bold text-foreground mb-4">ทำไมต้องใช้ Workflow อัตโนมัติ?</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="flex gap-4">
                            <div className="shrink-0 w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                <Zap className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-sm mb-1">ลดงาน Manual</h4>
                                <p className="text-xs text-muted-foreground leading-relaxed">ไม่ต้องพิมพ์ข้อมูลซ้ำซ้อน ลดความผิดพลาดจากการทำงานด้วยมือ</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="shrink-0 w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                                <CheckCircle2 className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-sm mb-1">ได้มาตรฐาน</h4>
                                <p className="text-xs text-muted-foreground leading-relaxed">ทุกกระบวนการทำงานเป็นไปตามนโยบายบริษัทเสมอ</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Dialog open={!!selectedWf} onOpenChange={(open) => !open && setSelectedWf(null)}>
                <DialogContent className="sm:max-w-[600px] gap-0 p-0 overflow-hidden border-none rounded-3xl">
                    <DialogHeader className="sr-only">
                        <DialogTitle>{selectedWf?.title}</DialogTitle>
                        <DialogDescription>{selectedWf?.desc}</DialogDescription>
                    </DialogHeader>
                    {selectedWf && (
                        <>
                            <div className="p-8 pb-6" style={{ background: selectedWf.color }}>
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-3 rounded-2xl bg-white/20 backdrop-blur-sm shadow-xl">
                                        <selectedWf.icon className="w-8 h-8 text-white" />
                                    </div>
                                    <Badge variant="outline" className="text-white border-white/40 bg-white/10 backdrop-blur-sm">
                                        Professional Template
                                    </Badge>
                                </div>
                                <h2 className="text-2xl font-bold text-white mb-2">{selectedWf.title}</h2>
                                <p className="text-white/80 text-sm leading-relaxed max-w-md">{selectedWf.desc}</p>
                            </div>

                            <div className="p-8 space-y-8 bg-card">
                                {/* Workflow Steps */}
                                <div>
                                    <h4 className="text-sm font-bold flex items-center gap-2 mb-4 text-foreground">
                                        <Layers className="w-4 h-4 text-blue-500" /> ขั้นตอนการทำงาน (Workflow Loops)
                                    </h4>
                                    <div className="space-y-3">
                                        {selectedWf.steps.map((step: string, idx: number) => (
                                            <div key={idx} className="flex items-center gap-4 group">
                                                <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold shrink-0 border group-hover:border-blue-500 group-hover:text-blue-500 transition-colors">
                                                    {idx + 1}
                                                </div>
                                                <div className="flex-1 h-px bg-muted group-hover:bg-blue-200 transition-colors hidden sm:block"></div>
                                                <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors font-medium">{step}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Requirements */}
                                <div className="p-4 rounded-2xl bg-muted/30 border border-muted-foreground/10">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                                        <ShieldCheck className="w-3.5 h-3.5" /> สิ่งที่ต้องเตรียมพร้อม
                                    </h4>
                                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {selectedWf.requirements.map((req: string, idx: number) => (
                                            <li key={idx} className="text-xs text-muted-foreground flex items-center gap-2">
                                                <div className="w-1 h-1 rounded-full bg-blue-400 shrink-0"></div>
                                                {req}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <DialogFooter className="pt-2">
                                    <Button variant="ghost" onClick={() => setSelectedWf(null)} disabled={isConfiguring} className="rounded-xl">
                                        ยกเลิก
                                    </Button>
                                    <Button
                                        onClick={handleConnect}
                                        disabled={isConfiguring}
                                        className="rounded-xl bg-[#002f4b] hover:bg-[#001f35] text-white px-8 gap-2 shadow-lg"
                                    >
                                        {isConfiguring ? (
                                            <>
                                                <Bot className="w-4 h-4 animate-spin" /> กำลังติดตั้ง...
                                            </>
                                        ) : (
                                            <>
                                                <Settings2 className="w-4 h-4" /> เริ่มต้นติดตั้ง Workflow นี้
                                            </>
                                        )}
                                    </Button>
                                </DialogFooter>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
