
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, ShieldCheck, ShieldAlert, Loader2, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { getLawyerById } from '@/lib/data';
import type { LawyerProfile } from '@/lib/types';
import React from 'react';
import Link from 'next/link';
import { useFirebase } from '@/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

function VerifyLawyerContent() {
  const searchParams = useSearchParams();
  const licenseNumberFromQuery = searchParams.get('licenseNumber');
  const { firestore } = useFirebase();

  const [licenseNumber, setLicenseNumber] = useState(licenseNumberFromQuery || '');
  const [lawyerName, setLawyerName] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<'found' | 'not_found' | 'error' | null>(null);
  const [verifiedLawyer, setVerifiedLawyer] = useState<LawyerProfile | null>(null);

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

    try {
      const lawyersRef = collection(firestore, 'lawyerProfiles');
      let q;

      if (licenseNumber) {
        q = query(lawyersRef, where('licenseNumber', '==', licenseNumber), where('status', '==', 'approved'));
      } else if (lawyerName) {
        // Note: This is an exact match. For partial match, we'd need a different approach (e.g. Algolia or client-side filter if small dataset)
        // For now, assuming exact name match for simplicity and performance
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
      }
    } catch (error) {
      console.error("Verification error:", error);
      setVerificationResult('error');
    } finally {
      setIsVerifying(false);
    }
  };

  const ResultCard = () => {
    if (!verificationResult) return null;

    switch (verificationResult) {
      case 'found':
        if (!verifiedLawyer) return null;
        return (
          <Card className="border-green-500 bg-green-50/50">
            <CardHeader className="text-center">
              <ShieldCheck className="w-12 h-12 mx-auto text-green-600" />
              <CardTitle className="text-green-800">ตรวจสอบพบข้อมูล</CardTitle>
              <CardDescription>ทนายความนี้ได้รับการยืนยันในระบบ Lawslane</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center text-center">
              <Image
                src={verifiedLawyer.imageUrl}
                alt={verifiedLawyer.name}
                width={100}
                height={100}
                className="rounded-full object-cover border-4 border-white shadow-lg"
              />
              <p className="font-bold text-xl mt-4">{verifiedLawyer.name}</p>
              <p className="text-muted-foreground">เลขที่ใบอนุญาต: {verifiedLawyer.licenseNumber}</p>
              <p className="text-primary font-semibold mt-1">{verifiedLawyer.specialty.join(', ')}</p>
              <Button asChild className="mt-4">
                <Link href={`/lawyers/${verifiedLawyer.id}`}>
                  ดูโปรไฟล์
                </Link>
              </Button>
            </CardContent>
          </Card>
        );
      case 'not_found':
        return (
          <Card className="border-yellow-500 bg-yellow-50/50">
            <CardHeader className="text-center">
              <ShieldAlert className="w-12 h-12 mx-auto text-yellow-600" />
              <CardTitle className="text-yellow-800">ไม่พบข้อมูล</CardTitle>
              <CardDescription>ไม่พบข้อมูลทนายความตามข้อมูลที่ระบุ<br />กรุณาตรวจสอบความถูกต้อง หรือติดต่อเจ้าหน้าที่</CardDescription>
            </CardHeader>
          </Card>
        );
      default:
        return null;
    }
  }

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-160px)] py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-2xl mx-auto space-y-8">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground mb-4 inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            กลับไปหน้าแรก
          </Link>
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline">
              ตรวจสอบสถานะทนายความ
            </h1>
            <p className="max-w-2xl mx-auto mt-4 text-muted-foreground md:text-xl">
              สร้างความมั่นใจโดยการตรวจสอบข้อมูลใบอนุญาตว่าความ
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>ระบุข้อมูลเพื่อตรวจสอบ</CardTitle>
              <CardDescription>กรอกเลขใบอนุญาตว่าความ หรือชื่อ-นามสกุลทนายความ</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="license-number">เลขใบอนุญาตว่าความ</Label>
                  <Input
                    id="license-number"
                    placeholder="เช่น 12345/2550"
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                    disabled={isVerifying}
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">
                      หรือ
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lawyer-name">ชื่อ-นามสกุลทนายความ</Label>
                  <Input
                    id="lawyer-name"
                    placeholder="ระบุชื่อ-นามสกุล"
                    value={lawyerName}
                    onChange={(e) => setLawyerName(e.target.value)}
                    disabled={isVerifying}
                  />
                </div>

                <Button onClick={handleVerify} className="w-full" size="lg" disabled={isVerifying || (!licenseNumber && !lawyerName)}>
                  {isVerifying ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="mr-2 h-4 w-4" />
                  )}
                  ตรวจสอบข้อมูล
                </Button>
              </div>
            </CardContent>
          </Card>

          {isVerifying && (
            <div className="text-center text-muted-foreground">
              <Loader2 className="w-8 h-8 mx-auto animate-spin mb-2" />
              <p>กำลังตรวจสอบข้อมูลจากสภาทนายความ (จำลอง)...</p>
            </div>
          )}

          <ResultCard />

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
