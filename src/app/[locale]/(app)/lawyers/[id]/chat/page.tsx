'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useFirebase, useUser } from '@/firebase';
import { doc, getDoc, collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import type { LawyerProfile } from '@/lib/types';
import { ChatBox } from '@/components/chat/chat-box';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Briefcase, CheckCircle2 } from 'lucide-react';
import logoColor from '@/pic/logo-lawslane-transparent-color.png';

export default function B2BLawyerChatPage() {
    const params = useParams();
    const { firestore } = useFirebase();
    const { user } = useUser();
    const [lawyer, setLawyer] = useState<LawyerProfile | null>(null);
    const [chatId, setChatId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!firestore || !params.id || !user) return;

        const initChat = async () => {
            try {
                // 1. Fetch lawyer profile
                const lawyerDoc = await getDoc(doc(firestore, 'lawyerProfiles', params.id as string));
                if (!lawyerDoc.exists()) {
                    setIsLoading(false);
                    return;
                }
                const lawyerData = { id: lawyerDoc.id, ...lawyerDoc.data() } as LawyerProfile;
                setLawyer(lawyerData);

                // 2. Find or create a chat between this user and the lawyer
                const chatsRef = collection(firestore, 'chats');
                const q = query(
                    chatsRef,
                    where('clientId', '==', user.uid),
                    where('lawyerId', '==', lawyerData.userId)
                );
                const chatSnap = await getDocs(q);

                if (!chatSnap.empty) {
                    setChatId(chatSnap.docs[0].id);
                } else {
                    // Create a new chat document
                    const newChat = await addDoc(chatsRef, {
                        clientId: user.uid,
                        clientName: user.displayName || 'ลูกค้า',
                        lawyerId: lawyerData.userId,
                        lawyerName: lawyerData.name,
                        lawyerImageUrl: lawyerData.imageUrl || '',
                        status: 'active',
                        createdAt: serverTimestamp(),
                        updatedAt: serverTimestamp(),
                    });
                    setChatId(newChat.id);
                }
            } catch (error) {
                console.error("Error initializing chat:", error);
            } finally {
                setIsLoading(false);
            }
        };

        initChat();
    }, [firestore, params.id, user]);

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

    if (!lawyer || !chatId || !user) {
        return (
            <div className="flex-1 flex items-center justify-center min-h-[calc(100vh-64px)] bg-muted/10">
                <div className="text-center space-y-4">
                    <h2 className="text-2xl font-bold">ไม่สามารถเปิดแชทได้</h2>
                    <p className="text-muted-foreground">กรุณาเข้าสู่ระบบ หรือลองใหม่อีกครั้ง</p>
                    <Button asChild variant="outline">
                        <Link href="/lawyers">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            กลับไปหน้าค้นหาทนาย
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
                    <Link href={`/lawyers/${params.id}`}>
                        <ArrowLeft className="w-4 h-4" />
                    </Link>
                </Button>

                <div className="w-10 h-10 rounded-full overflow-hidden relative bg-muted shrink-0 border">
                    <Image
                        src={lawyer.imageUrl || logoColor}
                        alt={lawyer.name}
                        fill
                        className="object-cover"
                        sizes="40px"
                    />
                </div>

                <div className="flex-1 min-w-0">
                    <h2 className="font-bold text-sm truncate">{lawyer.name}</h2>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Briefcase className="w-3 h-3" />
                        {lawyer.licenseNumber}
                        <CheckCircle2 className="w-3 h-3 text-emerald-500 ml-1" />
                    </p>
                </div>

                <Button asChild variant="outline" size="sm" className="shrink-0 text-xs">
                    <Link href={`/lawyers/${params.id}`}>
                        ดูโปรไฟล์
                    </Link>
                </Button>
            </div>

            {/* Chat Box */}
            <div className="flex-1 overflow-hidden">
                <ChatBox
                    firestore={firestore!}
                    currentUser={user}
                    otherUser={{
                        name: lawyer.name,
                        userId: lawyer.userId,
                        imageUrl: lawyer.imageUrl || '',
                    }}
                    chatId={chatId}
                    isDisabled={false}
                    isLawyerView={false}
                />
            </div>
        </div>
    );
}
