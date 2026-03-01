'use client';

import React from 'react';
import { Bell, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { th } from 'date-fns/locale';
import { useNotifications } from '@/hooks/use-notifications';

interface NotificationListProps {
    recipientId?: string;
    onItemClick?: () => void;
}

export function NotificationList({ recipientId = 'admin', onItemClick }: NotificationListProps) {
    const { notifications, unreadCount, isLoading, markAsRead, markAllAsRead } = useNotifications(recipientId);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[300px]">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <>
            <div className="flex items-center justify-between p-4 border-b">
                <h4 className="font-semibold text-foreground">การแจ้งเตือน</h4>
                {unreadCount > 0 && (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs h-auto py-1 px-2 text-[#002f4b] dark:text-blue-400"
                        onClick={markAllAsRead}
                    >
                        อ่านทั้งหมด
                    </Button>
                )}
            </div>
            <ScrollArea className="h-[350px]">
                {notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-[300px] p-4 text-muted-foreground">
                        <Bell className="h-8 w-8 mb-2 opacity-20" />
                        <p className="text-sm">ไม่มีการแจ้งเตือน</p>
                    </div>
                ) : (
                    <div className="grid">
                        {notifications.map((notification) => (
                            <Link
                                key={notification.id}
                                href={notification.link || '#'}
                                className={cn(
                                    "flex flex-col gap-1 p-4 transition-colors hover:bg-muted/50 border-b last:border-0",
                                    !notification.read && "bg-muted/20"
                                )}
                                onClick={() => {
                                    if (!notification.read) markAsRead(notification.id);
                                    if (onItemClick) onItemClick();
                                }}
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <span className="font-medium text-sm leading-none text-foreground">
                                        {notification.title}
                                    </span>
                                    {!notification.read && (
                                        <span className="h-2 w-2 rounded-full bg-blue-600 shrink-0" />
                                    )}
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                                    {notification.message}
                                </p>
                                <span className="text-[10px] text-muted-foreground mt-2">
                                    {notification.createdAt?.toDate ?
                                        formatDistanceToNow(notification.createdAt.toDate(), { addSuffix: true, locale: th }) :
                                        'เมื่อสักครู่'
                                    }
                                </span>
                            </Link>
                        ))}
                    </div>
                )}
            </ScrollArea>
        </>
    );
}
