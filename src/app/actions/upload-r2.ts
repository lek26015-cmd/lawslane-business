'use server';

import { r2 } from '@/lib/r2';
import { PutObjectCommand } from '@aws-sdk/client-s3';

// เดิมรับ folder อะไรก็ได้จาก client, ไม่จำกัดชนิด/ขนาดไฟล์ และไม่มี auth
// → ใครก็เขียนไฟล์อะไรก็ได้ลง bucket สาธารณะ (รวมทับโฟลเดอร์เอกสารของคนอื่น)
const MAX_BYTES = 10 * 1024 * 1024;
const ALLOWED_TYPES: Record<string, string> = {
    'application/pdf': 'pdf',
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
};

// โฟลเดอร์ที่มี {uid} ต้องพิสูจน์ว่าเป็นเจ้าของ uid นั้นด้วย Firebase ID token
const OWNED_FOLDERS = [
    /^lawyer-documents\/([A-Za-z0-9]{20,128})\/(id-card|license)$/,
    /^lawyer-profile-images\/([A-Za-z0-9]{20,128})$/,
];
// ฟอร์มสาธารณะที่ไม่ต้อง login
const PUBLIC_FOLDERS = new Set(['sme-requests']);

// repo นี้ไม่มี firebase-admin → ตรวจ ID token ผ่าน Identity Toolkit REST (ตอบเฉพาะ token ที่ยังใช้ได้)
async function uidFromIdToken(idToken: string): Promise<string | null> {
    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    if (!apiKey || !idToken) return null;
    try {
        const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idToken }),
            cache: 'no-store',
        });
        if (!res.ok) return null;
        const data = await res.json() as { users?: Array<{ localId?: string }> };
        return data.users?.[0]?.localId ?? null;
    } catch {
        return null;
    }
}

export async function uploadToR2(formData: FormData, folder: string, idToken?: string) {
    const file = formData.get('file');
    if (!(file instanceof File)) {
        throw new Error('No file provided');
    }
    const ext = ALLOWED_TYPES[file.type];
    if (!ext) throw new Error('รองรับเฉพาะไฟล์ PDF, JPG, PNG, WEBP');
    if (file.size > MAX_BYTES) throw new Error('ไฟล์ต้องไม่เกิน 10MB');

    if (!PUBLIC_FOLDERS.has(folder)) {
        const owned = OWNED_FOLDERS.map((re) => folder.match(re)).find(Boolean);
        if (!owned) throw new Error('Invalid upload folder');
        const uid = await uidFromIdToken(idToken ?? '');
        if (!uid || uid !== owned[1]) throw new Error('Unauthorized');
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    // ตั้งชื่อไฟล์เองจาก MIME — ไม่ใช้ชื่อไฟล์จาก client
    const key = `${folder}/${Date.now()}_${crypto.randomUUID()}.${ext}`;

    try {
        await r2.send(new PutObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME,
            Key: key,
            Body: buffer,
            ContentType: file.type,
        }));

        const baseUrl = process.env.R2_PUBLIC_URL || '';
        return `${baseUrl}/${key}`;
    } catch (error) {
        console.error("R2 Upload Error:", error);
        throw new Error('Failed to upload to R2');
    }
}
