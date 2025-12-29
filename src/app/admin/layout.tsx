'use client';

import Link from 'next/link';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
    Gavel,
    LayoutDashboard,
    Landmark,
    Settings,
    ShieldCheck,
    Ticket,
    Users2,
    Megaphone,
    FileText,
    ArrowLeftCircle,
    LogOut,
    ChevronDown,
    Menu,
    Mail,
    LayoutTemplate,
    Database,
    FileSignature,
    Building2,
    Briefcase,
    FileEdit,
    Scale,
    BrainCircuit,
    Library,
    UserCheck,
    ChevronRight // Added ChevronRight
} from 'lucide-react';
import React, { useState, useEffect, useContext } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { FirebaseContext, FirebaseContextState, errorEmitter, FirestorePermissionError } from '@/firebase';
import AdminLoginPage from './login/page';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { NotificationBell } from '@/components/admin/notification-bell';


export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();

    const firebaseContext = useContext(FirebaseContext);
    const { auth, firestore, areServicesAvailable } = firebaseContext || {};

    const [isAdmin, setIsAdmin] = useState(false);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [userRole, setUserRole] = useState<string | null>(null);

    // State for collapsible sections, default "ภาพรวม" open
    const [openSection, setOpenSection] = useState<string | null>("ภาพรวม");

    const toggleSection = (title: string) => {
        setOpenSection(prev => prev === title ? null : title);
    };

    useEffect(() => {
        if (!areServicesAvailable || !auth || !firestore) {
            setIsCheckingAuth(false);
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userDocRef = doc(firestore, "users", user.uid);

                getDoc(userDocRef).then(userDoc => {
                    if (!userDoc.exists()) {
                        const designatedSuperAdminUID = 'wS9w7ysNYUajNsBYZ6C7n2Afe9H3';
                        const designatedSuperAdminEmail = 'lek.26015@gmail.com';

                        const allowedDomain = '@lawslane.com';
                        const userEmail = user.email || '';

                        // Allow basic access if domain is allowed OR if it's the specific super admin email
                        if (!userEmail.endsWith(allowedDomain) && userEmail !== designatedSuperAdminEmail) {
                            // Invalid domain, sign out
                            setIsAdmin(false);
                            setCurrentUser(null);
                            setUserRole(null);
                            signOut(auth);
                            router.push('/admin/login?error=invalid_domain');
                            return;
                        }

                        // Check UID OR Email for Super Admin stats
                        if (user.uid === designatedSuperAdminUID || userEmail === designatedSuperAdminEmail) {
                            const newAdminData = {
                                uid: user.uid,
                                name: user.displayName || 'Admin',
                                email: user.email,
                                role: 'admin',
                                superAdmin: true,
                                registeredAt: serverTimestamp(),
                            };
                            setDoc(userDocRef, newAdminData)
                                .then(() => {
                                    // After setting the doc, we can assume the role.
                                    setIsAdmin(true);
                                    setCurrentUser(user);
                                    setUserRole('Super Admin');
                                })
                                .catch(serverError => {
                                    const permissionError = new FirestorePermissionError({
                                        path: userDocRef.path,
                                        operation: 'create',
                                        requestResourceData: newAdminData,
                                    });
                                    errorEmitter.emit('permission-error', permissionError);
                                    // Set state to non-admin because creation failed
                                    setIsAdmin(false);
                                });
                        } else {
                            // Not the designated admin, sign them out.
                            setIsAdmin(false);
                            setCurrentUser(null);
                            setUserRole(null);
                            signOut(auth);
                            router.push('/admin/login');
                        }
                    } else if (userDoc.exists()) {
                        const userData = userDoc.data();
                        const designatedSuperAdminUID = 'wS9w7ysNYUajNsBYZ6C7n2Afe9H3';
                        const designatedSuperAdminEmail = 'lek.26015@gmail.com';
                        const userEmail = user.email || '';

                        // Check if it's super admin by UID OR Email
                        const isSuperAdminUser = (user.uid === designatedSuperAdminUID) || (userEmail === designatedSuperAdminEmail);

                        if (isSuperAdminUser && userData.role !== 'admin') {
                            // Auto-promote if it's the super admin but has wrong role
                            const newAdminData = {
                                ...userData,
                                role: 'admin',
                                superAdmin: true,
                            };
                            setDoc(userDocRef, newAdminData, { merge: true })
                                .then(() => {
                                    setIsAdmin(true);
                                    setCurrentUser(user);
                                    setUserRole('Super Admin');
                                });
                        } else if (userData.role === 'admin') {
                            const role = userData.superAdmin ? 'Super Admin' : 'Administrator';
                            setIsAdmin(true);
                            setCurrentUser(user);
                            setUserRole(role);
                        } else {
                            // User exists but is not an admin and not the super admin
                            // Double check if they should be allowed (e.g. maybe domain logic?)
                            // But generally if role != admin, they shouldn't be here.

                            setIsAdmin(false);
                            setCurrentUser(null);
                            setUserRole(null);

                            // Prevent redirect loops
                            if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
                                router.push('/admin/login');
                            }
                        }
                    }
                }).catch(error => {
                    console.error("Error fetching user doc in AdminLayout:", error);
                    // Do not emit error to avoid global crash/toast storm
                    // Just log it and let the UI handle the non-admin state

                    // Special handling: If it's a permission error, we might still want to let them in 
                    // if they are the super admin, so they can fix it via the button in NewAdPage.
                    // But for now, just don't crash.
                    setIsAdmin(true); // Allow rendering to let the "Fix Admin Role" button work in children
                    setUserRole('Guest (Error)');
                });
            } else {
                // No user logged in
                setIsAdmin(false);
                setCurrentUser(null);
                setUserRole(null);
                if (pathname !== '/admin/login') {
                    router.push('/admin/login');
                }
            }
            setIsCheckingAuth(false);
        });

        return () => unsubscribe();
    }, [areServicesAvailable, auth, firestore, router, pathname]);

    // Redirect if already admin and on login page
    useEffect(() => {
        if (isAdmin && pathname === '/admin/login') {
            router.push('/admin');
        }
    }, [isAdmin, pathname, router]);

    const handleLogout = async () => {
        if (auth) {
            await signOut(auth);
            router.push('/admin/login');
        }
    };

    type NavItem = {
        href: string;
        icon: React.ReactNode;
        label: string;
    };

    type NavSection = {
        title: string; // Made required for key
        items: NavItem[];
    };

    const navSections: NavSection[] = [
        {
            title: "จัดการผู้ใช้งาน",
            items: [
                { href: "/customers", icon: <Users2 className="h-4 w-4" />, label: "ลูกค้า" },
                { href: "/lawyers", icon: <UserCheck className="h-4 w-4" />, label: "ทนายความ" },
                { href: "/lawyer-registry", icon: <Database className="h-4 w-4" />, label: "ฐานข้อมูลทนาย" },
            ]
        },
        {
            title: "คำขอใช้บริการ",
            items: [
                { href: "/admin/contract-requests", icon: <FileSignature className="h-4 w-4" />, label: "คำขอร่างสัญญา" },
                { href: "/admin/registration-requests", icon: <Building2 className="h-4 w-4" />, label: "คำขอจดทะเบียน" },
                { href: "/admin/sme-requests", icon: <Briefcase className="h-4 w-4" />, label: "คำขอ SME" },
            ]
        },
        {
            title: "เนื้อหาและการตลาด",
            items: [
                { href: "/landing-pages", icon: <LayoutTemplate className="h-4 w-4" />, label: "Landing Pages" },
                { href: "/ads", icon: <Megaphone className="h-4 w-4" />, label: "จัดการโฆษณา" },
                { href: "/content", icon: <FileEdit className="h-4 w-4" />, label: "จัดการเนื้อหา" },
                { href: "/admin/forms", icon: <FileText className="h-4 w-4" />, label: "แบบฟอร์มกฎหมาย" },
                { href: "/admin/legal", icon: <Scale className="h-4 w-4" />, label: "เอกสารทางกฎหมาย" },
                { href: "/knowledge", icon: <BrainCircuit className="h-4 w-4" />, label: "คลังความรู้ AI" },
            ]
        },
        {
            title: "ระบบและสนับสนุน",
            items: [
                { href: "/financials", icon: <Landmark className="h-4 w-4" />, label: "การเงิน" },
                { href: "/tickets", icon: <Ticket className="h-4 w-4" />, label: "Ticket ช่วยเหลือ" },
                { href: "/email", icon: <Mail className="h-4 w-4" />, label: "ระบบอีเมล" },
            ]
        }
    ];

    const isActive = (href: string) => {
        if (href === '/admin') return pathname === href;
        return pathname.startsWith(href);
    }

    const getMainLink = () => {
        const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'lawslane.com';
        const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
        // In development, try to use the current window location if available to preserve port
        if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
            return `${window.location.protocol}//${window.location.host.replace('admin.', '')}`;
        }
        const host = process.env.NODE_ENV === 'development' ? 'localhost:9002' : rootDomain;
        return `${protocol}://${host}`;
    };

    if (isCheckingAuth) {
        return <div className="flex h-screen items-center justify-center">Loading...</div>;
    }

    if (!isAdmin) {
        return <AdminLoginPage />;
    }

    return (
        <div className="grid h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
            <div className="hidden border-r border-slate-700 bg-[#0f172a] text-slate-100 md:block">
                <div className="flex h-full max-h-screen flex-col gap-2">
                    <div className="flex h-14 items-center border-b border-slate-700 px-4 lg:h-[60px] lg:px-6">
                        <Link href="/admin" className="flex items-center gap-2 font-semibold text-white">
                            <Gavel className="h-6 w-6" />
                            <span className="">Lawslane Admin</span>
                        </Link>
                        <div className="ml-auto flex items-center gap-2 md:hidden">
                            {/* Mobile Bell could go here if not in sidebar */}
                        </div>
                    </div>
                    <div className="flex-1 overflow-auto py-2">
                        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                            <Link
                                href="/admin"
                                className={cn("flex items-center gap-3 rounded-lg px-3 py-2 text-slate-100 transition-all hover:bg-slate-800 hover:text-white mb-2",
                                    pathname === "/admin" && "bg-slate-800 text-white"
                                )}
                            >
                                <LayoutDashboard className="h-4 w-4" />
                                แดชบอร์ด
                            </Link>

                            {navSections.map((section, index) => (
                                <Collapsible
                                    key={section.title}
                                    open={openSection === section.title}
                                    onOpenChange={() => toggleSection(section.title)}
                                    className="mb-2"
                                >
                                    <CollapsibleTrigger className="flex w-full items-center justify-between px-2 py-2 text-xs font-semibold text-slate-400 tracking-wider uppercase hover:text-white transition-colors">
                                        {section.title}
                                        <ChevronDown className={cn("h-3 w-3 transition-transform duration-200", openSection !== section.title && "-rotate-90")} />
                                    </CollapsibleTrigger>
                                    <CollapsibleContent className="space-y-1 overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                                        {section.items.map((item) => (
                                            <Link
                                                key={item.label}
                                                href={item.href}
                                                className={cn("flex items-center gap-3 rounded-lg px-3 py-2 text-sky-300 transition-all hover:bg-slate-800 hover:text-white",
                                                    isActive(item.href) && "bg-slate-800 text-white"
                                                )}
                                            >
                                                {item.icon}
                                                {item.label}
                                            </Link>
                                        ))}
                                    </CollapsibleContent>
                                </Collapsible>
                            ))}

                            <div className="my-2 border-t border-slate-700" />
                            <Link
                                href={getMainLink()}
                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-400 transition-all hover:bg-slate-800 hover:text-white"
                            >
                                <ArrowLeftCircle className="h-4 w-4" />
                                กลับไปหน้าเว็บไซต์
                            </Link>
                        </nav>
                    </div>
                    <div className="mt-auto p-4 space-y-4">
                        <div className="border-t border-slate-700 pt-4">
                            <div className="flex justify-end mb-2 px-2 md:hidden">
                                <NotificationBell />
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="w-full justify-start px-2 h-auto hover:bg-slate-800 hover:text-white text-slate-200">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-9 w-9 border border-slate-600">
                                                <AvatarImage src={currentUser?.photoURL || ''} />
                                                <AvatarFallback className="bg-slate-700 text-white">{currentUser?.displayName?.charAt(0) || currentUser?.email?.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 text-left">
                                                <p className="text-sm font-semibold">{currentUser?.displayName || currentUser?.email}</p>
                                                <p className="text-xs text-slate-400">{userRole}</p>
                                            </div>
                                            <ChevronDown className="h-4 w-4 text-slate-400" />
                                        </div>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-64" align="end" forceMount>
                                    <DropdownMenuLabel className="font-normal">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium leading-none">{currentUser?.displayName}</p>
                                            <p className="text-xs leading-none text-muted-foreground">
                                                {currentUser?.email}
                                            </p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link href="/admin/settings">
                                            <Settings className="mr-2 h-4 w-4" />
                                            <span>ตั้งค่า</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href={getMainLink()}>
                                            <ArrowLeftCircle className="mr-2 h-4 w-4" />
                                            <span>กลับไปหน้าเว็บไซต์</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                                        <LogOut className="mr-2 h-4 w-4" />
                                        <span>ออกจากระบบ</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-col overflow-auto bg-muted/40">
                <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-6 lg:h-[60px]">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Toggle navigation menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="flex flex-col">
                            <SheetTitle className="sr-only">Admin Navigation</SheetTitle>
                            <nav className="grid gap-2 text-lg font-medium">
                                <Link href="/admin" className="flex items-center gap-2 text-lg font-semibold mb-4">
                                    <Gavel className="h-6 w-6" />
                                    <span className="sr-only">Lawslane Admin</span>
                                </Link>
                                {navSections.map((section, index) => (
                                    <Collapsible
                                        key={section.title}
                                        open={openSection === section.title}
                                        onOpenChange={() => toggleSection(section.title)}
                                        className="mb-2"
                                    >
                                        <CollapsibleTrigger className="flex w-full items-center justify-between px-2 py-2 text-sm font-semibold text-muted-foreground tracking-wider uppercase hover:text-foreground transition-colors">
                                            {section.title}
                                            <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", openSection !== section.title && "-rotate-90")} />
                                        </CollapsibleTrigger>
                                        <CollapsibleContent className="space-y-1 pt-1 overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                                            {section.items.map((item) => (
                                                <Link
                                                    key={item.label}
                                                    href={item.href}
                                                    className={cn("mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground",
                                                        isActive(item.href) && "bg-muted text-foreground"
                                                    )}
                                                >
                                                    {item.icon}
                                                    {item.label}
                                                </Link>
                                            ))}
                                        </CollapsibleContent>
                                    </Collapsible>
                                ))}

                                <div className="my-2 border-t border-border/50" />
                                <Link
                                    href={getMainLink()}
                                    className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                                >
                                    <ArrowLeftCircle className="h-5 w-5" />
                                    กลับไปหน้าเว็บไซต์
                                </Link>
                            </nav>
                        </SheetContent>
                    </Sheet>
                    <div className="w-full flex-1">
                        {/* Add search or breadcrumbs here if needed */}
                    </div>
                    <NotificationBell />
                </header>
                <main className="flex flex-1 flex-col gap-4 p-8 lg:gap-6 lg:p-12">
                    {React.isValidElement(children) ? React.cloneElement(children as any, { userRole }) : children}
                </main>
            </div>
        </div >
    );
}
