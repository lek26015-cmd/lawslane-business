import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY || process.env.GOOGLE_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

export async function POST(req: Request) {
    try {
        const { image } = await req.json();

        if (!image) {
            return NextResponse.json({ error: 'Image is required' }, { status: 400 });
        }

        // Clean base64 string
        const base64Data = image.replace(/^data:image\/\w+;base64,/, '');

        const prompt = `Analyze this contract or business document image and extract the following details in JSON format:
        {
            "employer": "Name of the employer/client",
            "task": "Description of the work or task",
            "price": 1000, (total price as a number)
            "deposit": 0, (deposit amount as a number)
            "deadline": "Delivery date or timeframe",
            "missingInfo": ["list", "of", "missing", "critical", "info"],
            "riskyTerms": ["list", "of", "potentially", "risky", "clauses"]
        }
        Provide the answer only in JSON format. Use Thai language for text fields. If a field is not found, leave it as an empty string or 0.`;

        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    data: base64Data,
                    mimeType: 'image/jpeg',
                },
            },
        ]);

        const responseText = result.response.text();
        const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();

        try {
            const data = JSON.parse(cleanJson);
            return NextResponse.json(data);
        } catch (parseError) {
            console.error('Failed to parse Gemini response:', responseText);
            return NextResponse.json({ error: 'Failed to process image' }, { status: 500 });
        }
    } catch (error) {
        console.error('Contract draft analysis error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
