'use client';
export const runtime = 'edge';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { CheckCircle2, ChevronLeft, CreditCard, Lock, Mail, ShieldCheck, Sparkles, Loader2, Globe, Zap, Building2, MapPin, FileText } from 'lucide-react';
import { Link } from '@/navigation';
import { useTranslations } from 'next-intl';
import { useUser, useFirebase, initializeFirebase } from '@/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import Logo from '@/components/logo';

function SubscribeContent() {
    const t = useTranslations('B2BLanding');
    const { user, isUserLoading } = useUser();
    const { firestore, auth } = useFirebase();
    const { toast } = useToast();
    const router = useRouter();
    const searchParams = useSearchParams();

    const initialPlan = searchParams.get('plan') || 'Starter';
    const [activePlan, setActivePlan] = useState(initialPlan);
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
    const [loading, setLoading] = useState(false);
    const [isTrial, setIsTrial] = useState(initialPlan === 'Starter');

    // Auth fields (for guest users)
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Card fields (simulation)
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');

    // Company info fields
    const [companyName, setCompanyName] = useState('');
    const [companyBranch, setCompanyBranch] = useState('สำนักงานใหญ่');
    const [companyAddress, setCompanyAddress] = useState('');
    const [taxId, setTaxId] = useState('');

    const plans: Record<string, { price: number; name: string; feat: string[] }> = {
        'Lite': { price: 990, name: 'Lite', feat: ['1 ผู้ใช้งาน', 'พื้นที่เก็บข้อมูล 2GB', '5 เทมเพลต/เดือน'] },
        'Starter': { price: 2900, name: 'Starter', feat: ['2 ผู้ใช้งาน', 'พื้นที่เก็บข้อมูล 10GB', 'ระบบ CLM พื้นฐาน'] },
        'Professional': { price: 5900, name: 'Professional', feat: ['5 ผู้ใช้งาน', 'พื้นที่เก็บข้อมูล 50GB', 'ระบบ CLM มาตรฐาน'] },
        'Business': { price: 8900, name: 'Business', feat: ['10 ผู้ใช้งาน', 'พื้นที่เก็บข้อมูล 200GB', 'ระบบ CLM ขั้นสูง'] },
        'Elite': { price: 18900, name: 'Elite', feat: ['25 ผู้ใช้งาน', 'พื้นที่เก็บข้อมูล 500GB', 'ระบบ Enterprise CLM'] },
    };

    const planKeys = Object.keys(plans);
    const selectedPlan = plans[activePlan] || plans['Starter'];
    const monthlyPrice = selectedPlan.price;
    const yearlyPrice = Math.round(monthlyPrice * 12 * 0.8); // 20% discount
    const currentPrice = billingCycle === 'monthly' ? monthlyPrice : yearlyPrice;

    useEffect(() => {
        if (activePlan !== 'Starter') {
            setIsTrial(false);
        }
    }, [activePlan]);

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            let currentUser = user;

            // 1. Handle Signup if guest
            if (!currentUser) {
                if (!email || !password) {
                    toast({ variant: 'destructive', title: 'กรุณากรอกข้อมูลบัญชี', description: 'ต้องการอีเมลและรหัสผ่านเพื่อสร้างบัญชี' });
                    setLoading(false);
                    return;
                }
                const { auth: firebaseAuth } = initializeFirebase();
                if (!firebaseAuth) throw new Error("Auth not initialized");

                const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
                currentUser = userCredential.user;

                // Create initial profile
                await setDoc(doc(firestore!, 'users', currentUser.uid), {
                    email: currentUser.email,
                    createdAt: new Date(),
                    role: 'admin',
                    subscriptionStatus: 'pending'
                });

                // Set session
                const idToken = await currentUser.getIdToken();
                await fetch('/api/auth/session', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ idToken }),
                });
            }

            // 2. Simulate Payment & Activate
            await new Promise(resolve => setTimeout(resolve, 2000));

            await updateDoc(doc(firestore!, 'users', currentUser!.uid), {
                plan: selectedPlan.name,
                billingCycle: billingCycle,
                subscriptionStatus: isTrial ? 'trialing' : 'active',
                paymentMethod: isTrial ? 'free_trial' : ('card_ending_' + cardNumber.slice(-4)),
                companyName: companyName.trim() || undefined,
                companyBranch: companyBranch.trim() || undefined,
                companyAddress: companyAddress.trim() || undefined,
                taxId: taxId.trim() || undefined,
                updatedAt: new Date()
            });

            toast({ title: 'สำเร็จ! 🎉', description: `คุณเริ่มใช้งานแพ็คเกจ ${selectedPlan.name} เรียบร้อยแล้ว` });
            router.push('/overview');
        } catch (error: any) {
            console.error("Subscription error:", error);
            toast({ variant: 'destructive', title: 'ผิดพลาด', description: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col lg:flex-row gap-10 items-start w-full">
            {/* Left: Plan Summary */}
            <div className="w-full lg:w-[40%] space-y-6">
                <Card className="rounded-[40px] border-none shadow-2xl overflow-hidden bg-[#002f4b] text-white p-8 md:p-12 relative">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Zap className="w-32 h-32 fill-white" />
                    </div>

                    <div className="relative z-10 space-y-8">
                        <div>
                            <p className="text-blue-200 font-bold uppercase tracking-widest text-[10px] mb-2">แพ็คเกจที่คุณเลือก</p>
                            <h2 className="text-4xl font-black">{selectedPlan.name}</h2>
                            <div className="flex items-baseline gap-2 mt-4">
                                <span className="text-5xl font-black">฿{currentPrice.toLocaleString()}</span>
                                <span className="text-blue-200 font-bold">/{billingCycle === 'monthly' ? 'เดือน' : 'ปี'}</span>
                            </div>
                            <div className="flex bg-white/10 p-1 rounded-2xl mt-4">
                                <button
                                    onClick={() => setBillingCycle('monthly')}
                                    className={`flex-1 px-4 py-2 rounded-xl text-xs font-bold transition-all ${billingCycle === 'monthly' ? 'bg-white/20 text-white shadow-sm' : 'text-blue-200/60'}`}
                                >
                                    รายเดือน
                                </button>
                                <button
                                    onClick={() => setBillingCycle('yearly')}
                                    className={`flex-1 px-4 py-2 rounded-xl text-xs font-bold transition-all ${billingCycle === 'yearly' ? 'bg-white/20 text-white shadow-sm' : 'text-blue-200/60'}`}
                                >
                                    รายปี <span className="text-emerald-400 ml-1">ประหยัด 20%</span>
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <p className="font-bold text-sm text-blue-100/60 uppercase tracking-widest">สิ่งที่คุณจะได้รับ:</p>
                            <ul className="space-y-4">
                                {selectedPlan.feat.map((f, i) => (
                                    <li key={i} className="flex items-center gap-3">
                                        <div className="p-1 rounded-full bg-blue-500/20">
                                            <CheckCircle2 className="w-4 h-4 text-blue-400" />
                                        </div>
                                        <span className="font-medium text-blue-50">{f}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="pt-8 border-t border-white/10">
                            <div className="flex items-center gap-4 p-4 rounded-3xl bg-white/5 backdrop-blur-sm">
                                <ShieldCheck className="w-8 h-8 text-blue-400" />
                                <div>
                                    <p className="text-sm font-bold">ระบบความปลอดภัยมาตรฐานโลก</p>
                                    <p className="text-[10px] text-blue-200/60">ข้อมูลบัตรเครดิตของคุณจะถูกเข้ารหัสด้วย SSL 256-bit อย่างปลอดภัยที่สุด</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Plan Selector */}
                <div className="space-y-2">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2">เปลี่ยนแพ็คเกจ</p>
                    <div className="grid grid-cols-1 gap-2">
                        {planKeys.map((key) => {
                            const plan = plans[key];
                            const isActive = key === activePlan;
                            const monthlyP = plan.price;
                            return (
                                <button
                                    key={key}
                                    onClick={() => setActivePlan(key)}
                                    className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all text-left ${isActive
                                        ? 'border-blue-500 bg-blue-50 shadow-md'
                                        : 'border-slate-100 bg-white hover:border-blue-200 hover:shadow-sm'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${isActive ? 'border-blue-500' : 'border-slate-300'
                                            }`}>
                                            {isActive && <div className="w-2 h-2 rounded-full bg-blue-500" />}
                                        </div>
                                        <span className={`font-bold text-sm ${isActive ? 'text-blue-700' : 'text-slate-700'}`}>{plan.name}</span>
                                    </div>
                                    <span className={`font-bold text-sm ${isActive ? 'text-blue-600' : 'text-slate-500'}`}>฿{monthlyP.toLocaleString()}/เดือน</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="p-6 text-center">
                    <Logo href="/" variant="color" className="opacity-40 grayscale hover:grayscale-0 transition-all cursor-pointer" />
                </div>
            </div>

            {/* Right: Checkout Form */}
            <div className="w-full lg:w-[60%] space-y-6 pb-12">
                <Card className="rounded-[40px] border-slate-100 shadow-xl overflow-hidden bg-white">
                    <CardHeader className="p-8 md:p-10 border-b border-slate-50">
                        <div className="mb-2">
                            <CardTitle className="text-2xl font-bold text-slate-900">Checkout</CardTitle>
                        </div>
                        <CardDescription>กรอกข้อมูลเพื่อเริ่มต้นการใช้งานแพ็คเกจระดับโปรของคุณ</CardDescription>
                    </CardHeader>

                    <CardContent className="p-8 md:p-10 space-y-8">
                        <form onSubmit={handleSubscribe} className="space-y-8">

                            {/* Account Info (Only for guests) */}
                            {!user && (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">1</div>
                                        <h3 className="font-bold text-slate-800 uppercase tracking-wider text-xs">สร้างบัญชีผู้ใช้งาน</h3>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-slate-500 text-xs font-bold ml-1">อีเมลแอดเดรส (ที่ทำงาน)</Label>
                                            <div className="relative">
                                                <Mail className="absolute left-4 top-3.5 w-4 h-4 text-slate-300" />
                                                <Input
                                                    type="email"
                                                    placeholder="you@company.com"
                                                    value={email}
                                                    onChange={e => setEmail(e.target.value)}
                                                    className="h-12 pl-12 rounded-2xl border-slate-200 focus:ring-blue-500"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-slate-500 text-xs font-bold ml-1">ตั้งรหัสผ่านของคุณ</Label>
                                            <div className="relative">
                                                <Lock className="absolute left-4 top-3.5 w-4 h-4 text-slate-300" />
                                                <Input
                                                    type="password"
                                                    placeholder="••••••••"
                                                    value={password}
                                                    onChange={e => setPassword(e.target.value)}
                                                    className="h-12 pl-12 rounded-2xl border-slate-200 focus:ring-blue-500"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-slate-400">มีบัญชีอยู่แล้ว? <Link href="/login" className="text-blue-600 font-bold hover:underline">เข้าสู่ระบบที่นี่</Link></p>
                                </div>
                            )}

                            {/* Company Info */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">{user ? 1 : 2}</div>
                                    <h3 className="font-bold text-slate-800 uppercase tracking-wider text-xs">ข้อมูลบริษัท / องค์กร</h3>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-slate-500 text-xs font-bold ml-1">ชื่อบริษัท / องค์กร</Label>
                                    <div className="relative">
                                        <Building2 className="absolute left-4 top-3.5 w-4 h-4 text-slate-300" />
                                        <Input
                                            placeholder="บริษัท ตัวอย่าง จำกัด"
                                            value={companyName}
                                            onChange={e => setCompanyName(e.target.value)}
                                            className="h-12 pl-12 rounded-2xl border-slate-200 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-slate-500 text-xs font-bold ml-1">ที่อยู่สำหรับออกใบกำกับภาษี</Label>
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-3.5 w-4 h-4 text-slate-300" />
                                        <Input
                                            placeholder="123 ถ.สุขุมวิท แขวงคลองตัน เขตคลองเตย กรุงเทพฯ 10110"
                                            value={companyAddress}
                                            onChange={e => setCompanyAddress(e.target.value)}
                                            className="h-12 pl-12 rounded-2xl border-slate-200 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-slate-500 text-xs font-bold ml-1">เลขประจำตัวผู้เสียภาษี</Label>
                                    <div className="relative">
                                        <FileText className="absolute left-4 top-3.5 w-4 h-4 text-slate-300" />
                                        <Input
                                            placeholder="0-1234-56789-01-2"
                                            value={taxId}
                                            onChange={e => setTaxId(e.target.value)}
                                            className="h-12 pl-12 rounded-2xl border-slate-200 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-slate-500 text-xs font-bold ml-1">สาขา / สำนักงานใหญ่</Label>
                                    <div className="relative">
                                        <Building2 className="absolute left-4 top-3.5 w-4 h-4 text-slate-300" />
                                        <Input
                                            placeholder="สาขา 00001 (หรือเว้นไว้ถ้าเป็นสำนักงานใหญ่)"
                                            value={companyBranch}
                                            onChange={e => setCompanyBranch(e.target.value)}
                                            className="h-12 pl-12 rounded-2xl border-slate-200 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Free Trial Toggle */}
                            {activePlan === 'Starter' && (
                                <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100 flex items-center justify-between mt-2">
                                    <div className="space-y-1">
                                        <h4 className="font-bold text-blue-900 text-sm md:text-base flex items-center gap-2">
                                            <Sparkles className="w-4 h-4 text-amber-500" /> ทดลองใช้ฟรี 14 วัน
                                        </h4>
                                        <p className="text-xs text-blue-700/70">เริ่มใช้งานได้ทันที 14 วันแรก โดยยังไม่ต้องกรอกบัตรเครดิต</p>
                                    </div>
                                    <Switch checked={isTrial} onCheckedChange={setIsTrial} />
                                </div>
                            )}

                            {/* Payment Info */}
                            {!isTrial && (
                                <div className="space-y-6">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">{user ? 2 : 3}</div>
                                        <h3 className="font-bold text-slate-800 uppercase tracking-wider text-xs">ข้อมูลบัตรเครดิต</h3>
                                    </div>

                                    <Card className="p-6 rounded-[32px] bg-slate-50 border-none shadow-inner space-y-4">
                                        <div className="space-y-2">
                                            <Label className="text-slate-400 text-[10px] font-black uppercase tracking-widest ml-1">หมายเลขบัตร</Label>
                                            <div className="relative">
                                                <CreditCard className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                                                <Input
                                                    placeholder="0000 0000 0000 0000"
                                                    value={cardNumber}
                                                    onChange={e => setCardNumber(e.target.value)}
                                                    className="h-14 pl-12 text-lg font-mono rounded-2xl border-none shadow-sm focus:ring-blue-500"
                                                    required={!isTrial}
                                                />
                                                <div className="absolute right-4 top-4 flex gap-1">
                                                    <div className="w-8 h-5 bg-slate-200 rounded animate-pulse" />
                                                    <div className="w-8 h-5 bg-slate-300 rounded animate-pulse" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label className="text-slate-400 text-[10px] font-black uppercase tracking-widest ml-1">วันหมดอายุ (MM/YY)</Label>
                                                <Input
                                                    placeholder="MM/YY"
                                                    value={expiry}
                                                    onChange={e => setExpiry(e.target.value)}
                                                    className="h-12 rounded-2xl border-none shadow-sm focus:ring-blue-500 text-center font-bold"
                                                    required={!isTrial}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-slate-400 text-[10px] font-black uppercase tracking-widest ml-1">CVV</Label>
                                                <Input
                                                    type="password"
                                                    placeholder="•••"
                                                    value={cvv}
                                                    onChange={e => setCvv(e.target.value)}
                                                    className="h-12 rounded-2xl border-none shadow-sm focus:ring-blue-500 text-center font-bold"
                                                    required={!isTrial}
                                                />
                                            </div>
                                        </div>
                                    </Card>
                                </div>
                            )}

                            <div className="pt-4">
                                <Button
                                    className="w-full h-16 rounded-[24px] bg-[#002f4b] hover:bg-[#003f66] text-white font-black text-xl shadow-2xl shadow-blue-900/20 transition-all flex items-center justify-center gap-3 relative overflow-hidden group"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-6 h-6 animate-spin" />
                                            กำลังดำเนินการ...
                                        </>
                                    ) : (
                                        <>
                                            {isTrial ? `เริ่มทดลองใช้แพ็คเกจ ${selectedPlan.name} ฟรี 14 วัน` : `ยืนยันการสมัครแพ็คเกจ ${selectedPlan.name}`}
                                            <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none" />
                                        </>
                                    )}
                                </Button>
                                {isTrial ? (
                                    <p className="text-center text-[11px] text-slate-400 mt-4 leading-relaxed">
                                        ยอดชำระสุทธิวันนี้: ฿0.00 (เริ่มเก็บค่าบริการ ฿{currentPrice.toLocaleString()} {billingCycle === 'monthly' ? '/ เดือน' : '/ ปี'} หลังหมดช่วงทดลอง)<br />
                                        การคลิกปุ่มยืนยันถือว่าคุณยอมรับ <span className="underline cursor-pointer">เงื่อนไขการใช้บริการ</span> ของ Lawslane
                                    </p>
                                ) : (
                                    <p className="text-center text-[11px] text-slate-400 mt-4 leading-relaxed">
                                        ยอดชำระสุทธิ: ฿{currentPrice.toLocaleString()} {billingCycle === 'monthly' ? '/ เดือน' : '/ ปี'}.
                                        การคลิกปุ่มยืนยันถือว่าคุณยอมรับ <span className="underline cursor-pointer">เงื่อนไขการใช้บริการ</span> ของ Lawslane
                                    </p>
                                )}
                            </div>
                        </form>
                    </CardContent>
                </Card>

                <div className="flex items-center justify-center gap-8 opacity-40">
                    <div className="flex items-center gap-2">
                        <Lock className="w-3 h-3" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">การชำระเงินปลอดภัย</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Globe className="w-3 h-3" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">มาตรฐานระดับสากล</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function SubscribePage() {
    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header with Logo */}
            <div className="border-b border-slate-100 bg-white">
                <div className="max-w-[1200px] mx-auto px-6 py-4 flex items-center justify-between">
                    <Logo href="/" variant="color" subtitle="legal os" />
                    <Button asChild variant="ghost" className="gap-2 text-slate-500 hover:text-slate-900 font-bold text-sm">
                        <Link href="/">
                            <ChevronLeft className="w-4 h-4" /> กลับไปเลือกแพ็คเกจ
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="max-w-[1200px] mx-auto px-6 py-12 md:py-16">
                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
                        ดำเนินการสมัครสมาชิก
                    </h1>
                </div>

                <Suspense fallback={<div className="flex items-center justify-center p-20"><Loader2 className="animate-spin text-blue-600" /></div>}>
                    <SubscribeContent />
                </Suspense>
            </div>
        </div>
    );
}
