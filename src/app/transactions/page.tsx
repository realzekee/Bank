'use client';

import { MainLayout } from '@/components/main-layout';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { transactions } from '@/lib/mock-data';
import { ArrowDownLeft, ArrowUpRight, Download, Filter } from 'lucide-react';
import { format } from 'date-fns';

export default function TransactionsPage() {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    };

    return (
        <MainLayout>
            <PageHeader title="Transactions" description="A complete record of your financial activities.">
                <div className="flex gap-2">
                    <Button variant="outline"><Filter className="mr-2 h-4 w-4"/> Filter</Button>
                    <Button><Download className="mr-2 h-4 w-4"/> Export</Button>
                </div>
            </PageHeader>

            <Card>
                <CardContent className="mt-6">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Description</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {transactions.map(tx => (
                                <TableRow key={tx.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className={`flex items-center justify-center h-10 w-10 rounded-full ${tx.amount > 0 ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                                                {tx.amount > 0 ? <ArrowDownLeft className="h-5 w-5 text-green-400" /> : <ArrowUpRight className="h-5 w-5 text-red-400" />}
                                            </div>
                                            <div className="font-medium">{tx.description}</div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{tx.category}</TableCell>
                                    <TableCell>{format(tx.timestamp, 'MMM d, yyyy')}</TableCell>
                                    <TableCell className={`text-right font-semibold ${tx.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                        {formatCurrency(tx.amount)}
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
