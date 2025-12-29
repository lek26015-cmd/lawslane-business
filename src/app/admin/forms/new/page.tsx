'use client'

import * as React from 'react'
import {
    ChevronLeft,
    Upload,
    X,
    FileText,
    Paperclip
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { Textarea } from '@/components/ui/textarea'
import { useFirebase } from '@/firebase'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { uploadToR2 } from '@/app/actions/upload-r2';
import { MAX_FILE_SIZE_BYTES, MAX_FILE_SIZE_MB } from '@/lib/constants';
import type { LegalFormAttachment } from '@/lib/types';

const CATEGORIES = [
    "สัญญาธุรกิจ",
    "สัญญาจ้างงาน",
    "อสังหาริมทรัพย์",
    "ครอบครัวและมรดก",
    "หนังสือมอบอำนาจ",
    "อื่นๆ"
];

export default function AdminFormCreatePage() {
    const router = useRouter()
    const { toast } = useToast()
    const { firestore } = useFirebase();

    const [title, setTitle] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [category, setCategory] = React.useState('');
    const [isCustomCategory, setIsCustomCategory] = React.useState(false);
    const [isSaving, setIsSaving] = React.useState(false);

    // Multiple files state
    const [selectedFiles, setSelectedFiles] = React.useState<File[]>([]);
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const adminFormsPath = `/admin/forms`;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            const validFiles = files.filter(file => {
                if (file.size > MAX_FILE_SIZE_BYTES) {
                    toast({
                        variant: "destructive",
                        title: "ไฟล์มีขนาดใหญ่เกินไป",
                        description: `ไฟล์ ${file.name} มีขนาดเกิน ${MAX_FILE_SIZE_MB}MB`,
                    });
                    return false;
                }
                return true;
            });

            setSelectedFiles(prev => [...prev, ...validFiles]);
        }
        // Reset input so the same file can be selected again if needed
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const removeFile = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const getFileType = (fileName: string): 'pdf' | 'doc' | 'docx' | 'xls' | 'xlsx' => {
        const ext = fileName.split('.').pop()?.toLowerCase();
        if (['pdf', 'doc', 'docx', 'xls', 'xlsx'].includes(ext || '')) {
            return ext as any;
        }
        return 'pdf'; // Default fallback
    };

    const handleSaveChanges = async () => {
        if (!firestore) return;

        if (!title || !category) {
            toast({
                variant: "destructive",
                title: "กรุณากรอกข้อมูล",
                description: "กรุณาระบุชื่อเอกสารและหมวดหมู่",
            });
            return;
        }

        if (selectedFiles.length === 0) {
            toast({
                variant: "destructive",
                title: "กรุณาเลือกไฟล์",
                description: "ต้องมีไฟล์อย่างน้อย 1 ไฟล์",
            });
            return;
        }

        setIsSaving(true);

        try {
            const attachments: LegalFormAttachment[] = [];

            // Upload all files
            for (const file of selectedFiles) {
                const formData = new FormData();
                formData.append('file', file);

                toast({
                    title: `กำลังอัปโหลด ${file.name}...`,
                });

                const url = await uploadToR2(formData, 'forms');
                attachments.push({
                    url,
                    name: file.name,
                    type: getFileType(file.name)
                });
            }

            const newForm = {
                title,
                description,
                category,
                attachments, // New array field
                downloads: 0,
                createdAt: serverTimestamp(),
            };

            await addDoc(collection(firestore, 'legalForms'), newForm);

            toast({
                title: "สร้างแบบฟอร์มสำเร็จ",
                description: `แบบฟอร์ม "${title}" พร้อมไฟล์ ${attachments.length} ไฟล์ ได้ถูกเพิ่มแล้ว`,
            });
            router.push(adminFormsPath);

        } catch (error: any) {
            console.error("Error creating form:", error);
            toast({
                variant: "destructive",
                title: "เกิดข้อผิดพลาด",
                description: error.message,
            });
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <main className="flex-1 p-4 sm:px-6 sm:py-0 md:p-8">
            <div className="mx-auto grid max-w-2xl flex-1 auto-rows-max gap-4">
                <div className="flex items-center gap-4">
                    <Link href={adminFormsPath}>
                        <Button variant="outline" size="icon" className="h-7 w-7" disabled={isSaving}>
                            <ChevronLeft className="h-4 w-4" />
                            <span className="sr-only">กลับ</span>
                        </Button>
                    </Link>
                    <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                        เพิ่มแบบฟอร์มใหม่
                    </h1>
                    <div className="hidden items-center gap-2 md:ml-auto md:flex">
                        <Link href={adminFormsPath}>
                            <Button variant="outline" size="sm" disabled={isSaving}>
                                ยกเลิก
                            </Button>
                        </Link>
                        <Button size="sm" onClick={handleSaveChanges} disabled={isSaving}>
                            {isSaving ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}
                        </Button>
                    </div>
                </div>
                <Card className="rounded-xl">
                    <CardHeader>
                        <CardTitle>ข้อมูลแบบฟอร์ม</CardTitle>
                        <CardDescription>
                            กรอกรายละเอียดและอัปโหลดไฟล์เอกสาร (รองรับหลายไฟล์)
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-6">
                            <div className="grid gap-3">
                                <Label htmlFor="title">ชื่อเอกสาร <span className="text-red-500">*</span></Label>
                                <Input
                                    id="title"
                                    type="text"
                                    className="w-full"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="เช่น สัญญาจ้างแรงงานฉบับมาตรฐาน"
                                />
                            </div>

                            <div className="grid gap-3">
                                <Label htmlFor="category">หมวดหมู่ <span className="text-red-500">*</span></Label>
                                <div className="space-y-2">
                                    <Select
                                        value={isCustomCategory ? 'custom' : (CATEGORIES.includes(category) ? category : '')}
                                        onValueChange={(val) => {
                                            if (val === 'custom') {
                                                setIsCustomCategory(true);
                                                setCategory('');
                                            } else {
                                                setIsCustomCategory(false);
                                                setCategory(val);
                                            }
                                        }}
                                    >
                                        <SelectTrigger id="category">
                                            <SelectValue placeholder="เลือกหมวดหมู่" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {CATEGORIES.filter(c => c !== "อื่นๆ").map(cat => (
                                                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                            ))}
                                            <SelectItem value="custom">อื่นๆ (ระบุเอง)</SelectItem>
                                        </SelectContent>
                                    </Select>

                                    {isCustomCategory && (
                                        <Input
                                            placeholder="ระบุหมวดหมู่..."
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value)}
                                            className="mt-2"
                                        />
                                    )}
                                </div>
                            </div>

                            <div className="grid gap-3">
                                <Label htmlFor="description">รายละเอียด (ถ้ามี)</Label>
                                <Textarea
                                    id="description"
                                    placeholder="คำอธิบายเพิ่มเติมเกี่ยวกับเอกสารนี้..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={4}
                                />
                            </div>

                            <div className="grid gap-3">
                                <Label>ไฟล์เอกสาร <span className="text-red-500">*</span></Label>

                                {/* File List */}
                                {selectedFiles.length > 0 && (
                                    <div className="space-y-2 mb-2">
                                        {selectedFiles.map((file, index) => (
                                            <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                                                <div className="flex items-center gap-3 overflow-hidden">
                                                    <div className="bg-white p-2 rounded border border-slate-100">
                                                        <FileText className="h-5 w-5 text-blue-600" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-medium truncate">{file.name}</p>
                                                        <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                                    </div>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-slate-400 hover:text-red-500"
                                                    onClick={() => removeFile(index)}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="flex items-center gap-4">
                                    <Input
                                        id="file-upload"
                                        type="file"
                                        multiple // Allow multiple files
                                        accept=".pdf,.doc,.docx,.xls,.xlsx"
                                        className="hidden"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                    />
                                    <Button
                                        variant="outline"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-full border-dashed border-2 h-24 flex flex-col gap-2 hover:bg-slate-50 hover:border-blue-500 hover:text-blue-600 transition-colors"
                                    >
                                        <Paperclip className="h-6 w-6" />
                                        <span>คลิกเพื่อเลือกไฟล์ (เลือกได้หลายไฟล์)</span>
                                    </Button>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    รองรับไฟล์ PDF, Word, Excel ขนาดไม่เกิน 5MB ต่อไฟล์
                                </p>
                            </div>

                        </div>
                    </CardContent>
                </Card>
                <div className="flex items-center justify-end gap-2 md:hidden">
                    <Link href={adminFormsPath}>
                        <Button variant="outline" size="sm" disabled={isSaving}>
                            ยกเลิก
                        </Button>
                    </Link>
                    <Button size="sm" onClick={handleSaveChanges} disabled={isSaving}>
                        {isSaving ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}
                    </Button>
                </div>
            </div>
        </main>
    )
}
