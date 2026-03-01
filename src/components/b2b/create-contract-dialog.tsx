'use client';

import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
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
import { contractService, type ContractData } from '@/services/contractService';
import { Loader2, FileText } from 'lucide-react';

interface CreateContractDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    ownerId: string;
    onCreated?: () => void;
}

const categories: { value: ContractData['category']; label: string }[] = [
    { value: 'nda', label: 'NDA (สัญญารักษาความลับ)' },
    { value: 'employment', label: 'สัญญาจ้างงาน' },
    { value: 'service', label: 'สัญญาบริการ' },
    { value: 'sales', label: 'สัญญาซื้อขาย' },
    { value: 'other', label: 'อื่นๆ' },
];

export default function CreateContractDialog({ open, onOpenChange, ownerId, onCreated }: CreateContractDialogProps) {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);

    const [title, setTitle] = useState('');
    const [category, setCategory] = useState<ContractData['category']>('nda');
    const [employerName, setEmployerName] = useState('');
    const [contractorName, setContractorName] = useState('');
    const [task, setTask] = useState('');
    const [price, setPrice] = useState('');
    const [deadline, setDeadline] = useState('');
    const [notes, setNotes] = useState('');

    const resetForm = () => {
        setTitle('');
        setCategory('nda');
        setEmployerName('');
        setContractorName('');
        setTask('');
        setPrice('');
        setDeadline('');
        setNotes('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim() || !employerName.trim() || !contractorName.trim()) {
            toast({
                title: 'กรุณากรอกข้อมูลให้ครบ',
                description: 'ชื่อสัญญา ชื่อผู้ว่าจ้าง และชื่อผู้รับจ้างจำเป็นต้องกรอก',
                variant: 'destructive',
            });
            return;
        }

        setLoading(true);
        try {
            await contractService.createContract({
                title: title.trim(),
                ownerId,
                category: category || 'other',
                employer: { name: employerName.trim() },
                contractor: { name: contractorName.trim() },
                task: task.trim(),
                price: parseFloat(price) || 0,
                deadline: deadline || '-',
                notes: notes.trim() || undefined,
                status: 'draft',
            });

            toast({
                title: '✅ สร้างสัญญาเรียบร้อย',
                description: `สัญญา "${title}" ถูกสร้างเป็นร่างแล้ว`,
            });

            resetForm();
            onOpenChange(false);
            onCreated?.();
        } catch (error) {
            console.error('Error creating contract:', error);
            toast({
                title: 'เกิดข้อผิดพลาด',
                description: 'ไม่สามารถสร้างสัญญาได้ กรุณาลองใหม่อีกครั้ง',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto rounded-2xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                            <FileText className="w-5 h-5 text-white" />
                        </div>
                        สร้างสัญญาใหม่
                    </DialogTitle>
                    <DialogDescription>
                        กรอกข้อมูลเบื้องต้นเพื่อสร้างร่างสัญญาใหม่
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-5 mt-2">
                    {/* Title */}
                    <div className="space-y-2">
                        <Label htmlFor="title" className="text-sm font-semibold">
                            ชื่อสัญญา <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="title"
                            placeholder="เช่น NDA - บริษัท ABC"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="rounded-xl h-11"
                            required
                        />
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                        <Label htmlFor="category" className="text-sm font-semibold">ประเภทสัญญา</Label>
                        <Select value={category} onValueChange={(val) => setCategory(val as ContractData['category'])}>
                            <SelectTrigger className="rounded-xl h-11">
                                <SelectValue placeholder="เลือกประเภท" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((cat) => (
                                    <SelectItem key={cat.value} value={cat.value!}>
                                        {cat.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Parties */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="employer" className="text-sm font-semibold">
                                ผู้ว่าจ้าง <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="employer"
                                placeholder="ชื่อบริษัท/บุคคล"
                                value={employerName}
                                onChange={(e) => setEmployerName(e.target.value)}
                                className="rounded-xl h-11"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="contractor" className="text-sm font-semibold">
                                ผู้รับจ้าง <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="contractor"
                                placeholder="ชื่อบริษัท/บุคคล"
                                value={contractorName}
                                onChange={(e) => setContractorName(e.target.value)}
                                className="rounded-xl h-11"
                                required
                            />
                        </div>
                    </div>

                    {/* Task */}
                    <div className="space-y-2">
                        <Label htmlFor="task" className="text-sm font-semibold">รายละเอียดงาน</Label>
                        <Textarea
                            id="task"
                            placeholder="อธิบายขอบเขตงานที่ต้องทำ..."
                            value={task}
                            onChange={(e) => setTask(e.target.value)}
                            className="rounded-xl min-h-[80px] resize-none"
                        />
                    </div>

                    {/* Price & Deadline */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="price" className="text-sm font-semibold">มูลค่าสัญญา (บาท)</Label>
                            <Input
                                id="price"
                                type="number"
                                placeholder="0.00"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                className="rounded-xl h-11"
                                min="0"
                                step="0.01"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="deadline" className="text-sm font-semibold">กำหนดส่ง</Label>
                            <Input
                                id="deadline"
                                type="date"
                                value={deadline}
                                onChange={(e) => setDeadline(e.target.value)}
                                className="rounded-xl h-11"
                            />
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="space-y-2">
                        <Label htmlFor="notes" className="text-sm font-semibold">หมายเหตุ</Label>
                        <Textarea
                            id="notes"
                            placeholder="หมายเหตุเพิ่มเติม (ไม่บังคับ)"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="rounded-xl min-h-[60px] resize-none"
                        />
                    </div>

                    <DialogFooter className="pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            className="rounded-xl"
                            disabled={loading}
                        >
                            ยกเลิก
                        </Button>
                        <Button
                            type="submit"
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl gap-2 shadow-lg shadow-blue-500/20"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    กำลังสร้าง...
                                </>
                            ) : (
                                'สร้างสัญญา'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
