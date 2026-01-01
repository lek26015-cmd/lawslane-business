'use client';

import { useState } from 'react';
import { useFirebase } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { seedDatabase } from '@/lib/seed-data';
import { Loader2, CheckCircle, AlertCircle, Database } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function SeedDataPage() {
    const { firestore } = useFirebase();
    const { toast } = useToast();
    const [isSeeding, setIsSeeding] = useState(false);
    const [result, setResult] = useState<{ articles: number; lawyers: number; errors: string[] } | null>(null);

    const handleSeed = async () => {
        if (!firestore) return;

        setIsSeeding(true);
        setResult(null);

        try {
            const res = await seedDatabase(firestore);
            setResult(res);
            if (res.errors.length === 0) {
                toast({
                    title: "Seeding Successful",
                    description: `Added ${res.articles} articles and ${res.lawyers} lawyers.`,
                });
            } else {
                toast({
                    variant: "destructive",
                    title: "Seeding Completed with Errors",
                    description: `Check the log for details.`,
                });
            }
        } catch (error: any) {
            console.error("Seeding failed:", error);
            toast({
                variant: "destructive",
                title: "Seeding Failed",
                description: error.message,
            });
        } finally {
            setIsSeeding(false);
        }
    };

    return (
        <div className="container mx-auto py-10 max-w-2xl">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Database className="w-6 h-6" />
                        Seed Database
                    </CardTitle>
                    <CardDescription>
                        Add sample data to your Firestore database for testing purposes.
                        This will add sample articles and approved lawyers.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800 flex gap-2 items-start">
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        <p>
                            <strong>Warning:</strong> This action adds data to your production database.
                            It does not delete existing data, but may create duplicates if run multiple times
                            (though we try to avoid it). Use with caution.
                        </p>
                    </div>

                    <Button
                        onClick={handleSeed}
                        disabled={isSeeding || !firestore}
                        className="w-full"
                        size="lg"
                    >
                        {isSeeding ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Seeding...
                            </>
                        ) : (
                            "Seed Database Now"
                        )}
                    </Button>

                    {result && (
                        <div className={`rounded-lg p-4 border ${result.errors.length > 0 ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
                            <h3 className={`font-bold mb-2 flex items-center gap-2 ${result.errors.length > 0 ? 'text-red-800' : 'text-green-800'}`}>
                                {result.errors.length > 0 ? <AlertCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
                                Result
                            </h3>
                            <ul className="space-y-1 text-sm">
                                <li className="text-gray-700">Articles Added: <strong>{result.articles}</strong></li>
                                <li className="text-gray-700">Lawyers Added: <strong>{result.lawyers}</strong></li>
                            </ul>
                            {result.errors.length > 0 && (
                                <div className="mt-4">
                                    <p className="font-bold text-red-800 text-sm mb-1">Errors:</p>
                                    <ul className="list-disc list-inside text-xs text-red-700">
                                        {result.errors.map((err, i) => (
                                            <li key={i}>{err}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
