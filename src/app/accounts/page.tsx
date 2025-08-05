
'use client';

import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/main-layout';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, DollarSign, University, Landmark, LineChart, Briefcase, HelpCircle, ArrowRightLeft, ArrowDown, ArrowUp, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { type Account, type AccountType, type Transaction } from '@/lib/mock-data';
import { useAuth } from '@/context/auth-context';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const accountTypes: {value: AccountType, label: string, icon: React.ReactNode, description: string}[] = [
    { value: 'checking', label: 'Checking', icon: <University className="h-8 w-8 text-primary" />, description: 'For everyday transactions and bill payments.' },
    { value: 'savings', label: 'Savings', icon: <DollarSign className="h-8 w-8 text-primary" />, description: 'For growing your money and long-term goals.' },
    { value: 'money-market', label: 'Money Market', icon: <Landmark className="h-8 w-8 text-primary" />, description: 'A savings account with some checking features, often with a higher interest rate.' },
    { value: 'investment', label: 'Investment', icon: <LineChart className="h-8 w-8 text-primary" />, description: 'For buying stocks, bonds, and other assets to grow your wealth.' },
]

const ACCOUNTS_DB_KEY = 'zynpay_accounts_db';
const TRANSACTIONS_DB_KEY = 'zynpay_transactions_db';


const loadAccounts = (userId: string | undefined): Account[] => {
    if (typeof window === 'undefined' || !userId) return [];
    try {
        const accountsJson = localStorage.getItem(ACCOUNTS_DB_KEY);
        if (accountsJson) {
            const allAccounts = JSON.parse(accountsJson) as Account[];
            return allAccounts.filter(acc => acc.userId === userId);
        }
    } catch (error) {
        console.error("Failed to load accounts from localStorage", error);
    }
    return [];
}

const saveAccounts = (newAccounts: Account[], userId: string | undefined) => {
    if (typeof window === 'undefined' || !userId) return;
    try {
        const accountsJson = localStorage.getItem(ACCOUNTS_DB_KEY);
        const allAccounts = accountsJson ? JSON.parse(accountsJson) as Account[] : [];
        const otherUserAccounts = allAccounts.filter(acc => acc.userId !== userId);
        const updatedAccounts = [...otherUserAccounts, ...newAccounts];
        localStorage.setItem(ACCOUNTS_DB_KEY, JSON.stringify(updatedAccounts));
    } catch (error) {
        console.error("Failed to save accounts to localStorage", error);
    }
}

const loadTransactions = (): Transaction[] => {
    if (typeof window === 'undefined') return [];
    try {
        const txJson = localStorage.getItem(TRANSACTIONS_DB_KEY);
        if (txJson) {
            // Important: Re-hydrate dates
            return (JSON.parse(txJson) as any[]).map(tx => ({...tx, timestamp: new Date(tx.timestamp)}));
        }
    } catch (error) {
        console.error("Failed to load transactions from localStorage", error);
    }
    return [];
}

const saveTransactions = (transactions: Transaction[]) => {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(TRANSACTIONS_DB_KEY, JSON.stringify(transactions));
    } catch (error) {
        console.error("Failed to save transactions to localStorage", error);
    }
}


export default function AccountsPage() {
    const { user, updateUserBalance, refreshUser } = useAuth();
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [openNewAccountDialog, setOpenNewAccountDialog] = useState(false);
    const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
    const [openTransferDialog, setOpenTransferDialog] = useState(false);
    const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
    const [newAccountType, setNewAccountType] = useState<AccountType>('checking');
    const [newAccountNickname, setNewAccountNickname] = useState('');
    const [transferAmount, setTransferAmount] = useState('');
    const { toast } = useToast();

    const selectedAccount = accounts.find(acc => acc.id === selectedAccountId) || null;

    useEffect(() => {
        if(user) {
            const userAccounts = loadAccounts(user.id);
            const allTxs = loadTransactions();
            setAccounts(userAccounts);
            setTransactions(allTxs);
        }
    }, [user]);

    useEffect(() => {
        if(user) {
            saveAccounts(accounts, user.id);
        }
    }, [accounts, user]);
    
    useEffect(() => {
        saveTransactions(transactions);
    }, [transactions]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    };

    const handleOpenAccount = () => {
        if (!user) return;
        if (!newAccountNickname) {
            toast({ variant: 'destructive', title: 'Nickname required', description: 'Please give your new account a nickname.' });
            return;
        }

        const newAccount: Account = {
            id: `acc-${Date.now()}`,
            userId: user.id,
            type: newAccountType,
            accountNumber: `**** **** **** ${Math.floor(1000 + Math.random() * 9000)}`,
            balance: 0,
            nickname: newAccountNickname,
        };

        setAccounts(prev => [...prev, newAccount]);
        
        const accountTypeLabel = accountTypes.find(at => at.value === newAccountType)?.label || 'new';

        toast({
            title: 'Account Created!',
            description: `Your new ${accountTypeLabel} account "${newAccountNickname}" is ready.`
        });

        setNewAccountNickname('');
        setNewAccountType('checking');
        setOpenNewAccountDialog(false);
    };

    const handleDetailsClick = (account: Account) => {
        setSelectedAccountId(account.id);
        setOpenDetailsDialog(true);
    };

    const handleTransferClick = (account: Account) => {
        setSelectedAccountId(account.id);
        setTransferAmount('');
        setOpenTransferDialog(true);
    }

    const handleAccountTransfer = (direction: 'deposit' | 'withdraw') => {
        if (!user || !selectedAccount) return;

        const amount = parseFloat(transferAmount);
        if (isNaN(amount) || amount <= 0) {
            toast({ variant: 'destructive', title: 'Invalid Amount', description: 'Please enter a positive number.'});
            return;
        }

        toast({
            title: 'Frontend Only',
            description: 'This is a frontend demonstration. No real transaction has occurred.',
        });
        
        setOpenTransferDialog(false);
        setTransferAmount('');
    }

    const getAccountIcon = (type: AccountType) => {
       return accountTypes.find(at => at.value === type)?.icon || <Briefcase className="h-8 w-8 text-primary" />;
    }

    const getAccountLabel = (type: AccountType) => {
        return accountTypes.find(at => at.value === type)?.label || 'Account';
    }

    const accountTransactions = selectedAccount 
        ? transactions.filter(tx => tx.accountId === selectedAccount.id).sort((a,b) => b.timestamp.getTime() - a.timestamp.getTime())
        : [];

    return (
        <MainLayout>
            <PageHeader title="Accounts" description="Manage your checking, savings, and investment accounts.">
                <Dialog open={openNewAccountDialog} onOpenChange={setOpenNewAccountDialog}>
                    <DialogTrigger asChild>
                        <Button>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Open New Account
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Open a New Account</DialogTitle>
                            <DialogDescription>Choose an account type and give it a nickname to get started.</DialogDescription>
                        </DialogHeader>
                        <TooltipProvider>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <div className="flex items-center gap-2">
                                    <Label>Account Type</Label>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help"/>
                                        </TooltipTrigger>
                                        <TooltipContent side="right" className="max-w-xs">
                                            <p className="font-bold mb-2">Account Types:</p>
                                            <ul className="list-disc pl-4 space-y-1 text-sm">
                                                {accountTypes.map(at => (
                                                    <li key={at.value}>
                                                        <span className="font-semibold">{at.label}:</span> {at.description}
                                                    </li>
                                                ))}
                                            </ul>
                                        </TooltipContent>
                                    </Tooltip>
                                </div>
                                <Select value={newAccountType} onValueChange={(value: AccountType) => setNewAccountType(value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select account type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {accountTypes.map(at => (
                                            <SelectItem key={at.value} value={at.value}>{at.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="nickname">Account Nickname</Label>
                                <Input 
                                    id="nickname" 
                                    placeholder="e.g., Daily Spending, Vacation Fund" 
                                    value={newAccountNickname}
                                    onChange={(e) => setNewAccountNickname(e.target.value)}
                                />
                            </div>
                        </div>
                        </TooltipProvider>
                        <DialogFooter>
                            <Button onClick={handleOpenAccount}>Create Account</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </PageHeader>
            <div className="grid gap-6 md:grid-cols-2">
                {accounts.map(account => (
                    <Card key={account.id}>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div className="flex items-center gap-4">
                                {getAccountIcon(account.type)}
                                <div>
                                    <CardTitle className="text-xl">{account.nickname}</CardTitle>
                                    <CardDescription>{getAccountLabel(account.type)} Account</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-primary">{formatCurrency(account.balance)}</div>
                            <p className="text-sm text-muted-foreground">{account.accountNumber}</p>
                        </CardContent>
                        <CardFooter className="gap-2">
                            <Button variant="outline" className="w-full" onClick={() => handleTransferClick(account)}>
                                <ArrowRightLeft className="mr-2 h-4 w-4"/>
                                Transfer
                            </Button>
                            <Button variant="outline" className="w-full" onClick={() => handleDetailsClick(account)}>Details</Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
             {accounts.length === 0 && (
                <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg">
                    <h3 className="text-xl font-semibold">No accounts yet</h3>
                    <p className="text-muted-foreground mb-4">Open a new account to get started with ZynPay.</p>
                    <Button onClick={() => setOpenNewAccountDialog(true)}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Open New Account
                    </Button>
                </div>
            )}
             <Dialog open={openDetailsDialog} onOpenChange={setOpenDetailsDialog}>
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>Account Details</DialogTitle>
                         {selectedAccount && <DialogDescription>Transaction history for {selectedAccount.nickname}</DialogDescription>}
                    </DialogHeader>
                    {selectedAccount && (
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                                <div>
                                    <div className="text-muted-foreground">Nickname</div>
                                    <div>{selectedAccount.nickname}</div>
                                </div>
                                <div>
                                    <div className="text-muted-foreground">Account Type</div>
                                    <div>{getAccountLabel(selectedAccount.type)}</div>
                                </div>
                                <div>
                                    <div className="text-muted-foreground">Account No.</div>
                                    <div>{selectedAccount.accountNumber}</div>
                                </div>
                                <div>
                                    <div className="text-muted-foreground">Balance</div>
                                    <div className="font-bold text-base">{formatCurrency(selectedAccount.balance)}</div>
                                </div>
                            </div>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Transaction History</CardTitle>
                                </CardHeader>
                                <CardContent className="max-h-96 overflow-y-auto">
                                    {accountTransactions.length > 0 ? (
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Description</TableHead>
                                                    <TableHead>Date</TableHead>
                                                    <TableHead className="text-right">Amount</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {accountTransactions.map(tx => (
                                                    <TableRow key={tx.id}>
                                                        <TableCell>
                                                             <div className="flex items-center gap-3">
                                                                <div className={`flex items-center justify-center h-8 w-8 rounded-full ${tx.amount > 0 ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                                                                {tx.amount > 0 ? <ArrowDownLeft className="h-4 w-4 text-green-400" /> : <ArrowUpRight className="h-4 w-4 text-red-400" />}
                                                                </div>
                                                                <div className="font-medium">{tx.description}</div>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>{format(tx.timestamp, 'MMM d, yyyy')}</TableCell>
                                                        <TableCell className={`text-right font-semibold ${tx.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                                            {formatCurrency(tx.amount)}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    ) : (
                                        <p className="text-muted-foreground text-center py-4">No transactions for this account yet.</p>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    )}
                    <DialogFooter>
                        <Button onClick={() => setOpenDetailsDialog(false)}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={openTransferDialog} onOpenChange={setOpenTransferDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Transfer Funds</DialogTitle>
                        <DialogDescription>Move money between your main balance and your "{selectedAccount?.nickname}" account.</DialogDescription>
                    </DialogHeader>
                    {selectedAccount && (
                         <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4 text-center">
                                <div>
                                    <Label>Main Balance</Label>
                                    <p className="font-bold text-lg">{formatCurrency(user?.balance || 0)}</p>
                                </div>
                                <div>
                                    <Label>{selectedAccount.nickname}</Label>
                                    <p className="font-bold text-lg">{formatCurrency(selectedAccount.balance)}</p>
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="transfer-amount">Amount</Label>
                                <Input 
                                    id="transfer-amount" 
                                    type="number"
                                    placeholder="0.00" 
                                    value={transferAmount}
                                    onChange={(e) => setTransferAmount(e.target.value)}
                                />
                            </div>
                        </div>
                    )}
                    <DialogFooter className="gap-2 sm:gap-0 flex-col sm:flex-row">
                        <Button variant="outline" onClick={() => handleAccountTransfer('withdraw')} className="w-full">
                            <ArrowUp className="mr-2 h-4 w-4" /> Withdraw to Main
                        </Button>
                        <Button onClick={() => handleAccountTransfer('deposit')} className="w-full">
                            <ArrowDown className="mr-2 h-4 w-4" /> Deposit to Account
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </MainLayout>
    )
}
