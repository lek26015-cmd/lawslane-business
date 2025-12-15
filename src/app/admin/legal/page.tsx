'use client';

import { useState, useEffect } from 'react';
import { useFirebase } from '@/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Save } from 'lucide-react';

export default function AdminLegalPage() {
    const { firestore } = useFirebase();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const [privacyContent, setPrivacyContent] = useState('');
    const [termsContent, setTermsContent] = useState('');

    useEffect(() => {
        async function fetchContent() {
            if (!firestore) return;

            try {
                const privacyDoc = await getDoc(doc(firestore, 'siteContent', 'privacy-policy'));
                if (privacyDoc.exists()) {
                    setPrivacyContent(privacyDoc.data().content || '');
                }

                const termsDoc = await getDoc(doc(firestore, 'siteContent', 'terms-of-service'));
                if (termsDoc.exists()) {
                    setTermsContent(termsDoc.data().content || '');
                }
            } catch (error) {
                console.error("Error fetching legal content:", error);
                toast({
                    title: "เกิดข้อผิดพลาด",
                    description: "ไม่สามารถโหลดข้อมูลได้",
                    variant: "destructive",
                });
            } finally {
                setIsLoading(false);
            }
        }

        fetchContent();
    }, [firestore, toast]);

    const handleSave = async (type: 'privacy' | 'terms') => {
        if (!firestore) return;
        setIsSaving(true);

        try {
            const collectionName = 'siteContent';
            const docId = type === 'privacy' ? 'privacy-policy' : 'terms-of-service';
            const content = type === 'privacy' ? privacyContent : termsContent;
            const title = type === 'privacy' ? 'นโยบายความเป็นส่วนตัว' : 'ข้อกำหนดและเงื่อนไข';

            await setDoc(doc(firestore, collectionName, docId), {
                content,
                updatedAt: serverTimestamp(),
            }, { merge: true });

            toast({
                title: "บันทึกเรียบร้อย",
                description: `บันทึกข้อมูล ${title} แล้ว`,
            });
        } catch (error) {
            console.error("Error saving content:", error);
            toast({
                title: "เกิดข้อผิดพลาด",
                description: "ไม่สามารถบันทึกข้อมูลได้",
                variant: "destructive",
            });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return <div className="flex justify-center items-center h-96"><Loader2 className="animate-spin" /></div>;
    }

    return (
        <div className="container mx-auto py-10 space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold font-headline">จัดการเอกสารทางกฎหมาย</h1>
            </div>

            <Tabs defaultValue="privacy" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="privacy">นโยบายความเป็นส่วนตัว</TabsTrigger>
                    <TabsTrigger value="terms">ข้อกำหนดและเงื่อนไข</TabsTrigger>
                </TabsList>

                <TabsContent value="privacy">
                    <Card className="rounded-xl">
                        <CardHeader>
                            <CardTitle>แก้ไขนโยบายความเป็นส่วนตัว (Privacy Policy)</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="privacy-content">เนื้อหา (HTML)</Label>
                                <Textarea
                                    id="privacy-content"
                                    className="min-h-[500px] font-mono text-sm"
                                    value={privacyContent}
                                    onChange={(e) => setPrivacyContent(e.target.value)}
                                    placeholder="<p>ใส่เนื้อหาที่นี่...</p>"
                                />
                                <p className="text-sm text-muted-foreground">
                                    รองรับ HTML Tags เช่น &lt;p&gt;, &lt;h2&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;strong&gt;
                                </p>
                            </div>
                            <Button onClick={() => handleSave('privacy')} disabled={isSaving}>
                                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                บันทึกข้อมูล
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="terms">
                    <Card className="rounded-xl">
                        <CardHeader>
                            <CardTitle>แก้ไขข้อกำหนดและเงื่อนไข (Terms of Service)</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="terms-content">เนื้อหา (HTML)</Label>
                                <Textarea
                                    id="terms-content"
                                    className="min-h-[500px] font-mono text-sm"
                                    value={termsContent}
                                    onChange={(e) => setTermsContent(e.target.value)}
                                    placeholder="<p>ใส่เนื้อหาที่นี่...</p>"
                                />
                                <p className="text-sm text-muted-foreground">
                                    รองรับ HTML Tags เช่น &lt;p&gt;, &lt;h2&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;strong&gt;
                                </p>
                            </div>
                            <Button onClick={() => handleSave('terms')} disabled={isSaving}>
                                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                บันทึกข้อมูล
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
