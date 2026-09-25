'use server';

export interface TranslationResult {
    english: string;
    chinese: string;
}

// ปิดแล้ว: เดิมเรียก Gemini (gemini-1.5-flash ซึ่งเลิกให้บริการแล้ว) โดยไม่มี auth
// → ใครก็ใช้ API key ของเราแปลภาษาได้ไม่จำกัด
export async function translateToMultipleLanguages(_thaiText: string): Promise<TranslationResult> {
    return { english: '', chinese: '' };
}
