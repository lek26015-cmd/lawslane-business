import { initAdmin } from './firebase-admin';
import { Book, Exam } from './education-types';

export async function getBookById(id: string): Promise<Book | null> {
    const admin = await initAdmin();
    if (!admin) return null;

    const doc = await admin.firestore().collection('books').doc(id).get();
    if (!doc.exists) return null;

    const data = doc.data();
    return {
        id: doc.id,
        ...data,
        publishedAt: data?.publishedAt?.toDate ? data.publishedAt.toDate() : (data?.publishedAt instanceof Date ? data.publishedAt : undefined),
        createdAt: data?.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
        updatedAt: data?.updatedAt?.toDate ? data.updatedAt.toDate() : new Date(),
    } as Book;
}

export async function getAllBooks(): Promise<Book[]> {
    const admin = await initAdmin();
    if (!admin) return [];

    const snapshot = await admin.firestore().collection('books').get();
    return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            ...data,
            publishedAt: data?.publishedAt?.toDate ? data.publishedAt.toDate() : (data?.publishedAt instanceof Date ? data.publishedAt : undefined),
            createdAt: data?.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
            updatedAt: data?.updatedAt?.toDate ? data.updatedAt.toDate() : new Date(),
        } as Book;
    });
}
