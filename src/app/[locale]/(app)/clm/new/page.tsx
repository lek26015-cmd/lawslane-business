'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    SelectGroup,
    SelectLabel,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/firebase';
import { contractService, type ContractData } from '@/services/contractService';
import { integrationService } from '@/services/integrationService';
import { useRouter } from 'next/navigation';
import {
    ArrowLeft,
    FileText,
    Users,
    Banknote,
    CalendarDays,
    ClipboardList,
    Shield,
    Loader2,
    Plus,
    X,
    Tag,
    Building2,
    AlertTriangle,
} from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
export default function CreateContractPage() {
    const { toast } = useToast();
    const { user } = useUser();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const t = useTranslations('B2BDashboard.clm.form');

    const categoryGroups = [
        {
            groupLabel: t('groups.general'),
            items: [
                { value: 'nda', label: t('categories.nda'), icon: '🔒' },
                { value: 'service', label: t('categories.service'), icon: '🛠️' },
                { value: 'sales', label: t('categories.sales'), icon: '🛒' },
                { value: 'employment', label: t('categories.employment'), icon: '👔' },
                { value: 'consulting', label: t('categories.consulting'), icon: '💼' },
            ],
        },
        {
            groupLabel: t('groups.business'),
            items: [
                { value: 'vendor', label: t('categories.vendor'), icon: '🏪' },
                { value: 'partnership', label: t('categories.partnership'), icon: '🤝' },
                { value: 'franchise', label: t('categories.franchise'), icon: '🏬' },
                { value: 'distribution', label: t('categories.distribution'), icon: '📦' },
                { value: 'procurement', label: t('categories.procurement'), icon: '📋' },
            ],
        },
        {
            groupLabel: t('groups.specific'),
            items: [
                { value: 'lease', label: t('categories.lease'), icon: '🏢' },
                { value: 'loan', label: t('categories.loan'), icon: '🏦' },
                { value: 'license', label: t('categories.license'), icon: '📄' },
                { value: 'construction', label: t('categories.construction'), icon: '🏗️' },
                { value: 'other', label: t('categories.other'), icon: '📝' },
            ],
        },
    ];

    const priorities: { value: string; label: string; color: string }[] = [
        { value: 'low', label: t('priorities.low'), color: 'bg-slate-100 text-slate-600' },
        { value: 'medium', label: t('priorities.medium'), color: 'bg-blue-100 text-[#002f4b]' },
        { value: 'high', label: t('priorities.high'), color: 'bg-amber-100 text-amber-700' },
        { value: 'urgent', label: t('priorities.urgent'), color: 'bg-red-100 text-red-700' },
    ];

    const currencies = ['THB', 'USD', 'EUR', 'JPY', 'CNY', 'GBP'];

    // ── Basic Info ──
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState<string>('nda');
    const [priority, setPriority] = useState<string>('medium');
    const [department, setDepartment] = useState('');
    const [tagInput, setTagInput] = useState('');
    const [tags, setTags] = useState<string[]>([]);

    // ── Parties ──
    const [employerName, setEmployerName] = useState('');
    const [employerEmail, setEmployerEmail] = useState('');
    const [employerIdCard, setEmployerIdCard] = useState('');
    const [employerAddress, setEmployerAddress] = useState('');
    const [contractorName, setContractorName] = useState('');
    const [contractorEmail, setContractorEmail] = useState('');
    const [contractorIdCard, setContractorIdCard] = useState('');
    const [contractorAddress, setContractorAddress] = useState('');

    // ── Signatories ──
    const [signatories, setSignatories] = useState<{ name: string; role: string; email: string }[]>([]);

    // ── Details ──
    const [task, setTask] = useState('');
    const [content, setContent] = useState('');
    const [paymentTerms, setPaymentTerms] = useState('');

    // ── Financials ──
    const [price, setPrice] = useState('');
    const [deposit, setDeposit] = useState('');
    const [currency, setCurrency] = useState('THB');

    // ── Dates ──
    const [startDate, setStartDate] = useState('');
    const [deadline, setDeadline] = useState('');
    const [renewalDate, setRenewalDate] = useState('');

    // ── Notes ──
    const [notes, setNotes] = useState('');

    // ── Tag Helpers ──
    const addTag = () => {
        const t = tagInput.trim();
        if (t && !tags.includes(t)) {
            setTags([...tags, t]);
            setTagInput('');
        }
    };
    const removeTag = (tag: string) => setTags(tags.filter((t) => t !== tag));

    // ── Signatory Helpers ──
    const addSignatory = () => setSignatories([...signatories, { name: '', role: '', email: '' }]);
    const removeSignatory = (i: number) => setSignatories(signatories.filter((_, idx) => idx !== i));
    const updateSignatory = (i: number, field: string, value: string) => {
        const updated = [...signatories];
        (updated[i] as any)[field] = value;
        setSignatories(updated);
    };

    // ── Submit ──
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        if (!title.trim()) {
            toast({ title: t('messages.errName'), variant: 'destructive' });
            return;
        }
        if (!employerName.trim() || !contractorName.trim()) {
            toast({ title: t('messages.errParties'), variant: 'destructive' });
            return;
        }

        setLoading(true);
        try {
            await contractService.createContract({
                title: title.trim(),
                ownerId: user.uid,
                category: (category || 'other') as ContractData['category'],
                priority: (priority || 'medium') as ContractData['priority'],
                department: department.trim() || undefined,
                tags: tags.length > 0 ? tags : undefined,
                employer: {
                    name: employerName.trim(),
                    email: employerEmail.trim() || undefined,
                    id_card: employerIdCard.trim() || undefined,
                    address: employerAddress.trim() || undefined,
                },
                contractor: {
                    name: contractorName.trim(),
                    email: contractorEmail.trim() || undefined,
                    id_card: contractorIdCard.trim() || undefined,
                    address: contractorAddress.trim() || undefined,
                },
                signatories: signatories.filter(s => s.name.trim()).map(s => ({
                    name: s.name.trim(),
                    role: s.role.trim(),
                    email: s.email.trim() || undefined,
                })),
                task: task.trim(),
                content: content.trim() || undefined,
                price: parseFloat(price) || 0,
                deposit: parseFloat(deposit) || undefined,
                currency: currency || 'THB',
                paymentTerms: paymentTerms.trim() || undefined,
                startDate: startDate || undefined,
                deadline: deadline || '-',
                renewalDate: renewalDate || undefined,
                notes: notes.trim() || undefined,
                status: 'draft',
            });

            toast({
                title: t('messages.successTitle'),
                description: t('messages.successDesc', { title }),
            });

            // Trigger Slack Webhook Integration
            try {
                const slackWebhook = await integrationService.getSlackWebhook(user.uid);
                if (slackWebhook) {
                    const priceText = price ? parseFloat(price).toLocaleString() + ' ' + (currency || 'THB') : t('messages.slackMsgPriceNone').replace('💰 มูลค่า: ', '');

                    const message = `\n${t('messages.slackMsgTitle')}\n\n${t('messages.slackMsgName', { title: title.trim() })}\n${t('messages.slackMsgEmp', { employer: employerName.trim() })}\n${t('messages.slackMsgCont', { contractor: contractorName.trim() })}\n${t('messages.slackMsgPrice', { price: priceText })}\n${t('messages.slackMsgUser', { user: user.email })}\n\n${t('messages.slackMsgLink')}`;

                    const response = await fetch('/api/integrations/slack', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            webhookUrl: slackWebhook,
                            message: message
                        })
                    });

                    if (response.ok) {
                        toast({
                            title: t('messages.slackTitle'),
                            description: t('messages.slackDesc'),
                        });
                    }
                }
            } catch (notifyError) {
                console.error('Slack Webhook Error:', notifyError);
                // Don't fail the whole submission if notification fails
            }

            router.push('/clm');
        } catch (error) {
            console.error('Error creating contract:', error);
            toast({
                title: t('messages.errorTitle'),
                description: t('messages.errorDesc'),
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 md:p-8 max-w-[1000px] mx-auto pb-20">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link href="/clm">
                    <Button variant="ghost" size="icon" className="rounded-xl hover:bg-muted">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground">{t('title')}</h1>
                    <p className="text-muted-foreground text-sm mt-1">{t('subtitle')}</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* ════════════════════════════════════════════ */}
                {/* Section 1: ข้อมูลทั่วไป                       */}
                {/* ════════════════════════════════════════════ */}
                <Card className="rounded-2xl border shadow-sm">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <FileText className="w-5 h-5 text-[#002f4b] dark:text-blue-400" />
                            {t('sections.general')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-5">
                        {/* Title */}
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold">
                                {t('fields.contractName')} <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                placeholder={t('fields.contractNamePlaceholder')}
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="rounded-xl h-11"
                                required
                            />
                        </div>

                        {/* Category + Priority */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold">{t('fields.category')}</Label>
                                <Select value={category} onValueChange={setCategory}>
                                    <SelectTrigger className="rounded-xl h-11">
                                        <SelectValue placeholder={t('fields.categoryPlaceholder')} />
                                    </SelectTrigger>
                                    <SelectContent className="max-h-80">
                                        {categoryGroups.map((group) => (
                                            <SelectGroup key={group.groupLabel}>
                                                <SelectLabel className="font-bold text-xs uppercase tracking-wider">{group.groupLabel}</SelectLabel>
                                                {group.items.map((item) => (
                                                    <SelectItem key={item.value} value={item.value}>
                                                        <span className="flex items-center gap-2">
                                                            <span>{item.icon}</span>
                                                            <span>{item.label}</span>
                                                        </span>
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold">{t('fields.priority')}</Label>
                                <Select value={priority} onValueChange={setPriority}>
                                    <SelectTrigger className="rounded-xl h-11">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {priorities.map((p) => (
                                            <SelectItem key={p.value} value={p.value}>
                                                <span className="flex items-center gap-2">
                                                    <Badge className={`${p.color} text-[10px] px-1.5 py-0 border-0`}>{p.label}</Badge>
                                                </span>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Department */}
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold">{t('fields.department')}</Label>
                            <Input
                                placeholder={t('fields.departmentPlaceholder')}
                                value={department}
                                onChange={(e) => setDepartment(e.target.value)}
                                className="rounded-xl h-11"
                            />
                        </div>

                        {/* Tags */}
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold">
                                <Tag className="w-3.5 h-3.5 inline mr-1" /> {t('fields.tags')}
                            </Label>
                            <div className="flex gap-2">
                                <Input
                                    placeholder={t('fields.tagPlaceholder')}
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                                    className="rounded-xl h-10"
                                />
                                <Button type="button" variant="outline" className="rounded-xl h-10 shrink-0" onClick={addTag}>
                                    {t('fields.btnAdd')}
                                </Button>
                            </div>
                            {tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {tags.map((tag) => (
                                        <Badge key={tag} variant="secondary" className="gap-1 px-2.5 py-1 rounded-lg">
                                            {tag}
                                            <X className="w-3 h-3 cursor-pointer hover:text-red-500" onClick={() => removeTag(tag)} />
                                        </Badge>
                                    ))}
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* ════════════════════════════════════════════ */}
                {/* Section 2: คู่สัญญา                          */}
                {/* ════════════════════════════════════════════ */}
                <Card className="rounded-2xl border shadow-sm">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Users className="w-5 h-5 text-[#002f4b] dark:text-blue-400" />
                            {t('sections.parties')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Party A: ผู้ว่าจ้าง */}
                        <div className="space-y-4 p-4 rounded-xl bg-muted/30 border border-dashed">
                            <div className="flex items-center gap-2">
                                <Badge className="bg-blue-100 text-[#002f4b] dark:bg-blue-500/15 dark:text-blue-400 border-0">{t('parties.partyA')}</Badge>
                                <span className="text-sm font-semibold text-foreground">{t('parties.partyADesc')}</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs font-medium text-muted-foreground">{t('parties.name')} <span className="text-red-500">*</span></Label>
                                    <Input placeholder={t('parties.namePlaceholder')} value={employerName} onChange={(e) => setEmployerName(e.target.value)} className="rounded-xl h-10" required />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-medium text-muted-foreground">{t('parties.email')}</Label>
                                    <Input type="email" placeholder={t('parties.emailPlaceholder')} value={employerEmail} onChange={(e) => setEmployerEmail(e.target.value)} className="rounded-xl h-10" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-medium text-muted-foreground">{t('parties.idCard')}</Label>
                                    <Input placeholder={t('parties.idCardPlaceholder')} value={employerIdCard} onChange={(e) => setEmployerIdCard(e.target.value)} className="rounded-xl h-10" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-medium text-muted-foreground">{t('parties.address')}</Label>
                                    <Input placeholder={t('parties.addressPlaceholder')} value={employerAddress} onChange={(e) => setEmployerAddress(e.target.value)} className="rounded-xl h-10" />
                                </div>
                            </div>
                        </div>

                        {/* Party B: ผู้รับจ้าง */}
                        <div className="space-y-4 p-4 rounded-xl bg-muted/30 border border-dashed">
                            <div className="flex items-center gap-2">
                                <Badge className="bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-400 border-0">{t('parties.partyB')}</Badge>
                                <span className="text-sm font-semibold text-foreground">{t('parties.partyBDesc')}</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs font-medium text-muted-foreground">{t('parties.name')} <span className="text-red-500">*</span></Label>
                                    <Input placeholder={t('parties.namePlaceholder')} value={contractorName} onChange={(e) => setContractorName(e.target.value)} className="rounded-xl h-10" required />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-medium text-muted-foreground">{t('parties.email')}</Label>
                                    <Input type="email" placeholder={t('parties.emailPlaceholder')} value={contractorEmail} onChange={(e) => setContractorEmail(e.target.value)} className="rounded-xl h-10" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-medium text-muted-foreground">{t('parties.idCard')}</Label>
                                    <Input placeholder={t('parties.idCardPlaceholder2')} value={contractorIdCard} onChange={(e) => setContractorIdCard(e.target.value)} className="rounded-xl h-10" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-medium text-muted-foreground">{t('parties.address')}</Label>
                                    <Input placeholder={t('parties.addressPlaceholder')} value={contractorAddress} onChange={(e) => setContractorAddress(e.target.value)} className="rounded-xl h-10" />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* ════════════════════════════════════════════ */}
                {/* Section 3: ผู้ลงนาม (Signatories)            */}
                {/* ════════════════════════════════════════════ */}
                <Card className="rounded-2xl border shadow-sm">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-lg flex items-center justify-between">
                            <span className="flex items-center gap-2">
                                <Shield className="w-5 h-5 text-[#002f4b] dark:text-blue-400" />
                                {t('sections.signatories')}
                            </span>
                            <Button type="button" variant="outline" size="sm" className="rounded-xl gap-1 text-xs" onClick={addSignatory}>
                                <Plus className="w-3.5 h-3.5" /> {t('signatories.btnAdd')}
                            </Button>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {signatories.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground text-sm">
                                <Shield className="w-8 h-8 mx-auto mb-2 opacity-30" />
                                <p>{t('signatories.empty')}</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {signatories.map((s, i) => (
                                    <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-muted/30 border border-dashed">
                                        <span className="text-xs font-bold text-muted-foreground mt-2.5 w-5 shrink-0">{i + 1}.</span>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1">
                                            <Input placeholder={t('signatories.namePlaceholder')} value={s.name} onChange={(e) => updateSignatory(i, 'name', e.target.value)} className="rounded-xl h-9 text-sm" />
                                            <Input placeholder={t('signatories.rolePlaceholder')} value={s.role} onChange={(e) => updateSignatory(i, 'role', e.target.value)} className="rounded-xl h-9 text-sm" />
                                            <Input type="email" placeholder={t('parties.emailPlaceholder')} value={s.email} onChange={(e) => updateSignatory(i, 'email', e.target.value)} className="rounded-xl h-9 text-sm" />
                                        </div>
                                        <Button type="button" variant="ghost" size="icon" className="shrink-0 h-9 w-9 text-red-400 hover:text-red-600 hover:bg-red-50" onClick={() => removeSignatory(i)}>
                                            <X className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* ════════════════════════════════════════════ */}
                {/* Section 4: รายละเอียดงาน                      */}
                {/* ════════════════════════════════════════════ */}
                <Card className="rounded-2xl border shadow-sm">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <ClipboardList className="w-5 h-5 text-[#002f4b] dark:text-blue-400" />
                            {t('sections.details')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-5">
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold">{t('details.scope')}</Label>
                            <Textarea
                                placeholder={t('details.scopePlaceholder')}
                                value={task}
                                onChange={(e) => setTask(e.target.value)}
                                className="rounded-xl min-h-[100px] resize-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold">{t('details.content')}</Label>
                            <Textarea
                                placeholder={t('details.contentPlaceholder')}
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="rounded-xl min-h-[120px] resize-none"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* ════════════════════════════════════════════ */}
                {/* Section 5: การเงิน                           */}
                {/* ════════════════════════════════════════════ */}
                <Card className="rounded-2xl border shadow-sm">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Banknote className="w-5 h-5 text-[#002f4b] dark:text-blue-400" />
                            {t('sections.finance')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold">{t('finance.value')}</Label>
                                <Input type="number" placeholder="0.00" value={price} onChange={(e) => setPrice(e.target.value)} className="rounded-xl h-11" min="0" step="0.01" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold">{t('finance.deposit')}</Label>
                                <Input type="number" placeholder="0.00" value={deposit} onChange={(e) => setDeposit(e.target.value)} className="rounded-xl h-11" min="0" step="0.01" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold">{t('finance.currency')}</Label>
                                <Select value={currency} onValueChange={setCurrency}>
                                    <SelectTrigger className="rounded-xl h-11">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {currencies.map((c) => (
                                            <SelectItem key={c} value={c}>{c}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold">{t('finance.paymentTerms')}</Label>
                            <Textarea
                                placeholder={t('finance.paymentTermsPlaceholder')}
                                value={paymentTerms}
                                onChange={(e) => setPaymentTerms(e.target.value)}
                                className="rounded-xl min-h-[70px] resize-none"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* ════════════════════════════════════════════ */}
                {/* Section 6: กำหนดเวลา                         */}
                {/* ════════════════════════════════════════════ */}
                <Card className="rounded-2xl border shadow-sm">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <CalendarDays className="w-5 h-5 text-[#002f4b] dark:text-blue-400" />
                            {t('sections.dates')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold">{t('dates.startDate')}</Label>
                                <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="rounded-xl h-11" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold">{t('dates.endDate')}</Label>
                                <Input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} className="rounded-xl h-11" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold">{t('dates.renewalDate')}</Label>
                                <Input type="date" value={renewalDate} onChange={(e) => setRenewalDate(e.target.value)} className="rounded-xl h-11" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* ════════════════════════════════════════════ */}
                {/* Section 7: หมายเหตุ                          */}
                {/* ════════════════════════════════════════════ */}
                <Card className="rounded-2xl border shadow-sm">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-[#002f4b] dark:text-blue-400" />
                            {t('sections.notes')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Textarea
                            placeholder={t('notes.placeholder')}
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="rounded-xl min-h-[80px] resize-none"
                        />
                    </CardContent>
                </Card>

                {/* ════════════════════════════════════════════ */}
                {/* Actions                                       */}
                {/* ════════════════════════════════════════════ */}
                <div className="flex items-center justify-between pt-4 sticky bottom-0 bg-background/95 backdrop-blur-sm py-4 border-t -mx-4 px-4 md:-mx-8 md:px-8">
                    <Link href="/clm">
                        <Button type="button" variant="outline" className="rounded-xl gap-2" disabled={loading}>
                            <ArrowLeft className="w-4 h-4" /> {t('actions.cancel')}
                        </Button>
                    </Link>
                    <Button
                        type="submit"
                        className="text-white rounded-xl gap-2 shadow-lg px-8 h-11 bg-gradient-to-br from-[#002f4b] to-[#00466c] hover:from-[#001f35] hover:to-[#002f4b] dark:from-[#002f4b] dark:to-[#00466c] border-0"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                {t('actions.submitting')}
                            </>
                        ) : (
                            <>
                                <FileText className="w-4 h-4" />
                                {t('actions.submit')}
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}
