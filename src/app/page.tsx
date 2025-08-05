'use client';

import { MainLayout } from '@/components/main-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { transactions, savingsGoals } from '@/lib/mock-data';
import { ArrowDownLeft, ArrowUpRight, Banknote, DollarSign, Send } from 'lucide-react';
import Link from 'next/link';
import { PageHeader } from '@/components/page-header';
import { useAuth } from '@/context/auth-context';
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export default function DashboardPage() {
  const { user, updateUserBalance, refreshUser } = useAuth();
  const [depositOpen, setDepositOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const { toast } = useToast();

  const recentTransactions = transactions.slice(0, 5);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const handleTransaction = (type: 'deposit' | 'withdraw') => {
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
        toast({ variant: 'destructive', title: 'Invalid Amount', description: 'Please enter a positive number.' });
        return;
    }

    if (type === 'withdraw' && user && numericAmount > user.balance) {
        toast({ variant: 'destructive', title: 'Insufficient Funds', description: 'You cannot withdraw more than your current balance.' });
        return;
    }
    
    const change = type === 'deposit' ? numericAmount : -numericAmount;

    if (user) {
        updateUserBalance(user.id, change);
        refreshUser();
        toast({ title: 'Success', description: `Successfully ${type === 'deposit' ? 'deposited' : 'withdrew'} ${formatCurrency(numericAmount)}.`});
    }

    setAmount('');
    setDepositOpen(false);
    setWithdrawOpen(false);
  }


  if (!user) {
    return <MainLayout><p>Loading...</p></MainLayout>
  }

  return (
    <MainLayout>
      <PageHeader title="Dashboard" description="Your financial command center." />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Overview</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-6">
                <div className="grid grid-cols-1 gap-6">
                    <div>
                        <Card className="bg-gradient-to-br from-primary/10 to-background mb-4">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-primary drop-shadow-primary">{formatCurrency(user.balance)}</div>
                                <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                            </CardContent>
                        </Card>
                        <div className="grid grid-cols-3 gap-2">
                            <Link href="/transfer" passHref>
                                <Button variant="outline" className="w-full h-full flex-col gap-2 p-4">
                                    <Send className="h-6 w-6 text-accent drop-shadow-accent"/>
                                    <span>Send</span>
                                </Button>
                            </Link>

                            <Dialog open={depositOpen} onOpenChange={setDepositOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="outline" className="w-full h-full flex-col gap-2 p-4">
                                        <ArrowDownLeft className="h-6 w-6 text-accent drop-shadow-accent"/>
                                        <span>Deposit</span>
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                        <DialogTitle>Deposit Funds</DialogTitle>
                                        <DialogDescription>Enter the amount you would like to deposit into your account.</DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="deposit-amount" className="text-right">Amount</Label>
                                            <Input id="deposit-amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="col-span-3" placeholder="$0.00"/>
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button type="submit" onClick={() => handleTransaction('deposit')}>Confirm Deposit</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>

                             <Dialog open={withdrawOpen} onOpenChange={setWithdrawOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="outline" className="w-full h-full flex-col gap-2 p-4">
                                        <ArrowUpRight className="h-6 w-6 text-accent drop-shadow-accent"/>
                                        <span>Withdraw</span>
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                        <DialogTitle>Withdraw Funds</DialogTitle>
                                        <DialogDescription>Enter the amount you would like to withdraw from your account.</DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="withdraw-amount" className="text-right">Amount</Label>
                                            <Input id="withdraw-amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="col-span-3" placeholder="$0.00"/>
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button type="submit" variant="destructive" onClick={() => handleTransaction('withdraw')}>Confirm Withdraw</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">Savings Goals</h3>
                  <div className="grid gap-4">
                    {savingsGoals.map(goal => (
                      <div key={goal.id}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">{goal.name}</span>
                          <span className="text-sm text-muted-foreground">{formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}</span>
                        </div>
                        <Progress value={(goal.currentAmount / goal.targetAmount) * 100} className="h-2"/>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
        </div>

        <div className="lg:col-span-1">
            <Card>
            <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Your latest financial movements.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                <TableBody>
                    {recentTransactions.map(tx => (
                    <TableRow key={tx.id}>
                        <TableCell>
                        <div className="flex items-center gap-3">
                            <div className={`flex items-center justify-center h-8 w-8 rounded-full ${tx.amount > 0 ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                            {tx.amount > 0 ? <ArrowDownLeft className="h-4 w-4 text-green-400" /> : <ArrowUpRight className="h-4 w-4 text-red-400" />}
                            </div>
                            <div>
                                <div className="font-medium">{tx.description}</div>
                                <div className="text-sm text-muted-foreground">{tx.category}</div>
                            </div>
                        </div>
                        </TableCell>
                        <TableCell className={`text-right font-semibold ${tx.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>{formatCurrency(tx.amount)}</TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            </CardContent>
            </Card>
        </div>
      </div>
    </MainLayout>
  );
}
