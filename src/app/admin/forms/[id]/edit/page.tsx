'use client'

import * as React from 'react'
import {
    ChevronLeft,
    Upload,
    X,
    FileText,
    Paperclip,
    Trash2
} from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
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
import { doc, updateDoc } from 'firebase/firestore'
import { getLegalFormById } from '@/lib/data'
import { uploadToR2 } from '@/app/actions/upload-r2';
import { MAX_FILE_SIZE_BYTES, MAX_FILE_SIZE_MB } from '@/lib/constants';
import type { LegalForm, LegalFormAttachment } from '@/lib/types';

const CATEGORIES = [
    "สัญญาธุรกิจ",
    "สัญญาจ้างงาน",
    "อสังหาริมทรัพย์",
    "ครอบครัวและมรดก",
    "หนังสือมอบอำนาจ",
    "อื่นๆ"
];

export default function AdminFormEditPage() {
    const params = useParams()
    const router = useRouter()
    const { id } = params
    const { toast } = useToast()
    const { firestore } = useFirebase();

    const [form, setForm] = React.useState<LegalForm | null>(null);
    const [isCustomCategory, setIsCustomCategory] = React.useState(false);
    const [isSaving, setIsSaving] = React.useState(false);

    // Attachments state
    const [attachments, setAttachments] = React.useState<LegalFormAttachment[]>([]);
    const [newFiles, setNewFiles] = React.useState<File[]>([]);

    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const adminFormsPath = `/admin/forms`;

    React.useEffect(() => {
        if (!firestore || !id) return;
        getLegalFormById(firestore, id as string).then(data => {
            if (data) {
                setForm(data);

                // Check if category is custom
                if (data.category && !CATEGORIES.includes(data.category)) {
                    setIsCustomCategory(true);
                }

                // Initialize attachments
                if (data.attachments && data.attachments.length > 0) {
                    setAttachments(data.attachments);
                } else if (data.fileUrl) {
                    // Migrate legacy single file to attachments for UI
                    setAttachments([{
                        url: data.fileUrl,
                        name: data.fileName || 'Document',
                        type: data.fileType || 'pdf'
                    }]);
                }
            }
        });
    }, [id, firestore]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (!form) return;
        const { id, value } = e.target;
        setForm({ ...form, [id]: value });
    };

    const handleCategoryChange = (value: string) => {
        if (!form) return;
        setForm({ ...form, category: value });
    };

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

            setNewFiles(prev => [...prev, ...validFiles]);
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const removeAttachment = (index: number) => {
        setAttachments(prev => prev.filter((_, i) => i !== index));
    };

    const removeNewFile = (index: number) => {
        setNewFiles(prev => prev.filter((_, i) => i !== index));
    };

    const getFileType = (fileName: string): 'pdf' | 'doc' | 'docx' | 'xls' | 'xlsx' => {
        const ext = fileName.split('.').pop()?.toLowerCase();
        if (['pdf', 'doc', 'docx', 'xls', 'xlsx'].includes(ext || '')) {
            return ext as any;
        }
        return 'pdf';
    };

    const handleSaveChanges = async () => {
        if (!firestore || !form) return;

        if (!form.title || !form.category) {
            toast({
                variant: "destructive",
                title: "กรุณากรอกข้อมูล",
                description: "กรุณาระบุชื่อเอกสารและหมวดหมู่",
            });
            return;
        }

        if (attachments.length === 0 && newFiles.length === 0) {
            toast({
                variant: "destructive",
                title: "กรุณาเลือกไฟล์",
                description: "ต้องมีไฟล์อย่างน้อย 1 ไฟล์",
            });
            return;
        }

        setIsSaving(true);

        try {
            const finalAttachments = [...attachments];

            // Upload new files
            for (const file of newFiles) {
                const formData = new FormData();
                formData.append('file', file);

                toast({
                    title: `กำลังอัปโหลด ${file.name}...`,
                });

                const url = await uploadToR2(formData, 'forms');
                finalAttachments.push({
                    url,
                    name: file.name,
                    type: getFileType(file.name)
                });
            }

            const formRef = doc(firestore, 'legalForms', form.id);

            const updatedData: any = {
                title: form.title,
                description: form.description,
                category: form.category,
                attachments: finalAttachments,
            };

            // Clear legacy fields if we are fully migrated
            // But keeping them might be safer? No, let's just rely on attachments now.
            // Actually, for backward compatibility with other parts of the app (if any), 
            // we might want to sync the first attachment to the legacy fields.
            if (finalAttachments.length > 0) {
                updatedData.fileUrl = finalAttachments[0].url;
                updatedData.fileName = finalAttachments[0].name;
                updatedData.fileType = finalAttachments[0].type;
            }

            await updateDoc(formRef, updatedData);

            toast({
                title: "บันทึกข้อมูลสำเร็จ",
                description: `แบบฟอร์ม "${form.title}" ได้รับการอัปเดตแล้ว`,
            });
            router.push(adminFormsPath);

        } catch (error: any) {
            console.error("Error updating form:", error);
            toast({
                variant: "destructive",
                title: "เกิดข้อผิดพลาด",
                description: error.message,
            });
        } finally {
            setIsSaving(false);
        }
    }

    if (!form) {
        return <div>Loading...</div>
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
                        แก้ไขแบบฟอร์ม
                    </h1>
                    <div className="hidden items-center gap-2 md:ml-auto md:flex">
                        <Link href={adminFormsPath}>
                            <Button variant="outline" size="sm" disabled={isSaving}>
                                ยกเลิก
                            </Button>
                        </Link>
                        <Button size="sm" onClick={handleSaveChanges} disabled={isSaving}>
                            {isSaving ? 'กำลังบันทึก...' : 'บันทึกการเปลี่ยนแปลง'}
                        </Button>
                    </div>
                </div>
                <Card className="rounded-xl">
                    <CardHeader>
                        <CardTitle>ข้อมูลแบบฟอร์ม</CardTitle>
                        <CardDescription>
                            แก้ไขรายละเอียดและจัดการไฟล์เอกสาร
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
                                    value={form.title}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="grid gap-3">
                                <Label htmlFor="category">หมวดหมู่ <span className="text-red-500">*</span></Label>
                                <div className="space-y-2">
                                    <Select
                                        value={isCustomCategory ? 'custom' : (CATEGORIES.includes(form.category) ? form.category : '')}
                                        onValueChange={(val) => {
                                            if (val === 'custom') {
                                                setIsCustomCategory(true);
                                                handleCategoryChange('');
                                            } else {
                                                setIsCustomCategory(false);
                                                handleCategoryChange(val);
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
                                            value={form.category}
                                            onChange={(e) => handleCategoryChange(e.target.value)}
                                            className="mt-2"
                                        />
                                    )}
                                </div>
                            </div>

                            <div className="grid gap-3">
                                <Label htmlFor="description">รายละเอียด (ถ้ามี)</Label>
                                <Textarea
                                    id="description"
                                    value={form.description}
                                    onChange={handleInputChange}
                                    rows={4}
                                />
                            </div>

                            <div className="grid gap-3">
                                <Label>ไฟล์เอกสาร <span className="text-red-500">*</span></Label>

                                {/* Existing Attachments */}
                                {attachments.length > 0 && (
                                    <div className="space-y-2 mb-2">
                                        <Label className="text-xs text-slate-500">ไฟล์เดิมที่มีอยู่</Label>
                                        {attachments.map((file, index) => (
                                            <div key={`existing-${index}`} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                                                <div className="flex items-center gap-3 overflow-hidden">
                                                    <div className="bg-white p-2 rounded border border-slate-100">
                                                        <FileText className="h-5 w-5 text-blue-600" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium truncate hover:underline text-blue-700">
                                                            {file.name}
                                                        </a>
                                                        <p className="text-xs text-slate-500 uppercase">{file.type}</p>
                                                    </div>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-slate-400 hover:text-red-500"
                                                    onClick={() => removeAttachment(index)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* New Files */}
                                {newFiles.length > 0 && (
                                    <div className="space-y-2 mb-2">
                                        <Label className="text-xs text-green-600">ไฟล์ใหม่ที่กำลังจะเพิ่ม</Label>
                                        {newFiles.map((file, index) => (
                                            <div key={`new-${index}`} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                                                <div className="flex items-center gap-3 overflow-hidden">
                                                    <div className="bg-white p-2 rounded border border-green-100">
                                                        <FileText className="h-5 w-5 text-green-600" />
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
                                                    onClick={() => removeNewFile(index)}
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
                                        multiple
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
                                        <span>คลิกเพื่อเพิ่มไฟล์ (เลือกได้หลายไฟล์)</span>
                                    </Button>
                                </div>
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
                        {isSaving ? 'กำลังบันทึก...' : 'บันทึกการเปลี่ยนแปลง'}
                    </Button>
                </div>
            </div>
        </main>
    )
}
