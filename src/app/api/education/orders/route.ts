import { NextResponse } from 'next/server';
import { initAdmin } from '@/lib/firebase-admin';
import * as admin from 'firebase-admin';

export async function POST(req: Request) {
    try {
        const app = await initAdmin();
        if (!app) {
            return NextResponse.json({ error: 'Firebase Admin not initialized' }, { status: 500 });
        }

        const db = admin.firestore(app);
        const data = await req.json();

        // Basic validation
        if (!data.userId || !data.items || data.items.length === 0) {
            return NextResponse.json({ error: 'Invalid order data' }, { status: 400 });
        }

        // Verify ID Token for security (optional but recommended, user should be auth'd)
        // For simplicity, we assume the client sends userId and we trust it or checking auth header is better.
        // Let's rely on data.userId match with auth header if strict, but for now just save.

        const orderRef = db.collection('orders').doc();
        const orderData = {
            id: orderRef.id,
            ...data,
            status: 'PAID', // Auto-mark as PAID for mock purposes/simplicity unless manual verification needed
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        };

        await orderRef.set(orderData);

        return NextResponse.json({ success: true, orderId: orderRef.id });

    } catch (error) {
        console.error("Error creating order:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
