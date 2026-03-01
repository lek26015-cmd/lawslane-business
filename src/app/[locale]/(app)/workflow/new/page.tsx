'use client';
export const runtime = 'edge';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import {
    ArrowLeft,
    Workflow,
    Plus,
    X,
    Loader2,
    Zap,
    Bot,
    ArrowRight,
    GripVertical,
} from 'lucide-react';
import Link from 'next/link';

const TRIGGER_TYPES = [
    { value: 'manual', label: 'เรียกใช้งานด้วยตนเอง' },
    { value: 'schedule', label: 'ตั้งเวลา (Schedule)' },
    { value: 'event', label: 'เหตุการณ์ (Event Trigger)' },
    { value: 'webhook', label: 'Webhook' },
    { value: 'contract_created', label: 'เมื่อสร้างสัญญาใหม่' },
    { value: 'contract_expiring', label: 'เมื่อสัญญาใกล้หมดอายุ' },
    { value: 'document_uploaded', label: 'เมื่ออัปโหลดเอกสาร' },
];

const STEP_TYPES = [
    { value: 'ai_draft', label: '🤖 AI ร่างเอกสาร', color: '#8b5cf6' },
    { value: 'review', label: '👀 ตรวจสอบ / อนุมัติ', color: '#f59e0b' },
    { value: 'notify', label: '🔔 แจ้งเตือน / ส่ง Email', color: '#3b82f6' },
    { value: 'sign', label: '✍️ ส่ง e-Sign', color: '#10b981' },
    { value: 'fetch_data', label: '📥 ดึงข้อมูล', color: '#06b6d4' },
    { value: 'condition', label: '🔀 เงื่อนไข (If/Else)', color: '#ec4899' },
    { value: 'transform', label: '⚙️ แปลงข้อมูล', color: '#64748b' },
    { value: 'store', label: '💾 บันทึกข้อมูล / Log', color: '#f97316' },
    { value: 'custom', label: '📝 กำหนดเอง', color: '#6b7280' },
];

function getStepColor(type: string) {
    return STEP_TYPES.find(s => s.value === type)?.color || '#64748b';
}
function getStepLabel(type: string) {
    return STEP_TYPES.find(s => s.value === type)?.label || type;
}

interface WorkflowStep {
    id: string;
    type: string;
    name: string;
    description: string;
}

export default function CreateWorkflowPage() {
    const { toast } = useToast();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [trigger, setTrigger] = useState('manual');
    const [steps, setSteps] = useState<WorkflowStep[]>([]);

    const addStep = (type: string) => {
        const label = getStepLabel(type);
        setSteps([...steps, {
            id: `step-${Date.now()}-${Math.random().toString(36).slice(2)}`,
            type,
            name: label.replace(/^[^\s]+ /, ''), // Remove emoji prefix
            description: '',
        }]);
    };

    const removeStep = (id: string) => setSteps(steps.filter(s => s.id !== id));

    const updateStep = (id: string, field: keyof WorkflowStep, value: string) => {
        setSteps(steps.map(s => s.id === id ? { ...s, [field]: value } : s));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim()) {
            toast({ title: 'กรุณากรอกชื่อ Workflow', variant: 'destructive' });
            return;
        }
        if (steps.length === 0) {
            toast({ title: 'กรุณาเพิ่มขั้นตอนอย่างน้อย 1 ขั้นตอน', variant: 'destructive' });
            return;
        }

        setLoading(true);
        // Simulate saving (no Firestore service for workflows yet)
        await new Promise(resolve => setTimeout(resolve, 800));

        toast({
            title: '✅ สร้าง Workflow เรียบร้อย',
            description: `Workflow "${name}" ถูกสร้างแล้ว`,
        });
        setLoading(false);
        router.push('/workflow');
    };

    return (
        <div className="p-4 md:p-8 max-w-[900px] mx-auto pb-20">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link href="/workflow">
                    <Button variant="ghost" size="icon" className="rounded-xl hover:bg-muted">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
                        สร้าง Workflow ใหม่
                        <Badge className="bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-400 text-xs">
                            <Bot className="w-3 h-3 mr-1" /> AI-Powered
                        </Badge>
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">ออกแบบ Workflow อัตโนมัติสำหรับงานกฎหมาย</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* ── Basic Info ── */}
                <Card className="rounded-2xl border shadow-sm">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <div className="p-2 rounded-xl shadow-md" style={{ background: 'linear-gradient(135deg, #002f4b, #00466c)' }}>
                                <Workflow className="w-4 h-4 text-white" />
                            </div>
                            ข้อมูล Workflow
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-5">
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold">ชื่อ Workflow <span className="text-red-500">*</span></Label>
                            <Input
                                placeholder="เช่น สร้างสัญญาอัตโนมัติ"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="rounded-xl h-11"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold">คำอธิบาย</Label>
                            <Textarea
                                placeholder="อธิบายว่า Workflow นี้ทำอะไร..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="rounded-xl min-h-[80px] resize-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold">Trigger (เงื่อนไขเริ่มต้น)</Label>
                            <Select value={trigger} onValueChange={setTrigger}>
                                <SelectTrigger className="rounded-xl h-11">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {TRIGGER_TYPES.map(t => (
                                        <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* ── Workflow Steps ── */}
                <Card className="rounded-2xl border shadow-sm">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-lg flex items-center justify-between">
                            <span className="flex items-center gap-2">
                                <div className="p-2 rounded-xl shadow-md" style={{ background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' }}>
                                    <Zap className="w-4 h-4 text-white" />
                                </div>
                                ขั้นตอน ({steps.length})
                            </span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {/* Steps list */}
                        {steps.length > 0 && (
                            <div className="space-y-3 mb-6">
                                {steps.map((step, i) => (
                                    <div key={step.id} className="relative">
                                        <div className="flex items-start gap-3 p-4 rounded-xl border bg-muted/20 group">
                                            <div className="flex flex-col items-center shrink-0 mt-1">
                                                <div
                                                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                                                    style={{ backgroundColor: getStepColor(step.type) }}
                                                >
                                                    {i + 1}
                                                </div>
                                            </div>
                                            <div className="flex-1 space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <Badge variant="secondary" className="text-[10px]">{getStepLabel(step.type)}</Badge>
                                                </div>
                                                <Input
                                                    placeholder="ชื่อขั้นตอน"
                                                    value={step.name}
                                                    onChange={(e) => updateStep(step.id, 'name', e.target.value)}
                                                    className="rounded-lg h-9 text-sm"
                                                />
                                                <Input
                                                    placeholder="รายละเอียดเพิ่มเติม (ไม่บังคับ)"
                                                    value={step.description}
                                                    onChange={(e) => updateStep(step.id, 'description', e.target.value)}
                                                    className="rounded-lg h-9 text-sm text-muted-foreground"
                                                />
                                            </div>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="shrink-0 h-8 w-8 text-red-400 hover:text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={() => removeStep(step.id)}
                                            >
                                                <X className="w-4 h-4" />
                                            </Button>
                                        </div>
                                        {/* Arrow connector */}
                                        {i < steps.length - 1 && (
                                            <div className="flex justify-center py-1">
                                                <ArrowRight className="w-4 h-4 text-muted-foreground/40 rotate-90" />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Add step buttons */}
                        <div className="space-y-3">
                            <Label className="text-sm font-semibold text-muted-foreground">เพิ่มขั้นตอน:</Label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {STEP_TYPES.map(s => (
                                    <Button
                                        key={s.value}
                                        type="button"
                                        variant="outline"
                                        className="rounded-xl h-auto py-2.5 px-3 text-xs justify-start gap-2 hover:shadow-sm transition-all"
                                        onClick={() => addStep(s.value)}
                                    >
                                        <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                                        <span className="truncate">{s.label}</span>
                                    </Button>
                                ))}
                            </div>
                        </div>

                        {steps.length === 0 && (
                            <div className="text-center py-8 mt-4 rounded-xl border border-dashed bg-muted/20">
                                <Zap className="w-8 h-8 mx-auto mb-2 text-muted-foreground/30" />
                                <p className="text-sm text-muted-foreground">กดปุ่มด้านบนเพื่อเพิ่มขั้นตอนใน Workflow</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* ── Actions ── */}
                <div className="flex items-center justify-between pt-4 sticky bottom-0 bg-background/95 backdrop-blur-sm py-4 border-t -mx-4 px-4 md:-mx-8 md:px-8">
                    <Link href="/workflow">
                        <Button type="button" variant="outline" className="rounded-xl gap-2" disabled={loading}>
                            <ArrowLeft className="w-4 h-4" /> ยกเลิก
                        </Button>
                    </Link>
                    <Button
                        type="submit"
                        className="text-white rounded-xl gap-2 shadow-lg px-8 h-11"
                        style={{ background: 'linear-gradient(135deg, #002f4b, #00466c)' }}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                กำลังสร้าง...
                            </>
                        ) : (
                            <>
                                <Workflow className="w-4 h-4" />
                                สร้าง Workflow
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}
