'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Book } from '@/lib/education-types';
import { useToast } from "@/hooks/use-toast";

export interface CartItem extends Book {
    quantity: number;
}

interface CartContextType {
    items: CartItem[];
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    addItem: (book: Book) => void;
    removeItem: (bookId: string) => void;
    updateQuantity: (bookId: string, quantity: number) => void;
    clearCart: () => void;
    totalItems: number;
    totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const { toast } = useToast();

    // Load from local storage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('education_cart');
        if (savedCart) {
            try {
                setItems(JSON.parse(savedCart));
            } catch (e) {
                console.error('Failed to parse cart', e);
            }
        }
        setIsLoaded(true);
    }, []);

    // Save to local storage on change
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('education_cart', JSON.stringify(items));
        }
    }, [items, isLoaded]);

    const addItem = (book: Book) => {
        setItems(prev => {
            const existing = prev.find(item => item.id === book.id);
            if (existing) {
                return prev.map(item =>
                    item.id === book.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, { ...book, quantity: 1 }];
        });
        // setIsOpen(true); // Removed auto-open as per user request

        toast({
            title: "เพิ่มลงตะกร้าเรียบร้อย",
            description: `เพิ่ม "${book.title}" ลงในตะกร้าแล้ว`,
            duration: 1500,
        });
    };

    const removeItem = (bookId: string) => {
        setItems(prev => prev.filter(item => item.id !== bookId));
    };

    const updateQuantity = (bookId: string, quantity: number) => {
        if (quantity <= 0) {
            removeItem(bookId);
            return;
        }
        setItems(prev => prev.map(item =>
            item.id === bookId ? { ...item, quantity } : item
        ));
    };

    const clearCart = () => {
        setItems([]);
        setIsOpen(false);
    };

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return (
        <CartContext.Provider value={{
            items,
            isOpen,
            setIsOpen,
            addItem,
            removeItem,
            updateQuantity,
            clearCart,
            totalItems,
            totalPrice
        }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
