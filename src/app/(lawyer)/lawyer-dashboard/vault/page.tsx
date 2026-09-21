'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    FolderLock,
    Upload,
    Search,
    FileText,
    File,
    FileSpreadsheet,
    Share2,
    ShieldCheck,
    Lock,
    ExternalLink,
    Copy,
    KeyRound,
    Sparkles,
    Check,
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
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';

type CaseDoc = {
    id: string;
    name: string;
    caseTitle: string;
    type: 'pdf' | 'docx' | 'xlsx';
    size: string;
    updatedAt: string;
    shared: boolean;
};

const INITIAL_DOCS: CaseDoc[] = [
    {
        id: 'DOC-01',
        name: 'คำฟ้องและเอกสารท้ายคำฟ้อง_ผบ124.pdf',
        caseTitle: 'ฟ้องผิดสัญญาซื้อขายสินค้า (สยาม โลจิสติกส์)',
        type: 'pdf',
        size: '1.8 MB',
        updatedAt: '22 ก.พ. 2569',
        shared: true,
    },
    {
        id: 'DOC-02',
        name: 'บันทึกคำให้การพยานโจทก์.docx',
        caseTitle: 'คดียักยอกทรัพย์และฉ้อโกง (ธนพล)',
        type: 'docx',
        size: '340 KB',
        updatedAt: '20 ก.พ. 2569',
        shared: false,
    },
    {
        id: 'DOC-03',
        name: 'ตารางคำนวณค่าชดเชยและดอกเบี้ย.xlsx',
        caseTitle: 'ข้อพิพาทเลิกจ้างไม่เป็นธรรม (พิมพ์ใจ)',
        type: 'xlsx',
        size: '125 KB',
        updatedAt: '18 ก.พ. 2569',
        shared: true,
    },
    {
        id: 'DOC-04',
        name: 'หนังสือบอกกล่าวทวงถาม (Notice).pdf',
        caseTitle: 'ฟ้องผิดสัญญาซื้อขายสินค้า (สยาม โลจิสติกส์)',
        type: 'pdf',
        size: '420 KB',
        updatedAt: '15 ก.พ. 2569',
        shared: true,
    },
];

export default function LawyerVaultPage() {
    const { toast } = useToast();
    const [docs, setDocs] = useState<CaseDoc[]>(INITIAL_DOCS);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDoc, setSelectedDoc] = useState<CaseDoc | null>(null);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [isPasswordProtected, setIsPasswordProtected] = useState(true);
    const [password, setPassword] = useState('Law2026Secure!');
    const [isCopied, setIsCopied] = useState(false);

    const filteredDocs = docs.filter(d =>
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.caseTitle.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleOpenShare = (doc: CaseDoc) => {
        setSelectedDoc(doc);
        setIsShareModalOpen(true);
    };

    const handleCopyLink = () => {
        const link = `https://lawslane.com/s/case-vault/${selectedDoc?.id || 'doc'}`;
        navigator.clipboard.writeText(link);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
        toast({
            title: 'คัดลอกลิงก์สำเร็จ',
            description: 'สามารถส่งลิงก์นี้ให้ลูกความเข้าดูเอกสารได้อย่างปลอดภัย',
        });
    };

    const getFileIcon = (type: string) => {
        switch (type) {
            case 'pdf': return <FileText className="w-5 h-5 text-red-500" />;
            case 'docx': return <File className="w-5 h-5 text-blue-500" />;
            case 'xlsx': return <FileSpreadsheet className="w-5 h-5 text-emerald-500" />;
            default: return <File className="w-5 h-5 text-slate-400" />;
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
                            <FolderLock className="w-7 h-7" />
                            คลังเอกสารคดี (Case Vault)
                            <Badge variant="outline" className="text-[10px] uppercase font-bold bg-blue-50 text-blue-700 border-blue-200">
                                256-bit AES
                            </Badge>
                        </h1>
                        <p className="text-muted-foreground text-sm mt-1">
                            จัดเก็บเอกสารคำฟ้อง พยานหลักฐาน และแชร์ให้ลูกความอย่างปลอดภัยตามมาตรฐานความลับทางวิชาชีพ
                        </p>
                    </div>

                    <Button className="rounded-xl gap-2 text-white shadow-lg" style={{ background: 'linear-gradient(135deg, #002f4b, #00466c)' }}>
                        <Upload className="w-4 h-4" /> อัปโหลดเอกสารคดี
                    </Button>
                </div>

                {/* Storage & Security Status */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="rounded-2xl border shadow-sm p-4 bg-card/60">
                        <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">เอกสารในคลัง</p>
                        <p className="text-2xl font-black text-foreground mt-1">{docs.length} ฉบับ</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">แยกตาม 4 สำนวนคดี</p>
                    </Card>

                    <Card className="rounded-2xl border shadow-sm p-4 bg-card/60">
                        <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">พื้นที่ใช้งาน</p>
                        <p className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">3.4 MB <span className="text-xs text-muted-foreground font-normal">/ 10 GB</span></p>
                        <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                            <div className="bg-blue-600 h-full w-[3%]" />
                        </div>
                    </Card>

                    <Card className="rounded-2xl border shadow-sm p-4 bg-card/60">
                        <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">ความปลอดภัยของระบบ</p>
                        <div className="flex items-center gap-2 mt-1">
                            <ShieldCheck className="w-6 h-6 text-emerald-500" />
                            <span className="text-sm font-bold text-foreground">เข้ารหัส 256-bit ทุกไฟล์</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-0.5">มาตรฐาน Attorney-Client Privilege</p>
                    </Card>
                </div>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="ค้นหาชื่อเอกสาร หรือชื่อคดี..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="pl-10 rounded-xl bg-card border-border/80"
                    />
                </div>

                {/* Documents Table / List */}
                <div className="space-y-3">
                    {filteredDocs.map(doc => (
                        <Card key={doc.id} className="rounded-2xl border shadow-sm hover:shadow-md transition-all group overflow-hidden">
                            <CardContent className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0">
                                        {getFileIcon(doc.type)}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                                                {doc.name}
                                            </p>
                                            {doc.shared && (
                                                <Badge variant="outline" className="text-[9px] bg-emerald-50 text-emerald-700 border-emerald-200">
                                                    แชร์กับลูกความแล้ว
                                                </Badge>
                                            )}
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-0.5">
                                            สำนวนคดี: <span className="font-medium text-foreground">{doc.caseTitle}</span> &bull; ขนาด {doc.size} &bull; อัปเดต {doc.updatedAt}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleOpenShare(doc)}
                                        className="rounded-xl text-xs gap-1.5 h-9"
                                    >
                                        <Share2 className="w-3.5 h-3.5 text-blue-600" /> แชร์ให้ลูกความ
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Share Modal */}
                <Dialog open={isShareModalOpen} onOpenChange={setIsShareModalOpen}>
                    <DialogContent className="sm:max-w-[500px] rounded-2xl">
                        <DialogHeader>
                            <DialogTitle className="text-lg font-bold text-[#002f4b] flex items-center gap-2">
                                <Share2 className="w-5 h-5 text-blue-600" />
                                แชร์เอกสารให้ลูกความอย่างปลอดภัย
                            </DialogTitle>
                            <DialogDescription>
                                เอกสาร: <span className="font-semibold text-foreground">{selectedDoc?.name}</span>
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4 py-3">
                            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label className="text-xs font-bold flex items-center gap-1.5">
                                        <Lock className="w-3.5 h-3.5 text-amber-600" /> ป้องกันด้วยรหัสผ่าน (Password Protection)
                                    </Label>
                                    <Switch checked={isPasswordProtected} onCheckedChange={setIsPasswordProtected} />
                                </div>
                                {isPasswordProtected && (
                                    <div className="pt-2">
                                        <Label className="text-[11px] text-muted-foreground block mb-1">รหัสผ่านสำหรับลูกความเปิดดูไฟล์:</Label>
                                        <div className="flex gap-2">
                                            <Input
                                                value={password}
                                                onChange={e => setPassword(e.target.value)}
                                                className="text-xs font-mono rounded-lg h-9"
                                            />
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setPassword(`Law${Math.floor(1000 + Math.random() * 9000)}!`)}
                                                className="rounded-lg text-xs"
                                            >
                                                สุ่มรหัส
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div>
                                <Label className="text-xs font-semibold block mb-1.5">ลิงก์เข้าถึงเอกสารสำหรับลูกความ</Label>
                                <div className="flex gap-2">
                                    <Input
                                        readOnly
                                        value={`https://lawslane.com/s/case-vault/${selectedDoc?.id || 'doc'}`}
                                        className="text-xs text-muted-foreground bg-muted/40 rounded-xl"
                                    />
                                    <Button
                                        onClick={handleCopyLink}
                                        className="bg-[#002f4b] hover:bg-[#001f35] text-white rounded-xl gap-1.5 shrink-0"
                                    >
                                        {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                                        {isCopied ? 'คัดลอกแล้ว' : 'คัดลอก'}
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button onClick={() => setIsShareModalOpen(false)} className="rounded-xl w-full bg-[#002f4b] text-white">
                                เสร็จสิ้น
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </main>
        </div>
    );
}
