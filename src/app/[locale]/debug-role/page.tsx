'use client';

import { useState, useEffect } from 'react';
import { useFirebase } from '@/firebase';
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useUser } from '@/firebase'; // Assuming this hook exists and exports user
import { Loader2, CheckCircle, AlertCircle, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function DebugRolePage() {
    const { firestore, user } = useFirebase(); // Adjust based on actual hook
    const { toast } = useToast();
    const [currentRole, setCurrentRole] = useState<string>('loading...');
    const [targetEmail, setTargetEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState('');

    useEffect(() => {
        async function fetchMyRole() {
            if (!user || !firestore) {
                setCurrentRole('Not logged in');
                return;
            }

            try {
                const userDoc = await getDoc(doc(firestore, 'users', user.uid));
                if (userDoc.exists()) {
                    setCurrentRole(userDoc.data().role || 'user (no role field)');
                } else {
                    setCurrentRole('No user profile found');
                }
            } catch (error) {
                console.error("Error fetching role:", error);
                setCurrentRole('Error fetching role');
            }
        }

        fetchMyRole();
    }, [user, firestore]);

    const promoteToAdmin = async (email: string) => {
        if (!firestore) return;
        setIsLoading(true);
        setStatus('');

        try {
            // Find user by email
            const usersRef = collection(firestore, 'users');
            const q = query(usersRef, where('email', '==', email));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                setStatus(`User with email ${email} not found.`);
                toast({
                    variant: "destructive",
                    title: "User Not Found",
                    description: `No user found with email ${email}`,
                });
                return;
            }

            const userDoc = querySnapshot.docs[0];
            await updateDoc(doc(firestore, 'users', userDoc.id), {
                role: 'admin'
            });

            setStatus(`Successfully promoted ${email} to admin!`);
            toast({
                title: "Success",
                description: `Promoted ${email} to admin. Please refresh the page.`,
            });

            // Refresh current role if it's me
            if (user && user.email === email) {
                setCurrentRole('admin');
            }

        } catch (error: any) {
            console.error("Error promoting user:", error);
            setStatus(`Error: ${error.message}`);
            toast({
                variant: "destructive",
                title: "Error",
                description: error.message,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto py-10 max-w-md">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Shield className="w-6 h-6" />
                        Debug User Role
                    </CardTitle>
                    <CardDescription>
                        Check and update user roles manually.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="p-4 bg-slate-100 rounded-lg">
                        <p className="text-sm font-medium text-slate-500">Current User</p>
                        <p className="font-mono text-sm">{user?.email || 'Not logged in'}</p>
                        <p className="text-sm font-medium text-slate-500 mt-2">Current Role</p>
                        <p className={`font-mono font-bold ${currentRole === 'admin' ? 'text-green-600' : 'text-slate-700'}`}>
                            {currentRole}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Promote User by Email</label>
                        <div className="flex gap-2">
                            <Input
                                placeholder="email@example.com"
                                value={targetEmail}
                                onChange={(e) => setTargetEmail(e.target.value)}
                            />
                            <Button
                                onClick={() => promoteToAdmin(targetEmail)}
                                disabled={isLoading || !targetEmail}
                            >
                                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Promote"}
                            </Button>
                        </div>
                    </div>

                    {user && (
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => promoteToAdmin(user.email!)}
                            disabled={isLoading}
                        >
                            Promote Myself to Admin
                        </Button>
                    )}

                    {status && (
                        <div className={`p-3 rounded text-sm ${status.includes('Success') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {status}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
