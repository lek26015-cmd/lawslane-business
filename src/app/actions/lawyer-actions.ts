'use server';

// ปิดแล้ว: เดิมให้ใครก็เขียน/ทับเอกสาร verifiedLawyers (ทะเบียนทนายที่ใช้ตรวจใบอนุญาต) ได้โดยไม่มี auth
// การเพิ่มรายชื่อเข้าทะเบียนต้องทำจาก admin.lawslane.com (lawyer-registry) เท่านั้น
export async function addToVerifiedRegistry(_data: {
    licenseNumber: string;
    firstName: string;
    lastName: string;
    province: string;
}): Promise<{ success: boolean; error?: string }> {
    return { success: false, error: 'Disabled: registry is managed from admin.lawslane.com' };
}
