import type { PlanTone } from '@/components/plan-avatar';

/**
 * แปลงแพลน Legal OS (users/{uid}.plan + subscriptionStatus) เป็นสีวงรูปโปรไฟล์
 * ลำดับราคา: Lite 990 · Starter 2,900 · Professional 5,900 · Business 8,900 · Elite 18,900 · Enterprise
 *   ยังไม่สมัคร/หมดอายุ → none
 *   Lite, Starter       → plus
 *   Professional, Business → gold
 *   Elite, Enterprise   → premium
 */
export function getBusinessPlanTone(
    plan?: string | null,
    subscriptionStatus?: string | null,
): { tone: PlanTone; label: string } {
    const active = subscriptionStatus === 'active' || subscriptionStatus === 'trialing';
    if (!plan || !active) return { tone: 'none', label: '' };

    const label = plan.replace(/\s*plan$/i, '').trim() || plan;
    const key = label.toLowerCase();

    let tone: PlanTone = 'plus';
    if (key.includes('elite') || key.includes('enterprise')) tone = 'premium';
    else if (key.includes('professional') || key.includes('business') || key === 'pro') tone = 'gold';

    return { tone, label };
}
