'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useTranslations } from 'next-intl';
import { useToast } from '@/hooks/use-toast';
import {
    Workflow as WorkflowIcon,
    Play,
    Pause,
    CheckCircle2,
    Plus,
    ArrowRight,
    Bot,
    Sparkles,
    Zap,
    Loader2,
    History,
    Settings2,
    Terminal,
    Activity,
    Database,
    ShieldCheck,
    FileSearch,
    Cpu,
} from 'lucide-react';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetFooter,
} from '@/components/ui/sheet';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';

interface WorkflowInstance {
    id: string;
    name: string;
    desc: string;
    status: 'active' | 'paused';
    steps: string[];
    currentStep: number;
    runs: number;
    isRunning?: boolean;
    progress?: number;
    autoRun?: boolean;
    notifyOnSuccess?: boolean;
    frequency?: 'instant' | 'daily' | 'weekly';
    terminalLogs?: string[];
}

interface WorkflowRun {
    id: string;
    workflowId: string;
    workflowName: string;
    status: 'success' | 'failed';
    timestamp: string;
    resultDoc?: string;
    resultLink?: string;
    logs: string[];
    technicalReport?: {
        duration: string;
        dataProcessed: string;
        confidence: string;
    };
}

export default function WorkflowPage() {
    const t = useTranslations('B2BSidebar');
    const { toast } = useToast();
    const [workflows, setWorkflows] = useState<WorkflowInstance[]>([]);
    const [history, setHistory] = useState<WorkflowRun[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [editingWorkflow, setEditingWorkflow] = useState<WorkflowInstance | null>(null);
    const [selectedRun, setSelectedRun] = useState<WorkflowRun | null>(null);

    useEffect(() => {
        // Mock initial data or load from localStorage
        const saved = localStorage.getItem('lawslane_workflows');
        if (saved) {
            setWorkflows(JSON.parse(saved));
        } else {
            const initial: WorkflowInstance[] = [
                {
                    id: 'sales-contract',
                    name: 'ฝ่ายขาย → สัญญา',
                    desc: 'เชื่อมระบบ CRM เพื่อดึงข้อมูลลูกค้าและปิดดีล นำมาร่างสัญญาอัตโนมัติโดยที่เซลส์ไม่ต้องคีย์ซ้ำ',
                    status: 'active',
                    steps: ['ดึงข้อมูลจาก CRM', 'AI วิเคราะห์ข้อมูล', 'ร่างสัญญาอัตโนมัติ', 'ส่ง e-Sign'],
                    currentStep: 4,
                    runs: 47,
                },
                {
                    id: 'finance-invoice',
                    name: 'การเงิน → Invoice',
                    desc: 'เชื่อมระบบ ERP หรือโปรแกรมบัญชี ทันทีที่สัญญาถูกเซ็นครบ ระบบจะแจ้งเตือนให้ออกใบแจ้งหนี้อัตโนมัติ',
                    status: 'active',
                    steps: ['ตรวจสถานะการเซ็น', 'ดึงข้อมูลการเงิน', 'เจนเนอเรท Invoice', 'ส่งไปยังระบบบัญชี'],
                    currentStep: 4,
                    runs: 156,
                },
                {
                    id: 'hr-vc',
                    name: 'HR/จัดซื้อ → ตรวจสอบคู่ค้า',
                    desc: 'เชื่อมระบบ Vendor Management เพื่อตรวจสอบประวัติบริษัท รับรายงานความเสี่ยงก่อนเซ็นสัญญาจ้าง',
                    status: 'paused',
                    steps: ['รับข้อมูล Vendor', 'ตรวจเช็ค Blacklist', 'ประเมินความเสี่ยง AI', 'ส่งผลให้ผู้บริหาร'],
                    currentStep: 0,
                    runs: 23,
                },
            ];
            setWorkflows(initial);
            localStorage.setItem('lawslane_workflows', JSON.stringify(initial));
        }

        // Load History
        const savedHistory = localStorage.getItem('lawslane_wf_history');
        if (savedHistory) {
            setHistory(JSON.parse(savedHistory));
        }

        setIsLoading(false);
    }, []);

    const getStepIcon = (step: string) => {
        const s = step.toLowerCase();
        if (s.includes('crm') || s.includes('database') || s.includes('เชื่อมต่อ')) return <Database className="w-3 h-3" />;
        if (s.includes('ai') || s.includes('วิเคราะห์')) return <Cpu className="w-3 h-3" />;
        if (s.includes('สัญญา') || s.includes('invoice') || s.includes('ร่าง') || s.includes('สร้าง')) return <FileSearch className="w-3 h-3" />;
        if (s.includes('sign') || s.includes('ส่ง') || s.includes('ตรวจสอบ')) return <ShieldCheck className="w-3 h-3" />;
        return <Activity className="w-3 h-3" />;
    };

    const runWorkflow = (id: string) => {
        const wf = workflows.find(w => w.id === id);
        if (!wf || wf.isRunning || wf.status === 'paused') return;

        // Technical log samples
        const techLogs = [
            "Initializing secure bridge...",
            "Syncing CRM data...",
            "AI Analyzing payload...",
            "Generating secure PDF...",
            "Verifying audit trail...",
            "Pushing to cloud storage..."
        ];

        // Reset progress and start
        setWorkflows(prev => prev.map(w =>
            w.id === id ? {
                ...w,
                isRunning: true,
                progress: 0,
                currentStep: 0,
                terminalLogs: [`[SYS] Initializing "${w.name}" execution engine...`]
            } : w
        ));

        let progressValue = 0;
        const totalSteps = wf.steps.length || 1;
        const stepSize = 100 / totalSteps;

        const interval = setInterval(() => {
            progressValue += 5;

            if (progressValue >= 100) {
                clearInterval(interval);

                // Final State Update
                setWorkflows(prev => {
                    const updated = prev.map(w => {
                        if (w.id === id) {
                            return {
                                ...w,
                                isRunning: false,
                                progress: 100,
                                currentStep: totalSteps,
                                runs: w.runs + 1,
                                terminalLogs: [...(w.terminalLogs || []), `[SYS] Execution completed successfully at ${new Date().toLocaleTimeString()}.`]
                            };
                        }
                        return w;
                    });
                    // Persist workflow state (runs count)
                    localStorage.setItem('lawslane_workflows', JSON.stringify(updated));
                    return updated;
                });

                // Side Effect: Add to History with technical report
                const newRun: WorkflowRun = {
                    id: `run-${Date.now()}`,
                    workflowId: wf.id,
                    workflowName: wf.name,
                    status: 'success',
                    timestamp: new Date().toISOString(),
                    resultDoc: wf.id === 'sales-contract' ? 'NDA_Contract_Final.pdf' : wf.id === 'finance-invoice' ? 'Invoice_INV-2024.pdf' : 'Due_Diligence_Report.pdf',
                    resultLink: wf.id === 'sales-contract' ? '/vault' : wf.id === 'finance-invoice' ? '/billing' : '/due-diligence',
                    logs: [
                        `[SYS] Process ID: ${Math.floor(Math.random() * 100000)}`,
                        `[AUTH] API Key verified for Lawlanes-Core`,
                        ...wf.steps.map(s => `[EXEC] Module "${s}" executed successfully`),
                        `[SYS] Assets deployed to Cloud Storage`,
                        `[SYS] Final handshake complete.`
                    ],
                    technicalReport: {
                        duration: '2.84s',
                        dataProcessed: `${(Math.random() * 2 + 0.5).toFixed(2)}MB`,
                        confidence: `${(Math.random() * 5 + 95).toFixed(1)}%`
                    }
                };

                setHistory(prevH => {
                    const updatedH = [newRun, ...prevH].slice(0, 10);
                    localStorage.setItem('lawslane_wf_history', JSON.stringify(updatedH));
                    return updatedH;
                });

                toast({
                    title: 'Workflow สำเร็จ!',
                    description: `รัน "${wf.name}" เรียบร้อยแล้ว`,
                });
            } else {
                // Progress Update with live log streaming
                setWorkflows(prev => prev.map(w => {
                    if (w.id === id) {
                        const calculatedStep = Math.floor(progressValue / stepSize);
                        const currentLogArray = w.terminalLogs || [];

                        // Add a log every 20%
                        const shouldAddLog = progressValue % 20 === 0;
                        const logIndex = (progressValue / 20) % techLogs.length;
                        const newLogs = shouldAddLog
                            ? [...currentLogArray, `[LOG] ${techLogs[logIndex]}`]
                            : currentLogArray;

                        return {
                            ...w,
                            progress: progressValue,
                            currentStep: Math.min(calculatedStep, totalSteps - 1),
                            terminalLogs: newLogs
                        };
                    }
                    return w;
                }));
            }
        }, 150);
    };

    const handleSaveSettings = () => {
        if (!editingWorkflow) return;

        setWorkflows(prev => {
            const updated = prev.map(wf => wf.id === editingWorkflow.id ? editingWorkflow : wf);
            localStorage.setItem('lawslane_workflows', JSON.stringify(updated));
            return updated;
        });

        setIsSettingsOpen(false);
        toast({
            title: 'บันทึกการตั้งค่าแล้ว',
            description: `อัปเดตไฟล์กำหนดค่าสำหรับ "${editingWorkflow.name}" เรียบร้อย`,
        });
    };

    if (isLoading) return null;

    return (
        <div className="p-6 md:p-8 space-y-8 max-w-[1400px] mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
                        {t('workflow')}
                        <Badge className="bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-400 text-xs">
                            <Bot className="w-3 h-3 mr-1" /> AI-Powered
                        </Badge>
                    </h1>
                    <p className="text-muted-foreground mt-1">ออกแบบและเรียกใช้ Workflow อัตโนมัติด้วย AI สำหรับงานกฎหมาย</p>
                </div>
                <div className="flex items-center gap-3">
                    <Link href="/workflow/featured">
                        <Button variant="outline" className="rounded-xl gap-2 border-slate-200 dark:border-slate-800 shadow-sm">
                            <Sparkles className="w-4 h-4 text-amber-500" /> สำรวจแม่แบบ
                        </Button>
                    </Link>
                    <Link href="/workflow/new">
                        <Button
                            className="text-white rounded-xl gap-2 shadow-lg"
                            style={{ background: 'linear-gradient(135deg, #002f4b, #00466c)' }}
                        >
                            <Plus className="w-4 h-4" /> สร้าง Workflow ใหม่
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left: Workflows list (2/3) */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <Card className="rounded-2xl border shadow-sm hover:shadow-md transition-all">
                            <CardContent className="p-5 flex items-center gap-4">
                                <div className="p-3 rounded-xl shadow-lg" style={{ background: 'linear-gradient(135deg, #004a6f, #00678d)' }}>
                                    <WorkflowIcon className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-foreground">{workflows.length}</p>
                                    <p className="text-sm text-muted-foreground">Workflow ทั้งหมด</p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="rounded-2xl border shadow-sm hover:shadow-md transition-all">
                            <CardContent className="p-5 flex items-center gap-4">
                                <div className="p-3 rounded-xl shadow-lg" style={{ background: 'linear-gradient(135deg, #003d5c, #00567a)' }}>
                                    <Play className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-foreground">{workflows.filter(w => w.status === 'active').length}</p>
                                    <p className="text-sm text-muted-foreground">ทำงานอยู่</p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="rounded-2xl border shadow-sm hover:shadow-md transition-all">
                            <CardContent className="p-5 flex items-center gap-4">
                                <div className="p-3 rounded-xl shadow-lg" style={{ background: 'linear-gradient(135deg, #002742, #004561)' }}>
                                    <Zap className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-foreground">240 ชม.</p>
                                    <p className="text-sm text-muted-foreground">ประหยัดเวลา</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-lg font-bold flex items-center gap-2 text-foreground">
                            <HistoryIcon className="w-5 h-5 text-blue-500" /> รายการ Automation ของคุณ
                        </h2>
                        {workflows.map((wf) => (
                            <Card key={wf.id} className={`rounded-2xl border shadow-sm transition-all overflow-hidden ${wf.isRunning ? 'ring-2 ring-blue-500 bg-blue-50/30 dark:bg-blue-900/10' : ''}`}>
                                <CardContent className="p-6">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <h3 className="text-base font-bold text-foreground">
                                                    {wf.name}
                                                </h3>
                                                {wf.status === 'active' ? (
                                                    <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20 text-[10px]">
                                                        {wf.isRunning ? <Loader2 className="w-2.5 h-2.5 mr-0.5 animate-spin" /> : <Play className="w-2.5 h-2.5 mr-0.5" />}
                                                        {wf.isRunning ? 'กำลังทำงาน...' : 'ทำงานอยู่'}
                                                    </Badge>
                                                ) : (
                                                    <Badge className="bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-500/20 text-[10px]">
                                                        <Pause className="w-2.5 h-2.5 mr-0.5" /> หยุดชั่วคราว
                                                    </Badge>
                                                )}
                                            </div>
                                            <p className="text-sm text-muted-foreground">{wf.desc}</p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <p className="text-xs font-bold text-foreground">{wf.runs} ครั้ง</p>
                                                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">จำนวนการรัน</p>
                                            </div>
                                            <Button
                                                size="sm"
                                                onClick={() => runWorkflow(wf.id)}
                                                disabled={wf.isRunning || wf.status === 'paused'}
                                                className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white border-none shadow-md disabled:opacity-50"
                                            >
                                                {wf.isRunning ? 'กำลังรัน...' : 'รันเดี๋ยวนี้'}
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="rounded-lg text-muted-foreground hover:bg-slate-100 dark:hover:bg-slate-800"
                                                onClick={() => {
                                                    setEditingWorkflow({
                                                        ...wf,
                                                        autoRun: wf.autoRun ?? false,
                                                        notifyOnSuccess: wf.notifyOnSuccess ?? true,
                                                    });
                                                    setIsSettingsOpen(true);
                                                }}
                                            >
                                                <Settings2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Progress bar when running */}
                                    {wf.isRunning && (
                                        <div className="mb-6 space-y-2">
                                            <div className="flex justify-between text-[10px] font-bold text-blue-600 dark:text-blue-400 mb-1">
                                                <span>AUTOMATION PROGRESS</span>
                                                <span>{wf.progress}%</span>
                                            </div>
                                            <Progress value={wf.progress} className="h-1.5 bg-blue-100 dark:bg-blue-900/30" indicatorClassName="bg-blue-600" />
                                        </div>
                                    )}

                                    {/* Terminal Console when running */}
                                    {wf.isRunning && wf.terminalLogs && (
                                        <div className="mb-6 p-3 rounded-lg bg-slate-900 border border-slate-800 font-mono text-[10px] text-blue-400/90 shadow-inner overflow-hidden">
                                            <div className="flex items-center gap-2 mb-2 pb-1 border-b border-white/5 opacity-50">
                                                <Terminal className="w-3 h-3" />
                                                <span className="uppercase tracking-widest text-[9px]">Live Execution Terminal</span>
                                            </div>
                                            <div className="space-y-1 max-h-[100px] overflow-y-auto">
                                                {wf.terminalLogs.map((log, i) => (
                                                    <div key={i} className="flex gap-2">
                                                        <span className="opacity-30">{i + 1}</span>
                                                        <span className={log.startsWith('[SYS]') ? 'text-blue-300' : 'text-emerald-400'}>{log}</span>
                                                    </div>
                                                ))}
                                                <div className="animate-pulse">_</div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Workflow Steps Visual */}
                                    <div className="flex items-center gap-1 flex-wrap">
                                        {wf.steps.map((step, j) => (
                                            <React.Fragment key={j}>
                                                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 ${j < wf.currentStep
                                                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20'
                                                    : j === wf.currentStep
                                                        ? 'bg-blue-600 text-white shadow-lg scale-105 border-none animate-pulse'
                                                        : 'bg-muted/50 text-muted-foreground border border-transparent'
                                                    }`}>
                                                    {j < wf.currentStep ? (
                                                        getStepIcon(step)
                                                    ) : j === wf.currentStep ? (
                                                        <Loader2 className="w-3 h-3 animate-spin" />
                                                    ) : getStepIcon(step)}
                                                    {step}
                                                </div>
                                                {j < wf.steps.length - 1 && (
                                                    <ArrowRight className={`w-3.5 h-3.5 shrink-0 ${j < wf.currentStep ? 'text-emerald-400' : 'text-muted-foreground/30'}`} />
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Right: History (1/3) */}
                <div className="space-y-6">
                    <Card className="rounded-2xl border shadow-sm bg-slate-50/50 dark:bg-slate-900/20">
                        <CardHeader className="p-6 border-b">
                            <CardTitle className="text-sm font-bold flex items-center gap-2 text-foreground">
                                <HistoryIcon className="w-4 h-4 text-[#002f4b] dark:text-blue-400" />
                                ประวัติการรันล่าสุด
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            {history.length > 0 ? (
                                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {history.map((run) => (
                                        <div key={run.id} className="p-4 space-y-3 hover:bg-slate-100/50 dark:hover:bg-slate-800/30 transition-colors">
                                            <div className="flex justify-between items-start cursor-pointer" onClick={() => setSelectedRun(run)}>
                                                <div>
                                                    <p className="text-xs font-bold text-foreground truncate max-w-[150px]">{run.workflowName}</p>
                                                    <p className="text-[10px] text-muted-foreground">{new Date(run.timestamp).toLocaleString('th-TH', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</p>
                                                </div>
                                                <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 text-[10px] py-0 h-5 border-none">Success</Badge>
                                            </div>

                                            {run.resultDoc && (
                                                <Link href={run.resultLink || '#'}>
                                                    <div className="flex items-center gap-2 p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-400 transition-all group">
                                                        <div className="w-8 h-8 rounded-md bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 shrink-0">
                                                            <FileTextIcon className="w-4 h-4" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-[10px] font-bold text-foreground truncate">{run.resultDoc}</p>
                                                            <p className="text-[9px] text-muted-foreground">คลิกเพื่อเปิดในคลังเอกสาร</p>
                                                        </div>
                                                        <ArrowRight className="w-3 h-3 text-muted-foreground group-hover:text-blue-500" />
                                                    </div>
                                                </Link>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col gap-1 items-center justify-center p-8 text-center bg-white/50 dark:bg-white/5 rounded-xl border border-dashed">
                                    <HistoryIcon className="w-8 h-8 text-muted-foreground/20 mb-2" />
                                    <p className="text-xs text-muted-foreground">ยังไม่มีประวัติการรัน</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Integration Status Widget */}
                    <Card className="rounded-2xl border shadow-sm bg-blue-50/20 dark:bg-blue-900/10 border-blue-100/50 dark:border-blue-900/50 overflow-hidden">
                        <CardHeader className="p-4 bg-white/80 dark:bg-slate-900/80 border-b">
                            <CardTitle className="text-xs font-bold flex items-center justify-between">
                                <span className="flex items-center gap-2">
                                    <Zap className="w-3 h-3 text-blue-500" />
                                    Connectivity Hub
                                </span>
                                <Badge variant="outline" className="text-[9px] h-4 bg-emerald-50 text-emerald-600 border-emerald-100 uppercase tracking-tighter">Live Status</Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 space-y-3">
                            {[
                                { name: 'Salesforce CRM', status: 'Connected', icon: Database },
                                { name: 'Google Workspace', status: 'Connected', icon: ShieldCheck },
                                { name: 'DocuSign API', status: 'Connected', icon: FileSearch },
                                { name: 'Internal AI Server', status: 'Latency: 45ms', icon: Cpu },
                            ].map((tool, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="p-1.5 rounded-md bg-white dark:bg-slate-800 shadow-sm">
                                            <tool.icon className="w-3 h-3 text-slate-500" />
                                        </div>
                                        <span className="text-[11px] font-medium text-foreground">{tool.name}</span>
                                    </div>
                                    <span className="text-[9px] text-emerald-500 font-bold">{tool.status}</span>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Pro Tip */}
                    <div className="p-6 rounded-2xl bg-gradient-to-br from-[#002f4b] to-[#004e7c] text-white shadow-lg space-y-3">
                        <Sparkles className="w-6 h-6 text-amber-400" />
                        <h4 className="font-bold text-sm">AI Pro-Tip</h4>
                        <p className="text-xs text-blue-100/80 leading-relaxed">
                            คุณสามารถตั้งค่าให้ Workflow รันอัตโนมัติเมื่อมีการเปลี่ยนแปลงใน CRM หรือตามปฏิทินที่กำหนดได้ในส่วนการตั้งค่าขั้นสูง
                        </p>
                    </div>
                </div>
            </div>
            {/* Configuration Drawer */}
            <Sheet open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
                <SheetContent className="overflow-y-auto sm:max-w-md">
                    <SheetHeader className="mb-6">
                        <SheetTitle className="flex items-center gap-2">
                            <Settings2 className="w-5 h-5 text-blue-500" />
                            ตั้งค่า Workflow
                        </SheetTitle>
                        <SheetDescription>
                            ปรับแต่งการทำงานและเครื่องมืออัตโนมัติของ "{editingWorkflow?.name}"
                        </SheetDescription>
                    </SheetHeader>

                    {editingWorkflow && (
                        <div className="space-y-6 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="wf_name">ชื่อ Workflow</Label>
                                <Input
                                    id="wf_name"
                                    value={editingWorkflow.name}
                                    onChange={(e) => setEditingWorkflow({ ...editingWorkflow, name: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="wf_desc">คำอธิบาย</Label>
                                <Textarea
                                    id="wf_desc"
                                    rows={3}
                                    value={editingWorkflow.desc}
                                    onChange={(e) => setEditingWorkflow({ ...editingWorkflow, desc: e.target.value })}
                                />
                            </div>

                            <div className="space-y-4 pt-4 border-t">
                                <h4 className="text-sm font-bold flex items-center gap-2">
                                    <Bot className="w-4 h-4 text-blue-500" /> ระบบอัตโนมัติ (Automation)
                                </h4>

                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>เปิดใช้งานระบบอัตโนมัติ</Label>
                                        <p className="text-[11px] text-muted-foreground">รัน Workflow นี้เบื้องหลังเมื่อมีข้อมูลใหม่ใน CRM</p>
                                    </div>
                                    <Switch
                                        checked={editingWorkflow.autoRun}
                                        onCheckedChange={(val) => setEditingWorkflow({ ...editingWorkflow, autoRun: val })}
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>แจ้งเตือนเมื่อสำเร็จ</Label>
                                        <p className="text-[11px] text-muted-foreground">ส่งการแจ้งเตือนและ Email ทุกครั้งที่รันสำเร็จ</p>
                                    </div>
                                    <Switch
                                        checked={editingWorkflow.notifyOnSuccess}
                                        onCheckedChange={(val) => setEditingWorkflow({ ...editingWorkflow, notifyOnSuccess: val })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>ความถี่ในการรัน</Label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {(['instant', 'daily', 'weekly'] as const).map((freq) => (
                                            <Button
                                                key={freq}
                                                variant={editingWorkflow.frequency === freq ? 'default' : 'outline'}
                                                size="sm"
                                                className="text-[10px] h-8 capitalize"
                                                onClick={() => setEditingWorkflow({ ...editingWorkflow, frequency: freq })}
                                            >
                                                {freq === 'instant' ? 'ทันที' : freq === 'daily' ? 'รายวัน' : 'รายสัปดาห์'}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800 space-y-2">
                                <p className="text-[10px] font-bold text-blue-700 dark:text-blue-300 flex items-center gap-1">
                                    <Sparkles className="w-3 h-3" /> AI Summary
                                </p>
                                <p className="text-[10px] text-blue-600 dark:text-blue-400 leading-relaxed">
                                    Workflow นี้จะประหยัดเวลาทีมงานได้ประมาณ 4 ชั่วโมงต่อสัปดาห์ และลดความผิดพลาดในการคีย์ข้อมูลลง 98%
                                </p>
                            </div>
                        </div>
                    )}

                    <SheetFooter className="mt-8 gap-3 sm:flex-col lg:flex-row">
                        <Button variant="outline" className="w-full" onClick={() => setIsSettingsOpen(false)}>ยกเลิก</Button>
                        <Button
                            className="w-full text-white shadow-lg"
                            style={{ background: 'linear-gradient(135deg, #002f4b, #00466c)' }}
                            onClick={handleSaveSettings}
                        >
                            บันทึกการเปลี่ยนแปลง
                        </Button>
                    </SheetFooter>
                </SheetContent>
            </Sheet>

            {/* Run Detail Modal */}
            <Dialog open={!!selectedRun} onOpenChange={(open) => !open && setSelectedRun(null)}>
                <DialogContent className="sm:max-w-[600px] overflow-hidden p-0 rounded-3xl border-none shadow-2xl bg-white dark:bg-slate-950">
                    <DialogHeader className="p-6 pb-0">
                        <DialogTitle className="flex items-center gap-3 text-xl font-bold">
                            <div className="p-2 rounded-xl bg-blue-600 text-white shadow-lg">
                                <Activity className="w-5 h-5" />
                            </div>
                            Execution Report
                        </DialogTitle>
                        <DialogDescription className="text-xs mt-1">
                            Detailed technical run report for {selectedRun?.workflowName} • ID: {selectedRun?.id}
                        </DialogDescription>
                    </DialogHeader>

                    {selectedRun && (
                        <div className="p-6 pt-4 space-y-6 max-h-[70vh] overflow-y-auto">
                            {/* Summary Cards */}
                            <div className="grid grid-cols-3 gap-3">
                                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border text-center">
                                    <p className="text-[9px] uppercase tracking-wider text-muted-foreground font-bold mb-1">Duration</p>
                                    <p className="text-sm font-bold text-foreground">{selectedRun.technicalReport?.duration}</p>
                                </div>
                                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border text-center">
                                    <p className="text-[9px] uppercase tracking-wider text-muted-foreground font-bold mb-1">Data</p>
                                    <p className="text-sm font-bold text-foreground">{selectedRun.technicalReport?.dataProcessed}</p>
                                </div>
                                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border text-center">
                                    <p className="text-[9px] uppercase tracking-wider text-muted-foreground font-bold mb-1">AI Confidence</p>
                                    <p className="text-sm font-bold text-emerald-500">{selectedRun.technicalReport?.confidence}</p>
                                </div>
                            </div>

                            {/* Technical Logs */}
                            <div className="space-y-3">
                                <h4 className="text-xs font-bold flex items-center gap-2">
                                    <Terminal className="w-3.5 h-3.5 text-blue-500" /> Technical Logs
                                </h4>
                                <div className="p-4 rounded-2xl bg-slate-900 font-mono text-[11px] text-blue-400 space-y-1 shadow-inner border border-slate-800">
                                    {selectedRun.logs.map((log, i) => (
                                        <div key={i} className="flex gap-3">
                                            <span className="opacity-30 whitespace-nowrap">[{new Date(selectedRun.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}]</span>
                                            <span>{log}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Outcome */}
                            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800">
                                <h4 className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-2 mb-2">
                                    <CheckCircle2 className="w-4 h-4" /> Final Outcome
                                </h4>
                                <p className="text-xs text-emerald-600 dark:text-emerald-500 leading-relaxed mb-4">
                                    All integration modules responded with 200 OK. Your document "{selectedRun.resultDoc}" has been encrypted and successfully stored in the Lawlanes Vault.
                                </p>
                                <Link href={selectedRun.resultLink || '#'}>
                                    <Button size="sm" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white border-none rounded-xl">
                                        Open Vault Documentation
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}

function HistoryIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
            <path d="m12 7 0 5 3 3" />
        </svg>
    )
}

function FileTextIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
            <path d="M14 2v4a2 2 0 0 0 2 2h4" />
            <path d="M10 9H8" />
            <path d="M16 13H8" />
            <path d="M16 17H8" />
        </svg>
    )
}

