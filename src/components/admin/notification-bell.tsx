'use client';

import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { NotificationList } from './notification-list';
import { useNotifications } from '@/hooks/use-notifications';

export function NotificationBell({ recipientId = 'admin' }: { recipientId?: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const { unreadCount } = useNotifications(recipientId);

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-red-600 border-2 border-background" />
                    )}
                    <span className="sr-only">การแจ้งเตือน</span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
                <NotificationList recipientId={recipientId} onItemClick={() => setIsOpen(false)} />
            </PopoverContent>
        </Popover>
    );
}
