import { NextResponse } from 'next/server';
import { initAdmin } from '@/lib/firebase-admin';
import * as admin from 'firebase-admin';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: 'User ID required' }, { status: 400 });
        }

        const app = await initAdmin();
        if (!app) {
            return NextResponse.json({ error: 'Firebase Admin not initialized' }, { status: 500 });
        }

        const db = admin.firestore(app);

        // Query orders successfully paid by this user
        // In a real app, strict auth check needed here
        const ordersRef = db.collection('orders');
        const snapshot = await ordersRef
            .where('userId', '==', userId)
            // .where('status', 'in', ['PAID', 'COMPLETED']) // Optional: depending on if status is strictly managed
            .get();

        const ebooks: any[] = [];
        const processedBookIds = new Set();

        snapshot.forEach(doc => {
            const order = doc.data();
            if (order.items && Array.isArray(order.items)) {
                order.items.forEach((item: any) => {
                    // Check if item is E-Book or Course (Digital)
                    // We treat anything with type 'BOOK' and isDigital flag OR type 'COURSE' as digital content
                    const isCourse = item.type === 'COURSE';
                    const isEbook = (item.type === 'BOOK' && (item.originalItem?.isDigital !== false)) || /e-book|ebook/i.test(item.title);

                    if ((isCourse || isEbook) && !processedBookIds.has(item.id)) {
                        processedBookIds.add(item.id);
                        ebooks.push({
                            ...item,
                            purchasedAt: order.createdAt?.toDate ? order.createdAt.toDate().toISOString() : new Date().toISOString(),
                            orderId: doc.id
                        });
                    }
                });
            }
        });

        // Sort by most recent purchase
        ebooks.sort((a, b) => new Date(b.purchasedAt).getTime() - new Date(a.purchasedAt).getTime());

        return NextResponse.json(ebooks);

    } catch (error) {
        console.error("Error fetching my-ebooks:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
