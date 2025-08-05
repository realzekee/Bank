
'use client';

import { MainLayout } from "@/components/main-layout";
import { PageHeader } from "@/components/page-header";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type UserForAdmin = {
    id: string;
    username: string;
    email: string;
    balance: number;
    isAdmin: boolean;
};

const USERS_DB_KEY = 'zynpay_users_db';

// This function loads users from localStorage
const loadUsersForAdmin = (): UserForAdmin[] => {
    if (typeof window === 'undefined') return [];
    try {
        const usersJson = localStorage.getItem(USERS_DB_KEY);
        if (usersJson) {
            // We only need a subset of user properties for the admin page
            return (JSON.parse(usersJson)).map((u: any) => ({
                id: u.id,
                username: u.username,
                email: u.email,
                balance: u.balance,
                isAdmin: u.isAdmin
            }));
        }
    } catch (error) {
        console.error("Failed to load users from localStorage", error);
    }
    return [];
}


export default function AdminPage() {
    const { user, loading, updateUserBalance, refreshUser } = useAuth();
    const router = useRouter();
    const { toast } = useToast();
    const [users, setUsers] = useState<UserForAdmin[]>([]);
    const [amount, setAmount] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        if (!loading && !user?.isAdmin) {
            router.replace('/');
        }
        if(!loading && user?.isAdmin) {
            setUsers(loadUsersForAdmin());
        }
    }, [user, loading, router]);

    const handleAmountChange = (userId: string, value: string) => {
        setAmount(prev => ({ ...prev, [userId]: value }));
    };

    const handleUpdateBalance = (userId: string, change: number) => {
        const parsedAmount = parseFloat(amount[userId] || '0');
        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            toast({
                variant: 'destructive',
                title: 'Invalid Amount',
                description: 'Please enter a positive number.',
            });
            return;
        }

        const newBalance = updateUserBalance(userId, parsedAmount * change);
        
        if (newBalance !== null) {
            setUsers(users.map(u => u.id === userId ? { ...u, balance: newBalance } : u));
            toast({
                title: 'Success',
                description: `Balance updated for user ${users.find(u=>u.id === userId)?.username}.`,
            });
            if (userId === user?.id) {
                refreshUser();
            }
        } else {
            toast({
                variant: 'destructive',
                title: 'Update Failed',
                description: 'User not found.',
            });
        }
        setAmount(prev => ({...prev, [userId]: ''}));
    };


    if (loading || !user?.isAdmin) {
        return <MainLayout><p>Loading...</p></MainLayout>
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    };

    return (
        <MainLayout>
            <PageHeader title="Admin Dashboard" description="System-wide management and oversight." />
            <Card>
                <CardHeader>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>Add or remove funds from user accounts.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead>Current Balance</TableHead>
                                <TableHead className="w-[350px]">Modify Balance</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((u) => (
                                <TableRow key={u.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-9 w-9 border-2 border-primary/50">
                                                <AvatarImage src={`https://placehold.co/100x100.png`} alt={u.username} data-ai-hint="avatar user"/>
                                                <AvatarFallback>{u.username.charAt(0).toUpperCase()}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="font-medium">{u.username} {u.isAdmin && <span className="text-xs text-primary">(Admin)</span>}</div>
                                                <div className="text-sm text-muted-foreground">{u.email}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{formatCurrency(u.balance)}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Input
                                                type="number"
                                                placeholder="Amount"
                                                className="w-32"
                                                value={amount[u.id] || ''}
                                                onChange={(e) => handleAmountChange(u.id, e.target.value)}
                                            />
                                            <Button size="sm" variant="outline" onClick={() => handleUpdateBalance(u.id, 1)}>Add</Button>
                                            <Button size="sm" variant="destructive" onClick={() => handleUpdateBalance(u.id, -1)}>Remove</Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </MainLayout>
    )
}
