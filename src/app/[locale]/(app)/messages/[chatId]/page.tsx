'use client';
export const runtime = 'edge';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useFirebase, useUser } from '@/firebase';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import type { LawyerProfile } from '@/lib/types';
import { ChatBox } from '@/components/chat/chat-box';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Briefcase, CheckCircle2, Inbox } from 'lucide-react';
import logoColor from '@/pic/logo-lawslane-transparent-color.png';

export default function B2BMessageChatPage() {
    const params = useParams();
    const chatId = params.chatId as string;
    const { firestore } = useFirebase();
    const { user } = useUser();
    const [lawyerInfo, setLawyerInfo] = useState<{ name: string; imageUrl: string; licenseNumber: string; lawyerId: string } | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!firestore || !chatId) return;

        const fetchChatInfo = async () => {
            try {
                // Get chat document to find the lawyer
                const chatDoc = await getDoc(doc(firestore, 'chats', chatId));
                if (!chatDoc.exists()) {
                    setIsLoading(false);
                    return;
                }

                const chatData = chatDoc.data();
                const lawyerId = chatData.lawyerId;

                // Try to get lawyer profile for more info
                let licenseNumber = '';
                const profilesRef = collection(firestore, 'lawyerProfiles');
                const q = query(profilesRef, where('userId', '==', lawyerId));
                const profileSnap = await getDocs(q);
                if (!profileSnap.empty) {
                    licenseNumber = profileSnap.docs[0].data().licenseNumber || '';
                }

                setLawyerInfo({
                    name: chatData.lawyerName || 'ทนายความ',
                    imageUrl: chatData.lawyerImageUrl || '',
                    licenseNumber,
                    lawyerId,
                });
            } catch (error) {
                console.error("Error fetching chat info:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchChatInfo();
    }, [firestore, chatId]);

    if (isLoading) {
        return (
            <div className="flex-1 flex flex-col min-h-[calc(100vh-64px)] bg-muted/10">
                <div className="p-4 border-b bg-card">
                    <div className="h-10 w-60 bg-muted animate-pulse rounded-lg"></div>
                </div>
                <div className="flex-1 flex items-center justify-center">
                    <div className="animate-pulse text-muted-foreground">กำลังโหลดแชท...</div>
                </div>
            </div>
        );
    }

    if (!lawyerInfo || !user) {
        return (
            <div className="flex-1 flex items-center justify-center min-h-[calc(100vh-64px)] bg-muted/10">
                <div className="text-center space-y-4">
                    <h2 className="text-2xl font-bold">ไม่พบการสนทนานี้</h2>
                    <p className="text-muted-foreground">การสนทนาอาจถูกลบออกจากระบบแล้ว</p>
                    <Button asChild variant="outline">
                        <Link href="/messages">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            กลับไปหน้าข้อความ
                        </Link>
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col min-h-[calc(100vh-64px)] bg-muted/10">
            {/* Chat Header */}
            <div className="flex items-center gap-4 p-4 border-b bg-card shadow-sm shrink-0">
                <Button asChild variant="ghost" size="icon" className="shrink-0">
                    <Link href="/messages">
                        <ArrowLeft className="w-4 h-4" />
                    </Link>
                </Button>

                <div className="w-10 h-10 rounded-full overflow-hidden relative bg-muted shrink-0 border">
                    {lawyerInfo.imageUrl ? (
                        <Image
                            src={lawyerInfo.imageUrl}
                            alt={lawyerInfo.name}
                            fill
                            className="object-cover"
                            sizes="40px"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <Image src={logoColor} alt="Lawslane" width={24} height={24} className="object-contain" />
                        </div>
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <h2 className="font-bold text-sm truncate">{lawyerInfo.name}</h2>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Briefcase className="w-3 h-3" />
                        {lawyerInfo.licenseNumber || 'ทนายความ'}
                        <CheckCircle2 className="w-3 h-3 text-emerald-500 ml-1" />
                    </p>
                </div>

                <Button asChild variant="outline" size="sm" className="shrink-0 text-xs gap-1.5">
                    <Link href="/messages">
                        <Inbox className="w-3.5 h-3.5" />
                        กล่องข้อความ
                    </Link>
                </Button>
            </div>

            {/* Chat Box */}
            <div className="flex-1 overflow-hidden">
                <ChatBox
                    firestore={firestore!}
                    currentUser={user}
                    otherUser={{
                        name: lawyerInfo.name,
                        userId: lawyerInfo.lawyerId,
                        imageUrl: lawyerInfo.imageUrl || '',
                    }}
                    chatId={chatId}
                    isDisabled={false}
                    isLawyerView={false}
                />
            </div>
        </div>
    );
}
