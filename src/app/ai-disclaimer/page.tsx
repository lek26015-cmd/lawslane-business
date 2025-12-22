'use client';

import { Bot, FileText } from 'lucide-react';

export default function AiDisclaimerPage() {
    return (
        <div className="min-h-screen bg-gray-50/50">
            {/* Header Section */}
            <div className="bg-gradient-to-b from-primary/10 to-transparent pb-20 pt-16 md:pt-24">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center justify-center p-3 bg-white rounded-2xl shadow-sm mb-6 animate-in fade-in zoom-in duration-500">
                            <Bot className="w-8 h-8 text-primary" />
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold text-foreground font-headline mb-4 tracking-tight">
                            ข้อจำกัดความรับผิดของ AI
                        </h1>
                        <p className="text-lg text-muted-foreground">
                            (AI Limitation of Liability)
                        </p>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="container mx-auto px-4 md:px-6 -mt-12 pb-20">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 p-8 md:p-12 border border-gray-100">
                        <div className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-foreground prose-p:text-muted-foreground prose-li:text-muted-foreground prose-strong:text-foreground">

                            <p>
                                Lawslane ใช้เทคโนโลยีปัญญาประดิษฐ์ (Artificial Intelligence หรือ AI) เพื่อช่วยในการสืบค้นและสรุปข้อมูลเบื้องต้นทางกฎหมาย เพื่อความสะดวกและรวดเร็วในการเข้าถึงข้อมูลของผู้ใช้งาน อย่างไรก็ตาม การใช้งานระบบ AI ของเรามีข้อจำกัดที่ผู้ใช้งานควรทราบและยอมรับ ดังนี้:
                            </p>

                            <h2 className="text-xl mt-8 mb-4">1. ไม่ใช่คำแนะนำทางกฎหมาย (Not Legal Advice)</h2>
                            <p>
                                ข้อมูล บทวิเคราะห์ หรือคำตอบที่ได้รับจากระบบ AI ของ Lawslane <strong>ถือเป็นเพียงข้อมูลทั่วไปเพื่อการศึกษาเบื้องต้นเท่านั้น</strong> ไม่ถือเป็นคำแนะนำทางกฎหมาย การให้คำปรึกษาทางกฎหมาย หรือการสร้างความสัมพันธ์ระหว่างทนายความกับลูกความ
                            </p>
                            <p>
                                ผู้ใช้งานไม่ควรใช้ข้อมูลจาก AI เป็นฐานในการตัดสินใจทางกฎหมาย หรือใช้แทนคำแนะนำจากทนายความผู้มีใบอนุญาตและมีความเชี่ยวชาญเฉพาะด้าน
                            </p>

                            <h2 className="text-xl mt-8 mb-4">2. ความถูกต้องและความทันสมัยของข้อมูล (Accuracy and Currency)</h2>
                            <p>
                                แม้ว่าเราจะพยายามพัฒนาระบบให้มีความแม่นยำสูงสุด แต่เทคโนโลยี AI อาจเกิดข้อผิดพลาด (Hallucination) หรือให้ข้อมูลที่ไม่ครบถ้วนสมบูรณ์ได้ นอกจากนี้ กฎหมายอาจมีการเปลี่ยนแปลง แก้ไข หรือยกเลิกได้ตลอดเวลา ซึ่งข้อมูลที่ AI ใช้อ้างอิงอาจยังไม่ได้รับการปรับปรุงให้เป็นปัจจุบันที่สุด
                            </p>
                            <p>
                                Lawslane ไม่รับรองหรือรับประกันความถูกต้อง ความสมบูรณ์ หรือความทันสมัยของข้อมูลที่สร้างขึ้นโดย AI
                            </p>

                            <h2 className="text-xl mt-8 mb-4">3. การจำกัดความรับผิด (Limitation of Liability)</h2>
                            <p>
                                Lawslane รวมถึงกรรมการ พนักงาน และพันธมิตร จะไม่รับผิดชอบต่อความเสียหายใดๆ ไม่ว่าจะเป็นความเสียหายโดยตรง ความเสียหายทางอ้อม ความเสียหายพิเศษ หรือความเสียหายที่ตามมา ซึ่งเกิดขึ้นจากการที่ผู้ใช้งานนำข้อมูลจาก AI ไปใช้ หรือเชื่อถือข้อมูลดังกล่าวโดยไม่ตรวจสอบกับทนายความผู้เชี่ยวชาญ
                            </p>

                            <h2 className="text-xl mt-8 mb-4">4. คำแนะนำในการใช้งาน</h2>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>ใช้ข้อมูลจาก AI เพื่อทำความเข้าใจเบื้องต้นเกี่ยวกับประเด็นทางกฎหมายเท่านั้น</li>
                                <li>ตรวจสอบข้อมูลความถูกต้องกับแหล่งข้อมูลทางกฎหมายที่เชื่อถือได้เสมอ</li>
                                <li><strong>ปรึกษาทนายความตัวจริง</strong> ผ่านแพลตฟอร์ม Lawslane สำหรับกรณีที่มีความซับซ้อน หรือต้องการดำเนินการทางกฎหมายอย่างเป็นทางการ</li>
                            </ul>

                            <div className="mt-12 p-6 bg-blue-50 rounded-2xl border border-blue-100">
                                <p className="text-blue-800 font-medium m-0">
                                    หากท่านต้องการคำแนะนำทางกฎหมายที่ถูกต้องและสามารถอ้างอิงได้ตามกฎหมาย กรุณาใช้บริการ <a href="/lawyers" className="text-blue-600 underline hover:text-blue-800">ค้นหาทนายความ</a> บนแพลตฟอร์มของเรา
                                </p>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
