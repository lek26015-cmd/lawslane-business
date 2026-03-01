'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Mail, Shield, ArrowLeft, Send } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function InviteMemberPage() {
    const tInvite = useTranslations('B2BDashboard.teamInvite');
    const { toast } = useToast();
    const router = useRouter();

    const [inviteEmail, setInviteEmail] = React.useState('');
    const [inviteRole, setInviteRole] = React.useState('Viewer');
    const [isInviting, setIsInviting] = React.useState(false);

    const [appAccess, setAppAccess] = React.useState<Record<string, boolean>>({
        overview: true,
        clm: false,
        vault: true,
        billing: false,
        workflow: false,
        dueDiligence: false,
        legalSpend: false,
        auditTrail: false,
        integrations: false
    });

    const appsList = [
        { id: 'overview', name: tInvite('apps.overview.name'), desc: tInvite('apps.overview.desc') },
        { id: 'clm', name: tInvite('apps.clm.name'), desc: tInvite('apps.clm.desc') },
        { id: 'vault', name: tInvite('apps.vault.name'), desc: tInvite('apps.vault.desc') },
        { id: 'billing', name: tInvite('apps.billing.name'), desc: tInvite('apps.billing.desc') },
        { id: 'workflow', name: tInvite('apps.workflow.name'), desc: tInvite('apps.workflow.desc') },
        { id: 'dueDiligence', name: tInvite('apps.dueDiligence.name'), desc: tInvite('apps.dueDiligence.desc') },
        { id: 'legalSpend', name: tInvite('apps.legalSpend.name'), desc: tInvite('apps.legalSpend.desc') },
        { id: 'auditTrail', name: tInvite('apps.auditTrail.name'), desc: tInvite('apps.auditTrail.desc') },
        { id: 'integrations', name: tInvite('apps.integrations.name'), desc: tInvite('apps.integrations.desc') }
    ];

    React.useEffect(() => {
        if (inviteRole === 'Admin' || inviteRole === 'Owner') {
            setAppAccess(appsList.reduce((acc, app) => ({ ...acc, [app.id]: true }), {}));
        } else if (inviteRole === 'Editor') {
            setAppAccess(prev => ({ ...prev, overview: true, clm: true, vault: true, workflow: true }));
        } else {
            setAppAccess(prev => ({ ...prev, overview: true, vault: true, clm: false, billing: false, workflow: false, dueDiligence: false, legalSpend: false, auditTrail: false, integrations: false }));
        }
    }, [inviteRole]);

    const handleInvite = () => {
        if (!inviteEmail) {
            toast({ title: tInvite('toast.errorTitle'), description: tInvite('toast.errorDesc'), variant: 'destructive' });
            return;
        }
        setIsInviting(true);
        setTimeout(() => {
            setIsInviting(false);
            toast({ title: tInvite('toast.successTitle'), description: tInvite('toast.successDesc', { email: inviteEmail }) });
            router.push('/team');
        }, 1000);
    };

    return (
        <div className="p-6 md:p-8 max-w-2xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/team">
                    <Button variant="ghost" size="icon" className="rounded-xl h-9 w-9">
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                        <Mail className="w-6 h-6" style={{ color: '#002f4b' }} />
                        {tInvite('title')}
                    </h1>
                    <p className="text-sm text-muted-foreground mt-0.5">{tInvite('subtitle')}</p>
                </div>
            </div>

            {/* Form Card */}
            <Card className="rounded-2xl shadow-sm border">
                <CardHeader>
                    <CardTitle className="text-base text-foreground">{tInvite('memberInfo')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Email */}
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-semibold">{tInvite('emailLabel')}</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder={tInvite('emailPlaceholder')}
                            value={inviteEmail}
                            onChange={(e) => setInviteEmail(e.target.value)}
                            className="rounded-xl"
                        />
                    </div>

                    {/* Role */}
                    <div className="space-y-2">
                        <Label htmlFor="role" className="flex items-center gap-2 text-sm font-semibold">
                            <Shield className="w-4 h-4 text-muted-foreground" />
                            {tInvite('roleLabel')}
                        </Label>
                        <Select value={inviteRole} onValueChange={setInviteRole}>
                            <SelectTrigger className="rounded-xl">
                                <SelectValue placeholder={tInvite('rolePlaceholder')} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Admin">{tInvite('roles.admin')}</SelectItem>
                                <SelectItem value="Editor">{tInvite('roles.editor')}</SelectItem>
                                <SelectItem value="Viewer">{tInvite('roles.viewer')}</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* App Access Card */}
            <Card className="rounded-2xl shadow-sm border">
                <CardHeader>
                    <CardTitle className="text-base text-foreground">{tInvite('appAccessTitle')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {appsList.map((app) => (
                            <div key={app.id} className="flex items-start gap-3 p-3 rounded-xl border hover:bg-muted/50 transition-colors">
                                <Switch
                                    id={`app-${app.id}`}
                                    checked={appAccess[app.id]}
                                    onCheckedChange={(checked) => setAppAccess(prev => ({ ...prev, [app.id]: checked }))}
                                    className="mt-0.5"
                                />
                                <div className="grid gap-0.5">
                                    <Label htmlFor={`app-${app.id}`} className="text-sm font-semibold cursor-pointer select-none">
                                        {app.name}
                                    </Label>
                                    <p className="text-[11px] text-muted-foreground leading-snug">
                                        {app.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
                <Link href="/team">
                    <Button variant="outline" className="rounded-xl" disabled={isInviting}>{tInvite('cancelBtn')}</Button>
                </Link>
                <Button
                    onClick={handleInvite}
                    disabled={isInviting || !inviteEmail}
                    className="text-white rounded-xl gap-2 shadow-lg"
                    style={{ background: 'linear-gradient(135deg, #002f4b, #00466c)' }}
                >
                    <Send className="w-4 h-4" />
                    {isInviting ? tInvite('invitingBtn') : tInvite('inviteBtn')}
                </Button>
            </div>
        </div>
    );
}
