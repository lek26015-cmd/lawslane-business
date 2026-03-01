'use client';

import { useState, useEffect } from 'react';
import { useFirebase } from '@/firebase';
import { collection, query, where, orderBy, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { AdminNotification } from '@/lib/types';

export function useNotifications(recipientId: string = 'admin') {
    const [notifications, setNotifications] = useState<AdminNotification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const { firestore } = useFirebase();

    useEffect(() => {
        if (!firestore) {
            setIsLoading(false);
            return;
        }

        const notificationsRef = collection(firestore, 'notifications');
        const q = query(
            notificationsRef,
            where('recipient', '==', recipientId),
            orderBy('createdAt', 'desc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const notifs: AdminNotification[] = [];
            let unread = 0;

            snapshot.forEach((doc) => {
                const data = doc.data();
                const notif = {
                    id: doc.id,
                    ...data,
                    createdAt: data.createdAt
                } as AdminNotification;

                notifs.push(notif);
                if (!notif.read) unread++;
            });

            setNotifications(notifs);
            setUnreadCount(unread);
            setIsLoading(false);
        }, (error) => {
            console.error("Notification snapshot error:", error);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [firestore, recipientId]);

    const markAsRead = async (id: string) => {
        if (!firestore) return;
        try {
            const notifRef = doc(firestore, 'notifications', id);
            await updateDoc(notifRef, { read: true });
        } catch (error) {
            console.error("Error marking notification as read:", error);
        }
    };

    const markAllAsRead = async () => {
        if (!firestore) return;
        const unreadNotifications = notifications.filter(n => !n.read);
        try {
            await Promise.all(unreadNotifications.map(n =>
                updateDoc(doc(firestore, 'notifications', n.id), { read: true })
            ));
        } catch (error) {
            console.error("Error marking all as read:", error);
        }
    };

    return {
        notifications,
        unreadCount,
        isLoading,
        markAsRead,
        markAllAsRead
    };
}
