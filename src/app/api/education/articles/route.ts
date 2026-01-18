import { NextResponse } from 'next/server';
import { initAdmin } from '@/lib/firebase-admin';
import * as admin from 'firebase-admin';

export async function GET() {
    try {
        const app = await initAdmin();
        if (!app) {
            return NextResponse.json({ error: 'Firebase Admin not initialized' }, { status: 500 });
        }

        const db = admin.firestore(app);
        const articlesRef = db.collection('articles');
        const snapshot = await articlesRef.get();

        const articles = snapshot.docs.map(doc => {
            const data = doc.data();
            let publishedAtStr = new Date().toISOString();

            if (data.publishedAt?.toDate) {
                publishedAtStr = data.publishedAt.toDate().toISOString();
            } else if (data.publishedAt instanceof Date) {
                publishedAtStr = data.publishedAt.toISOString();
            } else if (typeof data.publishedAt === 'string') {
                publishedAtStr = data.publishedAt;
            }

            return {
                id: doc.id,
                ...data,
                publishedAt: publishedAtStr
            };
        });

        // Optional: Implement limit or sorting if needed, but for now match getAllArticles behavior (fetch all)
        // Or better, just return top 5 or 10 since we only need 3 for the UI.
        // getAllArticles fetches ALL, which might be heavy. Let's limit to 20 recent for performance.
        // But the original code fetched all. Let's stick to returning them all or a reasonable limit.
        // Given we slice(0, 3) in the UI, fetching 20 is plenty sufficient and safer.
        // Actually, let's just return all for consistency with the function it replaces, or 50.

        return NextResponse.json(articles);

    } catch (error) {
        console.error("Error fetching articles API:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
