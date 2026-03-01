'use client';
export const runtime = 'edge';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useFirebase, useUser } from '@/firebase';
import { collection, query, where, onSnapshot, orderBy, doc, getDoc } from 'firebase/firestore';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, MessageSquare, CheckCircle2, Clock, ArrowRight, UserCircle } from 'lucide-react';
import logoColor from '@/pic/logo-lawslane-transparent-color.png';

interface ChatConversation {
    id: string;
    lawyerId: string;
    lawyerName: string;
    lawyerImageUrl: string;
    lastMessage?: string;
    lastMessageAt?: any;
    status: string;
    unreadCount?: number;
    // Additional fields we fetch
    lawyerSpecialty?: string[];
    lawyerLicenseNumber?: string;
}

export default function B2BMessagesPage() {
    const { firestore } = useFirebase();
    const { user } = useUser();
    const [conversations, setConversations] = useState<ChatConversation[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<'INDEX_REQUIRED' | 'FETCH_ERROR' | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (!firestore || !user) {
            setIsLoading(false);
            return;
        }

        const chatsRef = collection(firestore, 'chats');
        const q = query(
            chatsRef,
            where('clientId', '==', user.uid),
            orderBy('updatedAt', 'desc')
        );

        const unsubscribe = onSnapshot(q, async (snapshot) => {
            const chats: ChatConversation[] = [];

            for (const chatDoc of snapshot.docs) {
                const data = chatDoc.data();
                let lawyerSpecialty: string[] = [];
                let lawyerLicenseNumber = '';

                chats.push({
                    id: chatDoc.id,
                    lawyerId: data.lawyerId || '',
                    lawyerName: data.lawyerName || 'ทนายความ',
                    lawyerImageUrl: data.lawyerImageUrl || '',
                    lastMessage: data.lastMessage || '',
                    lastMessageAt: data.updatedAt,
                    status: data.status || 'active',
                    unreadCount: data.unreadByClient || 0,
                    lawyerSpecialty,
                    lawyerLicenseNumber,
                });
            }

            setConversations(chats);
            setIsLoading(false);
            setError(null);
        }, (err: any) => {
            console.error("Error fetching conversations:", err);
            if (err.message?.includes('index')) {
                setError('INDEX_REQUIRED');
            } else {
                setError('FETCH_ERROR');
            }
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [firestore, user]);

    const filteredConversations = conversations.filter(c =>
        c.lawyerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.lastMessage && c.lastMessage.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const formatTime = (timestamp: any) => {
        if (!timestamp) return '';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const mins = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (mins < 1) return 'ตอนนี้';
        if (mins < 60) return `${mins} นาที`;
        if (hours < 24) return `${hours} ชม.`;
        if (days < 7) return `${days} วัน`;
        return date.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' });
    };

    if (error === 'INDEX_REQUIRED') {
        const indexUrl = `https://console.firebase.google.com/v1/r/project/studio-3946808940-28553/firestore/indexes?create_composite=ClVwcm9qZWN0cy9zdHVkaW8tMzk0NjgwODk0MC0yODU1My9kYXRhYmFzZXMvKGRlZmF1bHQpL2NvbGxlY3Rpb25Hcm91cHMvY2hhdHMvaW5kZXhlcy9fEAEaDAoIY2xpZW50SWQQARoNCgl1cGRhdGVkQXQQAhoMCghfX25hbWVfXxAC`;
        return (
            <div className="flex-1 p-6 md:p-8 bg-muted/10 min-h-[calc(100vh-64px)] flex items-center justify-center">
                <Card className="max-w-md w-full rounded-2xl border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-900/50 shadow-lg">
                    <CardContent className="p-8 text-center space-y-4">
                        <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto text-amber-600">
                            <Clock className="w-8 h-8 animate-pulse" />
                        </div>
                        <h2 className="text-xl font-bold text-amber-900 dark:text-amber-200">กำลังเตรียมระบบฐานข้อมูล...</h2>
                        <p className="text-sm text-amber-800/70 dark:text-amber-300/60 leading-relaxed">
                            ระบบกำลังสร้างดัชนี (Index) สำหรับการเรียกดูข้อความครั้งแรก
                            กรุณารอประมาณ 2-5 นาที แล้วลองกด Refresh หน้าจออีกครั้งครับ
                        </p>
                        <div className="pt-2">
                            <Button asChild className="bg-amber-600 hover:bg-amber-700 text-white border-none">
                                <a href={indexUrl} target="_blank" rel="noopener noreferrer">
                                    คลิกที่นี่เพื่อยืนยันการสร้าง Index
                                </a>
                            </Button>
                        </div>
                        <p className="text-[10px] text-amber-700/50">
                            *ถ้ากดปุ่มยืนยันไปแล้ว ให้รอจนแถบสถานะในหน้าเว็บเป็นสีเขียว "Enabled"
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="flex-1 p-6 md:p-8 bg-muted/10 min-h-[calc(100vh-64px)]">
                <div className="max-w-3xl mx-auto space-y-4">
                    <div className="h-16 bg-muted animate-pulse rounded-2xl"></div>
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="h-20 bg-muted animate-pulse rounded-xl"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 p-6 md:p-8 bg-muted/10 min-h-[calc(100vh-64px)]">
            <div className="max-w-3xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card border rounded-2xl p-6 shadow-sm">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-bold tracking-tight text-[#002f4b] dark:text-blue-100 flex items-center gap-2">
                            <MessageSquare className="w-6 h-6 text-blue-500" />
                            ข้อความทั้งหมด
                        </h1>
                        <p className="text-muted-foreground text-sm">
                            ประวัติการสนทนากับทนายความทั้งหมดของคุณ
                        </p>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <div className="relative flex-1 sm:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                            <Input
                                placeholder="ค้นหาข้อความ..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 rounded-full bg-background border-muted-foreground/20 focus-visible:ring-blue-500"
                            />
                        </div>
                        <Button asChild className="bg-[#002f4b] hover:bg-[#001f35] text-white dark:bg-blue-600 dark:hover:bg-blue-700 rounded-full shrink-0">
                            <Link href="/lawyers">
                                แชทใหม่
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Conversation List */}
                {filteredConversations.length > 0 ? (
                    <div className="space-y-2">
                        {filteredConversations.map((conv) => (
                            <Link
                                key={conv.id}
                                href={`/messages/${conv.id}`}
                                className="flex items-center gap-4 p-4 bg-card border rounded-xl hover:shadow-md hover:border-blue-500/30 transition-all group cursor-pointer"
                            >
                                {/* Avatar */}
                                <div className="w-12 h-12 rounded-full overflow-hidden relative bg-muted shrink-0 border">
                                    {conv.lawyerImageUrl ? (
                                        <Image
                                            src={conv.lawyerImageUrl}
                                            alt={conv.lawyerName}
                                            fill
                                            className="object-cover"
                                            sizes="48px"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Image
                                                src={logoColor}
                                                alt="Lawslane"
                                                width={28}
                                                height={28}
                                                className="object-contain"
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <h3 className="font-bold text-sm truncate group-hover:text-blue-600 transition-colors">
                                            {conv.lawyerName}
                                        </h3>
                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                        {conv.unreadCount && conv.unreadCount > 0 && (
                                            <Badge className="bg-blue-600 text-white text-[10px] px-1.5 py-0 rounded-full font-bold min-w-[18px] h-[18px] flex items-center justify-center shrink-0 ml-auto">
                                                {conv.unreadCount}
                                            </Badge>
                                        )}
                                    </div>
                                    <p className="text-xs text-muted-foreground truncate max-w-md">
                                        {conv.lastMessage || 'เริ่มต้นการสนทนา...'}
                                    </p>
                                </div>

                                {/* Time & Arrow */}
                                <div className="flex flex-col items-end gap-1 shrink-0">
                                    <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {formatTime(conv.lastMessageAt)}
                                    </span>
                                    <ArrowRight className="w-4 h-4 text-muted-foreground/50 group-hover:text-blue-500 transition-colors" />
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center p-16 bg-card border border-dashed rounded-2xl text-center">
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4 text-muted-foreground/50">
                            <MessageSquare className="w-8 h-8" />
                        </div>
                        <h2 className="text-xl font-bold text-foreground mb-2">
                            {searchTerm ? 'ไม่พบข้อความ' : 'ยังไม่มีข้อความ'}
                        </h2>
                        <p className="text-muted-foreground mb-6 max-w-sm text-sm">
                            {searchTerm
                                ? 'ลองค้นหาด้วยคำอื่น หรือล้างตัวกรอง'
                                : 'เริ่มต้นแชทกับทนายความเพื่อรับคำปรึกษาทางกฎหมาย'}
                        </p>
                        <Button asChild className="bg-[#002f4b] hover:bg-[#001f35] text-white dark:bg-blue-600 dark:hover:bg-blue-700 rounded-xl">
                            <Link href="/lawyers">
                                ค้นหาทนายและเริ่มแชท
                            </Link>
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
