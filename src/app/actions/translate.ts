'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';

export interface TranslationResult {
    english: string;
    chinese: string;
}

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY || process.env.GOOGLE_API_KEY || '');
const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.3,
    }
});

export async function translateToMultipleLanguages(
    thaiText: string
): Promise<TranslationResult> {
    if (!thaiText || thaiText.trim().length === 0) {
        return { english: '', chinese: '' };
    }

    try {
        const prompt = `You are a professional translator. Translate the following Thai text to English and Chinese (Simplified).

Input Text:
${thaiText}

Instructions:
1. Translate to English.
2. Translate to Chinese (Simplified).
3. Return ONLY a valid JSON object matching this schema: {"english": "...", "chinese": "..."}
`;

        const result = await model.generateContent(prompt);
        const text = result.response.text().trim();
        console.log('AI Response:', text);

        try {
            const parsed = JSON.parse(text);
            return {
                english: parsed.english || '',
                chinese: parsed.chinese || '',
            };
        } catch (parseError) {
            console.error('Failed to parse translation response:', text, parseError);
            return { english: '', chinese: '' };
        }
    } catch (error) {
        console.error('Translation error:', error);
        throw new Error('Translation failed');
    }
}
