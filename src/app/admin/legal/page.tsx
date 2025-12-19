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
import { Loader2, Save, RotateCcw, Eye } from 'lucide-react';
import RichTextEditor from '@/components/rich-text-editor';

const DEFAULT_PRIVACY_CONTENT = `
    <p>
      Lawslane ("เรา", "พวกเรา", หรือ "ของเรา") ให้ความสำคัญกับการคุ้มครองข้อมูลส่วนบุคคลของคุณ
      นโยบายความเป็นส่วนตัวนี้อธิบายถึงวิธีที่เราเก็บรวบรวม, ใช้, เปิดเผย, และจัดการข้อมูลส่วนบุคคลของคุณเมื่อคุณใช้บริการเว็บไซต์และแอปพลิเคชันของเรา
    </p>

    <h2 class="font-semibold text-xl mt-6 mb-2">1. ข้อมูลที่เราเก็บรวบรวม</h2>
    <p>เราอาจเก็บรวบรวมข้อมูลประเภทต่างๆ ดังนี้:</p>
    <ul class="list-disc pl-6 space-y-2 mt-2">
      <li><strong>ข้อมูลที่คุณให้เราโดยตรง:</strong> เช่น ชื่อ, อีเมล, เบอร์โทรศัพท์, และรายละเอียดเกี่ยวกับปัญหาทางกฎหมายของคุณเมื่อคุณกรอกฟอร์มหรือสร้างบัญชี</li>
      <li><strong>ข้อมูลจากการใช้บริการ:</strong> เราอาจรวบรวมข้อมูลเกี่ยวกับวิธีการที่คุณใช้บริการของเรา, ประวัติการเข้าชม, และข้อมูลอุปกรณ์ที่คุณใช้</li>
      <li><strong>คุกกี้และเทคโนโลยีที่คล้ายกัน:</strong> เราใช้คุกกี้เพื่อช่วยให้เว็บไซต์ทำงานได้อย่างมีประสิทธิภาพและเพื่อรวบรวมข้อมูลการใช้งาน</li>
    </ul>

    <h2 class="font-semibold text-xl mt-6 mb-2">2. เราใช้ข้อมูลของคุณอย่างไร</h2>
    <p>เราใช้ข้อมูลที่เก็บรวบรวมเพื่อวัตถุประสงค์ดังต่อไปนี้:</p>
    <ul class="list-disc pl-6 space-y-2 mt-2">
      <li>เพื่อให้บริการและอำนวยความสะดวกในการเชื่อมต่อคุณกับทนายความ</li>
      <li>เพื่อปรับปรุงและพัฒนาคุณภาพของบริการของเรา</li>
      <li>เพื่อสื่อสารกับคุณ, ตอบข้อสงสัย, และส่งข้อมูลที่เกี่ยวข้องกับการบริการ</li>
      <li>เพื่อวัตถุประสงค์ด้านความปลอดภัยและป้องกันการฉ้อโกง</li>
    </ul>

    <h2 class="font-semibold text-xl mt-6 mb-2">3. การเปิดเผยข้อมูล</h2>
    <p>
      เราจะไม่เปิดเผยข้อมูลส่วนบุคคลของคุณต่อบุคคลที่สามโดยไม่ได้รับความยินยอมจากคุณ ยกเว้นในกรณีต่อไปนี้:
    </p>
    <ul class="list-disc pl-6 space-y-2 mt-2">
      <li>เมื่อจำเป็นต้องเปิดเผยข้อมูลให้แก่ทนายความที่คุณเลือกเพื่อดำเนินการให้คำปรึกษา</li>
      <li>เมื่อมีกฎหมายบังคับให้ต้องเปิดเผยข้อมูล</li>
      <li>เพื่อปกป้องสิทธิ์, ทรัพย์สิน, หรือความปลอดภัยของเราและของผู้ใช้อื่นๆ</li>
    </ul>

    <h2 class="font-semibold text-xl mt-6 mb-2">4. การใช้คุกกี้</h2>
    <p>
      เราใช้คุกกี้เพื่อปรับปรุงประสบการณ์การใช้งานของคุณบนเว็บไซต์ของเรา คุกกี้ช่วยให้เราจดจำการตั้งค่าของคุณและวิเคราะห์การเข้าชมเว็บไซต์
      คุณสามารถจัดการหรือลบคุกกี้ได้ผ่านการตั้งค่าเบราว์เซอร์ของคุณ
    </p>

    <h2 class="font-semibold text-xl mt-6 mb-2">5. สิทธิของเจ้าของข้อมูล</h2>
    <p>คุณมีสิทธิตามกฎหมายคุ้มครองข้อมูลส่วนบุคคลในการเข้าถึง, แก้ไข, หรือขอลบข้อมูลส่วนบุคคลของคุณ คุณสามารถใช้สิทธิของคุณได้โดยติดต่อเราตามข้อมูลด้านล่าง</p>

    <h2 class="font-semibold text-xl mt-6 mb-2">6. การเปลี่ยนแปลงนโยบาย</h2>
    <p>เราอาจปรับปรุงนโยบายความเป็นส่วนตัวนี้เป็นครั้งคราว การเปลี่ยนแปลงใดๆ จะมีผลทันทีเมื่อเราเผยแพร่นโยบายฉบับใหม่บนเว็บไซต์นี้</p>

    <h2 class="font-semibold text-xl mt-6 mb-2">7. ติดต่อเรา</h2>
    <p>
      หากคุณมีคำถามหรือข้อกังวลเกี่ยวกับนโยบายความเป็นส่วนตัวนี้ โปรดติดต่อเราได้ที่:
      อีเมล: <a href="mailto:support@lawslane.demo" class="text-primary hover:underline">support@lawslane.demo</a>
    </p>
`;

const DEFAULT_TERMS_CONTENT = `
    <p>
      ยินดีต้อนรับสู่ Lawslane ("บริการ") โปรดอ่านข้อกำหนดและเงื่อนไขการใช้บริการเหล่านี้ ("ข้อกำหนด") อย่างละเอียดก่อนใช้บริการที่ดำเนินการโดยเรา
    </p>

    <h2 class="font-semibold text-xl mt-6 mb-2">1. การยอมรับข้อกำหนด</h2>
    <p>
      โดยการเข้าถึงหรือใช้บริการ คุณตกลงที่จะผูกพันตามข้อกำหนดเหล่านี้ หากคุณไม่ยอมรับส่วนหนึ่งส่วนใดของข้อกำหนด คุณจะไม่สามารถเข้าถึงบริการได้
    </p>

    <h2 class="font-semibold text-xl mt-6 mb-2">2. บัญชีผู้ใช้</h2>
    <p>
      เมื่อคุณสร้างบัญชีกับเรา คุณต้องให้ข้อมูลที่ถูกต้อง ครบถ้วน และเป็นปัจจุบันอยู่เสมอ การไม่ทำเช่นนั้นถือเป็นการละเมิดข้อกำหนด ซึ่งอาจส่งผลให้มีการยุติบัญชีของคุณในบริการของเราทันที
    </p>
    <p>
      คุณมีหน้าที่รับผิดชอบในการรักษารหัสผ่านที่คุณใช้ในการเข้าถึงบริการและสำหรับกิจกรรมหรือการกระทำใด ๆ ภายใต้รหัสผ่านของคุณ
    </p>

    <h2 class="font-semibold text-xl mt-6 mb-2">3. การเชื่อมโยงไปยังเว็บไซต์อื่น</h2>
    <p>
      บริการของเราอาจมีลิงก์ไปยังเว็บไซต์หรือบริการของบุคคลที่สามซึ่งไม่ได้เป็นเจ้าของหรือควบคุมโดย Lawslane เราไม่สามารถควบคุมและไม่รับผิดชอบต่อเนื้อหา นโยบายความเป็นส่วนตัว หรือแนวปฏิบัติของเว็บไซต์หรือบริการของบุคคลที่สามใดๆ
    </p>

    <h2 class="font-semibold text-xl mt-6 mb-2">4. การยุติการให้บริการ</h2>
    <p>
      เราอาจยุติหรือระงับการเข้าถึงบริการของเราได้ทันที โดยไม่ต้องแจ้งให้ทราบล่วงหน้าหรือรับผิด สำหรับเหตุผลใดก็ตาม รวมถึงแต่ไม่จำกัดเพียงหากคุณละเมิดข้อกำหนด
    </p>

    <h2 class="font-semibold text-xl mt-6 mb-2">5. ข้อจำกัดความรับผิด</h2>
    <p>
      บริการนี้จัดทำขึ้น "ตามสภาพ" และ "ตามที่มี" การให้คำปรึกษาเบื้องต้นผ่าน AI เป็นเพียงข้อมูลเพื่อประกอบการตัดสินใจ ไม่สามารถใช้แทนคำแนะนำทางกฎหมายจากทนายความผู้เชี่ยวชาญได้ Lawslane จะไม่รับผิดชอบต่อความเสียหายใดๆ ที่เกิดขึ้นจากการใช้ข้อมูลจากบริการของเรา
    </p>

    <h2 class="font-semibold text-xl mt-6 mb-2">6. การเปลี่ยนแปลงข้อกำหนด</h2>
    <p>เราขอสงวนสิทธิ์ในการแก้ไขหรือเปลี่ยนแปลงข้อกำหนดเหล่านี้ได้ตลอดเวลาตามดุลยพินิจของเราแต่เพียงผู้เดียว หากการแก้ไขนั้นเป็นสาระสำคัญ เราจะพยายามแจ้งให้ทราบล่วงหน้าอย่างน้อย 30 วันก่อนที่ข้อกำหนดใหม่จะมีผลบังคับใช้</p>

    <h2 class="font-semibold text-xl mt-6 mb-2">7. ติดต่อเรา</h2>
    <p>
      หากคุณมีคำถามใดๆ เกี่ยวกับข้อกำหนดเหล่านี้ โปรดติดต่อเราที่:
      อีเมล: <a href="mailto:support@lawslane.demo" class="text-primary hover:underline">support@lawslane.demo</a>
    </p>
`;

export default function AdminLegalPage() {
    const { firestore } = useFirebase();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const [privacyContent, setPrivacyContent] = useState('');
    const [originalPrivacyContent, setOriginalPrivacyContent] = useState('');

    const [termsContent, setTermsContent] = useState('');
    const [originalTermsContent, setOriginalTermsContent] = useState('');

    useEffect(() => {
        async function fetchContent() {
            if (!firestore) return;

            try {
                const privacyDoc = await getDoc(doc(firestore, 'siteContent', 'privacy-policy'));
                const privacyData = privacyDoc.exists() ? privacyDoc.data().content : '';
                const finalPrivacyContent = privacyData || DEFAULT_PRIVACY_CONTENT;
                setPrivacyContent(finalPrivacyContent);
                setOriginalPrivacyContent(finalPrivacyContent);

                const termsDoc = await getDoc(doc(firestore, 'siteContent', 'terms-of-service'));
                const termsData = termsDoc.exists() ? termsDoc.data().content : '';
                const finalTermsContent = termsData || DEFAULT_TERMS_CONTENT;
                setTermsContent(finalTermsContent);
                setOriginalTermsContent(finalTermsContent);
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

            // Update original content to match the new saved content
            if (type === 'privacy') {
                setOriginalPrivacyContent(content);
            } else {
                setOriginalTermsContent(content);
            }
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

    const handleReset = (type: 'privacy' | 'terms') => {
        if (type === 'privacy') {
            setPrivacyContent(originalPrivacyContent);
            toast({ description: "รีเซ็ตเนื้อหานโยบายความเป็นส่วนตัวกลับเป็นเวอร์ชั่นล่าสุดแล้ว" });
        } else {
            setTermsContent(originalTermsContent);
            toast({ description: "รีเซ็ตเนื้อหาข้อกำหนดและเงื่อนไขกลับเป็นเวอร์ชั่นล่าสุดแล้ว" });
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
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="privacy-content">แก้ไขเนื้อหา (ฉบับร่าง)</Label>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleReset('privacy')}
                                            disabled={privacyContent === originalPrivacyContent}
                                            className="h-8 text-muted-foreground hover:text-foreground"
                                        >
                                            <RotateCcw className="mr-2 h-3 w-3" />
                                            รีเซ็ต
                                        </Button>
                                    </div>
                                    <RichTextEditor
                                        value={privacyContent}
                                        onChange={setPrivacyContent}
                                        placeholder="ใส่เนื้อหานโยบายความเป็นส่วนตัวที่นี่..."
                                        className="min-h-[500px]"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="flex items-center text-muted-foreground">
                                        <Eye className="mr-2 h-4 w-4" />
                                        เวอร์ชั่นปัจจุบัน (บนเว็บไซต์)
                                    </Label>
                                    <div
                                        className="border rounded-lg p-4 h-[542px] overflow-y-auto bg-muted/30 prose prose-sm max-w-none dark:prose-invert"
                                        dangerouslySetInnerHTML={{ __html: originalPrivacyContent || '<p class="text-muted-foreground italic">ยังไม่มีเนื้อหา</p>' }}
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <Button onClick={() => handleSave('privacy')} disabled={isSaving || privacyContent === originalPrivacyContent}>
                                    {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                    บันทึกการเปลี่ยนแปลง
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="terms">
                    <Card className="rounded-xl">
                        <CardHeader>
                            <CardTitle>แก้ไขข้อกำหนดและเงื่อนไข (Terms of Service)</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="terms-content">แก้ไขเนื้อหา (ฉบับร่าง)</Label>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleReset('terms')}
                                            disabled={termsContent === originalTermsContent}
                                            className="h-8 text-muted-foreground hover:text-foreground"
                                        >
                                            <RotateCcw className="mr-2 h-3 w-3" />
                                            รีเซ็ต
                                        </Button>
                                    </div>
                                    <RichTextEditor
                                        value={termsContent}
                                        onChange={setTermsContent}
                                        placeholder="ใส่เนื้อหาข้อกำหนดและเงื่อนไขที่นี่..."
                                        className="min-h-[500px]"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="flex items-center text-muted-foreground">
                                        <Eye className="mr-2 h-4 w-4" />
                                        เวอร์ชั่นปัจจุบัน (บนเว็บไซต์)
                                    </Label>
                                    <div
                                        className="border rounded-lg p-4 h-[542px] overflow-y-auto bg-muted/30 prose prose-sm max-w-none dark:prose-invert"
                                        dangerouslySetInnerHTML={{ __html: originalTermsContent || '<p class="text-muted-foreground italic">ยังไม่มีเนื้อหา</p>' }}
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <Button onClick={() => handleSave('terms')} disabled={isSaving || termsContent === originalTermsContent}>
                                    {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                    บันทึกการเปลี่ยนแปลง
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
