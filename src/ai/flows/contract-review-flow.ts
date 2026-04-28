'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY || process.env.GOOGLE_API_KEY || '');
const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-pro', // Use Pro for more precise contract analysis
});

export async function reviewContract(text: string, locale: string = 'th') {
    try {
        const prompt = `
            คุณคือทนายความผู้เชี่ยวชาญด้านการตรวจสอบสัญญา (Senior Legal Counsel)
            หน้าที่ของคุณคือวิเคราะห์เนื้อหาสัญญาที่ผู้ใช้ส่งมาอย่างละเอียด
            
            กรุณาให้ข้อมูลดังนี้:
            1. สรุปสาระสำคัญของสัญญา (Executive Summary)
            2. จุดที่ควรระวังหรือความเสี่ยง (Red Flags / Risks)
            3. ข้อแนะนำในการแก้ไขหรือเพิ่มเติม (Recommendations)
            4. รายการคู่สัญญาและภาระผูกพันหลัก (Parties & Key Obligations)

            เนื้อหาสัญญา:
            ${text}

            ตอบกลับในภาษา: ${locale === 'en' ? 'English' : locale === 'zh' ? 'Chinese' : 'Thai'}
            จัดรูปแบบให้สวยงามโดยใช้ Markdown
        `;

        const result = await model.generateContent(prompt);
        return result.response.text();

    } catch (error) {
        console.error("Error in reviewContract:", error);
        throw error;
    }
}
