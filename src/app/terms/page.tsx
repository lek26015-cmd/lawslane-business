'use client';

import { FileText, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useFirebase } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function TermsOfServicePage() {
  const { firestore } = useFirebase();
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchContent() {
      if (!firestore) return;
      try {
        const docRef = doc(firestore, 'siteContent', 'terms-of-service');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().content) {
          setContent(docSnap.data().content);
        }
      } catch (error) {
        console.error("Error fetching terms of service:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchContent();
  }, [firestore]);

  const defaultContent = `
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

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <FileText className="w-10 h-10 text-foreground" />
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground font-headline">
                ข้อกำหนดและเงื่อนไขการใช้บริการ (Terms of Service)
              </h1>
              <p className="text-muted-foreground">ปรับปรุงล่าสุด: 25 กรกฎาคม 2567</p>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div
              className="prose prose-lg max-w-none text-foreground/90 space-y-6"
              dangerouslySetInnerHTML={{ __html: content || defaultContent }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

