import { NextRequest, NextResponse } from 'next/server';
import { initAdmin } from '@/lib/firebase-admin';
import * as admin from 'firebase-admin';

export async function GET(req: NextRequest) {
    try {
        const app = await initAdmin();
        if (!app) {
            return NextResponse.json({ error: 'Firebase Admin not initialized' }, { status: 500 });
        }

        const authHeader = req.headers.get('Authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const token = authHeader.split('Bearer ')[1];
        const decodedToken = await admin.auth().verifyIdToken(token);
        const userId = decodedToken.uid;

        const db = admin.firestore(app);
        const historyRef = db.collection('student_exam_results');
        const q = historyRef.where('userId', '==', userId).orderBy('createdAt', 'desc');

        const snapshot = await q.get();
        const history = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            // Convert timestamps to ISO strings or numbers for client consistency if needed, 
            // but usually valid JSON is enough. 
            // However, Firestore Timestamps don't serialize perfectly to JSON in Next.js response sometimes.
            // Let's manually convert createdAt.
            createdAt: doc.data().createdAt?.toDate() || null,
        }));

        return NextResponse.json(history);

    } catch (error) {
        console.error("Error fetching student history:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
