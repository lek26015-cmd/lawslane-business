
'use client'

import * as React from 'react'
import {
  ChevronLeft,
  Upload,
} from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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
import { getLawyerById } from '@/lib/data'
import { useFirebase } from '@/firebase'
import type { LawyerProfile } from '@/lib/types';
import { Checkbox } from '@/components/ui/checkbox'

import { doc, updateDoc } from 'firebase/firestore';
import { uploadToR2 } from '@/app/actions/upload-r2';
import { MAX_FILE_SIZE_BYTES, MAX_FILE_SIZE_MB } from '@/lib/constants';

export default function AdminLawyerEditPage() {
  const params = useParams()
  const router = useRouter()
  const { id } = params
  const { toast } = useToast()
  const { firestore } = useFirebase();

  const [lawyer, setLawyer] = React.useState<LawyerProfile | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE_BYTES) {
        toast({
          variant: "destructive",
          title: "ไฟล์มีขนาดใหญ่เกินไป",
          description: `กรุณาอัปโหลดไฟล์ขนาดไม่เกิน ${MAX_FILE_SIZE_MB}MB`,
        });
        e.target.value = '';
        return;
      }

      try {
        toast({ title: "กำลังอัปโหลดรูปภาพ...", description: "Uploading to R2..." });

        const formData = new FormData();
        formData.append('file', file);
        const url = await uploadToR2(formData, 'lawyers');

        setLawyer(prev => prev ? { ...prev, imageUrl: url } : null);
        toast({ title: "รูปภาพพร้อมแล้ว", description: "กดบันทึกเพื่อยืนยันการเปลี่ยนแปลง" });
      } catch (error) {
        console.error("Upload failed:", error);
        toast({ variant: "destructive", title: "เกิดข้อผิดพลาด", description: "ไม่สามารถอัปโหลดรูปภาพได้" });
      }
    }
  };

  React.useEffect(() => {
    if (!firestore || !id) return;
    getLawyerById(firestore, id as string).then(l => setLawyer(l || null));
  }, [id, firestore]);

  const handleSaveChanges = async () => {
    if (!lawyer || !firestore || !id) return;

    try {
      const lawyerRef = doc(firestore, 'lawyerProfiles', id as string);
      await updateDoc(lawyerRef, {
        name: lawyer.name,
        status: lawyer.status,
        specialty: lawyer.specialty,
        imageUrl: lawyer.imageUrl // Add imageUrl to update
      });

      toast({
        title: "บันทึกข้อมูลสำเร็จ",
        description: `ข้อมูลของทนาย ${lawyer.name} ได้รับการอัปเดตแล้ว`,
      })
      router.push(`/admin/lawyers/${id}`);
    } catch (error) {
      console.error("Error updating lawyer:", error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถบันทึกข้อมูลได้",
        variant: "destructive"
      });
    }
  }

  if (!lawyer) {
    return <div>Loading...</div>
  }

  const allSpecialties = ['คดีฉ้อโกง SMEs', 'คดีแพ่งและพาณิชย์', 'การผิดสัญญา', 'ทรัพย์สินทางปัญญา', 'กฎหมายแรงงาน'];


  return (
    <main className="flex-1 p-4 sm:px-6 sm:py-0 md:p-8">
      <div className="mx-auto grid max-w-2xl flex-1 auto-rows-max gap-4">
        <div className="flex items-center gap-4">
          <Link href={`/admin/lawyers/${id}`}>
            <Button variant="outline" size="icon" className="h-7 w-7">
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">กลับ</span>
            </Button>
          </Link>
          <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
            แก้ไขข้อมูลทนายความ
          </h1>
          <div className="hidden items-center gap-2 md:ml-auto md:flex">
            <Link href={`/admin/lawyers/${id}`}>
              <Button variant="outline" size="sm">
                ยกเลิก
              </Button>
            </Link>
            <Button size="sm" onClick={handleSaveChanges}>
              บันทึกการเปลี่ยนแปลง
            </Button>
          </div>
        </div>
        <Card className="rounded-xl">
          <CardHeader>
            <CardTitle>ข้อมูลโปรไฟล์</CardTitle>
            <CardDescription>
              จัดการข้อมูลส่วนตัวและสถานะของทนายความ
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              <div className="grid gap-3">
                <Label htmlFor="picture">รูปโปรไฟล์</Label>
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={lawyer.imageUrl} />
                    <AvatarFallback>{lawyer.name.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                    <Upload className="h-4 w-4 mr-2" />
                    เปลี่ยนรูป
                  </Button>
                </div>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="name">ชื่อ-นามสกุล</Label>
                <Input
                  id="name"
                  type="text"
                  className="w-full"
                  value={lawyer.name}
                  onChange={(e) => setLawyer({ ...lawyer, name: e.target.value })}
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="status">สถานะ</Label>
                <Select
                  value={lawyer.status}
                  onValueChange={(val: any) => setLawyer({ ...lawyer, status: val })}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="เลือกสถานะ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="approved">อนุมัติแล้ว</SelectItem>
                    <SelectItem value="pending">รอตรวจสอบ</SelectItem>
                    <SelectItem value="rejected">ถูกปฏิเสธ</SelectItem>
                    <SelectItem value="suspended">ถูกระงับ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-3">
                <Label>ความเชี่ยวชาญ</Label>
                <div className="grid grid-cols-2 gap-2">
                  {allSpecialties.map(spec => (
                    <div key={spec} className="flex items-center space-x-2 p-2 rounded-md bg-secondary/50">
                      <Checkbox
                        id={`spec-${spec}`}
                        checked={lawyer.specialty.includes(spec)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setLawyer({ ...lawyer, specialty: [...lawyer.specialty, spec] });
                          } else {
                            setLawyer({ ...lawyer, specialty: lawyer.specialty.filter(s => s !== spec) });
                          }
                        }}
                      />
                      <Label htmlFor={`spec-${spec}`} className="text-sm font-normal">{spec}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="flex items-center justify-end gap-2 md:hidden">
          <Link href={`/admin/lawyers/${id}`}>
            <Button variant="outline" size="sm">
              ยกเลิก
            </Button>
          </Link>
          <Button size="sm" onClick={handleSaveChanges}>
            บันทึกการเปลี่ยนแปลง
          </Button>
        </div>
      </div>
    </main>
  )
}
