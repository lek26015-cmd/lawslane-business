'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Briefcase,
    Plus,
    Search,
    Filter,
    Clock,
    Calendar,
    CheckCircle2,
    AlertCircle,
    User,
    Scale,
    FileText,
    ArrowRight,
    Building2,
    Shield,
    ChevronRight,
} from 'lucide-react';
import LawyerSidebar from '@/components/layout/lawyer-sidebar';
import { useToast } from '@/hooks/use-toast';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

type CaseItem = {
    id: string;
    caseNo: string;
    title: string;
    clientName: string;
    category: 'แพ่ง/พาณิชย์' | 'อาญา' | 'แรงงาน' | 'ทรัพย์สินทางปัญญา' | 'มรดก/ครอบครัว' | 'สัญญาธุรกิจ';
    stage: 'intake' | 'evidence' | 'filing' | 'hearings' | 'judgment' | 'closed';
    stageLabel: string;
    nextHearing?: string;
    fee: number;
    paid: number;
};

const INITIAL_CASES: CaseItem[] = [
    {
        id: 'CASE-2026-001',
        caseNo: 'ผบ. 124/2568',
        title: 'ฟ้องผิดสัญญาซื้อขายสินค้าและเรียกร้องค่าเสียหาย',
        clientName: 'บริษัท สยาม โลจิสติกส์ จำกัด',
        category: 'แพ่ง/พาณิชย์',
        stage: 'hearings',
        stageLabel: 'นัดสืบพยานโจทก์',
        nextHearing: '15 มี.ค. 2569 (ศาลแพ่งกรุงเทพใต้)',
        fee: 75000,
        paid: 50000,
    },
    {
        id: 'CASE-2026-002',
        caseNo: 'อ. 88/2568',
        title: 'คดียักยอกทรัพย์และฉ้อโกงบริษัท',
        clientName: 'คุณ ธนพล กิตติพงษ์',
        category: 'อาญา',
        stage: 'filing',
        stageLabel: 'ยื่นคำฟ้องต่อศาล',
        nextHearing: '28 ก.พ. 2569 (ศาลอาญา)',
        fee: 120000,
        paid: 60000,
    },
    {
        id: 'CASE-2026-003',
        caseNo: 'รล. 45/2568',
        title: 'ข้อพิพาทเลิกจ้างไม่เป็นธรรมและค่าชดเชย',
        clientName: 'คุณ พิมพ์ใจ อนันต์',
        category: 'แรงงาน',
        stage: 'evidence',
        stageLabel: 'รวบรวมพยานหลักฐาน',
        nextHearing: '10 มี.ค. 2569 (ศาลแรงงานกลาง)',
        fee: 45000,
        paid: 45000,
    },
    {
        id: 'CASE-2026-004',
        caseNo: 'สญ. 012/2568',
        title: 'ร่างและเจรจาสัญญา Shareholder Agreement',
        clientName: 'บริษัท เทคสตาร์ท จำกัด',
        category: 'สัญญาธุรกิจ',
        stage: 'closed',
        stageLabel: 'ปิดคดี / เสร็จสิ้นสัญญา',
        fee: 60000,
        paid: 60000,
    },
];

export default function LawyerCasesPage() {
    const { toast } = useToast();
    const [cases, setCases] = useState<CaseItem[]>(INITIAL_CASES);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStage, setSelectedStage] = useState('all');
    const [isAddOpen, setIsAddOpen] = useState(false);

    // Form state
    const [newTitle, setNewTitle] = useState('');
    const [newClient, setNewClient] = useState('');
    const [newCategory, setNewCategory] = useState<CaseItem['category']>('แพ่ง/พาณิชย์');
    const [newFee, setNewFee] = useState('');
    const [newCourt, setNewCourt] = useState('');

    const filteredCases = cases.filter(c => {
        const matchSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.caseNo.toLowerCase().includes(searchQuery.toLowerCase());
        const matchStage = selectedStage === 'all' || c.stage === selectedStage;
        return matchSearch && matchStage;
    });

    const handleCreateCase = () => {
        if (!newTitle.trim() || !newClient.trim()) {
            toast({ title: 'กรุณากรอกข้อมูล', description: 'ระบุชื่อคดีและชื่อลูกความให้ครบถ้วน', variant: 'destructive' });
            return;
        }

        const newCase: CaseItem = {
            id: `CASE-2026-${String(cases.length + 1).padStart(3, '0')}`,
            caseNo: newCourt ? `คดีใหม่ (${newCourt})` : 'คดีใหม่',
            title: newTitle,
            clientName: newClient,
            category: newCategory,
            stage: 'intake',
            stageLabel: 'รับเรื่อง / ประเมินคดี',
            fee: Number(newFee) || 0,
            paid: 0,
        };

        setCases([newCase, ...cases]);
        setIsAddOpen(false);
        setNewTitle('');
        setNewClient('');
        setNewFee('');
        setNewCourt('');
        toast({ title: 'เปิดคดีใหม่สำเร็จ', description: `บันทึกคดี "${newTitle}" เรียบร้อยแล้ว` });
    };

    const getStageBadge = (stage: CaseItem['stage']) => {
        switch (stage) {
            case 'intake':
                return <Badge className="bg-blue-50 text-blue-700 border-blue-200">1. รับเรื่อง</Badge>;
            case 'evidence':
                return <Badge className="bg-amber-50 text-amber-700 border-amber-200">2. รวมหลักฐาน</Badge>;
            case 'filing':
                return <Badge className="bg-purple-50 text-purple-700 border-purple-200">3. ยื่นฟ้อง/คำให้การ</Badge>;
            case 'hearings':
                return <Badge className="bg-orange-50 text-orange-700 border-orange-200">4. นัดสืบพยาน</Badge>;
            case 'judgment':
                return <Badge className="bg-indigo-50 text-indigo-700 border-indigo-200">5. รอคำพิพากษา</Badge>;
            case 'closed':
                return <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">6. ปิดคดีแล้ว</Badge>;
        }
    };

    return (
        <div className="flex h-screen overflow-hidden bg-background">
            <LawyerSidebar />
            <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-extrabold text-[#002f4b] dark:text-blue-400 flex items-center gap-2">
                            <Briefcase className="w-7 h-7" />
                            จัดการคดีและลูกความ (Case Management)
                        </h1>
                        <p className="text-muted-foreground text-sm mt-1">
                            ติดตามความคืบหน้าของคดี กำหนดนัดศาล และจัดการลูกความแบบครบวงจร
                        </p>
                    </div>

                    <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                        <DialogTrigger asChild>
                            <Button className="rounded-xl gap-2 text-white shadow-lg" style={{ background: 'linear-gradient(135deg, #002f4b, #00466c)' }}>
                                <Plus className="w-4 h-4" /> เปิดสำนวนคดีใหม่
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[550px] rounded-2xl">
                            <DialogHeader>
                                <DialogTitle className="text-lg font-bold text-[#002f4b]">เปิดสำนวนคดีใหม่</DialogTitle>
                                <DialogDescription>กรอกข้อมูลเริ่มต้นเพื่อเปิดแฟ้มคดีและบันทึกลงในระบบ</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-3">
                                <div>
                                    <Label className="text-xs font-semibold">ชื่อเรื่อง / ข้อพิพาท *</Label>
                                    <Input placeholder="เช่น ฟ้องผิดสัญญาจ้างทำของ..." value={newTitle} onChange={e => setNewTitle(e.target.value)} className="mt-1" />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <Label className="text-xs font-semibold">ชื่อลูกความ *</Label>
                                        <Input placeholder="ชื่อบุคคล หรือ นิติบุคคล" value={newClient} onChange={e => setNewClient(e.target.value)} className="mt-1" />
                                    </div>
                                    <div>
                                        <Label className="text-xs font-semibold">ประเภทคดี</Label>
                                        <Select value={newCategory} onValueChange={(val: any) => setNewCategory(val)}>
                                            <SelectTrigger className="mt-1">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="แพ่ง/พาณิชย์">แพ่ง/พาณิชย์</SelectItem>
                                                <SelectItem value="อาญา">อาญา</SelectItem>
                                                <SelectItem value="แรงงาน">แรงงาน</SelectItem>
                                                <SelectItem value="ทรัพย์สินทางปัญญา">ทรัพย์สินทางปัญญา</SelectItem>
                                                <SelectItem value="มรดก/ครอบครัว">มรดก/ครอบครัว</SelectItem>
                                                <SelectItem value="สัญญาธุรกิจ">สัญญาธุรกิจ</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <Label className="text-xs font-semibold">ศาล / หน่วยงานที่เกี่ยวข้อง</Label>
                                        <Input placeholder="เช่น ศาลแพ่ง, ศาลแรงงาน" value={newCourt} onChange={e => setNewCourt(e.target.value)} className="mt-1" />
                                    </div>
                                    <div>
                                        <Label className="text-xs font-semibold">ค่าวิชาชีพประมาณการ (฿)</Label>
                                        <Input type="number" placeholder="50000" value={newFee} onChange={e => setNewFee(e.target.value)} className="mt-1" />
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsAddOpen(false)}>ยกเลิก</Button>
                                <Button onClick={handleCreateCase} className="bg-[#002f4b] hover:bg-[#001f35] text-white">บันทึกเปิดคดี</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Pipeline Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    {[
                        { label: '1. รับเรื่อง', count: cases.filter(c => c.stage === 'intake').length, color: 'bg-blue-500' },
                        { label: '2. รวบรวมหลักฐาน', count: cases.filter(c => c.stage === 'evidence').length, color: 'bg-amber-500' },
                        { label: '3. ยื่นฟ้อง/คำให้การ', count: cases.filter(c => c.stage === 'filing').length, color: 'bg-purple-500' },
                        { label: '4. นัดสืบพยาน', count: cases.filter(c => c.stage === 'hearings').length, color: 'bg-orange-500' },
                        { label: '5. รอคำพิพากษา', count: cases.filter(c => c.stage === 'judgment').length, color: 'bg-indigo-500' },
                        { label: '6. ปิดคดีแล้ว', count: cases.filter(c => c.stage === 'closed').length, color: 'bg-emerald-500' },
                    ].map((item, idx) => (
                        <Card key={idx} className="rounded-2xl border shadow-sm p-4">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-semibold text-muted-foreground">{item.label}</span>
                                <div className={`w-2 h-2 rounded-full ${item.color}`} />
                            </div>
                            <p className="text-2xl font-black text-foreground">{item.count}</p>
                        </Card>
                    ))}
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="ค้นหาชื่อคดี, เลขคดี หรือชื่อลูกความ..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="pl-10 rounded-xl bg-card border-border/80"
                        />
                    </div>
                    <Select value={selectedStage} onValueChange={setSelectedStage}>
                        <SelectTrigger className="w-full sm:w-[200px] rounded-xl bg-card">
                            <SelectValue placeholder="ทุกสถานะ" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">ทุกสถานะคดี</SelectItem>
                            <SelectItem value="intake">1. รับเรื่อง</SelectItem>
                            <SelectItem value="evidence">2. รวบรวมหลักฐาน</SelectItem>
                            <SelectItem value="filing">3. ยื่นฟ้อง/คำให้การ</SelectItem>
                            <SelectItem value="hearings">4. นัดสืบพยาน</SelectItem>
                            <SelectItem value="judgment">5. รอคำพิพากษา</SelectItem>
                            <SelectItem value="closed">6. ปิดคดีแล้ว</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Cases List */}
                <div className="space-y-3">
                    {filteredCases.length > 0 ? (
                        filteredCases.map(caseItem => (
                            <Card key={caseItem.id} className="rounded-2xl border shadow-sm hover:shadow-md transition-all group overflow-hidden">
                                <CardContent className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-[#002f4b] dark:text-blue-400 mt-1 shrink-0">
                                            <Scale className="w-6 h-6" />
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                                                    {caseItem.title}
                                                </h3>
                                                <Badge variant="outline" className="text-[10px] text-muted-foreground">
                                                    {caseItem.caseNo}
                                                </Badge>
                                                <Badge variant="secondary" className="text-[10px] font-semibold bg-slate-100 dark:bg-slate-800">
                                                    {caseItem.category}
                                                </Badge>
                                            </div>
                                            <p className="text-xs text-muted-foreground flex items-center gap-2">
                                                <User className="w-3.5 h-3.5" /> ลูกความ: <span className="font-medium text-foreground">{caseItem.clientName}</span>
                                            </p>
                                            {caseItem.nextHearing && (
                                                <p className="text-xs text-amber-700 dark:text-amber-400 flex items-center gap-1.5 font-medium">
                                                    <Calendar className="w-3.5 h-3.5" /> นัดหมายถัดไป: {caseItem.nextHearing}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Right Status & Financials */}
                                    <div className="flex flex-wrap md:flex-col items-end gap-2 shrink-0">
                                        <div>{getStageBadge(caseItem.stage)}</div>
                                        <div className="text-right">
                                            <p className="text-xs text-muted-foreground">
                                                ค่าวิชาชีพ: <span className="font-bold text-foreground">฿{caseItem.fee.toLocaleString()}</span>
                                            </p>
                                            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                                                ชำระแล้ว: ฿{caseItem.paid.toLocaleString()} ({Math.round((caseItem.paid / (caseItem.fee || 1)) * 100)}%)
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <div className="p-12 text-center border border-dashed rounded-2xl bg-card">
                            <Briefcase className="w-10 h-10 mx-auto text-muted-foreground/40 mb-3" />
                            <h3 className="text-base font-bold text-foreground">ไม่พบข้อมูลคดี</h3>
                            <p className="text-xs text-muted-foreground mt-1">ลองเปลี่ยนคำค้นหาหรือตัวกรองสถานะ</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
