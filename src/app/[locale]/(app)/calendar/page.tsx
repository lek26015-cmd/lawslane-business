'use client';

import React, { useState, useMemo } from 'react';
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
} from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { useTranslations } from 'next-intl';
import { useToast } from '@/hooks/use-toast';
import {
    CalendarDays,
    Plus,
    Clock,
    AlertCircle,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Sparkles,
    Scale,
    FileText,
    Building2,
    Landmark,
    X,
    Gavel,
} from 'lucide-react';

// ──────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────
interface CalendarEvent {
    id: string;
    title: string;
    date: string; // YYYY-MM-DD
    type: 'deadline' | 'meeting' | 'renewal' | 'review' | 'legal' | 'tax' | 'filing' | 'other';
    description?: string;
    isPreset?: boolean;
}

// ──────────────────────────────────────────────
// Thai legal important dates (recurring yearly)
// ──────────────────────────────────────────────
const PRESET_LEGAL_DATES = [
    { key: 'tax1', date: '-01-07', type: 'tax', isPreset: true },
    { key: 'tax3', date: '-01-07', type: 'tax', isPreset: true },
    { key: 'tax53', date: '-01-07', type: 'tax', isPreset: true },
    { key: 'taxVat', date: '-01-15', type: 'tax', isPreset: true },
    { key: 'taxSso', date: '-01-15', type: 'tax', isPreset: true },
    { key: 'tax50', date: '-05-31', type: 'tax', isPreset: true },
    { key: 'tax51', date: '-08-31', type: 'tax', isPreset: true },
    { key: 'tax90', date: '-03-31', type: 'tax', isPreset: true },
    { key: 'filingFin', date: '-05-31', type: 'filing', isPreset: true },
    { key: 'filingAgm', date: '-04-30', type: 'filing', isPreset: true },
    { key: 'filingBoj5', date: '-05-14', type: 'filing', isPreset: true },
    { key: 'legalLabor', date: '-01-31', type: 'legal', isPreset: true },
    { key: 'legalPdpa', date: '-06-01', type: 'legal', isPreset: true },
    { key: 'holidayNewYear', date: '-01-01', type: 'legal', isPreset: true },
    { key: 'holidayLabor', date: '-05-01', type: 'legal', isPreset: true },
    { key: 'holidayConstitution', date: '-12-10', type: 'legal', isPreset: true }
] as const;

const EVENT_TYPES: { value: CalendarEvent['type']; label: string; color: string }[] = [
    { value: 'deadline', label: 'กำหนดส่ง', color: '#ef4444' },
    { value: 'meeting', label: 'ประชุม', color: '#3b82f6' },
    { value: 'renewal', label: 'ต่อสัญญา', color: '#f59e0b' },
    { value: 'review', label: 'ตรวจสอบ', color: '#8b5cf6' },
    { value: 'legal', label: 'กฎหมาย', color: '#10b981' },
    { value: 'tax', label: 'ภาษี', color: '#ec4899' },
    { value: 'filing', label: 'จดทะเบียน/ยื่นเอกสาร', color: '#06b6d4' },
    { value: 'other', label: 'อื่นๆ', color: '#64748b' },
];

function getTypeColor(type: string) {
    return EVENT_TYPES.find((t) => t.value === type)?.color || '#64748b';
}

function getTypeLabel(type: string) {
    return EVENT_TYPES.find((t) => t.value === type)?.label || type;
}

// ──────────────────────────────────────────────
// Calendar helpers
// ──────────────────────────────────────────────
const THAI_MONTHS = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
const THAI_DAYS_SHORT = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'];

function getDaysInMonth(year: number, month: number) {
    return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year: number, month: number) {
    return new Date(year, month, 1).getDay();
}
function formatDateKey(year: number, month: number, day: number) {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}
function isToday(year: number, month: number, day: number) {
    const now = new Date();
    return now.getFullYear() === year && now.getMonth() === month && now.getDate() === day;
}

// ──────────────────────────────────────────────
// Page Component
// ──────────────────────────────────────────────
export default function CalendarPage() {
    const t = useTranslations('B2BDashboard.calendarV2');
    const { toast } = useToast();

    const now = new Date();
    const [currentYear, setCurrentYear] = useState(now.getFullYear());
    const [currentMonth, setCurrentMonth] = useState(now.getMonth());
    const [selectedDate, setSelectedDate] = useState<string | null>(null);

    // Events state (local for now)
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [presetDialogOpen, setPresetDialogOpen] = useState(false);

    // Add event form
    const [newTitle, setNewTitle] = useState('');
    const [newDate, setNewDate] = useState('');
    const [newType, setNewType] = useState<CalendarEvent['type']>('deadline');
    const [newDescription, setNewDescription] = useState('');

    // ── Resolve preset dates for current year ──
    const resolvedPresets = useMemo(() => {
        return PRESET_LEGAL_DATES.map((p) => {
            const title = t(`presets.${p.key}.title`);
            const description = t(`presets.${p.key}.desc`);
            // Dates like "-01-07" mean every month; "-05-31" means specific month
            const parts = p.date.split('-');
            if (parts[1] === '01' && (parts[2] === '07' || parts[2] === '15')) {
                // Monthly recurring: generate for the current displayed month
                const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${parts[2]}`;
                return { ...p, title, description, date: dateStr };
            }
            return { ...p, title, description, date: `${currentYear}${p.date}` };
        });
    }, [currentYear, currentMonth, t]);

    // ── Preset dates not yet added ──
    const availablePresets = resolvedPresets.filter(
        (p) => !events.some((e) => e.title === p.title && e.date === p.date)
    );

    // ── All events mapped by date ──
    const eventsByDate = useMemo(() => {
        const map: Record<string, CalendarEvent[]> = {};
        events.forEach((e) => {
            if (!map[e.date]) map[e.date] = [];
            map[e.date].push(e);
        });
        return map;
    }, [events]);

    // ── Calendar grid ──
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

    const prevMonth = () => {
        if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(currentYear - 1); }
        else setCurrentMonth(currentMonth - 1);
    };
    const nextMonth = () => {
        if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(currentYear + 1); }
        else setCurrentMonth(currentMonth + 1);
    };
    const goToday = () => { setCurrentYear(now.getFullYear()); setCurrentMonth(now.getMonth()); };

    // ── Add event ──
    const handleAddEvent = () => {
        if (!newTitle.trim() || !newDate) {
            toast({ title: t('toast.errorIncomplete'), variant: 'destructive' });
            return;
        }
        const event: CalendarEvent = {
            id: `evt-${Date.now()}`,
            title: newTitle.trim(),
            date: newDate,
            type: newType,
            description: newDescription.trim() || undefined,
        };
        setEvents([...events, event]);
        toast({ title: t('toast.successAdd'), description: event.title });
        setNewTitle(''); setNewDate(''); setNewType('deadline'); setNewDescription('');
        setAddDialogOpen(false);
    };

    // ── Add preset ──
    const addPreset = (preset: typeof resolvedPresets[number]) => {
        const { key, ...presetData } = preset;
        const event: CalendarEvent = { ...presetData, id: `preset-${Date.now()}-${Math.random().toString(36).slice(2)}` } as CalendarEvent;
        setEvents((prev) => [...prev, event]);
        toast({ title: t('toast.successAddPreset'), description: presetData.title });
    };

    const addAllPresets = () => {
        const newEvents = availablePresets.map((p, i) => {
            const { key, ...presetData } = p;
            return {
                ...presetData,
                id: `preset-${Date.now()}-${i}`,
            } as CalendarEvent;
        });
        setEvents((prev) => [...prev, ...newEvents]);
        toast({ title: t('toast.successAddAllPresets').replace('{count}', newEvents.length.toString()) });
        setPresetDialogOpen(false);
    };

    const removeEvent = (id: string) => {
        setEvents(events.filter((e) => e.id !== id));
    };

    // ── Selected date events ──
    const selectedDateEvents = selectedDate ? (eventsByDate[selectedDate] || []) : [];

    return (
        <div className="p-4 md:p-8 space-y-6 max-w-[1400px] mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground">{t('pageTitle')}</h1>
                    <p className="text-muted-foreground mt-1">{t('pageSubtitle')}</p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        className="rounded-xl gap-2"
                        onClick={() => setPresetDialogOpen(true)}
                    >
                        <Sparkles className="w-4 h-4" /> {t('btnPreset')}
                    </Button>
                    <Button
                        className="text-white rounded-xl gap-2 shadow-lg"
                        style={{ background: 'linear-gradient(135deg, #002f4b, #00466c)' }}
                        onClick={() => { setNewDate(selectedDate || ''); setAddDialogOpen(true); }}
                    >
                        <Plus className="w-4 h-4" /> {t('btnAdd')}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* ════════════════════════════════════════ */}
                {/* Calendar Grid (left 2/3)                 */}
                {/* ════════════════════════════════════════ */}
                <Card className="lg:col-span-2 rounded-2xl border shadow-sm">
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Button variant="ghost" size="icon" className="rounded-xl h-9 w-9" onClick={prevMonth}>
                                    <ChevronLeft className="w-5 h-5" />
                                </Button>
                                <h2 className="text-lg font-bold text-foreground min-w-[180px] text-center">
                                    {t(`months.${currentMonth}`)} {currentYear + 543}
                                </h2>
                                <Button variant="ghost" size="icon" className="rounded-xl h-9 w-9" onClick={nextMonth}>
                                    <ChevronRight className="w-5 h-5" />
                                </Button>
                            </div>
                            <Button variant="outline" size="sm" className="rounded-xl text-xs" onClick={goToday}>
                                {t('btnToday')}
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-2">
                        {/* Day headers */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }} className="mb-2">
                            {Array.from({ length: 7 }).map((_, i) => (
                                <div key={i} className={`text-center text-xs font-semibold py-2 ${i === 0 ? 'text-red-500' : i === 6 ? 'text-blue-500' : 'text-muted-foreground'}`}>
                                    {t(`daysShort.${i}`)}
                                </div>
                            ))}
                        </div>

                        {/* Date cells */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
                            {/* Empty cells before first day */}
                            {Array.from({ length: firstDay }).map((_, i) => (
                                <div key={`empty-${i}`} className="h-20 md:h-24 border-t border-transparent" />
                            ))}

                            {/* Day cells */}
                            {Array.from({ length: daysInMonth }).map((_, i) => {
                                const day = i + 1;
                                const dateKey = formatDateKey(currentYear, currentMonth, day);
                                const dayEvents = eventsByDate[dateKey] || [];
                                const today = isToday(currentYear, currentMonth, day);
                                const isSelected = selectedDate === dateKey;
                                const dayOfWeek = (firstDay + i) % 7;

                                return (
                                    <button
                                        key={day}
                                        type="button"
                                        onClick={() => setSelectedDate(isSelected ? null : dateKey)}
                                        className={`
                                            h-20 md:h-24 border-t p-1 text-left transition-all relative group
                                            hover:bg-blue-50/50 dark:hover:bg-blue-500/5
                                            ${isSelected ? 'bg-slate-100 dark:bg-slate-500/10 ring-2 ring-blue-500 ring-inset rounded-lg' : ''}
                                        `}
                                    >
                                        <span className={`
                                            inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-medium
                                            ${today ? 'bg-blue-600 text-white font-bold' : ''}
                                            ${dayOfWeek === 0 && !today ? 'text-red-500' : ''}
                                            ${dayOfWeek === 6 && !today ? 'text-blue-500' : ''}
                                            ${!today && dayOfWeek !== 0 && dayOfWeek !== 6 ? 'text-foreground' : ''}
                                        `}>
                                            {day}
                                        </span>

                                        {/* Event dots */}
                                        {dayEvents.length > 0 && (
                                            <div className="flex flex-wrap gap-0.5 mt-0.5 px-0.5">
                                                {dayEvents.slice(0, 3).map((evt, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="h-1.5 flex-1 min-w-[8px] max-w-[24px] rounded-full"
                                                        style={{ backgroundColor: getTypeColor(evt.type) }}
                                                        title={evt.title}
                                                    />
                                                ))}
                                                {dayEvents.length > 3 && (
                                                    <span className="text-[10px] text-muted-foreground leading-none">+{dayEvents.length - 3}</span>
                                                )}
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Legend */}
                        <div className="flex flex-wrap gap-3 mt-4 pt-3 border-t">
                            {EVENT_TYPES.map((typeObj) => (
                                <div key={typeObj.value} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: typeObj.color }} />
                                    {t(`eventTypes.${typeObj.value}`)}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* ════════════════════════════════════════ */}
                {/* Event sidebar (right 1/3)                */}
                {/* ════════════════════════════════════════ */}
                <Card className="rounded-2xl border shadow-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                            <div className="p-1.5 rounded-lg" style={{ background: 'linear-gradient(135deg, #3b82f6, #4f46e5)' }}>
                                <CalendarDays className="w-4 h-4 text-white" />
                            </div>
                            {selectedDate ? (
                                <span>
                                    {new Date(selectedDate + 'T00:00:00').toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </span>
                            ) : (
                                <span>{t('eventsMonth')}</span>
                            )}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {(() => {
                            const displayEvents = selectedDate
                                ? selectedDateEvents
                                : events.filter((e) => {
                                    const d = new Date(e.date + 'T00:00:00');
                                    return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
                                }).sort((a, b) => a.date.localeCompare(b.date));

                            if (displayEvents.length === 0) {
                                return (
                                    <div className="text-center py-10">
                                        <CalendarDays className="w-10 h-10 mx-auto mb-3 text-muted-foreground/30" />
                                        <p className="text-sm text-muted-foreground">
                                            {selectedDate ? t('noEventsToday') : t('noEventsMonth')}
                                        </p>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="mt-3 rounded-xl gap-1 text-xs"
                                            onClick={() => { setNewDate(selectedDate || ''); setAddDialogOpen(true); }}
                                        >
                                            <Plus className="w-3 h-3" /> {t('btnAdd')}
                                        </Button>
                                    </div>
                                );
                            }

                            return (
                                <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                                    {displayEvents.map((evt) => (
                                        <div key={evt.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors group relative">
                                            <div
                                                className="w-1 h-full min-h-[40px] rounded-full shrink-0 mt-0.5"
                                                style={{ backgroundColor: getTypeColor(evt.type) }}
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-foreground leading-tight">{evt.title}</p>
                                                <p className="text-xs text-muted-foreground mt-0.5">
                                                    {new Date(evt.date + 'T00:00:00').toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })} · {t(`eventTypes.${evt.type}`)}
                                                </p>
                                                {evt.description && (
                                                    <p className="text-xs text-muted-foreground/70 mt-1 line-clamp-2">{evt.description}</p>
                                                )}
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 text-red-400 hover:text-red-600 hover:bg-red-50"
                                                onClick={(e) => { e.stopPropagation(); removeEvent(evt.id); }}
                                            >
                                                <X className="w-3.5 h-3.5" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            );
                        })()}
                    </CardContent>
                </Card>
            </div>

            {/* ════════════════════════════════════════ */}
            {/* Add Event Dialog                         */}
            {/* ════════════════════════════════════════ */}
            <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
                <DialogContent className="sm:max-w-[480px] rounded-2xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <div className="p-2 rounded-xl" style={{ background: 'linear-gradient(135deg, #3b82f6, #4f46e5)' }}>
                                <Plus className="w-4 h-4 text-white" />
                            </div>
                            {t('dialogAdd.title')}
                        </DialogTitle>
                        <DialogDescription>{t('dialogAdd.desc')}</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 mt-2">
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold">{t('dialogAdd.nameLabel')} <span className="text-red-500">*</span></Label>
                            <Input placeholder={t('dialogAdd.namePlaceholder')} value={newTitle} onChange={(e) => setNewTitle(e.target.value)} className="rounded-xl h-10" />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold">{t('dialogAdd.dateLabel')} <span className="text-red-500">*</span></Label>
                                <Input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} className="rounded-xl h-10" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold">{t('dialogAdd.typeLabel')}</Label>
                                <Select value={newType} onValueChange={(v) => setNewType(v as CalendarEvent['type'])}>
                                    <SelectTrigger className="rounded-xl h-10">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {EVENT_TYPES.map((tObj) => (
                                            <SelectItem key={tObj.value} value={tObj.value}>
                                                <span className="flex items-center gap-2">
                                                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: tObj.color }} />
                                                    {t(`eventTypes.${tObj.value}`)}
                                                </span>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold">{t('dialogAdd.descLabel')}</Label>
                            <Textarea placeholder={t('dialogAdd.descPlaceholder')} value={newDescription} onChange={(e) => setNewDescription(e.target.value)} className="rounded-xl min-h-[60px] resize-none" />
                        </div>
                    </div>
                    <DialogFooter className="mt-4">
                        <Button variant="outline" className="rounded-xl" onClick={() => setAddDialogOpen(false)}>{t('dialogAdd.cancelBtn')}</Button>
                        <Button className="text-white rounded-xl gap-2" style={{ background: 'linear-gradient(135deg, #002f4b, #00466c)' }} onClick={handleAddEvent}>
                            <Plus className="w-4 h-4" /> {t('dialogAdd.submitBtn')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* ════════════════════════════════════════ */}
            {/* Preset Legal Dates Dialog                 */}
            {/* ════════════════════════════════════════ */}
            <Dialog open={presetDialogOpen} onOpenChange={setPresetDialogOpen}>
                <DialogContent className="sm:max-w-[600px] max-h-[80vh] rounded-2xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <div className="p-2 rounded-xl" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                                <Scale className="w-4 h-4 text-white" />
                            </div>
                            {t('dialogPreset.title')}
                        </DialogTitle>
                        <DialogDescription>{t('dialogPreset.desc')}</DialogDescription>
                    </DialogHeader>

                    {availablePresets.length > 0 && (
                        <div className="mb-2">
                            <Button
                                className="w-full text-white rounded-xl gap-2"
                                style={{ background: 'linear-gradient(135deg, #002f4b, #00466c)' }}
                                onClick={addAllPresets}
                            >
                                <Sparkles className="w-4 h-4" /> {t('dialogPreset.addAllBtn')} ({availablePresets.length} {t('dialogPreset.items')})
                            </Button>
                        </div>
                    )}

                    <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                        {resolvedPresets.map((preset, i) => {
                            const alreadyAdded = events.some((e) => e.title === preset.title && e.date === preset.date);
                            return (
                                <div key={i} className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${alreadyAdded ? 'opacity-50 bg-muted/30' : 'hover:bg-muted/50'}`}>
                                    <div
                                        className="w-1 h-full min-h-[36px] rounded-full shrink-0 mt-0.5"
                                        style={{ backgroundColor: getTypeColor(preset.type) }}
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-foreground">{preset.title}</p>
                                        <p className="text-xs text-muted-foreground mt-0.5">
                                            {new Date(preset.date + 'T00:00:00').toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            {' · '}{t(`eventTypes.${preset.type}`)}
                                        </p>
                                        {preset.description && (
                                            <p className="text-xs text-muted-foreground/70 mt-0.5">{preset.description}</p>
                                        )}
                                    </div>
                                    {alreadyAdded ? (
                                        <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20 shrink-0 text-[10px]">
                                            {t('dialogPreset.addedBadge')}
                                        </Badge>
                                    ) : (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="rounded-xl shrink-0 text-xs h-8 gap-1"
                                            onClick={() => addPreset(preset)}
                                        >
                                            <Plus className="w-3 h-3" /> {t('dialogPreset.addBtn')}
                                        </Button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
