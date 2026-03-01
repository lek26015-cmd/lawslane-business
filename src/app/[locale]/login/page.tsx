'use client';
export const runtime = 'edge';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Lock, LogIn, ChevronLeft, Sparkles } from 'lucide-react';
import { Link } from '@/navigation';
import Logo from '@/components/logo';
import { useTranslations } from 'next-intl';
import { initializeFirebase } from '@/firebase';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useRouter, useSearchParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

export default function B2BLoginPage() {
    const t = useTranslations('B2BLanding');
    const tAuth = useTranslations('Auth');
    const router = useRouter();
    const searchParams = useSearchParams();
    const { toast } = useToast();
    const redirectUrl = searchParams.get('redirect');

    const [loading, setLoading] = React.useState(false);
    const [formData, setFormData] = React.useState({ email: '', password: '' });

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const { auth } = initializeFirebase();
        if (!auth) return;

        try {
            const result = await signInWithEmailAndPassword(auth, formData.email, formData.password);
            const idToken = await result.user.getIdToken();

            await fetch('/api/auth/session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idToken }),
            });

            toast({ title: "Login Successful", description: "Welcome back to your Legal OS." });

            if (redirectUrl) {
                router.push(redirectUrl);
            } else {
                router.push('/overview');
            }
        } catch (error: any) {
            toast({ title: "Login Failed", description: error.message, variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        const { auth } = initializeFirebase();
        if (!auth) return;

        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const idToken = await result.user.getIdToken();

            await fetch('/api/auth/session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idToken }),
            });

            if (redirectUrl) {
                router.push(redirectUrl);
            } else {
                router.push('/overview');
            }
        } catch (error: any) {
            toast({ title: "Google Login Failed", description: error.message, variant: "destructive" });
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center p-4">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none"></div>

            <FadeIn className="w-full max-w-md flex flex-col items-center">
                <div className="mb-12 text-center relative z-10">
                    <Logo href="/" variant="white" className="scale-125 mb-4" subtitle="legal os" />
                </div>

                <Card className="w-full rounded-[32px] border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl relative overflow-hidden z-10">
                    <div className="absolute top-0 left-0 w-full h-1" style={{ background: 'linear-gradient(90deg, #002f4b, #00466c)' }}></div>

                    <CardHeader className="pt-10 pb-6 px-8 text-center">
                        <CardTitle className="text-2xl font-bold text-white mb-2">{t('header.login')}</CardTitle>
                        <CardDescription className="text-slate-400">
                            Access your corporate legal workspace
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="px-8 pb-10 space-y-6">
                        <Button
                            variant="outline"
                            className="w-full h-12 rounded-xl bg-white/5 border-white/10 text-white hover:bg-white/10 gap-3"
                            onClick={handleGoogleLogin}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="20" height="20" className="shrink-0">
                                <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                                <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                                <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                                <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
                            </svg>
                            Continue with Google
                        </Button>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/5"></span></div>
                            <div className="relative flex justify-center text-xs uppercase"><span className="bg-slate-900 px-4 text-slate-500">Or email</span></div>
                        </div>

                        <form onSubmit={handleEmailLogin} className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-slate-300 ml-1">Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-3 text-slate-500 w-5 h-5" />
                                    <Input
                                        type="email"
                                        className="h-12 pl-12 rounded-xl bg-white/5 border-white/10 text-white focus:border-blue-500 transition-colors"
                                        placeholder="name@company.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-300 ml-1">Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-3 text-slate-500 w-5 h-5" />
                                    <Input
                                        type="password"
                                        className="h-12 pl-12 rounded-xl bg-white/5 border-white/10 text-white focus:border-blue-500 transition-colors"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <Button className="w-full h-14 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg mt-4 shadow-lg shadow-blue-500/20" disabled={loading}>
                                {loading ? "Signing in..." : t('header.login')}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <div className="mt-8 text-center relative z-10">
                    <Link href="/" className="text-slate-500 hover:text-white text-sm flex items-center justify-center gap-2 transition-colors">
                        <ChevronLeft className="w-4 h-4" />
                        Back to Landing Page
                    </Link>
                </div>
            </FadeIn>
        </div>
    );
}

// Minimal FadeIn if component missing
function FadeIn({ children, className }: any) {
    return <div className={`animate-in fade-in slide-in-from-bottom-4 duration-700 ${className || ''}`}>{children}</div>;
}
