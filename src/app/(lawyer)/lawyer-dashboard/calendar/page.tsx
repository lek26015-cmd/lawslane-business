'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
    Gavel,
    Briefcase,
    Calendar,
    Users,
    Trash2,
} from 'lucide-react';
import LawyerSidebar from '@/components/layout/lawyer-sidebar';

interface CalendarEvent {
    id: string;
    title: string;
    date: string; // YYYY-MM-DD
    type: 'court' | 'hearing' | 'pleading' | 'appeal' | 'consultation' | 'tax' | 'other';
    courtName?: string;
    caseNo?: string;
    description?: string;
    isPreset?: boolean;
}

const EVENT_TYPES = [
    { value: 'court', label: 'วันนัดศาล', color: '#ef4444', badgeClass: 'bg-red-500/10 text-red-600 border-red-200' },
    { value: 'hearing', label: 'นัดสืบพยาน', color: '#f59e0b', badgeClass: 'bg-amber-500/10 text-amber-600 border-amber-200' },
    { value: 'pleading', label: 'กำหนดยื่นคำให้การ/คำฟ้อง', color: '#8b5cf6', badgeClass: 'bg-purple-500/10 text-purple-600 border-purple-200' },
    { value: 'appeal', label: 'กำหนดยื่นอุทธรณ์/ฎีกา', color: '#ec4899', badgeClass: 'bg-pink-500/10 text-pink-600 border-pink-200' },
    { value: 'consultation', label: 'นัดปรึกษาลูกความ', color: '#3b82f6', badgeClass: 'bg-blue-500/10 text-blue-600 border-blue-200' },
    { value: 'tax', label: 'ภาษี & บัญชี', color: '#10b981', badgeClass: 'bg-emerald-500/10 text-emerald-600 border-emerald-200' },
    { value: 'other', label: 'อื่นๆ', color: '#64748b', badgeClass: 'bg-slate-500/10 text-slate-600 border-slate-200' },
];

const INITIAL_EVENTS: CalendarEvent[] = [
    {
        id: 'EVT-1',
        title: 'นัดสืบพยานโจทก์ (คดี ผบ. 124/2568)',
        date: '2026-03-15',
        type: 'hearing',
        courtName: 'ศาลแพ่งกรุงเทพใต้',
        caseNo: 'ผบ. 124/2568',
        description: 'สืบพยานฝ่ายโจทก์ปากที่ 1 และ 2 พร้อมนำส่งพยานเอกสารต้นฉบับ',
    },
    {
        id: 'EVT-2',
        title: 'วันครบกำหนดยื่นคำให้การจำเลย (คดี อ. 88/2568)',
        date: '2026-02-28',
        type: 'pleading',
        courtName: 'ศาลอาญา',
        caseNo: 'อ. 88/2568',
        description: 'ครบกำหนด 15 วัน ยื่นคำให้การและบัญชีระบุพยาน',
    },
    {
        id: 'EVT-3',
        title: 'นัดไกล่เกลี่ยข้อพิพาทแรงงาน',
        date: '2026-03-10',
        type: 'court',
        courtName: 'ศาลแรงงานกลาง',
        caseNo: 'รล. 45/2568',
        description: 'เข้าร่วมกระบวนการประนอมข้อพิพาทกับคู่ความ',
    },
    {
        id: 'EVT-4',
        title: 'นัดปรึกษาสัญญาว่าจ้าง (บริษัท สยาม โลจิสติกส์)',
        date: '2026-03-05',
        type: 'consultation',
        description: 'ประชุมทางไกลผ่านระบบ Lawslane Chat & Video Call',
    },
];

const COURT_PRESETS = [
    { title: 'ยื่นคำให้การจำเลย (15 วัน)', type: 'pleading' as const, daysOffset: 15, desc: 'ครบกำหนด 15 วัน นับแต่วันได้รับหมายเรียกและสำเนาคำฟ้อง' },
    { title: 'ยื่นอุทธรณ์คำพิพากษา (1 เดือน)', type: 'appeal' as const, daysOffset: 30, desc: 'ครบกำหนด 1 เดือน นับแต่วันที่ได้อ่านคำพิพากษาศาลชั้นต้น' },
    { title: 'ยื่นฎีกา (1 เดือน)', type: 'appeal' as const, daysOffset: 30, desc: 'ครบกำหนด 1 เดือน นับแต่วันที่ได้อ่านคำพิพากษาศาลอุทธรณ์' },
    { title: 'ยื่นภาษี ภ.ง.ด.3 / ภ.ง.ด.53 ประจำเดือน', type: 'tax' as const, daysOffset: 7, desc: 'นำส่งภาษีหัก ณ ที่จ่ายภายในวันที่ 7 ของเดือนถัดไป' },
];

function getDaysInMonth(year: number, month: number) {
    return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
    return new Date(year, month, 1).getDay();
}

const MONTH_NAMES_TH = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม',
];

const DAY_NAMES_TH = ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'];

export default function LawyerCalendarPage() {
    const { toast } = useToast();
    const now = new Date();
    const [currentYear, setCurrentYear] = useState(now.getFullYear());
    const [currentMonth, setCurrentMonth] = useState(now.getMonth());
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [events, setEvents] = useState<CalendarEvent[]>(INITIAL_EVENTS);

    // Dialog State
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newDate, setNewDate] = useState('');
    const [newType, setNewType] = useState<CalendarEvent['type']>('court');
    const [newCourt, setNewCourt] = useState('');
    const [newCaseNo, setNewCaseNo] = useState('');
    const [newDesc, setNewDesc] = useState('');

    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

    const prevMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };

    const nextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };

    const eventsByDate = useMemo(() => {
        const map: Record<string, CalendarEvent[]> = {};
        events.forEach(e => {
            if (!map[e.date]) map[e.date] = [];
            map[e.date].push(e);
        });
        return map;
    }, [events]);

    const handleCreateEvent = () => {
        if (!newTitle.trim() || !newDate) {
            toast({ title: 'กรุณากรอกข้อมูล', description: 'ระบุชื่องานนัดหมายและวันที่', variant: 'destructive' });
            return;
        }

        const newEvent: CalendarEvent = {
            id: `EVT-${Date.now()}`,
            title: newTitle,
            date: newDate,
            type: newType,
            courtName: newCourt || undefined,
            caseNo: newCaseNo || undefined,
            description: newDesc || undefined,
        };

        setEvents([...events, newEvent]);
        setIsAddOpen(false);
        setNewTitle('');
        setNewDate('');
        setNewCourt('');
        setNewCaseNo('');
        setNewDesc('');
        toast({ title: 'บันทึกนัดหมายสำเร็จ', description: `บันทึก "${newTitle}" ลงในปฏิทินแล้ว` });
    };

    const handleAddPreset = (preset: typeof COURT_PRESETS[0]) => {
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + preset.daysOffset);
        const dateStr = targetDate.toISOString().split('T')[0];

        const newEvent: CalendarEvent = {
            id: `PRESET-${Date.now()}`,
            title: preset.title,
            date: dateStr,
            type: preset.type,
            description: preset.desc,
            isPreset: true,
        };

        setEvents([...events, newEvent]);
        toast({
            title: 'เพิ่มกำหนดการอัตโนมัติสำเร็จ',
            description: `${preset.title} วันที่ ${dateStr}`,
        });
    };

    const handleDeleteEvent = (id: string) => {
        setEvents(events.filter(e => e.id !== id));
        toast({ title: 'ลบนัดหมายแล้ว' });
    };

    const selectedEvents = selectedDate ? (eventsByDate[selectedDate] || []) : [];

    return (
        <div className="flex h-screen overflow-hidden bg-background">
            <LawyerSidebar />

            <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-extrabold text-[#002f4b] dark:text-blue-400 flex items-center gap-2">
                            <Gavel className="w-7 h-7" />
                            ปฏิทินนัดศาลและกำหนดการทางกฎหมาย
                        </h1>
                        <p className="text-muted-foreground text-sm mt-0.5">
                            จัดการวันนัดสืบพยาน นัดฟังคำพิพากษา กำหนดยื่นคำให้การ/อุทธรณ์ และการให้คำปรึกษา
                        </p>
                    </div>

                    <div className="flex items-center gap-2.5">
                        <Button
                            onClick={() => {
                                setNewDate(now.toISOString().split('T')[0]);
                                setIsAddOpen(true);
                            }}
                            className="rounded-xl text-white gap-2 shadow-md"
                            style={{ background: 'linear-gradient(135deg, #002f4b, #00466c)' }}
                        >
                            <Plus className="w-4 h-4" /> เพิ่มนัดหมาย / กำหนดส่ง
                        </Button>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left: Monthly Calendar */}
                    <div className="lg:col-span-2 space-y-4">
                        <Card className="rounded-2xl border shadow-sm overflow-hidden">
                            {/* Month Navigation */}
                            <div className="p-4 border-b flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
                                <div className="flex items-center gap-3">
                                    <h2 className="text-lg font-bold text-foreground">
                                        {MONTH_NAMES_TH[currentMonth]} {currentYear + 543}
                                    </h2>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-8 rounded-lg text-xs"
                                        onClick={() => {
                                            setCurrentYear(now.getFullYear());
                                            setCurrentMonth(now.getMonth());
                                        }}
                                    >
                                        วันนี้
                                    </Button>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={prevMonth}>
                                        <ChevronLeft className="w-4 h-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={nextMonth}>
                                        <ChevronRight className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>

                            {/* Calendar Grid */}
                            <div className="p-4">
                                <div className="grid grid-cols-7 gap-1 text-center mb-2">
                                    {DAY_NAMES_TH.map((d, i) => (
                                        <span key={i} className={`text-xs font-bold ${i === 0 ? 'text-red-500' : 'text-muted-foreground'}`}>
                                            {d}
                                        </span>
                                    ))}
                                </div>

                                <div className="grid grid-cols-7 gap-1.5">
                                    {Array.from({ length: firstDay }).map((_, i) => (
                                        <div key={`empty-${i}`} className="h-20 sm:h-24 rounded-xl bg-slate-50/30 dark:bg-slate-900/20" />
                                    ))}

                                    {Array.from({ length: daysInMonth }).map((_, i) => {
                                        const day = i + 1;
                                        const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                                        const isToday = now.getFullYear() === currentYear && now.getMonth() === currentMonth && now.getDate() === day;
                                        const isSelected = selectedDate === dateStr;
                                        const dayEvents = eventsByDate[dateStr] || [];

                                        return (
                                            <div
                                                key={`day-${day}`}
                                                onClick={() => setSelectedDate(dateStr)}
                                                className={`h-20 sm:h-24 p-1.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                                                    isSelected
                                                        ? 'border-blue-500 bg-blue-50/40 dark:bg-blue-900/20 ring-2 ring-blue-500/20'
                                                        : isToday
                                                        ? 'border-emerald-500 bg-emerald-50/30 dark:bg-emerald-900/10'
                                                        : 'border-border/60 hover:border-slate-300 dark:hover:border-slate-700 bg-card'
                                                }`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className={`text-xs font-bold ${isToday ? 'bg-emerald-600 text-white rounded-full w-5 h-5 flex items-center justify-center' : 'text-foreground'}`}>
                                                        {day}
                                                    </span>
                                                    {dayEvents.length > 0 && (
                                                        <span className="text-[10px] font-bold text-blue-600">
                                                            {dayEvents.length}
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="space-y-0.5 overflow-hidden">
                                                    {dayEvents.slice(0, 2).map((ev) => {
                                                        const typeConfig = EVENT_TYPES.find(t => t.value === ev.type);
                                                        return (
                                                            <div
                                                                key={ev.id}
                                                                className="text-[9px] font-medium truncate px-1 py-0.5 rounded"
                                                                style={{
                                                                    backgroundColor: `${typeConfig?.color || '#64748b'}15`,
                                                                    color: typeConfig?.color || '#64748b',
                                                                }}
                                                            >
                                                                {ev.title}
                                                            </div>
                                                        );
                                                    })}
                                                    {dayEvents.length > 2 && (
                                                        <p className="text-[8px] text-muted-foreground font-semibold">
                                                            +{dayEvents.length - 2} รายการ
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </Card>

                        {/* Selected Date Details */}
                        {selectedDate && (
                            <Card className="rounded-2xl border shadow-sm">
                                <CardHeader className="pb-3 border-b flex flex-row items-center justify-between">
                                    <CardTitle className="text-base font-bold flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-blue-600" />
                                        นัดหมายวันที่ {selectedDate} ({selectedEvents.length} รายการ)
                                    </CardTitle>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => {
                                            setNewDate(selectedDate);
                                            setIsAddOpen(true);
                                        }}
                                        className="rounded-lg text-xs"
                                    >
                                        + เพิ่มในวันนี้
                                    </Button>
                                </CardHeader>
                                <CardContent className="p-4 space-y-2.5">
                                    {selectedEvents.length > 0 ? (
                                        selectedEvents.map((ev) => {
                                            const typeConfig = EVENT_TYPES.find(t => t.value === ev.type);
                                            return (
                                                <div key={ev.id} className="p-3.5 rounded-xl border bg-slate-50 dark:bg-slate-900/40 flex items-start justify-between gap-3">
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2">
                                                            <Badge className={typeConfig?.badgeClass || ''}>
                                                                {typeConfig?.label || ev.type}
                                                            </Badge>
                                                            <h4 className="text-sm font-bold text-foreground">{ev.title}</h4>
                                                        </div>
                                                        {ev.courtName && (
                                                            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                                                                <Building2 className="w-3.5 h-3.5" /> ศาล/สถานที่: {ev.courtName} {ev.caseNo && `(คดี ${ev.caseNo})`}
                                                            </p>
                                                        )}
                                                        {ev.description && (
                                                            <p className="text-xs text-muted-foreground mt-1">
                                                                {ev.description}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleDeleteEvent(ev.id)}
                                                        className="h-8 w-8 text-muted-foreground hover:text-red-500 rounded-lg"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </Button>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <p className="text-xs text-muted-foreground text-center py-4">ไม่มีนัดหมายในวันที่เลือก</p>
                                    )}
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Right: Quick Presets & Upcoming List */}
                    <div className="space-y-6">
                        {/* Court Presets Card */}
                        <Card className="rounded-2xl border shadow-sm">
                            <CardHeader className="pb-3 border-b">
                                <CardTitle className="text-sm font-bold flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-amber-500" />
                                    พรีเซ็ตกำหนดการศาลด่วน (One-Click)
                                </CardTitle>
                                <CardDescription className="text-xs">
                                    คำนวณวันครบกำหนดตามกฎหมายอัตโนมัติ
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-4 space-y-2">
                                {COURT_PRESETS.map((preset, idx) => (
                                    <div key={idx} className="p-3 rounded-xl border hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors flex items-center justify-between gap-2">
                                        <div className="space-y-0.5">
                                            <p className="text-xs font-bold text-foreground">{preset.title}</p>
                                            <p className="text-[11px] text-muted-foreground">{preset.desc}</p>
                                        </div>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleAddPreset(preset)}
                                            className="rounded-lg text-[11px] h-8 shrink-0 bg-white dark:bg-slate-800"
                                        >
                                            + เพิ่ม
                                        </Button>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Upcoming Events Card */}
                        <Card className="rounded-2xl border shadow-sm">
                            <CardHeader className="pb-3 border-b">
                                <CardTitle className="text-sm font-bold flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-blue-600" />
                                    นัดหมายที่กำลังจะมาถึง ({events.length})
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 space-y-3">
                                {events.map((ev) => {
                                    const typeConfig = EVENT_TYPES.find(t => t.value === ev.type);
                                    return (
                                        <div key={ev.id} className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors">
                                            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 shrink-0">
                                                <Calendar className="w-4 h-4" />
                                            </div>
                                            <div className="space-y-0.5 flex-1 min-w-0">
                                                <p className="text-xs font-bold text-foreground truncate">{ev.title}</p>
                                                <p className="text-[11px] text-muted-foreground">{ev.date} {ev.courtName && `&bull; ${ev.courtName}`}</p>
                                            </div>
                                            <Badge className={`text-[9px] shrink-0 ${typeConfig?.badgeClass || ''}`}>
                                                {typeConfig?.label || ev.type}
                                            </Badge>
                                        </div>
                                    );
                                })}
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Add Event Dialog */}
                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogContent className="sm:max-w-[500px] rounded-2xl">
                        <DialogHeader>
                            <DialogTitle className="text-lg font-bold text-[#002f4b]">เพิ่มนัดหมาย / กำหนดการใหม่</DialogTitle>
                            <DialogDescription>บันทึกวันนัดศาล นัดสืบพยาน หรือกำหนดยื่นคำให้การ</DialogDescription>
                        </DialogHeader>

                        <div className="space-y-3 py-2">
                            <div>
                                <Label className="text-xs font-semibold">ชื่องาน / รายละเอียดนัดหมาย *</Label>
                                <Input
                                    placeholder="เช่น นัดสืบพยานโจทก์, ยื่นคำให้การ..."
                                    value={newTitle}
                                    onChange={e => setNewTitle(e.target.value)}
                                    className="mt-1"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <Label className="text-xs font-semibold">วันที่ *</Label>
                                    <Input
                                        type="date"
                                        value={newDate}
                                        onChange={e => setNewDate(e.target.value)}
                                        className="mt-1"
                                    />
                                </div>
                                <div>
                                    <Label className="text-xs font-semibold">ประเภทนัดหมาย</Label>
                                    <Select value={newType} onValueChange={(val: any) => setNewType(val)}>
                                        <SelectTrigger className="mt-1">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {EVENT_TYPES.map(t => (
                                                <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <Label className="text-xs font-semibold">ศาล / สถานที่</Label>
                                    <Input
                                        placeholder="เช่น ศาลแพ่ง"
                                        value={newCourt}
                                        onChange={e => setNewCourt(e.target.value)}
                                        className="mt-1"
                                    />
                                </div>
                                <div>
                                    <Label className="text-xs font-semibold">หมายเลขคดี (ถ้ามี)</Label>
                                    <Input
                                        placeholder="เช่น ผบ. 124/2568"
                                        value={newCaseNo}
                                        onChange={e => setNewCaseNo(e.target.value)}
                                        className="mt-1"
                                    />
                                </div>
                            </div>

                            <div>
                                <Label className="text-xs font-semibold">บันทึกเพิ่มเติม</Label>
                                <Textarea
                                    placeholder="เช่น รายชื่อพยานที่ต้องเตรียม, เอกสารที่ต้องนำส่ง..."
                                    value={newDesc}
                                    onChange={e => setNewDesc(e.target.value)}
                                    className="mt-1 resize-none h-20"
                                />
                            </div>
                        </div>

                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsAddOpen(false)}>ยกเลิก</Button>
                            <Button onClick={handleCreateEvent} className="bg-[#002f4b] hover:bg-[#001f35] text-white">บันทึกนัดหมาย</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </main>
        </div>
    );
}
