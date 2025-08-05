
'use client';

import { MainLayout } from '@/components/main-layout';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { currencies, conversionRates, MOCK_TAX_RATE, users as mockUsers, transactions, banks, eWallets, Account } from '@/lib/mock-data';
import { Send, ArrowRight, UserPlus, Landmark, Wallet } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/auth-context';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const ACCOUNTS_DB_KEY = 'zynpay_accounts_db';

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


export default function TransferPage() {
    const { toast } = useToast();
    const { user, updateUserBalance, refreshUser } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    
    // Form State
    const [fromAccount, setFromAccount] = useState<string>('main');
    const [recipient, setRecipient] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [fromCurrency, setFromCurrency] = useState('USD');
    const [toCurrency, setToCurrency] = useState('EUR');
    
    // UI State
    const [activeTab, setActiveTab] = useState('domestic');
    const [searchTerm, setSearchTerm] = useState('');
    const [externalTransferType, setExternalTransferType] = useState('bank');
    
    // Data
    const [accounts, setAccounts] = useState<Account[]>([]);

    useEffect(() => {
        if(user) {
            setAccounts(loadAccounts(user.id));
        }
    }, [user]);


    const recentContacts = useMemo(() => {
        if (!user) return [];
        const userTransactions = transactions.filter(t => t.userId === user.id && t.amount < 0 && t.description.startsWith('Sent to @'));
        const recipientUsernames = [...new Set(userTransactions.map(t => t.description.split('@')[1]))];
        return mockUsers.filter(u => recipientUsernames.includes(u.username)).slice(0, 5);
    }, [user]);

    const filteredUsers = useMemo(() => {
        if (!searchTerm) return [];
        return mockUsers.filter(u => 
            u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.email.toLowerCase().includes(searchTerm.toLowerCase())
        ).slice(0, 10);
    }, [searchTerm]);

    const handleQuickContactClick = (username: string) => {
        setRecipient(username);
    };

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (/^\d*\.?\d*$/.test(value)) {
            setAmount(value);
        }
    };

    const { convertedAmount, tax, total, rate } = useMemo(() => {
        const numericAmount = parseFloat(amount);
        if (isNaN(numericAmount) || numericAmount <= 0) {
            return { convertedAmount: 0, tax: 0, total: 0, rate: 0 };
        }

        if (activeTab === 'domestic' || activeTab === 'external') {
            return { convertedAmount: numericAmount, tax: 0, total: numericAmount, rate: 1 };
        }

        const conversionRate = (conversionRates as any)[fromCurrency]?.[toCurrency] ?? 1;
        const converted = numericAmount * conversionRate;
        const calculatedTax = converted * MOCK_TAX_RATE;
        
        return {
            convertedAmount: converted,
            tax: calculatedTax,
            total: converted + calculatedTax,
            rate: conversionRate
        };
    }, [amount, fromCurrency, toCurrency, activeTab]);

    const formatCurrency = (value: number, currencyCode: string) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currencyCode,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(value);
    }

    const clearForm = () => {
        setRecipient('');
        setAmount('');
        setCategory('');
        setDescription('');
        setFromAccount('main');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const numericAmount = parseFloat(amount);
        if (!user || isNaN(numericAmount) || numericAmount <= 0) {
            toast({ variant: 'destructive', title: 'Invalid Amount' });
            setIsLoading(false);
            return;
        }

        const sourceAccount = fromAccount === 'main' 
            ? { id: 'main', balance: user.balance } 
            : accounts.find(acc => acc.id === fromAccount);

        if (!sourceAccount || sourceAccount.balance < numericAmount) {
            toast({ variant: 'destructive', title: 'Insufficient Funds' });
            setIsLoading(false);
            return;
        }

        // Handle fund deduction
        if (fromAccount === 'main') {
            updateUserBalance(user.id, -numericAmount);
        } else {
            const updatedAccounts = accounts.map(acc => 
                acc.id === fromAccount ? { ...acc, balance: acc.balance - numericAmount } : acc
            );
            setAccounts(updatedAccounts);
            saveAccounts(updatedAccounts, user.id);
        }

        if (activeTab === 'domestic' || activeTab === 'international') {
            const recipientUser = mockUsers.find(u => u.username === recipient || u.email === recipient);
            if (!recipientUser) {
                toast({ variant: 'destructive', title: 'Recipient not found', description: 'Please check the username or email.' });
                // Rollback deduction if recipient not found
                if (fromAccount === 'main') updateUserBalance(user.id, numericAmount); else {
                    const rolledBackAccounts = accounts.map(acc => acc.id === fromAccount ? { ...acc, balance: acc.balance + numericAmount } : acc);
                    setAccounts(rolledBackAccounts);
                    saveAccounts(rolledBackAccounts, user.id);
                }
                setIsLoading(false);
                return;
            }
             // Simulate transaction
            setTimeout(() => {
                // Add to recipient
                const recipientGets = activeTab === 'international' ? convertedAmount : numericAmount;
                updateUserBalance(recipientUser.id, recipientGets);

                const toastDescription = activeTab === 'international'
                    ? `You sent ${formatCurrency(numericAmount, fromCurrency)}. Recipient gets ${formatCurrency(convertedAmount, toCurrency)}.`
                    : `You sent ${formatCurrency(numericAmount, 'USD')} to ${recipientUser.username}.`;

                toast({
                    title: "Transfer Sent!",
                    description: toastDescription,
                });
                setIsLoading(false);
                clearForm();
                refreshUser();
            }, 1500);
        } else { // External transfer
             setTimeout(() => {
                 toast({
                    title: "External Transfer Initiated!",
                    description: `Sent ${formatCurrency(numericAmount, 'USD')} to the specified ${externalTransferType}.`,
                });
                setIsLoading(false);
                clearForm();
                refreshUser();
            }, 1500);
        }
    }
    
    return (
        <MainLayout>
            <PageHeader title="Send Money" description="Transfer funds to ZynPay users, banks, or e-wallets." />

            <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="domestic">Domestic</TabsTrigger>
                            <TabsTrigger value="international">International</TabsTrigger>
                            <TabsTrigger value="external">External</TabsTrigger>
                        </TabsList>
                        <form onSubmit={handleSubmit}>
                        <Card className="rounded-t-none">
                            <CardHeader>
                                <CardTitle>
                                    {
                                    activeTab === 'domestic' ? 'New Domestic Transfer' 
                                    : activeTab === 'international' ? 'New International Transfer'
                                    : 'New External Transfer'
                                    }
                                </CardTitle>
                                <CardDescription>
                                    {
                                    activeTab === 'domestic' 
                                        ? "Send money to anyone within the country."
                                        : activeTab === 'international' 
                                        ? "Send money to anyone, anywhere, with automatic currency conversion."
                                        : "Send money to external bank accounts or e-wallets."
                                    }
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-6">
                                <TabsContent value="domestic" className="m-0 p-0 space-y-6">
                                     <div className="grid gap-2">
                                        <Label htmlFor="from-account">From Account</Label>
                                        <Select value={fromAccount} onValueChange={setFromAccount}>
                                            <SelectTrigger id="from-account">
                                                <SelectValue placeholder="Select account" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="main">
                                                    Main Balance ({formatCurrency(user?.balance || 0, 'USD')})
                                                </SelectItem>
                                                {accounts.map(acc => (
                                                    <SelectItem key={acc.id} value={acc.id}>
                                                        {acc.nickname} ({formatCurrency(acc.balance, 'USD')})
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="recipient">Recipient's Username or Email</Label>
                                        <Input id="recipient" placeholder="@username or user@example.com" required value={recipient} onChange={(e) => setRecipient(e.target.value)} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="amount-domestic">Amount (USD)</Label>
                                        <Input id="amount-domestic" type="text" placeholder="0.00" required value={amount} onChange={handleAmountChange} />
                                    </div>
                                </TabsContent>

                                <TabsContent value="international" className="m-0 p-0 space-y-6">
                                    <div className="grid gap-2">
                                        <Label htmlFor="recipient-international">Recipient's Username or Email</Label>
                                        <Input id="recipient-international" placeholder="@username or user@example.com" required value={recipient} onChange={(e) => setRecipient(e.target.value)} />
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-6 items-end">
                                        <div className="grid gap-2">
                                            <Label>You Send</Label>
                                            <div className="flex gap-2">
                                                <Select value={fromCurrency} onValueChange={setFromCurrency}>
                                                    <SelectTrigger className="w-32">
                                                        <SelectValue placeholder="From" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {currencies.map(c => <SelectItem key={c.code} value={c.code}>{c.code}</SelectItem>)}
                                                    </SelectContent>
                                                </Select>
                                                <Input id="amount-international" type="text" placeholder="0.00" required value={amount} onChange={handleAmountChange} />
                                            </div>
                                        </div>
                                        <div className="grid gap-2">
                                            <Label>Recipient Gets</Label>
                                            <div className="flex gap-2 items-center">
                                                <ArrowRight className="h-5 w-5 text-muted-foreground"/>
                                                <Select value={toCurrency} onValueChange={setToCurrency}>
                                                    <SelectTrigger className="w-32">
                                                        <SelectValue placeholder="To" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {currencies.map(c => <SelectItem key={c.code} value={c.code}>{c.code}</SelectItem>)}
                                                    </SelectContent>
                                                </Select>
                                                <Input readOnly value={convertedAmount > 0 ? convertedAmount.toFixed(2) : ''} placeholder="0.00" className="bg-muted"/>
                                            </div>
                                        </div>
                                    </div>
                                
                                    {rate > 0 && amount && (
                                        <Card className="bg-muted/50">
                                            <CardContent className="pt-6 text-sm grid gap-2">
                                                 <div className="flex justify-between">
                                                    <span className="text-muted-foreground">From Account</span>
                                                    <span>Main Balance</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Exchange Rate</span>
                                                    <span>1 {fromCurrency} = {rate.toFixed(4)} {toCurrency}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Tax (1%)</span>
                                                    <span>{formatCurrency(tax, toCurrency)}</span>
                                                </div>
                                                <div className="flex justify-between font-bold">
                                                    <span >Total Recipient Receives</span>
                                                    <span>{formatCurrency(convertedAmount, toCurrency)}</span>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )}
                                </TabsContent>

                                <TabsContent value="external" className="m-0 p-0 space-y-6">
                                     <div className="grid gap-2">
                                        <Label htmlFor="from-account-external">From Account</Label>
                                        <Select value={fromAccount} onValueChange={setFromAccount}>
                                            <SelectTrigger id="from-account-external">
                                                <SelectValue placeholder="Select account" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="main">
                                                    Main Balance ({formatCurrency(user?.balance || 0, 'USD')})
                                                </SelectItem>
                                                {accounts.map(acc => (
                                                    <SelectItem key={acc.id} value={acc.id}>
                                                        {acc.nickname} ({formatCurrency(acc.balance, 'USD')})
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <Tabs value={externalTransferType} onValueChange={setExternalTransferType} className="w-full">
                                        <TabsList className="grid w-full grid-cols-2">
                                            <TabsTrigger value="bank"><Landmark className="mr-2 h-4 w-4"/>Bank Transfer</TabsTrigger>
                                            <TabsTrigger value="ewallet"><Wallet className="mr-2 h-4 w-4"/>E-Wallet</TabsTrigger>
                                        </TabsList>
                                        <TabsContent value="bank" className="pt-6 space-y-4">
                                            <div className="grid gap-2">
                                                <Label htmlFor="bank">Bank</Label>
                                                <Select>
                                                    <SelectTrigger id="bank">
                                                        <SelectValue placeholder="Select a bank" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {banks.map(b => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="account-number">Account Number</Label>
                                                <Input id="account-number" placeholder="Enter account number" required />
                                            </div>
                                             <div className="grid gap-2">
                                                <Label htmlFor="routing-number">Routing Number</Label>
                                                <Input id="routing-number" placeholder="Enter routing number" required />
                                            </div>
                                        </TabsContent>
                                        <TabsContent value="ewallet" className="pt-6 space-y-4">
                                            <div className="grid gap-2">
                                                <Label htmlFor="ewallet-provider">E-Wallet</Label>
                                                <Select>
                                                    <SelectTrigger id="ewallet-provider">
                                                        <SelectValue placeholder="Select an e-wallet" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {eWallets.map(ew => <SelectItem key={ew.id} value={ew.id}>{ew.name}</SelectItem>)}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="ewallet-id">Account ID or Phone</Label>
                                                <Input id="ewallet-id" placeholder="Enter e-wallet identifier" required />
                                            </div>
                                        </TabsContent>
                                    </Tabs>
                                    <div className="grid gap-2">
                                        <Label htmlFor="amount-external">Amount (USD)</Label>
                                        <Input id="amount-external" type="text" placeholder="0.00" required value={amount} onChange={handleAmountChange} />
                                    </div>
                                </TabsContent>
                                
                                {(activeTab === 'domestic' || activeTab === 'international' || activeTab === 'external') && (
                                    <>
                                        {activeTab !== 'international' && (
                                            <>
                                            <div className="grid gap-2">
                                                <Label htmlFor="category">Category</Label>
                                                <Input id="category" placeholder="e.g., Rent, Food, Fun" value={category} onChange={(e) => setCategory(e.target.value)} />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="description">Note (Optional)</Label>
                                                <Textarea id="description" placeholder="For the cyber-sushi we had..." value={description} onChange={(e) => setDescription(e.target.value)} />
                                            </div>
                                            </>
                                        )}
                                        <Button type="submit" className="w-full md:w-auto" disabled={isLoading || parseFloat(amount) <= 0}>
                                            <Send className="mr-2 h-4 w-4"/>
                                            {isLoading ? 'Sending...' : `Send ${formatCurrency(parseFloat(amount) || 0, activeTab === 'international' ? fromCurrency : 'USD')}`}
                                        </Button>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                        </form>
                    </Tabs>
                </div>
                <div className="md:col-span-1">
                    <Card className="bg-secondary/50">
                        <CardHeader className='flex-row items-center justify-between'>
                            <CardTitle>Quick Contacts</CardTitle>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <UserPlus className="h-5 w-5" />
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Add Contact</DialogTitle>
                                    </DialogHeader>
                                    <Input 
                                        placeholder="Search by username or email..." 
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                    <div className="mt-4 space-y-2 max-h-60 overflow-y-auto">
                                        {filteredUsers.map(u => (
                                            <div key={u.id} className="flex items-center justify-between p-2 rounded-md hover:bg-muted">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-9 w-9 border-2 border-primary/50">
                                                        <AvatarImage src={`https://placehold.co/100x100.png`} alt={u.username} data-ai-hint="avatar user"/>
                                                        <AvatarFallback>{u.username.charAt(0).toUpperCase()}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <div className="font-medium">{u.username}</div>
                                                        <div className="text-sm text-muted-foreground">{u.email}</div>
                                                    </div>
                                                </div>
                                                <Button size="sm" onClick={() => handleQuickContactClick(u.username)}>Add</Button>
                                            </div>
                                        ))}
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentContacts.length > 0 ? (
                                    recentContacts.map(contact => (
                                        <button key={contact.id} className="w-full text-left" onClick={() => handleQuickContactClick(contact.username)}>
                                            <div className="flex items-center gap-3 p-2 -m-2 rounded-lg hover:bg-muted/50 transition-colors">
                                                <Avatar className="h-9 w-9">
                                                    <AvatarImage src={`https://placehold.co/100x100.png`} alt={contact.username} data-ai-hint="avatar user" />
                                                    <AvatarFallback>{contact.username.charAt(0).toUpperCase()}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-medium">{contact.username}</p>
                                                    <p className="text-sm text-muted-foreground">{contact.email}</p>
                                                </div>
                                            </div>
                                        </button>
                                    ))
                                ) : (
                                    <p className="text-sm text-muted-foreground">No recent contacts. Send money to add them here.</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </MainLayout>
    )
}
