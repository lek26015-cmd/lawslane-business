'use server';

import { retrieveDocuments } from '@/lib/rag';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY || process.env.GOOGLE_API_KEY || '');
const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
});

export async function searchLaws(query: string, locale: string = 'th') {
    try {
        const docs = await retrieveDocuments(query, 10);

        if (docs.length === 0) {
            return {
                answer: locale === 'en' ? "No relevant laws found." : "ไม่พบข้อกฎหมายที่เกี่ยวข้อง",
                sources: []
            };
        }

        const context = docs.map(doc => `[Source: ${doc.source}]\n${doc.content}`).join('\n\n');

        const prompt = `
            You are a specialized Legal Search Assistant. 
            User Query: ${query}
            
            Based on the following legal documents, provide a concise summary that answers the query.
            Always cite the sources used.
            
            Language: ${locale === 'en' ? 'English' : locale === 'zh' ? 'Chinese' : 'Thai'}

            Context:
            ${context}
        `;

        const result = await model.generateContent(prompt);
        const answer = result.response.text();

        return {
            answer,
            sources: docs.map(d => ({ source: d.source, score: d.score }))
        };

    } catch (error) {
        console.error("Error in searchLaws:", error);
        throw error;
    }
}
