'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useUser, useFirebase } from '@/firebase';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';

interface B2BProfile {
    companyName: string;
    plan: string;
    subscriptionStatus: string;
    billingCycle: 'monthly' | 'yearly';
    [key: string]: any;
}

interface B2BProfileContextType {
    profile: B2BProfile | null;
    isLoading: boolean;
    error: Error | null;
    refreshProfile: () => Promise<void>;
}

const B2BProfileContext = createContext<B2BProfileContextType | undefined>(undefined);

export function B2BProfileProvider({ children }: { children: ReactNode }) {
    const { user } = useUser();
    const { firestore } = useFirebase();
    const [profile, setProfile] = useState<B2BProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchProfile = async () => {
        if (!user || !firestore) {
            setIsLoading(false);
            return;
        }

        try {
            const userDoc = await getDoc(doc(firestore, 'users', user.uid));
            if (userDoc.exists()) {
                const data = userDoc.data() as B2BProfile;
                setProfile({
                    ...data,
                    companyName: data.companyName || 'Lawslane Legal OS',
                    plan: data.plan || 'Lite Plan'
                });
            }
        } catch (err) {
            console.error("Error fetching B2B profile:", err);
            setError(err as Error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!user || !firestore) {
            setProfile(null);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);

        // Use onSnapshot for real-time updates if the user changes their plan
        const unsubscribe = onSnapshot(
            doc(firestore, 'users', user.uid),
            (doc) => {
                if (doc.exists()) {
                    const data = doc.data() as B2BProfile;
                    setProfile({
                        ...data,
                        companyName: data.companyName || 'Lawslane Legal OS',
                        plan: data.plan || 'Lite Plan'
                    });
                }
                setIsLoading(false);
            },
            (err) => {
                console.error("Error listening to B2B profile:", err);
                setError(err as Error);
                setIsLoading(false);
            }
        );

        return () => unsubscribe();
    }, [user, firestore]);

    return (
        <B2BProfileContext.Provider value={{ profile, isLoading, error, refreshProfile: fetchProfile }}>
            {children}
        </B2BProfileContext.Provider>
    );
}

export function useB2BProfile() {
    const context = useContext(B2BProfileContext);
    if (context === undefined) {
        throw new Error('useB2BProfile must be used within a B2BProfileProvider');
    }
    return context;
}
