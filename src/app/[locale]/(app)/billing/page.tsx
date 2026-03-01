'use client';
export const runtime = 'edge';

import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useTranslations, useLocale } from 'next-intl';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from '@/components/ui/dialog';
import {
    CreditCard,
    Receipt,
    FileText,
    Download,
    TrendingUp,
    Plus,
    ArrowUpRight,
    Trash2,
    Printer,
    Eye,
    ArrowLeft,
    X,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useB2BProfile } from '@/context/b2b-profile-context';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect } from 'react';

type LineItem = { description: string; quantity: number; unitPrice: number };
type Invoice = {
    id: string;
    date: string;
    amount: string;
    status: string;
    full?: InvoiceFull;
};
type InvoiceFull = {
    invoiceNo: string;
    issueDate: string;
    dueDate: string;
    seller: { name: string; address: string; taxId: string; phone: string };
    buyer: { name: string; address: string; taxId: string; phone: string };
    items: LineItem[];
    includeVat: boolean;
    includeWht: boolean;
    whtRate: number;
    notes: string;
    subtotal: number;
    vat: number;
    wht: number;
    total: number;
};

function formatNumber(n: number) {
    return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatDate(dateStr: string | undefined, locale: string, short = false) {
    const d = dateStr ? new Date(dateStr) : new Date();
    const options: Intl.DateTimeFormatOptions = {
        day: 'numeric',
        month: short ? 'short' : 'long',
        year: 'numeric'
    };
    return new Intl.DateTimeFormat(locale === 'th' ? 'th-TH' : locale === 'zh' ? 'zh-CN' : 'en-US', options).format(d);
}

/* =================== INVOICE PREVIEW (Print-Ready) =================== */
function InvoicePreview({ data, onClose, t, locale }: { data: InvoiceFull; onClose: () => void; t: any; locale: string }) {
    const printRef = useRef<HTMLDivElement>(null);

    const handlePrint = () => {
        const content = printRef.current;
        if (!content) return;
        const win = window.open('', '_blank');
        if (!win) return;
        win.document.write(`
            <html><head><title>${t('invoice.title')} ${data.invoiceNo}</title>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { font-family: 'Sarabun', 'Noto Sans Thai', sans-serif; padding: 40px; color: #1a1a1a; }
                .invoice-box { max-width: 800px; margin: 0 auto; }
                .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; padding-bottom: 24px; border-bottom: 2px solid #e2e8f0; }
                .header h1 { font-size: 28px; color: #1e40af; font-weight: 800; }
                .header .inv-no { font-size: 14px; color: #64748b; margin-top: 4px; }
                .parties { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-bottom: 32px; }
                .party h3 { font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #94a3b8; margin-bottom: 8px; font-weight: 700; }
                .party p { font-size: 13px; line-height: 1.6; }
                .party .name { font-weight: 700; font-size: 14px; }
                table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
                th { background: #f1f5f9; text-align: left; padding: 10px 12px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; font-weight: 700; border-bottom: 2px solid #e2e8f0; }
                th:last-child, th:nth-child(2), th:nth-child(3) { text-align: right; }
                td { padding: 10px 12px; font-size: 13px; border-bottom: 1px solid #f1f5f9; }
                td:last-child, td:nth-child(2), td:nth-child(3) { text-align: right; }
                .totals { display: flex; justify-content: flex-end; }
                .totals-table { width: 280px; }
                .totals-table .row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px; }
                .totals-table .row.total { border-top: 2px solid #1e40af; padding-top: 10px; margin-top: 6px; font-weight: 800; font-size: 16px; color: #1e40af; }
                .totals-table .row .label { color: #64748b; }
                .notes { margin-top: 32px; padding: 16px; background: #f8fafc; border-radius: 8px; font-size: 12px; color: #64748b; }
                .footer { margin-top: 48px; display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
                .sig { text-align: center; padding-top: 60px; border-top: 1px solid #cbd5e1; font-size: 12px; color: #64748b; }
                @media print { body { padding: 20px; } }
            </style></head><body>
            <div class="invoice-box">${content.innerHTML}</div>
            </body></html>
        `);
        win.document.close();
        setTimeout(() => win.print(), 300);
    };

    return (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-start justify-center overflow-y-auto py-8 px-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[850px] relative">
                {/* Toolbar */}
                <div className="sticky top-0 z-10 bg-white border-b px-6 py-3 rounded-t-2xl flex items-center justify-between">
                    <Button variant="ghost" onClick={onClose} className="gap-2 text-sm">
                        <ArrowLeft className="w-4 h-4" /> {t('preview.back')}
                    </Button>
                    <div className="flex gap-2">
                        <Button variant="outline" className="rounded-xl gap-2 text-sm" onClick={handlePrint}>
                            <Printer className="w-4 h-4" /> {t('preview.print')}
                        </Button>
                    </div>
                </div>

                {/* Invoice Content */}
                <div ref={printRef} className="p-8 md:p-12 text-slate-900">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-8 pb-6 border-b-2 border-slate-200">
                        <div>
                            <h1 className="text-3xl font-extrabold text-[#002f4b]">{t('invoice.title')}</h1>
                            <p className="text-sm text-slate-500 mt-1">{t('invoice.invLabel')}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-slate-500">{t('invoice.no')}</p>
                            <p className="text-lg font-bold">{data.invoiceNo}</p>
                            <p className="text-xs text-slate-400 mt-2">{t('invoice.issueDate')}: {formatDate(data.issueDate, locale)}</p>
                            <p className="text-xs text-slate-400">{t('invoice.dueDate')}: {data.dueDate ? formatDate(data.dueDate, locale) : '-'}</p>
                        </div>
                    </div>

                    {/* Parties */}
                    <div className="grid grid-cols-2 gap-8 mb-8">
                        <div>
                            <h3 className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400 mb-2">{t('invoice.issuer')}</h3>
                            <p className="font-bold text-sm">{data.seller.name}</p>
                            <p className="text-xs text-slate-600 whitespace-pre-line leading-relaxed">{data.seller.address}</p>
                            {data.seller.taxId && <p className="text-xs text-slate-500 mt-1">{t('invoice.taxId')}: {data.seller.taxId}</p>}
                            {data.seller.phone && <p className="text-xs text-slate-500">{t('invoice.phone')}: {data.seller.phone}</p>}
                        </div>
                        <div>
                            <h3 className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400 mb-2">{t('invoice.customer')}</h3>
                            <p className="font-bold text-sm">{data.buyer.name}</p>
                            <p className="text-xs text-slate-600 whitespace-pre-line leading-relaxed">{data.buyer.address}</p>
                            {data.buyer.taxId && <p className="text-xs text-slate-500 mt-1">{t('invoice.taxId')}: {data.buyer.taxId}</p>}
                            {data.buyer.phone && <p className="text-xs text-slate-500">{t('invoice.phone')}: {data.buyer.phone}</p>}
                        </div>
                    </div>

                    {/* Items Table */}
                    <table className="w-full mb-6">
                        <thead>
                            <tr className="bg-slate-50">
                                <th className="text-left text-[10px] uppercase tracking-wider text-slate-500 font-bold p-3 border-b-2 border-slate-200">{t('invoice.table.item')}</th>
                                <th className="text-right text-[10px] uppercase tracking-wider text-slate-500 font-bold p-3 border-b-2 border-slate-200">{t('invoice.table.qty')}</th>
                                <th className="text-right text-[10px] uppercase tracking-wider text-slate-500 font-bold p-3 border-b-2 border-slate-200">{t('invoice.table.unitPrice')}</th>
                                <th className="text-right text-[10px] uppercase tracking-wider text-slate-500 font-bold p-3 border-b-2 border-slate-200">{t('invoice.table.total')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.items.map((item, i) => (
                                <tr key={i} className="border-b border-slate-100">
                                    <td className="p-3 text-sm">{item.description}</td>
                                    <td className="p-3 text-sm text-right">{item.quantity}</td>
                                    <td className="p-3 text-sm text-right">{formatNumber(item.unitPrice)}</td>
                                    <td className="p-3 text-sm text-right font-medium">{formatNumber(item.quantity * item.unitPrice)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Totals */}
                    <div className="flex justify-end">
                        <div className="w-72">
                            <div className="flex justify-between py-1.5 text-sm">
                                <span className="text-slate-500">{t('invoice.subtotal')}</span>
                                <span>{formatNumber(data.subtotal)}</span>
                            </div>
                            {data.includeVat && (
                                <div className="flex justify-between py-1.5 text-sm">
                                    <span className="text-slate-500">{t('invoice.vat')}</span>
                                    <span>{formatNumber(data.vat)}</span>
                                </div>
                            )}
                            {data.includeWht && (
                                <div className="flex justify-between py-1.5 text-sm">
                                    <span className="text-slate-500">{t('invoice.wht', { rate: data.whtRate })}</span>
                                    <span className="text-red-600">-{formatNumber(data.wht)}</span>
                                </div>
                            )}
                            <div className="flex justify-between py-2.5 mt-2 border-t-2 border-blue-600 text-lg font-extrabold text-[#002f4b]">
                                <span>{t('invoice.netTotal')}</span>
                                <span>฿{formatNumber(data.total)}</span>
                            </div>
                        </div>
                    </div>

                    {data.notes && (
                        <div className="mt-8 p-4 bg-slate-50 rounded-lg">
                            <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">{t('invoice.notes')}</p>
                            <p className="text-xs text-slate-600">{data.notes}</p>
                        </div>
                    )}

                    {/* Signature */}
                    <div className="grid grid-cols-2 gap-10 mt-12">
                        <div className="text-center pt-16 border-t border-slate-300">
                            <p className="text-xs text-slate-500">{t('invoice.signatures.issuer')}</p>
                            <p className="text-xs text-slate-400 mt-1">{t('invoice.signatures.date')}</p>
                        </div>
                        <div className="text-center pt-16 border-t border-slate-300">
                            <p className="text-xs text-slate-500">{t('invoice.signatures.customer')}</p>
                            <p className="text-xs text-slate-400 mt-1">{t('invoice.signatures.date')}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* =================== MAIN BILLING PAGE =================== */
export default function BillingPage() {
    const t = useTranslations('B2BDashboard.billingV2');
    const locale = useLocale();
    const { profile, isLoading: isProfileLoading } = useB2BProfile();
    const { toast } = useToast();
    const [showForm, setShowForm] = useState(false);
    const [previewData, setPreviewData] = useState<InvoiceFull | null>(null);

    const [planData, setPlanData] = useState({ name: 'Professional', price: '฿5,900' });

    useEffect(() => {
        if (!profile) return;

        const planName = profile.plan || 'Lite';
        const cycle = profile.billingCycle || 'monthly';
        const basePrices: Record<string, number> = {
            'Lite': 990,
            'Lite Plan': 990,
            'Starter': 2900,
            'Professional': 5900,
            'Professional Plan': 5900,
            'Business': 8900,
            'Elite': 18900,
        };
        const basePrice = basePrices[planName] || 0;
        const finalPrice = cycle === 'monthly' ? basePrice : Math.round(basePrice * 12 * 0.8);

        setPlanData({
            name: planName + (cycle === 'yearly' ? ' (Annual)' : ''),
            price: `฿${finalPrice.toLocaleString()}`
        });
    }, [profile]);

    const [invoices, setInvoices] = useState<Invoice[]>([
        { id: 'INV-2025001', date: '15 ก.พ. 2568', amount: '฿8,900', status: 'จ่ายแล้ว' },
        { id: 'INV-2025002', date: '15 ม.ค. 2568', amount: '฿8,900', status: 'จ่ายแล้ว' },
        { id: 'INV-2025003', date: '15 ธ.ค. 2567', amount: '฿8,900', status: 'จ่ายแล้ว' },
        { id: 'INV-2025004', date: '15 พ.ย. 2567', amount: '฿2,900', status: 'จ่ายแล้ว' },
    ]);

    // Form state
    const [seller, setSeller] = useState({ name: '', address: '', taxId: '', phone: '' });
    const [buyer, setBuyer] = useState({ name: '', address: '', taxId: '', phone: '' });
    const [items, setItems] = useState<LineItem[]>([{ description: '', quantity: 1, unitPrice: 0 }]);
    const [includeVat, setIncludeVat] = useState(true);
    const [includeWht, setIncludeWht] = useState(false);
    const [whtRate, setWhtRate] = useState(3);
    const [dueDate, setDueDate] = useState('');
    const [notes, setNotes] = useState('');

    const addItem = () => setItems(prev => [...prev, { description: '', quantity: 1, unitPrice: 0 }]);
    const removeItem = (i: number) => setItems(prev => prev.filter((_, idx) => idx !== i));
    const updateItem = (i: number, field: keyof LineItem, value: string | number) => {
        setItems(prev => prev.map((item, idx) => idx === i ? { ...item, [field]: value } : item));
    };

    const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
    const vat = includeVat ? subtotal * 0.07 : 0;
    const wht = includeWht ? subtotal * (whtRate / 100) : 0;
    const total = subtotal + vat - wht;

    const handleCreate = () => {
        if (!seller.name) { toast({ title: t('form.toast.errSeller'), variant: 'destructive' }); return; }
        if (!buyer.name) { toast({ title: t('form.toast.errBuyer'), variant: 'destructive' }); return; }
        if (items.some(it => !it.description || it.unitPrice <= 0)) { toast({ title: t('form.toast.errItems'), variant: 'destructive' }); return; }

        const invoiceNo = `INV-${new Date().getFullYear()}${String(invoices.length + 1).padStart(3, '0')}`;
        const today = new Date().toISOString().split('T')[0];

        const fullData: InvoiceFull = {
            invoiceNo,
            issueDate: today,
            dueDate,
            seller,
            buyer,
            items,
            includeVat,
            includeWht,
            whtRate,
            notes,
            subtotal,
            vat,
            wht,
            total,
        };

        setInvoices(prev => [
            { id: invoiceNo, date: formatDate(today, locale, true), amount: `฿${formatNumber(total)}`, status: 'รอชำระ', full: fullData },
            ...prev,
        ]);

        setPreviewData(fullData);
        setShowForm(false);
        toast({ title: t('form.toast.success'), description: `${invoiceNo} — ฿${formatNumber(total)}` });

        // Reset
        setBuyer({ name: '', address: '', taxId: '', phone: '' });
        setItems([{ description: '', quantity: 1, unitPrice: 0 }]);
        setDueDate('');
        setNotes('');
    };

    /* =================== FORM VIEW =================== */
    if (showForm) {
        return (
            <div className="p-6 md:p-8 max-w-[900px] mx-auto space-y-6">
                <div className="flex items-center gap-3 mb-2">
                    <Button variant="ghost" onClick={() => setShowForm(false)} className="rounded-xl gap-2 text-sm">
                        <ArrowLeft className="w-4 h-4" /> {t('form.back')}
                    </Button>
                    <h1 className="text-xl font-bold text-foreground">{t('form.title')}</h1>
                </div>

                {/* Seller & Buyer */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="rounded-2xl border shadow-sm">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-bold text-foreground">{t('form.seller.title')}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div>
                                <label className="text-xs font-medium text-muted-foreground mb-1 block">{t('form.seller.nameLabel')} <span className="text-red-500">*</span></label>
                                <Input placeholder={t('form.seller.namePlaceholder')} value={seller.name} onChange={e => setSeller(s => ({ ...s, name: e.target.value }))} className="rounded-lg text-sm" />
                            </div>
                            <div>
                                <label className="text-xs font-medium text-muted-foreground mb-1 block">{t('form.seller.addressLabel')}</label>
                                <Input placeholder={t('form.seller.addressPlaceholder')} value={seller.address} onChange={e => setSeller(s => ({ ...s, address: e.target.value }))} className="rounded-lg text-sm" />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs font-medium text-muted-foreground mb-1 block">{t('form.seller.taxIdLabel')}</label>
                                    <Input placeholder={t('form.seller.taxIdPlaceholder')} value={seller.taxId} onChange={e => setSeller(s => ({ ...s, taxId: e.target.value }))} className="rounded-lg text-sm" />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-muted-foreground mb-1 block">{t('form.seller.phoneLabel')}</label>
                                    <Input placeholder={t('form.seller.phonePlaceholder')} value={seller.phone} onChange={e => setSeller(s => ({ ...s, phone: e.target.value }))} className="rounded-lg text-sm" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-2xl border shadow-sm">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-bold text-foreground">{t('form.buyer.title')}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div>
                                <label className="text-xs font-medium text-muted-foreground mb-1 block">{t('form.buyer.nameLabel')} <span className="text-red-500">*</span></label>
                                <Input placeholder={t('form.buyer.namePlaceholder')} value={buyer.name} onChange={e => setBuyer(b => ({ ...b, name: e.target.value }))} className="rounded-lg text-sm" />
                            </div>
                            <div>
                                <label className="text-xs font-medium text-muted-foreground mb-1 block">{t('form.buyer.addressLabel')}</label>
                                <Input placeholder={t('form.buyer.addressPlaceholder')} value={buyer.address} onChange={e => setBuyer(b => ({ ...b, address: e.target.value }))} className="rounded-lg text-sm" />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs font-medium text-muted-foreground mb-1 block">{t('form.buyer.taxIdLabel')}</label>
                                    <Input placeholder={t('form.buyer.taxIdPlaceholder')} value={buyer.taxId} onChange={e => setBuyer(b => ({ ...b, taxId: e.target.value }))} className="rounded-lg text-sm" />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-muted-foreground mb-1 block">{t('form.buyer.phoneLabel')}</label>
                                    <Input placeholder={t('form.buyer.phonePlaceholder')} value={buyer.phone} onChange={e => setBuyer(b => ({ ...b, phone: e.target.value }))} className="rounded-lg text-sm" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Line Items */}
                <Card className="rounded-2xl border shadow-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-bold text-foreground">{t('form.items.title')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {/* Table Header */}
                        <div className="hidden md:grid grid-cols-[1fr_100px_140px_120px_40px] gap-3 mb-2 px-1">
                            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">{t('form.items.descLabel')}</span>
                            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold text-right">{t('form.items.qtyLabel')}</span>
                            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold text-right">{t('form.items.priceLabel')}</span>
                            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold text-right">{t('form.items.totalLabel')}</span>
                            <span></span>
                        </div>

                        <div className="space-y-2">
                            {items.map((item, i) => (
                                <div key={i} className="grid grid-cols-1 md:grid-cols-[1fr_100px_140px_120px_40px] gap-3 p-3 rounded-xl bg-muted/30 border">
                                    <Input
                                        placeholder={t('form.items.descPlaceholder')}
                                        value={item.description}
                                        onChange={e => updateItem(i, 'description', e.target.value)}
                                        className="rounded-lg text-sm"
                                    />
                                    <Input
                                        type="number" min="1" placeholder="1"
                                        value={item.quantity || ''}
                                        onChange={e => updateItem(i, 'quantity', Number(e.target.value))}
                                        className="rounded-lg text-sm text-right"
                                    />
                                    <Input
                                        type="number" min="0" placeholder="0.00"
                                        value={item.unitPrice || ''}
                                        onChange={e => updateItem(i, 'unitPrice', Number(e.target.value))}
                                        className="rounded-lg text-sm text-right"
                                    />
                                    <div className="flex items-center justify-end">
                                        <span className="text-sm font-semibold text-foreground">฿{formatNumber(item.quantity * item.unitPrice)}</span>
                                    </div>
                                    <Button variant="ghost" size="icon" onClick={() => removeItem(i)} disabled={items.length <= 1} className="rounded-lg text-muted-foreground hover:text-red-500">
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>

                        <Button variant="outline" onClick={addItem} className="mt-3 rounded-xl gap-2 w-full text-sm border-dashed">
                            <Plus className="w-4 h-4" /> {t('form.items.addBtn')}
                        </Button>
                    </CardContent>
                </Card>

                {/* Tax & Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="rounded-2xl border shadow-sm">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-bold text-foreground">{t('form.tax.title')}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="text-sm text-foreground">{t('form.tax.vatLabel')}</label>
                                <button onClick={() => setIncludeVat(!includeVat)} className={`w-11 h-6 rounded-full transition-colors relative ${includeVat ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-600'}`}>
                                    <div className={`w-5 h-5 bg-white rounded-full shadow absolute top-0.5 transition-transform ${includeVat ? 'translate-x-[22px]' : 'translate-x-0.5'}`} />
                                </button>
                            </div>
                            <div className="flex items-center justify-between">
                                <label className="text-sm text-foreground">{t('form.tax.whtLabel')}</label>
                                <button onClick={() => setIncludeWht(!includeWht)} className={`w-11 h-6 rounded-full transition-colors relative ${includeWht ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-600'}`}>
                                    <div className={`w-5 h-5 bg-white rounded-full shadow absolute top-0.5 transition-transform ${includeWht ? 'translate-x-[22px]' : 'translate-x-0.5'}`} />
                                </button>
                            </div>
                            {includeWht && (
                                <div>
                                    <label className="text-xs font-medium text-muted-foreground mb-1 block">{t('form.tax.whtRateLabel')}</label>
                                    <select value={whtRate} onChange={e => setWhtRate(Number(e.target.value))} className="w-full rounded-lg border p-2 text-sm bg-background text-foreground">
                                        <option value={1}>{t('form.tax.whtRates.1')}</option>
                                        <option value={2}>{t('form.tax.whtRates.2')}</option>
                                        <option value={3}>{t('form.tax.whtRates.3')}</option>
                                        <option value={5}>{t('form.tax.whtRates.5')}</option>
                                    </select>
                                </div>
                            )}
                            <div>
                                <label className="text-xs font-medium text-muted-foreground mb-1 block">{t('form.tax.dueDateLabel')}</label>
                                <Input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="rounded-lg text-sm" />
                            </div>
                            <div>
                                <label className="text-xs font-medium text-muted-foreground mb-1 block">{t('form.tax.notesLabel')}</label>
                                <Input placeholder={t('form.tax.notesPlaceholder')} value={notes} onChange={e => setNotes(e.target.value)} className="rounded-lg text-sm" />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Summary */}
                    <Card className="rounded-2xl border shadow-sm">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-bold text-foreground">{t('form.summary.title')}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">{t('form.summary.subtotal')}</span>
                                <span className="font-medium text-foreground">฿{formatNumber(subtotal)}</span>
                            </div>
                            {includeVat && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">{t('form.summary.vat')}</span>
                                    <span className="font-medium text-foreground">฿{formatNumber(vat)}</span>
                                </div>
                            )}
                            {includeWht && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">{t('form.summary.wht', { rate: whtRate })}</span>
                                    <span className="font-medium text-red-600">-฿{formatNumber(wht)}</span>
                                </div>
                            )}
                            <div className="border-t-2 border-blue-600 pt-3 mt-3 flex justify-between">
                                <span className="text-base font-bold text-foreground">{t('form.summary.netTotal')}</span>
                                <span className="text-xl font-extrabold text-[#002f4b] dark:text-blue-400">฿{formatNumber(total)}</span>
                            </div>

                            <div className="pt-4 space-y-2">
                                <Button onClick={handleCreate} className="w-full text-white rounded-xl gap-2 shadow-lg h-12 font-bold" style={{ background: 'linear-gradient(135deg, #002f4b, #00466c)' }}>
                                    <FileText className="w-4 h-4" /> {t('form.summary.createBtn')}
                                </Button>
                                <Button variant="outline" onClick={() => setShowForm(false)} className="w-full rounded-xl text-sm">
                                    {t('form.summary.cancelBtn')}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    /* =================== INVOICE LIST VIEW =================== */
    return (
        <div className="p-6 md:p-8 space-y-8 max-w-[1400px] mx-auto">
            {/* Preview Overlay */}
            {previewData && <InvoicePreview data={previewData} onClose={() => setPreviewData(null)} t={t} locale={locale} />}

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground">{t('pageTitle')}</h1>
                    <p className="text-muted-foreground mt-1">{t('pageSubtitle')}</p>
                </div>
                <Button onClick={() => setShowForm(true)} className="text-white rounded-xl gap-2 shadow-lg" style={{ background: 'linear-gradient(135deg, #002f4b, #00466c)' }}>
                    <Plus className="w-4 h-4" /> {t('createBtn')}
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="rounded-2xl border shadow-sm hover:shadow-md transition-all group cursor-pointer">
                    <CardContent className="p-5 flex items-center gap-4">
                        <div className="p-3 rounded-xl shadow-lg" style={{ background: 'linear-gradient(135deg, #002f4b, #00466c)' }}>
                            <CreditCard className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-foreground">{planData.price}</p>
                            <p className="text-sm text-muted-foreground">{t('currentPlan')} ({planData.name})</p>
                        </div>
                        <ArrowUpRight className="w-4 h-4 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                    </CardContent>
                </Card>
                <Card className="rounded-2xl border shadow-sm hover:shadow-md transition-all group cursor-pointer">
                    <CardContent className="p-5 flex items-center gap-4">
                        <div className="p-3 rounded-xl shadow-lg" style={{ background: 'linear-gradient(135deg, #003d5c, #00567a)' }}>
                            <Receipt className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-foreground">{invoices.length} ฉบับ</p>
                            <p className="text-sm text-muted-foreground">{t('invoicesThisYear')}</p>
                        </div>
                        <ArrowUpRight className="w-4 h-4 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                    </CardContent>
                </Card>
                <Card className="rounded-2xl border shadow-sm hover:shadow-md transition-all group cursor-pointer">
                    <CardContent className="p-5 flex items-center gap-4">
                        <div className="p-3 rounded-xl shadow-lg" style={{ background: 'linear-gradient(135deg, #004a6f, #00678d)' }}>
                            <TrendingUp className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-foreground">฿2,670</p>
                            <p className="text-sm text-muted-foreground">{t('whtTax')}</p>
                        </div>
                        <ArrowUpRight className="w-4 h-4 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                    </CardContent>
                </Card>
            </div>

            {/* Invoice List */}
            <Card className="rounded-2xl shadow-sm border">
                <CardHeader>
                    <CardTitle className="text-foreground flex items-center gap-2 text-lg">
                        <Receipt className="w-5 h-5" style={{ color: '#002f4b' }} />
                        {t('recentInvoices')}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {invoices.map((inv) => (
                            <div
                                key={inv.id}
                                className="flex items-center justify-between p-4 rounded-xl hover:bg-muted/50 transition-colors group cursor-pointer"
                                onClick={() => inv.full && setPreviewData(inv.full)}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-500/10">
                                        <FileText className="w-4 h-4 text-[#002f4b] dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-foreground">{inv.id}</p>
                                        <p className="text-xs text-muted-foreground">{inv.date}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-sm font-bold text-foreground">{inv.amount}</span>
                                    <Badge className={inv.status === 'รอชำระ'
                                        ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20"
                                        : "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20"
                                    }>{inv.status === 'รอชำระ' ? t('status.unpaid') : t('status.paid')}</Badge>
                                    {inv.full ? (
                                        <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => { e.stopPropagation(); setPreviewData(inv.full!); }}>
                                            <Eye className="w-4 h-4" />
                                        </Button>
                                    ) : (
                                        <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Download className="w-4 h-4" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
