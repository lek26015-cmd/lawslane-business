'use server';

// ปิดแล้ว: เดิม save/getNotificationPreferences รับ uid จาก client (อ่าน/เขียนเอกสาร users ของใครก็ได้)
// และ notifyAdmins ให้ใครก็ยิงอีเมลหาแอดมินทุกคนได้ไม่จำกัด
// เว็บนี้เป็นหน้า marketing — การแจ้งเตือนแอดมินอยู่ที่ admin.lawslane.com / lawslane.com

export interface NotificationPreferences {
    email: string;
    notifyOnNewUser: boolean;
    notifyOnNewTicket: boolean;
    notifyOnPayment: boolean;
    notifyOnNewLawyer?: boolean;
}

const DISABLED = 'Disabled on this site';

export async function saveNotificationPreferences(_uid: string, _preferences: NotificationPreferences) {
    return { success: false, error: DISABLED };
}

export async function getNotificationPreferences(_uid: string): Promise<{ success: boolean, preferences?: NotificationPreferences, error?: string }> {
    return { success: false, error: DISABLED };
}

export async function notifyAdmins(_type: 'new_user' | 'new_ticket' | 'payment' | 'withdrawal' | 'slip_limit_warning' | 'new_lawyer', _data: any): Promise<void> {
    return;
}
