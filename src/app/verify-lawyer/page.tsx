'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, ShieldCheck, ShieldAlert, Loader2, ArrowLeft, FileText } from 'lucide-react';
import Image from 'next/image';
import { getLawyerById } from '@/lib/data';
import type { LawyerProfile } from '@/lib/types';
import React from 'react';
import Link from 'next/link';
import { useFirebase } from '@/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Dialog, DialogContent } from '@/components/ui/dialog';

function VerifyLawyerContent() {
  const searchParams = useSearchParams();
  const licenseNumberFromQuery = searchParams.get('licenseNumber');
  const { firestore } = useFirebase();

  const [licenseNumber, setLicenseNumber] = useState(licenseNumberFromQuery || '');
  const [lawyerName, setLawyerName] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<'found' | 'not_found' | 'error' | null>(null);
  const [verifiedLawyer, setVerifiedLawyer] = useState<LawyerProfile | null>(null);
  const [isResultOpen, setIsResultOpen] = useState(false);

  useEffect(() => {
    if (licenseNumberFromQuery) {
      handleVerify();
    }
  }, [licenseNumberFromQuery]);

  const handleVerify = async () => {
    if (!firestore) return;
    if (!licenseNumber && !lawyerName) return;

    setIsVerifying(true);
    setVerificationResult(null);
    setVerifiedLawyer(null);
    setIsResultOpen(false);

    try {
      const lawyersRef = collection(firestore, 'lawyerProfiles');
      let q;

      if (licenseNumber) {
        q = query(lawyersRef, where('licenseNumber', '==', licenseNumber), where('status', '==', 'approved'));
      } else if (lawyerName) {
        q = query(lawyersRef, where('name', '==', lawyerName), where('status', '==', 'approved'));
      }

      if (q) {
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const lawyerDoc = querySnapshot.docs[0];
          setVerifiedLawyer({ id: lawyerDoc.id, ...lawyerDoc.data() } as LawyerProfile);
          setVerificationResult('found');
        } else {
          setVerificationResult('not_found');
        }
        setIsResultOpen(true);
      }
    } catch (error) {
      console.error("Verification error:", error);
      setVerificationResult('error');
      setIsResultOpen(true);
    } finally {
      setIsVerifying(false);
    }
  };

  const ResultDialog = () => {
    if (!verificationResult) return null;

    if (verificationResult === 'found' && verifiedLawyer) {
      return (
        <Dialog open={isResultOpen} onOpenChange={setIsResultOpen}>
          <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-sm border-none shadow-2xl rounded-3xl p-0 overflow-hidden">
            <div className="bg-gradient-to-br from-emerald-50 to-green-50 p-8 flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-sm">
                <ShieldCheck className="w-10 h-10" />
              </div>

              <h2 className="text-2xl font-bold text-green-800 mb-2">ตรวจสอบพบข้อมูล</h2>
              <p className="text-green-600/80 mb-8">ทนายความนี้ได้รับการยืนยันในระบบ Lawslane</p>

              <div className="relative mb-6">
                <div className="w-32 h-32 rounded-full p-1 bg-white shadow-lg flex items-center justify-center overflow-hidden">
                  {verifiedLawyer.imageUrl ? (
                    <Image
                      src={verifiedLawyer.imageUrl}
                      alt={verifiedLawyer.name}
                      width={128}
                      height={128}
                      className="rounded-full w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-100 flex items-center justify-center rounded-full text-slate-400">
                      <ShieldCheck className="w-16 h-16" />
                    </div>
                  )}
                </div>
              </div>

              <h3 className="text-3xl font-bold text-[#0B3979] mb-2">{verifiedLawyer.name}</h3>
              <p className="text-slate-500 text-lg mb-1">เลขที่ใบอนุญาต: {verifiedLawyer.licenseNumber}</p>
              <p className="text-[#0B3979] font-medium mb-8">{verifiedLawyer.specialty.join(', ')}</p>

              <Button asChild className="w-40 h-12 rounded-full bg-[#0B3979] hover:bg-[#082a5a] text-white font-semibold text-lg shadow-lg shadow-blue-900/20">
                <Link href={`/lawyers/${verifiedLawyer.id}`}>
                  ดูโปรไฟล์
                </Link>
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      );
    }

    if (verificationResult === 'not_found') {
      return (
        <Dialog open={isResultOpen} onOpenChange={setIsResultOpen}>
          <DialogContent className="sm:max-w-md bg-white border-none shadow-2xl rounded-3xl p-8 text-center">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShieldAlert className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-red-800 mb-2">ไม่พบข้อมูล</h2>
            <p className="text-slate-500 mb-6">
              ไม่พบข้อมูลทนายความตามข้อมูลที่ระบุ<br />กรุณาตรวจสอบความถูกต้อง หรือติดต่อเจ้าหน้าที่
            </p>
            <Button onClick={() => setIsResultOpen(false)} className="h-12 w-full rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200">
              ปิดหน้าต่าง
            </Button>
          </DialogContent>
        </Dialog>
      )
    }

    return null;
  }

  return (
    <div className="min-h-screen bg-[#F4F6F9] flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
      {/* Decorative Background Elements (Light Mode) */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-blue-100/50 blur-3xl animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[30%] h-[30%] rounded-full bg-indigo-100/50 blur-3xl" />
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column: Text Content */}
          <div className="space-y-8 text-center lg:text-left">
            <Link href="/" className="inline-flex items-center text-sm text-slate-500 hover:text-[#0B3979] transition-colors mb-4 font-medium">
              <ArrowLeft className="w-4 h-4 mr-2" />
              กลับไปหน้าแรก
            </Link>

            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight font-headline text-[#0B3979] leading-tight">
                ตรวจสอบ<br />สถานะทนายความ
              </h1>
              <p className="text-slate-500 text-lg md:text-xl leading-relaxed max-w-lg mx-auto lg:mx-0">
                สร้างความมั่นใจโดยการตรวจสอบข้อมูลใบอนุญาตว่าความ เพื่อความถูกต้องและปลอดภัยในการใช้บริการ
              </p>
            </div>

            <div className="hidden lg:block pt-8">
              <div className="flex items-center space-x-4 text-slate-400 text-sm">
                <div className="flex items-center">
                  <ShieldCheck className="w-4 h-4 mr-2" />
                  ข้อมูลจากสภาทนายความ
                </div>
                <div className="w-1 h-1 bg-slate-300 rounded-full" />
                <div>อัปเดตล่าสุด: วันนี้</div>
              </div>
            </div>
          </div>

          {/* Right Column: Verification Form */}
          <div className="w-full max-w-lg mx-auto lg:ml-auto">
            <Card className="shadow-2xl rounded-[32px] border-none overflow-hidden bg-white">
              <CardHeader className="text-center pt-10 pb-2 space-y-6">
                <div className="w-16 h-16 bg-blue-50 text-[#0B3979] rounded-full flex items-center justify-center mx-auto">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <CardTitle className="text-3xl font-bold font-headline text-[#0B3979]">ระบุข้อมูลเพื่อตรวจสอบ</CardTitle>
                  <CardDescription className="text-lg text-slate-500">กรอกเลขใบอนุญาตว่าความ หรือชื่อ-นามสกุลทนายความ</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-8 p-8 md:p-10">
                <div className="space-y-8">
                  <div className="space-y-3">
                    <Label htmlFor="license-number" className="text-lg font-bold text-[#0B3979]">เลขใบอนุญาตว่าความ</Label>
                    <div className="relative">
                      <Input
                        id="license-number"
                        placeholder="เช่น 12345/2550"
                        value={licenseNumber}
                        onChange={(e) => setLicenseNumber(e.target.value)}
                        disabled={isVerifying}
                        className="h-14 text-lg pl-12 rounded-xl border-slate-200 bg-[#F8FAFC] focus:bg-white transition-all"
                      />
                      <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400" />
                    </div>
                  </div>

                  <div className="relative py-2">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-slate-200" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="bg-white px-4 text-slate-400">
                        หรือ
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="lawyer-name" className="text-lg font-bold text-[#0B3979]">ชื่อ-นามสกุลทนายความ</Label>
                    <div className="relative">
                      <Input
                        id="lawyer-name"
                        placeholder="ระบุชื่อ-นามสกุล"
                        value={lawyerName}
                        onChange={(e) => setLawyerName(e.target.value)}
                        disabled={isVerifying}
                        className="h-14 text-lg pl-12 rounded-xl border-slate-200 bg-white"
                      />
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400" />
                    </div>
                  </div>

                  <Button onClick={handleVerify} className="w-full h-14 rounded-full text-xl font-semibold bg-[#8FA3B8] hover:bg-[#7088A0] text-white shadow-lg transition-all" size="lg" disabled={isVerifying || (!licenseNumber && !lawyerName)}>
                    {isVerifying ? (
                      <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                    ) : (
                      <Search className="mr-2 h-6 w-6" />
                    )}
                    ตรวจสอบข้อมูล
                  </Button>
                </div>
              </CardContent>
            </Card>

            {isVerifying && (
              <div className="text-center text-muted-foreground bg-white p-6 rounded-2xl shadow-lg mt-6">
                <Loader2 className="w-10 h-10 mx-auto animate-spin mb-4 text-[#0B3979]" />
                <p className="text-lg">กำลังตรวจสอบข้อมูลจากสภาทนายความ (จำลอง)...</p>
              </div>
            )}

            <ResultDialog />

          </div>
        </div>
      </div>
    </div>
  );
}


export default function VerifyLawyerPage() {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <VerifyLawyerContent />
    </React.Suspense>
  )
}
